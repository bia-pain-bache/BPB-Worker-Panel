import { getConfigAddresses, extractWireguardParams, generateRemark, randomUpperCase, getRandomPath, isIPv6 } from './helpers';
import { initializeParams, userID, trojanPassword, hostName, defaultHttpsPorts } from "../helpers/init";
import { getDataset } from '../kv/handlers';
import { renderErrorPage } from '../pages/errorPage';
import { isDomain } from '../helpers/helpers';

async function buildClashDNS (proxySettings, isChain, isWarp) {
    const { 
        remoteDNS, 
        localDNS, 
        vlessTrojanFakeDNS,
        outProxyParams,
        enableIPv6, 
        warpFakeDNS,
        warpEnableIPv6,
        bypassIran, 
        bypassChina, 
        bypassRussia 
    } = proxySettings;

    const warpRemoteDNS = warpEnableIPv6 
        ? ["1.1.1.1", "1.0.0.1", "2606:4700:4700::1111", "2606:4700:4700::1001"] 
        : ["1.1.1.1", "1.0.0.1"];
    const isFakeDNS = (vlessTrojanFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    const isIPv6 = (enableIPv6 && !isWarp) || (warpEnableIPv6 && isWarp);
    const isBypass = bypassIran || bypassChina || bypassRussia;
    const bypassRules = [
        { rule: bypassIran, geosite: "category-ir" },
        { rule: bypassChina, geosite: "cn" },
        { rule: bypassRussia, geosite: "category-ru" }
    ];

    let dns = {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": isIPv6,
        "respect-rules": true,
        "use-hosts": true,
        "use-system-hosts": false,
        "nameserver": isWarp ? warpRemoteDNS : [remoteDNS],
        "proxy-server-nameserver": [localDNS]
    };

    if (isChain && !isWarp) {
        const chainOutboundServer = JSON.parse(outProxyParams).server;
        if (isDomain(chainOutboundServer)) dns["nameserver-policy"] = {
            [chainOutboundServer]: remoteDNS
        };    
    } 

    if (isBypass) { 
        let geosites = [];
        bypassRules.forEach(({ rule, geosite }) => {
            rule && geosites.push(geosite)
        });

        dns["nameserver-policy"] = {
            ...dns["nameserver-policy"],
            [`geosite:${geosites.join(',')}`]: [localDNS]
        };
    }

    if (isFakeDNS) Object.assign(dns, {
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": ["geosite:private"]
    });

    return dns;
}

function buildClashRoutingRules (proxySettings, isChain, isWarp) {
    const {
        remoteDNS,
        localDNS,
        warpEnableIPv6,
        bypassLAN, 
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn, 
        blockUDP443 
    } = proxySettings;

    const url = new URL(remoteDNS);
    const remoteDNSServer = url.hostname;
    const isBypass = bypassIran || bypassChina || bypassLAN || bypassRussia;
    const isBlock = blockAds || blockPorn;
    let geositeDirectRules = [], geoipDirectRules = [], geositeBlockRules = [];
    const geoRules = [
        { rule: bypassLAN, type: 'direct', geosite: "private", geoip: "LAN" },
        { rule: bypassIran, type: 'direct', geosite: "category-ir", geoip: "ir" },
        { rule: bypassChina, type: 'direct', geosite: "cn", geoip: "cn" },
        { rule: bypassRussia, type: 'direct', geosite: "category-ru", geoip: "ru" },
        { rule: blockAds, type: 'block', geosite: "category-ads-all" },
        { rule: blockAds, type: 'block', geosite: "category-ads-ir" },
        { rule: blockPorn, type: 'block', geosite: "category-porn" }
    ];

    if (isBypass || isBlock) {
        geoRules.forEach(({ rule, type, geosite, geoip }) => {
            if (rule) {
                if (type === 'direct') {
                    geositeDirectRules.push(`GEOSITE,${geosite},DIRECT`);
                    geoipDirectRules.push(`GEOIP,${geoip},DIRECT,no-resolve`);
                } else {
                    geositeBlockRules.push(`GEOSITE,${geosite},REJECT`);
                }
            }
        });
    }
    
    let rules = [
        `AND,((IP-CIDR,${localDNS}/32),(NETWORK,udp),(DST-PORT,53)),DIRECT`,
        ...geositeDirectRules, 
        ...geoipDirectRules, 
        ...geositeBlockRules
    ];

    blockUDP443 && rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
    if (isChain) {
        isWarp && !warpEnableIPv6 && rules.push("OR,((IP-CIDR,1.1.1.1/32),(IP-CIDR,1.0.0.1/32)),💦 Warp - Best Ping 🚀");
        isWarp && warpEnableIPv6 && rules.push("OR,((IP-CIDR,1.1.1.1/32),(IP-CIDR,1.0.0.1/32),(IP-CIDR6,2606:4700:4700::1111/128),(IP-CIDR6,2606:4700:4700::1001/128)),💦 Warp - Best Ping 🚀");
        !isWarp && rules.push(`AND,((${isDomain(remoteDNSServer) ? 'DOMAIN' : 'IP-CIDR'},${isDomain(remoteDNSServer) ? remoteDNSServer : `${remoteDNSServer}/32`}),(NETWORK,tcp)),proxy-1`);
    }
    rules.push("MATCH,✅ Selector");
    return rules;
}

function buildClashVLESSOutbound (remark, address, port, host, sni, path, allowInsecure) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    let outbound = {
        "name": remark,
        "type": "vless",
        "server": addr,
        "port": +port,
        "uuid": userID,
        "tls": tls,
        "network": "ws",
        "udp": true,
        "ws-opts": {
            "path": path,
            "headers": { "host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        }
    };

    if (tls) {
        Object.assign(outbound, {
            "servername": sni,
            "alpn": ["h2", "http/1.1"],
            "client-fingerprint": "random",
            "skip-cert-verify": allowInsecure
        });
    }

    return outbound;
}

function buildClashTrojanOutbound (remark, address, port, host, sni, path, allowInsecure) {
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    return {
        "name": remark,
        "type": "trojan",
        "server": addr,
        "port": +port,
        "password": trojanPassword,
        "network": "ws",
        "udp": true,
        "ws-opts": {
            "path": path,
            "headers": { "host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        },
        "sni": sni,
        "alpn": ["h2", "http/1.1"],
        "client-fingerprint": "random",
        "skip-cert-verify": allowInsecure
    };
}

function buildClashWarpOutbound (warpConfigs, remark, endpoint, chain) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];
    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, chain);

    return {
        "name": remark,
        "type": "wireguard",
        "ip": "172.16.0.2/32",
        "ipv6": warpIPv6,
        "private-key": privateKey,
        "server": endpointServer,
        "port": endpointPort,
        "public-key": publicKey,
        "allowed-ips": ["0.0.0.0/0", "::/0"],
        "reserved": reserved,
        "udp": true,
        "mtu": 1280,
        "dialer-proxy": chain
    };
}

function buildClashChainOutbound(chainProxyParams) {
    if (["socks", "http"].includes(chainProxyParams.protocol)) {
        const { protocol, server, port, user, pass } = chainProxyParams;
        const proxyType = protocol === 'socks' ? 'socks5' : protocol; 
        return {
            "name": "",
            "type": proxyType,
            "server": server,
            "port": +port,
            "dialer-proxy": "",
            "username": user,
            "password": pass
        };
    }

    const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
    let chainOutbound = {
        "name": "💦 Chain Best Ping 💥",
        "type": "vless",
        "server": server,
        "port": +port,
        "udp": true,
        "uuid": uuid,
        "flow": flow,
        "network": type,
        "dialer-proxy": "💦 Best Ping 💥"
    };

    if (security === 'tls') {
        const tlsAlpns = alpn ? alpn?.split(',') : [];
        Object.assign(chainOutbound, {
            "tls": true,
            "servername": sni,
            "alpn": tlsAlpns,
            "client-fingerprint": fp
        });
    }

    if (security === 'reality') Object.assign(chainOutbound, {
        "tls": true,
        "servername": sni,
        "client-fingerprint": fp,
        "reality-opts": {
            "public-key": pbk,
            "short-id": sid
        }
    });
    
    if (headerType === 'http') {
        const httpPaths = path?.split(',');
        chainOutbound["http-opts"] = {
            "method": "GET",
            "path": httpPaths,
            "headers": {
                "Connection": ["keep-alive"],
                "Content-Type": ["application/octet-stream"]
            }
        };
    }

    if (type === 'ws') {
        const wsPath = path?.split('?ed=')[0];
        const earlyData = +path?.split('?ed=')[1];
        chainOutbound["ws-opts"] = {
            "path": wsPath,
            "headers": {
                "Host": host
            },
            "max-early-data": earlyData,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        };
    }
 
    if (type === 'grpc') chainOutbound["grpc-opts"] = {
        "grpc-service-name": serviceName
    };

    return chainOutbound;
}

export async function getClashWarpConfig(request, env) {
    const { kvNotFound, proxySettings, warpConfigs } = await getDataset(request, env);
    if (kvNotFound) return await renderErrorPage(request, env, 'KV Dataset is not properly set!', null, true);
    const { warpEndpoints } = proxySettings;
    let config = structuredClone(clashConfigTemp);
    config.dns = await buildClashDNS(proxySettings, false, true);
    config.rules = buildClashRoutingRules(proxySettings, true, true);
    const selector = config['proxy-groups'][0];
    const warpUrlTest = config['proxy-groups'][1];
    selector.proxies = ['💦 Warp - Best Ping 🚀', '💦 WoW - Best Ping 🚀'];
    warpUrlTest.name = '💦 Warp - Best Ping 🚀';
    warpUrlTest.interval = +proxySettings.bestWarpInterval;
    config['proxy-groups'].push(structuredClone(warpUrlTest));
    const WoWUrlTest = config['proxy-groups'][2];
    WoWUrlTest.name = '💦 WoW - Best Ping 🚀';
    let warpRemarks = [], WoWRemarks = [];
    
    warpEndpoints.split(',').forEach( (endpoint, index) => {
        const warpRemark = `💦 ${index + 1} - Warp 🇮🇷`;
        const WoWRemark = `💦 ${index + 1} - WoW 🌍`;
        const warpOutbound = buildClashWarpOutbound(warpConfigs, warpRemark, endpoint, '');
        const WoWOutbound = buildClashWarpOutbound(warpConfigs, WoWRemark, endpoint, warpRemark);
        config.proxies.push(WoWOutbound, warpOutbound);
        warpRemarks.push(warpRemark);
        WoWRemarks.push(WoWRemark);
        warpUrlTest.proxies.push(warpRemark);
        WoWUrlTest.proxies.push(WoWRemark);
    });
    
    selector.proxies.push(...warpRemarks, ...WoWRemarks);
    return new Response(JSON.stringify(config, null, 4), { 
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getClashNormalConfig (request, env) {
    await initializeParams(request, env);
    const { kvNotFound, proxySettings } = await getDataset(request, env);
    if (kvNotFound) return await renderErrorPage(request, env, 'KV Dataset is not properly set!', null, true);
    let chainProxy;
    const { 
        resolvedRemoteDNS,
        cleanIPs, 
        proxyIP, 
        ports, 
        vlessConfigs, 
        trojanConfigs, 
        outProxy, 
        outProxyParams,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        enableIPv6
    } = proxySettings; 

    if (outProxy) {
        const proxyParams = JSON.parse(outProxyParams);        
        try {
            chainProxy = buildClashChainOutbound(proxyParams);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxy = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: {}
            }));
        }
    }

    let config = structuredClone(clashConfigTemp);
    if (resolvedRemoteDNS.server) {
        config.hosts = {
            [resolvedRemoteDNS.server]: resolvedRemoteDNS.staticIPs
        }
    } else {
        delete config.hosts;
    }
    const Addresses = await getConfigAddresses(hostName, cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    config.dns = await buildClashDNS(proxySettings, chainProxy, false);
    config.rules = buildClashRoutingRules(proxySettings, chainProxy, false);
    const selector = config['proxy-groups'][0];
    const urlTest = config['proxy-groups'][1];
    selector.proxies = ['💦 Best Ping 💥'];
    urlTest.name = '💦 Best Ping 💥';
    urlTest.interval = +bestVLESSTrojanInterval;
    let proxyIndex = 1, path;
    const protocols = [
        ...(vlessConfigs ? ['VLESS'] : []),
        ...(trojanConfigs ? ['Trojan'] : [])
    ];

    protocols.forEach ( protocol => {
        let protocolIndex = 1;
        ports.forEach ( port => {
            totalAddresses.forEach( addr => {
                let VLESSOutbound, TrojanOutbound;
                const isCustomAddr = customCdnAddresses.includes(addr);
                const configType = isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType).replace(' : ', ' - ');

                if (protocol === 'VLESS') {
                    path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    VLESSOutbound = buildClashVLESSOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port,  
                        host,
                        sni, 
                        path,
                        isCustomAddr
                    );
                    config.proxies.push(VLESSOutbound);
                    selector.proxies.push(remark);
                    urlTest.proxies.push(remark);
                }
                
                if (protocol === 'Trojan' && defaultHttpsPorts.includes(port)) {
                    path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    TrojanOutbound = buildClashTrojanOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port,  
                        host,
                        sni, 
                        path,
                        isCustomAddr
                    );
                    config.proxies.push(TrojanOutbound);
                    selector.proxies.push(remark);
                    urlTest.proxies.push(remark);
                }

                if (chainProxy) {
                    let chain = structuredClone(chainProxy);
                    chain['name'] = remark;
                    chain['dialer-proxy'] = `proxy-${proxyIndex}`;
                    config.proxies.push(chain);
                }

                proxyIndex++;
                protocolIndex++;
            });
        });
    });

    return new Response(JSON.stringify(config, null, 4), { 
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

const clashConfigTemp = {
    "mixed-port": 7890,
    "ipv6": true,
    "allow-lan": true,
    "mode": "rule",
    "log-level": "info",
    "keep-alive-interval": 30,
    "unified-delay": false,
    "geo-auto-update": true,
    "geo-update-interval": 168,
    "external-controller": "127.0.0.1:9090",
    "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
    "external-ui": "ui",
    "external-controller-cors": {
        "allow-origins": [ "*" ],
        "allow-private-network": true
    },
    "profile": {
        "store-selected": true,
        "store-fake-ip": true
    },
    "hosts": {},
    "dns": {},
    "tun": {
        "enable": true,
        "stack": "mixed",
        "auto-route": true,
        "strict-route": true,
        "auto-detect-interface": true,
        "dns-hijack": ["any:53"],
        "mtu": 9000
    },
    "sniffer": {
        "enable": true,
        "force-dns-mapping": true,
        "parse-pure-ip": true,
        "override-destination": false,
        "sniff": {
            "HTTP": {
                "ports": [80, 8080, 8880, 2052, 2082, 2086, 2095]
            },
            "TLS": {
                "ports": [443, 8443, 2053, 2083, 2087, 2096]
            }
        }
    },
    "proxies": [],
    "proxy-groups": [
        {
            "name": "✅ Selector",
            "type": "select",
            "proxies": []
        },
        {
            "name": "",
            "type": "url-test",
            "url": "https://www.gstatic.com/generate_204",
            "interval": 30,
            "tolerance": 50,
            "proxies": []
        }
    ],
    "rules": [],
    "ntp": {
        "enable": true,
        "server": "time.apple.com",
        "port": 123,
        "interval": 30
    }
};
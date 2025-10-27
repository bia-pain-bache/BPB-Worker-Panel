export function isDomain(address: string): boolean {
    if (!address) return false;
    const domainPattern = /^(?!-)(?:[A-Za-z0-9-]{1,63}.)+[A-Za-z]{2,}$/;
    return domainPattern.test(address);
}

export async function resolveDNS(domain: string, onlyIPv4 = false): Promise<DnsResult> {
    const { dohURL } = globalThis.globalConfig;
    const dohBaseURL = `${dohURL}?name=${encodeURIComponent(domain)}`;
    const dohURLs = {
        ipv4: `${dohBaseURL}&type=A`,
        ipv6: `${dohBaseURL}&type=AAAA`,
    };

    try {
        const ipv4 = await fetchDNSRecords(dohURLs.ipv4, 1);
        const ipv6 = onlyIPv4 ? [] : await fetchDNSRecords(dohURLs.ipv6, 28);
        return { ipv4, ipv6 };
    } catch (error) {
        throw new Error(`Error resolving DNS for ${domain}: ${error}`);
    }
}

async function fetchDNSRecords(url: string, recordType: number) {
    try {
        const response = await fetch(url, { headers: { accept: 'application/dns-json' } });
        const data: any = await response.json();

        if (!data.Answer) return [];

        return data.Answer
            .filter((record: any) => record.type === recordType)
            .map((record: any) => record.data);
    } catch (error) {
        throw new Error(`Failed to fetch DNS records from ${url}: ${error}`);
    }
}

export function getProtocols() {
    const {
        settings: { VLConfigs, TRConfigs },
        dict: { _VL_, _TR_ }
    } = globalThis;

    return [
        ...(VLConfigs ? [_VL_] : []),
        ...(TRConfigs ? [_TR_] : [])
    ];
}

export async function getConfigAddresses(isFragment: boolean): Promise<string[]> {
    const { hostName } = globalThis.httpConfig;
    const { VLTRenableIPv6, customCdnAddrs, cleanIPs } = globalThis.settings;
    const resolved = await resolveDNS(hostName, !VLTRenableIPv6);
    const addrs = [
        hostName,
        'www.speedtest.net',
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip: string) => `[${ip}]`),
        ...cleanIPs
    ];

    return isFragment ? addrs : [...addrs, ...customCdnAddrs!];
}

export function generateRemark(
    index: number,
    port: number,
    address: string,
    protocol: string,
    configType: string,
    isChain: boolean
): string {
    const {
        settings: { cleanIPs },
        dict: { _VL_, _VL_CAP_, _TR_CAP_ }
    } = globalThis;

    const chainSign = isChain ? '🔗 ' : '';
    const type = configType ? ` ${configType}` : '';
    const protoSign = protocol === _VL_ ? _VL_CAP_ : _TR_CAP_;
    let addressType;

    cleanIPs.includes(address)
        ? addressType = 'Clean IP'
        : addressType = isDomain(address) ? 'Domain' : isIPv4(address) ? 'IPv4' : isIPv6(address) ? 'IPv6' : '';

    return `💦 ${index} - ${chainSign}${protoSign}${type} - ${addressType} : ${port}`;
}

export function randomUpperCase(str: string): string {
    let result = '';

    for (let i = 0; i < str.length; i++) {
        result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i];
    }

    return result;
}

export function getRandomString(lengthMin: number, lengthMax: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = Math.floor(Math.random() * (lengthMax - lengthMin + 1)) + lengthMin;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function generateWsPath(protocol: string): string {
    const {
        settings: { proxyIPMode, proxyIPs, prefixes },
        dict: { _VL_ }
    } = globalThis;

    const config = {
        junk: getRandomString(8, 16),
        protocol: protocol === _VL_ ? "vl" : "tr",
        mode: proxyIPMode,
        panelIPs: proxyIPMode === 'proxyip' ? proxyIPs : prefixes
    };

    return `/${btoa(JSON.stringify(config))}`;
}

export function base64ToDecimal(base64: string): number[] {
    const binaryString = atob(base64);
    const hexString = Array.from(binaryString).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const decimalArray = hexString.match(/.{2}/g)!.map(hex => parseInt(hex, 16));

    return decimalArray;
}

export function isIPv4(address: string): boolean {
    const ipv4Pattern = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4Pattern.test(address);
}

export function isIPv6(address: string): boolean {
    const ipv6Pattern = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/;
    return ipv6Pattern.test(address);
}

export function getDomain(url: string) {
    try {
        const newUrl = new URL(url);
        const host = newUrl.hostname;
        const isHostDomain = isDomain(host);

        return {
            host,
            isHostDomain
        };
    } catch {
        return {
            host: '',
            isHostDomain: false
        };
    }
}

export function base64EncodeUnicode(str: string): string {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export function parseHostPort(input: string, brackets: boolean) {
    const regex = /^(?:\[(?<ipv6>.+?)\]|(?<host>[^:]+))(:(?<port>\d+))?$/;
    const match = input.match(regex);

    if (!match) return {
        host: "",
        port: 0
    };

    let ipv6 = match.groups!.ipv6;

    if (brackets && ipv6) {
        ipv6 = `[${ipv6}]`;
    }

    const host = ipv6 || match.groups!.host;
    const port = match.groups!.port ? parseInt(match.groups!.port, 10) : 0;

    return { host, port };
}

export function isHttps(port: number): boolean {
    const { defaultHttpsPorts } = globalThis.httpConfig;
    return defaultHttpsPorts.includes(port);
}

const isBypass = (type: string) => ['direct', 'DIRECT'].includes(type);
const isBlock = (type: string) => ['block', 'REJECT', 'reject'].includes(type);

export function accRoutingRules(geoAssets: GeoAsset[]) {
    const {
        customBypassRules,
        customBypassSanctionRules,
        customBlockRules
    } = globalThis.settings;

    return {
        bypass: {
            geosites: geoAssets
                .filter(rule => isBypass(rule.type))
                .map(rule => rule.geosite),
            geoips: geoAssets
                .filter(rule => isBypass(rule.type) && rule.geoip)
                .map(rule => rule.geoip!),
            domains: [
                ...customBypassRules.filter(isDomain),
                ...customBypassSanctionRules.filter(isDomain)
            ],
            ips: customBypassRules.filter(rule => !isDomain(rule))
        },
        block: {
            geosites: geoAssets
                .filter(rule => isBlock(rule.type))
                .map(rule => rule.geosite),
            geoips: geoAssets
                .filter(rule => isBlock(rule.type) && rule.geoip)
                .map(rule => rule.geoip!),
            domains: customBlockRules.filter(isDomain),
            ips: customBlockRules.filter(rule => !isDomain(rule))
        }
    };
}

export function accDnsRules(geoAssets: GeoAsset[]) {
    const {
        localDNS,
        antiSanctionDNS,
        customBypassRules,
        customBypassSanctionRules,
        customBlockRules
    } = globalThis.settings;

    return {
        bypass: {
            localDNS: {
                geositeGeoips: geoAssets
                    .filter(({ type, geoip, dns }) => isBypass(type) && geoip && dns === localDNS)
                    .map(({ geosite, geoip }) => ({ geosite, geoip })),
                geosites: geoAssets
                    .filter(({ type, geoip, dns }) => isBypass(type) && !geoip && dns === localDNS)
                    .map(rule => rule.geosite),
                domains: customBypassRules.filter(isDomain)
            },
            antiSanctionDNS: {
                geosites: geoAssets
                    .filter(rule => isBypass(rule.type) && rule.dns === antiSanctionDNS)
                    .map(rule => rule.geosite),
                domains: customBypassSanctionRules.filter(isDomain)
            }
        },
        block: {
            geosites: geoAssets
                .filter(rule => isBlock(rule.type))
                .map(rule => rule.geosite),
            domains: customBlockRules.filter(isDomain)
        }
    };
}


import { globalConfig, httpConfig } from "#common/init";
import { settings } from '#common/handlers'

export function isDomain(address) {
    if (!address) return false;
    const domainPattern = /^(?!-)(?:[A-Za-z0-9-]{1,63}.)+[A-Za-z]{2,}$/;
    return domainPattern.test(address);
}

export async function resolveDNS(domain, onlyIPv4 = false) {
    const dohBaseURL = `${globalConfig.dohURL}?name=${encodeURIComponent(domain)}`;
    const dohURLs = {
        ipv4: `${dohBaseURL}&type=A`,
        ipv6: `${dohBaseURL}&type=AAAA`,
    };

    try {
        const ipv4 = await fetchDNSRecords(dohURLs.ipv4, 1);
        const ipv6 = onlyIPv4 ? [] : await fetchDNSRecords(dohURLs.ipv6, 28);
        return { ipv4, ipv6 };
    } catch (error) {
        throw new Error(`Error resolving DNS for ${domain}: ${error.message}`);
    }
}

async function fetchDNSRecords(url, recordType) {
    try {
        const response = await fetch(url, { headers: { accept: 'application/dns-json' } });
        const data = await response.json();

        if (!data.Answer) return [];
        return data.Answer
            .filter(record => record.type === recordType)
            .map(record => record.data);
    } catch (error) {
        throw new Error(`Failed to fetch DNS records from ${url}: ${error.message}`);
    }
}

export async function getConfigAddresses(isFragment) {
    const resolved = await resolveDNS(httpConfig.hostName, !settings.VLTRenableIPv6);
    const addrs = [
        httpConfig.hostName,
        'www.speedtest.net',
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip) => `[${ip}]`),
        ...settings.cleanIPs
    ];

    return isFragment ? addrs : [...addrs, ...settings.customCdnAddrs];
}

export function extractWireguardParams(warpConfigs, isWoW) {
    const index = isWoW ? 1 : 0;
    const warpConfig = warpConfigs[index].account.config;
    return {
        warpIPv6: `${warpConfig.interface.addresses.v6}/128`,
        reserved: warpConfig.client_id,
        publicKey: warpConfig.peers[0].public_key,
        privateKey: warpConfigs[index].privateKey,
    };
}

export function generateRemark(index, port, address, cleanIPs, protocol, configType) {
    let addressType;
    const type = configType ? ` ${configType}` : '';

    cleanIPs.includes(address)
        ? addressType = 'Clean IP'
        : addressType = isDomain(address) ? 'Domain' : isIPv4(address) ? 'IPv4' : isIPv6(address) ? 'IPv6' : '';

    return `💦 ${index} - ${protocol}${type} - ${addressType} : ${port}`;
}

export function randomUpperCase(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i];
    }
    return result;
}

export function getRandomString(lengthMin, lengthMax) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = Math.floor(Math.random() * (lengthMax - lengthMin + 1)) + lengthMin;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function generateWsPath(protocol) {
    const config = {
        junk: getRandomString(8, 16),
        protocol: protocol,
        mode: settings.proxyIPMode,
        panelIPs: settings.proxyIPMode === 'proxyip' ? settings.proxyIPs : settings.prefixes
    };

    const encodedConfig = btoa(JSON.stringify(config));
    return `/${encodedConfig}`;
}

export function base64ToDecimal(base64) {
    const binaryString = atob(base64);
    const hexString = Array.from(binaryString).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const decimalArray = hexString.match(/.{2}/g).map(hex => parseInt(hex, 16));
    return decimalArray;
}

export function isIPv4(address) {
    const ipv4Pattern = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4Pattern.test(address);
}

export function isIPv6(address) {
    const ipv6Pattern = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/;
    return ipv6Pattern.test(address);
}

export function getDomain(url) {
    try {
        const newUrl = new URL(url);
        const host = newUrl.hostname;
        const isHostDomain = isDomain(host);
        return { host, isHostDomain };
    } catch {
        return { host: null, isHostDomain: false };
    }
}

export function base64EncodeUnicode(str) {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export function parseHostPort(input, brackets) {
    const regex = /^(?:\[(?<ipv6>.+?)\]|(?<host>[^:]+))(:(?<port>\d+))?$/;
    const match = input.match(regex);

    if (!match) return null;

    let ipv6 = match.groups.ipv6;
    if (brackets && ipv6) {
        ipv6 = `[${ipv6}]`;
    }

    const host = ipv6 || match.groups.host;
    const port = match.groups.port ? parseInt(match.groups.port, 10) : null;

    return { host, port };
}


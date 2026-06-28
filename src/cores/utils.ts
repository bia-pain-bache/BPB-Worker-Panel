import { safeErrorMessage } from "@common";

export function isDomain(address: string): boolean {
    if (!address) return false;
    const domainRegex = /^(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,}$/;
    return domainRegex.test(address);
}

export async function resolveDNS(domain: string, onlyIPv4 = false): Promise<DnsResult> {
    const dohBaseURL = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}`;
    const dohURLs = {
        ipv4: `${dohBaseURL}&type=A`,
        ipv6: `${dohBaseURL}&type=AAAA`,
    };

    try {
        const ipv4 = await fetchDNSRecords(dohURLs.ipv4, 1);
        const ipv6 = onlyIPv4 ? [] : await fetchDNSRecords(dohURLs.ipv6, 28);
        return { ipv4, ipv6 };
    } catch (error) {
        throw new Error(`Error resolving DNS for ${domain}: ${safeErrorMessage(error)}`);
    }
}

export async function fetchDNSRecords(url: string, recordType: number): Promise<string[]> {
    try {
        const response = await fetch(url, { headers: { accept: 'application/dns-json' } });
        const data: unknown = await response.json();

        if (
            !data ||
            typeof data !== 'object' ||
            !('Answer' in data) ||
            !Array.isArray((data as Record<string, unknown>).Answer)
        ) {
            return [];
        }

        const answers = (data as { Answer: Array<{ type: number; data: string }> }).Answer;

        return answers
            .filter(record => record.type === recordType)
            .map(record => record.data);

    } catch (error) {
        throw new Error(`Failed to fetch DNS records from ${url}: ${safeErrorMessage(error)}`);
    }
}

export function getProtocols(): string[] {
    const {
        settings: { VLConfigs, TRConfigs },
        dict: { _VL_, _TR_ }
    } = globalThis;

    const protocols: string[] = [];
    if (VLConfigs) protocols.push(_VL_);
    if (TRConfigs) protocols.push(_TR_);
    return protocols;
}

export async function getConfigAddresses(isFragment: boolean): Promise<string[]> {
    const {
        httpConfig: { hostName },
        settings: { enableIPv6, customCdnAddrs, cleanIPs }
    } = globalThis;

    const { ipv4, ipv6 } = await resolveDNS(hostName, !enableIPv6);
    const addrs = [
        hostName,
        'www.speedtest.net',
        ...ipv4,
        ...ipv6.map((ip: string) => `[${ip}]`),
        ...cleanIPs
    ];

    return isFragment ? addrs : [...addrs, ...customCdnAddrs];
}

export function generateRemark(
    index: number,
    port: number,
    address: string,
    protocol: string,
    isFragment: boolean,
    isChain: boolean
): string {
    const {
        settings: { cleanIPs, customCdnAddrs, upstreamParams: { upstreamServer } },
        dict: { _VL_, _VL_CAP_, _TR_CAP_ }
    } = globalThis;

    const isCustomAddr = customCdnAddrs.includes(address);
    const configType = isCustomAddr ? ' C' : isFragment ? ' F' : '';
    const chainSign = isChain ? '🔗 ' : '';
    const protoSign = protocol === _VL_ ? _VL_CAP_ : _TR_CAP_;
    let addressType: string;

    if (cleanIPs.includes(address)) {
        addressType = 'Clean IP';
    } else {
        addressType = isDomain(address) ? 'Domain' : isIPv4(address) ? 'IPv4' : isIPv6(address) ? 'IPv6' : '';
    }

    return address === upstreamServer
        ? `💦 ${index} - ${chainSign}${protoSign}${configType} - Upstream Proxy`
        : `💦 ${index} - ${chainSign}${protoSign}${configType} - ${addressType} : ${port}`;
}

export function randomUpperCase(str: string): string {
    let result = '';

    for (let i = 0; i < str.length; i++) {
        result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i];
    }

    return result;
}

export function getRandomString(lengthMin: number, lengthMax: number): string {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const rangeLength = lengthMax - lengthMin + 1;
    const length = lengthMin + Math.floor(
        crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF / rangeLength + 1)
    );
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes, b => charSet[b % charSet.length]).join('');
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
    const hexString = Array
        .from(binaryString)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');

    return hexString
        .match(/.{2}/g)!
        .map(hex => parseInt(hex, 16));
}

export function isIPv4(address: string): boolean {
    const ipv4Pattern = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4Pattern.test(address);
}

export function isIPv6(address: string): boolean {
    const ipv6Pattern = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/;
    return ipv6Pattern.test(address);
}

export function getDomain(url: string): { host: string; isHostDomain: boolean } {
    try {
        const newUrl = new URL(url);
        const host = newUrl.hostname;
        const isHostDomain = isDomain(host);
        return { host, isHostDomain };
    } catch {
        return { host: '', isHostDomain: false };
    }
}

export function selectSniHost(address: string): { host: string; sni: string; allowInsecure: boolean } {
    const {
        httpConfig: { hostName },
        settings: { customCdnAddrs, customCdnHost, customCdnSni }
    } = globalThis;

    const isCustomAddr = customCdnAddrs.includes(address);
    const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
    const host = isCustomAddr ? customCdnHost : hostName;

    return { host, sni, allowInsecure: isCustomAddr };
}

export function parseHostPort(input: string, brackets?: boolean): { host: string; port: number } {
    const regex = /^(?:\[(?<ipv6>.+?)\]|(?<host>[^:]+))(:(?<port>\d+))?$/;
    const match = input.match(regex);

    if (!match || !match.groups) return { host: "", port: 0 };
    const { ipv6, host: plainHost, port: portStr } = match.groups;

    let host = ipv6 ?? plainHost ?? "";
    if (brackets && ipv6) host = `[${ipv6}]`;
    const port = portStr ? Number(portStr) : 0;

    return { host, port };
}

export function isHttps(port: number): boolean {
    const { defaultHttpsPorts } = globalThis.httpConfig;
    return defaultHttpsPorts.includes(port);
}

const isBypass = (type: string) => type === "direct";
const isBlock = (type: string) => type === "block";

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

export function toRange(min?: number, max?: number): string | undefined {
    if (min == null || max == null) return undefined;
    if (min === max) return String(min);
    return `${min}-${max}`;
}

export function concatIf<T>(arr: T[], condition: boolean, concat: T | T[]): T[] {
    if (!condition) return arr;
    if (Array.isArray(concat)) return [...arr, ...concat];
    return [...arr, concat];
}

export function omitEmpty<T extends object>(obj: T): T | undefined {
    if (Array.isArray(obj)) return obj.length === 0 ? undefined : obj;
    return Object.keys(obj).length === 0 ? undefined : obj;
}
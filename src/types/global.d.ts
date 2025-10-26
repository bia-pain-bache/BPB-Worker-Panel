declare global {
    interface GlobalConfig {
        userID: string;
        TrPass: string;
        pathName: string;
        fallbackDomain: string;
        dohURL: string;
    }

    interface HttpConfig {
        readonly panelVersion: string;
        readonly defaultHttpPorts: number[];
        readonly defaultHttpsPorts: number[];
        hostName: string;
        client: string;
        urlOrigin: string;
        subPath: string;
    }

    interface WsConfig {
        readonly defaultProxyIPs: string[];
        readonly defaultPrefixes: string[];
        envProxyIPs: string;
        envPrefixes: string;
        wsProtocol?: "vl" | "tr";
        proxyMode?: "proxyip" | "prefix";
        panelIPs?: string[];
    }

    interface Env {
        readonly UUID: string;
        readonly TR_PASS: string;
        readonly PROXY_IP: string;
        readonly PREFIX: string;
        readonly FALLBACK: string;
        readonly DOH_URL: string;
        readonly kv: KVNamespace;
    }

    interface WarpAccount {
        privateKey: string;
        account: unknown;
    }

    interface DohHost {
        host: string;
        isDomain: boolean;
        ipv4: string[];
        ipv6: string[];
    }

    interface DnsResult {
        ipv4: string[];
        ipv6: string[];
    }

    interface XrUdpNoise {
        type: "rand" | "str" | "base64" | "hex";
        packet: string;
        delay: string;
        count: number
    }

    interface Settings {
        remoteDNS: string;
        dohHost: DohHost;
        localDNS: string;
        antiSanctionDNS: string;
        VLTRFakeDNS: boolean;
        proxyIPMode: "proxyip" | "prefix";
        proxyIPs: string[];
        prefixes: string[];
        outProxy: string;
        outProxyParams: any;
        cleanIPs: string[];
        VLTRenableIPv6: boolean;
        customCdnAddrs: string[];
        customCdnHost: string;
        customCdnSni: string;
        bestVLTRInterval: number;
        VLConfigs: boolean;
        TRConfigs: boolean;
        ports: number[];
        fingerprint: Fingerprint;
        enableTFO: boolean;
        fragmentMode: "custom" | "low" | "medium" | "high";
        fragmentLengthMin: number;
        fragmentLengthMax: number;
        fragmentIntervalMin: number;
        fragmentIntervalMax: number;
        fragmentPackets: "tlshello" | "1-1" | "1-2" | "1-3" | "1-5";
        bypassIran: boolean;
        bypassChina: boolean;
        bypassRussia: boolean;
        bypassOpenAi: boolean;
        bypassMicrosoft: boolean;
        bypassOracle: boolean;
        bypassDocker: boolean;
        bypassAdobe: boolean;
        bypassEpicGames: boolean;
        bypassIntel: boolean;
        bypassAmd: boolean;
        bypassNvidia: boolean;
        bypassAsus: boolean;
        bypassHp: boolean;
        bypassLenovo: boolean;
        blockAds: boolean;
        blockPorn: boolean;
        blockUDP443: boolean;
        customBypassRules: string[];
        customBlockRules: string[];
        customBypassSanctionRules: string[];
        warpEndpoints: string[];
        warpFakeDNS: boolean;
        warpEnableIPv6: boolean;
        bestWarpInterval: number;
        xrayUdpNoises: XrUdpNoise[];
        knockerNoiseMode: string;
        noiseCountMin: number;
        noiseCountMax: number;
        noiseSizeMin: number;
        noiseSizeMax: number;
        noiseDelayMin: number;
        noiseDelayMax: number;
        amneziaNoiseCount: number;
        amneziaNoiseSizeMin: number;
        amneziaNoiseSizeMax: number;
        panelVersion: string;
    }

    interface GeoAsset {
        rule: boolean;
        type: string;
        geosite: string;
        geoip?: string;
        geositeURL?: string;
        geoipURL?: string;
        dns?: string;
        format?: string;
    }

    var settings: Settings;
    var globalConfig: GlobalConfig;
    var httpConfig: HttpConfig;
    var wsConfig: WsConfig;
    var dict: {
        _VL_: string;
        _VL_CAP_: string;
        _VM_: string;
        _TR_: string;
        _TR_CAP_: string;
        _SS_: string;
        _V2_: string;
        _website_: string;
        _public_proxy_ip_: string;
    };


    const __VERSION__: string;
    const __ERROR_HTML_CONTENT__: string;
    const __ICON__: string;
    const __PANEL_HTML_CONTENT__: string;
    const __LOGIN_HTML_CONTENT__: string;
    const __SECRETS_HTML_CONTENT__: string;
}

export { };

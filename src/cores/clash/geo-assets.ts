export function getGeoAssets(): GeoAsset[] {
    const { localDNS, antiSanctionDNS } = globalThis.settings;

    return [
        {
            rule: true,
            type: 'REJECT',
            format: "text",
            geosite: "malware",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt",
            geoip: "malware-cidr",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware-ip.txt",
        },
        {
            rule: true,
            type: 'REJECT',
            format: "text",
            geosite: "phishing",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt",
            geoip: "phishing-cidr",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing-ip.txt",
        },
        {
            rule: true,
            type: 'REJECT',
            format: "text",
            geosite: "cryptominers",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"
        },
        {
            rule: settings.blockAds,
            type: 'REJECT',
            format: "text",
            geosite: "category-ads-all",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/category-ads-all.txt"
        },
        {
            rule: settings.blockPorn,
            type: 'REJECT',
            format: "text",
            geosite: "nsfw",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt",
        },
        {
            rule: settings.bypassIran,
            type: 'DIRECT',
            dns: localDNS,
            format: "text",
            geosite: "ir",
            geoip: "ir-cidr",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"
        },
        {
            rule: settings.bypassChina,
            type: 'DIRECT',
            dns: localDNS,
            format: "yaml",
            geosite: "cn",
            geoip: "cn-cidr",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
            geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"
        },
        {
            rule: settings.bypassRussia,
            type: 'DIRECT',
            dns: localDNS,
            format: "yaml",
            geosite: "ru",
            geoip: "ru-cidr",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",
            geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"
        },
        {
            rule: settings.bypassOpenAi,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "openai",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.yaml"
        },
        {
            rule: settings.bypassMicrosoft,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "microsoft",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.yaml"
        },
        {
            rule: settings.bypassOracle,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "oracle",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/oracle.yaml"
        },
        {
            rule: settings.bypassDocker,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "docker",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/docker.yaml"
        },
        {
            rule: settings.bypassAdobe,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "adobe",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/adobe.yaml"
        },
        {
            rule: settings.bypassEpicGames,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "epicgames",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/epicgames.yaml"
        },
        {
            rule: settings.bypassIntel,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "intel",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/intel.yaml"
        },
        {
            rule: settings.bypassAmd,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "amd",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/amd.yaml"
        },
        {
            rule: settings.bypassNvidia,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "nvidia",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/nvidia.yaml"
        },
        {
            rule: settings.bypassAsus,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "asus",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/asus.yaml"
        },
        {
            rule: settings.bypassHp,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "hp",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/hp.yaml"
        },
        {
            rule: settings.bypassLenovo,
            type: 'DIRECT',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "lenovo",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/lenovo.yaml"
        }
    ].filter(({ rule }) => rule);
}
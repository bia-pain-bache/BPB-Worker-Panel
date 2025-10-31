export function getGeoAssets(): GeoAsset[] {
    const {
        localDNS,
        antiSanctionDNS,
        blockMalware,
        blockPhishing,
        blockCryptominers,
        blockAds,
        blockPorn,
        bypassIran,
        bypassChina,
        bypassRussia,
        bypassOpenAi,
        bypassGoogleAi,
        bypassMicrosoft,
        bypassOracle,
        bypassDocker,
        bypassAdobe,
        bypassEpicGames,
        bypassIntel,
        bypassAmd,
        bypassNvidia,
        bypassAsus,
        bypassHp,
        bypassLenovo,
    } = globalThis.settings;

    return [
        {
            rule: blockMalware,
            type: 'block',
            format: "text",
            geosite: "malware",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt",
            geoip: "malware-cidr",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware-ip.txt",
        },
        {
            rule: blockPhishing,
            type: 'block',
            format: "text",
            geosite: "phishing",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt",
            geoip: "phishing-cidr",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing-ip.txt",
        },
        {
            rule: blockCryptominers,
            type: 'block',
            format: "text",
            geosite: "cryptominers",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"
        },
        {
            rule: blockAds,
            type: 'block',
            format: "text",
            geosite: "category-ads-all",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/category-ads-all.txt"
        },
        {
            rule: blockPorn,
            type: 'block',
            format: "text",
            geosite: "nsfw",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt",
        },
        {
            rule: bypassIran,
            type: 'direct',
            dns: localDNS,
            format: "text",
            geosite: "ir",
            geoip: "ir-cidr",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"
        },
        {
            rule: bypassChina,
            type: 'direct',
            dns: localDNS,
            format: "yaml",
            geosite: "cn",
            geoip: "cn-cidr",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
            geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"
        },
        {
            rule: bypassRussia,
            type: 'direct',
            dns: localDNS,
            format: "yaml",
            geosite: "ru",
            geoip: "ru-cidr",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",
            geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"
        },
        {
            rule: bypassOpenAi,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "openai",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.yaml"
        },
        {
            rule: bypassGoogleAi,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "googleai",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google-deepmind.yaml"
        },
        {
            rule: bypassMicrosoft,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "microsoft",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.yaml"
        },
        {
            rule: bypassOracle,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "oracle",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/oracle.yaml"
        },
        {
            rule: bypassDocker,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "docker",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/docker.yaml"
        },
        {
            rule: bypassAdobe,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "adobe",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/adobe.yaml"
        },
        {
            rule: bypassEpicGames,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "epicgames",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/epicgames.yaml"
        },
        {
            rule: bypassIntel,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "intel",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/intel.yaml"
        },
        {
            rule: bypassAmd,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "amd",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/amd.yaml"
        },
        {
            rule: bypassNvidia,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "nvidia",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/nvidia.yaml"
        },
        {
            rule: bypassAsus,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "asus",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/asus.yaml"
        },
        {
            rule: bypassHp,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "hp",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/hp.yaml"
        },
        {
            rule: bypassLenovo,
            type: 'direct',
            dns: antiSanctionDNS,
            format: "yaml",
            geosite: "lenovo",
            geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/lenovo.yaml"
        }
    ].filter(({ rule }) => rule);
}
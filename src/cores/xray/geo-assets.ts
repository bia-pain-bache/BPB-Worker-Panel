export function getGeoAssets(): GeoAsset[] {
    const { localDNS, antiSanctionDNS } = globalThis.settings;
    
    return [
        { rule: settings.blockAds, type: 'block', geosite: "geosite:category-ads-all" },
        { rule: settings.blockAds, type: 'block', geosite: "geosite:category-ads-ir" },
        { rule: settings.blockPorn, type: 'block', geosite: "geosite:category-porn" },
        { rule: settings.bypassIran, type: 'direct', geosite: "geosite:category-ir", geoip: "geoip:ir", dns: localDNS },
        { rule: settings.bypassChina, type: 'direct', geosite: "geosite:cn", geoip: "geoip:cn", dns: localDNS },
        { rule: settings.bypassRussia, type: 'direct', geosite: "geosite:category-ru", geoip: "geoip:ru", dns: localDNS },
        { rule: settings.bypassOpenAi, type: 'direct', geosite: "geosite:openai", dns: antiSanctionDNS },
        { rule: settings.bypassMicrosoft, type: 'direct', geosite: "geosite:microsoft", dns: antiSanctionDNS },
        { rule: settings.bypassOracle, type: 'direct', geosite: "geosite:oracle", dns: antiSanctionDNS },
        { rule: settings.bypassDocker, type: 'direct', geosite: "geosite:docker", dns: antiSanctionDNS },
        { rule: settings.bypassAdobe, type: 'direct', geosite: "geosite:adobe", dns: antiSanctionDNS },
        { rule: settings.bypassEpicGames, type: 'direct', geosite: "geosite:epicgames", dns: antiSanctionDNS },
        { rule: settings.bypassIntel, type: 'direct', geosite: "geosite:intel", dns: antiSanctionDNS },
        { rule: settings.bypassAmd, type: 'direct', geosite: "geosite:amd", dns: antiSanctionDNS },
        { rule: settings.bypassNvidia, type: 'direct', geosite: "geosite:nvidia", dns: antiSanctionDNS },
        { rule: settings.bypassAsus, type: 'direct', geosite: "geosite:asus", dns: antiSanctionDNS },
        { rule: settings.bypassHp, type: 'direct', geosite: "geosite:hp", dns: antiSanctionDNS },
        { rule: settings.bypassLenovo, type: 'direct', geosite: "geosite:lenovo", dns: antiSanctionDNS },
    ].filter(({ rule }) => rule);
}
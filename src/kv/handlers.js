import { getDomain, resolveDNS } from '../cores-configs/helpers';
import { fetchWarpConfigs } from '../protocols/warp';

export async function getDataset(request, env) {
    let proxySettings, warpConfigs;

    try {
        proxySettings = await env.kv.get("proxySettings", { type: 'json' });
        warpConfigs = await env.kv.get('warpConfigs', { type: 'json' });
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting KV - ${error}`);
    }

    if (!proxySettings) {
        proxySettings = await updateDataset(request, env);
        const configs = await fetchWarpConfigs(env);
        warpConfigs = configs;
    }

    if (panelVersion !== proxySettings.panelVersion) proxySettings = await updateDataset(request, env);
    return { proxySettings, warpConfigs }
}

export async function updateDataset(request, env) {
    let newSettings = request.method === 'POST' ? await request.formData() : null;
    const isReset = newSettings?.get('resetSettings') === 'true';
    let currentSettings;
    if (!isReset) {
        try {
            currentSettings = await env.kv.get("proxySettings", { type: 'json' });
        } catch (error) {
            console.log(error);
            throw new Error(`An error occurred while getting current KV settings - ${error}`);
        }
    }

    const getxrayUdpNoises = () => {
        if (isReset) return null;
        let xrayUdpNoises = [];
        const udpNoiseModes = newSettings?.getAll('udpXrayNoiseMode') || [];
        const udpNoisePackets = newSettings?.getAll('udpXrayNoisePacket') || [];
        const udpNoiseDelaysMin = newSettings?.getAll('udpXrayNoiseDelayMin') || [];
        const udpNoiseDelaysMax = newSettings?.getAll('udpXrayNoiseDelayMax') || [];
        const udpNoiseCount = newSettings?.getAll('udpXrayNoiseCount') || [];
        xrayUdpNoises.push(...udpNoiseModes?.map((mode, index) => ({
            type: mode,
            packet: udpNoisePackets[index],
            delay: `${udpNoiseDelaysMin[index]}-${udpNoiseDelaysMax[index]}`,
            count: udpNoiseCount[index]
        })));

        return xrayUdpNoises.length ? xrayUdpNoises : currentSettings?.xrayUdpNoises;
    }

    const getPorts = () => {
        if (isReset) return null;
        const ports = [];
        [...defaultHttpsPorts, ...defaultHttpPorts].forEach(port => {
            validateField(port) && ports.push(port);
        });

        return ports.length ? ports : currentSettings?.ports;
    }

    const validateField = (field, isCheckBox, isArray) => {
        const fieldValue = newSettings?.get(field);
        if (isCheckBox) return fieldValue ? true : false;
        if (fieldValue === undefined) return currentSettings?.[field];
        if (fieldValue === 'true') return true;
        if (fieldValue === 'false') return false;
        if (isArray) return fieldValue === '' ? [] : fieldValue.split('\r\n').map(value => value.trim()).filter(Boolean);
        return fieldValue?.trim();
    }

    const populateField = (field, defaultValue, isCheckBox, isArray, callback) => {
        if (isReset) return defaultValue;
        if (!newSettings) return currentSettings?.[field] || defaultValue;
        return typeof callback === 'function'
            ? callback(validateField(field, isCheckBox, isArray))
            : validateField(field, isCheckBox, isArray);
    }

    const remoteDNS = populateField('remoteDNS', 'https://8.8.8.8/dns-query');
    const initDoh = async () => {
        const { host, isHostDomain } = getDomain(remoteDNS);
        const dohHost = {
            host,
            isDomain: isHostDomain
        }

        if (isHostDomain) {
            const { ipv4, ipv6 } = await resolveDNS(host);
            dohHost.isDomain = true;
            dohHost.ipv4 = ipv4;
            dohHost.ipv6 = ipv6;
        }

        return dohHost;
    }

    const settings = {
        remoteDNS,
        dohHost: await initDoh(), 
        localDNS: populateField('localDNS', '8.8.8.8'),
        antiSanctionDNS: populateField('antiSanctionDNS', '178.22.122.100'),
        VLTRFakeDNS: populateField('VLTRFakeDNS', false),
        proxyIPs: populateField('proxyIPs', [], false, true),
        outProxy: populateField('outProxy', ''),
        outProxyParams: populateField('outProxy', {}, false, false, field => extractChainProxyParams(field)),
        cleanIPs: populateField('cleanIPs', [], false, true),
        VLTRenableIPv6: populateField('VLTRenableIPv6', true, false, true),
        customCdnAddrs: populateField('customCdnAddrs', [], false, true),
        customCdnHost: populateField('customCdnHost', ''),
        customCdnSni: populateField('customCdnSni', ''),
        bestVLTRInterval: populateField('bestVLTRInterval', '30'),
        VLConfigs: populateField('VLConfigs', true, true),
        TRConfigs: populateField('TRConfigs', true, true),
        ports: getPorts() ?? ['443'],
        fragmentLengthMin: populateField('fragmentLengthMin', '100'),
        fragmentLengthMax: populateField('fragmentLengthMax', '200'),
        fragmentIntervalMin: populateField('fragmentIntervalMin', '1'),
        fragmentIntervalMax: populateField('fragmentIntervalMax', '1'),
        fragmentPackets: populateField('fragmentPackets', 'tlshello'),
        bypassLAN: populateField('bypassLAN', false, true),
        bypassIran: populateField('bypassIran', false, true),
        bypassChina: populateField('bypassChina', false, true),
        bypassRussia: populateField('bypassRussia', false, true),
        bypassOpenAi: populateField('bypassOpenAi', false, true),
        bypassGoogle: populateField('bypassGoogle', false, true),
        bypassMicrosoft: populateField('bypassMicrosoft', false, true),
        blockAds: populateField('blockAds', false, true),
        blockPorn: populateField('blockPorn', false, true),
        blockUDP443: populateField('blockUDP443', false, true),
        customBypassRules: populateField('customBypassRules', [], false, true),
        customBlockRules: populateField('customBlockRules', [], false, true),
        customBypassSanctionRules: populateField('customBypassSanctionRules', [], false, true),
        warpEndpoints: populateField('warpEndpoints', ['engage.cloudflareclient.com:2408'], false, true),
        warpFakeDNS: populateField('warpFakeDNS', false),
        warpEnableIPv6: populateField('warpEnableIPv6', true),
        bestWarpInterval: populateField('bestWarpInterval', '30'),
        xrayUdpNoises: getxrayUdpNoises() ?? [
            {
                type: 'rand',
                packet: '50-100',
                delay: '1-1',
                count: 5
            }
        ],
        hiddifyNoiseMode: populateField('hiddifyNoiseMode', 'm4'),
        knockerNoiseMode: populateField('knockerNoiseMode', 'quic'),
        noiseCountMin: populateField('noiseCountMin', '10'),
        noiseCountMax: populateField('noiseCountMax', '15'),
        noiseSizeMin: populateField('noiseSizeMin', '5'),
        noiseSizeMax: populateField('noiseSizeMax', '10'),
        noiseDelayMin: populateField('noiseDelayMin', '1'),
        noiseDelayMax: populateField('noiseDelayMax', '1'),
        amneziaNoiseCount: populateField('amneziaNoiseCount', '5'),
        amneziaNoiseSizeMin: populateField('amneziaNoiseSizeMin', '50'),
        amneziaNoiseSizeMax: populateField('amneziaNoiseSizeMax', '100'),
        panelVersion: panelVersion
    };

    try {
        await env.kv.put("proxySettings", JSON.stringify(settings));
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while updating KV - ${error}`);
    }

    return settings;
}

function extractChainProxyParams(chainProxy) {
    let configParams = {};
    if (!chainProxy) return {};
    const url = new URL(chainProxy);
    const protocol = url.protocol.slice(0, -1);
    if (protocol === 'vless') {
        const params = new URLSearchParams(url.search);
        configParams = {
            protocol: protocol,
            uuid: url.username,
            server: url.hostname,
            port: url.port
        };

        params.forEach((value, key) => {
            configParams[key] = value;
        });
    } else {
        configParams = {
            protocol: protocol,
            user: url.username,
            pass: url.password,
            server: url.host,
            port: url.port
        };
    }

    return configParams;
}
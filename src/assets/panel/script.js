localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
import { polyfillCountryFlagEmojis } from 'https://cdn.skypack.dev/country-flag-emoji-polyfill';

fetch('/panel/settings')
    .then(async response => response.json())
    .then(data => {
        const { success, status, message, body } = data;
        if (status === 401 && !body.isPassSet) {
            const closeBtn = document.querySelector(".close");
            openResetPass();
            closeBtn.style.display = 'none';
        }

        if (!success) throw new Error(`status ${status} - ${message}`);
        const { subPath, proxySettings } = body;
        globalThis.subPath = encodeURIComponent(subPath);
        initiatePanel(proxySettings);
    })
    .catch(error => console.error("Data query error:", error.message || error))
    .finally(() => {
        const clickEvents = [
            ['openResetPass', openResetPass],
            ['closeResetPass', closeResetPass],
            ['closeQR', closeQR],
            ['darkModeToggle', darkModeToggle],
            ['dlAmneziaConfigsBtn', () => downloadWarpConfigs(true)],
            ['dlConfigsBtn', () => downloadWarpConfigs(false)],
            ['endpointScanner', () => copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/bia-pain-bache/warp-script/refs/heads/main/endip/install.sh)')],
            ['updateWarpConfigs', updateWarpConfigs],
            ['VLConfigs', handleProtocolChange],
            ['TRConfigs', handleProtocolChange],
            ['resetSettings', resetSettings],
            ['logout', logout],
            ['addUdpNoise', () => addUdpNoise(true, globalThis.xrayNoiseCount)],
            ['refresh-geo-location', fetchIPInfo]
        ];

        clickEvents.forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) element.addEventListener('click', handler);
        });

        const submitEvents = [
            ['configForm', updateSettings],
            ['passwordChangeForm', resetPassword]
        ];

        submitEvents.forEach(([id, handler]) => {
            const form = document.getElementById(id);
            if (form) form.addEventListener('submit', handler);
        });

        document.querySelectorAll('[name="udpXrayNoiseMode"]')?.forEach(noiseSelector => noiseSelector.addEventListener('change', generateUdpNoise));
        document.querySelectorAll('button.delete-noise')?.forEach(deleteNoise => deleteNoise.addEventListener('click', deleteUdpNoise));
        document.querySelectorAll('.https')?.forEach(port => port.addEventListener('change', handlePortChange));

        Object.assign(window, { subURL, openQR, dlURL });
        window.onclick = (event) => {
            const qrModal = document.getElementById('qrModal');
            const qrcodeContainer = document.getElementById('qrcode-container');
            if (event.target == qrModal) {
                qrModal.style.display = "none";
                qrcodeContainer.lastElementChild.remove();
            }
        }
    });


function initiatePanel(proxySettings) {

    const {
        VLConfigs,
        TRConfigs,
        ports,
        xrayUdpNoises
    } = proxySettings;

    globalThis.defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
    Object.assign(globalThis, {
        activeProtocols: VLConfigs + TRConfigs,
        activeTlsPorts: ports.filter(port => defaultHttpsPorts.includes(port)),
        xrayNoiseCount: xrayUdpNoises.length,
    });

    const selectElements = ["VLTRFakeDNS", "VLTRenableIPv6", "warpFakeDNS", "warpEnableIPv6"];
    const checkboxElements = [
        "VLConfigs", "TRConfigs", "bypassLAN", "blockAds", "bypassIran", "blockPorn", "bypassChina",
        "blockUDP443", "bypassRussia", "bypassOpenAi", "bypassGoogle", "bypassMicrosoft"];
    const inputElements = [
        "remoteDNS", "localDNS", "outProxy", "customCdnHost", "customCdnSni", "bestVLTRInterval",
        "fragmentLengthMin", "fragmentLengthMax", "fragmentIntervalMin", "fragmentIntervalMax",
        "fragmentPackets", "bestWarpInterval", "hiddifyNoiseMode", "knockerNoiseMode", "noiseCountMin",
        "noiseCountMax", "noiseSizeMin", "noiseSizeMax", "noiseDelayMin", "noiseDelayMax",
        "amneziaNoiseCount", "amneziaNoiseSizeMin", "amneziaNoiseSizeMax", "antiSanctionDNS"
    ];
    const textareaElements = ["proxyIPs", "cleanIPs", "customCdnAddrs", "warpEndpoints", "customBypassRules", "customBlockRules", "customBypassSanctionRules"];

    populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings);
    renderPortsBlock(ports);
    renderUdpNoiseBlock(xrayUdpNoises);
    initiateForm();
    fetchIPInfo();
    polyfillCountryFlagEmojis();
}

function populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings) {
    selectElements.forEach(key => document.getElementById(key).value = proxySettings[key]);
    checkboxElements.forEach(key => document.getElementById(key).checked = proxySettings[key]);
    inputElements.forEach(key => document.getElementById(key).value = proxySettings[key]);
    textareaElements.forEach(key => {
        const element = document.getElementById(key);
        const value = proxySettings[key]?.join('\r\n');
        const rowsCount = proxySettings[key].length;
        element.style.height = 'auto';
        if (rowsCount) element.rows = rowsCount;
        element.value = value;
    })
}

function initiateForm() {
    const configForm = document.getElementById('configForm');
    globalThis.initialFormData = new FormData(configForm);
    enableApplyButton();

    configForm.addEventListener('input', enableApplyButton);
    configForm.addEventListener('change', enableApplyButton);

    const textareas = document.querySelectorAll("textarea");
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight}px`;
        });
    });
}

function hasFormDataChanged() {
    const configForm = document.getElementById('configForm');
    const formDataToObject = (formData) => Object.fromEntries(formData.entries());
    const currentFormData = new FormData(configForm);
    const initialFormDataObj = formDataToObject(globalThis.initialFormData);
    const currentFormDataObj = formDataToObject(currentFormData);
    return JSON.stringify(initialFormDataObj) !== JSON.stringify(currentFormDataObj);
}

function enableApplyButton() {
    const applyButton = document.getElementById('applyButton');
    const isChanged = hasFormDataChanged();
    applyButton.disabled = !isChanged;
    applyButton.classList.toggle('disabled', !isChanged);
}

function openResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "none";
    document.body.style.overflow = "";
}

function closeQR() {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrModal.style.display = "none";
    qrcodeContainer.lastElementChild.remove();
}

function darkModeToggle() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

async function getIpDetails(ip) {
    try {
        const response = await fetch('/panel/my-ip', { method: 'POST', body: ip });
        const data = await response.json();
        const { success, status, message, body } = data;
        if (!success) throw new Error(`status ${status} - ${message}`);
        return body;
    } catch (error) {
        console.error("Fetching IP error:", error.message || error)
    }
}

async function fetchIPInfo() {
    const refreshIcon = document.getElementById("refresh-geo-location").querySelector('i');
    refreshIcon.classList.add('fa-spin');
    const updateUI = (ip = '-', country = '-', countryCode = '-', city = '-', isp = '-', cfIP) => {
        const flag = countryCode !== '-' ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';
        document.getElementById(cfIP ? 'cf-ip' : 'ip').textContent = ip;
        document.getElementById(cfIP ? 'cf-country' : 'country').textContent = country + ' ' + flag;
        document.getElementById(cfIP ? 'cf-city' : 'city').textContent = city;
        document.getElementById(cfIP ? 'cf-isp' : 'isp').textContent = isp;
    };

    try {
        const response = await fetch('https://ipwho.is/' + '?nocache=' + Date.now(), { cache: "no-store" });
        const data = await response.json();
        const { success, ip, message } = data;
        if (!success) throw new Error(`Fetch Other targets IP failed at ${response.url} - ${message}`);
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        updateUI(ip, country, countryCode, city, isp);
        refreshIcon.classList.remove('fa-spin');
    } catch (error) {
        console.error("Fetching IP error:", error.message || error)
    }

    try {
        const response = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Fetch Cloudflare targets IP failed with status ${response.status} at ${response.url} - ${errorMessage}`);
        }

        const ip = await response.text();
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        updateUI(ip, country, countryCode, city, isp, true);
        refreshIcon.classList.remove('fa-spin');
    } catch (error) {
        console.error("Fetching IP error:", error.message || error)
    }
}

function downloadWarpConfigs(isAmnezia) {
    const client = isAmnezia ? "?app=amnezia" : "";
    window.location.href = "/panel/get-warp-configs" + client;
}

function generateSubUrl(path, app, tag, hiddifyType, singboxType) {
    const url = new URL(window.location.href);
    url.pathname = `/sub/${path}/${globalThis.subPath}`;
    app && url.searchParams.append('app', app);
    if (tag) url.hash = `💦 BPB ${tag}`;

    if (singboxType) return `sing-box://import-remote-profile?url=${url.href}`;
    if (hiddifyType) return `hiddify://import/${url.href}`;
    return url.href;
}

function subURL(path, app, tag, hiddifyType, singboxType) {
    const url = generateSubUrl(path, app, tag, hiddifyType, singboxType);
    copyToClipboard(url);
}

async function dlURL(path, app) {
    const url = generateSubUrl(path, app);

    try {
        const response = await fetch(url);
        const data = await response.text();
        if (!response.ok) throw new Error(`status ${response.status} at ${response.url} - ${data}`);
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Download error:", error.message || error);
    }
}

function openQR(path, app, tag, title, singboxType, hiddifyType) {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const url = generateSubUrl(path, app, tag, hiddifyType, singboxType);
    let qrcodeTitle = document.getElementById("qrcodeTitle");
    qrcodeTitle.textContent = title;
    qrModal.style.display = "block";
    let qrcodeDiv = document.createElement("div");
    qrcodeDiv.className = "qrcode";
    qrcodeDiv.style.padding = "2px";
    qrcodeDiv.style.backgroundColor = "#ffffff";
    new QRCode(qrcodeDiv, {
        text: url,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    qrcodeContainer.appendChild(qrcodeDiv);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('✅ Copied to clipboard:\n\n' + text))
        .catch(error => console.error('Failed to copy:', error));
}

async function updateWarpConfigs() {
    const confirmReset = confirm('⚠️ Are you sure?');
    if (!confirmReset) return;
    const refreshBtn = document.getElementById('updateWarpConfigs');
    document.body.style.cursor = 'wait';
    const refreshButtonVal = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '⌛ Loading...';

    try {
        const response = await fetch('/panel/update-warp', { method: 'POST', credentials: 'include' });
        const { success, status, message } = await response.json();
        document.body.style.cursor = 'default';
        refreshBtn.innerHTML = refreshButtonVal;
        if (!success) {
            alert(`⚠️ An error occured, Please try again!\n⛔ ${message}`);
            throw new Error(`status ${status} - ${message}`);
        }

        alert('✅ Warp configs updated successfully!');
    } catch (error) {
        console.error("Updating Warp configs error:", error.message || error)
    }
}

function handleProtocolChange(event) {
    if (event.target.checked) {
        globalThis.activeProtocols++;
        return true;
    }

    globalThis.activeProtocols--;
    if (globalThis.activeProtocols === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        alert("⛔ At least one Protocol should be selected!");
        globalThis.activeProtocols++;
        return false;
    }
}

function handlePortChange(event) {
    if (event.target.checked) {
        globalThis.activeTlsPorts.push(event.target.name);
        return true;
    }

    globalThis.activeTlsPorts = globalThis.activeTlsPorts.filter(port => port !== event.target.name);
    if (globalThis.activeTlsPorts.length === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        alert("⛔ At least one TLS port should be selected!");
        globalThis.activeTlsPorts.push(event.target.name);
        return false;
    }
}

function resetSettings() {
    const confirmReset = confirm('⚠️ This will reset all panel settings.\n❓ Are you sure?');
    if (!confirmReset) return;
    const resetBtn = document.querySelector('#resetSettings i');
    resetBtn.classList.add('fa-spin');
    const formData = new FormData();
    formData.append('resetSettings', 'true');
    document.body.style.cursor = 'wait';

    fetch('/panel/reset-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message, body } = data;
            document.body.style.cursor = 'default';
            resetBtn.classList.remove('fa-spin');
            if (!success) throw new Error(`status ${status} - ${message}`);
            initiatePanel(body);
            alert('✅ Panel settings reset to default successfully!');
        })
        .catch(error => console.error("Reseting settings error:", error.message || error));
}

function updateSettings(event) {
    event.preventDefault();
    event.stopPropagation();

    const elementsToCheck = ['cleanIPs', 'customCdnAddrs', 'customCdnSni', 'customCdnHost', 'customBypassRules', 'customBlockRules', 'customBypassSanctionRules'];
    const configForm = document.getElementById('configForm');
    const formData = new FormData(configForm);

    const validations = [
        validateMultipleHostNames(elementsToCheck),
        validateProxyIPs(),
        validateWarpEndpoints(),
        validateMinMax(),
        validateChainProxy(),
        validateCustomCdn(),
        validateXrayNoises(formData),
        validateSanctionDns()
    ];

    if (!validations.every(Boolean)) return false;

    const applyButton = document.getElementById('applyButton');
    document.body.style.cursor = 'wait';
    const applyButtonVal = applyButton.value;
    applyButton.value = '⌛ Loading...';

    fetch('/panel/update-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {

            const { success, status, message } = data;
            if (status === 401) {
                alert('⚠️ Session expired! Please login again.');
                window.location.href = '/login';
            }

            if (!success) throw new Error(`status ${status} - ${message}`);
            initiateForm();
            alert('✅ Settings applied successfully!');
        })
        .catch(error => console.error("Update settings error:", error.message || error))
        .finally(() => {
            document.body.style.cursor = 'default';
            applyButton.value = applyButtonVal;
        });
}

function validateSanctionDns() {
    const value = document.getElementById("antiSanctionDNS").value.trim();

    let host;
    try {
        const url = new URL(value);
        host = url.hostname;
    } catch (_) {
        host = value;
    }

    const isValid = isValidHostName(host, false);
    if (!isValid) {
        alert('⛔ Invalid IPs or Domains.\n👉' + host);
        return false;
    }

    return true;
}

function isValidHostName(value, isHost) {
    const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?/;
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?/;
    const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}/;
    const portRegex = /:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/;
    const append = isHost ? portRegex.source : '$';
    const ipv6Reg = new RegExp(ipv6Regex.source + append, 'gm');
    const ipv4Reg = new RegExp(ipv4Regex.source + append, 'gm');
    const domainReg = new RegExp(domainRegex.source + append, 'gm');
    return ipv4Reg.test(value) || ipv6Reg.test(value) || domainReg.test(value);
}

function validateMultipleHostNames(elements) {
    const getValue = (id) => document.getElementById(id).value?.split('\n').filter(Boolean);

    const ips = [];
    elements.forEach(id => ips.push(...getValue(id)));
    const invalidIPs = ips?.filter(value => value && !isValidHostName(value.trim()));

    if (invalidIPs.length) {
        alert('⛔ Invalid IPs or Domains.\n👉 Please enter each IP/domain in a new line.\n\n' + invalidIPs.map(ip => '⚠️ ' + ip).join('\n'));
        return false;
    }

    return true;
}

function validateProxyIPs() {
    const proxyIPs = document.getElementById('proxyIPs').value?.split('\n').filter(Boolean).map(ip => ip.trim());
    const invalidValues = proxyIPs?.filter(value => !isValidHostName(value) && !isValidHostName(value, true));

    if (invalidValues.length) {
        alert('⛔ Invalid proxy IPs.\n👉 Please enter each IP/domain in a new line.\n\n' + invalidValues.map(ip => '⚠️ ' + ip).join('\n'));
        return false;
    }

    return true;
}

function validateWarpEndpoints() {
    const warpEndpoints = document.getElementById('warpEndpoints').value?.split('\n');
    const invalidEndpoints = warpEndpoints?.filter(value => value && !isValidHostName(value.trim(), true));

    if (invalidEndpoints.length) {
        alert('⛔ Invalid endpoint.\n\n' + invalidEndpoints.map(endpoint => '⚠️ ' + endpoint).join('\n'));
        return false;
    }

    return true;
}

function validateMinMax() {

    const getValue = (id) => parseInt(document.getElementById(id).value, 10);

    const fragmentLengthMin = getValue('fragmentLengthMin');
    const fragmentLengthMax = getValue('fragmentLengthMax');
    const fragmentIntervalMin = getValue('fragmentIntervalMin');
    const fragmentIntervalMax = getValue('fragmentIntervalMax');
    const noiseCountMin = getValue('noiseCountMin');
    const noiseCountMax = getValue('noiseCountMax');
    const noiseSizeMin = getValue('noiseSizeMin');
    const noiseSizeMax = getValue('noiseSizeMax');
    const noiseDelayMin = getValue('noiseDelayMin');
    const noiseDelayMax = getValue('noiseDelayMax');

    if (fragmentLengthMin >= fragmentLengthMax || fragmentIntervalMin > fragmentIntervalMax || noiseCountMin > noiseCountMax || noiseSizeMin > noiseSizeMax || noiseDelayMin > noiseDelayMax) {
        alert('⛔ Minimum should be smaller or equal to Maximum!');
        return false;
    }

    return true;
}

function validateChainProxy() {

    const chainProxy = document.getElementById('outProxy').value?.trim();
    const isVless = /vless:\/\/[^\s@]+@[^\s:]+:[^\s]+/.test(chainProxy);
    const hasSecurity = /security=/.test(chainProxy);
    const isSocksHttp = /^(http|socks):\/\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\d+)$/.test(chainProxy);
    const securityRegex = /security=(tls|none|reality)/;
    const validSecurityType = securityRegex.test(chainProxy);
    const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);

    if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
        alert('⛔ Invalid Config!\n - The chain proxy should be VLESS, Socks or Http!\n - VLESS transmission should be GRPC,WS or TCP\n - VLESS security should be TLS,Reality or None\n - socks or http should be like:\n + (socks or http)://user:pass@host:port\n + (socks or http)://host:port');
        return false;
    }

    let match = chainProxy.match(securityRegex);
    const securityType = match?.[1] || null;
    match = chainProxy.match(/:(\d+)\?/);
    const vlessPort = match?.[1] || null;

    if (isVless && securityType === 'tls' && vlessPort !== '443') {
        alert('⛔ VLESS TLS port can be only 443 to be used as a proxy chain!');
        return false;
    }

    return true;
}

function validateCustomCdn() {

    const customCdnHost = document.getElementById('customCdnHost').value;
    const customCdnSni = document.getElementById('customCdnSni').value;
    const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split('\n').filter(Boolean);

    const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';
    if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
        alert('⛔ All "Custom" fields should be filled or deleted together!');
        return false;
    }

    return true;
}

function validateXrayNoises(formData) {
    const udpNoiseModes = formData.getAll('udpXrayNoiseMode') || [];
    const udpNoisePackets = formData.getAll('udpXrayNoisePacket') || [];
    const udpNoiseDelaysMin = formData.getAll('udpXrayNoiseDelayMin') || [];
    const udpNoiseDelaysMax = formData.getAll('udpXrayNoiseDelayMax') || [];
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    let submisionError = false;

    for (const [index, mode] of udpNoiseModes.entries()) {
        if (udpNoiseDelaysMin[index] > udpNoiseDelaysMax[index]) {
            alert('⛔ The minimum noise delay should be smaller or equal to maximum!');
            submisionError = true;
            break;
        }

        switch (mode) {

            case 'base64':
                if (!base64Regex.test(udpNoisePackets[index])) {
                    alert('⛔ The Base64 noise packet is not a valid base64 value!');
                    submisionError = true;
                }

                break;

            case 'rand':
                if (!(/^\d+-\d+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ The Random noise packet should be a range like 0-10 or 10-30!');
                    submisionError = true;
                }

                const [min, max] = udpNoisePackets[index].split("-").map(Number);
                if (min > max) {
                    alert('⛔ The minimum Random noise packet should be smaller or equal to maximum!');
                    submisionError = true;
                }

                break;

            case 'hex':
                if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ The Hex noise packet is not a valid hex value! It should have even length and consisted of 0-9, a-f and A-F.');
                    submisionError = true;
                }

                break;
        }
    }

    return !submisionError;
}

function logout(event) {
    event.preventDefault();

    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            if (!success) throw new Error(`status ${status} - ${message}`);
            window.location.href = '/login';
        })
        .catch(error => console.error("Logout error:", error.message || error));
}

document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", function () {
        const input = this.previousElementSibling;
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        this.textContent = isPassword ? "visibility" : "visibility_off";
    });
});

function resetPassword(event) {
    event.preventDefault();
    const resetPassModal = document.getElementById('resetPassModal');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
        passwordError.textContent = "Passwords do not match";
        return false;
    }

    const hasCapitalLetter = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    if (!(hasCapitalLetter && hasNumber && isLongEnough)) {
        passwordError.textContent = '⚠️ Password must contain at least one capital letter, one number, and be at least 8 characters long.';
        return false;
    }

    fetch('/panel/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: newPassword,
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {

            const { success, status, message } = data;
            if (!success) {
                passwordError.textContent = `⚠️ ${message}`;
                throw new Error(`status ${status} - ${message}`);
            }

            alert("✅ Password changed successfully! 👍");
            window.location.href = '/login';

        })
        .catch(error => console.error("Reset password error:", error.message || error))
        .finally(() => {
            resetPassModal.style.display = "none";
            document.body.style.overflow = "";
        });
}

function renderPortsBlock(ports) {
    const defaultHttpPorts = ['80', '8080', '8880', '2052', '2082', '2086', '2095'];
    let noneTlsPortsBlock = '', tlsPortsBlock = '';
    const allPorts = [...(window.origin.includes('workers.dev') ? defaultHttpPorts : []), ...defaultHttpsPorts];

    allPorts.forEach(port => {
        const isChecked = ports.includes(port) ? 'checked' : '';
        const clss = defaultHttpsPorts.includes(port) ? 'class="https"' : '';
        const portBlock = `
            <div class="routing">
                <input type="checkbox" name=${port} ${clss} value="true" ${isChecked}>
                <label>${port}</label>
            </div>`;

        defaultHttpsPorts.includes(port) ? tlsPortsBlock += portBlock : noneTlsPortsBlock += portBlock;
    });

    document.getElementById("tls-ports").innerHTML = tlsPortsBlock;
    if (noneTlsPortsBlock) {
        document.getElementById("non-tls-ports").innerHTML = noneTlsPortsBlock;
        document.getElementById("none-tls").style.display = 'flex';
    }
}

function addUdpNoise(isManual, index, noise) {

    if (!noise) return addUdpNoise(isManual, index, {
        type: 'rand',
        packet: '50-100',
        delay: '1-5',
        count: 5
    });

    const container = document.createElement('div');
    container.className = "inner-container";
    container.id = `udp-noise-${index + 1}`;

    container.innerHTML = `
        <div class="header-container">
            <h4>Noise ${index + 1}</h4>
            <button type="button" class="delete-noise">
                <i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i>
            </button>      
        </div>
        <div class="section">
            <div class="form-control">
                <label>😵‍💫 v2ray Mode</label>
                <div>
                    <select name="udpXrayNoiseMode">
                        <option value="base64" ${noise.type === 'base64' ? 'selected' : ''}>Base64</option>
                        <option value="rand" ${noise.type === 'rand' ? 'selected' : ''}>Random</option>
                        <option value="str" ${noise.type === 'str' ? 'selected' : ''}>String</option>
                        <option value="hex" ${noise.type === 'hex' ? 'selected' : ''}>Hex</option>
                    </select>
                </div>
            </div>
            <div class="form-control">
                <label>📥 Noise Packet</label>
                <div>
                    <input type="text" name="udpXrayNoisePacket" value="${noise.packet}">
                </div>
            </div>
            <div class="form-control">
                <label>🕞 Noise Delay</label>
                <div class="min-max">
                    <input type="number" name="udpXrayNoiseDelayMin"
                        value="${noise.delay.split('-')[0]}" min="1" required>
                    <span> - </span>
                    <input type="number" name="udpXrayNoiseDelayMax"
                        value="${noise.delay.split('-')[1]}" min="1" required>
                </div>
            </div>
            <div class="form-control">
                <label>🎚️ Noise Count</label>
                <div>
                    <input type="number" name="udpXrayNoiseCount" value="${noise.count}" min="1" required>
                </div>
            </div>
        </div>`;

    container.querySelector(".delete-noise").addEventListener('click', deleteUdpNoise);
    container.querySelector("select").addEventListener('change', generateUdpNoise);

    document.getElementById("noises").append(container);
    isManual && enableApplyButton();
    globalThis.xrayNoiseCount++;
}



function generateUdpNoise(event) {

    const generateRandomBase64 = length => {
        const array = new Uint8Array(Math.ceil(length * 3 / 4));
        crypto.getRandomValues(array);
        let base64 = btoa(String.fromCharCode(...array));
        return base64.slice(0, length);
    }

    const generateRandomHex = length => {
        const array = new Uint8Array(Math.ceil(length / 2));
        crypto.getRandomValues(array);
        let hex = [...array].map(b => b.toString(16).padStart(2, '0')).join('');
        return hex.slice(0, length);
    }

    const generateRandomString = length => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint8Array(length);
        return Array.from(crypto.getRandomValues(array), x => chars[x % chars.length]).join('');
    };

    const noisePacket = event.target.closest(".inner-container").querySelector('[name="udpXrayNoisePacket"]');

    switch (event.target.value) {
        case 'base64':
            noisePacket.value = generateRandomBase64(64);
            break;

        case 'rand':
            noisePacket.value = "50-100";
            break;

        case 'hex':
            noisePacket.value = generateRandomHex(64);
            break;

        case 'str':
            noisePacket.value = generateRandomString(64);
            break;
    }
}

function deleteUdpNoise(event) {
    if (globalThis.xrayNoiseCount === 1) {
        alert('⛔ You cannot delete all noises!');
        return;
    }

    const confirmReset = confirm('⚠️ This will delete the noise.\n❓ Are you sure?');
    if (!confirmReset) return;
    event.target.closest(".inner-container").remove();
    enableApplyButton();
    globalThis.xrayNoiseCount--;
}

function renderUdpNoiseBlock(xrayUdpNoises) {
    document.getElementById("noises").innerHTML = '';
    xrayUdpNoises.forEach((noise, index) => {
        addUdpNoise(false, index, noise);
    });
    globalThis.xrayNoiseCount = xrayUdpNoises.length;
}
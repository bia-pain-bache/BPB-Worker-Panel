localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');

const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
const defaultHttpPorts = ['80', '8080', '8880', '2052', '2082', '2086', '2095'];

fetch('/panel/settings')
    .then(async response => response.json())
    .then(data => {
        const { success, status, message, body } = data;
        if (!success) throw new Error(`Data query failed with status ${status}: ${message}`);
        const { subPath, isPassSet, proxySettings } = body;
        globalThis.subPath = subPath;
        if (!isPassSet) {
            const closeBtn = document.querySelector(".close");
            openResetPass();
            closeBtn.style.display = 'none';
        }
        initiatePanel(proxySettings);
    })
    .catch(error => console.error("Data query error:", error.message || error));

function initiatePanel(proxySettings) {
    const {
        VLConfigs,
        TRConfigs,
        ports,
        xrayUdpNoises
    } = proxySettings;

    globalThis.activeProtocols = VLConfigs + TRConfigs;
    globalThis.activeTlsPorts = ports.filter(port => defaultHttpsPorts.includes(port));

    const selectElements = ["VLTRFakeDNS", "VLTRenableIPv6", "warpFakeDNS", "warpEnableIPv6"];
    const checkboxElements = ["VLConfigs", "TRConfigs", "bypassLAN", "blockAds", "bypassIran", "blockPorn", "bypassChina", "blockUDP443", "bypassRussia"];
    const inputElements = [
        "remoteDNS", "localDNS", "outProxy", "customCdnHost", "customCdnSni", "bestVLTRInterval",
        "fragmentLengthMin", "fragmentLengthMax", "fragmentIntervalMin", "fragmentIntervalMax",
        "fragmentPackets", "bestWarpInterval", "hiddifyNoiseMode", "knockerNoiseMode", "noiseCountMin",
        "noiseCountMax", "noiseSizeMin", "noiseSizeMax", "noiseDelayMin", "noiseDelayMax",
        "amneziaNoiseCount", "amneziaNoiseSizeMin", "amneziaNoiseSizeMax",
    ];
    const textareaElements = ["proxyIPs", "cleanIPs", "customCdnAddrs", "warpEndpoints", "customBypassRules", "customBlockRules"];

    populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings);
    renderPortsBlock(ports);
    renderUdpNoiseBlock(xrayUdpNoises);
    initiateForm();
    fetchIPInfo();
}

const populatePanel = (selectElements, checkboxElements, inputElements, textareaElements, proxySettings) => {
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

const initiateForm = () => {
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

window.onclick = (event) => {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    if (event.target == qrModal) {
        qrModal.style.display = "none";
        qrcodeContainer.lastElementChild.remove();
    }
}

const hasFormDataChanged = () => {
    const configForm = document.getElementById('configForm');
    const formDataToObject = (formData) => Object.fromEntries(formData.entries());
    const currentFormData = new FormData(configForm);
    const initialFormDataObj = formDataToObject(globalThis.initialFormData);
    const currentFormDataObj = formDataToObject(currentFormData);
    return JSON.stringify(initialFormDataObj) !== JSON.stringify(currentFormDataObj);
}

const enableApplyButton = () => {
    const applyButton = document.getElementById('applyButton');
    const isChanged = hasFormDataChanged();
    applyButton.disabled = !isChanged;
    applyButton.classList.toggle('disabled', !isChanged);
}

const openResetPass = () => {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "block";
    document.body.style.overflow = "hidden";
}

const closeResetPass = () => {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "none";
    document.body.style.overflow = "";
}

const closeQR = () => {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrModal.style.display = "none";
    qrcodeContainer.lastElementChild.remove();
}

const darkModeToggle = () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

const getIpDetails = async (ip) => {
    try {
        const response = await fetch('/panel/my-ip', { method: 'POST', body: ip });
        const data = await response.json();
        const { success, status, message, body } = data;
        if (!success) throw new Error(`Fetch target IP failed with status ${status}: ${message}`);
        return body;
    } catch (error) {
        console.error("Fetching IP error:", error.message || error)
    }
}

const fetchIPInfo = async () => {
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
        if (!success) throw new Error(`Fetch Other targets IP failed at ${response.url}: ${message}`);
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
            throw new Error(`Fetch Cloudflare targets IP failed with status ${response.status} at ${response.url}: ${errorMessage}`);
        }

        const ip = await response.text();
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        updateUI(ip, country, countryCode, city, isp, true);
        refreshIcon.classList.remove('fa-spin');
    } catch (error) {
        console.error("Fetching IP error:", error.message || error)
    }
}

const downloadWarpConfigs = (isAmnezia) => {
    const client = isAmnezia ? "?app=amnezia" : "";
    window.location.href = "/panel/get-warp-configs" + client;
}

const subURL = (path, app, tag, hiddifyType) => copyToClipboard(`${hiddifyType ? 'hiddify://import/' : ''}${window.origin}/sub/${path}/${globalThis.subPath}${app ? `?app=${app}` : ''}#BPB-${tag}`);

const dlURL = async (path, app) => {
    try {
        const response = await fetch(`${window.origin}/sub/${path}/${subPath}${app ? `?app=${app}` : ''}`);
        const data = await response.text();
        if (!response.ok) throw new Error(`Download failed with status ${response.status} at ${response.url}: ${data}`);
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

const openQR = (path, app, tag, title, sbType, hiddifyType) => {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const url = `${sbType ? 'sing-box://import-remote-profile?url=' : ''}${hiddifyType ? 'hiddify://import/' : ''}${window.origin}/sub/${path}/${globalThis.subPath}${app ? `?app=${app}` : ''}#BPB-${tag}`;
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

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => alert('✅ Copied to clipboard:\n\n' + text))
        .catch(error => console.error('Failed to copy:', error));
}

const updateWarpConfigs = async () => {
    const confirmReset = confirm('⚠️ Are you sure?');
    if (!confirmReset) return;
    const refreshBtn = document.getElementById('refreshBtn');
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
            throw new Error(`Updating Warp configs failed with status ${status}: ${message}`);
        }

        alert('✅ Warp configs updated successfully! 😎');
    } catch (error) {
        console.error("Updating Warp configs error:", error.message || error)
    }
}

const handleProtocolChange = (event) => {
    if (event.target.checked) {
        globalThis.activeProtocols++;
        return true;
    }

    globalThis.activeProtocols--;
    if (globalThis.activeProtocols === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        alert("⛔ At least one Protocol should be selected! 🫤");
        globalThis.activeProtocols++;
        return false;
    }
}

const handlePortChange = (event) => {
    if (event.target.checked) {
        globalThis.activeTlsPorts.push(event.target.name);
        return true;
    }

    globalThis.activeTlsPorts = globalThis.activeTlsPorts.filter(port => port !== event.target.name);
    if (globalThis.activeTlsPorts.length === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        alert("⛔ At least one TLS port should be selected! 🫤");
        globalThis.activeTlsPorts.push(event.target.name);
        return false;
    }
}

const resetSettings = () => {
    const confirmReset = confirm('⚠️ This will reset all panel settings.\nAre you sure?');
    if (!confirmReset) return;
    const resetBtn = document.querySelector('#resetBtn i');
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
            if (!success) throw new Error(`Reset settings failed with status ${status}: ${message}`);
            initiatePanel(body);
            alert('✅ Panel settings reset to default successfully! 😎');
        })
        .catch(error => console.error("Reseting settings error:", error.message || error));
}

const updateSettings = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const getValue = (id) => parseInt(document.getElementById(id).value, 10);
    function isValidIpDomain(value) {
        const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?$/gm;
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?$/gm;
        const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}$/gm;
        return ipv4Regex.test(value) || ipv6Regex.test(value) || domainRegex.test(value);
    }

    function isValidEndpoint(value) {
        const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        return ipv4Regex.test(value) || ipv6Regex.test(value) || domainRegex.test(value);
    }

    const cleanIPs = document.getElementById('cleanIPs').value?.split('\n');
    const proxyIPs = document.getElementById('proxyIPs').value?.split('\n');
    const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split('\n').filter(Boolean);
    const customCdnHost = document.getElementById('customCdnHost').value;
    const customCdnSni = document.getElementById('customCdnSni').value;
    const customBypassRules = document.getElementById('customBypassRules').value?.split('\n');
    const customBlockRules = document.getElementById('customBlockRules').value?.split('\n');
    const invalidIPs = [
        ...cleanIPs,
        ...proxyIPs,
        ...customCdnAddrs,
        ...customBypassRules,
        ...customBlockRules,
        customCdnHost,
        customCdnSni
    ]?.filter(value => value && !isValidIpDomain(value.trim()));

    if (invalidIPs.length) {
        alert('⛔ Invalid IPs or Domains 🫤\n\n' + invalidIPs.map(ip => '⚠️ ' + ip).join('\n'));
        return false;
    }

    const warpEndpoints = document.getElementById('warpEndpoints').value?.split('\n');
    const invalidEndpoints = warpEndpoints?.filter(value => value && !isValidEndpoint(value.trim()));

    if (invalidEndpoints.length) {
        alert('⛔ Invalid endpoint 🫤\n\n' + invalidEndpoints.map(endpoint => '⚠️ ' + endpoint).join('\n'));
        return false;
    }

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
        alert('⛔ Minimum should be smaller or equal to Maximum! 🫤');
        return false;
    }

    const chainProxy = document.getElementById('outProxy').value?.trim();
    const isVless = /vless:\/\/[^\s@]+@[^\s:]+:[^\s]+/.test(chainProxy);
    const hasSecurity = /security=/.test(chainProxy);
    const isSocksHttp = /^(http|socks):\/\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\d+)$/.test(chainProxy);
    const securityRegex = /security=(tls|none|reality)/;
    const validSecurityType = securityRegex.test(chainProxy);
    const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);
    if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
        alert('⛔ Invalid Config! 🫤 \n - The chain proxy should be VLESS, Socks or Http!\n - VLESS transmission should be GRPC,WS or TCP\n - VLESS security should be TLS,Reality or None\n - socks or http should be like:\n + (socks or http)://user:pass@host:port\n + (socks or http)://host:port');
        return false;
    }

    let match = chainProxy.match(securityRegex);
    const securityType = match?.[1] || null;
    match = chainProxy.match(/:(\d+)\?/);
    const vlessPort = match?.[1] || null;
    if (isVless && securityType === 'tls' && vlessPort !== '443') {
        alert('⛔ VLESS TLS port can be only 443 to be used as a proxy chain! 🫤');
        return false;
    }

    const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';
    if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
        alert('⛔ All "Custom" fields should be filled or deleted together! 🫤');
        return false;
    }

    const formData = new FormData(configForm);
    const udpNoiseModes = formData.getAll('udpXrayNoiseMode') || [];
    const udpNoisePackets = formData.getAll('udpXrayNoisePacket') || [];
    const udpNoiseDelaysMin = formData.getAll('udpXrayNoiseDelayMin') || [];
    const udpNoiseDelaysMax = formData.getAll('udpXrayNoiseDelayMax') || [];
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    let submisionError = false;
    for (const [index, mode] of udpNoiseModes.entries()) {
        if (udpNoiseDelaysMin[index] > udpNoiseDelaysMax[index]) {
            alert('⛔ The minimum noise delay should be smaller or equal to maximum! 🫤');
            submisionError = true;
            break;
        }

        switch (mode) {

            case 'base64':

                if (!base64Regex.test(udpNoisePackets[index])) {
                    alert('⛔ The Base64 noise packet is not a valid base64 value! 🫤');
                    submisionError = true;
                }

                break;

            case 'rand':

                if (!(/^\d+-\d+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ The Random noise packet should be a range like 0-10 or 10-30! 🫤');
                    submisionError = true;
                }

                const [min, max] = udpNoisePackets[index].split("-").map(Number);
                if (min > max) {
                    alert('⛔ The minimum Random noise packet should be smaller or equal to maximum! 🫤');
                    submisionError = true;
                }

                break;

            case 'hex':

                if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ The Hex noise packet is not a valid hex value! It should have even length and consisted of 0-9, a-f and A-F. 🫤');
                    submisionError = true;
                }

                break;
        }
    }

    if (submisionError) return false;
    const applyButton = document.getElementById('applyButton');
    document.body.style.cursor = 'wait';
    const applyButtonVal = applyButton.value;
    applyButton.value = '⌛ Loading...';

    fetch('/panel/update-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            document.body.style.cursor = 'default';
            applyButton.value = applyButtonVal;
            if (status === 401) {
                alert('⚠️ Session expired! Please login again.');
                window.location.href = '/login/';
            }

            if (!success) throw new Error(`Update settings failed with status ${status}: ${message}`);
            initiateForm();
            alert('✅ Settings applied successfully 😎');
        })
        .catch(error => console.error("Update settings error:", error.message || error));
}

const logout = (event) => {
    event.preventDefault();

    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            if (!success) throw new Error(`Logout failed with status ${status}: ${message}`);
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

const resetPassword = (event) => {
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
                throw new Error(`Reset password failed with status ${status}: ${message}`);
            }

            resetPassModal.style.display = "none";
            document.body.style.overflow = "";
            alert("✅ Password changed successfully! 👍");
            window.location.href = '/login';

        }).catch(error => console.error("Reset password error:", error.message || error));
}

const renderPortsBlock = (ports) => {
    let noneTlsPortsBlock = '', tlsPortsBlock = '';
    const allPorts = [...(window.origin.includes('workers.dev') ? defaultHttpPorts : []), ...defaultHttpsPorts];

    allPorts.forEach(port => {
        const isChecked = ports.includes(port) ? 'checked' : '';
        const onChangeHandler = defaultHttpsPorts.includes(port) ? 'onchange="handlePortChange(event)"' : '';
        const portBlock = `
            <div class="routing">
                <input type="checkbox" name=${port} ${onChangeHandler} value="true" ${isChecked}>
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

const addUdpNoise = () => {
    const container = document.getElementById("noises");
    const noiseBlock = document.getElementById("udp-noise-1");
    const index = container.children.length + 1;
    const clone = noiseBlock.cloneNode(true);
    clone.querySelector("h4").textContent = `Noise ${index}`;
    clone.id = `udp-noise-${index}`;
    container.appendChild(clone);
    document.getElementById("configForm").dispatchEvent(new Event("change"));
}

const deleteUdpNoise = (button) => {
    const container = document.getElementById("noises");
    if (container.children.length === 1) {
        alert('⛔ You cannot delete all noises!');
        return;
    }

    const confirmReset = confirm('⚠️ This will delete the noise.\nAre you sure?');
    if (!confirmReset) return;
    button.closest(".inner-container").remove();
    document.getElementById("configForm").dispatchEvent(new Event("change"));
}

const renderUdpNoiseBlock = (xrayUdpNoises) => {
    let udpNoiseBlocks = '';
    xrayUdpNoises.forEach((noise, index) => {
        udpNoiseBlocks += `
            <div id="udp-noise-${index + 1}" class="inner-container">
                <div class="header-container">
                    <h4>Noise ${index + 1}</h4>
                    <button type="button" class="delete-noise" onclick="deleteUdpNoise(this)">
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
                </div>
            </div>`;
    });

    document.getElementById("noises").innerHTML = udpNoiseBlocks;
}
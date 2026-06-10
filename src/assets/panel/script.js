// Theme initialization
(function() {
    const savedTheme = localStorage.getItem('bpb-theme');
    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
})();

function showToast(message, type = 'info', duration = 3000) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        <div class="toast-progress"></div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function showConfirm(message, onConfirm, options = {}) {
    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirmModalTitle');
    const msg = document.getElementById('confirmModalMessage');
    const icon = document.getElementById('confirmModalIcon');
    const confirmBtn = document.getElementById('confirmModalConfirm');
    const cancelBtn = document.getElementById('confirmModalCancel');

    icon.textContent = options.icon || '⚠️';
    title.textContent = options.title || 'Are you sure?';
    msg.textContent = message;
    confirmBtn.textContent = options.confirmText || 'Confirm';
    cancelBtn.textContent = options.cancelText || 'Cancel';

    modal.style.display = 'flex';

    const handleConfirm = () => {
        modal.style.display = 'none';
        cleanup();
        if (onConfirm) onConfirm();
    };
    const handleCancel = () => {
        modal.style.display = 'none';
        cleanup();
        if (options.onCancel) options.onCancel();
    };
    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCancel();
    }, { once: true });
}

const form = document.getElementById("configForm");
const [
    selectElements,
    numInputElements,
    inputElements,
    textareaElements,
    checkboxElements
] = [
    'select',
    'input[type=number]',
    'input:not([type=file])',
    'textarea',
    'input[type=checkbox]'
].map(query => form.querySelectorAll(query));

const defaultHttpsPorts = [443, 8443, 2053, 2083, 2087, 2096];
const defaultHttpPorts = [80, 8080, 8880, 2052, 2082, 2086, 2095];

fetch('/panel/settings')
    .then(async response => response.json())
    .then(({ success, status, message, body }) => {

        if (status === 401 && !body.isPassSet) {
            const closeBtn = document.querySelector(".close");
            openResetPass();
            if (closeBtn) closeBtn.style.display = 'none';
        }

        if (!success) {
            throw new Error(`status ${status} - ${message}`);
        }

        const { subPath, proxySettings } = body;
        globalThis.subPath = encodeURIComponent(subPath);
        initiatePanel(proxySettings);
    })
    .catch(error => console.error("Data query error:", error.message || error))
    .finally(() => {
        window.onclick = (event) => {
            const qrModal = document.getElementById('qrModal');
            const qrcodeContainer = document.getElementById('qrcode-container');

            if (event.target == qrModal) {
                qrModal.style.display = "none";
                if (qrcodeContainer && qrcodeContainer.lastElementChild) {
                    qrcodeContainer.lastElementChild.remove();
                }
            }
        }

        document.querySelectorAll(".toggle-password").forEach(toggle => {
            toggle.addEventListener("click", function () {
                const input = this.previousElementSibling;
                const isPassword = input.type === "password";
                input.type = isPassword ? "text" : "password";
                this.textContent = isPassword ? "visibility" : "visibility_off";
            });
        });
    });

function initiatePanel(proxySettings) {
    const {
        VLConfigs,
        TRConfigs,
        ports,
        xrayUdpNoises
    } = proxySettings;

    Object.assign(globalThis, {
        activeProtocols: VLConfigs + TRConfigs,
        activeTlsPorts: ports.filter(port => defaultHttpsPorts.includes(port)),
        xrayNoiseCount: xrayUdpNoises.length,
    });

    populatePanel(proxySettings);
    renderPortsBlock(ports.map(Number));
    renderUdpNoiseBlock(xrayUdpNoises);
    initiateForm();
    fetchIPInfo();
    if (proxySettings.cfAccountId) {
        setTimeout(fetchCfUsage, 500);
    }
}

function populatePanel(proxySettings) {
    document.getElementById("doh").textContent = `${window.origin}/dns-query/${decodeURIComponent(globalThis.subPath)}`;
    selectElements.forEach(elm => elm.value = proxySettings[elm.id]);
    checkboxElements.forEach(elm => elm.checked = proxySettings[elm.id]);
    inputElements.forEach(elm => elm.value = proxySettings[elm.id] || "");
    textareaElements.forEach(elm => {
        const key = elm.id;
        const element = document.getElementById(key);
        const value = proxySettings[key]?.join('\r\n');
        const rowsCount = proxySettings[key].length;
        if (element) {
            element.style.height = 'auto';
            if (rowsCount) element.rows = rowsCount;
            element.value = value;
        }
    });
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

    handleFragmentMode();
}

function hasFormDataChanged() {
    const formDataToObject = (formData) => Object.fromEntries(formData.entries());
    const configForm = document.getElementById('configForm');
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

function togglePassword(btn) {
    const input = btn.previousElementSibling;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '🙈' : '👁️';
}

async function saveCfCredentials() {
    const form = validateSettings();
    if (!form) return;
    document.body.style.cursor = 'wait';
    try {
        const res = await fetch('/panel/update-settings', {
            method: 'PUT',
            body: JSON.stringify(form),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (!data.success) {
            showToast(`Failed to save: ${data.message}`, 'error');
            document.body.style.cursor = 'default';
            return;
        }
        showToast('CF credentials saved!', 'success');
        fetchCfUsage();
    } catch (err) {
        showToast('Failed to save credentials.', 'error');
    } finally {
        document.body.style.cursor = 'default';
    }
}

async function fetchCfUsage() {
    const card = document.getElementById('cfUsageCard');
    if (!card) return;
    card.style.display = 'block';
    card.innerHTML = '<div class="usage-loading">🔄 Fetching usage stats...</div>';
    try {
        const res = await fetch('/panel/cf-usage', { credentials: 'include' });
        const { success, body, message } = await res.json();
        if (!success) {
            card.innerHTML = `<div class="usage-loading">⚠️ ${message || 'Failed to fetch usage.'}</div>`;
            return;
        }
        renderUsageCard(body);
    } catch (err) {
        card.innerHTML = '<div class="usage-loading">❌ Error fetching usage stats.</div>';
    }
}

function renderUsageCard(data) {
    const card = document.getElementById('cfUsageCard');
    const reqPct = data.requests.percent;
    const obsPct = data.observability.percent;

    const reqBarClass = reqPct >= 80 ? 'red' : reqPct >= 60 ? 'amber' : 'green';
    const obsBarClass = obsPct >= 80 ? 'red' : obsPct >= 60 ? 'amber' : 'green';

    const fmt = n => n.toLocaleString();
    let warningsHtml = '';
    if (data.warnings && data.warnings.length > 0) {
        warningsHtml = data.warnings.map(w =>
            `<div class="usage-warning">⚠️ ${w}</div>`
        ).join('');
    }
    if (data.overLimit) {
        warningsHtml += '<div class="usage-over-limit">🚫 You have exceeded your Cloudflare Workers limit!</div>';
    }

    card.innerHTML = `
        <div class="usage-card-title">📊 Usage Stats &bull; ${data.period}</div>
        <div class="usage-metric">
            <div class="usage-metric-label">
                <span>🔵 Requests today</span>
                <span>${fmt(data.requests.used)} / ${fmt(data.requests.limit)} (${reqPct}%)</span>
            </div>
            <div class="usage-progress">
                <div class="usage-progress-bar ${reqBarClass}" style="width:${Math.min(reqPct, 100)}%"></div>
            </div>
        </div>
        <div class="usage-metric">
            <div class="usage-metric-label">
                <span>👁 Observability</span>
                <span>${fmt(data.observability.used)} / ${fmt(data.observability.limit)} (${obsPct}%)</span>
            </div>
            <div class="usage-progress">
                <div class="usage-progress-bar ${obsBarClass}" style="width:${Math.min(obsPct, 100)}%"></div>
            </div>
        </div>
        ${warningsHtml}
    `;
}

function openResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "flex";
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
    if (qrcodeContainer && qrcodeContainer.lastElementChild) {
        qrcodeContainer.lastElementChild.remove();
    }
}

function updateThemeUI() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Set select element colors in JS after theme switch/load
    document.querySelectorAll('select').forEach(el => {
        el.style.backgroundColor = 
            theme === 'dark' ? '#0f0f1a' : '#ffffff';
        el.style.color = 
            theme === 'dark' ? '#f1f5f9' : '#1e1b4b';
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bpb-theme', newTheme);
    updateThemeUI();
}

async function getIpDetails(ip) {
    try {
        const response = await fetch('/panel/my-ip', { method: 'POST', body: ip });
        const { success, status, message, body } = await response.json();

        if (!success) {
            throw new Error(`status ${status} - ${message}`);
        }

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
        const updateContent = (id, content) => document.getElementById(id).textContent = content;
        updateContent(cfIP ? 'cf-ip' : 'ip', ip);
        updateContent(cfIP ? 'cf-country' : 'country', `${country} ${flag}`);
        updateContent(cfIP ? 'cf-city' : 'city', city);
        updateContent(cfIP ? 'cf-isp' : 'isp', isp);
    };

    try {
        const response = await fetch('https://ipv4.geojs.io/v1/ip.json' + '?nocache=' + Date.now(), { cache: "no-store" });
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Fetch Other targets IP failed with status ${response.status} at ${response.url} - ${errorMessage}`);
        }

        const { ip } = await response.json();
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

function generateSubUrl(path, app, tag, singboxType) {
    const url = new URL(window.location.href);
    url.pathname = `/sub/${path}/${globalThis.subPath}`;
    app && url.searchParams.append('app', app);

    if (tag) {
        url.hash = `💦 BPB ${tag}`;
    }

    return singboxType
        ? `sing-box://import-remote-profile?url=${url.href}`
        : url.href;
}

function subURL(path, app, tag, singboxType) {
    const url = generateSubUrl(path, app, tag, singboxType);
    copyToClipboard(url);
}

async function dlURL(path, app) {
    const url = generateSubUrl(path, app);

    try {
        const response = await fetch(url);
        const data = await response.text();

        if (!response.ok) {
            throw new Error(`status ${response.status} at ${response.url} - ${data}`);
        }

        downloadJSON(data, "config.json");
    } catch (error) {
        console.error("Download error:", error.message || error);
    }
}

function downloadJSON(data, fileName) {
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportSettings() {
    const form = validateSettings();
    const data = JSON.stringify(form, null, 4);
    const encodedData = btoa(data);
    downloadJSON(encodedData, `BPB-settings.dat`);
}

function importSettings() {
    const input = document.getElementById('fileInput');
    input.value = '';
    input.click();
}

async function uploadSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = atob(text);
        const settings = JSON.parse(data);
        updateSettings(event, settings);
        initiatePanel(settings);
    } catch (err) {
        console.error('Failed to import settings:', err.message);
    }
}

function openQR(path, app, tag, title, singboxType) {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const url = generateSubUrl(path, app, tag, singboxType);
    let qrcodeTitle = document.getElementById("qrcodeTitle");
    qrcodeTitle.textContent = title;
    qrModal.style.display = "flex";
    let qrcodeDiv = document.createElement("div");
    qrcodeDiv.className = "qrcode";
    qrcodeDiv.style.padding = "2px";
    qrcodeDiv.style.backgroundColor = "#ffffff";
    /* global QRCode */
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
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(error => console.error('Failed to copy:', error));
}

async function setupTelegramWebhook() {
    const token = document.getElementById('telegramBotToken').value.trim();
    const adminId = document.getElementById('telegramAdminId').value.trim();

    if (!token) {
        showToast('Please enter a Bot Token first.', 'error');
        return;
    }
    if (!adminId) {
        showToast('Please enter an Admin Telegram ID first.', 'error');
        return;
    }

    const form = validateSettings();
    if (!form) return;

    document.body.style.cursor = 'wait';
    try {
        const saveRes = await fetch('/panel/update-settings', {
            method: 'PUT',
            body: JSON.stringify(form),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        const saveData = await saveRes.json();
        if (!saveData.success) {
            showToast(`Failed to save settings: ${saveData.message}`, 'error');
            document.body.style.cursor = 'default';
            return;
        }

        const response = await fetch('/panel/setup-telegram-webhook');
        const { success, status, message } = await response.json();

        if (!success) {
            showToast(`${message}`, 'error');
            document.body.style.cursor = 'default';
            return;
        }

        showToast('Telegram webhook set up successfully! Send /start to your bot to test.', 'success');
    } catch (error) {
        console.error("Setup webhook error:", error.message || error);
        showToast('Failed to setup webhook. Please try again.', 'error');
    } finally {
        document.body.style.cursor = 'default';
    }
}

async function updateWarpConfigs() {
    showConfirm(
        'Are you sure you want to update Warp configs?',
        async () => {
            const refreshBtn = document.getElementById('warp-update');
            document.body.style.cursor = 'wait';
            if (refreshBtn) refreshBtn.classList.add('fa-spin');

            try {
                const response = await fetch('/panel/update-warp', { method: 'POST', credentials: 'include' });
                const { success, status, message } = await response.json();

                document.body.style.cursor = 'default';
                if (refreshBtn) refreshBtn.classList.remove('fa-spin');

                if (!success) {
                    showToast(`An error occurred: ${message}`, 'error');
                    throw new Error(`status ${status} - ${message}`);
                }

                showToast('Warp configs updated successfully!', 'success');
            } catch (error) {
                console.error("Updating Warp configs error:", error.message || error)
            }
        },
        { icon: '⚠️', title: 'Update Warp Configs', confirmText: 'Yes, Update' }
    );
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
        showToast("At least one Protocol should be selected!", 'warning');
        globalThis.activeProtocols++;
        return false;
    }
}

function handlePortChange(event) {
    const portField = Number(event.target.name);

    if (event.target.checked) {
        globalThis.activeTlsPorts.push(portField);
        return true;
    }

    globalThis.activeTlsPorts = globalThis.activeTlsPorts.filter(port => port !== portField);

    if (globalThis.activeTlsPorts.length === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        showToast("At least one TLS port should be selected!", 'warning');
        globalThis.activeTlsPorts.push(portField);
        return false;
    }
}

function handleRiskyRules(event) {
    if (event.target.checked) {
        showConfirm(
            "v2ray users should set Geo Assets to Chocolate4U and download assets, otherwise configs won't connect.",
            null,
            {
                icon: '⚠️',
                title: 'Proceed?',
                confirmText: 'Proceed',
                cancelText: 'Cancel',
                onCancel: () => { event.target.checked = false; }
            }
        );
    }
}

function handleFragmentMode() {
    const fragmentMode = document.getElementById("fragmentMode").value;
    const formDataObj = Object.fromEntries(globalThis.initialFormData.entries());
    const inputs = [
        "fragmentLengthMin",
        "fragmentLengthMax",
        "fragmentIntervalMin",
        "fragmentIntervalMax"
    ];

    const configs = {
        low: [100, 200, 1, 1],
        medium: [50, 100, 1, 5],
        high: [10, 20, 10, 20],
        severe: [1, 5, 1, 5],
        custom: inputs.map(id => formDataObj[id])
    };

    inputs.forEach((id, index) => {
        const elm = document.getElementById(id);
        if (elm) {
            elm.value = configs[fragmentMode][index];
            fragmentMode !== "custom"
                ? elm.setAttribute('readonly', 'true')
                : elm.removeAttribute('readonly');
        }
    });
}

function resetSettings() {
    showConfirm(
        'This will reset all panel settings. Are you sure?',
        () => {
            const resetBtn = document.getElementById("refresh-btn");
            if (resetBtn) resetBtn.classList.add('fa-spin');
            const body = { resetSettings: true };
            document.body.style.cursor = 'wait';

            fetch('/panel/reset-settings', {
                method: 'POST',
                body: JSON.stringify(body),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(({ success, status, message, body }) => {
                    document.body.style.cursor = 'default';
                    if (resetBtn) resetBtn.classList.remove('fa-spin');

                    if (!success) {
                        throw new Error(`status ${status} - ${message}`);
                    }

                    initiatePanel(body);
                    showToast('Panel settings reset to default successfully! Please update your subscriptions.', 'success');
                })
                .catch(error => console.error("Reseting settings error:", error.message || error));
        },
        { icon: '⚠️', title: 'Reset Settings', confirmText: 'Yes, Reset' }
    );
}

function updateSettings(event, data) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const validatedForm = validateSettings();
    if (!validatedForm) return false;

    const form = data ? data : validatedForm;
    const applyButton = document.getElementById('applyButton');
    document.body.style.cursor = 'wait';
    const applyButtonVal = applyButton.value;
    applyButton.value = '⌛ Loading...';

    fetch('/panel/update-settings', {
        method: 'PUT',
        body: JSON.stringify(form),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(({ success, status, message }) => {

            if (status === 401) {
                showToast('Session expired! Please login again.', 'warning');
                window.location.href = '/login';
            }

            if (!success) {
                throw new Error(`status ${status} - ${message}`);
            }

            initiatePanel(form);
            showToast('Settings applied successfully! Please update your subscriptions.', 'success');
        })
        .catch(error => console.error("Update settings error:", error.message || error))
        .finally(() => {
            document.body.style.cursor = 'default';
            applyButton.value = applyButtonVal;
        });
}

function parseElmValues(id) {
    const elm = document.getElementById(id);
    return elm ? (elm.value?.split('\n').map(value => value.trim()).filter(Boolean) || []) : [];
}

// Validation functions
function getElmValue(id) {
    const elm = document.getElementById(id);
    return elm ? elm.value?.trim() : '';
}

function isDomain(value) {
    const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}$/;
    return domainRegex.test(value);
}

function isIPv4(value) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    return ipv4Regex.test(value);
}

function isIPv4CIDR(value) {
    const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/;
    return ipv4CidrRegex.test(value);
}

function isIPv6(value) {
    const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\]$/;
    return ipv6Regex.test(value);
}

function isIPv6CIDR(value) {
    const ipv6CidrRegex = /^(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7}|::)(?:\/(?:12[0-8]|1[01]?[0-9]|[0-9]?[0-9]))?$/;
    return ipv6CidrRegex.test(value);
}

function parseHostPort(input) {
    const regex = /^(?<host>\[.*?\]|[^:]+)(?::(?<port>\d+))?$/;
    const match = input.match(regex);

    if (!match) return null;

    return {
        host: match.groups.host,
        port: match.groups.port ? +match.groups.port : null
    };
}

function isValidHostName(value, isHost) {
    const hostPort = parseHostPort(value.trim());
    if (!hostPort) return false;
    const { host, port } = hostPort;
    if (port && (port > 65535 || port < 1)) return false;
    if (isHost && !port) return false;

    return isIPv6(host) || isIPv4(host) || isDomain(host);
}

function validateRemoteDNS() {
    let url;
    const dns = getElmValue("remoteDNS");

    try {
        url = new URL(dns);
    } catch (error) {
        showToast("Invalid DNS, Please enter a URL.", 'error');
        return false;
    }

    const cloudflareDNS = [
        '1.1.1.1',
        '1.0.0.1',
        '1.1.1.2',
        '1.0.0.2',
        '1.1.1.3',
        '1.0.0.3',
        '2606:4700:4700::1111',
        '2606:4700:4700::1001',
        '2606:4700:4700::1112',
        '2606:4700:4700::1002',
        '2606:4700:4700::1113',
        '2606:4700:4700::1003',
        'cloudflare-dns.com',
        'security.cloudflare-dns.com',
        'family.cloudflare-dns.com',
        'one.one.one.one',
        '1dot1dot1dot1'
    ];

    if (!["tcp:", "https:", "tls:"].includes(url.protocol)) {
        showToast("Please enter TCP, DoH or DoT servers.", 'error');
        return false;
    }

    if (cloudflareDNS.includes(url.hostname)) {
        showToast("Cloudflare DNS is not allowed for workers. Please use other public DNS servers like Google, Adguard...", 'error');

        return false;
    }

    return true;
}

function validateSanctionDns() {
    const dns = getElmValue("antiSanctionDNS");
    let host;

    try {
        const url = new URL(dns);
        host = url.hostname;
    } catch {
        host = dns;
    }

    const isValid = isValidHostName(host, false);

    if (!isValid) {
        showToast(`Invalid IPs or Domains. ${host}`, 'error');

        return false;
    }

    return true;
}

function validateWarpDNS() {
    const dns = getElmValue("warpRemoteDNS");
    const isValid = isIPv4(dns);

    if (!isValid) {
        showToast(`Invalid Warp DNS. Please fill in an IPv4 address (UDP DNS). ${dns}`, 'error');

        return false;
    }

    return true;
}

function validateLocalDNS() {
    const dns = getElmValue("localDNS");
    const isValid = isIPv4(dns) || dns === 'localhost';

    if (!isValid) {
        showToast(`Invalid local DNS. Please fill in an IPv4 address or "localhost". ${dns}`, 'error');

        return false;
    }

    return true;
}

function validateCustomRules() {
    const invalidDomainIpValues = [
        'customBypassRules',
        'customBlockRules'
    ].flatMap(parseElmValues)
        .filter(value => !isIPv4CIDR(value) && !isIPv6CIDR(value) && !isDomain(value));

    const invalidDomainValues = parseElmValues('customBypassSanctionRules').filter(value => !isDomain(value));

    if (invalidDomainIpValues.length) {
        showToast('Invalid IPs, Domains or IP ranges. Please enter each value in a new line. ' + invalidDomainIpValues.map(val => `${val}`).join(', '), 'error');

        return false;
    }

    if (invalidDomainValues.length) {
        showToast('Invalid Domains. Please enter each value in a new line. ' + invalidDomainValues.map(val => `${val}`).join(', '), 'error');

        return false;
    }

    return true;
}

function validateMultipleHostNames() {
    const invalidValues = [
        'cleanIPs',
        'customCdnAddrs',
        'customCdnSni',
        'customCdnHost'
    ].flatMap(parseElmValues)
        .filter(value => !isValidHostName(value));

    if (invalidValues.length) {
        showToast('Invalid IPs or Domains. Please enter each value in a new line. ' + invalidValues.map(ip => `${ip}`).join(', '), 'error');

        return false;
    }

    return true;
}

function validateProxyIPs() {
    const invalidValues = parseElmValues('proxyIPs')
        .filter(value => !isValidHostName(value));

    if (invalidValues.length) {
        showToast('Invalid proxy IPs. Please enter each value in a new line. ' + invalidValues.map(ip => `${ip}`).join(', '), 'error');

        return false;
    }

    return true;
}

function validateNAT64Prefixes() {
    const invalidValues = parseElmValues('prefixes')
        .filter(value => !isIPv6(value));

    if (invalidValues.length) {
        showToast('Invalid NAT64 prefix. Please enter each prefix in a new line using []. ' + invalidValues.map(ip => `${ip}`).join(', '), 'error');

        return false;
    }

    return true;
}

function validateWarpEndpoints() {
    const invalidEndpoints = parseElmValues('warpEndpoints')
        .filter(value => !isValidHostName(value, true));

    if (invalidEndpoints.length) {
        showToast('Invalid endpoint. ' + invalidEndpoints.map(endpoint => `${endpoint}`).join(', '), 'error');

        return false;
    }

    return true;
}

function validateMinMax() {
    const getValue = (id) => parseInt(getElmValue(id), 10);

    const fields = [
        ['fragmentLengthMin', 'fragmentLengthMax', 'Fragment Length'],
        ['fragmentIntervalMin', 'fragmentIntervalMax', 'Fragment Interval'],
        ['fragmentMaxSplitMin', 'fragmentMaxSplitMax', 'Fragment Max Split'],
        ['noiseCountMin', 'noiseCountMax', 'Noise Count'],
        ['noiseSizeMin', 'noiseSizeMax', 'Noise Size'],
        ['noiseDelayMin', 'noiseDelayMax', 'Noise Delay'],
        ['amneziaNoiseSizeMin', 'amneziaNoiseSizeMax', 'Amnezia Noise Size']
    ];

    for (const [minId, maxId, label] of fields) {
        const min = getValue(minId);
        const max = getValue(maxId);

        if (min > max) {
            showToast(`${label}: Minimum cannot be bigger than Maximum!`, 'error');
            return false;
        }
    }

    return true;
}

function validateChainProxy() {
    let chainProxy = getElmValue('outProxy');
    if (!chainProxy) return true;
    const isVMess = /vmess:\/\/.+$/.test(chainProxy);
    const isOthers = /(http|socks|socks5|vless|trojan|ss):\/\/[^\s@]+@[^\s:]+:[^\s]+/.test(chainProxy);

    if (!isVMess && !isOthers) {
        showToast('Invalid Config! Standard formats are: (socks or socks5 or http)://user:pass@server:port, (socks or socks5 or http)://base64@server:port, vless://uuid@server:port..., vmess://base64, trojan://password@server:port..., ss://base64@server:port...', 'error');

        return false;
    }

    const config = new URL(chainProxy);
    let { protocol, username } = config;
    let security = config.searchParams.get('security');
    let type = config.searchParams.get('type');

    if (isVMess) {
        const vmConfig = JSON.parse(atob(config.host));
        username = vmConfig.id;
        security = vmConfig.tls;
        type = vmConfig.net;
    }

    if (['vless:', 'trojan:', 'vmess:'].includes(protocol)) {
        if (!username) {
            showToast('Invalid Config! Config URL should contain UUID or Password.', 'error');

            return false;
        }

        if (security && !['tls', 'none', 'reality'].includes(security)) {
            showToast('Invalid Config! VLESS, VMess or Trojan security can be TLS, Reality or None.', 'error');

            return false;
        }

        if (!['tcp', 'raw', 'ws', 'grpc', 'httpupgrade'].includes(type)) {
            showToast('Invalid Config! VLESS, VMess or Trojan transmission can be tcp, ws, grpc or httpupgrade.', 'error');

            return false;
        }
    }

    return true;
}

function validateCustomCdn() {
    const customCdnHost = getElmValue('customCdnHost');
    const customCdnSni = getElmValue('customCdnSni');
    const customCdnAddrs = parseElmValues('customCdnAddrs');
    const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';

    if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
        showToast('All "Custom" fields should be filled or deleted together!', 'error');
        return false;
    }

    return true;
}

function handleKnockerMode() {
    const mode = document.getElementById('knockerNoiseMode').value;
    const hexGroup = document.getElementById('knockerHexGroup');
    if (hexGroup) {
        hexGroup.style.display = mode === 'custom' ? 'flex' : 'none';
    }
}

function validateKnockerNoise() {
    const mode = document.getElementById('knockerNoiseMode').value;
    let knockerNoise = mode;

    if (mode === 'custom') {
        const hexVal = document.getElementById('knockerNoiseHex')?.value?.trim();
        if (!hexVal) {
            showToast('Please enter a hex value for custom noise mode.', 'error');
            return false;
        }
        const hexRegex = /^[0-9A-Fa-f]+$/;
        if (!hexRegex.test(hexVal)) {
            showToast('Invalid hex value. Please enter a valid hex string (0-9, a-f).', 'error');
            return false;
        }
        knockerNoise = hexVal;
    }

    const regex = /^(none|quic|random|[0-9A-Fa-f]+)$/;
    if (!regex.test(knockerNoise)) {
        showToast('Invalid noise mode. Please use "none", "quic", "random" or a valid hex value.', 'error');
        return false;
    }

    return true;
}

function validateXrayNoises(fields) {
    const [modes, packets, delaysMin, delaysMax] = fields;
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    let submisionError = false;

    modes.forEach((mode, index) => {
        if (Number(delaysMin[index]) > Number(delaysMax[index])) {
            showToast('The minimum noise delay should be smaller or equal to maximum!', 'error');
            submisionError = true;
            return;
        }

        switch (mode) {
            case 'base64': {
                if (!base64Regex.test(packets[index])) {
                    showToast('The Base64 noise packet is not a valid base64 value!', 'error');
                    submisionError = true;
                }

                break;
            }
            case 'rand': {
                if (!(/^\d+-\d+$/.test(packets[index]))) {
                    showToast('The Random noise packet should be a range like 0-10 or 10-30!', 'error');
                    submisionError = true;
                }

                const [min, max] = packets[index].split("-").map(Number);

                if (min > max) {
                    showToast('The minimum Random noise packet should be smaller or equal to maximum!', 'error');
                    submisionError = true;
                }

                break;
            }
            case 'hex': {
                if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(packets[index]))) {
                    showToast('The Hex noise packet is not a valid hex value! It should have even length and consisted of 0-9, a-f and A-F.', 'error');
                    submisionError = true;
                }

                break;
            }
            case 'array': {
                const valid = packets[index]
                    .split(',')
                    .every(n => /^\d+$/.test(n) && +n >= 0 && +n <= 255);

                if (!valid) {
                    showToast('The values should be comma separated numbers between 0-255', 'error');
                    submisionError = true;
                }

                break;
            }
        }
    });

    return !submisionError;
}

function validateEchConfig() {
    const echServerName = getElmValue("echServerName");

    if (echServerName && !isDomain(echServerName)) {
        showToast('The ECH Server Name should be a domain!', 'error');
        return false;
    }

    return true;
}

function validateUpstreamProxy() {
    const upstreamProxy = getElmValue('upstreamProxy');

    if (upstreamProxy && !isValidHostName(upstreamProxy, true)) {
        showToast('Invalid Upstream proxy! It can be either IP:Port or Domain:Port', 'error');
        return false;
    }

    return true;
}

function validateTelegramToken() {
    const token = document.getElementById('telegramBotToken').value.trim();
    if (!token) return true;
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
        showToast('Invalid Bot Token format! It should look like: 1234567890:ABCdef12345', 'error');
        return false;
    }
    return true;
}

function validateTelegramAdminId() {
    const id = document.getElementById('telegramAdminId').value.trim();
    if (!id) return true;
    if (!/^\d+$/.test(id)) {
        showToast('Admin Telegram ID must be numeric! Get your ID from @userinfobot', 'error');
        return false;
    }
    return true;
}

function validateSettings() {
    const configForm = document.getElementById('configForm');
    const formData = new FormData(configForm);

    const fields = [
        'udpXrayNoiseMode',
        'udpXrayNoisePacket',
        'udpXrayNoiseDelayMin',
        'udpXrayNoiseDelayMax',
        'udpXrayNoiseCount'
    ].map(field => formData.getAll(field));

    const validations = [
        validateRemoteDNS(),
        validateSanctionDns(),
        validateLocalDNS(),
        validateWarpDNS(),
        validateMultipleHostNames(),
        validateProxyIPs(),
        validateNAT64Prefixes(),
        validateWarpEndpoints(),
        validateMinMax(),
        validateUpstreamProxy(),
        validateChainProxy(),
        validateCustomCdn(),
        validateKnockerNoise(),
        validateXrayNoises(fields),
        validateCustomRules(),
        validateEchConfig(),
        validateTelegramToken(),
        validateTelegramAdminId()
    ];

    if (!validations.every(Boolean)) {
        return false;
    }

    const form = Object.fromEntries(formData.entries());
    const [modes, packets, delaysMin, delaysMax, counts] = fields;

    form.xrayUdpNoises = modes.map((mode, index) => ({
        type: mode,
        packet: packets[index],
        delay: `${delaysMin[index]}-${delaysMax[index]}`,
        count: counts[index]
    }));

    form.ports = [
        ...defaultHttpPorts,
        ...defaultHttpsPorts
    ].filter(port => formData.has(port.toString()));

    checkboxElements.forEach(elm => {
        form[elm.id] = formData.has(elm.id);
    });

    selectElements.forEach(elm => {
        let value = form[elm.id];
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        form[elm.id] = value;
    });

    inputElements.forEach(elm => {
        if (typeof form[elm.id] === 'string') {
            form[elm.id] = form[elm.id].trim();
        }
    });

    numInputElements.forEach(elm => {
        form[elm.id] = Number(form[elm.id].trim());
    });

    textareaElements.forEach(elm => {
        const key = elm.id;
        const value = form[key];
        form[key] = value?.split('\n').map(val => val.trim()).filter(Boolean) || [];
    });

    return form;
}

function logout(event) {
    if (event) event.preventDefault();
    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(response => response.json())
        .then(({ success, status, message }) => {
            if (!success) {
                throw new Error(`status ${status} - ${message}`);
            }

            window.location.href = '/login';
        })
        .catch(error => console.error("Logout error:", error.message || error));
}

function resetPassword(event) {
    if (event) event.preventDefault();
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
        .then(({ success, status, message }) => {
            if (!success) {
                passwordError.textContent = `⚠️ ${message}`;
                throw new Error(`status ${status} - ${message}`);
            }

            showToast("Password changed successfully! 👍", 'success');
            window.location.href = '/login';

        })
        .catch(error => console.error("Reset password error:", error.message || error))
        .finally(() => {
            resetPassModal.style.display = "none";
            document.body.style.overflow = "";
        });
}

function renderPortsBlock(ports) {
    let noneTlsPortsBlock = '', tlsPortsBlock = '';
    const totalPorts = [
        ...(window.origin.includes('workers.dev') ? defaultHttpPorts : []),
        ...defaultHttpsPorts
    ];

    totalPorts.forEach(port => {
        const isChecked = ports.includes(port) ? 'checked' : '';
        let clss = '', handler = '';

        if (defaultHttpsPorts.includes(port)) {
            clss = 'class="https"';
            handler = 'onclick="handlePortChange(event)"';
        }

        const portBlock = `
            <div class="routing">
                <input type="checkbox" name=${port} ${clss} value="true" ${isChecked} ${handler}>
                <label>${port}</label>
            </div>`;

        defaultHttpsPorts.includes(port)
            ? tlsPortsBlock += portBlock
            : noneTlsPortsBlock += portBlock;
    });

    document.getElementById("tls-ports").innerHTML = tlsPortsBlock;

    if (noneTlsPortsBlock) {
        document.getElementById("non-tls-ports").innerHTML = noneTlsPortsBlock;
        document.getElementById("none-tls").style.display = 'flex';
    }
}

function addUdpNoise(isManual, noiseIndex, udpNoise) {
    const index = noiseIndex ?? globalThis.xrayNoiseCount;
    const noise = udpNoise || {
        type: 'rand',
        packet: '50-100',
        delay: '1-5',
        applyTo: 'ip',
        count: 5
    };

    const container = document.createElement('div');
    container.className = "noise-item";
    container.id = `udp-noise-${index + 1}`;

    container.innerHTML = `
        <div class="header-container" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; position: relative;">
            <h4 style="font-size: 0.85rem; font-weight: 600;">Noise ${index + 1}</h4>
            <button type="button" class="delete-noise" title="Delete noise" style="color: #ef4444; background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; display: flex; align-items: center; justify-content: center; transition: opacity 0.2s;">
                🗑️
            </button>      
        </div>
        <div class="section" style="display: flex; flex-direction: column; gap: 8px;">
            <div class="form-control" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">😵‍💫 Mode</label>
                <div>
                    <select class="neon-input" name="udpXrayNoiseMode" style="width: 100%;">
                        <option value="base64" ${noise.type === 'base64' ? 'selected' : ''}>Base64</option>
                        <option value="rand" ${noise.type === 'rand' ? 'selected' : ''}>Random</option>
                        <option value="str" ${noise.type === 'str' ? 'selected' : ''}>String</option>
                        <option value="hex" ${noise.type === 'hex' ? 'selected' : ''}>Hex</option>
                        <option value="array" ${noise.type === 'array' ? 'selected' : ''}>Array</option>
                    </select>
                </div>
            </div>
            <div class="form-control" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">📦 Packet</label>
                <div>
                    <input class="neon-input" type="text" name="udpXrayNoisePacket" value="${noise.packet}">
                </div>
            </div>
            <div class="form-control" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">🎚️ Count</label>
                <div>
                    <input class="neon-input" type="number" name="udpXrayNoiseCount" value="${noise.count}" min="1" required>
                </div>
            </div>
            <div class="form-control" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">🕞 Delay</label>
                <div class="min-max" style="display: flex; gap: 8px; align-items: center;">
                    <input class="neon-input" type="number" name="udpXrayNoiseDelayMin"
                        value="${noise.delay.split('-')[0]}" min="1" required style="flex: 1;">
                    <span style="color: var(--text-muted);"> - </span>
                    <input class="neon-input" type="number" name="udpXrayNoiseDelayMax"
                        value="${noise.delay.split('-')[1]}" min="1" required style="flex: 1;">
                </div>
            </div>
        </div>`;

    container.querySelector(".delete-noise").addEventListener('click', deleteUdpNoise);
    container.querySelector("select").addEventListener('change', generateUdpNoise);

    document.getElementById("noises").append(container);
    if (isManual) enableApplyButton();
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

    const noisePacket = event.target.closest(".noise-item").querySelector('[name="udpXrayNoisePacket"]');

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
        showToast('You cannot delete all noises!', 'error');
        return;
    }

    showConfirm(
        '⚠️ This will delete the noise.\n\n❓ Are you sure?',
        () => {
            event.target.closest(".noise-item").remove();
            enableApplyButton();
            globalThis.xrayNoiseCount--;
        }
    );
}

function renderUdpNoiseBlock(xrayUdpNoises) {
    document.getElementById("noises").innerHTML = '';
    xrayUdpNoises.forEach((noise, index) => {
        addUdpNoise(false, index, noise);
    });

    globalThis.xrayNoiseCount = xrayUdpNoises.length;
}

let editingUsername = null;

function statusBadge(user) {
    const now = new Date();
    const expires = new Date(user.expiresAt);
    if (!user.active) return '<span style="color:gray;">⏸ Disabled</span>';
    if (expires < now) return '<span style="color:red;">❌ Expired</span>';
    return '<span style="color:green;">✅ Active</span>';
}

function calcDaysLeft(expiresAt) {
    const diff = new Date(expiresAt) - new Date();
    return Math.ceil(diff / 86400000);
}

async function loadUsers() {
    try {
        const res = await fetch('/panel/users', { credentials: 'include' });
        const { success, body } = await res.json();
        if (!success) return;
        renderUsers(body || []);
    } catch (err) {
        console.error('Load users error:', err);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => {
        const subUrl = `${window.origin}/sub/user/${user.subPath}`;
        return `<tr>
            <td><b>${user.username}</b></td>
            <td>${new Date(user.expiresAt).toLocaleDateString()} ${calcDaysLeft(user.expiresAt) >= 0 ? `(${calcDaysLeft(user.expiresAt)}d)` : ''}</td>
            <td>${statusBadge(user)}</td>
            <td>${user.note || '-'}</td>
            <td class="actions-cell">
                <button class="action-btn" title="Copy subscription URL" onclick="copyUserSub('${subUrl}')">
                    📋
                </button>
                <button class="action-btn" title="Edit user" onclick="openUserEdit('${user.username}')">
                    ✏️
                </button>
                <button class="action-btn danger" title="Delete user" onclick="deleteUser('${user.username}')">
                    🗑️
                </button>
            </td>
        </tr>`;
    }).join('');
}

function copyUserSub(url) {
    navigator.clipboard.writeText(url)
        .then(() => showToast('Subscription URL copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy.', 'warning'));
}

async function addUser() {
    const username = document.getElementById('addUserUsername').value.trim();
    const days = parseInt(document.getElementById('addUserDays').value) || 30;
    const note = document.getElementById('addUserNote').value.trim();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        showToast('Invalid username. Use 3-20 alphanumeric characters or underscores.', 'error');
        return;
    }

    document.body.style.cursor = 'wait';
    try {
        const res = await fetch('/panel/users', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, days, note })
        });
        const { success, message } = await res.json();
        if (!success) {
            showToast(`${message}`, 'warning');
            document.body.style.cursor = 'default';
            return;
        }
        document.getElementById('addUserUsername').value = '';
        document.getElementById('addUserNote').value = '';
        showToast('User created!', 'success');
        loadUsers();
    } catch (err) {
        showToast('Failed to create user.', 'warning');
    } finally {
        document.body.style.cursor = 'default';
    }
}

async function openUserEdit(username) {
    editingUsername = username;
    document.body.style.cursor = 'wait';
    try {
        const res = await fetch(`/panel/users/${username}`, { credentials: 'include' });
        const { success, body } = await res.json();
        if (!success || !body) {
            showToast('User not found.', 'warning');
            document.body.style.cursor = 'default';
            return;
        }
        const editUsernameElm = document.getElementById('editUserUsername');
        if (editUsernameElm) editUsernameElm.textContent = body.username;
        document.getElementById('editUserDays').value = 0;
        document.getElementById('editUserNote').value = body.note || '';
        document.getElementById('editUserActive').value = body.active ? 'true' : 'false';
        document.getElementById('userEditModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } catch (err) {
        showToast('Failed to load user.', 'warning');
    } finally {
        document.body.style.cursor = 'default';
    }
}

function closeUserEdit() {
    document.getElementById('userEditModal').style.display = 'none';
    document.body.style.overflow = '';
    editingUsername = null;
}

async function saveUserEdit() {
    if (!editingUsername) return;
    const days = parseInt(document.getElementById('editUserDays').value) || 0;
    const note = document.getElementById('editUserNote').value.trim();
    const active = document.getElementById('editUserActive').value === 'true';

    document.body.style.cursor = 'wait';
    try {
        const res = await fetch(`/panel/users/${editingUsername}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ days, note, active })
        });
        const { success, message } = await res.json();
        if (!success) {
            showToast(`${message}`, 'warning');
            document.body.style.cursor = 'default';
            return;
        }
        showToast('User updated!', 'success');
        closeUserEdit();
        loadUsers();
    } catch (err) {
        showToast('Failed to update user.', 'warning');
    } finally {
        document.body.style.cursor = 'default';
    }
}

async function deleteUser(username) {
    showConfirm(
        `⚠️ Delete user "${username}"? This cannot be undone!`,
        async () => {
            document.body.style.cursor = 'wait';
            try {
                const res = await fetch(`/panel/users/${username}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const { success, message } = await res.json();
                if (!success) {
                    showToast(`${message}`, 'warning');
                    document.body.style.cursor = 'default';
                    return;
                }
                showToast('🗑️ User deleted.', 'info');
                loadUsers();
            } catch (err) {
                showToast('Failed to delete user.', 'warning');
            } finally {
                document.body.style.cursor = 'default';
            }
        }
    );
}

function deleteUserConfirm() {
    if (editingUsername) deleteUser(editingUsername);
}

// Tab navigation handler
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // On page load, find the active tab and show it, while hiding others
    const activeBtn = document.querySelector('.tab-btn.active');
    const activeTabName = activeBtn ? activeBtn.getAttribute('data-tab') : 'common';

    tabContents.forEach(content => {
        const tabName = content.getAttribute('data-tab') || content.id.replace('tab-', '');
        if (tabName === activeTabName) {
            content.style.display = 'block';
            content.classList.add('active');
        } else {
            content.style.display = 'none';
            content.classList.remove('active');
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // 1. Remove 'active' class from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // 2. Add 'active' class to clicked button
            button.classList.add('active');

            // 3. Hide all .tab-content sections (display: none)
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            // 4. Show the matching .tab-content section (display: block)
            const targetContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`) || document.getElementById(`tab-${tabName}`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
}

// Run theme and tabs initialization immediately when script starts
updateThemeUI();
initTabs();

// Run verification and setup event listeners when DOM is fully loaded as a backup
document.addEventListener('DOMContentLoaded', () => {
    updateThemeUI();
    initTabs();
});

// Load users table after settings load
setTimeout(loadUsers, 1500);

// Data for Supported Applications per Platform
const PLATFORM_APPS = {
    android: [
        {
            name: 'v2rayNG',
            tag: 'پیشنهاد اصلی',
            desc: 'محبوب‌ترین و پایدارترین برنامه برای گوشی‌های اندروید با کاربری بسیار ساده',
            core: 'xray',
            links: [
                { label: 'گوگل پلی', url: 'https://play.google.com/store/apps/details?id=com.v2ray.ang', icon: 'download' },
                { label: 'گیت‌هاب', url: 'https://github.com/2dust/v2rayNG/releases', icon: 'open_in_new' }
            ]
        },
        {
            name: 'Sing-box',
            tag: 'پیشرفته و سریع',
            desc: 'هسته پرسرعت با قابلیت افزودن مستقیم با ۱ کلیک',
            core: 'sing-box',
            links: [
                { label: 'گوگل پلی', url: 'https://play.google.com/store/apps/details?id=io.nekohasekai.sfa', icon: 'download' },
                { label: 'گیت‌هاب', url: 'https://github.com/SagerNet/sing-box/releases', icon: 'open_in_new' }
            ]
        }
    ],
    ios: [
        {
            name: 'Streisand',
            tag: 'پیشنهاد اصلی',
            desc: 'بهترین و ساده‌ترین نرم‌افزار رایگان برای آیفون و آیپد',
            core: 'xray',
            links: [
                { label: 'اپ استور (App Store)', url: 'https://apps.apple.com/us/app/streisand/id6450534064', icon: 'download' }
            ]
        },
        {
            name: 'V2Box',
            tag: 'رایگان و محبوب',
            desc: 'دارای اسکن آسان بارکد و اتصال تک‌لمسی در iOS',
            core: 'xray',
            links: [
                { label: 'اپ استور (App Store)', url: 'https://apps.apple.com/us/app/v2box-v2ray-client/id6446814065', icon: 'download' }
            ]
        },
        {
            name: 'FoXray',
            tag: 'کیفیت بالا',
            desc: 'نرم‌افزار حرفه‌ای با پشتیبانی از تمامی پروتکل‌ها',
            core: 'xray',
            links: [
                { label: 'اپ استور (App Store)', url: 'https://apps.apple.com/us/app/foxray/id6448898396', icon: 'download' }
            ]
        }
    ],
    windows: [
        {
            name: 'v2rayN',
            tag: 'پیشنهاد اصلی ویندوز',
            desc: 'نرم‌افزار استاندارد، سبک و کامل برای لپ‌تاپ و کامپیوترهای ویندوزی',
            core: 'xray',
            links: [
                { label: 'دانلود از گیت‌هاب', url: 'https://github.com/2dust/v2rayN/releases', icon: 'download' }
            ]
        },
        {
            name: 'NekoRay',
            tag: 'محیط زیبا',
            desc: 'کلاینت مدرن با پشتیبانی از VPN Mode در ویندوز',
            core: 'sing-box',
            links: [
                { label: 'دانلود از گیت‌هاب', url: 'https://github.com/MatsuriDayo/nekoray/releases', icon: 'download' }
            ]
        }
    ],
    mac: [
        {
            name: 'V2Box for Mac',
            tag: 'پیشنهاد اصلی مک',
            desc: 'نرم‌افزار یکپارچه و بهینه‌شده برای مک‌بوک و سیستم‌های اپل سیلیکون',
            core: 'xray',
            links: [
                { label: 'مک اپ استور', url: 'https://apps.apple.com/us/app/v2box-v2ray-client/id6446814065', icon: 'download' }
            ]
        },
        {
            name: 'FoXray',
            tag: 'پشتیبانی عالی',
            desc: 'کلاینت سازگار با macOS',
            core: 'xray',
            links: [
                { label: 'مک اپ استور', url: 'https://apps.apple.com/us/app/foxray/id6448898396', icon: 'download' }
            ]
        }
    ]
};

// State Variables
let currentPlatform = 'android';
let currentMode = 'normal'; // 'normal', 'fragment', 'warp'

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    detectUserPlatform();
    setupEventListeners();
    updateUI();
    checkConnectionStatus();
});

// Detect user OS / Platform automatically
function detectUserPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        currentPlatform = 'android';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        currentPlatform = 'ios';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
        currentPlatform = 'mac';
    } else if (/Win/i.test(userAgent)) {
        currentPlatform = 'windows';
    } else {
        currentPlatform = 'android';
    }

    // Set active tab
    document.querySelectorAll('.platform-tab').forEach(tab => {
        if (tab.dataset.platform === currentPlatform) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Platform tabs
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentPlatform = target.dataset.platform;
            updateUI();
        });
    });

    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            currentMode = target.dataset.mode;
            updateSubLink();
        });
    });

    // Copy buttons
    document.getElementById('copySubBtn').addEventListener('click', () => {
        const subUrl = getSubscriptionUrl();
        copyTextToClipboard(subUrl, 'لینک اتصال هوشمند با موفقیت کپی شد! ✅');
    });

    document.getElementById('copyInputBtn').addEventListener('click', () => {
        const subUrl = getSubscriptionUrl();
        copyTextToClipboard(subUrl, 'آدرس لینک کپی شد! ✅');
    });

    document.getElementById('modalCopyBtn').addEventListener('click', () => {
        const subUrl = getSubscriptionUrl();
        copyTextToClipboard(subUrl, 'لینک اتصال کپی شد! ✅');
    });

    // Direct Import Button (One-click)
    document.getElementById('directImportBtn').addEventListener('click', () => {
        const subUrl = getSubscriptionUrl();
        openDirectInApp(subUrl);
    });

    // QR Code Modal
    document.getElementById('showQrBtn').addEventListener('click', openQrModal);
    document.getElementById('closeQrModalBtn').addEventListener('click', closeQrModal);
    document.getElementById('qrModalBackdrop').addEventListener('click', closeQrModal);

    // IP & Connection Check Button
    document.getElementById('checkIpBtn').addEventListener('click', checkConnectionStatus);
}

// Generate the appropriate Subscription URL
function getSubscriptionUrl(core = 'xray') {
    const url = new URL(`./sub/${currentMode}`, window.location.href);
    url.searchParams.set('app', core);
    const modeName = currentMode === 'fragment' ? 'فرگمنت' : (currentMode === 'warp' ? 'وارپ' : 'هوشمند');
    url.hash = `🚀 BPB ${modeName}`;
    return url.href;
}

// Update the Apps container and Links
function updateUI() {
    renderApps();
    updateSubLink();
    updateTutorialText();
}

// Render apps list for current platform
function renderApps() {
    const container = document.getElementById('appsContainer');
    container.innerHTML = '';

    const apps = PLATFORM_APPS[currentPlatform] || PLATFORM_APPS.android;
    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-badge-card';

        const header = document.createElement('div');
        header.className = 'app-badge-header';
        header.innerHTML = `
            <span class="app-badge-title">${app.name}</span>
            <span class="app-badge-tag">${app.tag}</span>
        `;

        const desc = document.createElement('p');
        desc.className = 'app-badge-desc';
        desc.textContent = app.desc;

        const linksDiv = document.createElement('div');
        linksDiv.className = 'app-download-links';

        app.links.forEach(link => {
            const a = document.createElement('a');
            a.className = 'download-link';
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.innerHTML = `
                <span class="material-symbols-rounded">${link.icon}</span>
                <span>${link.label}</span>
            `;
            linksDiv.appendChild(a);
        });

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(linksDiv);
        container.appendChild(card);
    });
}

// Update input preview value
function updateSubLink() {
    const subUrl = getSubscriptionUrl();
    const input = document.getElementById('subUrlInput');
    if (input) {
        input.value = subUrl;
    }
}

// Update guide text based on platform
function updateTutorialText() {
    const step1 = document.getElementById('guideStep1Text');
    const step2 = document.getElementById('guideStep2Text');

    if (currentPlatform === 'android') {
        step1.textContent = 'برنامه v2rayNG یا Sing-box را باز کنید و دکمه «+» (یا علامت سه‌خط ➔ Subscription Group) را بزنید و گزینه Import config from clipboard را لمس کنید.';
        step2.textContent = 'روی منوی سه‌نقطه بالای صفحه بزنید و «Update subscription» را انتخاب کنید تا لیست سرورهای پرسرعت نمایش داده شوند.';
    } else if (currentPlatform === 'ios') {
        step1.textContent = 'برنامه Streisand یا V2Box را در آیفون باز کرده و دکمه «+» یا «Add Subscription» را لمس کنید و لینک کپی شده را قرار دهید.';
        step2.textContent = 'گزینه Update یا کشیدن صفحه به پایین را انجام دهید تا سرورها لود شوند.';
    } else if (currentPlatform === 'windows') {
        step1.textContent = 'نرم‌افزار v2rayN را باز کنید، منوی Subscription Group را باز کرده و لینک را در قسمت URL اضافه کنید.';
        step2.textContent = 'کلیدهای ترکیبی Ctrl + U را بزنید یا دکمه Update Subscription را کلیک کنید.';
    } else {
        step1.textContent = 'نرم‌افزار V2Box را باز کرده و لینک اتصال را در بخش Subscriptions اضافه کنید.';
        step2.textContent = 'دکمه Update را زده و یکی از سرورها را برای اتصال انتخاب کنید.';
    }
}

// Open Direct in App via deep-links
function openDirectInApp(subUrl) {
    // Try Sing-box URL scheme first if applicable, or generic clipboard import
    const singboxUrl = `sing-box://import-remote-profile?url=${encodeURIComponent(subUrl)}`;
    const v2rayngUrl = `v2rayng://install-sub?url=${encodeURIComponent(subUrl)}`;

    // Copy to clipboard first so user has it ready
    copyTextToClipboard(subUrl, 'لینک در کلیپ‌بورد کپی شد و تلاش برای بازکردن برنامه انجام شد! 🚀');

    // Attempt direct intent/app link
    if (currentPlatform === 'android') {
        window.location.href = v2rayngUrl;
        setTimeout(() => {
            window.location.href = singboxUrl;
        }, 800);
    } else {
        window.location.href = singboxUrl;
    }
}

// Copy to Clipboard with Toast Notification
function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }).catch(() => {
            fallbackCopy(text, successMsg);
        });
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        showToast(successMsg);
    } catch (e) {
        showToast('لطفاً آدرس موجود در کادر را به صورت دستی کپی کنید.');
    }
    document.body.removeChild(input);
}

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    msgEl.textContent = message;
    toast.hidden = false;

    setTimeout(() => {
        toast.hidden = true;
    }, 3500);
}

// QR Code Modal handling
function openQrModal() {
    const modal = document.getElementById('qrModal');
    const container = document.getElementById('qrcodeContainer');
    modal.hidden = false;

    container.innerHTML = '<div class="loader-spinner"></div>';

    const subUrl = getSubscriptionUrl();
    const qrUrl = new URL('./qrcode', window.location.href);
    qrUrl.searchParams.set('data', subUrl);
    qrUrl.searchParams.set('nocache', Date.now().toString());

    fetch(qrUrl, { method: 'POST' })
        .then(res => {
            if (!res.ok) throw new Error('Failed to generate QR');
            return res.blob();
        })
        .then(blob => {
            container.innerHTML = '';
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            img.alt = 'QR Code';
            container.appendChild(img);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p style="color:#ef4444; font-size:0.85rem;">خطا در ساخت بارکد. لطفاً از دکمه کپی لینک استفاده کنید.</p>';
        });
}

function closeQrModal() {
    document.getElementById('qrModal').hidden = true;
}

// Live IP & Connection Status Checker
async function checkConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    const ipEl = document.getElementById('userIp');
    const locEl = document.getElementById('userLocation');

    statusEl.innerHTML = '<span style="color:#3b82f6;">در حال بررسی وضعیت اینترنت... ⏳</span>';
    ipEl.textContent = '---';
    locEl.textContent = '---';

    try {
        const res = await fetch(`https://ipapi.co/json/?nocache=${Date.now()}`);
        if (!res.ok) throw new Error('IP check failed');
        const data = await res.json();

        const isIran = (data.country_code === 'IR');
        ipEl.textContent = data.ip || 'نامشخص';
        locEl.textContent = `${data.country_name || 'نامشخص'} (${data.org || data.asn || 'سرویس‌دهنده'})`;

        if (isIran) {
            statusEl.innerHTML = '<span style="color:#ef4444; font-weight:bold;">⚠️ فیلترشکن شما خاموش است (متصل به اینترنت ایران)</span>';
        } else {
            statusEl.innerHTML = '<span style="color:#10b981; font-weight:bold;">🎉 تبریک! فیلترشکن شما متصل و فعال است (اینترنت آزاد)</span>';
        }
    } catch (e) {
        // Fallback using ip-api via worker panel API
        try {
            const fallbackRes = await fetch('./panel/my-ip', { method: 'POST', body: '' });
            const json = await fallbackRes.json();
            if (json && json.data) {
                const isIran = (json.data.countryCode === 'IR');
                ipEl.textContent = json.data.query || 'نامشخص';
                locEl.textContent = `${json.data.country || 'نامشخص'} (${json.data.isp || 'سرویس‌دهنده'})`;
                if (isIran) {
                    statusEl.innerHTML = '<span style="color:#ef4444; font-weight:bold;">⚠️ فیلترشکن شما خاموش است (اینترنت داخلی)</span>';
                } else {
                    statusEl.innerHTML = '<span style="color:#10b981; font-weight:bold;">🎉 اینترنت آزاد متصل است!</span>';
                }
                return;
            }
        } catch (err2) {
            // ignore
        }

        statusEl.innerHTML = '<span style="color:#94a3b8;">اطلاعات آی‌پی دریافت نشد (بررسی کنید اینترنت متصل باشد).</span>';
    }
}

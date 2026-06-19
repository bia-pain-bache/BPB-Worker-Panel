(() => {
    const D = {
        en: {
            common: {
                help: 'Help',
                enabled: 'Enabled',
                disabled: 'Disabled',
                loading: 'Loading...',
                apply: 'Apply',
                update: 'Update',
                login: 'Login',
                logout: 'Log out',
                copyAll: 'Copy all',
                lang: 'EN'
            },
            panel: {
                settingsTitle: 'Settings',
                common: {
                    title: 'Common',
                    localDNS: '🏚️ Local DNS',
                    antiSanctionDNS: '🌏 Anti Sanction DNS',
                    fakeDNS: '🧢 Fake DNS',
                    ipv6: '🔛 IPv6',
                    allowLAN: '⛔ Allow connections from LAN',
                    logLevel: '🎚️ Log Level',
                    logLevelNone: 'Disabled',
                    logLevelWarning: 'Warning',
                    logLevelError: 'Error',
                    logLevelInfo: 'Info',
                    logLevelDebug: 'Debug'
                },
                vlTr: {
                    title: 'VLESS - Trojan',
                    remoteDNS: '🌏 Remote DNS',
                    upstreamProxy: '🚪 Upstream TCP Proxy',
                    chainProxy: '✈️ Chain Proxy',
                    cleanIPs: '✨ Clean IPs / Domains',
                    scannerTitle: 'Scanner',
                    protocols: '⚙️ Protocols',
                    tlsPorts: '🔒 TLS Ports',
                    nonTlsPorts: '🔓 non-TLS Ports',
                    fingerprint: '👆 Fingerprint',
                    bestInterval: '🔄 Best Interval',
                    tcpFastOpen: '⏩ TCP Fast Open',
                    echTitle: 'ECH',
                    enableECH: '🎭 ECH',
                    echServerName: '🧢 ECH Server Name',
                    proxyIPTitle: 'Proxy IP',
                    mode: '🎚️ Mode',
                    proxyIPs: '📍 Proxy IPs / Domains',
                    proxyIPsLink: 'Proxy IPs',
                    nat64Prefixes: '📍 NAT64 Prefixes',
                    nat64PrefixesLink: 'NAT64 prefixes',
                    customCdnTitle: 'Custom CDN',
                    addresses: '💀 Addresses',
                    host: '💀 Host',
                    sni: '💀 SNI'
                },
                fragment: {
                    title: 'Xray Fragment',
                    mode: '🎚️ Mode',
                    modeCustom: 'Custom',
                    modeLow: 'Low',
                    modeMedium: 'Medium',
                    modeHigh: 'High',
                    modeSevere: 'Severe',
                    length: '📐 Length',
                    interval: '🕞 Interval',
                    maxSplit: '⛓️ Max Split',
                    packets: '📦 Packets'
                },
                externalRaw: {
                    title: 'External Raw Configs',
                    subscriptions: '🔗 Subscriptions',
                    singleConfigs: '➕ Single Configs'
                },
                warpGeneral: {
                    title: 'Warp General',
                    remoteDNS: '🌏 remote DNS',
                    endpoints: '✨ Endpoints',
                    bestInterval: '🔄 Best Interval',
                    warpAccounts: '♻️ Warp Accounts'
                },
                warpPro: {
                    title: 'Warp PRO',
                    mahsaNoise: 'MahsaNG Noise',
                    clashAmnezia: 'Clash - Amnezia Noise',
                    v2rayNoise: 'v2rayNG - v2rayN Noise',
                    knockerMode: '😵‍💫 Mode',
                    knockerModeTip: "Fill in 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'",
                    count: '🎚️ Count',
                    size: '📏 Size',
                    delay: '🕞 Delay',
                    noiseLabel: 'Noise {n}',
                    noiseMode: '😵‍💫 Mode',
                    packet: '📦 Packet'
                },
                routing: {
                    title: 'Routing Rules',
                    preset: 'Preset Rules',
                    bypassRules: '🟩 Bypass rules',
                    blockRules: '🟥 Block rules',
                    custom: 'Custom Rules',
                    customBypass: '🟩 Bypass IPs / Domains',
                    customBlock: '🟥 Block IPs / Domains',
                    sanction: 'Sanction Rules',
                    sanctionBypass: '🟩 Bypass rules',
                    sanctionBypassDomains: '🟩 Bypass Domains',
                    iran: 'Iran',
                    china: 'China',
                    russia: 'Russia',
                    ads: 'Ads.',
                    porn: 'Porn',
                    quic: 'QUIC',
                    malware: 'Malware',
                    phishing: 'Phishing',
                    cryptominers: 'Cryptominers'
                },
                apply: {
                    reset: 'Reset panel settings to default',
                    export: 'Export panel settings',
                    import: 'Import panel settings'
                },
                sub: {
                    title: 'Subscriptions',
                    normal: 'Normal',
                    fragment: 'Fragment',
                    raw: 'Raw (without settings)',
                    warp: 'Warp',
                    warpPro: 'Warp PRO',
                    qrTitle: 'Display QR code',
                    copyTitle: 'Copy subscription URL',
                    dlTitle: 'Download config',
                    dlZipTitle: 'Download configs zip',
                    normalSub: 'Normal Subscription',
                    fragmentSub: 'Fragment Subscription',
                    rawSub: 'Raw Subscription',
                    warpSub: 'Warp Subscription',
                    warpProSub: 'Warp Pro Subscription'
                },
                doh: 'DNS over HTTPS',
                myIp: {
                    title: 'My IP',
                    info: 'Information',
                    cf: 'Cloudflare targets',
                    other: 'Other targets',
                    ip: 'IP',
                    country: 'Country',
                    city: 'City',
                    isp: 'ISP'
                },
                pwd: {
                    title: 'Change Password',
                    newPwd: 'New Password',
                    confirmPwd: 'Confirm Password',
                    submit: 'Change Password',
                    notMatch: 'Passwords do not match',
                    weak: '⚠️ Password must contain at least one capital letter, one number, and be at least 8 characters long.',
                    success: '✅ Password changed successfully! 👍'
                },
                footer: {
                    changePwd: 'Change Password',
                    logoutTitle: 'Log out'
                },
                alert: {
                    copied: '✅ Copied to clipboard:\n\n{text}',
                    warpConfirm: '⚠️ Are you sure?',
                    warpFail: '⚠️ An error occured, Please try again!\n⛔ {message}',
                    warpSuccess: '✅ Warp configs updated successfully!',
                    needOneProtocol: '⛔ At least one Protocol should be selected!',
                    needOneTlsPort: '⛔ At least one TLS port should be selected!',
                    riskyRules: "⛔ v2ray users should set Geo Assets to Chocolate4U and download assets, otherwise configs won't connect.\n\n❓ Proceed?",
                    resetConfirm: '⚠️ This will reset all panel settings.\n\n❓ Are you sure?',
                    resetSuccess: '✅ Panel settings reset to default successfully!\n💡 Please update your subscriptions.',
                    sessionExpired: '⚠️ Session expired! Please login again.',
                    settingsApplied: '✅ Settings applied successfully!\n💡 Please update your subscriptions.',
                    loading: '⌛ Loading...',
                    invalidDnsUrl: '⛔ Invalid DNS, Please enter a URL.',
                    invalidDnsProto: '⛔ Please enter TCP, DoH or DoT servers.',
                    cfDnsForbidden: '⛔ Cloudflare DNS is not allowed for workers.\n💡 Please use other public DNS servers like Google, Adguard...',
                    invalidHosts: '⛔ Invalid IPs or Domains.\n⚠️ {host}',
                    invalidWarpDns: '⛔ Invalid Warp DNS.\n💡 Please fill in an IPv4 address (UDP DNS).\n\n⚠️ {dns}',
                    invalidLocalDns: '⛔ Invalid local DNS.\n💡 Please fill in an IPv4 address or "localhost".\n\n⚠️ {dns}',
                    invalidIpDomainList: '⛔ Invalid IPs, Domains or IP ranges.\n💡 Please enter each value in a new line.\n\n{list}',
                    invalidDomainList: '⛔ Invalid Domains.\n💡 Please enter each value in a new line.\n\n{list}',
                    invalidIpDomainListShort: '⛔ Invalid IPs or Domains.\n💡 Please enter each value in a new line.\n\n{list}',
                    invalidProxyIPs: '⛔ Invalid proxy IPs.\n💡 Please enter each value in a new line.\n\n{list}',
                    invalidNat64: '⛔ Invalid NAT64 prefix.\n💡 Please enter each prefix in a new line using [].\n\n{list}',
                    invalidEndpoint: '⛔ Invalid endpoint.\n\n{list}',
                    minMax: '⛔ {label}: Minimum cannot be bigger than Maximum!',
                    invalidConfig: '⛔ Invalid Config!\n💡 Standard formats are:\n\n + (socks or socks5 or http)://user:pass@server:port\n + (socks or socks5 or http)://base64@server:port\n + vless://uuid@server:port...\n + vmess://base64\n + trojan://password@server:port...\n + ss://base64@server:port...',
                    configNoUser: '⛔ Invalid Config!\n💡 Config URL should contain UUID or Password.',
                    configBadSec: '⛔ Invalid Config!\n💡 VLESS, VMess or Trojan security can be TLS, Reality or None.',
                    configBadType: '⛔ Invalid Config!\n💡 VLESS, VMess or Trojan transmission can be tcp, ws, grpc or httpupgrade.',
                    cdnAllOrNone: '⛔ All "Custom" fields should be filled or deleted together!',
                    invalidKnockerNoise: '⛔ Invalid noise  mode.\n💡 Please use "none", "quic", "random" or a valid hex value.',
                    noiseDelayMinMax: '⛔ The minimum noise delay should be smaller or equal to maximum!',
                    base64Invalid: '⛔ The Base64 noise packet is not a valid base64 value!',
                    randInvalid: '⛔ The Random noise packet should be a range like 0-10 or 10-30!',
                    randMinMax: '⛔ The minimum Random noise packet should be smaller or equal to maximum!',
                    hexInvalid: '⛔ The Hex noise packet is not a valid hex value!\n💡 It should have even length and consisted of 0-9, a-f and A-F.',
                    arrayInvalid: '⛔ The values should be comma separated numbers between 0-255',
                    echDomain: '⛔ The ECH Server Name should be a domain!',
                    invalidUpstream: '⛔ Invalid Upstream proxy!\n💡 It can be either IP:Port or Domain:Port',
                    noiseDeleteAll: '⛔ You cannot delete all noises!',
                    noiseDeleteConfirm: '⚠️ This will delete the noise.\n\n❓ Are you sure?'
                },
                fragLabel: 'Fragment Length',
                fragInterval: 'Fragment Interval',
                fragMaxSplit: 'Fragment Max Split',
                noiseCount: 'Noise Count',
                noiseSize: 'Noise Size',
                noiseDelay: 'Noise Delay',
                amneziaSize: 'Amnezia Noise Size'
            },
            login: {
                title: 'User Login',
                password: 'Password',
                wrong: '⚠️ Wrong Password!'
            },
            secrets: {
                title: 'Secrets generator',
                uuid: 'Random UUID',
                trPass: 'Random Trojan Password',
                subPath: 'Random Subscription URI path',
                copied: '✅ Copied to clipboard!'
            },
            proxyIp: {
                num: '#',
                proxyIp: 'Proxy IP',
                country: 'Country',
                city: 'City',
                isp: 'ISP',
                loading: 'Loading...',
                failed: 'Failed to get Proxy IPs',
                error: 'Error: {msg}'
            },
            error: {
                title: '❌ Something went wrong!'
            }
        },
        zh: {
            common: {
                help: '帮助',
                enabled: '启用',
                disabled: '禁用',
                loading: '加载中...',
                apply: '应用',
                update: '更新',
                login: '登录',
                logout: '退出',
                copyAll: '复制全部',
                lang: '中'
            },
            panel: {
                settingsTitle: '设置',
                common: {
                    title: '通用',
                    localDNS: '🏚️ 本地 DNS',
                    antiSanctionDNS: '🌏 反制裁 DNS',
                    fakeDNS: '🧢 Fake DNS',
                    ipv6: '🔛 IPv6',
                    allowLAN: '⛔ 允许局域网连接',
                    logLevel: '🎚️ 日志级别',
                    logLevelNone: '关闭',
                    logLevelWarning: '警告',
                    logLevelError: '错误',
                    logLevelInfo: '信息',
                    logLevelDebug: '调试'
                },
                vlTr: {
                    title: 'VLESS - Trojan',
                    remoteDNS: '🌏 远程 DNS',
                    upstreamProxy: '🚪 上游 TCP 代理',
                    chainProxy: '✈️ 链式代理',
                    cleanIPs: '✨ 优选 IP / 域名',
                    scannerTitle: '扫描器',
                    protocols: '⚙️ 协议',
                    tlsPorts: '🔒 TLS 端口',
                    nonTlsPorts: '🔓 非 TLS 端口',
                    fingerprint: '👆 指纹',
                    bestInterval: '🔄 测速间隔',
                    tcpFastOpen: '⏩ TCP 快速打开',
                    echTitle: 'ECH',
                    enableECH: '🎭 ECH',
                    echServerName: '🧢 ECH 服务器名称',
                    proxyIPTitle: '代理 IP',
                    mode: '🎚️ 模式',
                    proxyIPs: '📍 代理 IP / 域名',
                    proxyIPsLink: '代理 IP 列表',
                    nat64Prefixes: '📍 NAT64 前缀',
                    nat64PrefixesLink: 'NAT64 前缀说明',
                    customCdnTitle: '自定义 CDN',
                    addresses: '💀 地址',
                    host: '💀 主机',
                    sni: '💀 SNI'
                },
                fragment: {
                    title: 'Xray 分片',
                    mode: '🎚️ 模式',
                    modeCustom: '自定义',
                    modeLow: '低',
                    modeMedium: '中',
                    modeHigh: '高',
                    modeSevere: '极致',
                    length: '📐 长度',
                    interval: '🕞 间隔',
                    maxSplit: '⛓️ 最大分片',
                    packets: '📦 数据包'
                },
                externalRaw: {
                    title: '外部原始配置',
                    subscriptions: '🔗 订阅',
                    singleConfigs: '➕ 单条配置'
                },
                warpGeneral: {
                    title: 'Warp 通用',
                    remoteDNS: '🌏 远程 DNS',
                    endpoints: '✨ 端点',
                    bestInterval: '🔄 测速间隔',
                    warpAccounts: '♻️ Warp 账户'
                },
                warpPro: {
                    title: 'Warp PRO',
                    mahsaNoise: 'MahsaNG 噪声',
                    clashAmnezia: 'Clash - Amnezia 噪声',
                    v2rayNoise: 'v2rayNG - v2rayN 噪声',
                    knockerMode: '😵‍💫 模式',
                    knockerModeTip: "填入 'none'、'quic'、'random' 或十六进制串(如 'ee0000000108aaaa')",
                    count: '🎚️ 数量',
                    size: '📏 大小',
                    delay: '🕞 延迟',
                    noiseLabel: '噪声 {n}',
                    noiseMode: '😵‍💫 模式',
                    packet: '📦 数据包'
                },
                routing: {
                    title: '路由规则',
                    preset: '预设规则',
                    bypassRules: '🟩 绕过规则',
                    blockRules: '🟥 阻止规则',
                    custom: '自定义规则',
                    customBypass: '🟩 绕过 IP / 域名',
                    customBlock: '🟥 阻止 IP / 域名',
                    sanction: '制裁规则',
                    sanctionBypass: '🟩 绕过规则',
                    sanctionBypassDomains: '🟩 绕过域名',
                    iran: '伊朗',
                    china: '中国',
                    russia: '俄罗斯',
                    ads: '广告',
                    porn: '成人',
                    quic: 'QUIC',
                    malware: '恶意软件',
                    phishing: '钓鱼',
                    cryptominers: '挖矿'
                },
                apply: {
                    reset: '重置面板设置为默认',
                    export: '导出面板设置',
                    import: '导入面板设置'
                },
                sub: {
                    title: '订阅',
                    normal: '普通',
                    fragment: '分片',
                    raw: '原始(无设置)',
                    warp: 'Warp',
                    warpPro: 'Warp PRO',
                    qrTitle: '显示二维码',
                    copyTitle: '复制订阅链接',
                    dlTitle: '下载配置',
                    dlZipTitle: '下载配置压缩包',
                    normalSub: '普通订阅',
                    fragmentSub: '分片订阅',
                    rawSub: '原始订阅',
                    warpSub: 'Warp 订阅',
                    warpProSub: 'Warp Pro 订阅'
                },
                doh: 'DNS over HTTPS',
                myIp: {
                    title: '我的 IP',
                    info: '信息',
                    cf: 'Cloudflare 目标',
                    other: '其他目标',
                    ip: 'IP',
                    country: '国家',
                    city: '城市',
                    isp: '运营商'
                },
                pwd: {
                    title: '修改密码',
                    newPwd: '新密码',
                    confirmPwd: '确认密码',
                    submit: '修改密码',
                    notMatch: '两次输入的密码不一致',
                    weak: '⚠️ 密码至少 8 位,且必须包含至少一个大写字母和一个数字。',
                    success: '✅ 密码修改成功! 👍'
                },
                footer: {
                    changePwd: '修改密码',
                    logoutTitle: '退出登录'
                },
                alert: {
                    copied: '✅ 已复制到剪贴板:\n\n{text}',
                    warpConfirm: '⚠️ 确定要继续吗?',
                    warpFail: '⚠️ 发生错误,请重试!\n⛔ {message}',
                    warpSuccess: '✅ Warp 配置已成功更新!',
                    needOneProtocol: '⛔ 至少要选择一个协议!',
                    needOneTlsPort: '⛔ 至少要选择一个 TLS 端口!',
                    riskyRules: '⛔ v2ray 用户需将 Geo 资源设置为 Chocolate4U 并下载资源,否则配置无法连接。\n\n❓ 是否继续?',
                    resetConfirm: '⚠️ 此操作将重置所有面板设置。\n\n❓ 确定要继续吗?',
                    resetSuccess: '✅ 面板设置已成功重置为默认!\n💡 请更新你的订阅。',
                    sessionExpired: '⚠️ 会话已过期!请重新登录。',
                    settingsApplied: '✅ 设置已成功应用!\n💡 请更新你的订阅。',
                    loading: '⌛ 加载中...',
                    invalidDnsUrl: '⛔ DNS 无效,请输入一个 URL。',
                    invalidDnsProto: '⛔ 请输入 TCP、DoH 或 DoT 服务器。',
                    cfDnsForbidden: '⛔ Workers 不允许使用 Cloudflare DNS。\n💡 请使用其他公共 DNS,如 Google、Adguard…',
                    invalidHosts: '⛔ IP 或域名无效。\n⚠️ {host}',
                    invalidWarpDns: '⛔ Warp DNS 无效。\n💡 请填入 IPv4 地址(UDP DNS)。\n\n⚠️ {dns}',
                    invalidLocalDns: '⛔ 本地 DNS 无效。\n💡 请填入 IPv4 地址或 "localhost"。\n\n⚠️ {dns}',
                    invalidIpDomainList: '⛔ IP、域名或 IP 段无效。\n💡 请每行输入一个值。\n\n{list}',
                    invalidDomainList: '⛔ 域名无效。\n💡 请每行输入一个值。\n\n{list}',
                    invalidIpDomainListShort: '⛔ IP 或域名无效。\n💡 请每行输入一个值。\n\n{list}',
                    invalidProxyIPs: '⛔ 代理 IP 无效。\n💡 请每行输入一个值。\n\n{list}',
                    invalidNat64: '⛔ NAT64 前缀无效。\n💡 请每行输入一个,使用 [] 包裹。\n\n{list}',
                    invalidEndpoint: '⛔ 端点无效。\n\n{list}',
                    minMax: '⛔ {label}:最小值不能大于最大值!',
                    invalidConfig: '⛔ 配置无效!\n💡 标准格式如下:\n\n + (socks 或 socks5 或 http)://user:pass@server:port\n + (socks 或 socks5 或 http)://base64@server:port\n + vless://uuid@server:port...\n + vmess://base64\n + trojan://password@server:port...\n + ss://base64@server:port...',
                    configNoUser: '⛔ 配置无效!\n💡 配置 URL 必须包含 UUID 或密码。',
                    configBadSec: '⛔ 配置无效!\n💡 VLESS、VMess 或 Trojan 的安全方式只能是 TLS、Reality 或 None。',
                    configBadType: '⛔ 配置无效!\n💡 VLESS、VMess 或 Trojan 的传输方式只能是 tcp、ws、grpc 或 httpupgrade。',
                    cdnAllOrNone: '⛔ 所有 "自定义" 字段必须全部填写或一起删除!',
                    invalidKnockerNoise: '⛔ 噪声模式无效。\n💡 请使用 "none"、"quic"、"random" 或有效的十六进制值。',
                    noiseDelayMinMax: '⛔ 最小噪声延迟必须小于或等于最大值!',
                    base64Invalid: '⛔ Base64 噪声包不是有效的 base64 值!',
                    randInvalid: '⛔ Random 噪声包必须是 0-10 或 10-30 这样的区间!',
                    randMinMax: '⛔ Random 噪声包的最小值必须小于或等于最大值!',
                    hexInvalid: '⛔ Hex 噪声包不是有效的十六进制!\n💡 长度必须为偶数,且仅包含 0-9、a-f、A-F。',
                    arrayInvalid: '⛔ 值必须是 0-255 之间的英文逗号分隔数字',
                    echDomain: '⛔ ECH 服务器名称必须是一个域名!',
                    invalidUpstream: '⛔ 上游代理无效!\n💡 必须为 IP:端口 或 域名:端口',
                    noiseDeleteAll: '⛔ 不能删除全部噪声!',
                    noiseDeleteConfirm: '⚠️ 此操作将删除该噪声。\n\n❓ 确定要继续吗?'
                },
                fragLabel: '分片长度',
                fragInterval: '分片间隔',
                fragMaxSplit: '分片最大数',
                noiseCount: '噪声数量',
                noiseSize: '噪声大小',
                noiseDelay: '噪声延迟',
                amneziaSize: 'Amnezia 噪声大小'
            },
            login: {
                title: '用户登录',
                password: '密码',
                wrong: '⚠️ 密码错误!'
            },
            secrets: {
                title: '密钥生成器',
                uuid: '随机 UUID',
                trPass: '随机 Trojan 密码',
                subPath: '随机订阅 URI 路径',
                copied: '✅ 已复制到剪贴板!'
            },
            proxyIp: {
                num: '#',
                proxyIp: '代理 IP',
                country: '国家',
                city: '城市',
                isp: '运营商',
                loading: '加载中...',
                failed: '获取代理 IP 失败',
                error: '错误:{msg}'
            },
            error: {
                title: '❌ 出错了!'
            }
        }
    };

    const getLang = () => {
        const stored = localStorage.getItem('lang');
        if (stored === 'zh' || stored === 'en') return stored;
        return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    };

    const lookup = key => key.split('.').reduce((o, k) => o[k], D[getLang()]);

    window.t = (key, params) => {
        let s = lookup(key);
        if (params) for (const k in params) s = s.replaceAll('{' + k + '}', params[k]);
        return s;
    };

    window.applyI18n = () => {
        document.documentElement.lang = getLang();
        document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
        document.querySelectorAll('[data-i18n-title]').forEach(el => el.title = t(el.dataset.i18nTitle));
        document.querySelectorAll('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
    };

    window.setLang = lang => {
        localStorage.setItem('lang', lang);
        applyI18n();
        const btn = document.getElementById('langToggle');
        if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
    };

    window.toggleLang = () => setLang(getLang() === 'zh' ? 'en' : 'zh');

    const init = () => {
        applyI18n();
        const btn = document.getElementById('langToggle');
        if (btn) btn.textContent = getLang() === 'zh' ? 'EN' : '中';
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

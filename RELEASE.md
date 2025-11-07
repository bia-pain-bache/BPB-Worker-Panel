# 🥳 BPB v4 is here

- Refactore the whole project using TypeScript.
- Added VMess support to Chain Proxies. All main protocols are now supported: **VLESS**, **VMess**, **Trojan**, **Shadowsocks**, **Socks** and **Http**.
- Removed Port 443 restriction for TLS Chain proxies.
- `Socks` and `http` chain proxies should have `username` and `password`, Xray core made this mandatory. Also panel now supports these formats: `(socks or socks5 or http)://user:pass@server:port` and `(socks or socks5 or http):/base64@server:port`.
- Overal Chain Proxy performance improvements.
- Added Warp Remote DNS (IPv4 only). It's highly recommended to use Cloudflare DNS servers for Warp if you wanna change it.
- Made **TCP Fast Open** optional due to some devices and ISPs compatibility. Please note that you have to enable TCP Fast Open on linux manually #1097
- Added `maxSplit` to Fragment settings, please use it only if you understand this feature.
- Added `applyTo` to Xray UDP noises in Warp Pro settings.
- Added `Google AIs` to anti sanction routing rules which includes **Gemini**, **NotebookLLM** and so on.
- Added a `Common` section to settings in order to handle shared settings between **VLESS**, **Trojan** and **Warp** configs and moved `LocalDNS`, `Fake DNS`, `Anti Sanction DNS`, `IPv6` to this section.
- Revised build process to reduce worker.js size up to ~120 KB.
- Added `Log Level` and `Allow connections from LAN` to Common section as new features.
- Changed anti saction DNS to [Shecan](https://shecan.ir/).
- Added `Malware`, `Phishing` and `Cryptominers` block rules. Note that v2ray users should set Geo Assets to Chocolate4U and download assets, otherwise configs won't connect.
- Panel UI improvements.
- Updated docs.
- Fixed website language switch.
- Clash Fake DNS bug fix.
- Bug fix #1116
- And some other bug fixes and improvements.

> [!NOTE]
> Some fields like `IPv6` and `Fake DNS` should be, they will be set to default after upgrading to this version.

> [!CAUTION]
> If you are upgrading from versions below 3.5.1 to 4, you should get subscriptions from panel again.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher.

> [!CAUTION]
> v2rayNG version should be 1.10.26 or higher and v2rayN should be 7.15.4 or higher.

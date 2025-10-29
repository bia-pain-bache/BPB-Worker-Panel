# ⚙️ BPB Panel v4.0.0

- Refactore the whole project using TypeScript.
- Added VMess support to Chain Proxies. All main protocols are now supported: **VLESS**, **VMess**, **Trojan**, **Shadowsocks**, **Socks** and **Http**.
- Improved Chain Proxy performance.
- Made **TCP Fast Open** optional due to some devices and ISPs compatibility. Please note that you have to enable TCP Fast Open on linux manually #1097
- Added `maxSplit` to Fragment settings, please use it only if you understand this feature.
- Added `applyTo` to Xray UDP noises in Warp Pro settings.
- Added `Google AIs` to anti sanction routing rules which includes **Gemini*, **NotebookLLM** and so on.
- Added a `Common` section to settings in order to handle shared settings between **VLESS**, **Trojan** and **Warp** configs.
- Revised build process to reduce worker.js size up to ~120 KB.
- Added `Log Level` and `Allow connections from LAN` to Common section as new features.
- Changed anti saction DNS to [Shecan](https://shecan.ir/).
- Panel UI improvements.
- Updated docs.
- And some other bug fixes and improvements.

> [!NOTE]
> Xray configs are now base on new Xray v25.10.15 format, so v2rayNG will show configs like null:null. You have to wait for developer to adjust to new formats.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher.

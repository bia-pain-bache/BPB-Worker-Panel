# 🥳 A new generation of BPB Panel

> [!CAUTION]
> 1- PLEASE DO NOT UPDATE TO THIS VERSION, otherwise it will break your panel. You can deploy a new one or IF YOU INSIST, update your panel and try to reset settings from Panel. Keep in mind that if updating worked, you have to import Subscriptions from panel again.
> 2- For security reasons and 1101 issue, the whole project is restructured to prevent code exposure and also maintainability.
> 3- Renamed `PROXYIP` environment variable to `PROXY_IP`
> 4- From now on, multiple IPs/domains can be separated by ENTER not comma.

> [!TIP]
> 1- None obfuscated files removed from releases forever, due to code exposures to Cloudflare (possible 1101 errors in future). So please choose a Cloudflare account which haven't returned 1101 before.
> 2- If you are using Workers deployment and got 1101, please delete the worker and change subdomain from `Workers & Pages` > `Subdomain` from right hand toolbar. It will take a few minutes to apply new subdomain.
 
## ⚙️ Bug fixes and Improvements
- Less errors on VLESS protocol.
- Totally blocked UDP on Full Normal, Fragment subscriptions to reduce worker error (Workers are malfunctioning in UDP handling).
- Refactored Panel and improved UI.
- Improved error handling.
- Reduced worker size.
- Fixed lots of bugs. 
- Removed some footprints after build.
- Added `Bypass chatGPT` to routing rules. If you have problem using VLESS, Trojan or single Warp configs (Which return Iran IPs), you can use this option which resolves chatGPT domains using `Shecan` DNS.
- Fixed sing-box client QRcode issue.
- Changed some remaining sing-box routing assets to Chocolate-4U.
- Security patches.

> [!TIP]
> Now you can use chatGPT by both Workerless and single Warp configs, also chatGPT connections using VLESS and Trojan will be completely stable.


### 💡 Full Changelog [ from v3.1.3 to v3.2.3](https://github.com/bia-pain-bache/bpb-worker-panel/compare/v3.1.3...v3.2.3)
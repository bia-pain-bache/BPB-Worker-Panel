# Sanction Rules

Added to routing rules to provide a more stable and solid connection for websites which applied sanctions and are not blocked by ISP.
You can set a desired DNS and choose preset rules or custom rules for bypassing. This feature makes WorkerLess config a special config which not only can access most of blocked addresses but also can bypass sanctions.

> [!CAUTION]
> Please avoid using `Bypass Google` pre-set rule (unless you are a pro and know what's happening), it includes a wide range of addresses which may conflict with your proxy settings and leads to malfunctioning sometimes. It's recommended to fill your single desired addresses in Sanction custom rules instead.

## Import/Export settings

From now on, you can export and import panel settings, this is to make sharing settings with others easier and also is useful when some updates need reseting settings.

> [!WARNING]
> Please export settings and import them after updating to this version to make your panel compatible with this version changes, new deployments do not need to do so.

## Migrate to sing-box 1.12.0

- Implemented new sing-box DNS regarding 1.12.0 migrations
- Fixed DOH with domain addresses issue on sing-box

## Migrate to Xray core 25.5.16

- Considered new DNS inbounds format.

> [!CAUTION]
> You have to update your sing-box clients to 1.12.x before updating panel to this version.  
> You have to update your Xray clients to the latest, v2rayNG should be at least v1.10.2, v2rayN 7.12.5 and MahsaNG v13.  
> NikaNG is removed from supported clients as it's not gonna be maintained anymore, use MahsaNG instead.

## ⚙️ Bug fixes and Improvements

- Added ProxyIP:Port format. You can enter Proxy IP just like before (default port is 443) or enter ProxyIP:Port if you have a Proxy IP on a different port.  
- Fixed Clash Trojan bug in 3.2.5
- Improved performance of all cores on DOH with `https://Domain/dns-query` format.
- Added `Sanction rules` with DNS settings.
- Added fallback Google DoH to Workerless config.
- Fixed UI bug (UDP noises).
- Added new Malware and Phishing geoips for Clash.
- Xray, Sing-box and Clash DNS and routing improvements.
- Revised Sing-box Tun hijack
- Temporarily fixed sing-box DNS strategy due to core bug.
- Fixed Clash DNS block
- Changed Sing-box and Clash NTP servers to Cloudflare.
- Changed warp endpoint scanner to [BPB Warp Scanner](https://github.com/bia-pain-bache/BPB-Warp-Scanner)
- UI improvements
- Bug fix #877 #884 #855
- Updated packages
- Refactored cores and some other bug fixes.

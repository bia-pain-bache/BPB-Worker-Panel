# Migrate to sing-box 1.12.0
- Implemented new sing-box DNS regarding 1.12.0 migrations
- Fixed DOH with domain addresses issue on sing-box

> [!CAUTION]
> You have to update your clients to 1.12.x before updating panel to this version.

## ⚙️ Bug fixes and Improvements
- Added ProxyIP:Port format. You can enter Proxy IP just like before (default port is 443) or enter ProxyIP:Port if you have a Proxy IP on a different port. 
- Fixed Clash Trojan bug in 3.2.5
- Improved performance of all cores on DOH with `https://Domain/dns-query` format.
- Refactored and some other bug fixes.
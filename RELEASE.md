# 💡 Bug fixes & Improvements

- Fixed Cloudflare worker compatibility issue. Please select the newest compatibility date in dashboard if you have manually changed it before.
- **External Raw Configs**: You can add desired subscriptions and URL configs and BPB fetches all configs and integrate them into Raw subscription.
- **Upstream TCP Proxy**: adds a TLS config to `Normal` and `Raw` subscriptions which can be used with upstream proxies like SNI Spoof. It can be `IPv4:Port`, `[IPv6]:Port` or `Domain:Port`.
- Implemented FinalMask feature of Xray core. Please update your clients to the latest version to support this.
- Update Xray UDP Noise and added `Array` noise type, you should enter numbers between 0-255 like `1,100,23,18...` in panel.
- Updated packages.
- Fixed hourly releases.

---

## 💡 Other tips

> [!CAUTION]
> If you are upgrading from versions below 3.5.1 to 4, you should get subscriptions from panel again.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher.

> [!CAUTION]
> Xray clients should be updated to the latest version i.e. v2rayNG, v2rayN and Streisand.

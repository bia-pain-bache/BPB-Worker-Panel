# 💡 Bug fixes & Improvements

- **Telegram Bot Integration**: Added a built-in Telegram bot with inline keyboard menus, subscription delivery, QR code generation, and settings info display. Configure via Panel → Telegram Bot section.
- Fixed Cloudflare worker compatibility issue. Please select the latest compatibility date in dashboard if you have manually changed it before.
- **External Raw Configs**: You can add desired subscriptions and URL configs and BPB fetches all configs and integrate them into Raw subscription.
- **Upstream TCP Proxy**: adds a TLS config to `Normal` and `Raw` subscriptions which can be used with upstream proxies like SNI Spoof. It can be `IPv4:Port`, `[IPv6]:Port` or `Domain:Port`.
- Implemented FinalMask feature of Xray core. Please update your clients to the latest version to support this.
- Update Xray UDP Noise and added `Array` mode, you should enter numbers between 0-255 like `1,100,23,18...` in this field.
- Removed `allowInsecure` from Xray core configs.
- Fixed hourly releases.
- Fixed `undefined` appeared in subscriptions links and Warp regestration. #1270 #1291
- Fixed My IP section.
- Updated packages and docs.
- Improved error handling.

> [!CAUTION]
> 1- No further actions are required if you create a new panel, however it's highly recommended to reset panel settings and update subscriptions if you are upgrading to this version.
> 2- Please update whatever client you use, specially these ones:

|       Client        | Minimum version |  Fragment support  |  Warp Pro support  |
| :-----------------: | :-------------: | :----------------: | :----------------: |
|     **v2rayNG**     |      2.2.3      | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |       16        | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      |     7.22.5      | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     |     1.12.0      | :heavy_check_mark: |        :x:         |
|    **Streisand**    |     1.6.71      | :heavy_check_mark: | :heavy_check_mark: |

---

## 💡 Other tips

> [!CAUTION]
> You have to enable `Hev TUN feature` in v2rayNG in order to connect properly, Xray native Tun is useless right now.

> [!CAUTION]
> If you are upgrading from versions below 3.5.1 to 4, you should get subscriptions from panel again.

> [!NOTE]
> These days Fragment on some ISPs stopped working in Iran, you can change `Fragment packet` to `1-1` instead of `tlshello` and test, also you can try to change `Fragment mode` to bypass Iran firewall.

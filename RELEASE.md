# 💡 Bug fixes & Improvements

- **Redesigned Login Page**: Glass morphism card, neon inputs, password toggle, theme toggle pill with emoji indicators, and responsive design.
- **Toast Notifications**: Replaced all `alert()` calls with elegant toast notifications (success/error/warning/info types) with auto-dismiss and progress bar.
- **Confirm Modal**: Replaced all `confirm()` dialogs with a custom glass-card confirm modal with gradient buttons and spring animation.
- **Fixed Modal Centering**: Changed all existing modals from `display: block` to `display: flex` so `align-items: center; justify-content: center;` works correctly.
- **Telegram Bot — Removed QR from /start**: Removed "📱 QR Codes" button from the main menu.
- **Telegram Bot — Custom Days Input**: Added "✏️ Custom days" button in user editor, stores state in KV, validates integer range `-3650…3650`.
- **Telegram Bot — Fixed Delete Loop**: Replaced repeated `delete` callback with unique one-time `confirm_delete:{username}` callback data, no more message loop.
- **Navbar Positioning**: Changed from `position: fixed` to `position: relative` to remove floating behavior; adjusted main container padding and tab-bar top.
- **Knocker Noise Mode UI**: Changed from text input to `<select>` dropdown (none/quic/random/custom) with conditional hex input field.
- **WireGuard Download Buttons**: Added ⬇️ Download Normal / 🌀 Download Amnezia buttons in Warp Pro settings tab, and a WireGuard download row in subscription cards.
- **User Management System**: Full user CRUD with expiry dates, usage limits (based on fetch quota), and dedicated subscription endpoints (`/sub/user/:subPath`). Manage users via Panel → Users tab or Telegram bot menu.
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

# ⚙️ Bug fixes and Improvements

- Added `Shadowsocks` and `Trojan` chain proxy support due to growing resources of free configs.

> [!TIP]
> Shadowsocks cannot have any transport like websocket, grpc... and cannot have TLS.

- Added `Httpupgrade` transmission support to chain proxies.
- Fixed WorkerLess bug.
- Removed `Happ` from supported apps due to various bugs.
- Updated docs
- Other bug fixes

> [!CAUTION]
> If you already have a Chain Proxy set in panel, after updating to this version you have to clear it, apply and then set it again.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher

> [!IMPORTANT]
> Fragment is disrupted on some ISPs recently, you have to read tutorials and customize Fragment settings, also using MahsaNG is recommended for this subscription.
> You can set Fragment `length` to 10-20 or `packets` to `1-1` for testing if default settings are not working.

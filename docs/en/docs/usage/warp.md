# :material-playlist-check:{ .md .middle } Warp subscriptions

![Warp subscriptions](../images/warp-sub.jpg)

This subscription includes:

- A **Warp** config, with node IPs from your region’s Cloudflare IPs.
- A **Warp on Warp (WoW)** config, with node IPs from foreign Cloudflare IPs (primarily Germany).
- A **Warp Best Ping** config, connecting to the fastest Warp config.
- A **WoW Best Ping** config, connecting to the fastest WoW config.

By default, there is one Warp and one WoW config. Editing the `Endpoints` in the `Warp General` settings adds additional Warp and WoW configs based on the specified Endpoints.

You can download Warp WireGuard configs as a zip file to import into WireGuard clients. Note that most ISPs normally block Warp, so use this only if your ISP permits WireGuard protocol.

For optimal performance, use a scanner to identify Endpoints suitable for your ISP. The scanner script is available in the panel; copy and run it in Termux on Android or Linux terminal. The Normal Warp subscription may perform well on some operators like MTN-Irancell, but for others, use the **Warp Pro** subscription.

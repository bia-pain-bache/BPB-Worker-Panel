# :material-telegram:{ .md .middle } Telegram Web Proxy

BPB includes an independent **Telegram Web Proxy** option for connecting to Telegram through a WebSocket-based relay running on your Cloudflare Worker. It is separate from Telegram Bot, VLESS, Trojan, and BPB subscription links. It is not a standalone raw MTProto proxy.

!!! warning "Workers only"
    Telegram Web Proxy requires a Cloudflare Durable Object and is available on **Cloudflare Workers** deployments. It is not available on Cloudflare Pages.

## Connect Telegram

1. Deploy a BPB Worker build that includes Telegram Web Proxy and sign in to the panel.
2. Find **Telegram Web Proxy** near the top of the panel, immediately above **DNS over HTTPS**.
3. Copy or open the connection link shown in that section. The panel obtains this link for the authenticated administrator; you do not need to generate it manually.
4. Open the link on a device with Telegram installed and follow Telegram's prompt to add the proxy.
5. Enable the added proxy in Telegram and check that messages load.

The link uses Telegram's official `t.me/webproxy` format and contains the Worker hostname and proxy secret. Treat the complete link as a credential: do not post it publicly or send it to people you do not trust.

## Test

Select **Test** in the Telegram Web Proxy panel section. The panel reports only the final result:

- **موفق** — the server-side checks completed successfully.
- **Error 21xx** — one of the checks failed. The code helps identify the failing area; see the table below.

The test checks the authenticated request, Worker availability, the `SESSIONS` Durable Object binding, the configured `PROXY_SECRET`, Durable Object initialization, and an outbound TCP connection to a Telegram data-center endpoint on port `443`.

!!! info "What Test does not prove"
    Test is a server-side diagnostic. A successful TCP connection does not perform a complete Telegram client handshake and does not guarantee that every Telegram client or network can connect. Add the link in Telegram and test an actual connection as well.

## Reset Secret

Select **Reset Secret** to generate a new random proxy secret and update the Cloudflare Worker secret binding. After a successful reset, the panel displays the refreshed connection link.

The previous link contains the old secret and should no longer be used. Replace the saved proxy in Telegram with the newly generated link. Only reset the secret when needed, because every reset invalidates previously distributed links.

## Error codes

| Code | Meaning |
| :--- | :--- |
| `2101` | The panel session is missing, expired, or unauthorized. Sign in again. |
| `2110` | Telegram Web Proxy is unavailable. It requires Workers and the `SESSIONS` binding; Pages is not supported. |
| `2120` | `PROXY_SECRET` is missing or has an invalid format. Use **Reset Secret** or check the Worker configuration. |
| `2121` | The Durable Object health/initialization check failed. Check the `SESSIONS` binding and its migration. |
| `2122` | The Worker could not establish the diagnostic TCP connection to a Telegram data-center endpoint on port `443`. |
| `2198` | Cloudflare rejected the secret reset. Check the server-side Cloudflare account configuration and token permissions. |
| `2199` | A network or unexpected error occurred while resetting the secret. |

These codes identify the stage reported by the panel; they are diagnostic hints, not a complete analysis of every possible client-side failure.

## Deployment notes

The Worker integration uses:

- The `WebProxySession` Durable Object class.
- The `SESSIONS` Durable Object namespace binding.
- SQLite-backed Durable Object storage.
- The `v1-twp` migration tag for the initial SQLite class creation.
- `PROXY_SECRET` as a Cloudflare Worker secret binding.

The initial SQLite migration must be applied once when enabling the feature on a new Worker. Later updates must preserve the existing migration state rather than trying to create the SQLite class again. Do not place the proxy secret in the repository, panel HTML, client-side JavaScript, or logs.

## Scope and limitations

- Telegram Web Proxy is an additional Telegram connection method, not a replacement for BPB's VLESS, Trojan, Warp, or DoH features.
- It is not a general-purpose UDP tunnel. Telegram voice/video calls and other UDP-dependent traffic are not provided by this feature.
- The panel's **Test** button checks server-side prerequisites; always verify the generated link with a real Telegram client.

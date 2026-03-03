# 💡 Bug fixes & Improvements

- Due to nslookup issue for querying proxy IPs, the built-in proxy IPs list is now implemented and is accessible under `/proxy-ip` or by clicking provided shortcut in panel which lists Country, City and ISP. #1185

- Fixed ECH config query. Be aware that ECH config query is delegated to Core DNS module (Local DNS) now, so this DNS server should be locally available. Optional `ECH Server Name` is also added. #1190

> [!CAUTION]
> Please note that `ECH Server Name` option is available in Xray for a while, however sing-box supports this feature from 1.13.0 and Clash supports it from v1.19.20. If you leave it empty, it uses your worker domain to query ECH config which works on all cores' stable versions right now. Also if you enter a Cloudflare domain, it should have ECH enabled on it, otherwise it won't work. To check this, visit [here](https://dns.google/query?name=&rr_type=HTTPS&ecs=) and resolve your desired domain, you should see an `ech` value in `Answer` field.

> [!CAUTION]
> ECH is still unstable in IRAN.

> [!TIP]
> ECH applies only to `Normal` subscription, not `Fragment`.

- Fixed `ECH Server Name` bug #1224
- Fixed ECH query DNS if local DNS is set to `localhost`
- Fixed some typos, PR #1191
- Reverted back URL configs to panel as `Raw` subscription. None of panel settings apply to these configs as you know and also they consume more worker requests than `Normal` configs and won't perform as others. They're not recommended to use and connections issues will not be supported anymore, please use `Normal` configs instead.

> [!CAUTION]
> You have to manually set DoH as remote DNS in your clients and disable MUX to use `Raw` configs.

---

## 💡 Other tips

> [!NOTE]
> These days Fragment on some ISPs stopped working in Iran, you can change `Fragment packet` to `1-1` instead of `tlshello` and test, also you can try to change `Fragment mode` to bypass IR-GFW.

> [!CAUTION]
> If you are upgrading from versions below 3.5.1 to 4, you should get subscriptions from panel again.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher.

> [!CAUTION]
> Xray clients should be updated to the latest version i.e. v2rayNG, v2rayN and Streisand.

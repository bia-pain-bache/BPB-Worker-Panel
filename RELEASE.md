# ⚙️ Cloudflare ECH

ECH option is added to BPB Panel now for all cores. Please note that this is not so helpful in Iran regarding tests, successfully connects but gets banned after a while on some ISPs. This option can be more helpful in other countries.

> [!TIP]
> ECH applies only to `Normal` subscription, not `Fragment`.

> [!TIP]
> BPB queries ECH config within worker and does not delegate ECH config query to client core which is an advantage (core query may fail due to DNS query failure or blocked domains). So there's no extra settings, you can just enable ECH from panel and use it.

> [!NOTE]
> These days Fragment on some ISPs stopped working in Iran, you can change `Fragment packet` to `1-1` instead of `tlshello` and test, also you can try to change `Fragment mode` to bypass IR-GFW.

> [!CAUTION]
> If you are upgrading from versions below 3.5.1 to 4, you should get subscriptions from panel again.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher.

> [!CAUTION]
> Xray clients should be updated to the latest version i.e. v2rayNG, v2rayN and Streisand.

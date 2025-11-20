# ⚙️ Bug fixes and Improvements

- Removed restriction for `Fragment length`, you can set minimum to 1 now. #1131
- Added two more length to `Best Fragment` config: `1-5`, `1-10`. The config now checks 20 main fragment modes to find the best one on ISP.
- Added `Severe` Fragment mode with `1-5` length and `1-5` interval values.

> [!NOTE]
> These days Fragment on some ISPs stopped working in Iran, you can change `Fragment packet` to `1-1` instead of `tlshello` and test, also you can try to change `Fragment mode` to bypass IR-GFW.

> [!CAUTION]
> If you are upgrading from versions below 3.5.1 to 4, you should get subscriptions from panel again.

> [!CAUTION]
> sing-box client version should be 1.12.0 or higher.

> [!CAUTION]
> Xray clients should be updated to the latest version i.e. v2rayNG, v2rayN and Streisand.

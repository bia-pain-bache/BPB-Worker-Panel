# 💡 Bug fixes & Improvements

- Bug fix, WorkerLess configs are working again. Recommended Fragment settings are `Packet: 1-1` and `Mode: Severe` #1305
- Adapted sing-box new DNS features.

> [!CAUTION]
> Please update whatever client you use, specially these ones:

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

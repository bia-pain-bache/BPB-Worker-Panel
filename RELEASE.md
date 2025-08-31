# ⚙️ Bug fixes and Improvements

- Added NAT64 support as an alternative method for Proxy IP. You can add some NAT64 prefix to panel or add via Cloudflare dashboard using environment variable named `NAT64_PREFIX` #932 #977
- Improved Panel UI and data entry validation
- Set default VLESS/Trojan fingerprint to `chrome`
- Some bug fixes

> [!CAUTION]
> YOU MUST update your subscriptions after upgrading to this version, new deployment do not need to do anything.

> [!WARNING]
> Among the free public NAT64 prefixes, only a few are compatible with the panel. Start by testing the panel’s default NAT64 prefix. If it works, you can then try other prefixes to see which ones work.

> [!TIP]
> The NAT64 prefix format is [IPv6] without CIDR notation, so if you found a NAT64 like 2001:67c:2960:6464::/96, it should be converted to [2001:67c:2960:6464::].

> [!TIP]
> NAT64 prefixes entry format in Cloudflare dashboard environment variable `NAT64_PREFIX` is the same as `PROXY_IP` i.e. IPs should be filled in comma-separated in contrary to panel which should be filled each in a row.

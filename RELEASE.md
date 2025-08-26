# ⚙️ Bug fixes and Improvements

- Added NAT64 support as an alternative method for Proxy IP. You can add a NAT64 prefix to panel or add via Cloudflare dashboard using environment variable named `NAT64_PREFIX` #932 #977
- Improved Panel UI and data entry validation

> [!WARNING]
> Among the free public NAT64 prefixes, only a few are compatible with the panel. Start by testing the panel’s default NAT64 prefix. If it works, you can then try other prefixes to see which ones work.

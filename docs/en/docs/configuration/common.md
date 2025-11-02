# :material-cog-outline:{ .md .middle } Common settings

![Common settings](../images/common-settings.jpg)

This section provides shared settings between all subscriptions and protocols.

## Local DNS

The local DNS is mainly used for routing bypass rules. By default the local DNS server is set to Google DNS.

Many DNS servers are available to use as Local DNS in shape of IP, however you can use **localhost** which uses your ISP DNS server which is fine for routing purposes.

## Fake DNS

You may enable Fake DNS to reduce DNS query latency, but use caution, it may be incompatible with some applications or interfere with system DNS. If you're unsure about its functionality, avoid enabling it.

## Anti Sanction DNS

This DNS server is used for **Sanction Rules** [explained here](./routing-rules.md). The default DNS server is [Shecan](https://shecan.ir/) (for iranian users). You should check whether it supports your desired domains before setting routing rules.

!!! info
    DNS server can be in shape of an IP (UDP DNS), TCP DNS, DOT or DoH.

## Enabling IPv6

The panel provides IPv6 VLESS/Trojan configs by default. If your ISP doesn’t support IPv6, disable it to reduce the number of configs and also optimize DNS and routing settings for VLESS, Trojan and Warp configs.

## Allow connections from LAN

If you enable this feature, others in you network (for example WiFi network) can use your proxy by knowing your device local IP. They can set a socks proxy on their device, set your local IP as address and these ports based on which client you are using:

- v2ray: 10808
- sing-box: 2080
- Clash: 7890

Please note that this can be risky to use in office or public networks.

## Log Level

Specifies the level of client logs. Normally it's "warning" which is enough to debug issues, however you may need to change it to submit issues in Github or check your proxy activity.

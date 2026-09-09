# :material-cog-outline:{ .md .middle } Common settings

This section provides shared settings between all panel, subscriptions, DNS over HTTPS and protocols.

## Local DNS

The local DNS is mainly used for routing bypass rules. By default the local DNS server is set to Google DNS.

Many DNS servers are available to use as Local DNS in shape of IP, however you can use **localhost** which uses your ISP DNS server which is fine for routing purposes.

## Anti Sanction DNS

This DNS server is used for **Sanction Rules** [explained here](./routing-rules.md). The default DNS server is [Shecan](https://shecan.ir/) (for iranian users). You should check whether it supports your desired domains before setting routing rules.

!!! info
    DNS server can be in shape of an IP (UDP DNS), TCP DNS, DOT or DoH.

## Fake DNS

You may enable Fake DNS to reduce DNS query latency, but use caution, it may be incompatible with some applications or interfere with system DNS. If you're unsure about its functionality, avoid enabling it.

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

## Custom Domain

If you already registered a domain on your Cloudflare account, you can simply assign a subdomain to your panel from here, No further steps are required from dashboard.

Please note that the related configs will be added to the existing subscriptions with `D` flag.

## Underlying DoH

The panel provides a `DNS over HTTPS` which is using Cloudflare official DoH under the hood by default. 

You can change this by setting `underlying DoH` to another DoH servers, like for example setting Adguard to block Ads. or others to block Adult content, spams, malwares etc.

## Panel - Subscriptions Path

This is your secure path for accessing panel or getting subscriptions, if you change it, the panel automatically redirects to new URL and you need to get your subscriptions from panel again.

## Fallback Domain

BPB Panel provides camouflage feature. By default, accessing the wrong addresses or invalid requests returns 404.

You can change this behaviour by setting a desired well known domain here. Please note that some websites blocked or restricted workers, so you should set and test them.

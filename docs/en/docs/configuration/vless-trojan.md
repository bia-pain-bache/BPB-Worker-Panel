# :material-cog-outline:{ .md .middle } VLESS and Trojan settings

![VLESS and Trojan settings](../images/vless-trojan-settings.jpg)

## Remote DNS

By default, the remote DNS is Google DNS over HTTPS (DoH). However, you can use other DoH or DoT servers, except Cloudflare DNS servers:

!!! tip "Well known DOH and DOT servers"
    - `https://dns.google/dns-query`
    - `https://dns.adguard-dns.com/dns-query`
    - `https://dns.quad9.net/dns-query`
    - `tls://dns.google`

## Chain Proxy

As noted, a Proxy IP fixes the IP for Cloudflare target addresses, but node IPs may differ for other targets. A **Chain Proxy** ensures a consistent IP for all targets. You can use a free config here, even if it’s blocked by your ISP, to permanently fix your IP to the Chain Proxy IP.

### Supported protocols

* VLESS
* VMess
* Trojan
* Shadowsocks
* Socks
* Http

### Supported Transports

* TCP
* TCP http header
* Websocket
* GRPC
* Httpupgrade

### Supported TLS

* TLS
* Reality

!!! note
    The Chain Proxy config must not be a worker itself, or the final IP will still change.

!!! info
    Socks and http configs should have username and password, Xray does not support raw configs.

!!! info
    Shadowsocks cannot have any transport like websocket, grpc... and cannot have TLS.

!!! warning
    VLESS, VMess and Trojan configs with `randomized` ALPN values are incompatible with Clash due to lack of Fingerprint

This setting applies to **Normal** and **Fragment** subscriptions. After applying, update the subscription. The chained configs will be added alongside original configs using 🔗 icon. This way, when Chain Proxy stops working, you still have access to original configs.

## Clean IP/Domains

For non-**Normal** subscription, you may want to use clean IPs. The panel includes a scanner, downloadable as a zip file for your operating system. Run the CloudflareScanner, and results will be saved in `result.csv`, allowing you to select IPs based on delay and download speed. Windows is recommended for this process, and ensure your VPN is disconnected during the test. For advanced scanning, refer to [this guide](https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/blob/master/README.md).

!!! tip "Tip for Iranian Users"
    On ISPs supporting IPv6 (e.g., Rightel, Irancell, Asiatech), enable IPv6 on your SIM card, activate the **Prefer IPv6** option in client settings, and use the last two or first default configs. IPv6 IPs generally perform better.

!!! tip
    When using **Fragment**, Clean IPs do not play a significant role, but some ISPs, like Rightel, may still require them.

To add custom configs alongside default ones, enter clean IPs or domains as shown in the section image and click **Apply**. Updated subscription will import these new configs, which are also added to **Best Ping** and **Best Fragment** configs.

## Protocol Selection

Enable either or both **VLESS** and **Trojan** protocols.

## Port Selection

Select the required ports. TLS ports offer more secure configs, but during TLS disruptions or when **Fragment** underperforms, non-TLS configs can be a viable alternative.

!!! note
    Non-TLS configs require the panel to be deployed using the Workers method. HTTP ports will not appear in the panel if the Pages method is used or you set a custom domain.

!!! info
    Non-TLS configs are only added to **Normal** subscription.

## Fingerprint

Here you can select TLS fingerprint, default to randomized.

## ECH (Encrypted Client Hello)

As you may know there are several techniques to obfuscate connection SNI to bypass firewall. Fragment hides SNI, Custom domain changes SNI and finally ECH can change SNI to Cloudflare default ECH domain. The problem is that Cloudflare uses a default domain named `cloudflare-ech.com` for all CDN and Worker domains, so the blockage is easy for ISPs. Right now this is not so helpful in Iran because on some ISPs config connects successfully but gets banned after a while and on some other ISPs the default domain is blocked totally. So you have to test. This option will not be activated on `Fragment` subscription.

## Best Interval

By default, **Best** configs test every 30 seconds to identify the optimal config or Fragment value. For low-speed networks during activities like video streaming or gaming, this may cause lag. Adjust the interval between 10 and 90 seconds as needed.

## TCP Fast Open

If your device supports TCP Fast Open and your ISP does not interfere with TFO, you can enable the feature to enhance your connections. Please note that Linux users have to enable TFO before activating this feature.

## Proxy IP

### Mode

Starting with version 3.4.2 you can choose to use Proxy IP or NAT64 Prefix for connecting to Cloudflare CDN addresses.

### Proxy IPs / Domains

You can change the Proxy IP via the panel by applying the change and updating the subscription. However, setting the Proxy IP through the Cloudflare dashboard or using wizard is recommended because:

!!! note
    Changing the Proxy IP via the panel requires updating the subscription if the IP stops working. This can disrupt donated configs, as users without an active subscription cannot update them. Use this method only for personal usage. Other methods don’t require subscription updates.

Select a Proxy IP [from here](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/), which lists IPs by region and ISP.

!!! info
    To use multiple Proxy IPs, fill in them below each other.

### NAT64 Prefixes

You can change the Proxy IP mode and fill in NAT64 Prefixes via the panel by applying the changes and updating the subscription. However, setting the NAT64 prefixes through the Cloudflare dashboard or using wizard is recommended because:

!!! note
    Changing the NAT64 Prefixes via the panel requires updating the subscription if the IP stops working. This can disrupt donated configs, as users without an active subscription cannot update them. Use this method only for personal usage. Other methods don’t require subscription updates.

You can find available NAT64 Prefixes [in here](https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/docs/NAT64Prefixes.md), which lists IPs by region and ISP.

!!! info
    To use multiple Prefixes, fill them in below each other.

## Custom CDN

Use a Custom CDN (e.g., Fastly, Gcore) to mask your Worker domain. Configure the following three sections:

### Addresses

These are the IPs or clean IPs specific to the CDN. You must use the CDN’s own IPs, not Cloudflare’s. Enter domains, IPv4, or IPv6 addresses as shown, with IPv6 addresses enclosed in brackets, e.g., `[2a04:4e42:200::731]`.

### Host

The host defined in the CDN that points to your Worker, such as a fake domain in Fastly.

### SNI

A fake domain or a site on the same CDN, e.g., `speedtest.net` (without `www`) for Fastly.

After configuring these fields, related configs will be added to **Normal** subscription, tagged with a `C` flag to distinguish them.

!!! info
    Only ports 443 and 80 are supported for these configs.

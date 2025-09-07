# :material-cog-outline:{ .md .middle } VLESS and Trojan settings

These settings apply only to **Fragment** and **Full Normal** subscriptions.  

![VLESS and Trojan settings](../images/vless-trojan-settings.jpg)

## Remote DNS

By default, the remote DNS is Google DNS over HTTPS (DoH).

```title="Default Remote DNS"
https://8.8.8.8/dns-query
```

!!! warning
    Avoid using `https://1.1.1.1/dns-query`, `https://cloudflare-dns.com/dns-query`, or any Cloudflare-related DNS for remote DNS, as they significantly increase ping and destabilize the connection with workers.

!!! tip
    From version 2.5.5 onward, you can use some well known DoH or DoT servers:
    ```
    https://dns.google/dns-query
    ```
    ```
    https://dns.adguard-dns.com/dns-query
    ```
    ```
    https://dns.quad9.net/dns-query
    ```
    ```
    tls://dns.google
    ```

## Local DNS

By default, the local DNS server is Google DNS.

```title="Default Local DNS"
8.8.8.8
```

Many DNS servers are available to use as Local DNS in shape of IP, however you can use **localhost** which uses your ISP DNS server which is fine for routing purposes.

## Fake DNS

You may enable Fake DNS to reduce DNS query latency, but use caution—it may be incompatible with some applications or interfere with system DNS. If you're unsure about its functionality, avoid enabling it.

## Chain Proxy

As noted, a Proxy IP fixes the IP for Cloudflare target addresses, but node IPs may differ for other targets. A **Chain Proxy** ensures a consistent IP for all targets. You can use a free VLESS, Socks, or HTTP config here, even if it’s blocked by your ISP, to permanently fix your IP to the Chain Proxy IP.

!!! note
    The Chain Proxy config must not be a worker itself, or the final IP will still change.

!!! tip
    Free configs are available from sources like [racevpn.com](https://racevpn.com). Their free plan configs expire after three days but are stable and region-specific.

!!! note
    Supported VLESS config types include:  

    - WS
    - Reality WS
    - WS TLS
    - GRPC
    - Reality GRPC
    - GRPC TLS
    - TCP
    - Reality TCP
    - TCP Header
    - Reality TCP Header
    - TCP TLS

!!! note
    Socks configs can be in these formats:

    - socks://`address`:`port`
    - socks://`user`:`pass`@`address`:`port`

!!! note
    HTTP configs can be in these formats:  

    - http://`address`:`port`
    - http://`user`:`pass`@`address`:`port`

This setting applies to all subscriptions except **Normal** and **Warp**. After applying, update the subscription.

However, **Normal** subscriptions import the Chain Proxy individually. In clients like Nekobox or Husi, edit the subscription in the Group section and set the Chain Proxy as the **Landing Proxy** to chain it. Since version 1.9.1, v2rayNG supports this feature: copy the config name, edit the subscription in the Subscription group settings, and paste it into the `Next proxy remarks` field.

!!! warning
    - VLESS TLS configs for chaining must use port 443.
    - VLESS configs with randomized ALPN values are incompatible with Clash due to lack of Fingerprint support.
    - VLESS WS configs are unsuitable for chaining on Sing-box due to a bug.

## Clean IP/Domains

For non-**Fragment** subscriptions, you may want to use clean IPs. The panel includes a scanner, downloadable as a zip file for your operating system. Run the CloudflareScanner, and results will be saved in `result.csv`, allowing you to select IPs based on delay and download speed. Windows is recommended for this process, and ensure your VPN is disconnected during the test. For advanced scanning, refer to [this guide](https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/blob/master/README.md).

!!! tip "Tip for Iranian Users"
    On ISPs supporting IPv6 (e.g., Rightel, Irancell, Asiatech), enable IPv6 on your SIM card, activate the **Prefer IPv6** option in client settings, and use the last two or first default configs. IPv6 IPs generally perform better.

!!! tip
    When using **Fragment**, Clean IPs do not play a significant role, but some ISPs, like Rightel, may still require them.

To add custom configs alongside default ones, enter clean IPs or domains as shown in the section image and click **Apply**. Updated subscription will import these new configs, which are also added to **Best Ping** and **Best Fragment** configs.

## Enabling IPv6

The panel provides IPv6 configs by default. If your ISP doesn’t support IPv6, disable it to reduce the number of configs and optimize DNS and routing settings.

## Protocol Selection

Enable either or both **VLESS** and **Trojan** protocols.

## Port Selection

Select the required ports. TLS ports offer more secure configs, but during TLS disruptions or when **Fragment** underperforms, non-TLS configs can be a viable alternative.

!!! note
    Non-TLS configs require the panel to be deployed using the Workers method. HTTP ports will not appear in the panel if the Pages method is used or you set a custom domain.

!!! info
    Non-TLS configs are only added to **Normal** and **Full Normal** subscriptions.

## Fingerprint

Here you can select TLS fingerprint, default to randomized.

## Best Interval

By default, **Best** configs test every 30 seconds to identify the optimal config or Fragment value. For low-speed networks during activities like video streaming or gaming, this may cause lag. Adjust the interval between 10 and 90 seconds as needed.

## Proxy IP

### Mode

Starting with version 3.4.2 you can choose to use Proxy IP or NAT64 Prefix for connecting to Cloudflare CDN addresses.

### Proxy IPs / Domains

You can change the Proxy IP via the panel by applying the change and updating the subscription. However, setting the Proxy IP through the Cloudflare dashboard or using wizard is recommended because:

!!! note
    Changing the Proxy IP via the panel requires updating the subscription if the IP stops working. This can disrupt donated configs, as users without an active subscription cannot update them. Use this method only for personal usage. Other methods don’t require subscription updates.

Select a Proxy IP from the following link, which lists IPs by region and ISP:

```text
https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
```

!!! info
    To use multiple Proxy IPs, fill in them below each other.

### NAT64 Prefixes

You can change the Proxy IP mode and fill in NAT64 Prefixes via the panel by applying the changes and updating the subscription. However, setting the NAT64 prefixes through the Cloudflare dashboard or using wizard is recommended because:

!!! note
    Changing the NAT64 Prefixes via the panel requires updating the subscription if the IP stops working. This can disrupt donated configs, as users without an active subscription cannot update them. Use this method only for personal usage. Other methods don’t require subscription updates.

Select a NAT64 Prefixes from the following link, which lists IPs by region and ISP:

```text
https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/NAT64Prefixes.md
```

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

After configuring these fields, related configs will be added to **Normal** and **Full Normal** subscriptions, tagged with a `C` flag to distinguish them.

!!! info
    Only ports 443 and 80 are supported for these configs.

!!! warning
    For **Normal** subscriptions, manually enable **Allow Insecure** in the config settings. **Full Normal** subscription applies this automatically.

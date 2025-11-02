# :material-cog-outline:{ .md .middle } Routing Rules

![Routing Rules](../images/routing-rules.jpg)

## Predefined rules

Using predefined routing rules, you can apply these settings to configs:

* Connect directly to Iranian addresses without a proxy (no need to disconnect for visiting some websites, especially payment gateways).
* Have direct access to Chinese websites.
* Have direct access to Russian websites.
* Block Iranian and foreign ads, up to 90 percent.
* Block Porn content websites.
* Block QUIC connections (due to network instability).
* Block Malware (Read warning)
* Block Phishing (Read warning)
* Block Cryptominers (Read warning)

Direct access to local addresses like 127.0.0.1 is set by default on configs and there's no need to manually add them.

!!! warning
    v2ray users should change Geo Assets to **Chocolate4U** and download assets if they wanna use `Malware`, `Phishing` and `Cryptominers` rules, otherwise configs won't connect.

!!! warning
    If you enable routing rules and the client does not connect, the primary reason is that the Geo asset is not updated. Go to the Geo assets settings in the v2rayNG menu and click the cloud or download icon to update them. If the update process is unsuccessful, you will not be able to connect. If you have tried everything and it still does not update, download the two files from the links below, and instead of clicking the update button, click the add button and import these two files:

```title="GeoIP"
https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
```

```title="GeoSite"
https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
```

## Custom Rules

There are cases which predefined rules cannot help. For example, if you have blocked porn contents but a specific website was not on the list and is not blocked, you will need to use custom rules.

You can use three different formats in this section i.e. **Domain**, **IP** and **IP/CIDR**.

Please be aware that if you enter `google.com`, all of its subdomains will also be blocked or routed directly, such as `drive.google.com` or `mail.google.com`. Examples:

```title="Domain"
google.com
```

```title="IPv4"
192.168.1.1
```

```title="IPv6"
2606:4700::6810:85e5
```

```title="IPv4 CIDR"
192.168.1.1/32
```

```title="IPv6 CIDR"
2606:4700::6810:85e5/128
```

## Sanction Rules

In case you need some websites to just bypass sanctions and connect directly (without proxy), you can use this section.
You can set your desired DNS server [in common settings](./common.md) (which should be a transparent proxy also) and choose preset rules or fill in custom addresses. you can even use configs like `WorkerLess` which do not use any proxy and access sanctioned websites.

!!! info
    Please be aware that if you enter `google.com` in custom rules, all of its subdomains will also be routed directly, such as `drive.google.com` or `mail.google.com`.

!!! note
    When these rules are activated, you should make sure the DNS supports domain, for example if you activate `Microsoft` rule and the DNS does not support it, you will fail to connect to Microsoft domains. Please check DNS catalogue and make sure your target rule or domain is supported.

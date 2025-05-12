# :material-playlist-check:{ .md .middle } Normal subscription

![Normal subscription](../images/normal-sub.jpg)

The **Full Normal** subscription is strongly recommended over this subscription, as it automatically applies all panel settings without requiring manual configuration. Note that Routing Rules, Chain Proxy, and DNS settings are not applied to this subscription and must be configured manually in the client.

!!! warning
    You must set the remote DNS to a DoH, DoT, or TCP DNS server in your client, otherwise, this subscription’s configs will not work. Examples:
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8  
    ```
    ```title="TCP"
    tcp://8.8.8.8  
    ```

This subscription typically imports six VLESS and six Trojan configs. You can increase the number of configs by adjusting the Clean IPs, Ports, and Protocol settings. What distinguishes these six configs?

- **Websocket Path**: Each config uses a unique path.
- **Address**: Out of the six configs, the first uses your Worker’s domain, the second uses `www.speedtest.net` (which is clean on most ISPs), and configs three to six use resolved IPs of your domain (typically clean, including two IPv4 and two IPv6).

Refer to the [instructions](../configuration/vless-trojan.md) to learn how to add Clean IPs, Ports, Protocols, and Custom CDN.

!!! warning
    To use this subscription, disable Mux in any client you use.

!!! warning
    Using this Worker causes frequent IP changes on your device, making it unsuitable for IP-sensitive activities such as trading, PayPal, or websites like Hetzner, as there is a risk of being banned. To address IP changes, two solutions are available:

    - Setting a Proxy IP
    - Using a Chain Proxy

    See the [instructions](../configuration/vless-trojan.md) for details.

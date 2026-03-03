# :material-playlist-check:{ .md .middle } Raw subscription

![Raw subscription](../images/raw-sub.jpg)

The **Normal** subscription is strongly recommended over this subscription, as it automatically applies all panel settings without requiring manual configuration. Note that almost all of panel settings are not applied to this subscription and must be configured manually in the client.

!!! warning
    Raw configs consume more Worker requests compared to `Normal` configs and have more worker errors.

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

# :material-cloud-question-outline:{ .lg .middle } Frequently Asked Questions

??? question "Why doesn't the Fragment config connect?"
    If you enabled `Routing rules` and the VPN doesn't connect, the only reason is that the Geo assets are not updated. In the v2rayN(G) client menu, go to the `Asset files` section and tap the cloud or download icon to update. If the update fails, it won't connect. If you tried everything and it still doesn't update, download the two files below from the links and instead of updating, tap the add button and import these two files:
    ```title="GeoIP"
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
    ```
    ```title="GeoSite"
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
    ```

??? question "Why don't normal sub configs connect?"  
    To use these configs, disable `Mux` in the settings of whichever app you’re using. Also set remote DNS to DOH:
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8  
    ```
    ```title="TCP"
    tcp://8.8.8.8  
    ```  

??? question "Why don't clients like Nekobox, husi or Hiddify Next open any websites?"
    In the app settings, set the `remote DNS` like this:  
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8  
    ```
    ```title="TCP"
    tcp://8.8.8.8  
    ```  

??? question "Why Fragment configs speed is slow on my ISP?"
    Each operator has its own prefered Fragment settings. Most are fine with the panel defaults, but these values may work better on your operator; you need to test:  
    ```title="Length"
    10-100
    ```
    ```title="Interval"
    10-20  
    ```

??? question "Why is my Ping test so high?"
    Never use `https://1.1.1.1/dns-query` or any Cloudflare related DNS for remote DNS, as it increases ping.  

??? question "I extracted and used a Proxy IP regarding tutorials, why sites still won't open!"  
    There are many public IPs and some of them might be unstable. You need to test to find a good one.  

??? question "It worked when I set a proxy IP, but now it's not working!"
    If you use a single IP, it may stop working after some time and many sites won’t open. You need to redo the steps. Preferably, if you're not doing anything that needs a static IP, just use the panel default and don't use a single proxy IP.  

??? question "Why do I get an error when I go to the `panel/` address?"
    Follow the installation guide or use **Wizard**; KV, UUID or Trojan password are not properly configured.  

??? question "I deployed it but Cloudflare returns error 1101!"
    If it's a Worker, create it using the Pages method. If that also errors, your Cloudflare account has likely been flagged. Create a new Cloudflare account with an official email like Gmail and preferably use the Pages method. Also, make sure the project name doesn't include the word "bpb".  
    It is recommended use **Wizard** (pages mode) or [manual pages](installation/pages-manual.md) installation.  

??? question "Can I use this for trading?"
    If your Cloudflare IP is located in Germany (which it usually is), using a single Germany proxy IP should be fine. But preferably use the Chain Proxy method to stabilize the IP.  

??? question "Why I can't see non-TLS ports in panel?"
    To use non-TLS configs, you must deploy via Workers method and without a custom domain.  

??? question "Why doesn’t the Best Fragment config connect or work properly?"
    Turn off `Prefer IPv6` in settings.  

??? question "Why don't Telegram calls or Clubhouse work?"
    Cloudflare can't properly handle the UDP protocol. There is currently no effective solution. Use Warp configs instead.  

??? question "Why doesn't the normal Trojan config connect?"
    If you want to connect using the normal subscription, make sure the Remote DNS in whatever app you're using matches the panel. Formats like `udp://1.1.1.1` or `1.1.1.1` don’t work with Trojan. These formats are fine:
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8  
    ```
    ```title="TCP"
    tcp://8.8.8.8  
    ```
  
    I recommend using the Full Normal or Fragment subscriptions which already include all the correct settings.  

??? question "Why won't ChatGPT open?"
    Because the panel's default proxy IPs are public and many might appear suspicious to ChatGPT. Use the link below to search and test an appropriate IP for yourself:  
    ```link
    https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
    ```
    Or enable the `Bypass ChatGPT` option in the routing section of the panel.  

??? question "I forgot the panel password. What should I do?"
    Go to your Cloudflare dashboard, find the KV created for Worker or Pages, click view, go to the KV Pairs section. In the table, you’ll see a `pwd` key — the value next to it is your password.  

??? question "What happens if I don’t change the UUID and Trojan password?"
    From version 2.7.7 onward, setting these two parameters is mandatory and the panel won’t run without them.  

??? question "I used the Pages upload method but I get a 404."
    Cloudflare takes about 4–5 minutes to register Pages domains. Give it time, refresh, and it should work.  

??? question "Why doesn’t the panel show the Block Ads checkbox?"
    Extensions like `uBlock`, `AdGuard` or even some browsers with built-in ad-block settings, can hide it. Disable them for the panel.  

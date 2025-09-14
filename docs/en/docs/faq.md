# :material-cloud-question-outline:{ .lg .middle } Frequently Asked Questions

??? question "Why don't configs connect?"
    If you enabled `Routing rules` and the VPN doesn't connect, the only reason is that the Geo assets are not updated. In the v2rayN(G) client menu, go to the `Asset files` section and tap the cloud or download icon to update. If the update fails, it won't connect. If you tried everything and it still doesn't update, download the two files below from the links and instead of updating, tap the add button and import these two files:
    ```title="GeoIP"
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
    ```
    ```title="GeoSite"
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
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

??? question "I extracted and used a Proxy IP regarding tutorials, why some sites or applications like X still won't work!"  
    There are many public IPs and some of them might be unstable. You need to test to find a good one.  

??? question "It worked when I set a proxy IP, but now it's not working!"
    If you use a single IP, it may stop working after some time and many sites won’t open. You need to redo the steps. Preferably, if you're not doing anything that needs a static IP, just use the panel default and don't use a single proxy IP.  

??? question "Why do I get an error when I go to the `panel/` address?"
    Follow the installation guide or use **Wizard**; KV, UUID or Trojan password are not properly configured.  

??? question "I deployed it but Cloudflare returns error 1101!"
    Your Cloudflare account has likely been flagged. Create a new Cloudflare account with an official email like Gmail and. Also, make sure the project name doesn't include the word "bpb".  
    It is recommended to use **Wizard** for installation.  

??? question "Can I use this for trading?"
    If your Cloudflare IP is located in Germany (which it usually is), using a single Germany proxy IP should be fine. But preferably use the Chain Proxy method to stabilize the IP.  

??? question "Why I can't see non-TLS ports in panel?"
    To use non-TLS configs, you must deploy via Workers method and without a custom domain.  

??? question "Why doesn’t the Best Fragment config connect or work properly?"
    Turn off `Prefer IPv6` in settings.  

??? question "Why don't Telegram calls or Clubhouse work?"
    Cloudflare can't properly handle the UDP traffic. There is currently no effective solution. Use Warp configs instead.  

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

??? question "Why wizard is detected as Virus in windows?"
    The wizard app lacks `Code signing certificate` and has to download worker.js on you PC, customize it and deploy to Cloudflare which is a suspicious behaviour to Anti Viruses, known as Trojan/Downloader. So you have to temporarily disable Windows defender or any other Anti Virus program.

# :material-new-box:{ .md .middle } Installation via Cloudflare Workers

## Installation

### 1. Create Cloudflare Account

If you don’t have a Cloudflare account, create one [here](https://dash.cloudflare.com/sign-up). You only need an email for registration. Due to Cloudflare’s restrictions, use a reputable email provider like Gmail.

### 2. Create worker

First, download the Worker code from [here](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.js).

In your Cloudflare account, navigate to the `Developer Platform` tab and click `Create application`, from `Workers` tab find `Start with Hello World!` and `Get started`.

Enter a desired name, which will form your panel’s domain and `Deploy`.

!!! danger
    Choose a name that does not include the word `bpb`, as this may trigger Cloudflare’s detection and result in a `1101` error.

Then click `Edit code` here. In the left sidebar, delete the `worker.js` file and upload the new one. If it gives an error, delete the `package-lock.json` file too. Since the code has become large, copying and pasting on mobile is difficult — refer to the image below and upload it properly. On mobile, open the side menu, long-press the Explorer, and click `Upload...`.

![Mobile upload](../images/worker-mobile-upload.jpg)

Finally, `Deploy` the Worker.

!!! tip
    Note that the panel update process is exactly the same — you delete the old files, upload the new ones, and deploy. Previous settings remain safe, only the panel gets updated.

First, at the top of the dashboard, click `Visit`. You’ll see an error saying you need to set the UUID and Trojan Password first. It includes a link (Secrets generator) — open it in your browser and keep it open for the next step.

![Generate secrets](../images/generate-secrets.jpg)

### 3. Create KV

Return to the Worker dashboard and follow these steps:

![Workers dashboard](../images/nav-worker-dash.jpg)

From here, go to the `KV` page:

![KV dashboard](../images/nav-dash-kv.jpg)

In the KV section, click `Create`, give it a name (e.g., Test), and click `Add`.

Again, go to the `Developer Platform` section, open the Worker you just created, go to `Bindings`. Click `Add binding` and choose `KV Namespace`. From the dropdown, select the KV you just created (e.g., Test). What’s important is the first field — it **must** be set to `kv`. Then click `Deploy`.

![Bind KV](../images/bind-kv.jpg)

### 4. Set UUID, Trojan password and Subscription path

Click `Copy all` from the `Secrets generator` page provided earlier, In Cloudflare dashboard go to `Settings` section, locate the `Variables and Secrets` section. Click `Add` and paste into the `Variable name` field and click `Deploy`. This will automatically add these 3 parameters to panel.

Again click `Visit` in your worker dashboard, you see speedtest in browser, just add `/panel` to the end of address and see your panel:

It will ask you to set a new password and log in — that’s it.  
Installation is complete; the rest of the information below may not be needed by everyone.  
For settings tutorials and tips, refer to the [main guide](../configuration/index.md).

## Advanced configuration (Optional)

### Fixing the Proxy IP

By default, the code uses multiple Proxy IPs randomly, assigning a new random IP for each connection to Cloudflare addresses (covering much of the web). This IP rotation may cause issues, particularly for traders. From version 2.3.5 onward, you can change the Proxy IP via the panel and update the subscription. However, the method below is recommended:

!!! note
    Changing the Proxy IP via the panel requires updating the subscription if the IP stops working, which can disrupt donated configurations, as users without an active subscription cannot update them. Use this method only for personal use. Other methods don’t require subscription updates.

To change the Proxy IP, go to `Workers & Pages`, open your Worker, then go to `Settings` → `Variables and Secrets`:

![Workers env variable](../images/workers-variables.jpg)

Click `Add`, write `PROXY_IP` (uppercase) as the `Variable name`.

You can get IPs from the link below — it shows multiple IPs along with their regions and ISPs. Pick one or more:

```text
https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
```

![Proxy IPs](../images/proxy-ips.jpg)

!!! info
    To use multiple Proxy IPs, enter them comma-separated.
    ```title="Example"
    151.213.181.145, 5.163.51.41, bpb.yousef.isegaro.com
    ```

Enter the IPs in the `Value` field and click `Deploy`.

### Fixing the NAT64 Prefixes

By default, the code uses multiple NAT64 prefixes randomly, assigning a new random prefix for each connection to Cloudflare addresses (covering much of the web). This IP rotation may cause issues, particularly for traders. From version 3.4.2 onward, you can change the prefixes via the panel and update the subscription. However, the method below is recommended:

!!! note
    Changing the NAT64 prefixes via the panel requires updating the subscription if the IP stops working, which can disrupt donated configurations, as users without an active subscription cannot update them. Use this method only for personal use. Other methods don’t require subscription updates.

In the project’s `Settings` section, open `Variables and Secrets`, click `Add` and enter `NAT64_PREFIX` (in capital letters) in the first box. Obtain IPs from the following link, which lists IPs from various regions and ISPs:

```text
https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/NAT64Prefixes.md
```

!!! info
    To use multiple IPs, fill them comma-separated.
    ```title="Example"
    [2602:fc59:b0:64::], [2602:fc59:11:64::]
    ```

Enter the IPs in the `Value` field and click `Deploy`.

### Setting Fallback Domain

By default, accessing the main Worker domain redirects to the Cloudflare speed test site. To change this, follow the same steps as for the Proxy IP, but set the variable name to `FALLBACK` and provide a domain (without `https://` or `http://`) as the value, e.g., `www.speedtest.net` or `npmjs.org`.  

### Changing the Subscription Path

The default subscription link path uses the same UUID as VLESS. For increased privacy, you can change this. Follow the same steps as above, but set the variable name to `SUB_PATH`. The Secrets generator at `/secrets` provides a `Random Subscription URI path` value, which you can use or replace with a custom value (using allowed characters).

### Adding Custom Domain

Go to your Cloudflare dashboard, open your Worker from `Compute (Workers)` > `Workers & Pages`. Go to `Settings` and at the top, you’ll see `Domains & Routes`. Click `Add +`, then choose `Custom domain`.

Enter a domain (you must own and have activated it on the same account).
  
Suppose your domain is `bpb.com`. You can enter the main domain or a subdomain, like `xyz.bpb.com`, then click `Add domain`.

Cloudflare will connect the Worker to your domain (this might take a while — they say up to 24 hours).

Then click `Add +` again, but this time select `Route`. Choose your domain from the `Zone` section, and in the `Route` section, enter it like this:

```title="Route"
*bpb.com/*
```

You can then access your panel via `https://xyz.bpb.com/panel` and retrieve new subscriptions.

!!! tip
    - If you connect a domain to the Worker, your traffic becomes probably unlimited.
    - Worker panels support non-TLS ports like 80, 8080, etc. But once you add a custom domain, those ports stop working and won’t be available in the panel.

## Updating the Panel

To update your panel, download the new worker.js file [from here](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.js). In your Cloudflare account, go to `Compute (Workers)` > `Workers & Pages`, select your Worker project, edit it, delete old worker, upload new one and Deploy.

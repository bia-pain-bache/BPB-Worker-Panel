# :material-new-box:{ .md .middle } Pages Setup - Direct Upload Method

## Steps

### 1. Create Cloudflare Account

If you don’t have a Cloudflare account, create one [here](https://dash.cloudflare.com/sign-up). You only need an email for registration. Due to Cloudflare’s restrictions, use a reputable email provider like Gmail.

### 2. Create Pages Project

Download the Worker zip file [from here](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.zip).

In your Cloudflare account, navigate to the `Developer Platform` section, click `Create application`, select `Pages` tab and then `Use direct upload` > `Get started`.

Enter a `Project Name`, which will form your panel’s domain.

!!! danger
    Choose a name that does not include the word `bpb`, as this may trigger Cloudflare’s detection and result in a `1101` error.

Click `Create Project` and then Upload the downloaded zip file by clicking `Select from computer`, selecting `Upload zip`.

Now click `Deploy site` and then `Continue to project`.

Your project is created but not yet functional. From the `Deployment` page, in the `Production` section, click `Visit`.

!!! warning
    Cloudflare may take up to 5 minutes to set up the Pages domain. Don’t worry if the URL isn’t immediately accessible.

You’ll encounter an error indicating that the UUID and Trojan Password must be set. A link will be provided; open it in your browser and save it for the next step.

![Pages Application](../images/generate-secrets.jpg)

### 3. Create KV

From the left menu, go to `Storage and Databases` > `KV`:

![Pages Application](../images/nav-dash-kv.jpg)

Click `Create`, assign a desired name, and click `Add`.

Return to the `Workers & Pages` section and open your Pages project. Go to the `Binding` section, as shown below:

![Pages Application](../images/settings-functions.jpg)

In the `Bindings` section, click `Add` and select `KV Namespace`. Set the `Variable name` to `kv` (exactly as shown) and select the KV created earlier for `KV namespace`. Click `Save`.

![Pages Application](../images/bind-kv.jpg)

The KV setup is now complete.

### 4. Set UUID, Trojan password and Subscription path

Click `Copy all` from the `Secrets generator` page provided earlier, In Cloudflare dashboard go to `Settings` section, locate the `Variables and Secrets` section. Click `Add` and paste into the `Variable name` field and click `Save`. This will automatically add these 3 parameters to panel.

Click `Create deployment` at the top of the page and upload the same zip file again, as done previously.

Return to the `Deployments` page, click `Visit` in the `Production` section, append `panel/` to the URL, and access the panel.

Additional configuration and tips are available in the [main guide](../configuration/index.md). The installation is complete, and the following advanced settings are optional.

## Advanced configuration (Optional)

### Fixing the Proxy IP

By default, the code uses multiple Proxy IPs randomly, assigning a new random IP for each connection to Cloudflare addresses (covering much of the web). This IP rotation may cause issues, particularly for traders. From version 2.3.5 onward, you can change the Proxy IP via the panel and update the subscription. However, the method below is recommended:

!!! note
    Changing the Proxy IP via the panel requires updating the subscription if the IP stops working, which can disrupt donated configurations, as users without an active subscription cannot update them. Use this method only for personal use. Other methods don’t require subscription updates.

In the project’s `Settings` section, open `Variables and Secrets`:

![Pages Application](../images/pages-env-vars.jpg)

Click `Add` and enter `PROXY_IP` (in capital letters) in the first box. Obtain IPs from the following link, which lists IPs from various regions and ISPs:

```text
https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
```

![Pages Application](../images/proxy-ips.jpg)

!!! info
    To use multiple Proxy IPs, fill them comma-separated.
    ```title="Example"
    151.213.181.145, 5.163.51.41, bpb.yousef.isegaro.com
    ```

Enter the IPs in the `Value` field and click `Save`. Click `Create deployment` at the top of the page and upload the zip file again. The changes will take effect.

### Fixing the NAT64 Prefixes

By default, the code uses multiple NAT64 prefixes randomly, assigning a new random prefix for each connection to Cloudflare addresses (covering much of the web). This IP rotation may cause issues, particularly for traders. From version 3.4.2 onward, you can change the prefixes via the panel and update the subscription. However, the method below is recommended:

!!! note
    Changing the NAT64 prefixes via the panel requires updating the subscription if the IP stops working, which can disrupt donated configurations, as users without an active subscription cannot update them. Use this method only for personal use. Other methods don’t require subscription updates.

In the project’s `Settings` section, open `Variables and Secrets`, click `Add` and enter `NAT64_PREFIX` (in capital letters) in the first box. Obtain IPs from the following link, which lists IPs from various regions and ISPs:

```text
https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/src/protocols/NAT64Prefixes.md
```

!!! info
    To use multiple IPs, fill them comma-separated.
    ```title="Example"
    [2602:fc59:b0:64::], [2602:fc59:11:64::]
    ```

Enter the IPs in the `Value` field and click `Save`. Click `Create deployment` at the top of the page and upload the zip file again. The changes will take effect.

### Setting Fallback Domain

By default, accessing the main Pages domain redirects to the Cloudflare speed test site. To change this, follow the same steps as for the Proxy IP, but set the variable name to `FALLBACK` and provide a domain (without `https://` or `http://`) as the value, e.g., `www.speedtest.net` or `npmjs.org`.

### Changing the Subscription Path

The default subscription link path uses the same UUID as VLESS. For increased privacy, you can change this. Follow the same steps as above, but set the variable name to `SUB_PATH`. The secrets page or Secrets generator provides a `Random Subscription URI path` value, which you can use or replace with a custom value (using allowed characters).

### Adding Custom Domain

In your Cloudflare dashboard, navigate to `Compute (Workers)` > `Workers & Pages` and select your panel. In the `Custom domains` tab, click `Set up a custom domain`. Enter a domain (you must own and have activated it on the same account). For example, if you own `bpb.com`, you can use the domain itself or a subdomain like `xyz.bpb.com`. Click `Continue` and then `Activate domain`.

In your domain zone, add a CNAME DNS Record for `xyz.bpb.com` pointing to your Pages domain. Cloudflare will connect the Pages to your domain after a short period. You can then access your panel via `https://xyz.bpb.com/panel` and retrieve new subscriptions.

## Updating the Panel

To update your panel, download the new zip file [from here](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.zip). In your Cloudflare account, go to `Compute (Workers)` > `Workers & Pages`, select your Pages project, click `Create deployment`, and upload the new zip file.

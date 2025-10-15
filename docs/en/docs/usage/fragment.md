# :material-playlist-check:{ .md .middle } Fragment subscription

![Fragment subscription](../images/fragment-sub.jpg)

!!! tip "**Benefits of Fragment configs**"
    - Maintains connectivity even if the Custom Domain or Worker domain is blocked by the ISP.
    - Enhances stability and speed across all ISPs, particularly those experiencing disruptions with Cloudflare.

## Fragment for Xray

This applies to clients using the Xray core, such as v2rayNG, MansaNG, and v2rayN PRO. Imported configs are marked with an `F` flag in their names. This subscription provides the same number of configs as the **Normal** subscription, enhanced with fragment settings adjustable in the panel, plus **Best Fragment** and **Workerless** configs. Any panel setting changes are applied to all configs upon subscription update.

???+ question "What is the Workerless config?"
    The Workerless config unblocks many restricted websites and applications (e.g., YouTube, Twitter, Google Play...) without using a Worker. Note that this config does not change your local IP, so avoid using it for activities requiring security or anonymity. Fragment setting changes apply to this config, except for Chain Proxy.

???+ question "What is the Best Fragment config?"
    The Best Fragment config tests 18 different fragment settings, selecting the fastest based on your ISP’s performance. These modes are designed to cover all primary scenarios, with the config testing all modes every 30s and connecting to the optimal one. Advanced fragment settings are detailed [here](../configuration/fragment.md).

## Fragment for sing-box

Starting from version 1.12.0 sing-box core and related clients support fragment, you can use this sub by official sing-box client like husi or v2rayN which has sing-box core embeded.

# :material-playlist-check:{ .md .middle } DNS over HTTPS (DoH)

As most of famous public DoH servers are blocked by firewalls, we can use domain fronting to successfully use them. BPB DoH only supports RFC 8484 standard DoH servers which typically are in `https://domain/dns-query` format. For example Google has two types of DoH `https://dns.google/dns-query` which is RFC 8484 and `https://dns.google/resolve` which is JSON API. BPB only supports the first type.

To change underlying DoH you can set an environment variable named `DOH_URL` in worker settings and set your desired DoH.

!!! warning
    Avoid using BPB DoH for `remote DNS`, otherwise you will waste your worker requests. It's better be use in browsers or DoH based clients like Intra, Rethink...

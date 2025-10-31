import { DokodemoDoorInbound, MixedInbound } from "types/xray";

export function buildMixedInbound(
    allowLANConnection: boolean,
    sniffQuic: boolean,
    sniffFakeDNS: boolean
): MixedInbound {
    const destOverride: Array<"http" | "tls" | "quic" | "fakedns"> = ["http", "tls"]
        .concatIf(sniffQuic, "quic")
        .concatIf(sniffFakeDNS, "fakedns");

    return {
        listen: allowLANConnection ? "0.0.0.0" : "127.0.0.1",
        port: 10808,
        protocol: "socks",
        settings: {
            auth: "noauth",
            udp: true
        },
        sniffing: {
            destOverride,
            enabled: true,
            routeOnly: true
        },
        tag: "mixed-in"
    };
}

export function buildDokodemoInbound(allowLANConnection: boolean): DokodemoDoorInbound {
    return {
        listen: allowLANConnection ? "0.0.0.0" : "127.0.0.1",
        port: 10853,
        protocol: "dokodemo-door",
        settings: {
            address: "1.1.1.1",
            network: "tcp,udp",
            port: 53
        },
        tag: "dns-in"
    };
}
import { DokodemoDoorInbound, MixedInbound } from "#types/xray";
import { concatIf } from "@utils";

export function buildMixedInbound(
    allowLANConnection: boolean,
    sniffQuic: boolean,
    sniffFakeDNS: boolean
): MixedInbound {
    const destOverride = concatIf(
        concatIf(
            ["http", "tls"] as Array<"http" | "tls" | "quic" | "fakedns">,
            sniffQuic,
            "quic" as const
        ),
        sniffFakeDNS,
        "fakedns" as const
    );

    return {
        listen: allowLANConnection ? "0.0.0.0" : "127.0.0.1",
        port: 10808,
        protocol: "mixed",
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
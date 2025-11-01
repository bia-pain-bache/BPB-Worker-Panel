import { MixedInbound, TunInbound } from "types/sing-box";

export function buildTunInbound(): TunInbound {
    const { enableIPv6 } = globalThis.settings;
    return {
        type: "tun",
        tag: "tun-in",
        address: ["172.18.0.1/30"].concatIf(enableIPv6, "fdfe:dcba:9876::1/126"),
        mtu: 9000,
        auto_route: true,
        strict_route: true,
        stack: "mixed"
    };
}

export function buildMixedInbound(): MixedInbound {
    const { allowLANConnection } = globalThis.settings;
    return {
        type: "mixed",
        tag: "mixed-in",
        listen: allowLANConnection ? "0.0.0.0" : "127.0.0.1",
        listen_port: 2080
    };
}
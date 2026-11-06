/** Session lifecycle states for Telegram Web Proxy Durable Objects. */
export type SessionLifecycle =
    | 'created'
    | 'waiting_connection'
    | 'connected'
    | 'active'
    | 'idle'
    | 'closing'
    | 'closed'
    | 'expired';

export type FrameType = number;

export interface ParsedFrame {
    type: number;
    streamId: number;
    payload: Uint8Array;
}

export interface BootstrapPayload {
    /** JWT-style purpose marker */
    pur: 'bootstrap';
    /** Unique one-time id */
    jti: string;
    /** Unix expiry seconds */
    exp: number;
}

export interface TwpEnv {
    SESSIONS?: DurableObjectNamespace;
    PROXY_SECRET?: string;
    SESSION_SIGNING_SECRET?: string;
    PUBLIC_HOSTNAME?: string;
    SESSION_TTL_SECONDS?: string;
    SESSION_IDLE_SECONDS?: string;
    MAX_STREAMS?: string;
    MAX_SESSIONS_PER_WINDOW?: string;
    DIAGNOSTICS?: string;
}

export const DEFAULT_SESSION_TTL_SECONDS = 300;
export const DEFAULT_SESSION_IDLE_SECONDS = 900;
export const DEFAULT_MAX_STREAMS = 64;

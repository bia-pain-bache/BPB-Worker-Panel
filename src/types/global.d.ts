import { EmbededSettings } from './settings';

declare global {
    interface Env {
        readonly CF_PAGES: string;
        readonly kv: KVNamespace;
        readonly UUID?: string;
        readonly TR_PASS?: string;
        readonly SESSIONS?: DurableObjectNamespace;
        readonly PROXY_SECRET?: string;
        readonly SESSION_SIGNING_SECRET?: string;
        readonly PUBLIC_HOSTNAME?: string;
        readonly SESSION_TTL_SECONDS?: string;
        readonly SESSION_IDLE_SECONDS?: string;
        readonly MAX_SESSIONS_PER_WINDOW?: string;
        readonly MAX_STREAMS?: string;
        readonly DIAGNOSTICS?: string;
    }

    const SOURCE_CONTENT: string;
    const EMBEDED_SETTINGS: EmbededSettings;
    const VERSION: string;
    const ERROR_HTML_CONTENT: string;
    const PANEL_HTML_CONTENT: string;
    const LOGIN_HTML_CONTENT: string;
    const PROXY_IP_HTML_CONTENT: string;
    const ICON_CONTENT: string;
    const _VL_: string;
    const _VL_CAP_: string;
    const _VM_: string;
    const _VM_CAP_: string;
    const _TR_: string;
    const _TR_CAP_: string;
    const _SS_: string;
    const _V2_: string;
    const _project_: string;
    const _project_SM_: string;
    const _repo_: string;
    const _wizard_repo_: string;
    const _website_: string;
    const _public_proxy_ip_: string;

    interface Array<T> {
        concatIf<T>(condition: boolean, concat: T | T[]): T[];
    }

    interface Object {
        omitEmpty<T>(): T | undefined;
    }
}

export { };

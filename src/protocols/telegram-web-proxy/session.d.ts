import type { TwpEnv, SessionLifecycle } from './types';

export declare class RelaySession {
  constructor(ctx: DurableObjectState, env: TwpEnv, connect: unknown);
  fetch(request: Request): Promise<Response>;
  alarm?(): Promise<void>;
  lifecycle: SessionLifecycle;
}

export declare function waitFor(
  promise: Promise<unknown>,
  signal: AbortSignal,
  timeout: number,
  reason: string
): Promise<unknown>;

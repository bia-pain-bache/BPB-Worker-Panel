import type { TwpEnv } from './types';

export declare class RelaySession {
  constructor(ctx: DurableObjectState, env: TwpEnv, connect: unknown);
  fetch(request: Request): Promise<Response>;
  alarm?(): Promise<void>;
}

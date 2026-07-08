import { authenticate } from '@auth';
import { HttpStatus, respond, safeError } from '@common';
import { getGlobals, getSettings } from '@settings';
import { json } from 'node:stream/consumers';

interface CfUsageResult {
    success: boolean;
    total?: number;
    worker?: number;
    error?: string;
}

export async function getCfWorkerUsage(): Promise<CfUsageResult> {
    const { accID, apiToken, mainDomain } = getGlobals();
    const scriptName = mainDomain.split('.')[0];

    try {
        const now = new Date();
        const datetimeEnd = now.toISOString();
        const datetimeStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

        const gqlQuery = {
            query: `
                query GetUsage($accountTag: String!, $scriptName: String!, $start: String!, $end: String!) {
                    viewer {
                        accounts(filter: { accountTag: $accountTag }) {
                            total: workersInvocationsAdaptive(
                                limit: 100
                                filter: { datetime_geq: $start, datetime_leq: $end }
                            ) {
                                sum { requests }
                            }
                            worker: workersInvocationsAdaptive(
                                limit: 100
                                filter: { scriptName: $scriptName, datetime_geq: $start, datetime_leq: $end }
                            ) {
                                sum { requests }
                            }
                        }
                    }
                }
            `,
            variables: {
                accountTag: accID,
                scriptName,
                start: datetimeStart,
                end: datetimeEnd
            }
        };

        const gqlRes = await fetch(`https://api.cloudflare.com/client/v4/graphql?nocache=${Date.now()}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gqlQuery)
        });

        const gqlData: any = await gqlRes.json();
        const account = gqlData?.data?.viewer?.accounts?.[0];

        const totalRequests = (account?.total ?? []).reduce(
            (sum: number, entry: any) => sum + (entry?.sum?.requests || 0), 0
        );
        const workerRequests = (account?.worker ?? []).reduce(
            (sum: number, entry: any) => sum + (entry?.sum?.requests || 0), 0
        );

        return { success: true, total: totalRequests, worker: workerRequests };
    } catch (error) {
        return { success: false, error: 'Error fetching usage data. Check your credentials.' };
    }
}

export async function getUsage(request: Request, env: Env) {
    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            throw new Error('Unauthorized or expired session.');
        }

        const usage = await getCfWorkerUsage();
        if (!usage.success) return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch account usage.');
        return respond(true, HttpStatus.OK, '', {total: usage.total, worker: usage.worker});
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Error occurred while fetching usage: ${safeError(error)}`);
    }
}
import { safeError } from '@common';
import { getGlobals } from '@settings';

export async function listZones() {
    const { apiToken } = getGlobals();

    try {
        const res = await fetch('https://api.cloudflare.com/client/v4/zones', {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        });

        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
        return data.result;
    } catch (error) {
        throw new Error(`Failed to list account DNS zones: ${safeError(error)}`);
    }
}

export async function createCNAME(zoneID: string, domain: string) {
    const { apiToken, mainDomain } = getGlobals();
    const projectName = mainDomain.split('.')[0];

    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneID}/dns_records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: domain,
                ttl: 1,
                type: 'CNAME',
                comment: `${_project_} Panel`,
                content: projectName,
                proxied: true
            })
        });

        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
    } catch (error) {
        throw new Error(`Failed to create DNS record: ${safeError(error)}`);
    }
}


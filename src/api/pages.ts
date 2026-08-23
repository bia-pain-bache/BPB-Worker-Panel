import { safeError } from '@common';
import { getGlobals } from '@settings';

export async function deployPages(script: string) {
    const { accID, apiToken, mainDomain } = getGlobals();
    const projectName = mainDomain.split('.')[0];
    const uploadForm = new FormData();
    uploadForm.append('manifest', '{}');
    uploadForm.append(
        '_worker.js',
        new Blob([script], { type: 'application/javascript' }),
        '_worker.js'
    );

    try {
        const deployRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}/deployments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiToken}` },
            body: uploadForm
        });

        const deployData: any = await deployRes.json();
        if (!deployData.success) throw new Error(deployData?.errors?.[0]?.message || JSON.stringify(deployData.errors));
    } catch (error) {
        throw new Error(`Failed to create Pages deployment: ${safeError(error)}`);
    }
}

export async function getPagesDomains(): Promise<string[]> {
    const { accID, apiToken, mainDomain } = getGlobals();
    const projectName = mainDomain.split('.')[0];

    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}/domains`, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });

        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
        return data.result.map((r: any) => r.hostname);
    } catch (error) {
        throw new Error(`Failed to get Pages project domains: ${safeError(error)}`);
    }
}

export async function setPagesDomain(domain: string) {
    const { accID, apiToken, mainDomain } = getGlobals();
    const projectName = mainDomain.split('.')[0];

    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}/domains`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: domain
            })
        });

        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
    } catch (error) {
        throw new Error(`Failed to set Pages project domain: ${safeError(error)}`);
    }
}

export async function deletePagesProject() {
    const { accID, apiToken, mainDomain } = getGlobals();
    const projectName = mainDomain.split('.')[0];
    console.log(mainDomain)

    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/pages/projects/${projectName}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });

        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
    } catch (error) {
        throw new Error(`Failed to delete pages project: ${safeError(error)}`);
    }
}
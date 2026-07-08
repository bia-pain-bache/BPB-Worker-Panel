import { WarpAccount } from '#types/settings';
import { getWarpAccounts } from '@settings';
import { generateKeyPairSync } from 'node:crypto';

interface WarpKeys {
    publicKey: string;
    privateKey: string;
}

export async function fetchWarpAccounts(env: Env): Promise<WarpAccount[]> {
    const warpAccounts: WarpAccount[] = [];
    const defaultWarpAccounts = getWarpAccounts();

    try {

        const warpKeys = [
            await generateKeyPair(),
            await generateKeyPair()
        ];

        for (const [index, key] of warpKeys.entries()) {
            const { config } = await fetchAccount(key);
            warpAccounts.push({
                privateKey: key.privateKey,
                warpIPv6: `${config.interface.addresses.v6}/128`,
                reserved: config.client_id,
                publicKey: config.peers[0].public_key
            });

            if (index === 0) await new Promise(resolve => setTimeout(resolve, 2000));
        }

        await env.kv.put('warpAccounts', JSON.stringify(warpAccounts));
        return warpAccounts;

    } catch (error) {
        console.error(
            'Failed to fetch new WARP accounts:',
            error instanceof Error ? error.message : String(error)
        );

        return defaultWarpAccounts;
    }
}

async function fetchAccount(key: WarpKeys): Promise<any> {
    const response = await fetch('https://api.cloudflareclient.com/v0a4005/reg', {
        method: 'POST',
        headers: {
            'User-Agent': 'insomnia/13.0.2',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            install_id: '',
            fcm_token: '',
            tos: new Date().toISOString(),
            type: 'Android',
            model: 'PC',
            locale: 'en_US',
            warp_enabled: true,
            key: key.publicKey
        })
    });

    if (!response.ok) {
        throw new Error(`API returned status ${response.status}: ${await response.text()}`);
    }

    return response.json();
}

async function generateKeyPair(): Promise<WarpKeys> {
    const { publicKey, privateKey } = generateKeyPairSync('x25519', {
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'der' }
    });

    return {
        publicKey: publicKey.subarray(-32).toString('base64'),
        privateKey: privateKey.subarray(-32).toString('base64')
    };
}
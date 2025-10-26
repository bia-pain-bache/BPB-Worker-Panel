interface WarpKeys {
    publicKey: string;
    privateKey: string;
}

export async function fetchWarpConfigs(env: Env): Promise<WarpAccount[]> {
    const WarpAccounts: WarpAccount[] = [];
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';
    const warpKeys = [
        await generateKeyPair(),
        await generateKeyPair()
    ];

    const commonPayload = {
        install_id: "",
        fcm_token: "",
        tos: new Date().toISOString(),
        type: "Android",
        model: 'PC',
        locale: 'en_US',
        warp_enabled: true
    };

    const fetchAccount = async (key: WarpKeys) => {
        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'User-Agent': 'insomnia/8.6.1',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...commonPayload, key: key.publicKey })
            });

            return await response.json();
        } catch (error) {
            throw new Error(`Failed to get warp configs: ${error}`);
        }
    };

    for (const key of warpKeys) {
        const accountData = await fetchAccount(key);
        WarpAccounts.push({
            privateKey: key.privateKey,
            account: accountData
        });
    }

    // const configs = JSON.stringify(warpConfigs)
    await env.kv.put('warpConfigs', JSON.stringify(WarpAccounts));

    return WarpAccounts;
}

async function generateKeyPair(): Promise<WarpKeys> {
    const keyPair = await crypto.subtle.generateKey(
        { name: "X25519", namedCurve: "X25519" },
        true,
        ["deriveBits"]
    );

    const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const privateKeyRaw = new Uint8Array(pkcs8).slice(-32);

    const publicKeyRaw = new Uint8Array(
        await crypto.subtle.exportKey("raw", keyPair.publicKey)
    );

    const base64Encode = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));

    return {
        publicKey: base64Encode(publicKeyRaw),
        privateKey: base64Encode(privateKeyRaw)
    };
}
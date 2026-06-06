interface WarpKeys {
    publicKey: string;
    privateKey: string;
}

const defaultWarpAccounts: WarpAccount[] = [
    {
        privateKey: "sBmQVHEywGAKQ8Ratzo/f5OUCa7MSozZpz1JK2PSVXE=",
        publicKey: "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
        warpIPv6: "2606:4700:110:8dd8:de5f:9a89:bfac:749c/128",
        reserved: "59nK"
    },
    {
        privateKey: "OPiD4dePq8652DICknJsTJS4UH0FoWY1ffOZzZhIsUs=",
        publicKey: "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
        warpIPv6: "2606:4700:110:8912:1225:70c8:1ad7:6ce0/128",
        reserved: "G/nh"
    }
];

export async function fetchWarpAccounts(env: Env): Promise<WarpAccount[]> {
    const warpAccounts: WarpAccount[] = [];

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

            if (index === 0) await new Promise(resolve => setTimeout(resolve, 1000));
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
            'User-Agent': 'insomnia/8.6.1',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            install_id: "",
            fcm_token: "",
            tos: new Date().toISOString(),
            type: "Android",
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
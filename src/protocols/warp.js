import nacl from 'tweetnacl';

export async function fetchWarpConfigs (env, proxySettings) {
    let warpConfigs = [];
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';
    const { warpPlusLicense } = proxySettings;
    const warpKeys = [ generateKeyPair(), generateKeyPair() ];
    const commonPayload = {
        install_id: "",
        fcm_token: "",
        tos: new Date().toISOString(),
        type: "Android",
        model: 'PC',
        locale: 'en_US',
        warp_enabled: true
    };

    const fetchAccount = async (key) => {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'User-Agent': 'insomnia/8.6.1',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...commonPayload, key: key.publicKey })
        });
        return await response.json();
    };

    const updateAccount = async (accountData, key) => {
        const response = await fetch(`${apiBaseUrl}/${accountData.id}/account`, {
            method: 'PUT',
            headers: {
                'User-Agent': 'insomnia/8.6.1',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accountData.token}`
            },
            body: JSON.stringify({ ...commonPayload, key: key.publicKey, license: warpPlusLicense })
        });
        return {
            status: response.status,
            data: await response.json()
        };
    };

    for (const key of warpKeys) {
        const accountData = await fetchAccount(key);
        warpConfigs.push({
            privateKey: key.privateKey,
            account: accountData
        });

        if (warpPlusLicense) {
            const { status, data: responseData } = await updateAccount(accountData, key);
            if (status !== 200 && !responseData.success) {
                return { error: responseData.errors[0]?.message, configs: null };
            }
        }
    }
    
    const configs = JSON.stringify(warpConfigs)
    await env.bpb.put('warpConfigs', configs);
    return { error: null, configs };
}

const generateKeyPair = () => {
    const base64Encode = (array) => btoa(String.fromCharCode.apply(null, array));
	let privateKey = nacl.randomBytes(32);
	privateKey[0] &= 248;
	privateKey[31] &= 127;
	privateKey[31] |= 64;
	let publicKey = nacl.scalarMult.base(privateKey);
	const publicKeyBase64 = base64Encode(publicKey);
	const privateKeyBase64 = base64Encode(privateKey);
	return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
};
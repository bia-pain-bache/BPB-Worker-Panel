import nacl from 'tweetnacl';

export async function fetchWarpConfigs (env) {
    let warpConfigs = [];
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';
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

    for (const key of warpKeys) {
        const accountData = await fetchAccount(key);
        warpConfigs.push({
            privateKey: key.privateKey,
            account: accountData
        });
    }
    
    const configs = JSON.stringify(warpConfigs)
    await env.kv.put('warpConfigs', configs);
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
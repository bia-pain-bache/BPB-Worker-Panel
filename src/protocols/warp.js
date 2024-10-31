import nacl from 'tweetnacl';

export async function fetchWgConfig (env, proxySettings) {
    let warpConfigs = [];
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';

    const { warpPlusLicense } = proxySettings;
    const warpKeys = [generateKeyPair(), generateKeyPair()];

    for(let i = 0; i < 2; i++) {
        const accountResponse = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'User-Agent': 'insomnia/8.6.1',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: warpKeys[i].publicKey,
                install_id: "",
                fcm_token: "",
                tos: new Date().toISOString(),
                type: "Android",
                model: 'PC',
                locale: 'en_US',
                warp_enabled: true
            })
        });

        const accountData = await accountResponse.json();
        warpConfigs.push ({
            privateKey: warpKeys[i].privateKey,
            account: accountData
        });

        if (warpPlusLicense) {
            const response = await fetch(`${apiBaseUrl}/${accountData.id}/account`, {
                method: 'PUT',
                headers: {
                    'User-Agent': 'insomnia/8.6.1',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accountData.token}`
                },
                body: JSON.stringify({
                    key: warpKeys[i].publicKey,
                    install_id: "",
                    fcm_token: "",
                    tos: new Date().toISOString(),
                    type: "Android",
                    model: 'PC',
                    locale: 'en_US',
                    warp_enabled: true,
                    license: warpPlusLicense
                })
            });

            const responseData = await response.json();
            if(response.status !== 200 && !responseData.success) return { error: responseData.errors[0]?.message, configs: null}
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
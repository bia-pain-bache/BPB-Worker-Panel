import { Authenticate } from "../authentication/auth";
import { extractWireguardParams } from "../cores-configs/helpers";
import { getDataset, updateDataset } from "../kv/handlers";
import { renderHomePage } from "../pages/home";

export function isValidUUID(uuid) {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

export async function resolveDNS (domain) {
    const dohURL = 'https://cloudflare-dns.com/dns-query';
    const dohURLv4 = `${dohURL}?name=${encodeURIComponent(domain)}&type=A`;
    const dohURLv6 = `${dohURL}?name=${encodeURIComponent(domain)}&type=AAAA`;

    try {
        const [ipv4Response, ipv6Response] = await Promise.all([
            fetch(dohURLv4, { headers: { accept: 'application/dns-json' } }),
            fetch(dohURLv6, { headers: { accept: 'application/dns-json' } })
        ]);

        const ipv4Addresses = await ipv4Response.json();
        const ipv6Addresses = await ipv6Response.json();

        const ipv4 = ipv4Addresses.Answer
            ? ipv4Addresses.Answer.map((record) => record.data)
            : [];
        const ipv6 = ipv6Addresses.Answer
            ? ipv6Addresses.Answer.map((record) => record.data)
            : [];

        return { ipv4, ipv6 };
    } catch (error) {
        console.error('Error resolving DNS:', error);
        throw new Error(`An error occurred while resolving DNS - ${error}`);
    }
}

export function isDomain(address) {
    const domainPattern = /^(?!\-)(?:[A-Za-z0-9\-]{1,63}\.)+[A-Za-z]{2,}$/;
    return domainPattern.test(address);
}

export async function handlePanel(request, env) {
    const auth = await Authenticate(request, env); 
    if (request.method === 'POST') {     
        if (!auth) return new Response('Unauthorized or expired session!', { status: 401 });             
        await updateDataset(request, env); 
        return new Response('Success', { status: 200 });
    }
        
    const { proxySettings } = await getDataset(request, env);
    const pwd = await env.kv.get('pwd');
    if (pwd && !auth) return Response.redirect(`${globalThis.urlOrigin}/login`, 302);
    const isPassSet = pwd?.length >= 8;
    return await renderHomePage(proxySettings, isPassSet);
}

export async function fallback(request) {
    const url = new URL(request.url);
    url.hostname = globalThis.fallbackDomain;
    url.protocol = 'https:';
    const newRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'manual'
    });
    
    return await fetch(newRequest);
}

export async function getMyIP(request) {
    const ip = await request.text();
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?nocache=${Date.now()}`);
        const geoLocation = await response.json();
        return new Response(JSON.stringify(geoLocation), {
            status: 200,
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            }
        });
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

export async function getWarpConfigFiles(request, env) {
    const auth = await Authenticate(request, env);
    if (!auth) return new Response('Unauthorized or expired session!', { status: 401 });
    const { warpConfigs, proxySettings } = await getDataset(request, env);
    const { warpEndpoints } = proxySettings
    const warpConfig = extractWireguardParams(warpConfigs, false);
    const { warpIPv6, publicKey, privateKey} = warpConfig;
    const warpConfs = [];
    warpEndpoints.split(',').forEach( endpoint => {
        const warpConf = 
`[Interface]
PrivateKey = ${privateKey}
Address = 172.16.0.2/32, ${warpIPv6}
DNS = 1.1.1.1, 1.0.0.1
MTU = 1280
[Peer]
PublicKey = ${publicKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = ${endpoint}`;
        warpConfs.push(warpConf);
    });
    return new Response(JSON.stringify(warpConfs), { 
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });   
}
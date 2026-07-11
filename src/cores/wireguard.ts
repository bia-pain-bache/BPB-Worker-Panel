import { HttpStatus, respond, safeError } from '@common';
import { getSettings, getWarpAccounts } from '@settings';
import JSZip from 'jszip';

export async function getWarpConfigs(isPro: boolean): Promise<Response> {
    try {
        const { warpIPv6, publicKey, privateKey } = getWarpAccounts()[0];
        const {
            warpEndpoints,
            warpRemoteDNS,
            amneziaNoiseCount,
            amneziaNoiseSizeMin,
            amneziaNoiseSizeMax
        } = getSettings();

        const zip = new JSZip();

        warpEndpoints?.forEach((endpoint, index) => {
            const conf = [
                '[Interface]',
                `PrivateKey = ${privateKey}`,
                `Address = 172.16.0.2/32, ${warpIPv6}`,
                `DNS = ${warpRemoteDNS}`,
                'MTU = 1280',
                ...(isPro ? [
                    `Jc = ${amneziaNoiseCount}`,
                    `Jmin = ${amneziaNoiseSizeMin}`,
                    `Jmax = ${amneziaNoiseSizeMax}`,
                    'S1 = 0',
                    'S2 = 0',
                    'H1 = 1',
                    'H2 = 2',
                    'H3 = 3',
                    'H4 = 4'
                ] : []),
                '',
                '[Peer]',
                `PublicKey = ${publicKey}`,
                'AllowedIPs = 0.0.0.0/0, ::/0',
                `Endpoint = ${endpoint}`,
                'PersistentKeepalive = 25'
            ].join('\n');

            zip.file(`${_project_}-Warp-${index + 1}.conf`, conf);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const arrayBuffer = await zipBlob.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename=${_project_}-Warp-${isPro ? 'Pro-' : ''}conf.zip`,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache'
            },
        });
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Error generating ZIP file: ${safeError(error)}`);
    }
}
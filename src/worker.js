// https://github.com/bia-pain-bache/BPB-Worker-Panel
import { vlessOverWSHandler } from './protocols/vless';
import { trojanOverWSHandler } from './protocols/trojan';
import { updateWarpConfigs } from './kv/handlers';
import { logout, resetPassword, login } from './authentication/auth';
import { renderErrorPage } from './pages/error';
import { getXrayCustomConfigs, getXrayWarpConfigs } from './cores-configs/xray';
import { getSingBoxCustomConfig, getSingBoxWarpConfig } from './cores-configs/sing-box';
import { getClashNormalConfig, getClashWarpConfig } from './cores-configs/clash';
import { getNormalConfigs } from './cores-configs/normalConfigs';
import { initializeParams, userID, client, pathName } from './helpers/init';
import { fallback, getMyIP, handlePanel } from './helpers/helpers';

export default {
    async fetch(request, env) {
        try {          
            const upgradeHeader = request.headers.get('Upgrade');
            await initializeParams(request, env);
            if (!upgradeHeader || upgradeHeader !== 'websocket') {            
                switch (pathName) {                    
                    case '/update-warp':
                        return await updateWarpConfigs(request, env);

                    case `/sub/${userID}`:
                        if (client === 'sfa') return await getSingBoxCustomConfig(request, env, false);
                        if (client === 'clash') return await getClashNormalConfig(request, env);
                        if (client === 'xray') return await getXrayCustomConfigs(request, env, false);
                        return await getNormalConfigs(request, env);                        

                    case `/fragsub/${userID}`:
                        return client === 'hiddify'
                            ? await getSingBoxCustomConfig(request, env, true)
                            : await getXrayCustomConfigs(request, env, true);

                    case `/warpsub/${userID}`:
                        if (client === 'clash') return await getClashWarpConfig(request, env);   
                        if (client === 'singbox' || client === 'hiddify') return await getSingBoxWarpConfig(request, env, client);
                        return await getXrayWarpConfigs(request, env, client);

                    case '/panel':
                        return await handlePanel(request, env);
                                                      
                    case '/login':
                        return await login(request, env);
                    
                    case '/logout':                        
                        return logout();        

                    case '/panel/password':
                        return await resetPassword(request, env);
                    
                    case '/my-ip':
                        return await getMyIP(request);

                    default:
                        return await fallback(request);
                }
            } else {
                return pathName.startsWith('/tr') 
                    ? await trojanOverWSHandler(request, env) 
                    : await vlessOverWSHandler(request, env);
            }
        } catch (err) {
            return await renderErrorPage(request, env, 'Something went wrong!', err, false);
        }
    }
};
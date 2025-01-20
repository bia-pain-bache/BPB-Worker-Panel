import { initializeParams } from './helpers/init';
import { VLOverWSHandler } from './protocols/vless';
import { TROverWSHandler } from './protocols/trojan';
import { updateWarpConfigs } from './kv/handlers';
import { logout, resetPassword, login } from './authentication/auth';
import { renderErrorPage } from './pages/error';
import { getXrayCustomConfigs, getXrayWarpConfigs } from './cores-configs/xray';
import { getSingBoxCustomConfig, getSingBoxWarpConfig } from './cores-configs/sing-box';
import { getClashNormalConfig, getClashWarpConfig } from './cores-configs/clash';
import { getNormalConfigs } from './cores-configs/normalConfigs';
import { fallback, getMyIP, handlePanel } from './helpers/helpers';
import { renderSecretsPage } from './pages/secrets';

export default {
    async fetch(request, env) {
        try {    
            initializeParams(request, env);
            const upgradeHeader = request.headers.get('Upgrade');
            if (!upgradeHeader || upgradeHeader !== 'websocket') {            
                switch (globalThis.pathName) {                    
                    case '/update-warp':
                        return await updateWarpConfigs(request, env);

                    case `/sub/${globalThis.subPath}`:
                        if (globalThis.client === 'sfa') return await getSingBoxCustomConfig(request, env, false);
                        if (globalThis.client === 'clash') return await getClashNormalConfig(request, env);
                        if (globalThis.client === 'xray') return await getXrayCustomConfigs(request, env, false);
                        return await getNormalConfigs(request, env);                        

                    case `/fragsub/${globalThis.subPath}`:
                        return globalThis.client === 'hiddify'
                            ? await getSingBoxCustomConfig(request, env, true)
                            : await getXrayCustomConfigs(request, env, true);

                    case `/warpsub/${globalThis.subPath}`:
                        if (globalThis.client === 'clash') return await getClashWarpConfig(request, env);   
                        if (globalThis.client === 'singbox' || globalThis.client === 'hiddify') return await getSingBoxWarpConfig(request, env, globalThis.client);
                        return await getXrayWarpConfigs(request, env, globalThis.client);

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

                    case '/secrets':
                        return await renderSecretsPage();

                    default:
                        return await fallback(request);
                }
            } else {
                return globalThis.pathName.startsWith('/tr') 
                    ? await TROverWSHandler(request) 
                    : await VLOverWSHandler(request);
            }
        } catch (err) {
            return await renderErrorPage(err);
        }
    }
};
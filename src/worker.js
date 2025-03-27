import { initializeParams } from './helpers/init';
import { VLOverWSHandler } from './protocols/vless';
import { TROverWSHandler } from './protocols/trojan';
import { updateWarpConfigs } from './kv/handlers';
import { logout, resetPassword, login } from './authentication/auth';
import { renderErrorPage } from './pages/error';
import { getXrayCustomConfigs, getXrayWarpConfigs } from './cores-configs/xray';
import { getSingBoxCustomConfig, getSingBoxWarpConfig } from './cores-configs/sing-box';
import { getClashNormalConfig, getClashWarpConfig } from './cores-configs/clash';
import { getHiddifyWarpConfigs, getNormalConfigs } from './cores-configs/normalConfigs';
import { fallback, getMyIP, getWarpConfigs, handlePanel } from './helpers/helpers';
import { renderSecretsPage } from './pages/secrets';

export default {
    async fetch(request, env) {
        try {    
            initializeParams(request, env);
            const { pathName, subPath, client } = globalThis;
            const upgradeHeader = request.headers.get('Upgrade');
            if (!upgradeHeader || upgradeHeader !== 'websocket') {            
                switch (pathName) {                    
                    case '/update-warp':
                        return await updateWarpConfigs(request, env);
                    
                    case '/get-warp-configs':
                        return client === 'amnezia' 
                            ? await getWarpConfigs(request, env, true)
                            : await getWarpConfigs(request, env)

                    case `/sub/${subPath}`:
                        if (client === 'sfa') return await getSingBoxCustomConfig(request, env, false);
                        if (client === 'clash') return await getClashNormalConfig(request, env);
                        if (client === 'xray') return await getXrayCustomConfigs(request, env, false);
                        return await getNormalConfigs(request, env);                        

                    case `/fragsub/${subPath}`:
                        return client === 'hiddify-frag'
                            ? await getNormalConfigs(request, env)
                            : await getXrayCustomConfigs(request, env, true);

                    case `/warpsub/${subPath}`:
                        if (client === 'clash') return await getClashWarpConfig(request, env);   
                        if (client === 'clash-pro') return await getClashWarpConfig(request, env, true);   
                        if (client === 'singbox') return await getSingBoxWarpConfig(request, env, client);
                        if (client === 'hiddify-pro') return await getHiddifyWarpConfigs(request, env, true);
                        if (client === 'hiddify') return await getHiddifyWarpConfigs(request, env, false);
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

                    case '/secrets':
                        return await renderSecretsPage();

                    default:
                        return await fallback(request);
                }
            } else {
                return pathName.startsWith('/tr') 
                    ? await TROverWSHandler(request) 
                    : await VLOverWSHandler(request);
            }
        } catch (err) {
            return await renderErrorPage(err);
        }
    }
};
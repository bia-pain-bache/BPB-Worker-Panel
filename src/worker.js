// https://github.com/bia-pain-bache/BPB-Worker-Panel
import { vlessOverWSHandler } from './protocols/vless.js';
import { trojanOverWSHandler } from './protocols/trojan.js';
import { fetchWgConfig } from './protocols/warp.js';
import { getDataset, updateDataset } from './kv/handlers.js';
import { generateJWTToken, generateSecretKey, Authenticate } from './authentication/auth.js';
import { renderHomePage } from './pages/homePage.js';
import { renderLoginPage } from './pages/loginPage.js';
import { renderErrorPage } from './pages/errorPage.js';
import { getXrayCustomConfigs, getXrayWarpConfigs } from './cores/xray.js';
import { getSingBoxCustomConfig, getSingBoxWarpConfig } from './cores/sing-box.js';
import { getClashNormalConfig, getClashWarpConfig } from './cores/clash.js';
import { getNormalConfigs } from './cores/normalConfigs.js';
globalThis.hostName = '';

export default {
    async fetch(request, env) {
        try {          
            const upgradeHeader = request.headers.get('Upgrade');
            const url = new URL(request.url);
            if (!upgradeHeader || upgradeHeader !== 'websocket') {
                globalThis.hostName = request.headers.get('Host');
                const searchParams = new URLSearchParams(url.search);
                const client = searchParams.get('app');
                const { kvNotFound, proxySettings: settings, warpConfigs } = await getDataset(env);
                if (kvNotFound) {
                    const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                    return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                } 

                switch (url.pathname) {
                        
                    case '/update-warp':
                        const Auth = await Authenticate(request, env); 
                        if (!Auth) return new Response('Unauthorized', { status: 401 });
                        if (request.method === 'POST') {
                            try {
                                const { error: warpPlusError } = await fetchWgConfig(env, settings);
                                if (warpPlusError) {
                                    return new Response(warpPlusError, { status: 400 });
                                } else {
                                    return new Response('Warp configs updated successfully', { status: 200 });
                                }
                            } catch (error) {
                                console.log(error);
                                return new Response(`An error occurred while updating Warp configs! - ${error}`, { status: 500 });
                            }

                        } else {
                            return new Response('Unsupported request', { status: 405 });
                        }

                    case `/sub/${userID}`:
                        if (client === 'sfa') {
                            const BestPingSFA = await getSingBoxCustomConfig(env, settings, false);
                            return new Response(JSON.stringify(BestPingSFA, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'clash') {
                            const BestPingClash = await getClashNormalConfig(env, settings);
                            return new Response(JSON.stringify(BestPingClash, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }

                        if (client === 'xray') {
                            const xrayFullConfigs = await getXrayCustomConfigs(env, settings, false);
                            return new Response(JSON.stringify(xrayFullConfigs, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }

                        const normalConfigs = await getNormalConfigs(env, settings, client);
                        return new Response(normalConfigs, { 
                            status: 200,
                            headers: {
                                'Content-Type': 'text/plain;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });                        

                    case `/fragsub/${userID}`:
                        let fragConfigs = client === 'hiddify'
                            ? await getSingBoxCustomConfig(env, settings, true)
                            : await getXrayCustomConfigs(env, settings, true);

                        return new Response(JSON.stringify(fragConfigs, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });

                    case `/warpsub/${userID}`:
                        if (client === 'clash') {
                            const clashWarpConfig = await getClashWarpConfig(settings, warpConfigs);
                            return new Response(JSON.stringify(clashWarpConfig, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'singbox' || client === 'hiddify') {
                            const singboxWarpConfig = await getSingBoxWarpConfig(settings, warpConfigs, client);
                            return new Response(JSON.stringify(singboxWarpConfig, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }

                        const warpConfig = await getXrayWarpConfigs(settings, warpConfigs, client);
                        return new Response(JSON.stringify(warpConfig, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });

                    case '/panel':
                        const isAuth = await Authenticate(request, env); 
                        if (request.method === 'POST') {     
                            if (!isAuth) return new Response('Unauthorized or expired session!', { status: 401 });
                            const formData = await request.formData();
                            const isReset = formData.get('resetSettings') === 'true';             
                            isReset 
                                ? await updateDataset(env, null, true) 
                                : await updateDataset(env, formData);

                                return new Response('Success', { status: 200 });
                            }
                            
                        const pwd = await env.bpb.get('pwd');
                        if (pwd && !isAuth) return Response.redirect(`${url.origin}/login`, 302);
                        const isPassSet = pwd?.length >= 8;
                        const homePage = renderHomePage(request, env, settings, isPassSet);
                        return new Response(homePage, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Access-Control-Allow-Origin': url.origin,
                                'Access-Control-Allow-Methods': 'GET, POST',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'X-Content-Type-Options': 'nosniff',
                                'X-Frame-Options': 'DENY',
                                'Referrer-Policy': 'strict-origin-when-cross-origin',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });
                                                      
                    case '/login':
                        if (typeof env.bpb !== 'object') {
                            const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                        }

                        const loginAuth = await Authenticate(request, env);
                        if (loginAuth) return Response.redirect(`${url.origin}/panel`, 302);
                        let secretKey = await env.bpb.get('secretKey');
                        if (!secretKey) {
                            secretKey = generateSecretKey();
                            await env.bpb.put('secretKey', secretKey);
                        }

                        if (request.method === 'POST') {
                            const password = await request.text();
                            const savedPass = await env.bpb.get('pwd');

                            if (password === savedPass) {
                                const jwtToken = await generateJWTToken(secretKey);
                                const cookieHeader = `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`;                 
                                return new Response('Success', {
                                    status: 200,
                                    headers: {
                                      'Set-Cookie': cookieHeader,
                                      'Content-Type': 'text/plain',
                                    }
                                });        
                            } else {
                                return new Response('Method Not Allowed', { status: 405 });
                            }
                        }
                        
                        const loginPage = renderLoginPage();
                        return new Response(loginPage, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Access-Control-Allow-Origin': url.origin,
                                'Access-Control-Allow-Methods': 'GET, POST',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'X-Content-Type-Options': 'nosniff',
                                'X-Frame-Options': 'DENY',
                                'Referrer-Policy': 'strict-origin-when-cross-origin'
                            }
                        });
                    
                    case '/logout':                        
                        return new Response('Success', {
                            status: 200,
                            headers: {
                                'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                                'Content-Type': 'text/plain'
                            }
                        });        

                    case '/panel/password':
                        const oldPwd = await env.bpb.get('pwd');
                        let passAuth = await Authenticate(request, env);
                        if (oldPwd && !passAuth) return new Response('Unauthorized!', { status: 401 });           
                        const newPwd = await request.text();
                        if (newPwd === oldPwd) return new Response('Please enter a new Password!', { status: 400 });
                        await env.bpb.put('pwd', newPwd);
                        return new Response('Success', {
                            status: 200,
                            headers: {
                                'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                                'Content-Type': 'text/plain',
                            }
                        });

                    default:
                        // return new Response('Not found', { status: 404 });
                        url.hostname = 'www.speedtest.net';
                        url.protocol = 'https:';
                        request = new Request(url, request);
                        return await fetch(request);
                }
            } else {
                return url.pathname.startsWith('/tr') 
                    ? await trojanOverWSHandler(request, env) 
                    : await vlessOverWSHandler(request, env);
            }
        } catch (err) {
            const errorPage = renderErrorPage('Something went wrong!', err, false);
            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
        }
    }
};
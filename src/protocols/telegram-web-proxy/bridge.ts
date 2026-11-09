// @ts-nocheck

import { MAX_WS_MESSAGE } from "./protocol";

export function bridgePage(host, bootstrap) {
  const scriptNonce = randomNonce();
  const config = JSON.stringify({ origin: `https://${host}`, bootstrap, batchLimit: MAX_WS_MESSAGE, maxPendingItems: 1024, connectTimeout: 15000 });
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Web Proxy</title></head>
<body><main><h1>Connection bridge</h1><p>This page is opened by a compatible Telegram client.</p></main>
<script nonce="${scriptNonce}">
(()=>{'use strict';
const cfg=${config};
let port=null, sessionToken='', socket=null, creating=false, closed=false;
const pending=[]; let pendingBytes=0;
const bootstrapAbort=new AbortController(); let connectTimer=null;
const fragment=new URLSearchParams(location.hash.slice(1));
const nonce=fragment.get('android')||'';
history.replaceState(null,'','/');
function status(state){try{port&&port.postMessage({t:'status',state})}catch{}}
function splitFrames(buffer){
 const input=new Uint8Array(buffer); let off=0,count=0,out=[];
 while(off<input.length){
  if(++count>4096||input.length-off<8)throw Error('bad frame');
  const view=new DataView(input.buffer,input.byteOffset+off,8); const len=view.getUint32(4);
  if(len>1048576||off+8+len>input.length)throw Error('bad frame');
  out.push(buffer.slice(off,off+8+len)); off+=8+len;
 }
 if(!out.length)throw Error('empty'); return out;
}
function sendToApp(buffer){for(const frame of splitFrames(buffer))port.postMessage(frame,[frame]);}
function fail(){if(closed)return;status('failed');close(false)}
async function createSession(hello){
 try{
  const response=await fetch(cfg.origin+'/api/v1/session',{method:'POST',headers:{Authorization:'Bearer '+cfg.bootstrap,'Content-Type':'application/octet-stream','X-Carrier-Mode':'websocket'},body:hello,mode:'same-origin',redirect:'error',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:bootstrapAbort.signal});
  if(!response.ok||response.headers.get('X-Carrier-Mode')!=='websocket')throw Error('session');
  sessionToken=response.headers.get('X-Session-Token')||'';
  if(!/^[A-Za-z0-9_-]{43}$/.test(sessionToken))throw Error('token');
  const welcome=await response.arrayBuffer();
  if(closed)return;
  if(welcome.byteLength!==8||new Uint8Array(welcome)[0]!==0x11||new Uint8Array(welcome).slice(1).some(v=>v!==0))throw Error('welcome');
  sendToApp(welcome);
  if(!closed)openSocket();
 }catch(e){fail()}
}
function openSocket(){
 const target=cfg.origin.replace(/^https:/,'wss:')+'/api/v1/ws';
 socket=new WebSocket(target,'tproxy-v1.'+sessionToken); socket.binaryType='arraybuffer';
 socket.onopen=()=>{
  if(closed)return; clearTimeout(connectTimer);connectTimer=null;status('connected');
  try{for(const data of pending){if(socket.bufferedAmount+data.byteLength>cfg.batchLimit)return fail();socket.send(data)}}catch{return fail()}
  pending.length=0;pendingBytes=0;
 };
 socket.onmessage=e=>{if(closed)return;if(!(e.data instanceof ArrayBuffer)||!e.data.byteLength||e.data.byteLength>cfg.batchLimit)return fail();try{sendToApp(e.data)}catch{return fail()}};
 socket.onerror=()=>{}; socket.onclose=()=>{if(!closed)fail()};
}
function fromApp(data){
 if(closed)return;
 if(data instanceof ArrayBuffer){
  if(!data.byteLength||data.byteLength>cfg.batchLimit)return fail();
  try{splitFrames(data)}catch{return fail()}
  if(!creating){creating=true;connectTimer=setTimeout(fail,cfg.connectTimeout);createSession(data);return}
  if(!sessionToken||!socket||socket.readyState!==WebSocket.OPEN){if(pending.length>=cfg.maxPendingItems||pendingBytes+data.byteLength>cfg.batchLimit)return fail();pending.push(data);pendingBytes+=data.byteLength;return}
  if(socket.bufferedAmount+data.byteLength>cfg.batchLimit)return fail();
  try{socket.send(data)}catch{fail()}
 }else if(data&&data.t==='close')close(true);
}
function activate(next){port=next;port.onmessage=e=>fromApp(e.data);port.start&&port.start();status('connecting')}
const native=globalThis.TelegramWebProxy;
if(/^[A-Za-z0-9_-]{43}$/.test(nonce)&&native&&typeof native.postMessage==='function'){
 const adapter={onmessage:null,start(){},close(){native.onmessage=null},postMessage(value){
  if(value instanceof ArrayBuffer){for(const frame of splitFrames(value))native.postMessage(frame)}
  else native.postMessage(JSON.stringify(value));
 }};
 native.onmessage=e=>{let d=e.data;if(typeof d==='string'){try{d=JSON.parse(d)}catch{return}}adapter.onmessage&&adapter.onmessage({data:d})};
 activate(adapter);native.postMessage(JSON.stringify({t:'tproxy-android-init',v:1,nonce}));
}
addEventListener('message',e=>{
 if(closed||port||e.source!==parent||!e.data||e.data.t!=='tproxy-init'||e.data.v!==1||e.ports.length!==1)return;
 try{const u=new URL(e.origin);if(u.protocol!=='http:'||u.hostname!=='127.0.0.1'||!u.port)return}catch{return}
 activate(e.ports[0]);
});
function close(notify){if(closed)return;closed=true;clearTimeout(connectTimer);connectTimer=null;bootstrapAbort.abort();pending.length=0;pendingBytes=0;try{socket&&socket.close()}catch{}if(notify&&sessionToken)fetch(cfg.origin+'/api/v1/session',{method:'DELETE',headers:{Authorization:'Bearer '+sessionToken},keepalive:true,mode:'same-origin',redirect:'error',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'}).catch(()=>{});try{port&&port.close()}catch{}}
addEventListener('pagehide',()=>close(true),{once:true});
})();
</script></body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${scriptNonce}'; connect-src https://${host} wss://${host}; style-src 'none'; img-src 'none'; object-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors http://127.0.0.1:*; sandbox allow-same-origin allow-scripts`,
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  });
}

function randomNonce() { const bytes = crypto.getRandomValues(new Uint8Array(18)); return btoa(String.fromCharCode(...bytes)); }

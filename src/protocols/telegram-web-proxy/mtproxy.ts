
const TAGS = new Set([0xefefefef, 0xeeeeeeee, 0xdddddddd]);
export const TELEGRAM_DCS = Object.freeze({1:"149.154.175.50",2:"149.154.167.51",3:"149.154.175.100",4:"149.154.167.91",5:"149.154.171.5"});

export class AesCtrStream {
  keyPromise: Promise<CryptoKey>;
  counter: Uint8Array;
  spare: Uint8Array;
  constructor(keyBytes: Uint8Array, ivBytes: Uint8Array) {
    if (keyBytes.length !== 32 || ivBytes.length !== 16) throw new Error("bad AES material");
    this.keyPromise = crypto.subtle.importKey("raw", Uint8Array.from(keyBytes), "AES-CTR", false, ["encrypt"]);
    this.counter = new Uint8Array(ivBytes);
    this.spare = new Uint8Array();
  }
  async crypt(input: Uint8Array): Promise<Uint8Array> {
    const src = input instanceof Uint8Array ? input : new Uint8Array(input);
    const out = new Uint8Array(src.length); let pos = 0;
    if (this.spare.length) {
      const n = Math.min(this.spare.length, src.length);
      for (let i=0;i<n;i++) out[i] = src[i] ^ this.spare[i];
      this.spare = this.spare.subarray(n); pos = n;
    }
    if (pos < src.length) {
      const need = src.length - pos, blocks = Math.ceil(need / 16);
      const zeros = new Uint8Array(blocks * 16);
      const key = await this.keyPromise;
      const ks = new Uint8Array(await crypto.subtle.encrypt({name:"AES-CTR",counter:this.counter as BufferSource,length:128}, key, zeros));
      addBlocks(this.counter, blocks);
      for (let i=0;i<need;i++) out[pos+i] = src[pos+i] ^ ks[i];
      if (need < ks.length) this.spare = ks.subarray(need);
    }
    return out;
  }
}

function addBlocks(counter: Uint8Array, blocks: number) {
  let carry = blocks;
  for (let i=15;i>=0 && carry;i--) {
    const sum = counter[i] + (carry & 255);
    counter[i] = sum & 255;
    carry = Math.floor(carry / 256) + (sum >>> 8);
  }
}
function reverse(bytes: Uint8Array){ return Uint8Array.from(bytes).reverse(); }
function concat(a: Uint8Array, b: Uint8Array){ const out=new Uint8Array(a.length+b.length); out.set(a); out.set(b,a.length); return out; }
async function sha256(bytes: Uint8Array){ return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes as BufferSource)); }
export function parseProxySecret(value: string) {
  const s=String(value||"").toLowerCase();
  if (/^[0-9a-f]{32}$/.test(s)) return {bridge:hex(s), inner:hex(s), mode:"plain"};
  if (/^dd[0-9a-f]{32}$/.test(s)) return {bridge:hex(s), inner:hex(s.slice(2)), mode:"dd"};
  if (/^ee/.test(s)) throw new Error("FakeTLS secrets are not supported in WEB mode");
  throw new Error("PROXY_SECRET must be 32 hex characters, optionally prefixed with dd");
}
function hex(s: string){ const x=new Uint8Array(s.length/2); for(let i=0;i<x.length;i++)x[i]=parseInt(s.slice(i*2,i*2+2),16); return x; }

export async function acceptClientHandshake(packet: Uint8Array, secret: Uint8Array) {
  if (packet.length !== 64) throw new Error("bad handshake length");
  const material = packet.subarray(8,56), rev=reverse(material);
  const decKey=await sha256(concat(material.subarray(0,32),secret));
  const dec=new AesCtrStream(decKey,material.subarray(32,48));
  const encKey=await sha256(concat(rev.subarray(0,32),secret));
  const enc=new AesCtrStream(encKey,rev.subarray(32,48));
  const plain=await dec.crypt(packet);
  const view=new DataView(plain.buffer,plain.byteOffset,plain.byteLength);
  const tag=view.getUint32(56,true), dcId=view.getInt16(60,true);
  if(!TAGS.has(tag) || !(TELEGRAM_DCS as Record<number, string>)[Math.abs(dcId)]) throw new Error("invalid MTProxy handshake");
  return {tag,dcId,clientDecrypt:dec,clientEncrypt:enc};
}

export async function createTelegramHandshake(tag: number, dcId: number) {
  let nonce;
  do { nonce=new Uint8Array(64); crypto.getRandomValues(nonce); } while (reserved(nonce));
  const v=new DataView(nonce.buffer); v.setUint32(56,tag,true); v.setInt16(60,dcId,true); nonce[62]=nonce[63]=0;
  const material=nonce.subarray(8,56), rev=reverse(material);
  const encrypt=new AesCtrStream(material.subarray(0,32),material.subarray(32,48));
  const decrypt=new AesCtrStream(rev.subarray(0,32),rev.subarray(32,48));
  const encrypted=await encrypt.crypt(nonce);
  const wire=new Uint8Array(nonce); wire.set(encrypted.subarray(56),56);
  return {wire,encrypt,decrypt};
}
function reserved(n: Uint8Array){
  const v=new DataView(n.buffer,n.byteOffset,n.byteLength), x=v.getUint32(0,true);
  return n[0]===0xef || x===0x44414548 || x===0x54534f50 || x===0x20544547 || x===0xeeeeeeee || x===0xdddddddd || v.getUint32(4,true)===0;
}

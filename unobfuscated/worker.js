var pn=Object.create;var Lr=Object.defineProperty;var hn=Object.getOwnPropertyDescriptor;var mn=Object.getOwnPropertyNames;var xn=Object.getPrototypeOf,bn=Object.prototype.hasOwnProperty;var l=(t,r)=>Lr(t,"name",{value:r,configurable:!0}),so=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,n)=>(typeof require<"u"?require:r)[n]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var ar=(t,r)=>()=>(r||t((r={exports:{}}).exports,r),r.exports);var gn=(t,r,n,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let f of mn(r))!bn.call(t,f)&&f!==n&&Lr(t,f,{get:()=>r[f],enumerable:!(a=hn(r,f))||a.enumerable});return t};var Or=(t,r,n)=>(n=t!=null?pn(xn(t)):{},gn(r||!t||!t.__esModule?Lr(n,"default",{value:t,enumerable:!0}):n,t));var Gr=ar(()=>{});var Yr=ar((Hi,Sr)=>{(function(t){"use strict";var r=l(function(o){var i,s=new Float64Array(16);if(o)for(i=0;i<o.length;i++)s[i]=o[i];return s},"gf"),n=l(function(){throw new Error("no PRNG")},"randombytes"),a=new Uint8Array(16),f=new Uint8Array(32);f[0]=9;var u=r(),h=r([1]),g=r([56129,1]),p=r([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),w=r([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),y=r([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),E=r([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),D=r([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function I(o,i,s,e){o[i]=s>>24&255,o[i+1]=s>>16&255,o[i+2]=s>>8&255,o[i+3]=s&255,o[i+4]=e>>24&255,o[i+5]=e>>16&255,o[i+6]=e>>8&255,o[i+7]=e&255}l(I,"ts64");function L(o,i,s,e,c){var x,b=0;for(x=0;x<c;x++)b|=o[i+x]^s[e+x];return(1&b-1>>>8)-1}l(L,"vn");function V(o,i,s,e){return L(o,i,s,e,16)}l(V,"crypto_verify_16");function U(o,i,s,e){return L(o,i,s,e,32)}l(U,"crypto_verify_32");function j(o,i,s,e){for(var c=e[0]&255|(e[1]&255)<<8|(e[2]&255)<<16|(e[3]&255)<<24,x=s[0]&255|(s[1]&255)<<8|(s[2]&255)<<16|(s[3]&255)<<24,b=s[4]&255|(s[5]&255)<<8|(s[6]&255)<<16|(s[7]&255)<<24,T=s[8]&255|(s[9]&255)<<8|(s[10]&255)<<16|(s[11]&255)<<24,W=s[12]&255|(s[13]&255)<<8|(s[14]&255)<<16|(s[15]&255)<<24,re=e[4]&255|(e[5]&255)<<8|(e[6]&255)<<16|(e[7]&255)<<24,X=i[0]&255|(i[1]&255)<<8|(i[2]&255)<<16|(i[3]&255)<<24,Re=i[4]&255|(i[5]&255)<<8|(i[6]&255)<<16|(i[7]&255)<<24,Z=i[8]&255|(i[9]&255)<<8|(i[10]&255)<<16|(i[11]&255)<<24,ce=i[12]&255|(i[13]&255)<<8|(i[14]&255)<<16|(i[15]&255)<<24,le=e[8]&255|(e[9]&255)<<8|(e[10]&255)<<16|(e[11]&255)<<24,xe=s[16]&255|(s[17]&255)<<8|(s[18]&255)<<16|(s[19]&255)<<24,me=s[20]&255|(s[21]&255)<<8|(s[22]&255)<<16|(s[23]&255)<<24,fe=s[24]&255|(s[25]&255)<<8|(s[26]&255)<<16|(s[27]&255)<<24,pe=s[28]&255|(s[29]&255)<<8|(s[30]&255)<<16|(s[31]&255)<<24,de=e[12]&255|(e[13]&255)<<8|(e[14]&255)<<16|(e[15]&255)<<24,Q=c,oe=x,q=b,ee=T,te=W,Y=re,v=X,S=Re,N=Z,k=ce,_=le,M=xe,se=me,be=fe,ye=pe,ge=de,d,Pe=0;Pe<20;Pe+=2)d=Q+se|0,te^=d<<7|d>>>32-7,d=te+Q|0,N^=d<<9|d>>>32-9,d=N+te|0,se^=d<<13|d>>>32-13,d=se+N|0,Q^=d<<18|d>>>32-18,d=Y+oe|0,k^=d<<7|d>>>32-7,d=k+Y|0,be^=d<<9|d>>>32-9,d=be+k|0,oe^=d<<13|d>>>32-13,d=oe+be|0,Y^=d<<18|d>>>32-18,d=_+v|0,ye^=d<<7|d>>>32-7,d=ye+_|0,q^=d<<9|d>>>32-9,d=q+ye|0,v^=d<<13|d>>>32-13,d=v+q|0,_^=d<<18|d>>>32-18,d=ge+M|0,ee^=d<<7|d>>>32-7,d=ee+ge|0,S^=d<<9|d>>>32-9,d=S+ee|0,M^=d<<13|d>>>32-13,d=M+S|0,ge^=d<<18|d>>>32-18,d=Q+ee|0,oe^=d<<7|d>>>32-7,d=oe+Q|0,q^=d<<9|d>>>32-9,d=q+oe|0,ee^=d<<13|d>>>32-13,d=ee+q|0,Q^=d<<18|d>>>32-18,d=Y+te|0,v^=d<<7|d>>>32-7,d=v+Y|0,S^=d<<9|d>>>32-9,d=S+v|0,te^=d<<13|d>>>32-13,d=te+S|0,Y^=d<<18|d>>>32-18,d=_+k|0,M^=d<<7|d>>>32-7,d=M+_|0,N^=d<<9|d>>>32-9,d=N+M|0,k^=d<<13|d>>>32-13,d=k+N|0,_^=d<<18|d>>>32-18,d=ge+ye|0,se^=d<<7|d>>>32-7,d=se+ge|0,be^=d<<9|d>>>32-9,d=be+se|0,ye^=d<<13|d>>>32-13,d=ye+be|0,ge^=d<<18|d>>>32-18;Q=Q+c|0,oe=oe+x|0,q=q+b|0,ee=ee+T|0,te=te+W|0,Y=Y+re|0,v=v+X|0,S=S+Re|0,N=N+Z|0,k=k+ce|0,_=_+le|0,M=M+xe|0,se=se+me|0,be=be+fe|0,ye=ye+pe|0,ge=ge+de|0,o[0]=Q>>>0&255,o[1]=Q>>>8&255,o[2]=Q>>>16&255,o[3]=Q>>>24&255,o[4]=oe>>>0&255,o[5]=oe>>>8&255,o[6]=oe>>>16&255,o[7]=oe>>>24&255,o[8]=q>>>0&255,o[9]=q>>>8&255,o[10]=q>>>16&255,o[11]=q>>>24&255,o[12]=ee>>>0&255,o[13]=ee>>>8&255,o[14]=ee>>>16&255,o[15]=ee>>>24&255,o[16]=te>>>0&255,o[17]=te>>>8&255,o[18]=te>>>16&255,o[19]=te>>>24&255,o[20]=Y>>>0&255,o[21]=Y>>>8&255,o[22]=Y>>>16&255,o[23]=Y>>>24&255,o[24]=v>>>0&255,o[25]=v>>>8&255,o[26]=v>>>16&255,o[27]=v>>>24&255,o[28]=S>>>0&255,o[29]=S>>>8&255,o[30]=S>>>16&255,o[31]=S>>>24&255,o[32]=N>>>0&255,o[33]=N>>>8&255,o[34]=N>>>16&255,o[35]=N>>>24&255,o[36]=k>>>0&255,o[37]=k>>>8&255,o[38]=k>>>16&255,o[39]=k>>>24&255,o[40]=_>>>0&255,o[41]=_>>>8&255,o[42]=_>>>16&255,o[43]=_>>>24&255,o[44]=M>>>0&255,o[45]=M>>>8&255,o[46]=M>>>16&255,o[47]=M>>>24&255,o[48]=se>>>0&255,o[49]=se>>>8&255,o[50]=se>>>16&255,o[51]=se>>>24&255,o[52]=be>>>0&255,o[53]=be>>>8&255,o[54]=be>>>16&255,o[55]=be>>>24&255,o[56]=ye>>>0&255,o[57]=ye>>>8&255,o[58]=ye>>>16&255,o[59]=ye>>>24&255,o[60]=ge>>>0&255,o[61]=ge>>>8&255,o[62]=ge>>>16&255,o[63]=ge>>>24&255}l(j,"core_salsa20");function O(o,i,s,e){for(var c=e[0]&255|(e[1]&255)<<8|(e[2]&255)<<16|(e[3]&255)<<24,x=s[0]&255|(s[1]&255)<<8|(s[2]&255)<<16|(s[3]&255)<<24,b=s[4]&255|(s[5]&255)<<8|(s[6]&255)<<16|(s[7]&255)<<24,T=s[8]&255|(s[9]&255)<<8|(s[10]&255)<<16|(s[11]&255)<<24,W=s[12]&255|(s[13]&255)<<8|(s[14]&255)<<16|(s[15]&255)<<24,re=e[4]&255|(e[5]&255)<<8|(e[6]&255)<<16|(e[7]&255)<<24,X=i[0]&255|(i[1]&255)<<8|(i[2]&255)<<16|(i[3]&255)<<24,Re=i[4]&255|(i[5]&255)<<8|(i[6]&255)<<16|(i[7]&255)<<24,Z=i[8]&255|(i[9]&255)<<8|(i[10]&255)<<16|(i[11]&255)<<24,ce=i[12]&255|(i[13]&255)<<8|(i[14]&255)<<16|(i[15]&255)<<24,le=e[8]&255|(e[9]&255)<<8|(e[10]&255)<<16|(e[11]&255)<<24,xe=s[16]&255|(s[17]&255)<<8|(s[18]&255)<<16|(s[19]&255)<<24,me=s[20]&255|(s[21]&255)<<8|(s[22]&255)<<16|(s[23]&255)<<24,fe=s[24]&255|(s[25]&255)<<8|(s[26]&255)<<16|(s[27]&255)<<24,pe=s[28]&255|(s[29]&255)<<8|(s[30]&255)<<16|(s[31]&255)<<24,de=e[12]&255|(e[13]&255)<<8|(e[14]&255)<<16|(e[15]&255)<<24,Q=c,oe=x,q=b,ee=T,te=W,Y=re,v=X,S=Re,N=Z,k=ce,_=le,M=xe,se=me,be=fe,ye=pe,ge=de,d,Pe=0;Pe<20;Pe+=2)d=Q+se|0,te^=d<<7|d>>>32-7,d=te+Q|0,N^=d<<9|d>>>32-9,d=N+te|0,se^=d<<13|d>>>32-13,d=se+N|0,Q^=d<<18|d>>>32-18,d=Y+oe|0,k^=d<<7|d>>>32-7,d=k+Y|0,be^=d<<9|d>>>32-9,d=be+k|0,oe^=d<<13|d>>>32-13,d=oe+be|0,Y^=d<<18|d>>>32-18,d=_+v|0,ye^=d<<7|d>>>32-7,d=ye+_|0,q^=d<<9|d>>>32-9,d=q+ye|0,v^=d<<13|d>>>32-13,d=v+q|0,_^=d<<18|d>>>32-18,d=ge+M|0,ee^=d<<7|d>>>32-7,d=ee+ge|0,S^=d<<9|d>>>32-9,d=S+ee|0,M^=d<<13|d>>>32-13,d=M+S|0,ge^=d<<18|d>>>32-18,d=Q+ee|0,oe^=d<<7|d>>>32-7,d=oe+Q|0,q^=d<<9|d>>>32-9,d=q+oe|0,ee^=d<<13|d>>>32-13,d=ee+q|0,Q^=d<<18|d>>>32-18,d=Y+te|0,v^=d<<7|d>>>32-7,d=v+Y|0,S^=d<<9|d>>>32-9,d=S+v|0,te^=d<<13|d>>>32-13,d=te+S|0,Y^=d<<18|d>>>32-18,d=_+k|0,M^=d<<7|d>>>32-7,d=M+_|0,N^=d<<9|d>>>32-9,d=N+M|0,k^=d<<13|d>>>32-13,d=k+N|0,_^=d<<18|d>>>32-18,d=ge+ye|0,se^=d<<7|d>>>32-7,d=se+ge|0,be^=d<<9|d>>>32-9,d=be+se|0,ye^=d<<13|d>>>32-13,d=ye+be|0,ge^=d<<18|d>>>32-18;o[0]=Q>>>0&255,o[1]=Q>>>8&255,o[2]=Q>>>16&255,o[3]=Q>>>24&255,o[4]=Y>>>0&255,o[5]=Y>>>8&255,o[6]=Y>>>16&255,o[7]=Y>>>24&255,o[8]=_>>>0&255,o[9]=_>>>8&255,o[10]=_>>>16&255,o[11]=_>>>24&255,o[12]=ge>>>0&255,o[13]=ge>>>8&255,o[14]=ge>>>16&255,o[15]=ge>>>24&255,o[16]=v>>>0&255,o[17]=v>>>8&255,o[18]=v>>>16&255,o[19]=v>>>24&255,o[20]=S>>>0&255,o[21]=S>>>8&255,o[22]=S>>>16&255,o[23]=S>>>24&255,o[24]=N>>>0&255,o[25]=N>>>8&255,o[26]=N>>>16&255,o[27]=N>>>24&255,o[28]=k>>>0&255,o[29]=k>>>8&255,o[30]=k>>>16&255,o[31]=k>>>24&255}l(O,"core_hsalsa20");function F(o,i,s,e){j(o,i,s,e)}l(F,"crypto_core_salsa20");function z(o,i,s,e){O(o,i,s,e)}l(z,"crypto_core_hsalsa20");var J=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function m(o,i,s,e,c,x,b){var T=new Uint8Array(16),W=new Uint8Array(64),re,X;for(X=0;X<16;X++)T[X]=0;for(X=0;X<8;X++)T[X]=x[X];for(;c>=64;){for(F(W,T,b,J),X=0;X<64;X++)o[i+X]=s[e+X]^W[X];for(re=1,X=8;X<16;X++)re=re+(T[X]&255)|0,T[X]=re&255,re>>>=8;c-=64,i+=64,e+=64}if(c>0)for(F(W,T,b,J),X=0;X<c;X++)o[i+X]=s[e+X]^W[X];return 0}l(m,"crypto_stream_salsa20_xor");function R(o,i,s,e,c){var x=new Uint8Array(16),b=new Uint8Array(64),T,W;for(W=0;W<16;W++)x[W]=0;for(W=0;W<8;W++)x[W]=e[W];for(;s>=64;){for(F(b,x,c,J),W=0;W<64;W++)o[i+W]=b[W];for(T=1,W=8;W<16;W++)T=T+(x[W]&255)|0,x[W]=T&255,T>>>=8;s-=64,i+=64}if(s>0)for(F(b,x,c,J),W=0;W<s;W++)o[i+W]=b[W];return 0}l(R,"crypto_stream_salsa20");function $(o,i,s,e,c){var x=new Uint8Array(32);z(x,e,c,J);for(var b=new Uint8Array(8),T=0;T<8;T++)b[T]=e[T+16];return R(o,i,s,b,x)}l($,"crypto_stream");function C(o,i,s,e,c,x,b){var T=new Uint8Array(32);z(T,x,b,J);for(var W=new Uint8Array(8),re=0;re<8;re++)W[re]=x[re+16];return m(o,i,s,e,c,W,T)}l(C,"crypto_stream_xor");var B=l(function(o){this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.leftover=0,this.fin=0;var i,s,e,c,x,b,T,W;i=o[0]&255|(o[1]&255)<<8,this.r[0]=i&8191,s=o[2]&255|(o[3]&255)<<8,this.r[1]=(i>>>13|s<<3)&8191,e=o[4]&255|(o[5]&255)<<8,this.r[2]=(s>>>10|e<<6)&7939,c=o[6]&255|(o[7]&255)<<8,this.r[3]=(e>>>7|c<<9)&8191,x=o[8]&255|(o[9]&255)<<8,this.r[4]=(c>>>4|x<<12)&255,this.r[5]=x>>>1&8190,b=o[10]&255|(o[11]&255)<<8,this.r[6]=(x>>>14|b<<2)&8191,T=o[12]&255|(o[13]&255)<<8,this.r[7]=(b>>>11|T<<5)&8065,W=o[14]&255|(o[15]&255)<<8,this.r[8]=(T>>>8|W<<8)&8191,this.r[9]=W>>>5&127,this.pad[0]=o[16]&255|(o[17]&255)<<8,this.pad[1]=o[18]&255|(o[19]&255)<<8,this.pad[2]=o[20]&255|(o[21]&255)<<8,this.pad[3]=o[22]&255|(o[23]&255)<<8,this.pad[4]=o[24]&255|(o[25]&255)<<8,this.pad[5]=o[26]&255|(o[27]&255)<<8,this.pad[6]=o[28]&255|(o[29]&255)<<8,this.pad[7]=o[30]&255|(o[31]&255)<<8},"poly1305");B.prototype.blocks=function(o,i,s){for(var e=this.fin?0:2048,c,x,b,T,W,re,X,Re,Z,ce,le,xe,me,fe,pe,de,Q,oe,q,ee=this.h[0],te=this.h[1],Y=this.h[2],v=this.h[3],S=this.h[4],N=this.h[5],k=this.h[6],_=this.h[7],M=this.h[8],se=this.h[9],be=this.r[0],ye=this.r[1],ge=this.r[2],d=this.r[3],Pe=this.r[4],ke=this.r[5],Te=this.r[6],ve=this.r[7],Ee=this.r[8],Ae=this.r[9];s>=16;)c=o[i+0]&255|(o[i+1]&255)<<8,ee+=c&8191,x=o[i+2]&255|(o[i+3]&255)<<8,te+=(c>>>13|x<<3)&8191,b=o[i+4]&255|(o[i+5]&255)<<8,Y+=(x>>>10|b<<6)&8191,T=o[i+6]&255|(o[i+7]&255)<<8,v+=(b>>>7|T<<9)&8191,W=o[i+8]&255|(o[i+9]&255)<<8,S+=(T>>>4|W<<12)&8191,N+=W>>>1&8191,re=o[i+10]&255|(o[i+11]&255)<<8,k+=(W>>>14|re<<2)&8191,X=o[i+12]&255|(o[i+13]&255)<<8,_+=(re>>>11|X<<5)&8191,Re=o[i+14]&255|(o[i+15]&255)<<8,M+=(X>>>8|Re<<8)&8191,se+=Re>>>5|e,Z=0,ce=Z,ce+=ee*be,ce+=te*(5*Ae),ce+=Y*(5*Ee),ce+=v*(5*ve),ce+=S*(5*Te),Z=ce>>>13,ce&=8191,ce+=N*(5*ke),ce+=k*(5*Pe),ce+=_*(5*d),ce+=M*(5*ge),ce+=se*(5*ye),Z+=ce>>>13,ce&=8191,le=Z,le+=ee*ye,le+=te*be,le+=Y*(5*Ae),le+=v*(5*Ee),le+=S*(5*ve),Z=le>>>13,le&=8191,le+=N*(5*Te),le+=k*(5*ke),le+=_*(5*Pe),le+=M*(5*d),le+=se*(5*ge),Z+=le>>>13,le&=8191,xe=Z,xe+=ee*ge,xe+=te*ye,xe+=Y*be,xe+=v*(5*Ae),xe+=S*(5*Ee),Z=xe>>>13,xe&=8191,xe+=N*(5*ve),xe+=k*(5*Te),xe+=_*(5*ke),xe+=M*(5*Pe),xe+=se*(5*d),Z+=xe>>>13,xe&=8191,me=Z,me+=ee*d,me+=te*ge,me+=Y*ye,me+=v*be,me+=S*(5*Ae),Z=me>>>13,me&=8191,me+=N*(5*Ee),me+=k*(5*ve),me+=_*(5*Te),me+=M*(5*ke),me+=se*(5*Pe),Z+=me>>>13,me&=8191,fe=Z,fe+=ee*Pe,fe+=te*d,fe+=Y*ge,fe+=v*ye,fe+=S*be,Z=fe>>>13,fe&=8191,fe+=N*(5*Ae),fe+=k*(5*Ee),fe+=_*(5*ve),fe+=M*(5*Te),fe+=se*(5*ke),Z+=fe>>>13,fe&=8191,pe=Z,pe+=ee*ke,pe+=te*Pe,pe+=Y*d,pe+=v*ge,pe+=S*ye,Z=pe>>>13,pe&=8191,pe+=N*be,pe+=k*(5*Ae),pe+=_*(5*Ee),pe+=M*(5*ve),pe+=se*(5*Te),Z+=pe>>>13,pe&=8191,de=Z,de+=ee*Te,de+=te*ke,de+=Y*Pe,de+=v*d,de+=S*ge,Z=de>>>13,de&=8191,de+=N*ye,de+=k*be,de+=_*(5*Ae),de+=M*(5*Ee),de+=se*(5*ve),Z+=de>>>13,de&=8191,Q=Z,Q+=ee*ve,Q+=te*Te,Q+=Y*ke,Q+=v*Pe,Q+=S*d,Z=Q>>>13,Q&=8191,Q+=N*ge,Q+=k*ye,Q+=_*be,Q+=M*(5*Ae),Q+=se*(5*Ee),Z+=Q>>>13,Q&=8191,oe=Z,oe+=ee*Ee,oe+=te*ve,oe+=Y*Te,oe+=v*ke,oe+=S*Pe,Z=oe>>>13,oe&=8191,oe+=N*d,oe+=k*ge,oe+=_*ye,oe+=M*be,oe+=se*(5*Ae),Z+=oe>>>13,oe&=8191,q=Z,q+=ee*Ae,q+=te*Ee,q+=Y*ve,q+=v*Te,q+=S*ke,Z=q>>>13,q&=8191,q+=N*Pe,q+=k*d,q+=_*ge,q+=M*ye,q+=se*be,Z+=q>>>13,q&=8191,Z=(Z<<2)+Z|0,Z=Z+ce|0,ce=Z&8191,Z=Z>>>13,le+=Z,ee=ce,te=le,Y=xe,v=me,S=fe,N=pe,k=de,_=Q,M=oe,se=q,i+=16,s-=16;this.h[0]=ee,this.h[1]=te,this.h[2]=Y,this.h[3]=v,this.h[4]=S,this.h[5]=N,this.h[6]=k,this.h[7]=_,this.h[8]=M,this.h[9]=se},B.prototype.finish=function(o,i){var s=new Uint16Array(10),e,c,x,b;if(this.leftover){for(b=this.leftover,this.buffer[b++]=1;b<16;b++)this.buffer[b]=0;this.fin=1,this.blocks(this.buffer,0,16)}for(e=this.h[1]>>>13,this.h[1]&=8191,b=2;b<10;b++)this.h[b]+=e,e=this.h[b]>>>13,this.h[b]&=8191;for(this.h[0]+=e*5,e=this.h[0]>>>13,this.h[0]&=8191,this.h[1]+=e,e=this.h[1]>>>13,this.h[1]&=8191,this.h[2]+=e,s[0]=this.h[0]+5,e=s[0]>>>13,s[0]&=8191,b=1;b<10;b++)s[b]=this.h[b]+e,e=s[b]>>>13,s[b]&=8191;for(s[9]-=8192,c=(e^1)-1,b=0;b<10;b++)s[b]&=c;for(c=~c,b=0;b<10;b++)this.h[b]=this.h[b]&c|s[b];for(this.h[0]=(this.h[0]|this.h[1]<<13)&65535,this.h[1]=(this.h[1]>>>3|this.h[2]<<10)&65535,this.h[2]=(this.h[2]>>>6|this.h[3]<<7)&65535,this.h[3]=(this.h[3]>>>9|this.h[4]<<4)&65535,this.h[4]=(this.h[4]>>>12|this.h[5]<<1|this.h[6]<<14)&65535,this.h[5]=(this.h[6]>>>2|this.h[7]<<11)&65535,this.h[6]=(this.h[7]>>>5|this.h[8]<<8)&65535,this.h[7]=(this.h[8]>>>8|this.h[9]<<5)&65535,x=this.h[0]+this.pad[0],this.h[0]=x&65535,b=1;b<8;b++)x=(this.h[b]+this.pad[b]|0)+(x>>>16)|0,this.h[b]=x&65535;o[i+0]=this.h[0]>>>0&255,o[i+1]=this.h[0]>>>8&255,o[i+2]=this.h[1]>>>0&255,o[i+3]=this.h[1]>>>8&255,o[i+4]=this.h[2]>>>0&255,o[i+5]=this.h[2]>>>8&255,o[i+6]=this.h[3]>>>0&255,o[i+7]=this.h[3]>>>8&255,o[i+8]=this.h[4]>>>0&255,o[i+9]=this.h[4]>>>8&255,o[i+10]=this.h[5]>>>0&255,o[i+11]=this.h[5]>>>8&255,o[i+12]=this.h[6]>>>0&255,o[i+13]=this.h[6]>>>8&255,o[i+14]=this.h[7]>>>0&255,o[i+15]=this.h[7]>>>8&255},B.prototype.update=function(o,i,s){var e,c;if(this.leftover){for(c=16-this.leftover,c>s&&(c=s),e=0;e<c;e++)this.buffer[this.leftover+e]=o[i+e];if(s-=c,i+=c,this.leftover+=c,this.leftover<16)return;this.blocks(this.buffer,0,16),this.leftover=0}if(s>=16&&(c=s-s%16,this.blocks(o,i,c),i+=c,s-=c),s){for(e=0;e<s;e++)this.buffer[this.leftover+e]=o[i+e];this.leftover+=s}};function A(o,i,s,e,c,x){var b=new B(x);return b.update(s,e,c),b.finish(o,i),0}l(A,"crypto_onetimeauth");function K(o,i,s,e,c,x){var b=new Uint8Array(16);return A(b,0,s,e,c,x),V(o,i,b,0)}l(K,"crypto_onetimeauth_verify");function P(o,i,s,e,c){var x;if(s<32)return-1;for(C(o,0,i,0,s,e,c),A(o,16,o,32,s-32,o),x=0;x<16;x++)o[x]=0;return 0}l(P,"crypto_secretbox");function G(o,i,s,e,c){var x,b=new Uint8Array(32);if(s<32||($(b,0,32,e,c),K(i,16,i,32,s-32,b)!==0))return-1;for(C(o,0,i,0,s,e,c),x=0;x<32;x++)o[x]=0;return 0}l(G,"crypto_secretbox_open");function H(o,i){var s;for(s=0;s<16;s++)o[s]=i[s]|0}l(H,"set25519");function ie(o){var i,s,e=1;for(i=0;i<16;i++)s=o[i]+e+65535,e=Math.floor(s/65536),o[i]=s-e*65536;o[0]+=e-1+37*(e-1)}l(ie,"car25519");function ne(o,i,s){for(var e,c=~(s-1),x=0;x<16;x++)e=c&(o[x]^i[x]),o[x]^=e,i[x]^=e}l(ne,"sel25519");function Se(o,i){var s,e,c,x=r(),b=r();for(s=0;s<16;s++)b[s]=i[s];for(ie(b),ie(b),ie(b),e=0;e<2;e++){for(x[0]=b[0]-65517,s=1;s<15;s++)x[s]=b[s]-65535-(x[s-1]>>16&1),x[s-1]&=65535;x[15]=b[15]-32767-(x[14]>>16&1),c=x[15]>>16&1,x[14]&=65535,ne(b,x,1-c)}for(s=0;s<16;s++)o[2*s]=b[s]&255,o[2*s+1]=b[s]>>8}l(Se,"pack25519");function ae(o,i){var s=new Uint8Array(32),e=new Uint8Array(32);return Se(s,o),Se(e,i),U(s,0,e,0)}l(ae,"neq25519");function he(o){var i=new Uint8Array(32);return Se(i,o),i[0]&1}l(he,"par25519");function we(o,i){var s;for(s=0;s<16;s++)o[s]=i[2*s]+(i[2*s+1]<<8);o[15]&=32767}l(we,"unpack25519");function Ce(o,i,s){for(var e=0;e<16;e++)o[e]=i[e]+s[e]}l(Ce,"A");function $e(o,i,s){for(var e=0;e<16;e++)o[e]=i[e]-s[e]}l($e,"Z");function ue(o,i,s){var e,c,x=0,b=0,T=0,W=0,re=0,X=0,Re=0,Z=0,ce=0,le=0,xe=0,me=0,fe=0,pe=0,de=0,Q=0,oe=0,q=0,ee=0,te=0,Y=0,v=0,S=0,N=0,k=0,_=0,M=0,se=0,be=0,ye=0,ge=0,d=s[0],Pe=s[1],ke=s[2],Te=s[3],ve=s[4],Ee=s[5],Ae=s[6],Ue=s[7],_e=s[8],Be=s[9],Ne=s[10],Fe=s[11],Le=s[12],Ke=s[13],Ve=s[14],je=s[15];e=i[0],x+=e*d,b+=e*Pe,T+=e*ke,W+=e*Te,re+=e*ve,X+=e*Ee,Re+=e*Ae,Z+=e*Ue,ce+=e*_e,le+=e*Be,xe+=e*Ne,me+=e*Fe,fe+=e*Le,pe+=e*Ke,de+=e*Ve,Q+=e*je,e=i[1],b+=e*d,T+=e*Pe,W+=e*ke,re+=e*Te,X+=e*ve,Re+=e*Ee,Z+=e*Ae,ce+=e*Ue,le+=e*_e,xe+=e*Be,me+=e*Ne,fe+=e*Fe,pe+=e*Le,de+=e*Ke,Q+=e*Ve,oe+=e*je,e=i[2],T+=e*d,W+=e*Pe,re+=e*ke,X+=e*Te,Re+=e*ve,Z+=e*Ee,ce+=e*Ae,le+=e*Ue,xe+=e*_e,me+=e*Be,fe+=e*Ne,pe+=e*Fe,de+=e*Le,Q+=e*Ke,oe+=e*Ve,q+=e*je,e=i[3],W+=e*d,re+=e*Pe,X+=e*ke,Re+=e*Te,Z+=e*ve,ce+=e*Ee,le+=e*Ae,xe+=e*Ue,me+=e*_e,fe+=e*Be,pe+=e*Ne,de+=e*Fe,Q+=e*Le,oe+=e*Ke,q+=e*Ve,ee+=e*je,e=i[4],re+=e*d,X+=e*Pe,Re+=e*ke,Z+=e*Te,ce+=e*ve,le+=e*Ee,xe+=e*Ae,me+=e*Ue,fe+=e*_e,pe+=e*Be,de+=e*Ne,Q+=e*Fe,oe+=e*Le,q+=e*Ke,ee+=e*Ve,te+=e*je,e=i[5],X+=e*d,Re+=e*Pe,Z+=e*ke,ce+=e*Te,le+=e*ve,xe+=e*Ee,me+=e*Ae,fe+=e*Ue,pe+=e*_e,de+=e*Be,Q+=e*Ne,oe+=e*Fe,q+=e*Le,ee+=e*Ke,te+=e*Ve,Y+=e*je,e=i[6],Re+=e*d,Z+=e*Pe,ce+=e*ke,le+=e*Te,xe+=e*ve,me+=e*Ee,fe+=e*Ae,pe+=e*Ue,de+=e*_e,Q+=e*Be,oe+=e*Ne,q+=e*Fe,ee+=e*Le,te+=e*Ke,Y+=e*Ve,v+=e*je,e=i[7],Z+=e*d,ce+=e*Pe,le+=e*ke,xe+=e*Te,me+=e*ve,fe+=e*Ee,pe+=e*Ae,de+=e*Ue,Q+=e*_e,oe+=e*Be,q+=e*Ne,ee+=e*Fe,te+=e*Le,Y+=e*Ke,v+=e*Ve,S+=e*je,e=i[8],ce+=e*d,le+=e*Pe,xe+=e*ke,me+=e*Te,fe+=e*ve,pe+=e*Ee,de+=e*Ae,Q+=e*Ue,oe+=e*_e,q+=e*Be,ee+=e*Ne,te+=e*Fe,Y+=e*Le,v+=e*Ke,S+=e*Ve,N+=e*je,e=i[9],le+=e*d,xe+=e*Pe,me+=e*ke,fe+=e*Te,pe+=e*ve,de+=e*Ee,Q+=e*Ae,oe+=e*Ue,q+=e*_e,ee+=e*Be,te+=e*Ne,Y+=e*Fe,v+=e*Le,S+=e*Ke,N+=e*Ve,k+=e*je,e=i[10],xe+=e*d,me+=e*Pe,fe+=e*ke,pe+=e*Te,de+=e*ve,Q+=e*Ee,oe+=e*Ae,q+=e*Ue,ee+=e*_e,te+=e*Be,Y+=e*Ne,v+=e*Fe,S+=e*Le,N+=e*Ke,k+=e*Ve,_+=e*je,e=i[11],me+=e*d,fe+=e*Pe,pe+=e*ke,de+=e*Te,Q+=e*ve,oe+=e*Ee,q+=e*Ae,ee+=e*Ue,te+=e*_e,Y+=e*Be,v+=e*Ne,S+=e*Fe,N+=e*Le,k+=e*Ke,_+=e*Ve,M+=e*je,e=i[12],fe+=e*d,pe+=e*Pe,de+=e*ke,Q+=e*Te,oe+=e*ve,q+=e*Ee,ee+=e*Ae,te+=e*Ue,Y+=e*_e,v+=e*Be,S+=e*Ne,N+=e*Fe,k+=e*Le,_+=e*Ke,M+=e*Ve,se+=e*je,e=i[13],pe+=e*d,de+=e*Pe,Q+=e*ke,oe+=e*Te,q+=e*ve,ee+=e*Ee,te+=e*Ae,Y+=e*Ue,v+=e*_e,S+=e*Be,N+=e*Ne,k+=e*Fe,_+=e*Le,M+=e*Ke,se+=e*Ve,be+=e*je,e=i[14],de+=e*d,Q+=e*Pe,oe+=e*ke,q+=e*Te,ee+=e*ve,te+=e*Ee,Y+=e*Ae,v+=e*Ue,S+=e*_e,N+=e*Be,k+=e*Ne,_+=e*Fe,M+=e*Le,se+=e*Ke,be+=e*Ve,ye+=e*je,e=i[15],Q+=e*d,oe+=e*Pe,q+=e*ke,ee+=e*Te,te+=e*ve,Y+=e*Ee,v+=e*Ae,S+=e*Ue,N+=e*_e,k+=e*Be,_+=e*Ne,M+=e*Fe,se+=e*Le,be+=e*Ke,ye+=e*Ve,ge+=e*je,x+=38*oe,b+=38*q,T+=38*ee,W+=38*te,re+=38*Y,X+=38*v,Re+=38*S,Z+=38*N,ce+=38*k,le+=38*_,xe+=38*M,me+=38*se,fe+=38*be,pe+=38*ye,de+=38*ge,c=1,e=x+c+65535,c=Math.floor(e/65536),x=e-c*65536,e=b+c+65535,c=Math.floor(e/65536),b=e-c*65536,e=T+c+65535,c=Math.floor(e/65536),T=e-c*65536,e=W+c+65535,c=Math.floor(e/65536),W=e-c*65536,e=re+c+65535,c=Math.floor(e/65536),re=e-c*65536,e=X+c+65535,c=Math.floor(e/65536),X=e-c*65536,e=Re+c+65535,c=Math.floor(e/65536),Re=e-c*65536,e=Z+c+65535,c=Math.floor(e/65536),Z=e-c*65536,e=ce+c+65535,c=Math.floor(e/65536),ce=e-c*65536,e=le+c+65535,c=Math.floor(e/65536),le=e-c*65536,e=xe+c+65535,c=Math.floor(e/65536),xe=e-c*65536,e=me+c+65535,c=Math.floor(e/65536),me=e-c*65536,e=fe+c+65535,c=Math.floor(e/65536),fe=e-c*65536,e=pe+c+65535,c=Math.floor(e/65536),pe=e-c*65536,e=de+c+65535,c=Math.floor(e/65536),de=e-c*65536,e=Q+c+65535,c=Math.floor(e/65536),Q=e-c*65536,x+=c-1+37*(c-1),c=1,e=x+c+65535,c=Math.floor(e/65536),x=e-c*65536,e=b+c+65535,c=Math.floor(e/65536),b=e-c*65536,e=T+c+65535,c=Math.floor(e/65536),T=e-c*65536,e=W+c+65535,c=Math.floor(e/65536),W=e-c*65536,e=re+c+65535,c=Math.floor(e/65536),re=e-c*65536,e=X+c+65535,c=Math.floor(e/65536),X=e-c*65536,e=Re+c+65535,c=Math.floor(e/65536),Re=e-c*65536,e=Z+c+65535,c=Math.floor(e/65536),Z=e-c*65536,e=ce+c+65535,c=Math.floor(e/65536),ce=e-c*65536,e=le+c+65535,c=Math.floor(e/65536),le=e-c*65536,e=xe+c+65535,c=Math.floor(e/65536),xe=e-c*65536,e=me+c+65535,c=Math.floor(e/65536),me=e-c*65536,e=fe+c+65535,c=Math.floor(e/65536),fe=e-c*65536,e=pe+c+65535,c=Math.floor(e/65536),pe=e-c*65536,e=de+c+65535,c=Math.floor(e/65536),de=e-c*65536,e=Q+c+65535,c=Math.floor(e/65536),Q=e-c*65536,x+=c-1+37*(c-1),o[0]=x,o[1]=b,o[2]=T,o[3]=W,o[4]=re,o[5]=X,o[6]=Re,o[7]=Z,o[8]=ce,o[9]=le,o[10]=xe,o[11]=me,o[12]=fe,o[13]=pe,o[14]=de,o[15]=Q}l(ue,"M");function Me(o,i){ue(o,i,i)}l(Me,"S");function qt(o,i){var s=r(),e;for(e=0;e<16;e++)s[e]=i[e];for(e=253;e>=0;e--)Me(s,s),e!==2&&e!==4&&ue(s,s,i);for(e=0;e<16;e++)o[e]=s[e]}l(qt,"inv25519");function Zt(o,i){var s=r(),e;for(e=0;e<16;e++)s[e]=i[e];for(e=250;e>=0;e--)Me(s,s),e!==1&&ue(s,s,i);for(e=0;e<16;e++)o[e]=s[e]}l(Zt,"pow2523");function Ct(o,i,s){var e=new Uint8Array(32),c=new Float64Array(80),x,b,T=r(),W=r(),re=r(),X=r(),Re=r(),Z=r();for(b=0;b<31;b++)e[b]=i[b];for(e[31]=i[31]&127|64,e[0]&=248,we(c,s),b=0;b<16;b++)W[b]=c[b],X[b]=T[b]=re[b]=0;for(T[0]=X[0]=1,b=254;b>=0;--b)x=e[b>>>3]>>>(b&7)&1,ne(T,W,x),ne(re,X,x),Ce(Re,T,re),$e(T,T,re),Ce(re,W,X),$e(W,W,X),Me(X,Re),Me(Z,T),ue(T,re,T),ue(re,W,Re),Ce(Re,T,re),$e(T,T,re),Me(W,T),$e(re,X,Z),ue(T,re,g),Ce(T,T,X),ue(re,re,T),ue(T,X,Z),ue(X,W,c),Me(W,Re),ne(T,W,x),ne(re,X,x);for(b=0;b<16;b++)c[b+16]=T[b],c[b+32]=re[b],c[b+48]=W[b],c[b+64]=X[b];var ce=c.subarray(32),le=c.subarray(16);return qt(ce,ce),ue(le,le,ce),Se(o,le),0}l(Ct,"crypto_scalarmult");function pt(o,i){return Ct(o,i,f)}l(pt,"crypto_scalarmult_base");function Mt(o,i){return n(i,32),pt(o,i)}l(Mt,"crypto_box_keypair");function Lt(o,i,s){var e=new Uint8Array(32);return Ct(e,s,i),z(o,a,e,J)}l(Lt,"crypto_box_beforenm");var Je=P,Ze=G;function Ye(o,i,s,e,c,x){var b=new Uint8Array(32);return Lt(b,c,x),Je(o,i,s,e,b)}l(Ye,"crypto_box");function Tr(o,i,s,e,c,x){var b=new Uint8Array(32);return Lt(b,c,x),Ze(o,i,s,e,b)}l(Tr,"crypto_box_open");var He=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function Qe(o,i,s,e){for(var c=new Int32Array(16),x=new Int32Array(16),b,T,W,re,X,Re,Z,ce,le,xe,me,fe,pe,de,Q,oe,q,ee,te,Y,v,S,N,k,_,M,se=o[0],be=o[1],ye=o[2],ge=o[3],d=o[4],Pe=o[5],ke=o[6],Te=o[7],ve=i[0],Ee=i[1],Ae=i[2],Ue=i[3],_e=i[4],Be=i[5],Ne=i[6],Fe=i[7],Le=0;e>=128;){for(te=0;te<16;te++)Y=8*te+Le,c[te]=s[Y+0]<<24|s[Y+1]<<16|s[Y+2]<<8|s[Y+3],x[te]=s[Y+4]<<24|s[Y+5]<<16|s[Y+6]<<8|s[Y+7];for(te=0;te<80;te++)if(b=se,T=be,W=ye,re=ge,X=d,Re=Pe,Z=ke,ce=Te,le=ve,xe=Ee,me=Ae,fe=Ue,pe=_e,de=Be,Q=Ne,oe=Fe,v=Te,S=Fe,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=(d>>>14|_e<<32-14)^(d>>>18|_e<<32-18)^(_e>>>41-32|d<<32-(41-32)),S=(_e>>>14|d<<32-14)^(_e>>>18|d<<32-18)^(d>>>41-32|_e<<32-(41-32)),N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,v=d&Pe^~d&ke,S=_e&Be^~_e&Ne,N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,v=He[te*2],S=He[te*2+1],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,v=c[te%16],S=x[te%16],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,q=_&65535|M<<16,ee=N&65535|k<<16,v=q,S=ee,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=(se>>>28|ve<<32-28)^(ve>>>34-32|se<<32-(34-32))^(ve>>>39-32|se<<32-(39-32)),S=(ve>>>28|se<<32-28)^(se>>>34-32|ve<<32-(34-32))^(se>>>39-32|ve<<32-(39-32)),N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,v=se&be^se&ye^be&ye,S=ve&Ee^ve&Ae^Ee&Ae,N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,ce=_&65535|M<<16,oe=N&65535|k<<16,v=re,S=fe,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=q,S=ee,N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,re=_&65535|M<<16,fe=N&65535|k<<16,be=b,ye=T,ge=W,d=re,Pe=X,ke=Re,Te=Z,se=ce,Ee=le,Ae=xe,Ue=me,_e=fe,Be=pe,Ne=de,Fe=Q,ve=oe,te%16===15)for(Y=0;Y<16;Y++)v=c[Y],S=x[Y],N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=c[(Y+9)%16],S=x[(Y+9)%16],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,q=c[(Y+1)%16],ee=x[(Y+1)%16],v=(q>>>1|ee<<32-1)^(q>>>8|ee<<32-8)^q>>>7,S=(ee>>>1|q<<32-1)^(ee>>>8|q<<32-8)^(ee>>>7|q<<32-7),N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,q=c[(Y+14)%16],ee=x[(Y+14)%16],v=(q>>>19|ee<<32-19)^(ee>>>61-32|q<<32-(61-32))^q>>>6,S=(ee>>>19|q<<32-19)^(q>>>61-32|ee<<32-(61-32))^(ee>>>6|q<<32-6),N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,c[Y]=_&65535|M<<16,x[Y]=N&65535|k<<16;v=se,S=ve,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[0],S=i[0],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[0]=se=_&65535|M<<16,i[0]=ve=N&65535|k<<16,v=be,S=Ee,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[1],S=i[1],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[1]=be=_&65535|M<<16,i[1]=Ee=N&65535|k<<16,v=ye,S=Ae,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[2],S=i[2],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[2]=ye=_&65535|M<<16,i[2]=Ae=N&65535|k<<16,v=ge,S=Ue,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[3],S=i[3],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[3]=ge=_&65535|M<<16,i[3]=Ue=N&65535|k<<16,v=d,S=_e,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[4],S=i[4],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[4]=d=_&65535|M<<16,i[4]=_e=N&65535|k<<16,v=Pe,S=Be,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[5],S=i[5],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[5]=Pe=_&65535|M<<16,i[5]=Be=N&65535|k<<16,v=ke,S=Ne,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[6],S=i[6],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[6]=ke=_&65535|M<<16,i[6]=Ne=N&65535|k<<16,v=Te,S=Fe,N=S&65535,k=S>>>16,_=v&65535,M=v>>>16,v=o[7],S=i[7],N+=S&65535,k+=S>>>16,_+=v&65535,M+=v>>>16,k+=N>>>16,_+=k>>>16,M+=_>>>16,o[7]=Te=_&65535|M<<16,i[7]=Fe=N&65535|k<<16,Le+=128,e-=128}return e}l(Qe,"crypto_hashblocks_hl");function et(o,i,s){var e=new Int32Array(8),c=new Int32Array(8),x=new Uint8Array(256),b,T=s;for(e[0]=1779033703,e[1]=3144134277,e[2]=1013904242,e[3]=2773480762,e[4]=1359893119,e[5]=2600822924,e[6]=528734635,e[7]=1541459225,c[0]=4089235720,c[1]=2227873595,c[2]=4271175723,c[3]=1595750129,c[4]=2917565137,c[5]=725511199,c[6]=4215389547,c[7]=327033209,Qe(e,c,i,s),s%=128,b=0;b<s;b++)x[b]=i[T-s+b];for(x[s]=128,s=256-128*(s<112?1:0),x[s-9]=0,I(x,s-8,T/536870912|0,T<<3),Qe(e,c,x,s),b=0;b<8;b++)I(o,8*b,e[b],c[b]);return 0}l(et,"crypto_hash");function at(o,i){var s=r(),e=r(),c=r(),x=r(),b=r(),T=r(),W=r(),re=r(),X=r();$e(s,o[1],o[0]),$e(X,i[1],i[0]),ue(s,s,X),Ce(e,o[0],o[1]),Ce(X,i[0],i[1]),ue(e,e,X),ue(c,o[3],i[3]),ue(c,c,w),ue(x,o[2],i[2]),Ce(x,x,x),$e(b,e,s),$e(T,x,c),Ce(W,x,c),Ce(re,e,s),ue(o[0],b,T),ue(o[1],re,W),ue(o[2],W,T),ue(o[3],b,re)}l(at,"add");function Qt(o,i,s){var e;for(e=0;e<4;e++)ne(o[e],i[e],s)}l(Qt,"cswap");function er(o,i){var s=r(),e=r(),c=r();qt(c,i[2]),ue(s,i[0],c),ue(e,i[1],c),Se(o,e),o[31]^=he(s)<<7}l(er,"pack");function _r(o,i,s){var e,c;for(H(o[0],u),H(o[1],h),H(o[2],h),H(o[3],u),c=255;c>=0;--c)e=s[c/8|0]>>(c&7)&1,Qt(o,i,e),at(i,o),at(o,o),Qt(o,i,e)}l(_r,"scalarmult");function tr(o,i){var s=[r(),r(),r(),r()];H(s[0],y),H(s[1],E),H(s[2],h),ue(s[3],y,E),_r(o,s,i)}l(tr,"scalarbase");function Ir(o,i,s){var e=new Uint8Array(64),c=[r(),r(),r(),r()],x;for(s||n(i,32),et(e,i,32),e[0]&=248,e[31]&=127,e[31]|=64,tr(c,e),er(o,c),x=0;x<32;x++)i[x+32]=o[x];return 0}l(Ir,"crypto_sign_keypair");var rr=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function Dr(o,i){var s,e,c,x;for(e=63;e>=32;--e){for(s=0,c=e-32,x=e-12;c<x;++c)i[c]+=s-16*i[e]*rr[c-(e-32)],s=Math.floor((i[c]+128)/256),i[c]-=s*256;i[c]+=s,i[e]=0}for(s=0,c=0;c<32;c++)i[c]+=s-(i[31]>>4)*rr[c],s=i[c]>>8,i[c]&=255;for(c=0;c<32;c++)i[c]-=s*rr[c];for(e=0;e<32;e++)i[e+1]+=i[e]>>8,o[e]=i[e]&255}l(Dr,"modL");function $r(o){var i=new Float64Array(64),s;for(s=0;s<64;s++)i[s]=o[s];for(s=0;s<64;s++)o[s]=0;Dr(o,i)}l($r,"reduce");function ro(o,i,s,e){var c=new Uint8Array(64),x=new Uint8Array(64),b=new Uint8Array(64),T,W,re=new Float64Array(64),X=[r(),r(),r(),r()];et(c,e,32),c[0]&=248,c[31]&=127,c[31]|=64;var Re=s+64;for(T=0;T<s;T++)o[64+T]=i[T];for(T=0;T<32;T++)o[32+T]=c[32+T];for(et(b,o.subarray(32),s+32),$r(b),tr(X,b),er(o,X),T=32;T<64;T++)o[T]=e[T];for(et(x,o,s+64),$r(x),T=0;T<64;T++)re[T]=0;for(T=0;T<32;T++)re[T]=b[T];for(T=0;T<32;T++)for(W=0;W<32;W++)re[T+W]+=x[T]*c[W];return Dr(o.subarray(32),re),Re}l(ro,"crypto_sign");function ln(o,i){var s=r(),e=r(),c=r(),x=r(),b=r(),T=r(),W=r();return H(o[2],h),we(o[1],i),Me(c,o[1]),ue(x,c,p),$e(c,c,o[2]),Ce(x,o[2],x),Me(b,x),Me(T,b),ue(W,T,b),ue(s,W,c),ue(s,s,x),Zt(s,s),ue(s,s,c),ue(s,s,x),ue(s,s,x),ue(o[0],s,x),Me(e,o[0]),ue(e,e,x),ae(e,c)&&ue(o[0],o[0],D),Me(e,o[0]),ue(e,e,x),ae(e,c)?-1:(he(o[0])===i[31]>>7&&$e(o[0],u,o[0]),ue(o[3],o[0],o[1]),0)}l(ln,"unpackneg");function Br(o,i,s,e){var c,x=new Uint8Array(32),b=new Uint8Array(64),T=[r(),r(),r(),r()],W=[r(),r(),r(),r()];if(s<64||ln(W,e))return-1;for(c=0;c<s;c++)o[c]=i[c];for(c=0;c<32;c++)o[c+32]=e[c];if(et(b,o,s),$r(b),_r(T,W,b),tr(W,i.subarray(32)),at(T,W),er(x,T),s-=64,U(i,0,x,0)){for(c=0;c<s;c++)o[c]=0;return-1}for(c=0;c<s;c++)o[c]=i[c+64];return s}l(Br,"crypto_sign_open");var Nr=32,or=24,Ot=32,Et=16,Wt=32,nr=32,Ht=32,Kt=32,Fr=32,oo=or,fn=Ot,dn=Et,lt=64,yt=32,At=64,Ur=32,Mr=64;t.lowlevel={crypto_core_hsalsa20:z,crypto_stream_xor:C,crypto_stream:$,crypto_stream_salsa20_xor:m,crypto_stream_salsa20:R,crypto_onetimeauth:A,crypto_onetimeauth_verify:K,crypto_verify_16:V,crypto_verify_32:U,crypto_secretbox:P,crypto_secretbox_open:G,crypto_scalarmult:Ct,crypto_scalarmult_base:pt,crypto_box_beforenm:Lt,crypto_box_afternm:Je,crypto_box:Ye,crypto_box_open:Tr,crypto_box_keypair:Mt,crypto_hash:et,crypto_sign:ro,crypto_sign_keypair:Ir,crypto_sign_open:Br,crypto_secretbox_KEYBYTES:Nr,crypto_secretbox_NONCEBYTES:or,crypto_secretbox_ZEROBYTES:Ot,crypto_secretbox_BOXZEROBYTES:Et,crypto_scalarmult_BYTES:Wt,crypto_scalarmult_SCALARBYTES:nr,crypto_box_PUBLICKEYBYTES:Ht,crypto_box_SECRETKEYBYTES:Kt,crypto_box_BEFORENMBYTES:Fr,crypto_box_NONCEBYTES:oo,crypto_box_ZEROBYTES:fn,crypto_box_BOXZEROBYTES:dn,crypto_sign_BYTES:lt,crypto_sign_PUBLICKEYBYTES:yt,crypto_sign_SECRETKEYBYTES:At,crypto_sign_SEEDBYTES:Ur,crypto_hash_BYTES:Mr,gf:r,D:p,L:rr,pack25519:Se,unpack25519:we,M:ue,A:Ce,S:Me,Z:$e,pow2523:Zt,add:at,set25519:H,modL:Dr,scalarmult:_r,scalarbase:tr};function no(o,i){if(o.length!==Nr)throw new Error("bad key size");if(i.length!==or)throw new Error("bad nonce size")}l(no,"checkLengths");function un(o,i){if(o.length!==Ht)throw new Error("bad public key size");if(i.length!==Kt)throw new Error("bad secret key size")}l(un,"checkBoxLengths");function tt(){for(var o=0;o<arguments.length;o++)if(!(arguments[o]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}l(tt,"checkArrayTypes");function ao(o){for(var i=0;i<o.length;i++)o[i]=0}l(ao,"cleanup"),t.randomBytes=function(o){var i=new Uint8Array(o);return n(i,o),i},t.secretbox=function(o,i,s){tt(o,i,s),no(s,i);for(var e=new Uint8Array(Ot+o.length),c=new Uint8Array(e.length),x=0;x<o.length;x++)e[x+Ot]=o[x];return P(c,e,e.length,i,s),c.subarray(Et)},t.secretbox.open=function(o,i,s){tt(o,i,s),no(s,i);for(var e=new Uint8Array(Et+o.length),c=new Uint8Array(e.length),x=0;x<o.length;x++)e[x+Et]=o[x];return e.length<32||G(c,e,e.length,i,s)!==0?null:c.subarray(Ot)},t.secretbox.keyLength=Nr,t.secretbox.nonceLength=or,t.secretbox.overheadLength=Et,t.scalarMult=function(o,i){if(tt(o,i),o.length!==nr)throw new Error("bad n size");if(i.length!==Wt)throw new Error("bad p size");var s=new Uint8Array(Wt);return Ct(s,o,i),s},t.scalarMult.base=function(o){if(tt(o),o.length!==nr)throw new Error("bad n size");var i=new Uint8Array(Wt);return pt(i,o),i},t.scalarMult.scalarLength=nr,t.scalarMult.groupElementLength=Wt,t.box=function(o,i,s,e){var c=t.box.before(s,e);return t.secretbox(o,i,c)},t.box.before=function(o,i){tt(o,i),un(o,i);var s=new Uint8Array(Fr);return Lt(s,o,i),s},t.box.after=t.secretbox,t.box.open=function(o,i,s,e){var c=t.box.before(s,e);return t.secretbox.open(o,i,c)},t.box.open.after=t.secretbox.open,t.box.keyPair=function(){var o=new Uint8Array(Ht),i=new Uint8Array(Kt);return Mt(o,i),{publicKey:o,secretKey:i}},t.box.keyPair.fromSecretKey=function(o){if(tt(o),o.length!==Kt)throw new Error("bad secret key size");var i=new Uint8Array(Ht);return pt(i,o),{publicKey:i,secretKey:new Uint8Array(o)}},t.box.publicKeyLength=Ht,t.box.secretKeyLength=Kt,t.box.sharedKeyLength=Fr,t.box.nonceLength=oo,t.box.overheadLength=t.secretbox.overheadLength,t.sign=function(o,i){if(tt(o,i),i.length!==At)throw new Error("bad secret key size");var s=new Uint8Array(lt+o.length);return ro(s,o,o.length,i),s},t.sign.open=function(o,i){if(tt(o,i),i.length!==yt)throw new Error("bad public key size");var s=new Uint8Array(o.length),e=Br(s,o,o.length,i);if(e<0)return null;for(var c=new Uint8Array(e),x=0;x<c.length;x++)c[x]=s[x];return c},t.sign.detached=function(o,i){for(var s=t.sign(o,i),e=new Uint8Array(lt),c=0;c<e.length;c++)e[c]=s[c];return e},t.sign.detached.verify=function(o,i,s){if(tt(o,i,s),i.length!==lt)throw new Error("bad signature size");if(s.length!==yt)throw new Error("bad public key size");var e=new Uint8Array(lt+o.length),c=new Uint8Array(lt+o.length),x;for(x=0;x<lt;x++)e[x]=i[x];for(x=0;x<o.length;x++)e[x+lt]=o[x];return Br(c,e,e.length,s)>=0},t.sign.keyPair=function(){var o=new Uint8Array(yt),i=new Uint8Array(At);return Ir(o,i),{publicKey:o,secretKey:i}},t.sign.keyPair.fromSecretKey=function(o){if(tt(o),o.length!==At)throw new Error("bad secret key size");for(var i=new Uint8Array(yt),s=0;s<i.length;s++)i[s]=o[32+s];return{publicKey:i,secretKey:new Uint8Array(o)}},t.sign.keyPair.fromSeed=function(o){if(tt(o),o.length!==Ur)throw new Error("bad seed size");for(var i=new Uint8Array(yt),s=new Uint8Array(At),e=0;e<32;e++)s[e]=o[e];return Ir(i,s,!0),{publicKey:i,secretKey:s}},t.sign.publicKeyLength=yt,t.sign.secretKeyLength=At,t.sign.seedLength=Ur,t.sign.signatureLength=lt,t.hash=function(o){tt(o);var i=new Uint8Array(Mr);return et(i,o,o.length),i},t.hash.hashLength=Mr,t.verify=function(o,i){return tt(o,i),o.length===0||i.length===0||o.length!==i.length?!1:L(o,0,i,0,o.length)===0},t.setPRNG=function(o){n=o},function(){var o=typeof self<"u"?self.crypto||self.msCrypto:null;if(o&&o.getRandomValues){var i=65536;t.setPRNG(function(s,e){var c,x=new Uint8Array(e);for(c=0;c<e;c+=i)o.getRandomValues(x.subarray(c,c+Math.min(e-c,i)));for(c=0;c<e;c++)s[c]=x[c];ao(x)})}else typeof so<"u"&&(o=Gr(),o&&o.randomBytes&&t.setPRNG(function(s,e){var c,x=o.randomBytes(e);for(c=0;c<e;c++)s[c]=x[c];ao(x)}))}()})(typeof Sr<"u"&&Sr.exports?Sr.exports:self.nacl=self.nacl||{})});var Mo=ar(()=>{});var Lo=ar((vc,Ar)=>{(function(){"use strict";var t="input is invalid type",r=typeof window=="object",n=r?window:{};n.JS_SHA256_NO_WINDOW&&(r=!1);var a=!r&&typeof self=="object",f=!n.JS_SHA256_NO_NODE_JS&&typeof process=="object"&&process.versions&&process.versions.node;f?n=global:a&&(n=self);var u=!n.JS_SHA256_NO_COMMON_JS&&typeof Ar=="object"&&Ar.exports,h=typeof define=="function"&&define.amd,g=!n.JS_SHA256_NO_ARRAY_BUFFER&&typeof ArrayBuffer<"u",p="0123456789abcdef".split(""),w=[-2147483648,8388608,32768,128],y=[24,16,8,0],E=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],D=["hex","array","digest","arrayBuffer"],I=[];(n.JS_SHA256_NO_NODE_JS||!Array.isArray)&&(Array.isArray=function(m){return Object.prototype.toString.call(m)==="[object Array]"}),g&&(n.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW||!ArrayBuffer.isView)&&(ArrayBuffer.isView=function(m){return typeof m=="object"&&m.buffer&&m.buffer.constructor===ArrayBuffer});var L=l(function(m,R){return function($){return new F(R,!0).update($)[m]()}},"createOutputMethod"),V=l(function(m){var R=L("hex",m);f&&(R=U(R,m)),R.create=function(){return new F(m)},R.update=function(B){return R.create().update(B)};for(var $=0;$<D.length;++$){var C=D[$];R[C]=L(C,m)}return R},"createMethod"),U=l(function(m,R){var $=Gr(),C=Mo().Buffer,B=R?"sha224":"sha256",A;C.from&&!n.JS_SHA256_NO_BUFFER_FROM?A=C.from:A=l(function(P){return new C(P)},"bufferFrom");var K=l(function(P){if(typeof P=="string")return $.createHash(B).update(P,"utf8").digest("hex");if(P==null)throw new Error(t);return P.constructor===ArrayBuffer&&(P=new Uint8Array(P)),Array.isArray(P)||ArrayBuffer.isView(P)||P.constructor===C?$.createHash(B).update(A(P)).digest("hex"):m(P)},"nodeMethod");return K},"nodeWrap"),j=l(function(m,R){return function($,C){return new z($,R,!0).update(C)[m]()}},"createHmacOutputMethod"),O=l(function(m){var R=j("hex",m);R.create=function(B){return new z(B,m)},R.update=function(B,A){return R.create(B).update(A)};for(var $=0;$<D.length;++$){var C=D[$];R[C]=j(C,m)}return R},"createHmacMethod");function F(m,R){R?(I[0]=I[16]=I[1]=I[2]=I[3]=I[4]=I[5]=I[6]=I[7]=I[8]=I[9]=I[10]=I[11]=I[12]=I[13]=I[14]=I[15]=0,this.blocks=I):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],m?(this.h0=3238371032,this.h1=914150663,this.h2=812702999,this.h3=4144912697,this.h4=4290775857,this.h5=1750603025,this.h6=1694076839,this.h7=3204075428):(this.h0=1779033703,this.h1=3144134277,this.h2=1013904242,this.h3=2773480762,this.h4=1359893119,this.h5=2600822924,this.h6=528734635,this.h7=1541459225),this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0,this.is224=m}l(F,"Sha256"),F.prototype.update=function(m){if(!this.finalized){var R,$=typeof m;if($!=="string"){if($==="object"){if(m===null)throw new Error(t);if(g&&m.constructor===ArrayBuffer)m=new Uint8Array(m);else if(!Array.isArray(m)&&(!g||!ArrayBuffer.isView(m)))throw new Error(t)}else throw new Error(t);R=!0}for(var C,B=0,A,K=m.length,P=this.blocks;B<K;){if(this.hashed&&(this.hashed=!1,P[0]=this.block,this.block=P[16]=P[1]=P[2]=P[3]=P[4]=P[5]=P[6]=P[7]=P[8]=P[9]=P[10]=P[11]=P[12]=P[13]=P[14]=P[15]=0),R)for(A=this.start;B<K&&A<64;++B)P[A>>>2]|=m[B]<<y[A++&3];else for(A=this.start;B<K&&A<64;++B)C=m.charCodeAt(B),C<128?P[A>>>2]|=C<<y[A++&3]:C<2048?(P[A>>>2]|=(192|C>>>6)<<y[A++&3],P[A>>>2]|=(128|C&63)<<y[A++&3]):C<55296||C>=57344?(P[A>>>2]|=(224|C>>>12)<<y[A++&3],P[A>>>2]|=(128|C>>>6&63)<<y[A++&3],P[A>>>2]|=(128|C&63)<<y[A++&3]):(C=65536+((C&1023)<<10|m.charCodeAt(++B)&1023),P[A>>>2]|=(240|C>>>18)<<y[A++&3],P[A>>>2]|=(128|C>>>12&63)<<y[A++&3],P[A>>>2]|=(128|C>>>6&63)<<y[A++&3],P[A>>>2]|=(128|C&63)<<y[A++&3]);this.lastByteIndex=A,this.bytes+=A-this.start,A>=64?(this.block=P[16],this.start=A-64,this.hash(),this.hashed=!0):this.start=A}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},F.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var m=this.blocks,R=this.lastByteIndex;m[16]=this.block,m[R>>>2]|=w[R&3],this.block=m[16],R>=56&&(this.hashed||this.hash(),m[0]=this.block,m[16]=m[1]=m[2]=m[3]=m[4]=m[5]=m[6]=m[7]=m[8]=m[9]=m[10]=m[11]=m[12]=m[13]=m[14]=m[15]=0),m[14]=this.hBytes<<3|this.bytes>>>29,m[15]=this.bytes<<3,this.hash()}},F.prototype.hash=function(){var m=this.h0,R=this.h1,$=this.h2,C=this.h3,B=this.h4,A=this.h5,K=this.h6,P=this.h7,G=this.blocks,H,ie,ne,Se,ae,he,we,Ce,$e,ue,Me;for(H=16;H<64;++H)ae=G[H-15],ie=(ae>>>7|ae<<25)^(ae>>>18|ae<<14)^ae>>>3,ae=G[H-2],ne=(ae>>>17|ae<<15)^(ae>>>19|ae<<13)^ae>>>10,G[H]=G[H-16]+ie+G[H-7]+ne<<0;for(Me=R&$,H=0;H<64;H+=4)this.first?(this.is224?(Ce=300032,ae=G[0]-1413257819,P=ae-150054599<<0,C=ae+24177077<<0):(Ce=704751109,ae=G[0]-210244248,P=ae-1521486534<<0,C=ae+143694565<<0),this.first=!1):(ie=(m>>>2|m<<30)^(m>>>13|m<<19)^(m>>>22|m<<10),ne=(B>>>6|B<<26)^(B>>>11|B<<21)^(B>>>25|B<<7),Ce=m&R,Se=Ce^m&$^Me,we=B&A^~B&K,ae=P+ne+we+E[H]+G[H],he=ie+Se,P=C+ae<<0,C=ae+he<<0),ie=(C>>>2|C<<30)^(C>>>13|C<<19)^(C>>>22|C<<10),ne=(P>>>6|P<<26)^(P>>>11|P<<21)^(P>>>25|P<<7),$e=C&m,Se=$e^C&R^Ce,we=P&B^~P&A,ae=K+ne+we+E[H+1]+G[H+1],he=ie+Se,K=$+ae<<0,$=ae+he<<0,ie=($>>>2|$<<30)^($>>>13|$<<19)^($>>>22|$<<10),ne=(K>>>6|K<<26)^(K>>>11|K<<21)^(K>>>25|K<<7),ue=$&C,Se=ue^$&m^$e,we=K&P^~K&B,ae=A+ne+we+E[H+2]+G[H+2],he=ie+Se,A=R+ae<<0,R=ae+he<<0,ie=(R>>>2|R<<30)^(R>>>13|R<<19)^(R>>>22|R<<10),ne=(A>>>6|A<<26)^(A>>>11|A<<21)^(A>>>25|A<<7),Me=R&$,Se=Me^R&C^ue,we=A&K^~A&P,ae=B+ne+we+E[H+3]+G[H+3],he=ie+Se,B=m+ae<<0,m=ae+he<<0,this.chromeBugWorkAround=!0;this.h0=this.h0+m<<0,this.h1=this.h1+R<<0,this.h2=this.h2+$<<0,this.h3=this.h3+C<<0,this.h4=this.h4+B<<0,this.h5=this.h5+A<<0,this.h6=this.h6+K<<0,this.h7=this.h7+P<<0},F.prototype.hex=function(){this.finalize();var m=this.h0,R=this.h1,$=this.h2,C=this.h3,B=this.h4,A=this.h5,K=this.h6,P=this.h7,G=p[m>>>28&15]+p[m>>>24&15]+p[m>>>20&15]+p[m>>>16&15]+p[m>>>12&15]+p[m>>>8&15]+p[m>>>4&15]+p[m&15]+p[R>>>28&15]+p[R>>>24&15]+p[R>>>20&15]+p[R>>>16&15]+p[R>>>12&15]+p[R>>>8&15]+p[R>>>4&15]+p[R&15]+p[$>>>28&15]+p[$>>>24&15]+p[$>>>20&15]+p[$>>>16&15]+p[$>>>12&15]+p[$>>>8&15]+p[$>>>4&15]+p[$&15]+p[C>>>28&15]+p[C>>>24&15]+p[C>>>20&15]+p[C>>>16&15]+p[C>>>12&15]+p[C>>>8&15]+p[C>>>4&15]+p[C&15]+p[B>>>28&15]+p[B>>>24&15]+p[B>>>20&15]+p[B>>>16&15]+p[B>>>12&15]+p[B>>>8&15]+p[B>>>4&15]+p[B&15]+p[A>>>28&15]+p[A>>>24&15]+p[A>>>20&15]+p[A>>>16&15]+p[A>>>12&15]+p[A>>>8&15]+p[A>>>4&15]+p[A&15]+p[K>>>28&15]+p[K>>>24&15]+p[K>>>20&15]+p[K>>>16&15]+p[K>>>12&15]+p[K>>>8&15]+p[K>>>4&15]+p[K&15];return this.is224||(G+=p[P>>>28&15]+p[P>>>24&15]+p[P>>>20&15]+p[P>>>16&15]+p[P>>>12&15]+p[P>>>8&15]+p[P>>>4&15]+p[P&15]),G},F.prototype.toString=F.prototype.hex,F.prototype.digest=function(){this.finalize();var m=this.h0,R=this.h1,$=this.h2,C=this.h3,B=this.h4,A=this.h5,K=this.h6,P=this.h7,G=[m>>>24&255,m>>>16&255,m>>>8&255,m&255,R>>>24&255,R>>>16&255,R>>>8&255,R&255,$>>>24&255,$>>>16&255,$>>>8&255,$&255,C>>>24&255,C>>>16&255,C>>>8&255,C&255,B>>>24&255,B>>>16&255,B>>>8&255,B&255,A>>>24&255,A>>>16&255,A>>>8&255,A&255,K>>>24&255,K>>>16&255,K>>>8&255,K&255];return this.is224||G.push(P>>>24&255,P>>>16&255,P>>>8&255,P&255),G},F.prototype.array=F.prototype.digest,F.prototype.arrayBuffer=function(){this.finalize();var m=new ArrayBuffer(this.is224?28:32),R=new DataView(m);return R.setUint32(0,this.h0),R.setUint32(4,this.h1),R.setUint32(8,this.h2),R.setUint32(12,this.h3),R.setUint32(16,this.h4),R.setUint32(20,this.h5),R.setUint32(24,this.h6),this.is224||R.setUint32(28,this.h7),m};function z(m,R,$){var C,B=typeof m;if(B==="string"){var A=[],K=m.length,P=0,G;for(C=0;C<K;++C)G=m.charCodeAt(C),G<128?A[P++]=G:G<2048?(A[P++]=192|G>>>6,A[P++]=128|G&63):G<55296||G>=57344?(A[P++]=224|G>>>12,A[P++]=128|G>>>6&63,A[P++]=128|G&63):(G=65536+((G&1023)<<10|m.charCodeAt(++C)&1023),A[P++]=240|G>>>18,A[P++]=128|G>>>12&63,A[P++]=128|G>>>6&63,A[P++]=128|G&63);m=A}else if(B==="object"){if(m===null)throw new Error(t);if(g&&m.constructor===ArrayBuffer)m=new Uint8Array(m);else if(!Array.isArray(m)&&(!g||!ArrayBuffer.isView(m)))throw new Error(t)}else throw new Error(t);m.length>64&&(m=new F(R,!0).update(m).array());var H=[],ie=[];for(C=0;C<64;++C){var ne=m[C]||0;H[C]=92^ne,ie[C]=54^ne}F.call(this,R,$),this.update(ie),this.oKeyPad=H,this.inner=!0,this.sharedMemory=$}l(z,"HmacSha256"),z.prototype=new F,z.prototype.finalize=function(){if(F.prototype.finalize.call(this),this.inner){this.inner=!1;var m=this.array();F.call(this,this.is224,this.sharedMemory),this.update(this.oKeyPad),this.update(m),F.prototype.finalize.call(this)}};var J=V();J.sha256=J,J.sha224=V(!0),J.sha256.hmac=O(),J.sha224.hmac=O(!0),u?Ar.exports=J:(n.sha256=J.sha256,n.sha224=J.sha224,h&&define(function(){return J}))})()});var ht=crypto,sr=l(t=>t instanceof CryptoKey,"isCryptoKey");var Xe=new TextEncoder,ot=new TextDecoder,ga=2**32;function ir(...t){let r=t.reduce((f,{length:u})=>f+u,0),n=new Uint8Array(r),a=0;for(let f of t)n.set(f,a),a+=f.length;return n}l(ir,"concat");var yn=l(t=>{let r=t;typeof r=="string"&&(r=Xe.encode(r));let n=32768,a=[];for(let f=0;f<r.length;f+=n)a.push(String.fromCharCode.apply(null,r.subarray(f,f+n)));return btoa(a.join(""))},"encodeBase64"),cr=l(t=>yn(t).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_"),"encode"),wn=l(t=>{let r=atob(t),n=new Uint8Array(r.length);for(let a=0;a<r.length;a++)n[a]=r.charCodeAt(a);return n},"decodeBase64"),st=l(t=>{let r=t;r instanceof Uint8Array&&(r=ot.decode(r)),r=r.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,"");try{return wn(r)}catch{throw new TypeError("The input to be decoded is not correctly encoded.")}},"decode");var Oe=class extends Error{constructor(r,n){super(r,n),this.code="ERR_JOSE_GENERIC",this.name=this.constructor.name,Error.captureStackTrace?.(this,this.constructor)}};l(Oe,"JOSEError");Oe.code="ERR_JOSE_GENERIC";var Ge=class extends Oe{constructor(r,n,a="unspecified",f="unspecified"){super(r,{cause:{claim:a,reason:f,payload:n}}),this.code="ERR_JWT_CLAIM_VALIDATION_FAILED",this.claim=a,this.reason=f,this.payload=n}};l(Ge,"JWTClaimValidationFailed");Ge.code="ERR_JWT_CLAIM_VALIDATION_FAILED";var wt=class extends Oe{constructor(r,n,a="unspecified",f="unspecified"){super(r,{cause:{claim:a,reason:f,payload:n}}),this.code="ERR_JWT_EXPIRED",this.claim=a,this.reason=f,this.payload=n}};l(wt,"JWTExpired");wt.code="ERR_JWT_EXPIRED";var Rt=class extends Oe{constructor(){super(...arguments),this.code="ERR_JOSE_ALG_NOT_ALLOWED"}};l(Rt,"JOSEAlgNotAllowed");Rt.code="ERR_JOSE_ALG_NOT_ALLOWED";var ze=class extends Oe{constructor(){super(...arguments),this.code="ERR_JOSE_NOT_SUPPORTED"}};l(ze,"JOSENotSupported");ze.code="ERR_JOSE_NOT_SUPPORTED";var lr=class extends Oe{constructor(r="decryption operation failed",n){super(r,n),this.code="ERR_JWE_DECRYPTION_FAILED"}};l(lr,"JWEDecryptionFailed");lr.code="ERR_JWE_DECRYPTION_FAILED";var fr=class extends Oe{constructor(){super(...arguments),this.code="ERR_JWE_INVALID"}};l(fr,"JWEInvalid");fr.code="ERR_JWE_INVALID";var Ie=class extends Oe{constructor(){super(...arguments),this.code="ERR_JWS_INVALID"}};l(Ie,"JWSInvalid");Ie.code="ERR_JWS_INVALID";var it=class extends Oe{constructor(){super(...arguments),this.code="ERR_JWT_INVALID"}};l(it,"JWTInvalid");it.code="ERR_JWT_INVALID";var dr=class extends Oe{constructor(){super(...arguments),this.code="ERR_JWK_INVALID"}};l(dr,"JWKInvalid");dr.code="ERR_JWK_INVALID";var ur=class extends Oe{constructor(){super(...arguments),this.code="ERR_JWKS_INVALID"}};l(ur,"JWKSInvalid");ur.code="ERR_JWKS_INVALID";var pr=class extends Oe{constructor(r="no applicable key found in the JSON Web Key Set",n){super(r,n),this.code="ERR_JWKS_NO_MATCHING_KEY"}};l(pr,"JWKSNoMatchingKey");pr.code="ERR_JWKS_NO_MATCHING_KEY";var hr=class extends Oe{constructor(r="multiple matching keys found in the JSON Web Key Set",n){super(r,n),this.code="ERR_JWKS_MULTIPLE_MATCHING_KEYS"}};l(hr,"JWKSMultipleMatchingKeys");hr.code="ERR_JWKS_MULTIPLE_MATCHING_KEYS";var mr=class extends Oe{constructor(r="request timed out",n){super(r,n),this.code="ERR_JWKS_TIMEOUT"}};l(mr,"JWKSTimeout");mr.code="ERR_JWKS_TIMEOUT";var kt=class extends Oe{constructor(r="signature verification failed",n){super(r,n),this.code="ERR_JWS_SIGNATURE_VERIFICATION_FAILED"}};l(kt,"JWSSignatureVerificationFailed");kt.code="ERR_JWS_SIGNATURE_VERIFICATION_FAILED";function ft(t,r="algorithm.name"){return new TypeError(`CryptoKey does not support this operation, its ${r} must be ${t}`)}l(ft,"unusable");function xr(t,r){return t.name===r}l(xr,"isAlgorithm");function Wr(t){return parseInt(t.name.slice(4),10)}l(Wr,"getHashLength");function Sn(t){switch(t){case"ES256":return"P-256";case"ES384":return"P-384";case"ES512":return"P-521";default:throw new Error("unreachable")}}l(Sn,"getNamedCurve");function Pn(t,r){if(r.length&&!r.some(n=>t.usages.includes(n))){let n="CryptoKey does not support this operation, its usages must include ";if(r.length>2){let a=r.pop();n+=`one of ${r.join(", ")}, or ${a}.`}else r.length===2?n+=`one of ${r[0]} or ${r[1]}.`:n+=`${r[0]}.`;throw new TypeError(n)}}l(Pn,"checkUsage");function io(t,r,...n){switch(r){case"HS256":case"HS384":case"HS512":{if(!xr(t.algorithm,"HMAC"))throw ft("HMAC");let a=parseInt(r.slice(2),10);if(Wr(t.algorithm.hash)!==a)throw ft(`SHA-${a}`,"algorithm.hash");break}case"RS256":case"RS384":case"RS512":{if(!xr(t.algorithm,"RSASSA-PKCS1-v1_5"))throw ft("RSASSA-PKCS1-v1_5");let a=parseInt(r.slice(2),10);if(Wr(t.algorithm.hash)!==a)throw ft(`SHA-${a}`,"algorithm.hash");break}case"PS256":case"PS384":case"PS512":{if(!xr(t.algorithm,"RSA-PSS"))throw ft("RSA-PSS");let a=parseInt(r.slice(2),10);if(Wr(t.algorithm.hash)!==a)throw ft(`SHA-${a}`,"algorithm.hash");break}case"EdDSA":{if(t.algorithm.name!=="Ed25519"&&t.algorithm.name!=="Ed448")throw ft("Ed25519 or Ed448");break}case"ES256":case"ES384":case"ES512":{if(!xr(t.algorithm,"ECDSA"))throw ft("ECDSA");let a=Sn(r);if(t.algorithm.namedCurve!==a)throw ft(a,"algorithm.namedCurve");break}default:throw new TypeError("CryptoKey does not support this operation")}Pn(t,n)}l(io,"checkSigCryptoKey");function co(t,r,...n){if(n=n.filter(Boolean),n.length>2){let a=n.pop();t+=`one of type ${n.join(", ")}, or ${a}.`}else n.length===2?t+=`one of type ${n[0]} or ${n[1]}.`:t+=`of type ${n[0]}.`;return r==null?t+=` Received ${r}`:typeof r=="function"&&r.name?t+=` Received function ${r.name}`:typeof r=="object"&&r!=null&&r.constructor?.name&&(t+=` Received an instance of ${r.constructor.name}`),t}l(co,"message");var Hr=l((t,...r)=>co("Key must be ",t,...r),"default");function Kr(t,r,...n){return co(`Key for the ${t} algorithm must be `,r,...n)}l(Kr,"withAlg");var Vr=l(t=>sr(t)?!0:t?.[Symbol.toStringTag]==="KeyObject","default"),Tt=["CryptoKey"];var Cn=l((...t)=>{let r=t.filter(Boolean);if(r.length===0||r.length===1)return!0;let n;for(let a of r){let f=Object.keys(a);if(!n||n.size===0){n=new Set(f);continue}for(let u of f){if(n.has(u))return!1;n.add(u)}}return!0},"isDisjoint"),br=Cn;function En(t){return typeof t=="object"&&t!==null}l(En,"isObjectLike");function rt(t){if(!En(t)||Object.prototype.toString.call(t)!=="[object Object]")return!1;if(Object.getPrototypeOf(t)===null)return!0;let r=t;for(;Object.getPrototypeOf(r)!==null;)r=Object.getPrototypeOf(r);return Object.getPrototypeOf(t)===r}l(rt,"isObject");var gr=l((t,r)=>{if(t.startsWith("RS")||t.startsWith("PS")){let{modulusLength:n}=r.algorithm;if(typeof n!="number"||n<2048)throw new TypeError(`${t} requires key modulusLength to be 2048 bits or larger`)}},"default");function dt(t){return rt(t)&&typeof t.kty=="string"}l(dt,"isJWK");function lo(t){return t.kty!=="oct"&&typeof t.d=="string"}l(lo,"isPrivateJWK");function fo(t){return t.kty!=="oct"&&typeof t.d>"u"}l(fo,"isPublicJWK");function uo(t){return dt(t)&&t.kty==="oct"&&typeof t.k=="string"}l(uo,"isSecretJWK");function Rn(t){let r,n;switch(t.kty){case"RSA":{switch(t.alg){case"PS256":case"PS384":case"PS512":r={name:"RSA-PSS",hash:`SHA-${t.alg.slice(-3)}`},n=t.d?["sign"]:["verify"];break;case"RS256":case"RS384":case"RS512":r={name:"RSASSA-PKCS1-v1_5",hash:`SHA-${t.alg.slice(-3)}`},n=t.d?["sign"]:["verify"];break;case"RSA-OAEP":case"RSA-OAEP-256":case"RSA-OAEP-384":case"RSA-OAEP-512":r={name:"RSA-OAEP",hash:`SHA-${parseInt(t.alg.slice(-3),10)||1}`},n=t.d?["decrypt","unwrapKey"]:["encrypt","wrapKey"];break;default:throw new ze('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break}case"EC":{switch(t.alg){case"ES256":r={name:"ECDSA",namedCurve:"P-256"},n=t.d?["sign"]:["verify"];break;case"ES384":r={name:"ECDSA",namedCurve:"P-384"},n=t.d?["sign"]:["verify"];break;case"ES512":r={name:"ECDSA",namedCurve:"P-521"},n=t.d?["sign"]:["verify"];break;case"ECDH-ES":case"ECDH-ES+A128KW":case"ECDH-ES+A192KW":case"ECDH-ES+A256KW":r={name:"ECDH",namedCurve:t.crv},n=t.d?["deriveBits"]:[];break;default:throw new ze('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break}case"OKP":{switch(t.alg){case"EdDSA":r={name:t.crv},n=t.d?["sign"]:["verify"];break;case"ECDH-ES":case"ECDH-ES+A128KW":case"ECDH-ES+A192KW":case"ECDH-ES+A256KW":r={name:t.crv},n=t.d?["deriveBits"]:[];break;default:throw new ze('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break}default:throw new ze('Invalid or unsupported JWK "kty" (Key Type) Parameter value')}return{algorithm:r,keyUsages:n}}l(Rn,"subtleMapping");var kn=l(async t=>{if(!t.alg)throw new TypeError('"alg" argument is required when "jwk.alg" is not present');let{algorithm:r,keyUsages:n}=Rn(t),a=[r,t.ext??!1,t.key_ops??n],f={...t};return delete f.alg,delete f.use,ht.subtle.importKey("jwk",f,...a)},"parse"),yr=kn;var po=l(t=>st(t),"exportKeyValue"),_t,It,ho=l(t=>t?.[Symbol.toStringTag]==="KeyObject","isKeyObject"),wr=l(async(t,r,n,a,f=!1)=>{let u=t.get(r);if(u?.[a])return u[a];let h=await yr({...n,alg:a});return f&&Object.freeze(r),u?u[a]=h:t.set(r,{[a]:h}),h},"importAndCache"),Tn=l((t,r)=>{if(ho(t)){let n=t.export({format:"jwk"});return delete n.d,delete n.dp,delete n.dq,delete n.p,delete n.q,delete n.qi,n.k?po(n.k):(It||(It=new WeakMap),wr(It,t,n,r))}return dt(t)?t.k?st(t.k):(It||(It=new WeakMap),wr(It,t,t,r,!0)):t},"normalizePublicKey"),_n=l((t,r)=>{if(ho(t)){let n=t.export({format:"jwk"});return n.k?po(n.k):(_t||(_t=new WeakMap),wr(_t,t,n,r))}return dt(t)?t.k?st(t.k):(_t||(_t=new WeakMap),wr(_t,t,t,r,!0)):t},"normalizePrivateKey"),jr={normalizePublicKey:Tn,normalizePrivateKey:_n};async function mo(t,r){if(!rt(t))throw new TypeError("JWK must be an object");switch(r||(r=t.alg),t.kty){case"oct":if(typeof t.k!="string"||!t.k)throw new TypeError('missing "k" (Key Value) Parameter value');return st(t.k);case"RSA":if(t.oth!==void 0)throw new ze('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');case"EC":case"OKP":return yr({...t,alg:r});default:throw new ze('Unsupported "kty" (Key Type) Parameter value')}}l(mo,"importJWK");var Dt=l(t=>t?.[Symbol.toStringTag],"tag"),zr=l((t,r,n)=>{if(r.use!==void 0&&r.use!=="sig")throw new TypeError("Invalid key for this operation, when present its use must be sig");if(r.key_ops!==void 0&&r.key_ops.includes?.(n)!==!0)throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${n}`);if(r.alg!==void 0&&r.alg!==t)throw new TypeError(`Invalid key for this operation, when present its alg must be ${t}`);return!0},"jwkMatchesOp"),In=l((t,r,n,a)=>{if(!(r instanceof Uint8Array)){if(a&&dt(r)){if(uo(r)&&zr(t,r,n))return;throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present')}if(!Vr(r))throw new TypeError(Kr(t,r,...Tt,"Uint8Array",a?"JSON Web Key":null));if(r.type!=="secret")throw new TypeError(`${Dt(r)} instances for symmetric algorithms must be of type "secret"`)}},"symmetricTypeCheck"),Dn=l((t,r,n,a)=>{if(a&&dt(r))switch(n){case"sign":if(lo(r)&&zr(t,r,n))return;throw new TypeError("JSON Web Key for this operation be a private JWK");case"verify":if(fo(r)&&zr(t,r,n))return;throw new TypeError("JSON Web Key for this operation be a public JWK")}if(!Vr(r))throw new TypeError(Kr(t,r,...Tt,a?"JSON Web Key":null));if(r.type==="secret")throw new TypeError(`${Dt(r)} instances for asymmetric algorithms must not be of type "secret"`);if(n==="sign"&&r.type==="public")throw new TypeError(`${Dt(r)} instances for asymmetric algorithm signing must be of type "private"`);if(n==="decrypt"&&r.type==="public")throw new TypeError(`${Dt(r)} instances for asymmetric algorithm decryption must be of type "private"`);if(r.algorithm&&n==="verify"&&r.type==="private")throw new TypeError(`${Dt(r)} instances for asymmetric algorithm verifying must be of type "public"`);if(r.algorithm&&n==="encrypt"&&r.type==="private")throw new TypeError(`${Dt(r)} instances for asymmetric algorithm encryption must be of type "public"`)},"asymmetricTypeCheck");function xo(t,r,n,a){r.startsWith("HS")||r==="dir"||r.startsWith("PBES2")||/^A\d{3}(?:GCM)?KW$/.test(r)?In(r,n,a,t):Dn(r,n,a,t)}l(xo,"checkKeyType");var os=xo.bind(void 0,!1),Vt=xo.bind(void 0,!0);function $n(t,r,n,a,f){if(f.crit!==void 0&&a?.crit===void 0)throw new t('"crit" (Critical) Header Parameter MUST be integrity protected');if(!a||a.crit===void 0)return new Set;if(!Array.isArray(a.crit)||a.crit.length===0||a.crit.some(h=>typeof h!="string"||h.length===0))throw new t('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');let u;n!==void 0?u=new Map([...Object.entries(n),...r.entries()]):u=r;for(let h of a.crit){if(!u.has(h))throw new ze(`Extension Header Parameter "${h}" is not recognized`);if(f[h]===void 0)throw new t(`Extension Header Parameter "${h}" is missing`);if(u.get(h)&&a[h]===void 0)throw new t(`Extension Header Parameter "${h}" MUST be integrity protected`)}return new Set(a.crit)}l($n,"validateCrit");var vr=$n;var Bn=l((t,r)=>{if(r!==void 0&&(!Array.isArray(r)||r.some(n=>typeof n!="string")))throw new TypeError(`"${t}" option must be an array of strings`);if(r)return new Set(r)},"validateAlgorithms"),bo=Bn;function jt(t,r){let n=`SHA-${t.slice(-3)}`;switch(t){case"HS256":case"HS384":case"HS512":return{hash:n,name:"HMAC"};case"PS256":case"PS384":case"PS512":return{hash:n,name:"RSA-PSS",saltLength:t.slice(-3)>>3};case"RS256":case"RS384":case"RS512":return{hash:n,name:"RSASSA-PKCS1-v1_5"};case"ES256":case"ES384":case"ES512":return{hash:n,name:"ECDSA",namedCurve:r.namedCurve};case"EdDSA":return{name:r.name};default:throw new ze(`alg ${t} is not supported either by JOSE or your javascript runtime`)}}l(jt,"subtleDsa");async function zt(t,r,n){if(n==="sign"&&(r=await jr.normalizePrivateKey(r,t)),n==="verify"&&(r=await jr.normalizePublicKey(r,t)),sr(r))return io(r,t,n),r;if(r instanceof Uint8Array){if(!t.startsWith("HS"))throw new TypeError(Hr(r,...Tt));return ht.subtle.importKey("raw",r,{hash:`SHA-${t.slice(-3)}`,name:"HMAC"},!1,[n])}throw new TypeError(Hr(r,...Tt,"Uint8Array","JSON Web Key"))}l(zt,"getCryptoKey");var Nn=l(async(t,r,n,a)=>{let f=await zt(t,r,"verify");gr(t,f);let u=jt(t,f.algorithm);try{return await ht.subtle.verify(u,f,n,a)}catch{return!1}},"verify"),go=Nn;async function yo(t,r,n){if(!rt(t))throw new Ie("Flattened JWS must be an object");if(t.protected===void 0&&t.header===void 0)throw new Ie('Flattened JWS must have either of the "protected" or "header" members');if(t.protected!==void 0&&typeof t.protected!="string")throw new Ie("JWS Protected Header incorrect type");if(t.payload===void 0)throw new Ie("JWS Payload missing");if(typeof t.signature!="string")throw new Ie("JWS Signature missing or incorrect type");if(t.header!==void 0&&!rt(t.header))throw new Ie("JWS Unprotected Header incorrect type");let a={};if(t.protected)try{let V=st(t.protected);a=JSON.parse(ot.decode(V))}catch{throw new Ie("JWS Protected Header is invalid")}if(!br(a,t.header))throw new Ie("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let f={...a,...t.header},u=vr(Ie,new Map([["b64",!0]]),n?.crit,a,f),h=!0;if(u.has("b64")&&(h=a.b64,typeof h!="boolean"))throw new Ie('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:g}=f;if(typeof g!="string"||!g)throw new Ie('JWS "alg" (Algorithm) Header Parameter missing or invalid');let p=n&&bo("algorithms",n.algorithms);if(p&&!p.has(g))throw new Rt('"alg" (Algorithm) Header Parameter value not allowed');if(h){if(typeof t.payload!="string")throw new Ie("JWS Payload must be a string")}else if(typeof t.payload!="string"&&!(t.payload instanceof Uint8Array))throw new Ie("JWS Payload must be a string or an Uint8Array instance");let w=!1;typeof r=="function"?(r=await r(a,t),w=!0,Vt(g,r,"verify"),dt(r)&&(r=await mo(r,g))):Vt(g,r,"verify");let y=ir(Xe.encode(t.protected??""),Xe.encode("."),typeof t.payload=="string"?Xe.encode(t.payload):t.payload),E;try{E=st(t.signature)}catch{throw new Ie("Failed to base64url decode the signature")}if(!await go(g,r,E,y))throw new kt;let I;if(h)try{I=st(t.payload)}catch{throw new Ie("Failed to base64url decode the payload")}else typeof t.payload=="string"?I=Xe.encode(t.payload):I=t.payload;let L={payload:I};return t.protected!==void 0&&(L.protectedHeader=a),t.header!==void 0&&(L.unprotectedHeader=t.header),w?{...L,key:r}:L}l(yo,"flattenedVerify");async function wo(t,r,n){if(t instanceof Uint8Array&&(t=ot.decode(t)),typeof t!="string")throw new Ie("Compact JWS must be a string or Uint8Array");let{0:a,1:f,2:u,length:h}=t.split(".");if(h!==3)throw new Ie("Invalid Compact JWS");let g=await yo({payload:f,protected:a,signature:u},r,n),p={payload:g.payload,protectedHeader:g.protectedHeader};return typeof r=="function"?{...p,key:g.key}:p}l(wo,"compactVerify");var ct=l(t=>Math.floor(t.getTime()/1e3),"default");var Fn=/^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i,vt=l(t=>{let r=Fn.exec(t);if(!r||r[4]&&r[1])throw new TypeError("Invalid time period format");let n=parseFloat(r[2]),a=r[3].toLowerCase(),f;switch(a){case"sec":case"secs":case"second":case"seconds":case"s":f=Math.round(n);break;case"minute":case"minutes":case"min":case"mins":case"m":f=Math.round(n*60);break;case"hour":case"hours":case"hr":case"hrs":case"h":f=Math.round(n*3600);break;case"day":case"days":case"d":f=Math.round(n*86400);break;case"week":case"weeks":case"w":f=Math.round(n*604800);break;default:f=Math.round(n*31557600);break}return r[1]==="-"||r[4]==="ago"?-f:f},"default");var vo=l(t=>t.toLowerCase().replace(/^application\//,""),"normalizeTyp"),Un=l((t,r)=>typeof t=="string"?r.includes(t):Array.isArray(t)?r.some(Set.prototype.has.bind(new Set(t))):!1,"checkAudiencePresence"),So=l((t,r,n={})=>{let a;try{a=JSON.parse(ot.decode(r))}catch{}if(!rt(a))throw new it("JWT Claims Set must be a top-level JSON object");let{typ:f}=n;if(f&&(typeof t.typ!="string"||vo(t.typ)!==vo(f)))throw new Ge('unexpected "typ" JWT header value',a,"typ","check_failed");let{requiredClaims:u=[],issuer:h,subject:g,audience:p,maxTokenAge:w}=n,y=[...u];w!==void 0&&y.push("iat"),p!==void 0&&y.push("aud"),g!==void 0&&y.push("sub"),h!==void 0&&y.push("iss");for(let L of new Set(y.reverse()))if(!(L in a))throw new Ge(`missing required "${L}" claim`,a,L,"missing");if(h&&!(Array.isArray(h)?h:[h]).includes(a.iss))throw new Ge('unexpected "iss" claim value',a,"iss","check_failed");if(g&&a.sub!==g)throw new Ge('unexpected "sub" claim value',a,"sub","check_failed");if(p&&!Un(a.aud,typeof p=="string"?[p]:p))throw new Ge('unexpected "aud" claim value',a,"aud","check_failed");let E;switch(typeof n.clockTolerance){case"string":E=vt(n.clockTolerance);break;case"number":E=n.clockTolerance;break;case"undefined":E=0;break;default:throw new TypeError("Invalid clockTolerance option type")}let{currentDate:D}=n,I=ct(D||new Date);if((a.iat!==void 0||w)&&typeof a.iat!="number")throw new Ge('"iat" claim must be a number',a,"iat","invalid");if(a.nbf!==void 0){if(typeof a.nbf!="number")throw new Ge('"nbf" claim must be a number',a,"nbf","invalid");if(a.nbf>I+E)throw new Ge('"nbf" claim timestamp check failed',a,"nbf","check_failed")}if(a.exp!==void 0){if(typeof a.exp!="number")throw new Ge('"exp" claim must be a number',a,"exp","invalid");if(a.exp<=I-E)throw new wt('"exp" claim timestamp check failed',a,"exp","check_failed")}if(w){let L=I-a.iat,V=typeof w=="number"?w:vt(w);if(L-E>V)throw new wt('"iat" claim timestamp check failed (too far in the past)',a,"iat","check_failed");if(L<0-E)throw new Ge('"iat" claim timestamp check failed (it should be in the past)',a,"iat","check_failed")}return a},"default");async function Jr(t,r,n){let a=await wo(t,r,n);if(a.protectedHeader.crit?.includes("b64")&&a.protectedHeader.b64===!1)throw new it("JWTs MUST NOT use unencoded payload");let u={payload:So(a.protectedHeader,a.payload,n),protectedHeader:a.protectedHeader};return typeof r=="function"?{...u,key:a.key}:u}l(Jr,"jwtVerify");var Mn=l(async(t,r,n)=>{let a=await zt(t,r,"sign");gr(t,a);let f=await ht.subtle.sign(jt(t,a.algorithm),a,n);return new Uint8Array(f)},"sign"),Po=Mn;var Jt=class{constructor(r){if(!(r instanceof Uint8Array))throw new TypeError("payload must be an instance of Uint8Array");this._payload=r}setProtectedHeader(r){if(this._protectedHeader)throw new TypeError("setProtectedHeader can only be called once");return this._protectedHeader=r,this}setUnprotectedHeader(r){if(this._unprotectedHeader)throw new TypeError("setUnprotectedHeader can only be called once");return this._unprotectedHeader=r,this}async sign(r,n){if(!this._protectedHeader&&!this._unprotectedHeader)throw new Ie("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");if(!br(this._protectedHeader,this._unprotectedHeader))throw new Ie("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let a={...this._protectedHeader,...this._unprotectedHeader},f=vr(Ie,new Map([["b64",!0]]),n?.crit,this._protectedHeader,a),u=!0;if(f.has("b64")&&(u=this._protectedHeader.b64,typeof u!="boolean"))throw new Ie('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:h}=a;if(typeof h!="string"||!h)throw new Ie('JWS "alg" (Algorithm) Header Parameter missing or invalid');Vt(h,r,"sign");let g=this._payload;u&&(g=Xe.encode(cr(g)));let p;this._protectedHeader?p=Xe.encode(cr(JSON.stringify(this._protectedHeader))):p=Xe.encode("");let w=ir(p,Xe.encode("."),g),y=await Po(h,r,w),E={signature:cr(y),payload:""};return u&&(E.payload=ot.decode(g)),this._unprotectedHeader&&(E.header=this._unprotectedHeader),this._protectedHeader&&(E.protected=ot.decode(p)),E}};l(Jt,"FlattenedSign");var Gt=class{constructor(r){this._flattened=new Jt(r)}setProtectedHeader(r){return this._flattened.setProtectedHeader(r),this}async sign(r,n){let a=await this._flattened.sign(r,n);if(a.payload===void 0)throw new TypeError("use the flattened module for creating JWS with b64: false");return`${a.protected}.${a.payload}.${a.signature}`}};l(Gt,"CompactSign");function St(t,r){if(!Number.isFinite(r))throw new TypeError(`Invalid ${t} input`);return r}l(St,"validateInput");var Yt=class{constructor(r={}){if(!rt(r))throw new TypeError("JWT Claims Set MUST be an object");this._payload=r}setIssuer(r){return this._payload={...this._payload,iss:r},this}setSubject(r){return this._payload={...this._payload,sub:r},this}setAudience(r){return this._payload={...this._payload,aud:r},this}setJti(r){return this._payload={...this._payload,jti:r},this}setNotBefore(r){return typeof r=="number"?this._payload={...this._payload,nbf:St("setNotBefore",r)}:r instanceof Date?this._payload={...this._payload,nbf:St("setNotBefore",ct(r))}:this._payload={...this._payload,nbf:ct(new Date)+vt(r)},this}setExpirationTime(r){return typeof r=="number"?this._payload={...this._payload,exp:St("setExpirationTime",r)}:r instanceof Date?this._payload={...this._payload,exp:St("setExpirationTime",ct(r))}:this._payload={...this._payload,exp:ct(new Date)+vt(r)},this}setIssuedAt(r){return typeof r>"u"?this._payload={...this._payload,iat:ct(new Date)}:r instanceof Date?this._payload={...this._payload,iat:St("setIssuedAt",ct(r))}:typeof r=="string"?this._payload={...this._payload,iat:St("setIssuedAt",ct(new Date)+vt(r))}:this._payload={...this._payload,iat:St("setIssuedAt",r)},this}};l(Yt,"ProduceJWT");var $t=class extends Yt{setProtectedHeader(r){return this._protectedHeader=r,this}async sign(r,n){let a=new Gt(Xe.encode(JSON.stringify(this._payload)));if(a.setProtectedHeader(this._protectedHeader),Array.isArray(this._protectedHeader?.crit)&&this._protectedHeader.crit.includes("b64")&&this._protectedHeader.b64===!1)throw new it("JWTs MUST NOT use unencoded payload");return a.sign(r,n)}};l($t,"SignJWT");var Eo=Or(Yr());async function Co(){let t=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BPB Login</title>
    <style>
        :root {
            --color: black;
            --primary-color: #09639f;
            --header-color: #09639f; 
            --background-color: #fff;
            --form-background-color: #f9f9f9;
            --lable-text-color: #333;
            --h2-color: #3b3b3b;
            --border-color: #ddd;
            --input-background-color: white;
            --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: var(--background-color);
            position: relative;
            overflow: hidden;
        }
        body.dark-mode {
            --color: white;
            --primary-color: #09639F;
            --header-color: #3498DB; 
            --background-color: #121212;
            --form-background-color: #121212;
            --lable-text-color: #DFDFDF;
            --h2-color: #D5D5D5;
            --border-color: #353535;
            --input-background-color: #252525;
            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        
        h2 { text-align: center; color: var(--h2-color) }
        .form-container {
            background: var(--form-background-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .form-control { margin-bottom: 15px; display: flex; align-items: center; }
        label {
            display: block;
            margin-bottom: 5px;
            padding-right: 20px;
            font-size: 110%;
            font-weight: 600;
            color: var(--lable-text-color);
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            color: var(--lable-text-color);
            background-color: var(--input-background-color);
        }
        button {
            display: block;
            width: 100%;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            color: white;
            background-color: var(--primary-color);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .button:hover,
        button:focus {
            background-color: #2980b9;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        button.button:hover { color: white; }
        .button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
        @media only screen and (min-width: 768px) {
            .container { width: 30%; }
        }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>BPB Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
            <div class="form-container">
                <h2>User Login</h2>
                <form id="loginForm">
                    <div class="form-control">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>
                    <button type="submit" class="button">Login</button>
                </form>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
        document.getElementById('loginForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: password
                });
            
                if (!response.ok) {
                    passwordError.textContent = '\u26A0\uFE0F Wrong Password!';
                    const errorMessage = await response.text();
                    console.error('Login failed:', errorMessage);
                    return;
                }
                window.location.href = '/panel';
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    <\/script>
    </body>
    </html>`;return new Response(t,{status:200,headers:{"Content-Type":"text/html;charset=utf-8","Access-Control-Allow-Origin":globalThis.urlOrigin,"Access-Control-Allow-Methods":"GET, POST","Access-Control-Allow-Headers":"Content-Type, Authorization","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate, no-transform","CDN-Cache-Control":"no-store"}})}l(Co,"renderLoginPage");async function Ln(t,r){let n=await t.text(),a=await r.kv.get("pwd");if(n!==a)return new Response("Method Not Allowed",{status:405});let f=await r.kv.get("secretKey");f||(f=On(),await r.kv.put("secretKey",f));let u=new TextEncoder().encode(f),h=await new $t({userID:globalThis.userID}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("24h").sign(u);return new Response("Success",{status:200,headers:{"Set-Cookie":`jwtToken=${h}; HttpOnly; Secure; Max-Age=${7*24*60*60}; Path=/; SameSite=Strict`,"Content-Type":"text/plain"}})}l(Ln,"generateJWTToken");function On(){let t=Eo.default.randomBytes(32);return Array.from(t,r=>r.toString(16).padStart(2,"0")).join("")}l(On,"generateSecretKey");async function Bt(t,r){try{let n=await r.kv.get("secretKey"),a=new TextEncoder().encode(n),f=t.headers.get("Cookie")?.match(/(^|;\s*)jwtToken=([^;]*)/),u=f?f[2]:null;if(!u)return console.log("Unauthorized: Token not available!"),!1;let{payload:h}=await Jr(u,a);return console.log(`Successfully authenticated, User ID: ${h.userID}`),!0}catch(n){return console.log(n),!1}}l(Bt,"Authenticate");function Ao(){return new Response("Success",{status:200,headers:{"Set-Cookie":"jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT","Content-Type":"text/plain"}})}l(Ao,"logout");async function Ro(t,r){let n=await Bt(t,r),a=await r.kv.get("pwd");if(a&&!n)return new Response("Unauthorized!",{status:401});let f=await t.text();return f===a?new Response("Please enter a new Password!",{status:400}):(await r.kv.put("pwd",f),new Response("Success",{status:200,headers:{"Set-Cookie":"jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT","Content-Type":"text/plain"}}))}l(Ro,"resetPassword");async function ko(t,r){return await Bt(t,r)?Response.redirect(`${globalThis.urlOrigin}/panel`,302):t.method==="POST"?await Ln(t,r):await Co()}l(ko,"login");var Xr=Or(Yr());async function qr(t,r){let n=[],a="https://api.cloudflareclient.com/v0a4005/reg",{warpPlusLicense:f}=r,u=[To(),To()],h={install_id:"",fcm_token:"",tos:new Date().toISOString(),type:"Android",model:"PC",locale:"en_US",warp_enabled:!0},g=l(async y=>await(await fetch(a,{method:"POST",headers:{"User-Agent":"insomnia/8.6.1","Content-Type":"application/json"},body:JSON.stringify({...h,key:y.publicKey})})).json(),"fetchAccount"),p=l(async(y,E)=>{let D=await fetch(`${a}/${y.id}/account`,{method:"PUT",headers:{"User-Agent":"insomnia/8.6.1","Content-Type":"application/json",Authorization:`Bearer ${y.token}`},body:JSON.stringify({...h,key:E.publicKey,license:f})});return{status:D.status,data:await D.json()}},"updateAccount");for(let y of u){let E=await g(y);if(n.push({privateKey:y.privateKey,account:E}),f){let{status:D,data:I}=await p(E,y);if(D!==200&&!I.success)return{error:I.errors[0]?.message,configs:null}}}let w=JSON.stringify(n);return await t.kv.put("warpConfigs",w),{error:null,configs:w}}l(qr,"fetchWarpConfigs");var To=l(()=>{let t=l(u=>btoa(String.fromCharCode.apply(null,u)),"base64Encode"),r=Xr.default.randomBytes(32);r[0]&=248,r[31]&=127,r[31]|=64;let n=Xr.default.scalarMult.base(r),a=t(n),f=t(r);return{publicKey:a,privateKey:f}},"generateKeyPair");async function qe(t,r){let n,a;try{n=await r.kv.get("proxySettings",{type:"json"}),a=await r.kv.get("warpConfigs",{type:"json"})}catch(f){throw console.log(f),new Error(`An error occurred while getting KV - ${f}`)}if(!n){n=await Pr(t,r);let{error:f,configs:u}=await qr(r,n);if(f)throw new Error(`An error occurred while getting Warp configs - ${f}`);a=u}return globalThis.panelVersion!==n.panelVersion&&(n=await Pr(t,r)),{proxySettings:n,warpConfigs:a}}l(qe,"getDataset");async function Pr(t,r){let n=t.method==="POST"?await t.formData():null,a=n?.get("resetSettings")==="true",f;if(a)n=null;else try{f=await r.kv.get("proxySettings",{type:"json"})}catch(g){throw console.log(g),new Error(`An error occurred while getting current KV settings - ${g}`)}let u=l(g=>{let p=n?.get(g);return p===void 0?null:p==="true"?!0:p==="false"?!1:p},"validateField"),h={remoteDNS:u("remoteDNS")??f?.remoteDNS??"https://8.8.8.8/dns-query",localDNS:u("localDNS")??f?.localDNS??"8.8.8.8",VLTRFakeDNS:u("VLTRFakeDNS")??f?.VLTRFakeDNS??!1,proxyIP:u("proxyIP")?.replaceAll(" ","")??f?.proxyIP??"",outProxy:u("outProxy")??f?.outProxy??"",outProxyParams:Wn(u("outProxy"))??f?.outProxyParams??{},cleanIPs:u("cleanIPs")?.replaceAll(" ","")??f?.cleanIPs??"",enableIPv6:u("enableIPv6")??f?.enableIPv6??!0,customCdnAddrs:u("customCdnAddrs")?.replaceAll(" ","")??f?.customCdnAddrs??"",customCdnHost:u("customCdnHost")?.trim()??f?.customCdnHost??"",customCdnSni:u("customCdnSni")?.trim()??f?.customCdnSni??"",bestVLTRInterval:u("bestVLTRInterval")??f?.bestVLTRInterval??"30",VLConfigs:u("VLConfigs")??f?.VLConfigs??!0,TRConfigs:u("TRConfigs")??f?.TRConfigs??!1,ports:u("ports")?.split(",")??f?.ports??["443"],lengthMin:u("fragmentLengthMin")??f?.lengthMin??"100",lengthMax:u("fragmentLengthMax")??f?.lengthMax??"200",intervalMin:u("fragmentIntervalMin")??f?.intervalMin??"1",intervalMax:u("fragmentIntervalMax")??f?.intervalMax??"1",fragmentPackets:u("fragmentPackets")??f?.fragmentPackets??"tlshello",bypassLAN:u("bypass-lan")??f?.bypassLAN??!1,bypassIran:u("bypass-iran")??f?.bypassIran??!1,bypassChina:u("bypass-china")??f?.bypassChina??!1,bypassRussia:u("bypass-russia")??f?.bypassRussia??!1,blockAds:u("block-ads")??f?.blockAds??!1,blockPorn:u("block-porn")??f?.blockPorn??!1,blockUDP443:u("block-udp-443")??f?.blockUDP443??!1,customBypassRules:u("customBypassRules")?.replaceAll(" ","")??f?.customBypassRules??"",customBlockRules:u("customBlockRules")?.replaceAll(" ","")??f?.customBlockRules??"",warpEndpoints:u("warpEndpoints")?.replaceAll(" ","")??f?.warpEndpoints??"engage.cloudflareclient.com:2408",warpFakeDNS:u("warpFakeDNS")??f?.warpFakeDNS??!1,warpEnableIPv6:u("warpEnableIPv6")??f?.warpEnableIPv6??!0,warpPlusLicense:u("warpPlusLicense")??f?.warpPlusLicense??"",bestWarpInterval:u("bestWarpInterval")??f?.bestWarpInterval??"30",hiddifyNoiseMode:u("hiddifyNoiseMode")??f?.hiddifyNoiseMode??"m4",nikaNGNoiseMode:u("nikaNGNoiseMode")??f?.nikaNGNoiseMode??"quic",noiseCountMin:u("noiseCountMin")??f?.noiseCountMin??"10",noiseCountMax:u("noiseCountMax")??f?.noiseCountMax??"15",noiseSizeMin:u("noiseSizeMin")??f?.noiseSizeMin??"5",noiseSizeMax:u("noiseSizeMax")??f?.noiseSizeMax??"10",noiseDelayMin:u("noiseDelayMin")??f?.noiseDelayMin??"1",noiseDelayMax:u("noiseDelayMax")??f?.noiseDelayMax??"1",panelVersion:globalThis.panelVersion};try{await r.kv.put("proxySettings",JSON.stringify(h)),a&&await Zr(t,r)}catch(g){throw console.log(g),new Error(`An error occurred while updating KV - ${g}`)}return h}l(Pr,"updateDataset");function Wn(t){let r={};if(!t)return{};let n=new URL(t),a=n.protocol.slice(0,-1);if(a==="vless"){let f=new URLSearchParams(n.search);r={protocol:a,uuid:n.username,server:n.hostname,port:n.port},f.forEach((u,h)=>{r[h]=u})}else r={protocol:a,user:n.username,pass:n.password,server:n.host,port:n.port};return JSON.stringify(r)}l(Wn,"extractChainProxyParams");async function Zr(t,r){if(!await Bt(t,r))return new Response("Unauthorized",{status:401});if(t.method==="POST")try{let{proxySettings:a}=await qe(t,r),{error:f}=await qr(r,a);return f?new Response(f,{status:400}):new Response("Warp configs updated successfully",{status:200})}catch(a){return console.log(a),new Response(`An error occurred while updating Warp configs! - ${a}`,{status:500})}else return new Response("Unsupported request",{status:405})}l(Zr,"updateWarpConfigs");async function _o(t,r){let{remoteDNS:n,localDNS:a,VLTRFakeDNS:f,proxyIP:u,outProxy:h,cleanIPs:g,enableIPv6:p,customCdnAddrs:w,customCdnHost:y,customCdnSni:E,bestVLTRInterval:D,VLConfigs:I,TRConfigs:L,ports:V,lengthMin:U,lengthMax:j,intervalMin:O,intervalMax:F,fragmentPackets:z,warpEndpoints:J,warpFakeDNS:m,warpEnableIPv6:R,warpPlusLicense:$,bestWarpInterval:C,hiddifyNoiseMode:B,nikaNGNoiseMode:A,noiseCountMin:K,noiseCountMax:P,noiseSizeMin:G,noiseSizeMax:H,noiseDelayMin:ie,noiseDelayMax:ne,bypassLAN:Se,bypassIran:ae,bypassChina:he,bypassRussia:we,blockAds:Ce,blockPorn:$e,blockUDP443:ue,customBypassRules:Me,customBlockRules:qt}=t,Zt=!!$,Ct=(I?1:0)+(L?1:0),pt="",Mt="";[...globalThis.hostName.includes("workers.dev")?globalThis.defaultHttpPorts:[],...globalThis.defaultHttpsPorts].forEach(He=>{let Qe=`port-${He}`,et=V.includes(He)?"checked":"",at=`
            <div class="routing" style="grid-template-columns: 1fr 2fr; margin-right: 10px;">
                <input type="checkbox" id=${Qe} name=${He} onchange="handlePortChange(event)" value="true" ${et}>
                <label style="margin-bottom: 3px;" for=${Qe}>${He}</label>
            </div>`;globalThis.defaultHttpsPorts.includes(He)?Mt+=at:pt+=at});let Je=l(He=>He.map(Qe=>`
        <div>
            <span class="material-symbols-outlined symbol">verified</span>
            <span>${Qe}</span>
        </div>`).join(""),"supportedApps"),Ze=l((He,Qe,et,at,Qt)=>`
            <button onclick="openQR('${`${Qt?"sing-box://import-remote-profile?url=":""}https://${globalThis.hostName}/${He}/${globalThis.subPath}${Qe?`?app=${Qe}`:""}#${et}`}', '${at}')" style="margin-bottom: 8px;">
                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
            </button>`,"subQR"),Ye=l((He,Qe,et)=>`
            <button onclick="copyToClipboard('${`https://${globalThis.hostName}/${He}/${globalThis.subPath}${Qe?`?app=${Qe}`:""}#${et}`}')">
                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
            </button>`,"subURL"),Tr=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="timestamp" content=${Date.now()}>
        <title>BPB Panel ${globalThis.panelVersion}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <title>Collapsible Sections</title>
        <style>
            :root {
                --color: black;
                --primary-color: #09639f;
                --secondary-color: #3498db;
                --header-color: #09639f; 
                --background-color: #fff;
                --form-background-color: #f9f9f9;
                --table-active-color: #f2f2f2;
                --hr-text-color: #3b3b3b;
                --lable-text-color: #333;
                --border-color: #ddd;
                --button-color: #09639f;
                --input-background-color: white;
                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            }
            body { font-family: Twemoji Country Flags, system-ui; background-color: var(--background-color); color: var(--color) }
            body.dark-mode {
                --color: white;
                --primary-color: #09639F;
                --secondary-color: #3498DB;
                --header-color: #3498DB; 
                --background-color: #121212;
                --form-background-color: #121212;
                --table-active-color: #252525;
                --hr-text-color: #D5D5D5;
                --lable-text-color: #DFDFDF;
                --border-color: #353535;
                --button-color: #3498DB;
                --input-background-color: #252525;
                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
            }
            .material-symbols-outlined {
                margin-left: 5px;
                font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24
            }
            details { border-bottom: 1px solid var(--border-color); }
            summary {
                font-weight: bold;
                cursor: pointer;
                text-align: center;
                text-wrap: nowrap;
            }
            summary::marker { font-size: 1.5rem; color: var(--secondary-color); }
            summary h2 { display: inline-flex; }
            h1 { font-size: 2.5em; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }
            h2,h3 { margin: 30px 0; text-align: center; color: var(--hr-text-color); }
            hr { border: 1px solid var(--border-color); margin: 20px 0; }
            .footer {
                display: flex;
                font-weight: 600;
                margin: 10px auto 0 auto;
                justify-content: center;
                align-items: center;
            }
            .footer button {margin: 0 20px; background: #212121; max-width: fit-content;}
            .footer button:hover, .footer button:focus { background: #3b3b3b;}
            .form-control a, a.link { text-decoration: none; }
            .form-control {
                margin-bottom: 20px;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
            }
            .form-control button {
                background-color: var(--form-background-color);
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--button-color);
                border-color: var(--primary-color);
                border: 1px solid;
            }
            #apply {display: block; margin-top: 20px;}
            input.button {font-weight: 600; padding: 15px 0; font-size: 1.1rem;}
            label {
                display: block;
                margin-bottom: 5px;
                font-size: 110%;
                font-weight: 600;
                color: var(--lable-text-color);
            }
            input[type="text"],
            input[type="number"],
            input[type="url"],
            textarea,
            select {
                width: 100%;
                text-align: center;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 16px;
                color: var(--lable-text-color);
                background-color: var(--input-background-color);
                box-sizing: border-box;
                transition: border-color 0.3s ease;
            }	
            input[type="text"]:focus,
            input[type="number"]:focus,
            input[type="url"]:focus,
            textarea:focus,
            select:focus { border-color: var(--secondary-color); outline: none; }
            .button,
            table button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                white-space: nowrap;
                padding: 10px 15px;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 1px;
                border: none;
                border-radius: 5px;
                color: white;
                background-color: var(--primary-color);
                cursor: pointer;
                outline: none;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            input[type="checkbox"] { 
                background-color: var(--input-background-color);
                style="margin: 0; 
                grid-column: 2;"
            }
            table button { margin: auto; width: auto; }
            .button.disabled {
                background-color: #ccc;
                cursor: not-allowed;
                box-shadow: none;
                pointer-events: none;
            }
            .button:hover,
            table button:hover,
            table button:focus {
                background-color: #2980b9;
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
                transform: translateY(-2px);
            }
            .header-container button:hover {
                transform: scale(1.1);
            }
            button.button:hover { color: white; }
            .button:active,
            table button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
            .form-container {
                max-width: 90%;
                margin: 0 auto;
                padding: 20px;
                background: var(--form-background-color);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin-bottom: 100px;
            }
            .table-container { margin-top: 20px; overflow-x: auto; }
            table { 
                width: 100%;
                border: 1px solid var(--border-color);
                border-collapse: separate;
                border-spacing: 0; 
                border-radius: 10px;
                margin-bottom: 20px;
                overflow: hidden;
            }
            th, td { padding: 10px; border-bottom: 1px solid var(--border-color); }
            td div { display: flex; align-items: center; }
            th { background-color: var(--secondary-color); color: white; font-weight: bold; font-size: 1.1rem; width: 50%;}
            td:last-child { background-color: var(--table-active-color); }               
            tr:hover { background-color: var(--table-active-color); }
            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.4);
            }
            .modal-content {
                background-color: var(--form-background-color);
                margin: auto;
                padding: 10px 20px 20px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                width: 80%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .close { color: var(--color); float: right; font-size: 28px; font-weight: bold; }
            .close:hover,
            .close:focus { color: black; text-decoration: none; cursor: pointer; }
            .form-control label {
                display: block;
                margin-bottom: 8px;
                font-size: 110%;
                font-weight: 600;
                color: var(--lable-text-color);
                line-height: 1.3em;
            }
            .form-control input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 16px;
                color: var(--lable-text-color);
                background-color: var(--input-background-color);
                box-sizing: border-box;
                margin-bottom: 15px;
                transition: border-color 0.3s ease;
            }
            .routing { 
                display: grid;
                justify-content: flex-start;
                grid-template-columns: 1fr 1fr 10fr 1fr;
                margin-bottom: 15px;
            }
            .form-control .routing input { grid-column: 2 / 3; }
            #routing-rules.form-control { display: grid; grid-template-columns: 1fr 1fr; }
            .routing label {
                text-align: left;
                margin: 0 0 0 10px;
                font-weight: 400;
                font-size: 100%;
                text-wrap: nowrap;
            }
            .form-control input[type="password"]:focus { border-color: var(--secondary-color); outline: none; }
            #passwordError { color: red; margin-bottom: 10px; }
            .symbol { margin-right: 8px; }
            .modalQR {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.4);
            }
            .floating-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background-color: var(--color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s, transform 0.3s;
            }
            .floating-button:hover { transform: scale(1.1); }
            .min-max { display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline; width: 100%; }
            .min-max span { text-align: center; white-space: pre; }
            .input-with-select { width: 100%; }
            body.dark-mode .floating-button { background-color: var(--color); }
            body.dark-mode .floating-button:hover { transform: scale(1.1); }
            #ips th { background-color: var(--hr-text-color); color: var(--background-color); width: unset; }
            #ips td { background-color: unset; }
            #ips td:first-child { background-color: var(--table-active-color); }
            .header-container { display: flex; align-items: center; justify-content: center; }
            @media only screen and (min-width: 768px) {
                .form-container { max-width: 70%; }
                .form-control { 
                    margin-bottom: 15px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: baseline;
                    justify-content: flex-end;
                    font-family: Arial, sans-serif;
                }
                #apply { display: block; margin: 20px auto 0 auto; max-width: 50%; }
                .modal-content { width: 30% }
                .routing { display: grid; grid-template-columns: 4fr 1fr 3fr 4fr; }
            }
        </style>
    </head>
    <body>
        <h1>BPB Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
        <div class="form-container">
            <form id="configForm">
                <details open>
                    <summary><h2>VLESS - TROJAN \u2699\uFE0F</h2></summary>
                    <div class="form-control">
                        <label for="remoteDNS">\u{1F30F} Remote DNS</label>
                        <input type="url" id="remoteDNS" name="remoteDNS" value="${n}" required>
                    </div>
                    <div class="form-control">
                        <label for="localDNS">\u{1F3DA}\uFE0F Local DNS</label>
                        <input type="text" id="localDNS" name="localDNS" value="${a}"
                            pattern="^(?:\\d{1,3}\\.){3}\\d{1,3}$"
                            title="Please enter a valid DNS IP Address!"  required>
                    </div>
                    <div class="form-control">
                        <label for="VLTRFakeDNS">\u{1F9E2} Fake DNS</label>
                        <div class="input-with-select">
                            <select id="VLTRFakeDNS" name="VLTRFakeDNS">
                                <option value="true" ${f?"selected":""}>Enabled</option>
                                <option value="false" ${f?"":"selected"}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="proxyIP">\u{1F4CD} Proxy IPs / Domains</label>
                        <input type="text" id="proxyIP" name="proxyIP" value="${u.replaceAll(","," , ")}">
                    </div>
                    <div class="form-control">
                        <label for="outProxy">\u2708\uFE0F Chain Proxy</label>
                        <input type="text" id="outProxy" name="outProxy" value="${h}">
                    </div>
                    <div class="form-control">
                        <label for="cleanIPs">\u2728 Clean IPs / Domains</label>
                        <input type="text" id="cleanIPs" name="cleanIPs" value="${g.replaceAll(","," , ")}">
                    </div>
                    <div class="form-control">
                        <label for="scanner">\u{1F50E} Clean IP Scanner</label>
                        <a href="https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/releases/tag/v2.2.5" name="scanner" target="_blank" style="width: 100%;">
                            <button type="button" id="scanner" class="button">
                                Download Scanner
                                <span class="material-symbols-outlined">open_in_new</span>
                            </button>
                        </a>
                    </div>
                    <div class="form-control">
                        <label for="enableIPv6">\u{1F51B} IPv6</label>
                        <div class="input-with-select">
                            <select id="enableIPv6" name="enableIPv6">
                                <option value="true" ${p?"selected":""}>Enabled</option>
                                <option value="false" ${p?"":"selected"}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="customCdnAddrs">\u{1F480} Custom CDN Addrs</label>
                        <input type="text" id="customCdnAddrs" name="customCdnAddrs" value="${w.replaceAll(","," , ")}">
                    </div>
                    <div class="form-control">
                        <label for="customCdnHost">\u{1F480} Custom CDN Host</label> 
                        <input type="text" id="customCdnHost" name="customCdnHost" value="${y}">
                    </div>
                    <div class="form-control">
                        <label for="customCdnSni">\u{1F480} Custom CDN SNI</label>
                        <input type="text" id="customCdnSni" name="customCdnSni" value="${E}">
                    </div>
                    <div class="form-control">
                        <label for="bestVLTRInterval">\u{1F504} Best Interval</label>
                        <input type="number" id="bestVLTRInterval" name="bestVLTRInterval" min="10" max="90" value="${D}">
                    </div>
                    <div class="form-control" style="padding-top: 10px;">
                        <label for="VLConfigs">\u2699\uFE0F Protocols</label>
                        <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; align-items: baseline; margin-top: 10px;">
                            <div style = "display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" id="VLConfigs" name="VLConfigs" onchange="handleProtocolChange(event)" value="true" ${I?"checked":""}>
                                <label for="VLConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">VLESS</label>
                            </div>
                            <div style = "display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" id="TRConfigs" name="TRConfigs" onchange="handleProtocolChange(event)" value="true" ${L?"checked":""}>
                                <label for="TRConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">Trojan</label>
                            </div>
                        </div>
                    </div>
                    <div class="table-container">
                        <table id="ports-block">
                            <tr>
                                <th style="text-wrap: nowrap; background-color: gray;">Config type</th>
                                <th style="text-wrap: nowrap; background-color: gray;">Ports</th>
                            </tr>
                            <tr>
                                <td style="text-align: center; font-size: larger;"><b>TLS</b></td>
                                <td>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${Mt}</div>
                                </td>    
                            </tr>
                            ${pt?`<tr>
                                <td style="text-align: center; font-size: larger;"><b>Non TLS</b></td>
                                <td>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${pt}</div>
                                </td>    
                            </tr>`:""}        
                        </table>
                    </div>
                </details>
                <details>
                    <summary><h2>FRAGMENT \u2699\uFE0F</h2></summary>	
                    <div class="form-control">
                        <label for="fragmentLengthMin">\u{1F4D0} Length</label>
                        <div class="min-max">
                            <input type="number" id="fragmentLengthMin" name="fragmentLengthMin" value="${U}" min="10" required>
                            <span> - </span>
                            <input type="number" id="fragmentLengthMax" name="fragmentLengthMax" value="${j}" max="500" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="fragmentIntervalMin">\u{1F55E} Interval</label>
                        <div class="min-max">
                            <input type="number" id="fragmentIntervalMin" name="fragmentIntervalMin"
                                value="${O}" min="1" max="30" required>
                            <span> - </span>
                            <input type="number" id="fragmentIntervalMax" name="fragmentIntervalMax"
                                value="${F}" min="1" max="30" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="fragmentPackets">\u{1F4E6} Packets</label>
                        <div class="input-with-select">
                            <select id="fragmentPackets" name="fragmentPackets">
                                <option value="tlshello" ${z==="tlshello"?"selected":""}>tlshello</option>
                                <option value="1-1" ${z==="1-1"?"selected":""}>1-1</option>
                                <option value="1-2" ${z==="1-2"?"selected":""}>1-2</option>
                                <option value="1-3" ${z==="1-3"?"selected":""}>1-3</option>
                                <option value="1-5" ${z==="1-5"?"selected":""}>1-5</option>
                            </select>
                        </div>
                    </div>
                </details>
                <details>
                    <summary><h2>WARP GENERAL \u2699\uFE0F</h2></summary>
                    <div class="form-control">
                        <label for="warpEndpoints">\u2728 Endpoints</label>
                        <input type="text" id="warpEndpoints" name="warpEndpoints" value="${J.replaceAll(","," , ")}" required>
                    </div>
                    <div class="form-control">
                        <label for="endpointScanner" style="line-height: 1.5;">\u{1F50E} Scan Endpoint</label>
                        <button type="button" id="endpointScanner" class="button" style="padding: 10px 0;" onclick="copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/bia-pain-bache/warp-script/refs/heads/main/endip/install.sh)', false)">
                            Copy Script<span class="material-symbols-outlined">terminal</span>
                        </button>
                    </div>
                    <div class="form-control">
                        <label for="warpFakeDNS">\u{1F9E2} Fake DNS</label>
                        <div class="input-with-select">
                            <select id="warpFakeDNS" name="warpFakeDNS">
                                <option value="true" ${m?"selected":""}>Enabled</option>
                                <option value="false" ${m?"":"selected"}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="warpEnableIPv6">\u{1F51B} IPv6</label>
                        <div class="input-with-select">
                            <select id="warpEnableIPv6" name="warpEnableIPv6">
                                <option value="true" ${R?"selected":""}>Enabled</option>
                                <option value="false" ${R?"":"selected"}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="warpPlusLicense">\u2795 Warp+ License</label>
                        <input type="text" id="warpPlusLicense" name="warpPlusLicense" value="${$}" 
                            pattern="^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{8}-[a-zA-Z0-9]{8}$" 
                            title="Please enter a valid Warp Plus license in xxxxxxxx-xxxxxxxx-xxxxxxxx format">
                    </div>
                    <div class="form-control">
                        <label for="refreshBtn">\u267B\uFE0F Warp Configs</label>
                        <button id="refreshBtn" type="button" class="button" style="padding: 10px 0;" onclick="getWarpConfigs()">
                            Update<span class="material-symbols-outlined">autorenew</span>
                        </button>
                    </div>
                    <div class="form-control">
                        <label for="bestWarpInterval">\u{1F504} Best Interval</label>
                        <input type="number" id="bestWarpInterval" name="bestWarpInterval" min="10" max="90" value="${C}">
                    </div>
                </details>
                <details>
                    <summary><h2>WARP PRO \u2699\uFE0F</h2></summary>
                    <div class="form-control">
                        <label for="hiddifyNoiseMode">\u{1F635}\u200D\u{1F4AB} Hiddify Mode</label>
                        <input type="text" id="hiddifyNoiseMode" name="hiddifyNoiseMode" 
                            pattern="^(m[1-6]|h_[0-9A-Fa-f]{2}|g_([0-9A-Fa-f]{2}_){2}[0-9A-Fa-f]{2})$" 
                            title="Enter 'm1-m6', 'h_HEX', 'g_HEX_HEX_HEX' which HEX can be between 00 to ff"
                            value="${B}" required>
                    </div>
                    <div class="form-control">
                        <label for="nikaNGNoiseMode">\u{1F635}\u200D\u{1F4AB} NikaNG Mode</label>
                        <input type="text" id="nikaNGNoiseMode" name="nikaNGNoiseMode" 
                            pattern="^(none|quic|random|[0-9A-Fa-f]+)$" 
                            title="Enter 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'"
                            value="${A}" required>
                    </div>
                    <div class="form-control">
                        <label for="noiseCountMin">\u{1F39A}\uFE0F Noise Count</label>
                        <div class="min-max">
                            <input type="number" id="noiseCountMin" name="noiseCountMin"
                                value="${K}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseCountMax" name="noiseCountMax"
                                value="${P}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="noiseSizeMin">\u{1F4CF} Noise Size</label>
                        <div class="min-max">
                            <input type="number" id="noiseSizeMin" name="noiseSizeMin"
                                value="${G}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseSizeMax" name="noiseSizeMax"
                                value="${H}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="noiseDelayMin">\u{1F55E} Noise Delay</label>
                        <div class="min-max">
                            <input type="number" id="noiseDelayMin" name="noiseDelayMin"
                                value="${ie}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseDelayMax" name="noiseDelayMax"
                                value="${ne}" min="1" required>
                        </div>
                    </div>
                </details>
                <details>
                    <summary><h2>ROUTING RULES \u2699\uFE0F</h2></summary>
                    <div id="routing-rules" class="form-control" style="margin-bottom: 20px;">			
                        <div class="routing">
                            <input type="checkbox" id="bypass-lan" name="bypass-lan" value="true" ${Se?"checked":""}>
                            <label for="bypass-lan">Bypass LAN</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-ads" name="block-ads" value="true" ${Ce?"checked":""}>
                            <label for="block-ads">Block Ads.</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-iran" name="bypass-iran" value="true" ${ae?"checked":""}>
                            <label for="bypass-iran">Bypass Iran</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-porn" name="block-porn" value="true" ${$e?"checked":""}>
                            <label for="block-porn">Block Porn</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-china" name="bypass-china" value="true" ${he?"checked":""}>
                            <label for="bypass-china">Bypass China</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-udp-443" name="block-udp-443" value="true" ${ue?"checked":""}>
                            <label for="block-udp-443">Block QUIC</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-russia" name="bypass-russia" value="true" ${we?"checked":""}>
                            <label for="bypass-russia">Bypass Russia</label>
                        </div>
                    </div>
                    <h3>CUSTOM RULES \u{1F527}</h3>
                    <div class="form-control">
                        <label for="customBypassRules">\u{1F7E9} Bypass IPs / Domains</label>
                        <input type="text" id="customBypassRules" name="customBypassRules" value="${Me.replaceAll(","," , ")}">
                    </div>
                    <div class="form-control">
                        <label for="customBlockRules">\u{1F7E5} Block IPs / Domains</label>
                        <input type="text" id="customBlockRules" name="customBlockRules" value="${qt.replaceAll(","," , ")}">
                    </div>
                </details>
                <div id="apply" class="form-control">
                    <div style="grid-column: 2; width: 100%; display: inline-flex;">
                        <input type="submit" id="applyButton" style="margin-right: 10px;" class="button disabled" value="APPLY SETTINGS \u{1F4A5}" form="configForm">
                        <button type="button" id="resetSettings" style="background: none; margin: 0; border: none; cursor: pointer;">
                            <i class="fa fa-refresh fa-2x fa-border" style="border-radius: .2em; border-color: var(--border-color);" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </form>
            <hr>            
            <h2>\u{1F517} NORMAL SUB</h2>
            <div class="table-container">
                <table id="normal-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["v2rayNG","NikaNG","MahsaNG","v2rayN","v2rayN-PRO","Shadowrocket","Streisand","Hiddify","Nekoray (Xray)"])}
                        </td>
                        <td>
                            ${Ze("sub","","BPB-Normal","Normal Subscription")}
                            ${Ye("sub","","BPB-Normal")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["husi","Nekobox","Nekoray (sing-Box)","Karing"])}
                        </td>
                        <td>
                            ${Ye("sub","singbox","BPB-Normal")}
                        </td>
                    </tr>
                </table>
            </div>
            <h2>\u{1F517} FULL NORMAL SUB</h2>
            <div class="table-container">
                <table id="full-normal-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["v2rayNG","NikaNG","MahsaNG","v2rayN","v2rayN-PRO","Streisand"])}
                        </td>
                        <td>
                            ${Ze("sub","xray","BPB-Full-Normal","Full normal Subscription")}
                            ${Ye("sub","xray","BPB-Full-Normal")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["sing-box","v2rayN (sing-box)"])}
                        </td>
                        <td>
                            ${Ze("sub","sfa","BPB-Full-Normal","Full normal Subscription",!0)}
                            ${Ye("sub","sfa","BPB-Full-Normal")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["Clash Meta","Clash Verge","FlClash","Stash","v2rayN (mihomo)"])}
                        </td>
                        <td>
                            ${Ze("sub","clash","BPB-Full-Normal","Full normal Subscription")}
                            ${Ye("sub","clash","BPB-Full-Normal")}
                        </td>
                    </tr>
                </table>
            </div>
            <h2>\u{1F517} FRAGMENT SUB</h2>
            <div class="table-container">
                <table id="frag-sub-table">
                    <tr>
                        <th style="text-wrap: nowrap;">Application</th>
                        <th style="text-wrap: nowrap;">Subscription</th>
                    </tr>
                    <tr>
                        <td style="text-wrap: nowrap;">
                            ${Je(["v2rayNG","NikaNG","MahsaNG","v2rayN","v2rayN-PRO","Streisand"])}
                        </td>
                        <td>
                            ${Ze("fragsub","","BPB-Fragment","Fragment Subscription")}
                            ${Ye("fragsub","","BPB-Fragment")}
                        </td>
                    </tr>
                    <tr>
                        <td style="text-wrap: nowrap;">
                            ${Je(["Hiddify"])}
                        </td>
                        <td>
                            ${Ze("fragsub","hiddify","BPB-Fragment","Fragment Subscription")}
                            ${Ye("fragsub","hiddify","BPB-Fragment")}
                        </td>
                    </tr>
                </table>
            </div>
            <h2>\u{1F517} WARP SUB</h2>
            <div class="table-container">
                <table id="normal-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["v2rayNG","v2rayN","Streisand"])}
                        </td>
                        <td>
                            ${Ze("warpsub","xray","BPB-Warp","Warp Subscription")}
                            ${Ye("warpsub","xray","BPB-Warp")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["Hiddify","sing-box","v2rayN (sing-box)"])}
                        </td>
                        <td>
                            ${Ze("sub","singbox","BPB-Warp","Warp Subscription",!0)}
                            ${Ye("warpsub","singbox","BPB-Warp")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["Clash Meta","Clash Verge","FlClash","Stash","v2rayN (mihomo)"])}
                        </td>
                        <td>
                            ${Ze("warpsub","clash","BPB-Warp","Warp Subscription")}
                            ${Ye("warpsub","clash","BPB-Warp")}
                        </td>
                    </tr>
                </table>
            </div>
            <h2>\u{1F517} WARP PRO SUB</h2>
            <div class="table-container">
                <table id="warp-pro-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["NikaNG","MahsaNG","v2rayN-PRO"])}
                        </td>
                        <td>
                            ${Ze("warpsub","nikang","BPB-Warp-Pro","Warp Pro Subscription")}
                            ${Ye("warpsub","nikang","BPB-Warp-Pro")}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Je(["Hiddify"])}
                        </td>
                        <td>
                            ${Ze("warpsub","hiddify","BPB-Warp-Pro","Warp Pro Subscription",!0)}
                            ${Ye("warpsub","hiddify","BPB-Warp-Pro")}
                        </td>
                    </tr>
                </table>
            </div>
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <form id="passwordChangeForm">
                        <h2>Change Password</h2>
                        <div class="form-control">
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" required>
                            </div>
                        <div class="form-control">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required>
                        </div>
                        <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>
                        <button id="changePasswordBtn" type="submit" class="button">Change Password</button>
                    </form>
                </div>
            </div>
            <div id="myQRModal" class="modalQR">
                <div class="modal-content" style="width: auto; text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
                        <span id="closeQRModal" class="close" style="align-self: flex-end;">&times;</span>
                        <span id="qrcodeTitle" style="align-self: center; font-weight: bold;"></span>
                    </div>
                    <div id="qrcode-container"></div>
                </div>
            </div>
            <hr>
            <div class="header-container">
                <h2 style="margin: 0 5px;">\u{1F4A1} MY IP</h2>
                <button type="button" id="refresh-geo-location" onclick="fetchIPInfo()" style="background: none; margin: 0; border: none; cursor: pointer;">
                    <i class="fa fa-refresh fa-2x" style="color: var(--button-color);" aria-hidden="true"></i>
                </button>       
            </div>
            <div class="table-container">
                <table id="ips" style="text-align: center; margin-bottom: 15px; text-wrap-mode: nowrap;">
                    <tr>
                        <th>Target Address</th>
                        <th>IP</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>ISP</th>
                    </tr>
                    <tr>
                        <td>Cloudflare CDN</td>
                        <td id="cf-ip"></td>
                        <td><b id="cf-country"></b></td>
                        <td><b id="cf-city"></b></td>
                        <td><b id="cf-isp"></b></td>
                    </tr>
                    <tr>
                        <td>Others</td>
                        <td id="ip"></td>
                        <td><b id="country"></b></td>
                        <td><b id="city"></b></td>
                        <td><b id="isp"></b></td>
                    </tr>
                </table>
            </div>
            <hr>
            <div class="footer">
                <i class="fa fa-github" style="font-size:36px; margin-right: 10px;"></i>
                <a class="link" href="https://github.com/bia-pain-bache/BPB-Worker-Panel" style="color: var(--color); text-decoration: underline;" target="_blank">Github</a>
                <button id="openModalBtn" class="button">Change Password</button>
                <button type="button" id="logout" style="background: none; color: var(--color); margin: 0; border: none; cursor: pointer;">
                    <i class="fa fa-power-off fa-2x" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <button id="darkModeToggle" class="floating-button">
            <i id="modeIcon" class="fa fa-2x fa-adjust" style="color: var(--background-color);" aria-hidden="true"></i>
        </button>
    <script type="module" defer>
        import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
        polyfillCountryFlagEmojis();
    <\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
    <script>
        const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
        let activePortsNo = ${V.length};
        let activeHttpsPortsNo = ${V.filter(He=>globalThis.defaultHttpsPorts.includes(He)).length};
        let activeProtocols = ${Ct};
        const warpPlusLicense = '${$}';
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');

        document.addEventListener('DOMContentLoaded', async () => {
            const configForm = document.getElementById('configForm');            
            const changePass = document.getElementById('openModalBtn');
            const closeBtn = document.querySelector(".close");
            const passwordChangeForm = document.getElementById('passwordChangeForm');                    
            const initialFormData = new FormData(configForm);
            const modal = document.getElementById('myModal');
            const closeQR = document.getElementById('closeQRModal');
            const resetSettings = document.getElementById('resetSettings');
            let modalQR = document.getElementById('myQRModal');
            let qrcodeContainer = document.getElementById('qrcode-container');
            let forcedPassChange = false;
            const darkModeToggle = document.getElementById('darkModeToggle');
                    
            const hasFormDataChanged = () => {
                const currentFormData = new FormData(configForm);
                const currentFormDataEntries = [...currentFormData.entries()];

                const nonCheckboxFieldsChanged = currentFormDataEntries.some(
                    ([key, value]) => !initialFormData.has(key) || initialFormData.get(key) !== value
                );

                const checkboxFieldsChanged = Array.from(configForm.elements)
                    .filter((element) => element.type === 'checkbox')
                    .some((checkbox) => {
                    const initialValue = initialFormData.has(checkbox.name)
                        ? initialFormData.get(checkbox.name)
                        : false;
                    const currentValue = currentFormDataEntries.find(([key]) => key === checkbox.name)?.[1] || false;
                    return initialValue !== currentValue;
                });

                return nonCheckboxFieldsChanged || checkboxFieldsChanged;
            };
            
            const enableApplyButton = () => {
                const isChanged = hasFormDataChanged();
                applyButton.disabled = !isChanged;
                applyButton.classList.toggle('disabled', !isChanged);
            };
                        
            passwordChangeForm.addEventListener('submit', event => resetPassword(event));
            document.getElementById('logout').addEventListener('click', event => logout(event));
            configForm.addEventListener('submit', (event) => applySettings(event, configForm));
            configForm.addEventListener('input', enableApplyButton);
            configForm.addEventListener('change', enableApplyButton);
            changePass.addEventListener('click', () => {
                forcedPassChange ? closeBtn.style.display = 'none' : closeBtn.style.display = '';
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
                forcedPassChange = false;
            });        
            closeBtn.addEventListener('click', () => {
                modal.style.display = "none";
                document.body.style.overflow = "";
            });
            closeQR.addEventListener('click', () => {
                modalQR.style.display = "none";
                qrcodeContainer.lastElementChild.remove();
            });
            resetSettings.addEventListener('click', async () => {
                const confirmReset = confirm('\u26A0\uFE0F This will reset all panel settings.\\nAre you sure?');
                if(!confirmReset) return;
                const formData = new FormData();
                formData.append('resetSettings', 'true');
                try {
                    document.body.style.cursor = 'wait';
                    const refreshButtonVal = refreshBtn.innerHTML;
                    refreshBtn.innerHTML = '\u231B Loading...';

                    const response = await fetch('/panel', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    });

                    document.body.style.cursor = 'default';
                    refreshBtn.innerHTML = refreshButtonVal;
                    if (!response.ok) {
                        const errorMessage = await response.text();
                        console.error(errorMessage, response.status);
                        alert('\u26A0\uFE0F An error occured, Please try again!\\n\u26D4 ' + errorMessage);
                        return;
                    }       
                    alert('\u2705 Panel settings reset to default successfully! \u{1F60E}');
                    window.location.reload(true);
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            window.onclick = (event) => {
                if (event.target == modalQR) {
                    modalQR.style.display = "none";
                    qrcodeContainer.lastElementChild.remove();
                }
            }
            darkModeToggle.addEventListener('click', () => {
                const isDarkMode = document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            });

            const isPassSet = ${r};
            if (!isPassSet) {
                forcedPassChange = true;
                changePass.click();
            }

            await fetchIPInfo();
        });

        const fetchIPInfo = async () => {
            const updateUI = (ip = '-', country = '-', countryCode = '-', city = '-', isp = '-', cfIP) => {
                const flag = countryCode !== '-' ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';
                document.getElementById(cfIP ? 'cf-ip' : 'ip').textContent = ip;
                document.getElementById(cfIP ? 'cf-country' : 'country').textContent = country + ' ' + flag;
                document.getElementById(cfIP ? 'cf-city' : 'city').textContent = city;
                document.getElementById(cfIP ? 'cf-isp' : 'isp').textContent = isp;
            };

            const refreshIcon = document.getElementById("refresh-geo-location").querySelector('i');
            refreshIcon.classList.add('fa-spin');
            document.body.style.cursor = 'wait';

            try {
                const ipResponse = await fetch('https://ipwho.is/' + '?nocache=' + Date.now(), { cache: "no-store" });
                const ipResponseObj = await ipResponse.json();
                const geoResponse = await fetch('/my-ip', { 
                    method: 'POST',
                    body: ipResponseObj.ip
                });
                const ipGeoLocation = await geoResponse.json();
                updateUI(ipResponseObj.ip, ipGeoLocation.country, ipGeoLocation.countryCode, ipGeoLocation.city, ipGeoLocation.isp);
                const cfIPresponse = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });
                const cfIP = await cfIPresponse.text();
                const cfGeoResponse = await fetch('/my-ip', { 
                    method: 'POST',
                    body: cfIP.trim()
                });
                const cfIPGeoLocation = await cfGeoResponse.json();
                updateUI(cfIP, cfIPGeoLocation.country, cfIPGeoLocation.countryCode, cfIPGeoLocation.city, cfIPGeoLocation.isp, true);
                refreshIcon.classList.remove('fa-spin');
                document.body.style.cursor = 'default';
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        }

        const getWarpConfigs = async () => {
            const license = document.getElementById('warpPlusLicense').value;
            if (license !== warpPlusLicense) {
                alert('\u26A0\uFE0F First APPLY SETTINGS and then update Warp configs!');
                return false;
            }
            const confirmReset = confirm('\u26A0\uFE0F Are you sure?');
            if(!confirmReset) return;
            const refreshBtn = document.getElementById('refreshBtn');

            try {
                document.body.style.cursor = 'wait';
                const refreshButtonVal = refreshBtn.innerHTML;
                refreshBtn.innerHTML = '\u231B Loading...';

                const response = await fetch('/update-warp', {
                    method: 'POST',
                    credentials: 'include'
                });

                document.body.style.cursor = 'default';
                refreshBtn.innerHTML = refreshButtonVal;
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error(errorMessage, response.status);
                    alert('\u26A0\uFE0F An error occured, Please try again!\\n\u26D4 ' + errorMessage);
                    return;
                }          
                ${Zt?"alert('\u2705 Warp configs upgraded to PLUS successfully! \u{1F60E}');":"alert('\u2705 Warp configs updated successfully! \u{1F60E}');"}
            } catch (error) {
                console.error('Error:', error);
            } 
        }

        const handlePortChange = (event) => {
            
            if(event.target.checked) { 
                activePortsNo++ 
                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo++;
            } else {
                activePortsNo--;
                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo--;
            }

            if (activePortsNo === 0) {
                event.preventDefault();
                event.target.checked = !event.target.checked;
                alert("\u26D4 At least one port should be selected! \u{1FAE4}");
                activePortsNo = 1;
                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo++;
                return false;
            }
                
            if (activeHttpsPortsNo === 0) {
                event.preventDefault();
                event.target.checked = !event.target.checked;
                alert("\u26D4 At least one TLS(https) port should be selected! \u{1FAE4}");
                activeHttpsPortsNo = 1;
                return false;
            }
        }
        
        const handleProtocolChange = (event) => {
            
            if(event.target.checked) { 
                activeProtocols++ 
            } else {
                activeProtocols--;
            }

            if (activeProtocols === 0) {
                event.preventDefault();
                event.target.checked = !event.target.checked;
                alert("\u26D4 At least one Protocol should be selected! \u{1FAE4}");
                activeProtocols = 1;
                return false;
            }
        }

        const openQR = (url, title) => {
            let qrcodeContainer = document.getElementById("qrcode-container");
            let qrcodeTitle = document.getElementById("qrcodeTitle");
            const modalQR = document.getElementById("myQRModal");
            qrcodeTitle.textContent = title;
            modalQR.style.display = "block";
            let qrcodeDiv = document.createElement("div");
            qrcodeDiv.className = "qrcode";
            qrcodeDiv.style.padding = "2px";
            qrcodeDiv.style.backgroundColor = "#ffffff";
            new QRCode(qrcodeDiv, {
                text: url,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            qrcodeContainer.appendChild(qrcodeDiv);
        }

        const copyToClipboard = (text) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('\u{1F4CB} Copied to clipboard:\\n\\n' +  text);
        }

        const applySettings = async (event, configForm) => {
            event.preventDefault();
            event.stopPropagation();
            const applyButton = document.getElementById('applyButton');
            const getValue = (id) => parseInt(document.getElementById(id).value, 10);              
            const lengthMin = getValue('fragmentLengthMin');
            const lengthMax = getValue('fragmentLengthMax');
            const intervalMin = getValue('fragmentIntervalMin');
            const intervalMax = getValue('fragmentIntervalMax');
            const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split(',').filter(addr => addr !== '');
            const customCdnHost = document.getElementById('customCdnHost').value;
            const customCdnSni = document.getElementById('customCdnSni').value;
            const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';
            const warpEndpoints = document.getElementById('warpEndpoints').value?.replaceAll(' ', '').split(',');
            const noiseCountMin = getValue('noiseCountMin');
            const noiseCountMax = getValue('noiseCountMax');
            const noiseSizeMin = getValue('noiseSizeMin');
            const noiseSizeMax = getValue('noiseSizeMax');
            const noiseDelayMin = getValue('noiseDelayMin');
            const noiseDelayMax = getValue('noiseDelayMax');
            const cleanIPs = document.getElementById('cleanIPs').value?.split(',');
            const proxyIPs = document.getElementById('proxyIP').value?.split(',');
            const chainProxy = document.getElementById('outProxy').value?.trim();
            const customBypassRules = document.getElementById('customBypassRules').value?.split(',');                    
            const customBlockRules = document.getElementById('customBlockRules').value?.split(',');                    
            const formData = new FormData(configForm);
            const isVless = /vless:\\/\\/[^s@]+@[^\\s:]+:[^\\s]+/.test(chainProxy);
            const isSocksHttp = /^(http|socks):\\/\\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\\d+)$/.test(chainProxy);
            const hasSecurity = /security=/.test(chainProxy);
            const securityRegex = /security=(tls|none|reality)/;
            const validSecurityType = securityRegex.test(chainProxy);
            let match = chainProxy.match(securityRegex);
            const securityType = match ? match[1] : null;
            match = chainProxy.match(/:(\\d+)\\?/);
            const vlessPort = match ? match[1] : null;
            const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);
            const validIPDomain = /^((?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,})|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?:\\/(?:\\d|[12]\\d|3[0-2]))?|\\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\\](?:\\/(?:12[0-8]|1[0-1]\\d|[0-9]?\\d))?)$/i;
            const validEndpoint = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[::(?::[a-fA-F0-9]{1,4}){0,7}\\]):(?:[0-9]{1,5})$/;
            const checkedPorts = Array.from(document.querySelectorAll('input[id^="port-"]:checked')).map(input => input.id.split('-')[1]);
            formData.append('ports', checkedPorts);
            configForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                !formData.has(checkbox.name) && formData.append(checkbox.name, 'false');    
            });

            const invalidIPs = [...cleanIPs, ...proxyIPs, ...customCdnAddrs, ...customBypassRules, ...customBlockRules, customCdnHost, customCdnSni]?.filter(value => {
                if (value) {
                    const trimmedValue = value.trim();
                    return !validIPDomain.test(trimmedValue);
                }
            });

            const invalidEndpoints = warpEndpoints?.filter(value => {
                if (value) {
                    const trimmedValue = value.trim();
                    return !validEndpoint.test(trimmedValue);
                }
            });

            if (invalidIPs.length) {
                alert('\u26D4 Invalid IPs or Domains \u{1FAE4}\\n\\n' + invalidIPs.map(ip => '\u26A0\uFE0F ' + ip).join('\\n'));
                return false;
            }
            
            if (invalidEndpoints.length) {
                alert('\u26D4 Invalid endpoint \u{1FAE4}\\n\\n' + invalidEndpoints.map(endpoint => '\u26A0\uFE0F ' + endpoint).join('\\n'));
                return false;
            }

            if (lengthMin >= lengthMax || intervalMin > intervalMax || noiseCountMin > noiseCountMax || noiseSizeMin > noiseSizeMax || noiseDelayMin > noiseDelayMax) {
                alert('\u26D4 Minimum should be smaller or equal to Maximum! \u{1FAE4}');               
                return false;
            }

            if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
                alert('\u26D4 Invalid Config! \u{1FAE4} \\n - The chain proxy should be VLESS, Socks or Http!\\n - VLESS transmission should be GRPC,WS or TCP\\n - VLESS security should be TLS,Reality or None\\n - socks or http should be like:\\n + (socks or http)://user:pass@host:port\\n + (socks or http)://host:port');               
                return false;
            }

            if (isVless && securityType === 'tls' && vlessPort !== '443') {
                alert('\u26D4 VLESS TLS port can be only 443 to be used as a proxy chain! \u{1FAE4}');               
                return false;
            }

            if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
                alert('\u26D4 All "Custom" fields should be filled or deleted together! \u{1FAE4}');               
                return false;
            }

            try {
                document.body.style.cursor = 'wait';
                const applyButtonVal = applyButton.value;
                applyButton.value = '\u231B Loading...';

                const response = await fetch('/panel', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                document.body.style.cursor = 'default';
                applyButton.value = applyButtonVal;

                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error(errorMessage, response.status);
                    alert('\u26A0\uFE0F Session expired! Please login again.');
                    window.location.href = '/login';
                    return;
                }                
                alert('\u2705 Parameters applied successfully \u{1F60E}');
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const logout = async (event) => {
            event.preventDefault();

            try {
                const response = await fetch('/logout', {
                    method: 'GET',
                    credentials: 'same-origin'
                });
            
                if (!response.ok) {
                    console.error('Failed to log out:', response.status);
                    return;
                }
                window.location.href = '/login';
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const resetPassword = async (event) => {
            event.preventDefault();
            const modal = document.getElementById('myModal');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const passwordError = document.getElementById('passwordError');             
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                passwordError.textContent = "Passwords do not match";
                return false;
            }

            const hasCapitalLetter = /[A-Z]/.test(newPassword);
            const hasNumber = /[0-9]/.test(newPassword);
            const isLongEnough = newPassword.length >= 8;

            if (!(hasCapitalLetter && hasNumber && isLongEnough)) {
                passwordError.textContent = '\u26A0\uFE0F Password must contain at least one capital letter, one number, and be at least 8 characters long.';
                return false;
            }
                    
            try {
                const response = await fetch('/panel/password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: newPassword,
                    credentials: 'same-origin'
                });
            
                if (response.ok) {
                    modal.style.display = "none";
                    document.body.style.overflow = "";
                    alert("\u2705 Password changed successfully! \u{1F44D}");
                    window.location.href = '/login';
                } else if (response.status === 401) {
                    const errorMessage = await response.text();
                    passwordError.textContent = '\u26A0\uFE0F ' + errorMessage;
                    console.error(errorMessage, response.status);
                    alert('\u26A0\uFE0F Session expired! Please login again.');
                    window.location.href = '/login';
                } else {
                    const errorMessage = await response.text();
                    passwordError.textContent = '\u26A0\uFE0F ' + errorMessage;
                    console.error(errorMessage, response.status);
                    return false;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    <\/script>
    </body>	
    </html>`;return new Response(Tr,{status:200,headers:{"Content-Type":"text/html;charset=utf-8","Access-Control-Allow-Origin":globalThis.urlOrigin,"Access-Control-Allow-Methods":"GET, POST","Access-Control-Allow-Headers":"Content-Type, Authorization","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate, no-transform","CDN-Cache-Control":"no-store"}})}l(_o,"renderHomePage");function Cr(t){return/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)}l(Cr,"isValidUUID");async function Xt(t){let r="https://cloudflare-dns.com/dns-query",n=`${r}?name=${encodeURIComponent(t)}&type=A`,a=`${r}?name=${encodeURIComponent(t)}&type=AAAA`;try{let[f,u]=await Promise.all([fetch(n,{headers:{accept:"application/dns-json"}}),fetch(a,{headers:{accept:"application/dns-json"}})]),h=await f.json(),g=await u.json(),p=h.Answer?h.Answer.map(y=>y.data):[],w=g.Answer?g.Answer.map(y=>y.data):[];return{ipv4:p,ipv6:w}}catch(f){throw console.error("Error resolving DNS:",f),new Error(`An error occurred while resolving DNS - ${f}`)}}l(Xt,"resolveDNS");function De(t){return/^(?!\-)(?:[A-Za-z0-9\-]{1,63}\.)+[A-Za-z]{2,}$/.test(t)}l(De,"isDomain");async function Io(t,r){let n=await Bt(t,r);if(t.method==="POST")return n?(await Pr(t,r),new Response("Success",{status:200})):new Response("Unauthorized or expired session!",{status:401});let{proxySettings:a}=await qe(t,r),f=await r.kv.get("pwd");if(f&&!n)return Response.redirect(`${globalThis.urlOrigin}/login`,302);let u=f?.length>=8;return await _o(a,u)}l(Io,"handlePanel");async function Do(t){let r=new URL(t.url);return r.hostname=globalThis.fallbackDomain,r.protocol="https:",t=new Request(r,t),await fetch(t)}l(Do,"fallback");async function $o(t){let r=await t.text();try{let a=await(await fetch(`http://ip-api.com/json/${r}?nocache=${Date.now()}`)).json();return new Response(JSON.stringify(a),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8"}})}catch(n){console.error("Error fetching IP address:",n)}}l($o,"getMyIP");function Bo(t,r){let n=r.PROXYIP?.split(",").map(u=>u.trim()),a=new URL(t.url),f=new URLSearchParams(a.search);if(globalThis.panelVersion="3.0.3",globalThis.defaultHttpPorts=["80","8080","2052","2082","2086","2095","8880"],globalThis.defaultHttpsPorts=["443","8443","2053","2083","2087","2096"],globalThis.userID=r.UUID,globalThis.TRPassword=r.TR_PASS,globalThis.proxyIP=n?n[Math.floor(Math.random()*n.length)]:"bpb.yousef.isegaro.com",globalThis.hostName=t.headers.get("Host"),globalThis.pathName=a.pathname,globalThis.client=f.get("app"),globalThis.urlOrigin=a.origin,globalThis.dohURL=r.DOH_URL||"https://cloudflare-dns.com/dns-query",globalThis.fallbackDomain=r.FALLBACK||"speed.cloudflare.com",globalThis.subPath=r.SUB_PATH||userID,pathName!=="/secrets"){if(!userID||!globalThis.TRPassword)throw new Error(`Please set UUID and Trojan password first. Please visit <a href="https://${hostName}/secrets" target="_blank">here</a> to generate them.`,{cause:"init"});if(userID&&!Cr(userID))throw new Error(`Invalid UUID: ${userID}`,{cause:"init"});if(typeof r.kv!="object")throw new Error("KV Dataset is not properly set! Please refer to tutorials.",{cause:"init"})}}l(Bo,"initializeParams");import{connect as Hn}from"cloudflare:sockets";async function Uo(t){let r=new WebSocketPair,[n,a]=Object.values(r);a.accept();let f="",u="",h=l((D,I)=>{console.log(`[${f}:${u}] ${D}`,I||"")},"log"),g=t.headers.get("sec-websocket-protocol")||"",p=Vn(a,g,h),w={value:null},y=null,E=!1;return p.pipeTo(new WritableStream({async write(D,I){if(E&&y)return y(D);if(w.value){let R=w.value.writable.getWriter();await R.write(D),R.releaseLock();return}let{hasError:L,message:V,portRemote:U=443,addressRemote:j="",rawDataIndex:O,VLVersion:F=new Uint8Array([0,0]),isUDP:z}=await jn(D,globalThis.userID);if(f=j,u=`${U}--${Math.random()} ${z?"udp ":"tcp "} `,L)throw new Error(V);if(z)if(U===53)E=!0;else throw new Error("UDP proxy only enable for DNS which is port 53");let J=new Uint8Array([F[0],0]),m=D.slice(O);if(E){let{write:R}=await Xn(a,J,h);y=R,y(m);return}Kn(w,j,U,m,a,J,h)},close(){h("readableWebSocketStream is close")},abort(D){h("readableWebSocketStream is abort",JSON.stringify(D))}})).catch(D=>{h("readableWebSocketStream pipeTo error",D)}),new Response(null,{status:101,webSocket:n})}l(Uo,"VLOverWSHandler");async function No(t){try{let r=await getApiResponse();return r?r.users.some(a=>a.uuid===t):!1}catch(r){return console.error("Error:",r),!1}}l(No,"checkUuidInApiResponse");async function Kn(t,r,n,a,f,u,h){async function g(y,E){/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(y)&&(y=`${atob("d3d3Lg==")}${y}${atob("LnNzbGlwLmlv")}`);let D=Hn({hostname:y,port:E});t.value=D,h(`connected to ${y}:${E}`);let I=D.writable.getWriter();return await I.write(a),I.releaseLock(),D}l(g,"connectAndWrite");async function p(){let y=globalThis.pathName.split("/")[2],E=y?atob(y).split(","):void 0,D=E?E[Math.floor(Math.random()*E.length)]:globalThis.proxyIP||r,I=await g(D,n);I.closed.catch(L=>{console.log("retry tcpSocket closed error",L)}).finally(()=>{Er(f)}),Fo(I,f,u,null,h)}l(p,"retry");let w=await g(r,n);Fo(w,f,u,p,h)}l(Kn,"handleTCPOutBound");function Vn(t,r,n){let a=!1;return new ReadableStream({start(u){t.addEventListener("message",p=>{if(a)return;let w=p.data;u.enqueue(w)}),t.addEventListener("close",()=>{Er(t),!a&&u.close()}),t.addEventListener("error",p=>{n("webSocketServer has error"),u.error(p)});let{earlyData:h,error:g}=zn(r);g?u.error(g):h&&u.enqueue(h)},pull(u){},cancel(u){a||(n(`ReadableStream was canceled, due to ${u}`),a=!0,Er(t))}})}l(Vn,"makeReadableWebSocketStream");async function jn(t,r){if(t.byteLength<24)return{hasError:!0,message:"invalid data"};let n=new Uint8Array(t.slice(0,1)),a=!1,f=!1,u=new Uint8Array(t.slice(1,17)),h=Yn(u),g=r.includes(",")?r.split(","):[r],p=await No(h);if(a=g.some(z=>p||h===z.trim()),console.log(`checkUuidInApi: ${await No(h)}, userID: ${h}`),!a)return{hasError:!0,message:"invalid user"};let w=new Uint8Array(t.slice(17,18))[0],y=new Uint8Array(t.slice(18+w,18+w+1))[0];if(y!==1)if(y===2)f=!0;else return{hasError:!0,message:`command ${y} is not support, command 01-tcp,02-udp,03-mux`};let E=18+w+1,D=t.slice(E,E+2),I=new DataView(D).getUint16(0),L=E+2,U=new Uint8Array(t.slice(L,L+1))[0],j=0,O=L+1,F="";switch(U){case 1:j=4,F=new Uint8Array(t.slice(O,O+j)).join(".");break;case 2:j=new Uint8Array(t.slice(O,O+1))[0],O+=1,F=new TextDecoder().decode(t.slice(O,O+j));break;case 3:j=16;let z=new DataView(t.slice(O,O+j)),J=[];for(let m=0;m<8;m++)J.push(z.getUint16(m*2).toString(16));F=J.join(":");break;default:return{hasError:!0,message:`invild  addressType is ${U}`}}return F?{hasError:!1,addressRemote:F,addressType:U,portRemote:I,rawDataIndex:O+j,VLVersion:n,isUDP:f}:{hasError:!0,message:`addressValue is empty, addressType is ${U}`}}l(jn,"processVLHeader");async function Fo(t,r,n,a,f){let u=0,h=[],g=n,p=!1;await t.readable.pipeTo(new WritableStream({start(){},async write(w,y){p=!0,r.readyState!==Qr&&y.error("webSocket.readyState is not open, maybe close"),g?(r.send(await new Blob([g,w]).arrayBuffer()),g=null):r.send(w)},close(){f(`remoteConnection!.readable is close with hasIncomingData is ${p}`)},abort(w){console.error("remoteConnection!.readable abort",w)}})).catch(w=>{console.error("vlessRemoteSocketToWS has exception ",w.stack||w),Er(r)}),p===!1&&a&&(f("retry"),a())}l(Fo,"VLRemoteSocketToWS");function zn(t){if(!t)return{earlyData:null,error:null};try{t=t.replace(/-/g,"+").replace(/_/g,"/");let r=atob(t);return{earlyData:Uint8Array.from(r,a=>a.charCodeAt(0)).buffer,error:null}}catch(r){return{earlyData:null,error:r}}}l(zn,"base64ToArrayBuffer");var Qr=1,Jn=2;function Er(t){try{(t.readyState===Qr||t.readyState===Jn)&&t.close()}catch(r){console.error("safeCloseWebSocket error",r)}}l(Er,"safeCloseWebSocket");var We=[];for(let t=0;t<256;++t)We.push((t+256).toString(16).slice(1));function Gn(t,r=0){return(We[t[r+0]]+We[t[r+1]]+We[t[r+2]]+We[t[r+3]]+"-"+We[t[r+4]]+We[t[r+5]]+"-"+We[t[r+6]]+We[t[r+7]]+"-"+We[t[r+8]]+We[t[r+9]]+"-"+We[t[r+10]]+We[t[r+11]]+We[t[r+12]]+We[t[r+13]]+We[t[r+14]]+We[t[r+15]]).toLowerCase()}l(Gn,"unsafeStringify");function Yn(t,r=0){let n=Gn(t,r);if(!Cr(n))throw TypeError("Stringified UUID is invalid");return n}l(Yn,"stringify");async function Xn(t,r,n){let a=!1,f=new TransformStream({start(h){},transform(h,g){for(let p=0;p<h.byteLength;){let w=h.slice(p,p+2),y=new DataView(w).getUint16(0),E=new Uint8Array(h.slice(p+2,p+2+y));p=p+2+y,g.enqueue(E)}},flush(h){}});f.readable.pipeTo(new WritableStream({async write(h){let p=await(await fetch(globalThis.dohURL,{method:"POST",headers:{"content-type":"application/dns-message"},body:h})).arrayBuffer(),w=p.byteLength,y=new Uint8Array([w>>8&255,w&255]);t.readyState===Qr&&(n(`doh success and dns message length is ${w}`),a?t.send(await new Blob([y,p]).arrayBuffer()):(t.send(await new Blob([r,y,p]).arrayBuffer()),a=!0))}})).catch(h=>{n("dns udp has error"+h)});let u=f.writable.getWriter();return{write(h){u.write(h)}}}l(Xn,"handleUDPOutBound");var Wo=Or(Lo());import{connect as qn}from"cloudflare:sockets";async function Ho(t){let r=new WebSocketPair,[n,a]=Object.values(r);a.accept();let f="",u="",h=l((E,D)=>{console.log(`[${f}:${u}] ${E}`,D||"")},"log"),g=t.headers.get("sec-websocket-protocol")||"",p=ea(a,g,h),w={value:null},y=null;return p.pipeTo(new WritableStream({async write(E,D){if(y)return y(E);if(w.value){let O=w.value.writable.getWriter();await O.write(E),O.releaseLock();return}let{hasError:I,message:L,portRemote:V=443,addressRemote:U="",rawClientData:j}=await Zn(E);if(f=U,u=`${V}--${Math.random()} tcp`,I)throw new Error(L);Qn(w,U,V,j,a,h)},close(){h("readableWebSocketStream is closed")},abort(E){h("readableWebSocketStream is aborted",JSON.stringify(E))}})).catch(E=>{h("readableWebSocketStream pipeTo error",E)}),new Response(null,{status:101,webSocket:n})}l(Ho,"TROverWSHandler");async function Zn(t){if(t.byteLength<56)return{hasError:!0,message:"invalid data"};let r=56;if(new Uint8Array(t.slice(56,57))[0]!==13||new Uint8Array(t.slice(57,58))[0]!==10)return{hasError:!0,message:"invalid header format (missing CR LF)"};if(new TextDecoder().decode(t.slice(0,r))!==Wo.default.sha224(globalThis.TRPassword))return{hasError:!0,message:"invalid password"};let a=t.slice(r+2);if(a.byteLength<6)return{hasError:!0,message:"invalid SOCKS5 request data"};let f=new DataView(a);if(f.getUint8(0)!==1)return{hasError:!0,message:"unsupported command, only TCP (CONNECT) is allowed"};let h=f.getUint8(1),g=0,p=2,w="";switch(h){case 1:g=4,w=new Uint8Array(a.slice(p,p+g)).join(".");break;case 3:g=new Uint8Array(a.slice(p,p+1))[0],p+=1,w=new TextDecoder().decode(a.slice(p,p+g));break;case 4:g=16;let I=new DataView(a.slice(p,p+g)),L=[];for(let V=0;V<8;V++)L.push(I.getUint16(V*2).toString(16));w=L.join(":");break;default:return{hasError:!0,message:`invalid addressType is ${h}`}}if(!w)return{hasError:!0,message:`address is empty, addressType is ${h}`};let y=p+g,E=a.slice(y,y+2),D=new DataView(E).getUint16(0);return{hasError:!1,addressRemote:w,portRemote:D,rawClientData:a.slice(y+4)}}l(Zn,"parseTRHeader");async function Qn(t,r,n,a,f,u){async function h(w,y){/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(w)&&(w=`${atob("d3d3Lg==")}${w}${atob("LnNzbGlwLmlv")}`);let E=qn({hostname:w,port:y});t.value=E,u(`connected to ${w}:${y}`);let D=E.writable.getWriter();return await D.write(a),D.releaseLock(),E}l(h,"connectAndWrite");async function g(){let w=globalThis.pathName.split("/")[2],y=w?atob(w).split(","):void 0,E=y?y[Math.floor(Math.random()*y.length)]:globalThis.proxyIP||r,D=await h(E,n);D.closed.catch(I=>{console.log("retry tcpSocket closed error",I)}).finally(()=>{Rr(f)}),Oo(D,f,null,u)}l(g,"retry");let p=await h(r,n);Oo(p,f,g,u)}l(Qn,"handleTCPOutBound");function ea(t,r,n){let a=!1;return new ReadableStream({start(u){t.addEventListener("message",p=>{if(a)return;let w=p.data;u.enqueue(w)}),t.addEventListener("close",()=>{Rr(t),!a&&u.close()}),t.addEventListener("error",p=>{n("webSocketServer has error"),u.error(p)});let{earlyData:h,error:g}=ta(r);g?u.error(g):h&&u.enqueue(h)},pull(u){},cancel(u){a||(n(`ReadableStream was canceled, due to ${u}`),a=!0,Rr(t))}})}l(ea,"makeReadableWebSocketStream");async function Oo(t,r,n,a){let f=!1;await t.readable.pipeTo(new WritableStream({start(){},async write(u,h){f=!0,r.readyState!==Ko&&h.error("webSocket connection is not open"),r.send(u)},close(){a(`remoteSocket.readable is closed, hasIncomingData: ${f}`)},abort(u){console.error("remoteSocket.readable abort",u)}})).catch(u=>{console.error("trojanRemoteSocketToWS error:",u.stack||u),Rr(r)}),f===!1&&n&&(a("retry"),n())}l(Oo,"TRRemoteSocketToWS");function ta(t){if(!t)return{earlyData:null,error:null};try{t=t.replace(/-/g,"+").replace(/_/g,"/");let r=atob(t);return{earlyData:Uint8Array.from(r,a=>a.charCodeAt(0)).buffer,error:null}}catch(r){return{earlyData:null,error:r}}}l(ta,"base64ToArrayBuffer");var Ko=1,ra=2;function Rr(t){try{(t.readyState===Ko||t.readyState===ra)&&t.close()}catch(r){console.error("safeCloseWebSocket error",r)}}l(Rr,"safeCloseWebSocket");async function Vo(t){let r=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BPB Error</title>
        <style>
            :root {
                --color: black;
                --header-color: #09639f; 
                --background-color: #fff;
                --border-color: #ddd;
                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            }
            body, html {
                height: 100%;
                width: 100%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: system-ui;
                color: var(--color);
                background-color: var(--background-color);
            }
            body.dark-mode {
                --color: white;
                --header-color: #3498DB; 
                --background-color: #121212;
                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);          
            }
            h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }
            #error-container { text-align: center; }
        </style>
    </head>
    <body>
        <div id="error-container">
            <h1>BPB Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
            <div id="error-message">
                <h2>\u274C Something went wrong!</h2>
                <p><b>${t?`\u26A0\uFE0F ${t.cause?t.message.toString():t.stack.toString()}`:""}</b></p>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
    <\/script>
    </body>
    </html>`;return new Response(r,{status:200,headers:{"Content-Type":"text/html"}})}l(Vo,"renderErrorPage");async function mt(t,r){let n=await Xt(globalThis.hostName),a=r?n.ipv6.map(f=>`[${f}]`):[];return[globalThis.hostName,"www.speedtest.net",...n.ipv4,...a,...t?t.split(","):[]]}l(mt,"getConfigAddresses");function Nt(t,r){let n=r?1:0,a=t[n].account.config;return{warpIPv6:`${a.interface.addresses.v6}/128`,reserved:a.client_id,publicKey:a.peers[0].public_key,privateKey:t[n].privateKey}}l(Nt,"extractWireguardParams");function ut(t,r,n,a,f,u){let h,g=u?` ${u}`:"";return a.includes(n)?h="Clean IP":h=De(n)?"Domain":kr(n)?"IPv4":Pt(n)?"IPv6":"",`\u{1F4A6} ${t} - ${f}${g} - ${h} : ${r}`}l(ut,"generateRemark");function xt(t){let r="";for(let n=0;n<t.length;n++)r+=Math.random()<.5?t[n].toUpperCase():t[n];return r}l(xt,"randomUpperCase");function nt(t){let r="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=n.length;for(let f=0;f<t;f++)r+=n.charAt(Math.floor(Math.random()*a));return r}l(nt,"getRandomPath");function jo(t){let r=atob(t);return Array.from(r).map(f=>f.charCodeAt(0).toString(16).padStart(2,"0")).join("").match(/.{2}/g).map(f=>parseInt(f,16))}l(jo,"base64ToDecimal");function kr(t){return/^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(t)}l(kr,"isIPv4");function Pt(t){return/^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/.test(t)}l(Pt,"isIPv6");function Ft(t){let n=new URL(t).hostname,a=De(n);return{host:n,isHostDomain:a}}l(Ft,"getDomain");async function Ut(t,r,n,a,f){let{remoteDNS:u,localDNS:h,VLTRFakeDNS:g,enableIPv6:p,warpFakeDNS:w,warpEnableIPv6:y,blockAds:E,bypassIran:D,bypassChina:I,blockPorn:L,bypassRussia:V,customBypassRules:U,customBlockRules:j}=t,O=[{rule:D,domain:"geosite:category-ir",ip:"geoip:ir"},{rule:I,domain:"geosite:cn",ip:"geoip:cn"},{rule:V,domain:"geosite:category-ru",ip:"geoip:ru"}],F=[{rule:E,host:"geosite:category-ads-all"},{rule:E,host:"geosite:category-ads-ir"},{rule:L,host:"geosite:category-porn"}],z=g&&!f||w&&f,J=p&&!f||y&&f,m=r.filter(he=>De(he)),R=U.split(",").filter(he=>De(he)),$=j.split(",").filter(he=>De(he)),C=[...new Set(m)],B=[...C,...R].length>0,A=D||I||V,K=E||L||$.length>0,P=a?["https://cloudflare-dns.com/dns-query"]:f?y?["1.1.1.1","1.0.0.1","2606:4700:4700::1111","2606:4700:4700::1001"]:["1.1.1.1","1.0.0.1"]:[u],G={};K&&(F.forEach(({rule:he,host:we})=>{he&&(G[we]=["127.0.0.1"])}),$.forEach(he=>{G[`domain:${he}`]=["127.0.0.1"]}));let H=n?await Xt(n):void 0;if(H&&(G[n]=p?[...H.ipv4,...H.ipv6]:H.ipv4),a){let he=["cloudflare-dns.com","cloudflare.com","dash.cloudflare.com"],we=await Promise.all(he.map(Xt)),Ce=we.flatMap(ue=>ue.ipv4),$e=p?we.flatMap(ue=>ue.ipv6):[];G["cloudflare-dns.com"]=[...Ce,...$e]}let ne={...Object.keys(G).length?{hosts:G}:{},servers:P,queryStrategy:J?"UseIP":"UseIPv4",tag:"dns"},Se=Ft(u);if(Se.isHostDomain&&!a&&!f&&ne.servers.push({address:"https://8.8.8.8/dns-query",domains:[`full:${Se.host}`],skipFallback:!0}),B){let he=C.map(Ce=>`full:${Ce}`),we=R.map(Ce=>`domain:${Ce}`);ne.servers.push({address:h,domains:[...he,...we],skipFallback:!0})}let ae={address:h,domains:[],expectIPs:[],skipFallback:!0};if(!a&&A&&(O.forEach(({rule:he,domain:we,ip:Ce})=>{he&&(ae.domains.push(we),ae.expectIPs.push(Ce))}),ne.servers.push(ae)),z){let he=A&&!a?{address:"fakedns",domains:ae.domains}:"fakedns";ne.servers.unshift(he)}return ne}l(Ut,"buildXrayDNS");function bt(t,r,n,a,f,u){let{remoteDNS:h,localDNS:g,bypassLAN:p,bypassIran:w,bypassChina:y,bypassRussia:E,blockAds:D,blockPorn:I,blockUDP443:L,customBypassRules:V,customBlockRules:U}=t,j=[{rule:p,type:"direct",domain:"geosite:private",ip:"geoip:private"},{rule:w,type:"direct",domain:"geosite:category-ir",ip:"geoip:ir"},{rule:y,type:"direct",domain:"geosite:cn",ip:"geoip:cn"},{rule:D,type:"block",domain:"geosite:category-ads-all"},{rule:D,type:"block",domain:"geosite:category-ads-ir"},{rule:I,type:"block",domain:"geosite:category-porn"}],O=r.filter(B=>De(B)),F=V?V.split(","):[],z=U?U.split(","):[],J=F.filter(B=>De(B)),m=[...O,...J].length>0,R=D||I||z.length>0,$=w||y||E||F.length>0,C=[{inboundTag:["dns-in"],outboundTag:"dns-out",type:"field"},{inboundTag:["socks-in","http-in"],port:"53",outboundTag:"dns-out",type:"field"}];if(!f&&(m||$)&&C.push({ip:[g],port:"53",network:"udp",outboundTag:"direct",type:"field"}),$||R){let B=l((H,ie)=>({[H]:[],outboundTag:ie,type:"field"}),"createRule"),A,K;f||(A=B("domain","direct"),K=B("ip","direct"));let P=B("domain","block"),G=B("ip","block");j.forEach(({rule:H,type:ie,domain:ne,ip:Se})=>{H&&(ie==="direct"?(A?.domain.push(ne),K?.ip?.push(Se)):P.domain.push(ne))}),F.forEach(H=>{De(H)?A?.domain.push(`domain:${H}`):K?.ip.push(H)}),z.forEach(H=>{De(H)?P.domain.push(`domain:${H}`):G.ip.push(H)}),f||(A.domain.length&&C.push(A),K.ip.length&&C.push(K)),P.domain.length&&C.push(P),G.ip.length&&C.push(G)}if(L&&C.push({network:"udp",port:"443",outboundTag:"block",type:"field"}),n){let B={[a?"balancerTag":"outboundTag"]:a?"all-proxy":"proxy",type:"field"};if(u)C.push({network:"udp",port:"53",...B});else{let K=new URL(h).hostname;C.push({[De(K)?"domain":"ip"]:[K],network:"tcp",...B})}}return a?C.push({network:"tcp,udp",balancerTag:"all",type:"field"}):C.push({network:"tcp,udp",outboundTag:n?"chain":f?"fragment":"proxy",type:"field"}),C}l(bt,"buildXrayRoutingRules");function Jo(t,r,n,a,f,u,h,g,p){let w={protocol:"vless",settings:{vnext:[{address:r,port:+n,users:[{id:globalThis.userID,encryption:"none",level:8}]}]},streamSettings:{network:"ws",security:"none",sockopt:{},wsSettings:{host:a,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"},path:`/${nt(16)}${u?`/${btoa(u)}`:""}?ed=2560`}},tag:t};globalThis.defaultHttpsPorts.includes(n)&&(w.streamSettings.security="tls",w.streamSettings.tlsSettings={allowInsecure:g,fingerprint:"randomized",alpn:["h2","http/1.1"],serverName:f});let y=w.streamSettings.sockopt;return h?y.dialerProxy="fragment":(y.tcpKeepAliveIdle=30,y.tcpNoDelay=!0,y.domainStrategy=p?"UseIPv4v6":"UseIPv4"),w}l(Jo,"buildXrayVLOutbound");function oa(t,r,n,a,f,u,h,g,p){let w={protocol:"trojan",settings:{servers:[{address:r,port:+n,password:globalThis.TRPassword,level:8}]},streamSettings:{network:"ws",security:"none",sockopt:{},wsSettings:{headers:{Host:a},path:`/tr${nt(16)}${u?`/${btoa(u)}`:""}?ed=2560`}},tag:t};globalThis.defaultHttpsPorts.includes(n)&&(w.streamSettings.security="tls",w.streamSettings.tlsSettings={allowInsecure:g,fingerprint:"randomized",alpn:["h2","http/1.1"],serverName:f});let y=w.streamSettings.sockopt;return h?y.dialerProxy="fragment":(y.tcpKeepAliveIdle=30,y.tcpNoDelay=!0,y.domainStrategy=p?"UseIPv4v6":"UseIPv4"),w}l(oa,"buildXrayTROutbound");function zo(t,r,n,a,f){let{warpEnableIPv6:u,nikaNGNoiseMode:h,noiseCountMin:g,noiseCountMax:p,noiseSizeMin:w,noiseSizeMax:y,noiseDelayMin:E,noiseDelayMax:D}=t,{warpIPv6:I,reserved:L,publicKey:V,privateKey:U}=Nt(r,a),j={protocol:"wireguard",settings:{address:["172.16.0.2/32",I],mtu:1280,peers:[{endpoint:n,publicKey:V,keepAlive:5}],reserved:jo(L),secretKey:U},streamSettings:{sockopt:{dialerProxy:"proxy",domainStrategy:u?"UseIPv4v6":"UseIPv4"}},tag:a?"chain":"proxy"};return!a&&delete j.streamSettings,f==="nikang"&&!a&&Object.assign(j.settings,{wnoise:h,wnoisecount:g===p?g:`${g}-${p}`,wpayloadsize:w===y?w:`${w}-${y}`,wnoisedelay:E===D?E:`${E}-${D}`}),j}l(zo,"buildXrayWarpOutbound");function na(t,r){if(["socks","http"].includes(t.protocol)){let{protocol:J,server:m,port:R,user:$,pass:C}=t;return{protocol:J,settings:{servers:[{address:m,port:+R,users:[{user:$,pass:C,level:8}]}]},streamSettings:{network:"tcp",sockopt:{dialerProxy:"proxy",domainStrategy:r?"UseIPv4v6":"UseIPv4",tcpNoDelay:!0}},mux:{enabled:!0,concurrency:8,xudpConcurrency:16,xudpProxyUDP443:"reject"},tag:"chain"}}let{server:n,port:a,uuid:f,flow:u,security:h,type:g,sni:p,fp:w,alpn:y,pbk:E,sid:D,spx:I,headerType:L,host:V,path:U,authority:j,serviceName:O,mode:F}=t,z={mux:{concurrency:8,enabled:!0,xudpConcurrency:16,xudpProxyUDP443:"reject"},protocol:"vless",settings:{vnext:[{address:n,port:+a,users:[{encryption:"none",flow:u,id:f,level:8,security:"auto"}]}]},streamSettings:{network:g,security:h,sockopt:{dialerProxy:"proxy",domainStrategy:r?"UseIPv4v6":"UseIPv4",tcpNoDelay:!0}},tag:"chain"};if(h==="tls"){let J=y?y?.split(","):[];z.streamSettings.tlsSettings={allowInsecure:!1,fingerprint:w,alpn:J,serverName:p}}if(h==="reality"&&(delete z.mux,z.streamSettings.realitySettings={fingerprint:w,publicKey:E,serverName:p,shortId:D,spiderX:I}),L==="http"){let J=U?.split(","),m=V?.split(",");z.streamSettings.tcpSettings={header:{request:{headers:{Host:m},method:"GET",path:J,version:"1.1"},response:{headers:{"Content-Type":["application/octet-stream"]},reason:"OK",status:"200",version:"1.1"},type:"http"}}}return g==="tcp"&&h!=="reality"&&!L&&(z.streamSettings.tcpSettings={header:{type:"none"}}),g==="ws"&&(z.streamSettings.wsSettings={headers:{Host:V},path:U}),g==="grpc"&&(delete z.mux,z.streamSettings.grpcSettings={authority:j,multiMode:F==="multi",serviceName:O}),z}l(na,"buildXrayChainOutbound");function gt(t,r,n,a,f,u,h){let{VLTRFakeDNS:g,enableIPv6:p,warpFakeDNS:w,bestVLTRInterval:y,bestWarpInterval:E,lengthMin:D,lengthMax:I,intervalMin:L,intervalMax:V,fragmentPackets:U}=t,j=g&&!h||w&&h,O=structuredClone(ca);if(O.remarks=r,j&&(O.inbounds[0].sniffing.destOverride.push("fakedns"),O.inbounds[1].sniffing.destOverride.push("fakedns")),n){let F=O.outbounds[0].settings.fragment;F.length=`${D}-${I}`,F.interval=`${L}-${V}`,F.packets=U,O.outbounds[0].settings.domainStrategy=p?"UseIPv4v6":"UseIPv4"}else O.outbounds.shift();if(a){let F=h?E:y;if(O.observatory.probeInterval=`${F}s`,u&&(O.routing.balancers[0].fallbackTag="prox-2"),f){O.observatory.subjectSelector.push("chain");let z=structuredClone(O.routing.balancers[0]);u&&(z.fallbackTag="chain-2"),O.routing.balancers.push({...z,selector:["chain"]}),O.routing.balancers[0].tag="all-proxy"}}else delete O.observatory,delete O.routing.balancers;return O}l(gt,"buildXrayConfig");async function aa(t,r,n,a,f){let h=gt(t,f?"\u{1F4A6} BPB F - Best Ping \u{1F4A5}":"\u{1F4A6} BPB - Best Ping \u{1F4A5}",f,!0,n,!0);return h.dns=await Ut(t,r,void 0,!1,!1),h.routing.rules=bt(t,r,n,!0,!1,!1),h.outbounds.unshift(...a),h}l(aa,"buildXrayBestPingConfig");async function sa(t,r,n,a){let f=["10-20","20-30","30-40","40-50","50-60","60-70","70-80","80-90","90-100","10-30","20-40","30-50","40-60","50-70","60-80","70-90","80-100","100-200"],u=gt(t,"\u{1F4A6} BPB F - Best Fragment \u{1F60E}",!0,!0,n,!1,!1);u.dns=await Ut(t,[],r,!1,!1),u.routing.rules=bt(t,[],n,!0,!1,!1);let h=u.outbounds.shift(),g=[];return f.forEach((p,w)=>{if(n){let D=structuredClone(n);D.tag=`chain-${w+1}`,D.streamSettings.sockopt.dialerProxy=`prox-${w+1}`,g.push(D)}let y=structuredClone(a[n?1:0]);y.tag=`prox-${w+1}`,y.streamSettings.sockopt.dialerProxy=`frag-${w+1}`;let E=structuredClone(h);E.tag=`frag-${w+1}`,E.settings.fragment.length=p,E.settings.fragment.interval="1-1",g.push(y,E)}),u.outbounds.unshift(...g),u}l(sa,"buildXrayBestFragmentConfig");async function ia(t){let r=gt(t,"\u{1F4A6} BPB F - WorkerLess \u2B50",!0,!1,!1,!1,!1);r.dns=await Ut(t,[],void 0,!0),r.routing.rules=bt(t,[],!1,!1,!0,!1);let n=Jo("fake-outbound","google.com","443",globalThis.userID,"google.com","google.com","",!0,!1);return delete n.streamSettings.sockopt,n.streamSettings.wsSettings.path="/",r.outbounds.push(n),r}l(ia,"buildXrayWorkerLessConfig");async function eo(t,r,n){let{proxySettings:a}=await qe(t,r),f=[],u=[],h=[],g,{proxyIP:p,outProxy:w,outProxyParams:y,cleanIPs:E,enableIPv6:D,customCdnAddrs:I,customCdnHost:L,customCdnSni:V,VLConfigs:U,TRConfigs:j,ports:O}=a;if(w){let B=JSON.parse(y);try{g=na(B,D)}catch(A){console.log("An error occured while parsing chain proxy: ",A),g=void 0,await r.kv.put("proxySettings",JSON.stringify({...a,outProxy:"",outProxyParams:{}}))}}let F=await mt(E,D),z=I?I.split(","):[],J=n?[...F]:[...F,...z],m=O.filter(B=>n?globalThis.defaultHttpsPorts.includes(B):!0);U&&h.push("VLESS"),j&&h.push("Trojan");let R=1;for(let B of h){let A=1;for(let K of m)for(let P of J){let G=z.includes(P),H=G?"C":n?"F":"",ie=G?V:xt(globalThis.hostName),ne=G?L:globalThis.hostName,Se=ut(A,K,P,E,B,H),ae=gt(a,Se,n,!1,g,!1,!1);ae.dns=await Ut(a,[P],void 0),ae.routing.rules=bt(a,[P],g,!1,!1,!1);let he=B==="VLESS"?Jo("proxy",P,K,ne,ie,p,n,G,D):oa("proxy",P,K,ne,ie,p,n,G,D);if(ae.outbounds.unshift({...he}),he.tag=`prox-${R}`,g){ae.outbounds.unshift(g);let we=structuredClone(g);we.tag=`chain-${R}`,we.streamSettings.sockopt.dialerProxy=`prox-${R}`,u.push(we)}u.push(he),f.push(ae),R++,A++}}let $=await aa(a,J,g,u,n),C=[...f,$];if(n){let B=await sa(a,globalThis.hostName,g,u),A=await ia(a);C.push(B,A)}return new Response(JSON.stringify(C,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(eo,"getXrayCustomConfigs");async function Go(t,r,n){let{proxySettings:a,warpConfigs:f}=await qe(t,r),u=[],h=[],g=[],p=[],{warpEndpoints:w}=a,y=w.split(",").map(U=>U.split(":")[0]).filter(U=>De(U)),E=n==="nikang"?" Pro ":" ";for(let[U,j]of w.split(",").entries()){let O=j.split(":")[0],F=gt(a,`\u{1F4A6} ${U+1} - Warp${E}\u{1F1EE}\u{1F1F7}`,!1,!1,!1,!1,!0),z=gt(a,`\u{1F4A6} ${U+1} - WoW${E}\u{1F30D}`,!1,!1,!0,!1,!0);F.dns=z.dns=await Ut(a,[O],void 0,!1,!0),F.routing.rules=bt(a,[O],!1,!1,!1,!0),z.routing.rules=bt(a,[O],!0,!1,!1,!0);let J=zo(a,f,j,!1,n),m=zo(a,f,j,!0,n);F.outbounds.unshift(J),z.outbounds.unshift(m,J),u.push(F),h.push(z);let R=structuredClone(J);R.tag=`prox-${U+1}`;let $=structuredClone(m);$.tag=`chain-${U+1}`,$.streamSettings.sockopt.dialerProxy=`prox-${U+1}`,g.push(R),p.push($)}let D=await Ut(a,y,void 0,!1,!0),I=gt(a,`\u{1F4A6} Warp${E}- Best Ping \u{1F680}`,!1,!0,!1,!1,!0);I.dns=D,I.routing.rules=bt(a,y,!1,!0,!1,!0),I.outbounds.unshift(...g);let L=gt(a,`\u{1F4A6} WoW${E}- Best Ping \u{1F680}`,!1,!0,!0,!1,!0);L.dns=D,L.routing.rules=bt(a,y,!0,!0,!1,!0),L.outbounds.unshift(...p,...g);let V=[...u,...h,I,L];return new Response(JSON.stringify(V,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(Go,"getXrayWarpConfigs");var ca={remarks:"",log:{loglevel:"warning"},dns:{},inbounds:[{port:10808,protocol:"socks",settings:{auth:"noauth",udp:!0,userLevel:8},sniffing:{destOverride:["http","tls"],enabled:!0,routeOnly:!0},tag:"socks-in"},{port:10809,protocol:"http",settings:{auth:"noauth",udp:!0,userLevel:8},sniffing:{destOverride:["http","tls"],enabled:!0,routeOnly:!0},tag:"http-in"},{listen:"127.0.0.1",port:10853,protocol:"dokodemo-door",settings:{address:"1.1.1.1",network:"tcp,udp",port:53},tag:"dns-in"}],outbounds:[{tag:"fragment",protocol:"freedom",settings:{fragment:{packets:"tlshello",length:"",interval:""},domainStrategy:"UseIP"},streamSettings:{sockopt:{tcpKeepAliveIdle:30,tcpNoDelay:!0}}},{protocol:"dns",tag:"dns-out"},{protocol:"freedom",settings:{},tag:"direct"},{protocol:"blackhole",settings:{response:{type:"http"}},tag:"block"}],policy:{levels:{8:{connIdle:300,downlinkOnly:1,handshake:4,uplinkOnly:1}},system:{statsOutboundUplink:!0,statsOutboundDownlink:!0}},routing:{domainStrategy:"IPIfNonMatch",rules:[],balancers:[{tag:"all",selector:["prox"],strategy:{type:"leastPing"}}]},observatory:{probeInterval:"30s",probeURL:"https://www.gstatic.com/generate_204",subjectSelector:["prox"],EnableConcurrency:!0},stats:{}};function Xo(t,r,n,a){let{remoteDNS:f,localDNS:u,VLTRFakeDNS:h,enableIPv6:g,warpFakeDNS:p,warpEnableIPv6:w,bypassIran:y,bypassChina:E,bypassRussia:D,blockAds:I,blockPorn:L,customBypassRules:V,customBlockRules:U}=t,j,O=Ft(f),F=h&&!n||p&&n,z=g&&!n||w&&n,J=V.split(",").filter(H=>De(H)),m=U.split(",").filter(H=>De(H)),R=[{rule:y,type:"direct",geosite:"geosite-ir",geoip:"geoip-ir"},{rule:E,type:"direct",geosite:"geosite-cn",geoip:"geoip-cn"},{rule:D,type:"direct",geosite:"geosite-category-ru",geoip:"geoip-ru"},{rule:!0,type:"block",geosite:"geosite-malware"},{rule:!0,type:"block",geosite:"geosite-phishing"},{rule:!0,type:"block",geosite:"geosite-cryptominers"},{rule:I,type:"block",geosite:"geosite-category-ads-all"},{rule:L,type:"block",geosite:"geosite-nsfw"}],$=[{address:n?"1.1.1.1":f,address_resolver:O.isHostDomain?"doh-resolver":"dns-direct",detour:a,tag:"dns-remote"},{address:u,detour:"direct",tag:"dns-direct"},{address:"rcode://success",tag:"dns-block"}];O.isHostDomain&&!n&&$.push({address:"https://8.8.8.8/dns-query",detour:"direct",tag:"doh-resolver"});let C;if(n)C={outbound:"any",server:"dns-direct"};else{let H=r.filter(ne=>De(ne));C={domain:[...new Set(H)],server:"dns-direct"}}let B=[C,{domain:["raw.githubusercontent.com","time.apple.com"],server:"dns-direct"},{clash_mode:"Direct",server:"dns-direct"},{clash_mode:"Global",server:"dns-remote"}],A={disable_cache:!0,rule_set:[],server:"dns-block"};R.forEach(({rule:H,type:ie,geosite:ne,geoip:Se})=>{H&&ie==="direct"&&B.push({type:"logical",mode:"and",rules:[{rule_set:ne},{rule_set:Se}],server:"dns-direct"}),H&&ie==="block"&&A.rule_set.push(ne)}),B.push(A);let K=l(H=>({domain_suffix:[],server:H}),"createRule"),P,G;return J.length&&(P=K("dns-direct"),J.forEach(H=>{P.domain_suffix.push(H)}),B.push(P)),m.length&&(G=K("dns-block"),m.forEach(H=>{G.domain_suffix.push(H)}),B.push(G)),F&&($.push({address:"fakeip",tag:"dns-fake"}),B.push({disable_cache:!0,inbound:"tun-in",query_type:["A","AAAA"],server:"dns-fake"}),j={enabled:!0,inet4_range:"198.18.0.0/15"},z&&(j.inet6_range="fc00::/18")),{servers:$,rules:B,fakeip:j}}l(Xo,"buildSingBoxDNS");function qo(t){let{bypassLAN:r,bypassIran:n,bypassChina:a,bypassRussia:f,blockAds:u,blockPorn:h,blockUDP443:g,customBypassRules:p,customBlockRules:w}=t,y=p?p.split(","):[],E=w?w.split(","):[],D=[{type:"logical",mode:"or",rules:[{inbound:"dns-in"},{network:"udp",port:53}],outbound:"dns-out"},{clash_mode:"Direct",outbound:"direct"},{clash_mode:"Global",outbound:"\u2705 Selector"}],I=[{rule:n,type:"direct",ruleSet:{geosite:"geosite-ir",geoip:"geoip-ir",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs"}},{rule:a,type:"direct",ruleSet:{geosite:"geosite-cn",geoip:"geoip-cn",geositeURL:"https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",geoipURL:"https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs"}},{rule:f,type:"direct",ruleSet:{geosite:"geosite-category-ru",geoip:"geoip-ru",geositeURL:"https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ru.srs",geoipURL:"https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-ru.srs"}},{rule:!0,type:"block",ruleSet:{geosite:"geosite-malware",geoip:"geoip-malware",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs"}},{rule:!0,type:"block",ruleSet:{geosite:"geosite-phishing",geoip:"geoip-phishing",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs"}},{rule:!0,type:"block",ruleSet:{geosite:"geosite-cryptominers",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs"}},{rule:u,type:"block",ruleSet:{geosite:"geosite-category-ads-all",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs"}},{rule:h,type:"block",ruleSet:{geosite:"geosite-nsfw",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs"}}],L=[],V=[],U=[],j=[],O=[];r&&V.push({ip_is_private:!0,outbound:"direct"});let F=l((K,P)=>({[K]:[],outbound:P}),"createRule"),z={type:"remote",tag:"",format:"binary",url:"",download_detour:"direct"},J=F("rule_set","direct"),m=F("rule_set","direct"),R=F("rule_set","block"),$=F("rule_set","block");I.forEach(({rule:K,type:P,ruleSet:G})=>{if(!K)return;let{geosite:H,geoip:ie,geositeURL:ne,geoipURL:Se}=G,ae=P==="direct",he=ae?J:R,we=ae?m:$;he.rule_set.push(H),O.push({...z,tag:H,url:ne}),ie&&(we.rule_set.push(ie),O.push({...z,tag:ie,url:Se}))});let C=l((K,P)=>{(K.rule_set?.length||K.domain_suffix?.length||K.ip_cidr?.length)&&P.push(K)},"pushRuleIfNotEmpty");C(J,L),C(m,V),C(R,U),C($,j);let B=l((K,P)=>{let G=F("domain_suffix",P),H=F("ip_cidr",P);K.forEach(ie=>{if(De(ie))G.domain_suffix.push(ie);else{let ne=Pt(ie)?ie.replace(/\[|\]/g,""):ie;H.ip_cidr.push(ne)}}),C(G,P==="direct"?L:U),C(H,P==="direct"?V:j)},"processRules");y.length&&B(y,"direct"),E.length&&B(E,"block");let A=[...D,...L,...V,...U,...j];return g&&A.push({network:"udp",port:443,protocol:"quic",outbound:"block"}),{rules:A,rule_set:O}}l(qo,"buildSingBoxRoutingRules");function la(t,r,n,a,f,u,h,g){let{enableIPv6:p,lengthMin:w,lengthMax:y,intervalMin:E,intervalMax:D,proxyIP:I}=t,L=`/${nt(16)}${I?`/${btoa(I)}`:""}`,V=!!globalThis.defaultHttpsPorts.includes(a),U={type:"vless",server:n,server_port:+a,domain_strategy:p?"prefer_ipv4":"ipv4_only",uuid:globalThis.userID,tls:{alpn:"http/1.1",enabled:!0,insecure:h,server_name:u,utls:{enabled:!0,fingerprint:"randomized"}},transport:{early_data_header_name:"Sec-WebSocket-Protocol",max_early_data:2560,headers:{Host:f},path:L,type:"ws"},tag:r};return V||delete U.tls,g&&(U.tls_fragment={enabled:!0,size:`${w}-${y}`,sleep:`${E}-${D}`}),U}l(la,"buildSingBoxVLOutbound");function fa(t,r,n,a,f,u,h,g){let{enableIPv6:p,lengthMin:w,lengthMax:y,intervalMin:E,intervalMax:D,proxyIP:I}=t,L=`/tr${nt(16)}${I?`/${btoa(I)}`:""}`,V=!!globalThis.defaultHttpsPorts.includes(a),U={type:"trojan",password:globalThis.TRPassword,server:n,server_port:+a,domain_strategy:p?"prefer_ipv4":"ipv4_only",tls:{alpn:"http/1.1",enabled:!0,insecure:h,server_name:u,utls:{enabled:!0,fingerprint:"randomized"}},transport:{early_data_header_name:"Sec-WebSocket-Protocol",max_early_data:2560,headers:{Host:f},path:L,type:"ws"},tag:r};return V||delete U.tls,g&&(U.tls_fragment={enabled:!0,size:`${w}-${y}`,sleep:`${E}-${D}`}),U}l(fa,"buildSingBoxTROutbound");function Yo(t,r,n,a,f,u){let h=/\[(.*?)\]/,g=/[^:]*$/,p=a.includes("[")?a.match(h)[1]:a.split(":")[0],w=a.includes("[")?+a.match(g)[0]:+a.split(":")[1],{warpEnableIPv6:y,hiddifyNoiseMode:E,noiseCountMin:D,noiseCountMax:I,noiseSizeMin:L,noiseSizeMax:V,noiseDelayMin:U,noiseDelayMax:j}=t,{warpIPv6:O,reserved:F,publicKey:z,privateKey:J}=Nt(r,f),m={local_address:["172.16.0.2/32",O],mtu:1280,peer_public_key:z,private_key:J,reserved:F,server:p,server_port:w,domain_strategy:y?"prefer_ipv4":"ipv4_only",type:"wireguard",detour:f,tag:n};return u==="hiddify"&&Object.assign(m,{fake_packets_mode:E,fake_packets:D===I?D:`${D}-${I}`,fake_packets_size:L===V?L:`${L}-${V}`,fake_packets_delay:U===j?U:`${U}-${j}`}),m}l(Yo,"buildSingBoxWarpOutbound");function da(t,r){if(["socks","http"].includes(t.protocol)){let{protocol:O,server:F,port:z,user:J,pass:m}=t,R={type:O,tag:"",server:F,server_port:+z,username:J,password:m,detour:""};return O==="socks"&&(R.version="5"),R}let{server:n,port:a,uuid:f,flow:u,security:h,type:g,sni:p,fp:w,alpn:y,pbk:E,sid:D,headerType:I,host:L,path:V,serviceName:U}=t,j={type:"vless",tag:"",server:n,server_port:+a,domain_strategy:r?"prefer_ipv4":"ipv4_only",uuid:f,flow:u,detour:""};if(h==="tls"||h==="reality"){let O=y?y?.split(",").filter(F=>F!=="h2"):[];j.tls={enabled:!0,server_name:p,insecure:!1,alpn:O,utls:{enabled:!0,fingerprint:w}},h==="reality"&&(j.tls.reality={enabled:!0,public_key:E,short_id:D},delete j.tls.alpn)}if(I==="http"){let O=L?.split(",");j.transport={type:"http",host:O,path:V,method:"GET",headers:{Connection:["keep-alive"],"Content-Type":["application/octet-stream"]}}}if(g==="ws"){let O=V?.split("?ed=")[0],F=+V?.split("?ed=")[1]||0;j.transport={type:"ws",path:O,headers:{Host:L},max_early_data:F,early_data_header_name:"Sec-WebSocket-Protocol"}}return g==="grpc"&&(j.transport={type:"grpc",service_name:U}),j}l(da,"buildSingBoxChainOutbound");async function Zo(t,r,n){let{proxySettings:a,warpConfigs:f}=await qe(t,r),{warpEndpoints:u}=a,h=structuredClone(Qo),g=n==="hiddify"?" Pro ":" ",p=Xo(a,void 0,!0,`\u{1F4A6} Warp${g}- Best Ping \u{1F680}`),{rules:w,rule_set:y}=qo(a);h.dns.servers=p.servers,h.dns.rules=p.rules,h.dns.strategy=a.warpEnableIPv6?"prefer_ipv4":"ipv4_only",p.fakeip&&(h.dns.fakeip=p.fakeip),h.route.rules=w,h.route.rule_set=y;let E=h.outbounds[0],D=h.outbounds[1];E.outbounds=[`\u{1F4A6} Warp${g}- Best Ping \u{1F680}`,`\u{1F4A6} WoW${g}- Best Ping \u{1F680}`],h.outbounds.splice(2,0,structuredClone(D));let I=h.outbounds[2];D.tag=`\u{1F4A6} Warp${g}- Best Ping \u{1F680}`,D.interval=`${a.bestWarpInterval}s`,I.tag=`\u{1F4A6} WoW${g}- Best Ping \u{1F680}`,I.interval=`${a.bestWarpInterval}s`;let L=[],V=[];return u.split(",").forEach((U,j)=>{let O=`\u{1F4A6} ${j+1} - Warp \u{1F1EE}\u{1F1F7}`,F=`\u{1F4A6} ${j+1} - WoW \u{1F30D}`,z=Yo(a,f,O,U,"",n),J=Yo(a,f,F,U,O,n);h.outbounds.push(J,z),L.push(O),V.push(F),D.outbounds.push(O),I.outbounds.push(F)}),E.outbounds.push(...L,...V),new Response(JSON.stringify(h,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(Zo,"getSingBoxWarpConfig");async function to(t,r,n){let{proxySettings:a}=await qe(t,r),f,{cleanIPs:u,ports:h,VLConfigs:g,TRConfigs:p,outProxy:w,outProxyParams:y,customCdnAddrs:E,customCdnHost:D,customCdnSni:I,bestVLTRInterval:L,enableIPv6:V}=a;if(w){let K=JSON.parse(y);try{f=da(K,V)}catch(P){console.log("An error occured while parsing chain proxy: ",P),f=void 0,await r.kv.put("proxySettings",JSON.stringify({...a,outProxy:"",outProxyParams:{}}))}}let U=await mt(u,V),j=E?E.split(","):[],O=[...U,...j],F=structuredClone(Qo),z=Xo(a,O,!1,f?"proxy-1":"\u2705 Selector"),{rules:J,rule_set:m}=qo(a);F.dns.servers=z.servers,F.dns.rules=z.rules,z.fakeip&&(F.dns.fakeip=z.fakeip),F.dns.strategy=V?"prefer_ipv4":"ipv4_only",F.route.rules=J,F.route.rule_set=m;let R=F.outbounds[0],$=F.outbounds[1];R.outbounds=["\u{1F4A6} Best Ping \u{1F4A5}"],$.interval=`${L}s`,$.tag="\u{1F4A6} Best Ping \u{1F4A5}";let C=h.filter(K=>n?globalThis.defaultHttpsPorts.includes(K):!0),B=1;return[...g?["VLESS"]:[],...p?["Trojan"]:[]].forEach(K=>{let P=1;C.forEach(G=>{O.forEach(H=>{let ie,ne,Se=j.includes(H),ae=Se?"C":n?"F":"",he=Se?I:xt(globalThis.hostName),we=Se?D:globalThis.hostName,Ce=ut(P,G,H,u,K,ae);if(K==="VLESS"&&(ie=la(a,f?`proxy-${B}`:Ce,H,G,we,he,Se,n),F.outbounds.push(ie)),K==="Trojan"&&(ne=fa(a,f?`proxy-${B}`:Ce,H,G,we,he,Se,n),F.outbounds.push(ne)),f){let $e=structuredClone(f);$e.tag=Ce,$e.detour=`proxy-${B}`,F.outbounds.push($e)}R.outbounds.push(Ce),$.outbounds.push(Ce),B++,P++})})}),new Response(JSON.stringify(F,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(to,"getSingBoxCustomConfig");var Qo={log:{level:"warn",timestamp:!0},dns:{servers:[],rules:[],independent_cache:!0},inbounds:[{type:"direct",tag:"dns-in",listen:"0.0.0.0",listen_port:6450,override_address:"1.1.1.1",override_port:53},{type:"tun",tag:"tun-in",address:["172.18.0.1/28","fdfe:dcba:9876::1/126"],mtu:9e3,auto_route:!0,strict_route:!0,stack:"mixed",endpoint_independent_nat:!0,sniff:!0,sniff_override_destination:!0},{type:"mixed",tag:"mixed-in",listen:"0.0.0.0",listen_port:2080,sniff:!0,sniff_override_destination:!1}],outbounds:[{type:"selector",tag:"\u2705 Selector",outbounds:[]},{type:"urltest",tag:"",outbounds:[],url:"https://www.gstatic.com/generate_204",interval:""},{type:"direct",domain_strategy:"ipv4_only",tag:"direct"},{type:"block",tag:"block"},{type:"dns",tag:"dns-out"}],route:{rules:[],rule_set:[],auto_detect_interface:!0,override_android_vpn:!0,final:"\u2705 Selector"},ntp:{enabled:!0,server:"time.apple.com",server_port:123,detour:"direct",interval:"30m"},experimental:{cache_file:{enabled:!0,store_fakeip:!0},clash_api:{external_controller:"127.0.0.1:9090",external_ui:"ui",external_ui_download_url:"https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",external_ui_download_detour:"direct",default_mode:"Rule"}}};async function tn(t,r,n){let{remoteDNS:a,localDNS:f,VLTRFakeDNS:u,outProxyParams:h,enableIPv6:g,warpFakeDNS:p,warpEnableIPv6:w,bypassIran:y,bypassChina:E,bypassRussia:D,customBypassRules:I}=t,L=w?["1.1.1.1","1.0.0.1","[2606:4700:4700::1111]","[2606:4700:4700::1001]"]:["1.1.1.1","1.0.0.1"],V=u&&!n||p&&n,U=g&&!n||w&&n,j=I.split(",").filter(m=>De(m)),O=y||E||D,F=[{rule:y,geosite:"ir"},{rule:E,geosite:"cn"},{rule:D,geosite:"ru"}],z={enable:!0,listen:"0.0.0.0:1053",ipv6:U,"respect-rules":!0,"use-system-hosts":!1,nameserver:n?L.map(m=>r?`${m}#\u{1F4A6} Warp - Best Ping \u{1F680}`:`${m}#\u2705 Selector`):[r?`${a}#proxy-1`:`${a}#\u2705 Selector`],"proxy-server-nameserver":[`${f}#DIRECT`],"nameserver-policy":{"raw.githubusercontent.com":`${f}#DIRECT`,"time.apple.com":`${f}#DIRECT`}};if(r&&!n){let m=JSON.parse(h).server;De(m)&&(z["nameserver-policy"][m]=`${a}#proxy-1`)}if(O){let m=[];F.forEach(({rule:R,geosite:$})=>{R&&m.push($)}),z["nameserver-policy"][`rule-set:${m.join(",")}`]=[`${f}#DIRECT`]}return j.forEach(m=>{z["nameserver-policy"][`+.${m}`]=[`${f}#DIRECT`]}),Ft(a).isHostDomain&&!n&&(z["default-nameserver"]=[`https://8.8.8.8/dns-query#${r?"proxy-1":"\u2705 Selector"}`]),V&&Object.assign(z,{"enhanced-mode":"fake-ip","fake-ip-range":"198.18.0.1/16","fake-ip-filter":["geosite:private"]}),z}l(tn,"buildClashDNS");function rn(t){let{bypassLAN:r,bypassIran:n,bypassChina:a,bypassRussia:f,blockAds:u,blockPorn:h,blockUDP443:g,customBypassRules:p,customBlockRules:w}=t,y=p?p.split(","):[],E=w?w.split(","):[],D=[{rule:r,type:"direct",noResolve:!0,ruleProvider:{format:"yaml",geosite:"private",geoip:"private-cidr",geositeURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.yaml",geoipURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.yaml"}},{rule:n,type:"direct",ruleProvider:{format:"text",geosite:"ir",geoip:"ir-cidr",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"}},{rule:a,type:"direct",ruleProvider:{format:"yaml",geosite:"cn",geoip:"cn-cidr",geositeURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",geoipURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"}},{rule:f,type:"direct",ruleProvider:{format:"yaml",geosite:"ru",geoip:"ru-cidr",geositeURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",geoipURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"}},{rule:!0,type:"block",ruleProvider:{format:"text",geosite:"malware",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt"}},{rule:!0,type:"block",ruleProvider:{format:"text",geosite:"phishing",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt"}},{rule:!0,type:"block",ruleProvider:{format:"text",geosite:"cryptominers",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"}},{rule:u,type:"block",ruleProvider:{format:"text",geosite:"ads",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ads.txt"}},{rule:h,type:"block",ruleProvider:{format:"text",geosite:"nsfw",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt"}}];function I(J,m,R,$){let C=m==="text"?"txt":m;return{[J]:{type:"http",format:m,behavior:R,url:$,path:`./ruleset/${J}.${C}`,interval:86400}}}l(I,"buildRuleProvider");let L=[],V=[],U=[],j=[],O={};D.forEach(({rule:J,type:m,ruleProvider:R,noResolve:$})=>{let{geosite:C,geoip:B,geositeURL:A,geoipURL:K,format:P}=R;if(J){if(C){(m==="direct"?L:U).push(`RULE-SET,${C},${m==="direct"?"DIRECT":"REJECT"}`);let H=I(C,P,"domain",A);Object.assign(O,H)}if(B){(m==="direct"?V:j).push(`RULE-SET,${B},${m==="direct"?"DIRECT":"REJECT"}${$?",no-resolve":""}`);let H=I(B,P,"ipcidr",K);Object.assign(O,H)}}});let F=l((J,m)=>{if(De(J))return`DOMAIN-SUFFIX,${J},${m}`;{let R=kr(J)?"IP-CIDR":"IP-CIDR6",$=Pt(J)?J.replace(/\[|\]/g,""):J,C=J.includes("/")?"":kr(J)?"/32":"/128";return`${R},${$}${C},${m},no-resolve`}},"generateRule");[...y,...E].forEach((J,m)=>{let R=m<y.length,$=R?"DIRECT":"REJECT";(R?De(J)?L:V:De(J)?U:j).push(F(J,$))});let z=[...L,...V,...U,...j];return g&&z.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT"),z.push("MATCH,\u2705 Selector"),{rules:z,ruleProviders:O}}l(rn,"buildClashRoutingRules");function ua(t,r,n,a,f,u,h){let g=!!globalThis.defaultHttpsPorts.includes(n),p=Pt(r)?r.replace(/\[|\]/g,""):r,w={name:t,type:"vless",server:p,port:+n,uuid:globalThis.userID,tls:g,network:"ws",udp:!0,"ws-opts":{path:u,headers:{host:a},"max-early-data":2560,"early-data-header-name":"Sec-WebSocket-Protocol"}};return g&&Object.assign(w,{servername:f,alpn:["h2","http/1.1"],"client-fingerprint":"random","skip-cert-verify":h}),w}l(ua,"buildClashVLOutbound");function pa(t,r,n,a,f,u,h){let g=Pt(r)?r.replace(/\[|\]/g,""):r;return{name:t,type:"trojan",server:g,port:+n,password:globalThis.TRPassword,network:"ws",udp:!0,"ws-opts":{path:u,headers:{host:a},"max-early-data":2560,"early-data-header-name":"Sec-WebSocket-Protocol"},sni:f,alpn:["h2","http/1.1"],"client-fingerprint":"random","skip-cert-verify":h}}l(pa,"buildClashTROutbound");function en(t,r,n,a){let f=/\[(.*?)\]/,u=/[^:]*$/,h=n.includes("[")?n.match(f)[1]:n.split(":")[0],g=n.includes("[")?+n.match(u)[0]:+n.split(":")[1],{warpIPv6:p,reserved:w,publicKey:y,privateKey:E}=Nt(t,a);return{name:r,type:"wireguard",ip:"172.16.0.2/32",ipv6:p,"private-key":E,server:h,port:g,"public-key":y,"allowed-ips":["0.0.0.0/0","::/0"],reserved:w,udp:!0,mtu:1280,"dialer-proxy":a}}l(en,"buildClashWarpOutbound");function ha(t){if(["socks","http"].includes(t.protocol)){let{protocol:j,server:O,port:F,user:z,pass:J}=t;return{name:"",type:j==="socks"?"socks5":j,server:O,port:+F,"dialer-proxy":"",username:z,password:J}}let{server:r,port:n,uuid:a,flow:f,security:u,type:h,sni:g,fp:p,alpn:w,pbk:y,sid:E,headerType:D,host:I,path:L,serviceName:V}=t,U={name:"\u{1F4A6} Chain Best Ping \u{1F4A5}",type:"vless",server:r,port:+n,udp:!0,uuid:a,flow:f,network:h,"dialer-proxy":"\u{1F4A6} Best Ping \u{1F4A5}"};if(u==="tls"){let j=w?w?.split(","):[];Object.assign(U,{tls:!0,servername:g,alpn:j,"client-fingerprint":p})}if(u==="reality"&&Object.assign(U,{tls:!0,servername:g,"client-fingerprint":p,"reality-opts":{"public-key":y,"short-id":E}}),D==="http"){let j=L?.split(",");U["http-opts"]={method:"GET",path:j,headers:{Connection:["keep-alive"],"Content-Type":["application/octet-stream"]}}}if(h==="ws"){let j=L?.split("?ed=")[0],O=+L?.split("?ed=")[1];U["ws-opts"]={path:j,headers:{Host:I},"max-early-data":O,"early-data-header-name":"Sec-WebSocket-Protocol"}}return h==="grpc"&&(U["grpc-opts"]={"grpc-service-name":V}),U}l(ha,"buildClashChainOutbound");async function on(t,r){let{proxySettings:n,warpConfigs:a}=await qe(t,r),{warpEndpoints:f}=n,u=structuredClone(an);u.dns=await tn(n,!0,!0);let{rules:h,ruleProviders:g}=rn(n);u.rules=h,u["rule-providers"]=g;let p=u["proxy-groups"][0],w=u["proxy-groups"][1];p.proxies=["\u{1F4A6} Warp - Best Ping \u{1F680}","\u{1F4A6} WoW - Best Ping \u{1F680}"],w.name="\u{1F4A6} Warp - Best Ping \u{1F680}",w.interval=+n.bestWarpInterval,u["proxy-groups"].push(structuredClone(w));let y=u["proxy-groups"][2];y.name="\u{1F4A6} WoW - Best Ping \u{1F680}";let E=[],D=[];return f.split(",").forEach((I,L)=>{let V=`\u{1F4A6} ${L+1} - Warp \u{1F1EE}\u{1F1F7}`,U=`\u{1F4A6} ${L+1} - WoW \u{1F30D}`,j=en(a,V,I,""),O=en(a,U,I,V);u.proxies.push(O,j),E.push(V),D.push(U),w.proxies.push(V),y.proxies.push(U)}),p.proxies.push(...E,...D),new Response(JSON.stringify(u,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(on,"getClashWarpConfig");async function nn(t,r){let{proxySettings:n}=await qe(t,r),a,{cleanIPs:f,proxyIP:u,ports:h,VLConfigs:g,TRConfigs:p,outProxy:w,outProxyParams:y,customCdnAddrs:E,customCdnHost:D,customCdnSni:I,bestVLTRInterval:L,enableIPv6:V}=n;if(w){let A=JSON.parse(y);try{a=ha(A)}catch(K){console.log("An error occured while parsing chain proxy: ",K),a=void 0,await r.kv.put("proxySettings",JSON.stringify({...n,outProxy:"",outProxyParams:{}}))}}let U=structuredClone(an),{rules:j,ruleProviders:O}=rn(n);U.dns=await tn(n,a,!1),U.rules=j,U["rule-providers"]=O;let F=U["proxy-groups"][0],z=U["proxy-groups"][1];F.proxies=["\u{1F4A6} Best Ping \u{1F4A5}"],z.name="\u{1F4A6} Best Ping \u{1F4A5}",z.interval=+L;let J=await mt(f,V),m=E?E.split(","):[],R=[...J,...m],$=1,C;return[...g?["VLESS"]:[],...p?["Trojan"]:[]].forEach(A=>{let K=1;h.forEach(P=>{R.forEach(G=>{let H,ie,ne=m.includes(G),Se=ne?"C":"",ae=ne?I:xt(globalThis.hostName),he=ne?D:globalThis.hostName,we=ut(K,P,G,f,A,Se).replace(" : "," - ");if(A==="VLESS"&&(C=`/${nt(16)}${u?`/${btoa(u)}`:""}`,H=ua(a?`proxy-${$}`:we,G,P,he,ae,C,ne),U.proxies.push(H),F.proxies.push(we),z.proxies.push(we)),A==="Trojan"&&globalThis.defaultHttpsPorts.includes(P)&&(C=`/tr${nt(16)}${u?`/${btoa(u)}`:""}`,ie=pa(a?`proxy-${$}`:we,G,P,he,ae,C,ne),U.proxies.push(ie),F.proxies.push(we),z.proxies.push(we)),a){let Ce=structuredClone(a);Ce.name=we,Ce["dialer-proxy"]=`proxy-${$}`,U.proxies.push(Ce)}$++,K++})})}),new Response(JSON.stringify(U,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(nn,"getClashNormalConfig");var an={"mixed-port":7890,ipv6:!0,"allow-lan":!0,mode:"rule","log-level":"warning","disable-keep-alive":!1,"keep-alive-idle":30,"keep-alive-interval":30,"unified-delay":!1,"geo-auto-update":!0,"geo-update-interval":168,"external-controller":"127.0.0.1:9090","external-ui-url":"https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip","external-ui":"ui","external-controller-cors":{"allow-origins":["*"],"allow-private-network":!0},profile:{"store-selected":!0,"store-fake-ip":!0},dns:{},tun:{enable:!0,stack:"mixed","auto-route":!0,"strict-route":!0,"auto-detect-interface":!0,"dns-hijack":["any:53"],mtu:9e3},sniffer:{enable:!0,"force-dns-mapping":!0,"parse-pure-ip":!0,"override-destination":!1,sniff:{HTTP:{ports:[80,8080,8880,2052,2082,2086,2095]},TLS:{ports:[443,8443,2053,2083,2087,2096]}}},proxies:[],"proxy-groups":[{name:"\u2705 Selector",type:"select",proxies:[]},{name:"",type:"url-test",url:"https://www.gstatic.com/generate_204",interval:30,tolerance:50,proxies:[]}],"rule-providers":{},rules:[],ntp:{enable:!0,server:"time.apple.com",port:123,interval:30}};async function sn(t,r){let{proxySettings:n}=await qe(t,r),{cleanIPs:a,proxyIP:f,ports:u,VLConfigs:h,TRConfigs:g,outProxy:p,customCdnAddrs:w,customCdnHost:y,customCdnSni:E,enableIPv6:D}=n,I="",L="",V="",U=1,j=await mt(a,D),O=w?w.split(","):[],F=[...j,...O],z=globalThis.client==="singbox"?"http/1.1":"h2,http/1.1",J=encodeURIComponent(globalThis.TRPassword),m=globalThis.client==="singbox"?"&eh=Sec-WebSocket-Protocol&ed=2560":encodeURIComponent("?ed=2560");if(u.forEach($=>{F.forEach((C,B)=>{let A=B>j.length-1,K=A?"C":"",P=A?E:xt(globalThis.hostName),G=A?y:globalThis.hostName,H=`${nt(16)}${f?`/${encodeURIComponent(btoa(f))}`:""}${m}`,ie=encodeURIComponent(ut(U,$,C,a,"VLESS",K)),ne=encodeURIComponent(ut(U,$,C,a,"Trojan",K)),Se=globalThis.defaultHttpsPorts.includes($)?`&security=tls&sni=${P}&fp=randomized&alpn=${z}`:"&security=none";h&&(I+=`${atob("dmxlc3M6Ly8=")}${globalThis.userID}@${C}:${$}?path=/${H}&encryption=none&host=${G}&type=ws${Se}#${ie}
`),g&&(L+=`${atob("dHJvamFuOi8v")}${J}@${C}:${$}?path=/tr${H}&host=${G}&type=ws${Se}#${ne}
`),U++})}),p){let $=`#${encodeURIComponent("\u{1F4A6} Chain proxy \u{1F517}")}`;if(p.startsWith("socks")||p.startsWith("http")){let C=/^(?:socks|http):\/\/([^@]+)@/,B=p.match(C),A=B?B[1]:!1;V=A?p.replace(A,btoa(A))+$:p+$}else V=p.split("#")[0]+$}let R=btoa(I+L+V);return new Response(R,{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}l(sn,"getNormalConfigs");async function cn(){let t=`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BPB Generator</title>
    <style>
        :root {
            --color: black;
            --primary-color: #09639f;
            --header-color: #09639f; 
            --background-color: #fff;
            --form-background-color: #f9f9f9;
            --lable-text-color: #333;
            --h2-color: #3b3b3b;
            --border-color: #ddd;
            --input-background-color: white;
            --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: var(--background-color);
            position: relative;
            overflow: hidden;
            text-align: center;
        }
        body.dark-mode {
            --color: white;
            --primary-color: #09639F;
            --header-color: #3498DB; 
            --background-color: #121212;
            --form-background-color: #121212;
            --lable-text-color: #DFDFDF;
            --h2-color: #D5D5D5;
            --border-color: #353535;
            --input-background-color: #252525;
            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        
        h2 { text-align: center; color: var(--h2-color) }
        strong { color: var(--lable-text-color); }
        .output-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px;
            background-color: var(--input-background-color);
            color: var(--lable-text-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            font-family: monospace;
            font-size: 1rem;
            word-wrap: break-word;
        }
        .output { flex: 1; margin-right: 10px; overflow-wrap: break-word; }
        .copy-icon {
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--primary-color);
            transition: color 0.2s;
        }
        .copy-icon:hover { color: #2980b9; }
        .form-container {
            background: var(--form-background-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .form-control { margin-bottom: 15px; display: flex; align-items: center; }
        button {
            display: block;
            width: 100%;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            color: white;
            background-color: var(--primary-color);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .button:hover,
        button:focus {
            background-color: #2980b9;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        button.button:hover { color: white; }
        .button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
        @media only screen and (min-width: 768px) {
            .container { width: 40%; }
        }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>BPB Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
            <div class="form-container">
                <h2>Secrets generator</h2>
                <div>
                    <strong>Random UUID</strong>
                    <div class="output-container">
                        <span id="uuid" class="output"></span>
                        <span class="copy-icon" onclick="copyToClipboard('uuid')">\u{1F4CB}</span>
                    </div>
                </div>
                <div>
                    <strong>Random Trojan Password</strong>
                    <div class="output-container">
                        <span id="trojan-password" class="output"></span>
                        <span class="copy-icon" onclick="copyToClipboard('trojan-password')">\u{1F4CB}</span>
                    </div>
                </div>
                <div>
                    <strong>Random Subscription URI path</strong>
                    <div class="output-container">
                        <span id="sub-path" class="output"></span>
                        <span class="copy-icon" onclick="copyToClipboard('sub-path')">\u{1F4CB}</span>
                    </div>
                </div>
                <button class="button" onclick="generateCredentials()">Generate Again \u267B\uFE0F</button>
            </div>
        </div>
        <script>
            localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
            function generateUUID() {
                return crypto.randomUUID();
            }
    
            function generateStrongPassword() {
                const charset =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
                let password = '';
                const randomValues = new Uint8Array(16);
                crypto.getRandomValues(randomValues);
    
                for (let i = 0; i < 16; i++) {
                    password += charset[randomValues[i] % charset.length];
                }
                return password;
            }
            
            function generateSubURIPath() {
                const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.";
                let uriPath = '';
                const randomValues = new Uint8Array(16);
                crypto.getRandomValues(randomValues);
    
                for (let i = 0; i < 16; i++) {
                    uriPath += charset[randomValues[i] % charset.length];
                }
                return uriPath;
            }
    
            function generateCredentials() {
                const uuid = generateUUID();
                const password = generateStrongPassword();
                const uriPath = generateSubURIPath();
    
                document.getElementById('uuid').textContent = uuid;
                document.getElementById('trojan-password').textContent = password;
                document.getElementById('sub-path').textContent = uriPath;
            }
    
            function copyToClipboard(elementId) {
                const textToCopy = document.getElementById(elementId).textContent;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert('\u2705 Copied to clipboard!'))
                    .catch(err => console.error('Failed to copy text:', err));
            }
    
            generateCredentials();
        <\/script>
    </body>
    </html>`;return new Response(t,{status:200,headers:{"Content-Type":"text/html"}})}l(cn,"renderSecretsPage");var fl={async fetch(t,r){try{Bo(t,r);let n=t.headers.get("Upgrade");if(!n||n!=="websocket")switch(globalThis.pathName){case"/update-warp":return await Zr(t,r);case`/sub/${globalThis.subPath}`:return globalThis.client==="sfa"?await to(t,r,!1):globalThis.client==="clash"?await nn(t,r):globalThis.client==="xray"?await eo(t,r,!1):await sn(t,r);case`/fragsub/${globalThis.subPath}`:return globalThis.client==="hiddify"?await to(t,r,!0):await eo(t,r,!0);case`/warpsub/${globalThis.subPath}`:return globalThis.client==="clash"?await on(t,r):globalThis.client==="singbox"||globalThis.client==="hiddify"?await Zo(t,r,globalThis.client):await Go(t,r,globalThis.client);case"/panel":return await Io(t,r);case"/login":return await ko(t,r);case"/logout":return Ao();case"/panel/password":return await Ro(t,r);case"/my-ip":return await $o(t);case"/secrets":return await cn();default:return await Do(t)}else return globalThis.pathName.startsWith("/tr")?await Ho(t):await Uo(t)}catch(n){return await Vo(n)}}};export{fl as default};
/*! Bundled license information:

js-sha256/src/sha256.js:
  (**
   * [js-sha256]{@link https://github.com/emn178/js-sha256}
   *
   * @version 0.11.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2024
   * @license MIT
   *)
*/
//# sourceMappingURL=worker.js.map

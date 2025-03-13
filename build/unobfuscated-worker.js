<<<<<<< HEAD
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({
  "node_modules/tweetnacl/nacl-fast.js"(exports, module) {
    (function(nacl3) {
      "use strict";
      var gf = /* @__PURE__ */ __name(function(init) {
        var i, r = new Float64Array(16);
        if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
        return r;
      }, "gf");
      var randombytes = /* @__PURE__ */ __name(function() {
        throw new Error("no PRNG");
      }, "randombytes");
      var _0 = new Uint8Array(16);
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
      function ts64(x, i, h, l) {
        x[i] = h >> 24 & 255;
        x[i + 1] = h >> 16 & 255;
        x[i + 2] = h >> 8 & 255;
        x[i + 3] = h & 255;
        x[i + 4] = l >> 24 & 255;
        x[i + 5] = l >> 16 & 255;
        x[i + 6] = l >> 8 & 255;
        x[i + 7] = l & 255;
      }
      __name(ts64, "ts64");
      function vn(x, xi, y, yi, n) {
        var i, d = 0;
        for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
        return (1 & d - 1 >>> 8) - 1;
      }
      __name(vn, "vn");
      function crypto_verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16);
      }
      __name(crypto_verify_16, "crypto_verify_16");
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
      }
      __name(crypto_verify_32, "crypto_verify_32");
      function core_salsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x1 >>> 0 & 255;
        o[5] = x1 >>> 8 & 255;
        o[6] = x1 >>> 16 & 255;
        o[7] = x1 >>> 24 & 255;
        o[8] = x2 >>> 0 & 255;
        o[9] = x2 >>> 8 & 255;
        o[10] = x2 >>> 16 & 255;
        o[11] = x2 >>> 24 & 255;
        o[12] = x3 >>> 0 & 255;
        o[13] = x3 >>> 8 & 255;
        o[14] = x3 >>> 16 & 255;
        o[15] = x3 >>> 24 & 255;
        o[16] = x4 >>> 0 & 255;
        o[17] = x4 >>> 8 & 255;
        o[18] = x4 >>> 16 & 255;
        o[19] = x4 >>> 24 & 255;
        o[20] = x5 >>> 0 & 255;
        o[21] = x5 >>> 8 & 255;
        o[22] = x5 >>> 16 & 255;
        o[23] = x5 >>> 24 & 255;
        o[24] = x6 >>> 0 & 255;
        o[25] = x6 >>> 8 & 255;
        o[26] = x6 >>> 16 & 255;
        o[27] = x6 >>> 24 & 255;
        o[28] = x7 >>> 0 & 255;
        o[29] = x7 >>> 8 & 255;
        o[30] = x7 >>> 16 & 255;
        o[31] = x7 >>> 24 & 255;
        o[32] = x8 >>> 0 & 255;
        o[33] = x8 >>> 8 & 255;
        o[34] = x8 >>> 16 & 255;
        o[35] = x8 >>> 24 & 255;
        o[36] = x9 >>> 0 & 255;
        o[37] = x9 >>> 8 & 255;
        o[38] = x9 >>> 16 & 255;
        o[39] = x9 >>> 24 & 255;
        o[40] = x10 >>> 0 & 255;
        o[41] = x10 >>> 8 & 255;
        o[42] = x10 >>> 16 & 255;
        o[43] = x10 >>> 24 & 255;
        o[44] = x11 >>> 0 & 255;
        o[45] = x11 >>> 8 & 255;
        o[46] = x11 >>> 16 & 255;
        o[47] = x11 >>> 24 & 255;
        o[48] = x12 >>> 0 & 255;
        o[49] = x12 >>> 8 & 255;
        o[50] = x12 >>> 16 & 255;
        o[51] = x12 >>> 24 & 255;
        o[52] = x13 >>> 0 & 255;
        o[53] = x13 >>> 8 & 255;
        o[54] = x13 >>> 16 & 255;
        o[55] = x13 >>> 24 & 255;
        o[56] = x14 >>> 0 & 255;
        o[57] = x14 >>> 8 & 255;
        o[58] = x14 >>> 16 & 255;
        o[59] = x14 >>> 24 & 255;
        o[60] = x15 >>> 0 & 255;
        o[61] = x15 >>> 8 & 255;
        o[62] = x15 >>> 16 & 255;
        o[63] = x15 >>> 24 & 255;
      }
      __name(core_salsa20, "core_salsa20");
      function core_hsalsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
        for (var i = 0; i < 20; i += 2) {
          u = x0 + x12 | 0;
          x4 ^= u << 7 | u >>> 32 - 7;
          u = x4 + x0 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x4 | 0;
          x12 ^= u << 13 | u >>> 32 - 13;
          u = x12 + x8 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x1 | 0;
          x9 ^= u << 7 | u >>> 32 - 7;
          u = x9 + x5 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x9 | 0;
          x1 ^= u << 13 | u >>> 32 - 13;
          u = x1 + x13 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x6 | 0;
          x14 ^= u << 7 | u >>> 32 - 7;
          u = x14 + x10 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x14 | 0;
          x6 ^= u << 13 | u >>> 32 - 13;
          u = x6 + x2 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x11 | 0;
          x3 ^= u << 7 | u >>> 32 - 7;
          u = x3 + x15 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x3 | 0;
          x11 ^= u << 13 | u >>> 32 - 13;
          u = x11 + x7 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
          u = x0 + x3 | 0;
          x1 ^= u << 7 | u >>> 32 - 7;
          u = x1 + x0 | 0;
          x2 ^= u << 9 | u >>> 32 - 9;
          u = x2 + x1 | 0;
          x3 ^= u << 13 | u >>> 32 - 13;
          u = x3 + x2 | 0;
          x0 ^= u << 18 | u >>> 32 - 18;
          u = x5 + x4 | 0;
          x6 ^= u << 7 | u >>> 32 - 7;
          u = x6 + x5 | 0;
          x7 ^= u << 9 | u >>> 32 - 9;
          u = x7 + x6 | 0;
          x4 ^= u << 13 | u >>> 32 - 13;
          u = x4 + x7 | 0;
          x5 ^= u << 18 | u >>> 32 - 18;
          u = x10 + x9 | 0;
          x11 ^= u << 7 | u >>> 32 - 7;
          u = x11 + x10 | 0;
          x8 ^= u << 9 | u >>> 32 - 9;
          u = x8 + x11 | 0;
          x9 ^= u << 13 | u >>> 32 - 13;
          u = x9 + x8 | 0;
          x10 ^= u << 18 | u >>> 32 - 18;
          u = x15 + x14 | 0;
          x12 ^= u << 7 | u >>> 32 - 7;
          u = x12 + x15 | 0;
          x13 ^= u << 9 | u >>> 32 - 9;
          u = x13 + x12 | 0;
          x14 ^= u << 13 | u >>> 32 - 13;
          u = x14 + x13 | 0;
          x15 ^= u << 18 | u >>> 32 - 18;
        }
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x5 >>> 0 & 255;
        o[5] = x5 >>> 8 & 255;
        o[6] = x5 >>> 16 & 255;
        o[7] = x5 >>> 24 & 255;
        o[8] = x10 >>> 0 & 255;
        o[9] = x10 >>> 8 & 255;
        o[10] = x10 >>> 16 & 255;
        o[11] = x10 >>> 24 & 255;
        o[12] = x15 >>> 0 & 255;
        o[13] = x15 >>> 8 & 255;
        o[14] = x15 >>> 16 & 255;
        o[15] = x15 >>> 24 & 255;
        o[16] = x6 >>> 0 & 255;
        o[17] = x6 >>> 8 & 255;
        o[18] = x6 >>> 16 & 255;
        o[19] = x6 >>> 24 & 255;
        o[20] = x7 >>> 0 & 255;
        o[21] = x7 >>> 8 & 255;
        o[22] = x7 >>> 16 & 255;
        o[23] = x7 >>> 24 & 255;
        o[24] = x8 >>> 0 & 255;
        o[25] = x8 >>> 8 & 255;
        o[26] = x8 >>> 16 & 255;
        o[27] = x8 >>> 24 & 255;
        o[28] = x9 >>> 0 & 255;
        o[29] = x9 >>> 8 & 255;
        o[30] = x9 >>> 16 & 255;
        o[31] = x9 >>> 24 & 255;
      }
      __name(core_hsalsa20, "core_hsalsa20");
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c);
      }
      __name(crypto_core_salsa20, "crypto_core_salsa20");
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c);
      }
      __name(crypto_core_hsalsa20, "crypto_core_hsalsa20");
      var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
      function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
          mpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
      }
      __name(crypto_stream_salsa20_xor, "crypto_stream_salsa20_xor");
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++) z[i] = 0;
        for (i = 0; i < 8; i++) z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++) c[cpos + i] = x[i];
          u = 1;
          for (i = 8; i < 16; i++) {
            u = u + (z[i] & 255) | 0;
            z[i] = u & 255;
            u >>>= 8;
          }
          b -= 64;
          cpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++) c[cpos + i] = x[i];
        }
        return 0;
      }
      __name(crypto_stream_salsa20, "crypto_stream_salsa20");
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20(c, cpos, d, sn, s);
      }
      __name(crypto_stream, "crypto_stream");
      function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
        return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
      }
      __name(crypto_stream_xor, "crypto_stream_xor");
      var poly1305 = /* @__PURE__ */ __name(function(key) {
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.leftover = 0;
        this.fin = 0;
        var t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 255 | (key[1] & 255) << 8;
        this.r[0] = t0 & 8191;
        t1 = key[2] & 255 | (key[3] & 255) << 8;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        t2 = key[4] & 255 | (key[5] & 255) << 8;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        t3 = key[6] & 255 | (key[7] & 255) << 8;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        t4 = key[8] & 255 | (key[9] & 255) << 8;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        t5 = key[10] & 255 | (key[11] & 255) << 8;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        t6 = key[12] & 255 | (key[13] & 255) << 8;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        t7 = key[14] & 255 | (key[15] & 255) << 8;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
        this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
        this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
        this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
        this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
        this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
        this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
        this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
      }, "poly1305");
      poly1305.prototype.blocks = function(m, mpos, bytes) {
        var hibit = this.fin ? 0 : 1 << 11;
        var t0, t1, t2, t3, t4, t5, t6, t7, c;
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
        var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
        while (bytes >= 16) {
          t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
          h0 += t0 & 8191;
          t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
          h1 += (t0 >>> 13 | t1 << 3) & 8191;
          t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
          h2 += (t1 >>> 10 | t2 << 6) & 8191;
          t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          c = 0;
          d0 = c;
          d0 += h0 * r0;
          d0 += h1 * (5 * r9);
          d0 += h2 * (5 * r8);
          d0 += h3 * (5 * r7);
          d0 += h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5);
          d0 += h6 * (5 * r4);
          d0 += h7 * (5 * r3);
          d0 += h8 * (5 * r2);
          d0 += h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          d1 = c;
          d1 += h0 * r1;
          d1 += h1 * r0;
          d1 += h2 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          d2 = c;
          d2 += h0 * r2;
          d2 += h1 * r1;
          d2 += h2 * r0;
          d2 += h3 * (5 * r9);
          d2 += h4 * (5 * r8);
          c = d2 >>> 13;
          d2 &= 8191;
          d2 += h5 * (5 * r7);
          d2 += h6 * (5 * r6);
          d2 += h7 * (5 * r5);
          d2 += h8 * (5 * r4);
          d2 += h9 * (5 * r3);
          c += d2 >>> 13;
          d2 &= 8191;
          d3 = c;
          d3 += h0 * r3;
          d3 += h1 * r2;
          d3 += h2 * r1;
          d3 += h3 * r0;
          d3 += h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          d4 = c;
          d4 += h0 * r4;
          d4 += h1 * r3;
          d4 += h2 * r2;
          d4 += h3 * r1;
          d4 += h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          d5 = c;
          d5 += h0 * r5;
          d5 += h1 * r4;
          d5 += h2 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          d6 = c;
          d6 += h0 * r6;
          d6 += h1 * r5;
          d6 += h2 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r0;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          d7 = c;
          d7 += h0 * r7;
          d7 += h1 * r6;
          d7 += h2 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r0;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          d8 = c;
          d8 += h0 * r8;
          d8 += h1 * r7;
          d8 += h2 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r0;
          d8 += h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          d9 = c;
          d9 += h0 * r9;
          d9 += h1 * r8;
          d9 += h2 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h0 = d0;
          h1 = d1;
          h2 = d2;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this.h[0] = h0;
        this.h[1] = h1;
        this.h[2] = h2;
        this.h[3] = h3;
        this.h[4] = h4;
        this.h[5] = h5;
        this.h[6] = h6;
        this.h[7] = h7;
        this.h[8] = h8;
        this.h[9] = h9;
      };
      poly1305.prototype.finish = function(mac, macpos) {
        var g = new Uint16Array(10);
        var c, mask, f, i;
        if (this.leftover) {
          i = this.leftover;
          this.buffer[i++] = 1;
          for (; i < 16; i++) this.buffer[i] = 0;
          this.fin = 1;
          this.blocks(this.buffer, 0, 16);
        }
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        for (i = 2; i < 10; i++) {
          this.h[i] += c;
          c = this.h[i] >>> 13;
          this.h[i] &= 8191;
        }
        this.h[0] += c * 5;
        c = this.h[0] >>> 13;
        this.h[0] &= 8191;
        this.h[1] += c;
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        this.h[2] += c;
        g[0] = this.h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 8191;
        for (i = 1; i < 10; i++) {
          g[i] = this.h[i] + c;
          c = g[i] >>> 13;
          g[i] &= 8191;
        }
        g[9] -= 1 << 13;
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++) g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
        this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
        this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
        this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
        this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
        this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
        this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
        this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
        this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
        f = this.h[0] + this.pad[0];
        this.h[0] = f & 65535;
        for (i = 1; i < 8; i++) {
          f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
          this.h[i] = f & 65535;
        }
        mac[macpos + 0] = this.h[0] >>> 0 & 255;
        mac[macpos + 1] = this.h[0] >>> 8 & 255;
        mac[macpos + 2] = this.h[1] >>> 0 & 255;
        mac[macpos + 3] = this.h[1] >>> 8 & 255;
        mac[macpos + 4] = this.h[2] >>> 0 & 255;
        mac[macpos + 5] = this.h[2] >>> 8 & 255;
        mac[macpos + 6] = this.h[3] >>> 0 & 255;
        mac[macpos + 7] = this.h[3] >>> 8 & 255;
        mac[macpos + 8] = this.h[4] >>> 0 & 255;
        mac[macpos + 9] = this.h[4] >>> 8 & 255;
        mac[macpos + 10] = this.h[5] >>> 0 & 255;
        mac[macpos + 11] = this.h[5] >>> 8 & 255;
        mac[macpos + 12] = this.h[6] >>> 0 & 255;
        mac[macpos + 13] = this.h[6] >>> 8 & 255;
        mac[macpos + 14] = this.h[7] >>> 0 & 255;
        mac[macpos + 15] = this.h[7] >>> 8 & 255;
      };
      poly1305.prototype.update = function(m, mpos, bytes) {
        var i, want;
        if (this.leftover) {
          want = 16 - this.leftover;
          if (want > bytes)
            want = bytes;
          for (i = 0; i < want; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          bytes -= want;
          mpos += want;
          this.leftover += want;
          if (this.leftover < 16)
            return;
          this.blocks(this.buffer, 0, 16);
          this.leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this.blocks(m, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (i = 0; i < bytes; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          this.leftover += bytes;
        }
      };
      function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
        var s = new poly1305(k);
        s.update(m, mpos, n);
        s.finish(out, outpos);
        return 0;
      }
      __name(crypto_onetimeauth, "crypto_onetimeauth");
      function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
        var x = new Uint8Array(16);
        crypto_onetimeauth(x, 0, m, mpos, n, k);
        return crypto_verify_16(h, hpos, x, 0);
      }
      __name(crypto_onetimeauth_verify, "crypto_onetimeauth_verify");
      function crypto_secretbox(c, m, d, n, k) {
        var i;
        if (d < 32) return -1;
        crypto_stream_xor(c, 0, m, 0, d, n, k);
        crypto_onetimeauth(c, 16, c, 32, d - 32, c);
        for (i = 0; i < 16; i++) c[i] = 0;
        return 0;
      }
      __name(crypto_secretbox, "crypto_secretbox");
      function crypto_secretbox_open(m, c, d, n, k) {
        var i;
        var x = new Uint8Array(32);
        if (d < 32) return -1;
        crypto_stream(x, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
        crypto_stream_xor(m, 0, c, 0, d, n, k);
        for (i = 0; i < 32; i++) m[i] = 0;
        return 0;
      }
      __name(crypto_secretbox_open, "crypto_secretbox_open");
      function set25519(r, a) {
        var i;
        for (i = 0; i < 16; i++) r[i] = a[i] | 0;
      }
      __name(set25519, "set25519");
      function car25519(o) {
        var i, v, c = 1;
        for (i = 0; i < 16; i++) {
          v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      __name(car25519, "car25519");
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i = 0; i < 16; i++) {
          t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      __name(sel25519, "sel25519");
      function pack25519(o, n) {
        var i, j, b;
        var m = gf(), t = gf();
        for (i = 0; i < 16; i++) t[i] = n[i];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
          m[0] = t[0] - 65517;
          for (i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      __name(pack25519, "pack25519");
      function neq25519(a, b) {
        var c = new Uint8Array(32), d = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d, b);
        return crypto_verify_32(c, 0, d, 0);
      }
      __name(neq25519, "neq25519");
      function par25519(a) {
        var d = new Uint8Array(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      __name(par25519, "par25519");
      function unpack25519(o, n) {
        var i;
        for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 32767;
      }
      __name(unpack25519, "unpack25519");
      function A(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
      }
      __name(A, "A");
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
      }
      __name(Z, "Z");
      function M(o, a, b) {
        var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
      __name(M, "M");
      function S(o, a) {
        M(o, a, a);
      }
      __name(S, "S");
      function inv25519(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 253; a >= 0; a--) {
          S(c, c);
          if (a !== 2 && a !== 4) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      __name(inv25519, "inv25519");
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i[a];
        for (a = 250; a >= 0; a--) {
          S(c, c);
          if (a !== 1) M(c, c, i);
        }
        for (a = 0; a < 16; a++) o[a] = c[a];
      }
      __name(pow2523, "pow2523");
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32);
        var x = new Float64Array(80), r, i;
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
        for (i = 0; i < 31; i++) z[i] = n[i];
        z[31] = n[31] & 127 | 64;
        z[0] &= 248;
        unpack25519(x, p);
        for (i = 0; i < 16; i++) {
          b[i] = x[i];
          d[i] = a[i] = c[i] = 0;
        }
        a[0] = d[0] = 1;
        for (i = 254; i >= 0; --i) {
          r = z[i >>> 3] >>> (i & 7) & 1;
          sel25519(a, b, r);
          sel25519(c, d, r);
          A(e, a, c);
          Z(a, a, c);
          A(c, b, d);
          Z(b, b, d);
          S(d, e);
          S(f, a);
          M(a, c, a);
          M(c, b, e);
          A(e, a, c);
          Z(a, a, c);
          S(b, a);
          Z(c, d, f);
          M(a, c, _121665);
          A(a, a, d);
          M(c, c, a);
          M(a, d, f);
          M(d, b, x);
          S(b, e);
          sel25519(a, b, r);
          sel25519(c, d, r);
        }
        for (i = 0; i < 16; i++) {
          x[i + 16] = a[i];
          x[i + 32] = c[i];
          x[i + 48] = b[i];
          x[i + 64] = d[i];
        }
        var x32 = x.subarray(32);
        var x16 = x.subarray(16);
        inv25519(x32, x32);
        M(x16, x16, x32);
        pack25519(q, x16);
        return 0;
      }
      __name(crypto_scalarmult, "crypto_scalarmult");
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9);
      }
      __name(crypto_scalarmult_base, "crypto_scalarmult_base");
      function crypto_box_keypair(y, x) {
        randombytes(x, 32);
        return crypto_scalarmult_base(y, x);
      }
      __name(crypto_box_keypair, "crypto_box_keypair");
      function crypto_box_beforenm(k, y, x) {
        var s = new Uint8Array(32);
        crypto_scalarmult(s, x, y);
        return crypto_core_hsalsa20(k, _0, s, sigma);
      }
      __name(crypto_box_beforenm, "crypto_box_beforenm");
      var crypto_box_afternm = crypto_secretbox;
      var crypto_box_open_afternm = crypto_secretbox_open;
      function crypto_box(c, m, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_afternm(c, m, d, n, k);
      }
      __name(crypto_box, "crypto_box");
      function crypto_box_open(m, c, d, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_open_afternm(m, c, d, n, k);
      }
      __name(crypto_box_open, "crypto_box_open");
      var K = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function crypto_hashblocks_hl(hh, hl, m, n) {
        var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var pos = 0;
        while (n >= 128) {
          for (i = 0; i < 16; i++) {
            j = 8 * i + pos;
            wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
            wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
          }
          for (i = 0; i < 80; i++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            h = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah4 & ah5 ^ ~ah4 & ah6;
            l = al4 & al5 ^ ~al4 & al6;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 65535 | d << 16;
            tl = a & 65535 | b << 16;
            h = th;
            l = tl;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = c & 65535 | d << 16;
            bl7 = a & 65535 | b << 16;
            h = bh3;
            l = bl3;
            a = l & 65535;
            b = l >>> 16;
            c = h & 65535;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 65535;
            b += l >>> 16;
            c += h & 65535;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = c & 65535 | d << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h = wh[j];
                l = wl[j];
                a = l & 65535;
                b = l >>> 16;
                c = h & 65535;
                d = h >>> 16;
                h = wh[(j + 9) % 16];
                l = wl[(j + 9) % 16];
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l & 65535;
                b += l >>> 16;
                c += h & 65535;
                d += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                wh[j] = c & 65535 | d << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h = ah0;
          l = al0;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[0];
          l = hl[0];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[0] = ah0 = c & 65535 | d << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h = ah1;
          l = al1;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[1];
          l = hl[1];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[1] = ah1 = c & 65535 | d << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h = ah2;
          l = al2;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[2];
          l = hl[2];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[2] = ah2 = c & 65535 | d << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h = ah3;
          l = al3;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[3];
          l = hl[3];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[3] = ah3 = c & 65535 | d << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h = ah4;
          l = al4;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[4];
          l = hl[4];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[4] = ah4 = c & 65535 | d << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h = ah5;
          l = al5;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[5];
          l = hl[5];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[5] = ah5 = c & 65535 | d << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h = ah6;
          l = al6;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[6];
          l = hl[6];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[6] = ah6 = c & 65535 | d << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h & 65535;
          d = h >>> 16;
          h = hh[7];
          l = hl[7];
          a += l & 65535;
          b += l >>> 16;
          c += h & 65535;
          d += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[7] = ah7 = c & 65535 | d << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          n -= 128;
        }
        return n;
      }
      __name(crypto_hashblocks_hl, "crypto_hashblocks_hl");
      function crypto_hash(out, m, n) {
        var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
        hh[0] = 1779033703;
        hh[1] = 3144134277;
        hh[2] = 1013904242;
        hh[3] = 2773480762;
        hh[4] = 1359893119;
        hh[5] = 2600822924;
        hh[6] = 528734635;
        hh[7] = 1541459225;
        hl[0] = 4089235720;
        hl[1] = 2227873595;
        hl[2] = 4271175723;
        hl[3] = 1595750129;
        hl[4] = 2917565137;
        hl[5] = 725511199;
        hl[6] = 4215389547;
        hl[7] = 327033209;
        crypto_hashblocks_hl(hh, hl, m, n);
        n %= 128;
        for (i = 0; i < n; i++) x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
        return 0;
      }
      __name(crypto_hash, "crypto_hash");
      function add(p, q) {
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M(a, a, t);
        A(b, p[0], p[1]);
        A(t, q[0], q[1]);
        M(b, b, t);
        M(c, p[3], q[3]);
        M(c, c, D2);
        M(d, p[2], q[2]);
        A(d, d, d);
        Z(e, b, a);
        Z(f, d, c);
        A(g, d, c);
        A(h, b, a);
        M(p[0], e, f);
        M(p[1], h, g);
        M(p[2], g, f);
        M(p[3], e, h);
      }
      __name(add, "add");
      function cswap(p, q, b) {
        var i;
        for (i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b);
        }
      }
      __name(cswap, "cswap");
      function pack(r, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M(tx, p[0], zi);
        M(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      __name(pack, "pack");
      function scalarmult(p, q, s) {
        var b, i;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i = 255; i >= 0; --i) {
          b = s[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          add(q, p);
          add(p, p);
          cswap(p, q, b);
        }
      }
      __name(scalarmult, "scalarmult");
      function scalarbase(p, s) {
        var q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M(q[3], X, Y);
        scalarmult(p, q, s);
      }
      __name(scalarbase, "scalarbase");
      function crypto_sign_keypair(pk, sk, seeded) {
        var d = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()];
        var i;
        if (!seeded) randombytes(sk, 32);
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
        return 0;
      }
      __name(crypto_sign_keypair, "crypto_sign_keypair");
      var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
      function modL(r, x) {
        var carry, i, j, k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; j++) x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      __name(modL, "modL");
      function reduce(r) {
        var x = new Float64Array(64), i;
        for (i = 0; i < 64; i++) x[i] = r[i];
        for (i = 0; i < 64; i++) r[i] = 0;
        modL(r, x);
      }
      __name(reduce, "reduce");
      function crypto_sign(sm, m, n, sk) {
        var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
        var i, j, x = new Float64Array(64);
        var p = [gf(), gf(), gf(), gf()];
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        var smlen = n + 64;
        for (i = 0; i < n; i++) sm[64 + i] = m[i];
        for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
        crypto_hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; i++) sm[i] = sk[i];
        crypto_hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++) x[i] = 0;
        for (i = 0; i < 32; i++) x[i] = r[i];
        for (i = 0; i < 32; i++) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
          }
        }
        modL(sm.subarray(32), x);
        return smlen;
      }
      __name(crypto_sign, "crypto_sign");
      function unpackneg(r, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        S(num, r[1]);
        M(den, num, D);
        Z(num, num, r[2]);
        A(den, r[2], den);
        S(den2, den);
        S(den4, den2);
        M(den6, den4, den2);
        M(t, den6, num);
        M(t, t, den);
        pow2523(t, t);
        M(t, t, num);
        M(t, t, den);
        M(t, t, den);
        M(r[0], t, den);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) M(r[0], r[0], I);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num)) return -1;
        if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
        M(r[3], r[0], r[1]);
        return 0;
      }
      __name(unpackneg, "unpackneg");
      function crypto_sign_open(m, sm, n, pk) {
        var i;
        var t = new Uint8Array(32), h = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        if (n < 64) return -1;
        if (unpackneg(q, pk)) return -1;
        for (i = 0; i < n; i++) m[i] = sm[i];
        for (i = 0; i < 32; i++) m[i + 32] = pk[i];
        crypto_hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++) m[i] = 0;
          return -1;
        }
        for (i = 0; i < n; i++) m[i] = sm[i + 64];
        return n;
      }
      __name(crypto_sign_open, "crypto_sign_open");
      var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
      nacl3.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M,
        A,
        S,
        Z,
        pow2523,
        add,
        set25519,
        modL,
        scalarmult,
        scalarbase
      };
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
      }
      __name(checkLengths, "checkLengths");
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
      }
      __name(checkBoxLengths, "checkBoxLengths");
      function checkArrayTypes() {
        for (var i = 0; i < arguments.length; i++) {
          if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError("unexpected type, use Uint8Array");
        }
      }
      __name(checkArrayTypes, "checkArrayTypes");
      function cleanup(arr) {
        for (var i = 0; i < arr.length; i++) arr[i] = 0;
      }
      __name(cleanup, "cleanup");
      nacl3.randomBytes = function(n) {
        var b = new Uint8Array(n);
        randombytes(b, n);
        return b;
      };
      nacl3.secretbox = function(msg, nonce, key) {
        checkArrayTypes(msg, nonce, key);
        checkLengths(key, nonce);
        var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
        var c = new Uint8Array(m.length);
        for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
        crypto_secretbox(c, m, m.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl3.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m = new Uint8Array(c.length);
        for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
        if (c.length < 32) return null;
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
        return m.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl3.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl3.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl3.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl3.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl3.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult_base(q, n);
        return q;
      };
      nacl3.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
      nacl3.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
      nacl3.box = function(msg, nonce, publicKey, secretKey) {
        var k = nacl3.box.before(publicKey, secretKey);
        return nacl3.secretbox(msg, nonce, k);
      };
      nacl3.box.before = function(publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey);
        checkBoxLengths(publicKey, secretKey);
        var k = new Uint8Array(crypto_box_BEFORENMBYTES);
        crypto_box_beforenm(k, publicKey, secretKey);
        return k;
      };
      nacl3.box.after = nacl3.secretbox;
      nacl3.box.open = function(msg, nonce, publicKey, secretKey) {
        var k = nacl3.box.before(publicKey, secretKey);
        return nacl3.secretbox.open(msg, nonce, k);
      };
      nacl3.box.open.after = nacl3.secretbox.open;
      nacl3.box.keyPair = function() {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
        crypto_box_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl3.box.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        crypto_scalarmult_base(pk, secretKey);
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl3.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
      nacl3.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
      nacl3.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
      nacl3.box.nonceLength = crypto_box_NONCEBYTES;
      nacl3.box.overheadLength = nacl3.secretbox.overheadLength;
      nacl3.sign = function(msg, secretKey) {
        checkArrayTypes(msg, secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
        crypto_sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
      };
      nacl3.sign.open = function(signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var tmp = new Uint8Array(signedMsg.length);
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0) return null;
        var m = new Uint8Array(mlen);
        for (var i = 0; i < m.length; i++) m[i] = tmp[i];
        return m;
      };
      nacl3.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl3.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
        return sig;
      };
      nacl3.sign.detached.verify = function(msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== crypto_sign_BYTES)
          throw new Error("bad signature size");
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
        var m = new Uint8Array(crypto_sign_BYTES + msg.length);
        var i;
        for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
        for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
      };
      nacl3.sign.keyPair = function() {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        crypto_sign_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl3.sign.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl3.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i = 0; i < 32; i++) sk[i] = seed[i];
        crypto_sign_keypair(pk, sk, true);
        return { publicKey: pk, secretKey: sk };
      };
      nacl3.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
      nacl3.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
      nacl3.sign.seedLength = crypto_sign_SEEDBYTES;
      nacl3.sign.signatureLength = crypto_sign_BYTES;
      nacl3.hash = function(msg) {
        checkArrayTypes(msg);
        var h = new Uint8Array(crypto_hash_BYTES);
        crypto_hash(h, msg, msg.length);
        return h;
      };
      nacl3.hash.hashLength = crypto_hash_BYTES;
      nacl3.verify = function(x, y) {
        checkArrayTypes(x, y);
        if (x.length === 0 || y.length === 0) return false;
        if (x.length !== y.length) return false;
        return vn(x, 0, y, 0, x.length) === 0 ? true : false;
      };
      nacl3.setPRNG = function(fn) {
        randombytes = fn;
      };
      (function() {
        var crypto2 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (crypto2 && crypto2.getRandomValues) {
          var QUOTA = 65536;
          nacl3.setPRNG(function(x, n) {
            var i, v = new Uint8Array(n);
            for (i = 0; i < n; i += QUOTA) {
              crypto2.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
            }
            for (i = 0; i < n; i++) x[i] = v[i];
            cleanup(v);
          });
        } else if (typeof __require !== "undefined") {
          crypto2 = require_crypto();
          if (crypto2 && crypto2.randomBytes) {
            nacl3.setPRNG(function(x, n) {
              var i, v = crypto2.randomBytes(n);
              for (i = 0; i < n; i++) x[i] = v[i];
              cleanup(v);
            });
          }
        }
      })();
    })(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
  }
});

// (disabled):buffer
var require_buffer = __commonJS({
  "(disabled):buffer"() {
  }
});

// node_modules/js-sha256/src/sha256.js
var require_sha256 = __commonJS({
  "node_modules/js-sha256/src/sha256.js"(exports, module) {
    (function() {
      "use strict";
      var ERROR = "input is invalid type";
      var WINDOW = typeof window === "object";
      var root = WINDOW ? window : {};
      if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === "object";
      var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
      if (NODE_JS) {
        root = global;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === "object" && module.exports;
      var AMD = typeof define === "function" && define.amd;
      var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
      var HEX_CHARS = "0123456789abcdef".split("");
      var EXTRA = [-2147483648, 8388608, 32768, 128];
      var SHIFT = [24, 16, 8, 0];
      var K = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ];
      var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];
      var blocks = [];
      if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function(obj) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        };
      }
      if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function(obj) {
          return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }
      var createOutputMethod = /* @__PURE__ */ __name(function(outputType, is224) {
        return function(message2) {
          return new Sha256(is224, true).update(message2)[outputType]();
        };
      }, "createOutputMethod");
      var createMethod = /* @__PURE__ */ __name(function(is224) {
        var method = createOutputMethod("hex", is224);
        if (NODE_JS) {
          method = nodeWrap(method, is224);
        }
        method.create = function() {
          return new Sha256(is224);
        };
        method.update = function(message2) {
          return method.create().update(message2);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type, is224);
        }
        return method;
      }, "createMethod");
      var nodeWrap = /* @__PURE__ */ __name(function(method, is224) {
        var crypto2 = require_crypto();
        var Buffer2 = require_buffer().Buffer;
        var algorithm = is224 ? "sha224" : "sha256";
        var bufferFrom;
        if (Buffer2.from && !root.JS_SHA256_NO_BUFFER_FROM) {
          bufferFrom = Buffer2.from;
        } else {
          bufferFrom = /* @__PURE__ */ __name(function(message2) {
            return new Buffer2(message2);
          }, "bufferFrom");
        }
        var nodeMethod = /* @__PURE__ */ __name(function(message2) {
          if (typeof message2 === "string") {
            return crypto2.createHash(algorithm).update(message2, "utf8").digest("hex");
          } else {
            if (message2 === null || message2 === void 0) {
              throw new Error(ERROR);
            } else if (message2.constructor === ArrayBuffer) {
              message2 = new Uint8Array(message2);
            }
          }
          if (Array.isArray(message2) || ArrayBuffer.isView(message2) || message2.constructor === Buffer2) {
            return crypto2.createHash(algorithm).update(bufferFrom(message2)).digest("hex");
          } else {
            return method(message2);
          }
        }, "nodeMethod");
        return nodeMethod;
      }, "nodeWrap");
      var createHmacOutputMethod = /* @__PURE__ */ __name(function(outputType, is224) {
        return function(key, message2) {
          return new HmacSha256(key, is224, true).update(message2)[outputType]();
        };
      }, "createHmacOutputMethod");
      var createHmacMethod = /* @__PURE__ */ __name(function(is224) {
        var method = createHmacOutputMethod("hex", is224);
        method.create = function(key) {
          return new HmacSha256(key, is224);
        };
        method.update = function(key, message2) {
          return method.create(key).update(message2);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
      }, "createHmacMethod");
      function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (is224) {
          this.h0 = 3238371032;
          this.h1 = 914150663;
          this.h2 = 812702999;
          this.h3 = 4144912697;
          this.h4 = 4290775857;
          this.h5 = 1750603025;
          this.h6 = 1694076839;
          this.h7 = 3204075428;
        } else {
          this.h0 = 1779033703;
          this.h1 = 3144134277;
          this.h2 = 1013904242;
          this.h3 = 2773480762;
          this.h4 = 1359893119;
          this.h5 = 2600822924;
          this.h6 = 528734635;
          this.h7 = 1541459225;
        }
        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
      }
      __name(Sha256, "Sha256");
      Sha256.prototype.update = function(message2) {
        if (this.finalized) {
          return;
        }
        var notString, type = typeof message2;
        if (type !== "string") {
          if (type === "object") {
            if (message2 === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && message2.constructor === ArrayBuffer) {
              message2 = new Uint8Array(message2);
            } else if (!Array.isArray(message2)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(message2)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
          notString = true;
        }
        var code, index = 0, i, length = message2.length, blocks2 = this.blocks;
        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks2[0] = this.block;
            this.block = blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          if (notString) {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks2[i >>> 2] |= message2[index] << SHIFT[i++ & 3];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message2.charCodeAt(index);
              if (code < 128) {
                blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 2048) {
                blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              }
            }
          }
          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.block = blocks2[16];
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };
      Sha256.prototype.finalize = function() {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks2 = this.blocks, i = this.lastByteIndex;
        blocks2[16] = this.block;
        blocks2[i >>> 2] |= EXTRA[i & 3];
        this.block = blocks2[16];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks2[0] = this.block;
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks2[15] = this.bytes << 3;
        this.hash();
      };
      Sha256.prototype.hash = function() {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks2 = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
        for (j = 16; j < 64; ++j) {
          t1 = blocks2[j - 15];
          s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
          t1 = blocks2[j - 2];
          s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
          blocks2[j] = blocks2[j - 16] + s0 + blocks2[j - 7] + s1 << 0;
        }
        bc = b & c;
        for (j = 0; j < 64; j += 4) {
          if (this.first) {
            if (this.is224) {
              ab = 300032;
              t1 = blocks2[0] - 1413257819;
              h = t1 - 150054599 << 0;
              d = t1 + 24177077 << 0;
            } else {
              ab = 704751109;
              t1 = blocks2[0] - 210244248;
              h = t1 - 1521486534 << 0;
              d = t1 + 143694565 << 0;
            }
            this.first = false;
          } else {
            s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
            s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
            ab = a & b;
            maj = ab ^ a & c ^ bc;
            ch = e & f ^ ~e & g;
            t1 = h + s1 + ch + K[j] + blocks2[j];
            t2 = s0 + maj;
            h = d + t1 << 0;
            d = t1 + t2 << 0;
          }
          s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
          s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
          da = d & a;
          maj = da ^ d & b ^ ab;
          ch = h & e ^ ~h & f;
          t1 = g + s1 + ch + K[j + 1] + blocks2[j + 1];
          t2 = s0 + maj;
          g = c + t1 << 0;
          c = t1 + t2 << 0;
          s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
          s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
          cd = c & d;
          maj = cd ^ c & a ^ da;
          ch = g & h ^ ~g & e;
          t1 = f + s1 + ch + K[j + 2] + blocks2[j + 2];
          t2 = s0 + maj;
          f = b + t1 << 0;
          b = t1 + t2 << 0;
          s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
          s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
          bc = b & c;
          maj = bc ^ b & d ^ cd;
          ch = f & g ^ ~f & h;
          t1 = e + s1 + ch + K[j + 3] + blocks2[j + 3];
          t2 = s0 + maj;
          e = a + t1 << 0;
          a = t1 + t2 << 0;
          this.chromeBugWorkAround = true;
        }
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
      };
      Sha256.prototype.hex = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
        if (!this.is224) {
          hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
        }
        return hex;
      };
      Sha256.prototype.toString = Sha256.prototype.hex;
      Sha256.prototype.digest = function() {
        this.finalize();
        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
        var arr = [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 & 255
        ];
        if (!this.is224) {
          arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
        }
        return arr;
      };
      Sha256.prototype.array = Sha256.prototype.digest;
      Sha256.prototype.arrayBuffer = function() {
        this.finalize();
        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
          dataView.setUint32(28, this.h7);
        }
        return buffer;
      };
      function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === "string") {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 128) {
              bytes[index++] = code;
            } else if (code < 2048) {
              bytes[index++] = 192 | code >>> 6;
              bytes[index++] = 128 | code & 63;
            } else if (code < 55296 || code >= 57344) {
              bytes[index++] = 224 | code >>> 12;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            } else {
              code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
              bytes[index++] = 240 | code >>> 18;
              bytes[index++] = 128 | code >>> 12 & 63;
              bytes[index++] = 128 | code >>> 6 & 63;
              bytes[index++] = 128 | code & 63;
            }
          }
          key = bytes;
        } else {
          if (type === "object") {
            if (key === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
              key = new Uint8Array(key);
            } else if (!Array.isArray(key)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
        }
        if (key.length > 64) {
          key = new Sha256(is224, true).update(key).array();
        }
        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 92 ^ b;
          iKeyPad[i] = 54 ^ b;
        }
        Sha256.call(this, is224, sharedMemory);
        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      __name(HmacSha256, "HmacSha256");
      HmacSha256.prototype = new Sha256();
      HmacSha256.prototype.finalize = function() {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Sha256.call(this, this.is224, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Sha256.prototype.finalize.call(this);
        }
      };
      var exports2 = createMethod();
      exports2.sha256 = exports2;
      exports2.sha224 = createMethod(true);
      exports2.sha256.hmac = createHmacMethod();
      exports2.sha224.hmac = createHmacMethod(true);
      if (COMMON_JS) {
        module.exports = exports2;
      } else {
        root.sha256 = exports2.sha256;
        root.sha224 = exports2.sha224;
        if (AMD) {
          define(function() {
            return exports2;
          });
        }
      }
    })();
  }
});

// node_modules/jose/dist/browser/runtime/webcrypto.js
var webcrypto_default = crypto;
var isCryptoKey = /* @__PURE__ */ __name((key) => key instanceof CryptoKey, "isCryptoKey");

// node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
__name(concat, "concat");

// node_modules/jose/dist/browser/runtime/base64url.js
var encodeBase64 = /* @__PURE__ */ __name((input) => {
  let unencoded = input;
  if (typeof unencoded === "string") {
    unencoded = encoder.encode(unencoded);
  }
  const CHUNK_SIZE = 32768;
  const arr = [];
  for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
    arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
  }
  return btoa(arr.join(""));
}, "encodeBase64");
var encode = /* @__PURE__ */ __name((input) => {
  return encodeBase64(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}, "encode");
var decodeBase64 = /* @__PURE__ */ __name((encoded) => {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}, "decodeBase64");
var decode = /* @__PURE__ */ __name((input) => {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}, "decode");

// node_modules/jose/dist/browser/util/errors.js
var JOSEError = class extends Error {
  static {
    __name(this, "JOSEError");
  }
  constructor(message2, options) {
    super(message2, options);
    this.code = "ERR_JOSE_GENERIC";
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
JOSEError.code = "ERR_JOSE_GENERIC";
var JWTClaimValidationFailed = class extends JOSEError {
  static {
    __name(this, "JWTClaimValidationFailed");
  }
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
JWTClaimValidationFailed.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
var JWTExpired = class extends JOSEError {
  static {
    __name(this, "JWTExpired");
  }
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_EXPIRED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
JWTExpired.code = "ERR_JWT_EXPIRED";
var JOSEAlgNotAllowed = class extends JOSEError {
  static {
    __name(this, "JOSEAlgNotAllowed");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
};
JOSEAlgNotAllowed.code = "ERR_JOSE_ALG_NOT_ALLOWED";
var JOSENotSupported = class extends JOSEError {
  static {
    __name(this, "JOSENotSupported");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
};
JOSENotSupported.code = "ERR_JOSE_NOT_SUPPORTED";
var JWEDecryptionFailed = class extends JOSEError {
  static {
    __name(this, "JWEDecryptionFailed");
  }
  constructor(message2 = "decryption operation failed", options) {
    super(message2, options);
    this.code = "ERR_JWE_DECRYPTION_FAILED";
  }
};
JWEDecryptionFailed.code = "ERR_JWE_DECRYPTION_FAILED";
var JWEInvalid = class extends JOSEError {
  static {
    __name(this, "JWEInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWE_INVALID";
  }
};
JWEInvalid.code = "ERR_JWE_INVALID";
var JWSInvalid = class extends JOSEError {
  static {
    __name(this, "JWSInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWS_INVALID";
  }
};
JWSInvalid.code = "ERR_JWS_INVALID";
var JWTInvalid = class extends JOSEError {
  static {
    __name(this, "JWTInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWT_INVALID";
  }
};
JWTInvalid.code = "ERR_JWT_INVALID";
var JWKInvalid = class extends JOSEError {
  static {
    __name(this, "JWKInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWK_INVALID";
  }
};
JWKInvalid.code = "ERR_JWK_INVALID";
var JWKSInvalid = class extends JOSEError {
  static {
    __name(this, "JWKSInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_INVALID";
  }
};
JWKSInvalid.code = "ERR_JWKS_INVALID";
var JWKSNoMatchingKey = class extends JOSEError {
  static {
    __name(this, "JWKSNoMatchingKey");
  }
  constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_NO_MATCHING_KEY";
  }
};
JWKSNoMatchingKey.code = "ERR_JWKS_NO_MATCHING_KEY";
var JWKSMultipleMatchingKeys = class extends JOSEError {
  static {
    __name(this, "JWKSMultipleMatchingKeys");
  }
  constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
};
JWKSMultipleMatchingKeys.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
var JWKSTimeout = class extends JOSEError {
  static {
    __name(this, "JWKSTimeout");
  }
  constructor(message2 = "request timed out", options) {
    super(message2, options);
    this.code = "ERR_JWKS_TIMEOUT";
  }
};
JWKSTimeout.code = "ERR_JWKS_TIMEOUT";
var JWSSignatureVerificationFailed = class extends JOSEError {
  static {
    __name(this, "JWSSignatureVerificationFailed");
  }
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
    this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
};
JWSSignatureVerificationFailed.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

// node_modules/jose/dist/browser/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
__name(unusable, "unusable");
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
__name(isAlgorithm, "isAlgorithm");
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
__name(getHashLength, "getHashLength");
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
__name(getNamedCurve, "getNamedCurve");
function checkUsage(key, usages) {
  if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
    let msg = "CryptoKey does not support this operation, its usages must include ";
    if (usages.length > 2) {
      const last = usages.pop();
      msg += `one of ${usages.join(", ")}, or ${last}.`;
    } else if (usages.length === 2) {
      msg += `one of ${usages[0]} or ${usages[1]}.`;
    } else {
      msg += `${usages[0]}.`;
    }
    throw new TypeError(msg);
  }
}
__name(checkUsage, "checkUsage");
function checkSigCryptoKey(key, alg, ...usages) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
        throw unusable("Ed25519 or Ed448");
      }
      break;
    }
    case "Ed25519": {
      if (!isAlgorithm(key.algorithm, "Ed25519"))
        throw unusable("Ed25519");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usages);
}
__name(checkSigCryptoKey, "checkSigCryptoKey");

// node_modules/jose/dist/browser/lib/invalid_key_input.js
function message(msg, actual, ...types2) {
  types2 = types2.filter(Boolean);
  if (types2.length > 2) {
    const last = types2.pop();
    msg += `one of type ${types2.join(", ")}, or ${last}.`;
  } else if (types2.length === 2) {
    msg += `one of type ${types2[0]} or ${types2[1]}.`;
  } else {
    msg += `of type ${types2[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
__name(message, "message");
var invalid_key_input_default = /* @__PURE__ */ __name((actual, ...types2) => {
  return message("Key must be ", actual, ...types2);
}, "default");
function withAlg(alg, actual, ...types2) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types2);
}
__name(withAlg, "withAlg");

// node_modules/jose/dist/browser/runtime/is_key_like.js
var is_key_like_default = /* @__PURE__ */ __name((key) => {
  if (isCryptoKey(key)) {
    return true;
  }
  return key?.[Symbol.toStringTag] === "KeyObject";
}, "default");
var types = ["CryptoKey"];

// node_modules/jose/dist/browser/lib/is_disjoint.js
var isDisjoint = /* @__PURE__ */ __name((...headers) => {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}, "isDisjoint");
var is_disjoint_default = isDisjoint;

// node_modules/jose/dist/browser/lib/is_object.js
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
__name(isObjectLike, "isObjectLike");
function isObject(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}
__name(isObject, "isObject");

// node_modules/jose/dist/browser/runtime/check_key_length.js
var check_key_length_default = /* @__PURE__ */ __name((alg, key) => {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
}, "default");

// node_modules/jose/dist/browser/lib/is_jwk.js
function isJWK(key) {
  return isObject(key) && typeof key.kty === "string";
}
__name(isJWK, "isJWK");
function isPrivateJWK(key) {
  return key.kty !== "oct" && typeof key.d === "string";
}
__name(isPrivateJWK, "isPrivateJWK");
function isPublicJWK(key) {
  return key.kty !== "oct" && typeof key.d === "undefined";
}
__name(isPublicJWK, "isPublicJWK");
function isSecretJWK(key) {
  return isJWK(key) && key.kty === "oct" && typeof key.k === "string";
}
__name(isSecretJWK, "isSecretJWK");

// node_modules/jose/dist/browser/runtime/jwk_to_key.js
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "EdDSA":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
__name(subtleMapping, "subtleMapping");
var parse = /* @__PURE__ */ __name(async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const rest = [
    algorithm,
    jwk.ext ?? false,
    jwk.key_ops ?? keyUsages
  ];
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return webcrypto_default.subtle.importKey("jwk", keyData, ...rest);
}, "parse");
var jwk_to_key_default = parse;

// node_modules/jose/dist/browser/runtime/normalize_key.js
var exportKeyValue = /* @__PURE__ */ __name((k) => decode(k), "exportKeyValue");
var privCache;
var pubCache;
var isKeyObject = /* @__PURE__ */ __name((key) => {
  return key?.[Symbol.toStringTag] === "KeyObject";
}, "isKeyObject");
var importAndCache = /* @__PURE__ */ __name(async (cache, key, jwk, alg, freeze = false) => {
  let cached = cache.get(key);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const cryptoKey = await jwk_to_key_default({ ...jwk, alg });
  if (freeze)
    Object.freeze(key);
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
}, "importAndCache");
var normalizePublicKey = /* @__PURE__ */ __name((key, alg) => {
  if (isKeyObject(key)) {
    let jwk = key.export({ format: "jwk" });
    delete jwk.d;
    delete jwk.dp;
    delete jwk.dq;
    delete jwk.p;
    delete jwk.q;
    delete jwk.qi;
    if (jwk.k) {
      return exportKeyValue(jwk.k);
    }
    pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
    return importAndCache(pubCache, key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k)
      return decode(key.k);
    pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
    const cryptoKey = importAndCache(pubCache, key, key, alg, true);
    return cryptoKey;
  }
  return key;
}, "normalizePublicKey");
var normalizePrivateKey = /* @__PURE__ */ __name((key, alg) => {
  if (isKeyObject(key)) {
    let jwk = key.export({ format: "jwk" });
    if (jwk.k) {
      return exportKeyValue(jwk.k);
    }
    privCache || (privCache = /* @__PURE__ */ new WeakMap());
    return importAndCache(privCache, key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k)
      return decode(key.k);
    privCache || (privCache = /* @__PURE__ */ new WeakMap());
    const cryptoKey = importAndCache(privCache, key, key, alg, true);
    return cryptoKey;
  }
  return key;
}, "normalizePrivateKey");
var normalize_key_default = { normalizePublicKey, normalizePrivateKey };

// node_modules/jose/dist/browser/key/import.js
async function importJWK(jwk, alg) {
  if (!isObject(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  alg || (alg = jwk.alg);
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      if ("oth" in jwk && jwk.oth !== void 0) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
      }
    case "EC":
    case "OKP":
      return jwk_to_key_default({ ...jwk, alg });
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
  }
}
__name(importJWK, "importJWK");

// node_modules/jose/dist/browser/lib/check_key_type.js
var tag = /* @__PURE__ */ __name((key) => key?.[Symbol.toStringTag], "tag");
var jwkMatchesOp = /* @__PURE__ */ __name((alg, key, usage) => {
  if (key.use !== void 0 && key.use !== "sig") {
    throw new TypeError("Invalid key for this operation, when present its use must be sig");
  }
  if (key.key_ops !== void 0 && key.key_ops.includes?.(usage) !== true) {
    throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
  }
  if (key.alg !== void 0 && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
  }
  return true;
}, "jwkMatchesOp");
var symmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage, allowJwk) => {
  if (key instanceof Uint8Array)
    return;
  if (allowJwk && isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
      return;
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, "Uint8Array", allowJwk ? "JSON Web Key" : null));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
}, "symmetricTypeCheck");
var asymmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage, allowJwk) => {
  if (allowJwk && isJWK(key)) {
    switch (usage) {
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a private JWK`);
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a public JWK`);
    }
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, allowJwk ? "JSON Web Key" : null));
  }
  if (key.type === "secret") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (usage === "sign" && key.type === "public") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
  }
  if (usage === "decrypt" && key.type === "public") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
  }
  if (key.algorithm && usage === "verify" && key.type === "private") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
  }
  if (key.algorithm && usage === "encrypt" && key.type === "private") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
  }
}, "asymmetricTypeCheck");
function checkKeyType(allowJwk, alg, key, usage) {
  const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
  if (symmetric) {
    symmetricTypeCheck(alg, key, usage, allowJwk);
  } else {
    asymmetricTypeCheck(alg, key, usage, allowJwk);
  }
}
__name(checkKeyType, "checkKeyType");
var check_key_type_default = checkKeyType.bind(void 0, false);
var checkKeyTypeWithJwk = checkKeyType.bind(void 0, true);

// node_modules/jose/dist/browser/lib/validate_crit.js
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}
__name(validateCrit, "validateCrit");
var validate_crit_default = validateCrit;

// node_modules/jose/dist/browser/lib/validate_algorithms.js
var validateAlgorithms = /* @__PURE__ */ __name((option, algorithms) => {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
}, "validateAlgorithms");
var validate_algorithms_default = validateAlgorithms;

// node_modules/jose/dist/browser/runtime/subtle_dsa.js
function subtleDsa(alg, algorithm) {
  const hash = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash, name: "RSA-PSS", saltLength: alg.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "Ed25519":
      return { name: "Ed25519" };
    case "EdDSA":
      return { name: algorithm.name };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}
__name(subtleDsa, "subtleDsa");

// node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
async function getCryptoKey(alg, key, usage) {
  if (usage === "sign") {
    key = await normalize_key_default.normalizePrivateKey(key, alg);
  }
  if (usage === "verify") {
    key = await normalize_key_default.normalizePublicKey(key, alg);
  }
  if (isCryptoKey(key)) {
    checkSigCryptoKey(key, alg, usage);
    return key;
  }
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalid_key_input_default(key, ...types));
    }
    return webcrypto_default.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  throw new TypeError(invalid_key_input_default(key, ...types, "Uint8Array", "JSON Web Key"));
}
__name(getCryptoKey, "getCryptoKey");

// node_modules/jose/dist/browser/runtime/verify.js
var verify = /* @__PURE__ */ __name(async (alg, key, signature, data) => {
  const cryptoKey = await getCryptoKey(alg, key, "verify");
  check_key_length_default(alg, cryptoKey);
  const algorithm = subtleDsa(alg, cryptoKey.algorithm);
  try {
    return await webcrypto_default.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
}, "verify");
var verify_default = verify;

// node_modules/jose/dist/browser/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !isObject(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
    checkKeyTypeWithJwk(alg, key, "verify");
    if (isJWK(key)) {
      key = await importJWK(key, alg);
    }
  } else {
    checkKeyTypeWithJwk(alg, key, "verify");
  }
  const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  let signature;
  try {
    signature = decode(jws.signature);
  } catch {
    throw new JWSInvalid("Failed to base64url decode the signature");
  }
  const verified = await verify_default(alg, key, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    try {
      payload = decode(jws.payload);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the payload");
    }
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key };
  }
  return result;
}
__name(flattenedVerify, "flattenedVerify");

// node_modules/jose/dist/browser/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(compactVerify, "compactVerify");

// node_modules/jose/dist/browser/lib/epoch.js
var epoch_default = /* @__PURE__ */ __name((date) => Math.floor(date.getTime() / 1e3), "default");

// node_modules/jose/dist/browser/lib/secs.js
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = /* @__PURE__ */ __name((str) => {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}, "default");

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
var normalizeTyp = /* @__PURE__ */ __name((value) => value.toLowerCase().replace(/^application\//, ""), "normalizeTyp");
var checkAudiencePresence = /* @__PURE__ */ __name((audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
}, "checkAudiencePresence");
var jwt_claims_set_default = /* @__PURE__ */ __name((protectedHeader, encodedPayload, options = {}) => {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch_default(currentDate || /* @__PURE__ */ new Date());
  if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}, "default");

// node_modules/jose/dist/browser/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = jwt_claims_set_default(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(jwtVerify, "jwtVerify");

// node_modules/jose/dist/browser/runtime/sign.js
var sign = /* @__PURE__ */ __name(async (alg, key, data) => {
  const cryptoKey = await getCryptoKey(alg, key, "sign");
  check_key_length_default(alg, cryptoKey);
  const signature = await webcrypto_default.subtle.sign(subtleDsa(alg, cryptoKey.algorithm), cryptoKey, data);
  return new Uint8Array(signature);
}, "sign");
var sign_default = sign;

// node_modules/jose/dist/browser/jws/flattened/sign.js
var FlattenedSign = class {
  static {
    __name(this, "FlattenedSign");
  }
  constructor(payload) {
    if (!(payload instanceof Uint8Array)) {
      throw new TypeError("payload must be an instance of Uint8Array");
    }
    this._payload = payload;
  }
  setProtectedHeader(protectedHeader) {
    if (this._protectedHeader) {
      throw new TypeError("setProtectedHeader can only be called once");
    }
    this._protectedHeader = protectedHeader;
    return this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    if (this._unprotectedHeader) {
      throw new TypeError("setUnprotectedHeader can only be called once");
    }
    this._unprotectedHeader = unprotectedHeader;
    return this;
  }
  async sign(key, options) {
    if (!this._protectedHeader && !this._unprotectedHeader) {
      throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    }
    if (!is_disjoint_default(this._protectedHeader, this._unprotectedHeader)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
      ...this._protectedHeader,
      ...this._unprotectedHeader
    };
    const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, this._protectedHeader, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
      b64 = this._protectedHeader.b64;
      if (typeof b64 !== "boolean") {
        throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
    }
    const { alg } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    checkKeyTypeWithJwk(alg, key, "sign");
    let payload = this._payload;
    if (b64) {
      payload = encoder.encode(encode(payload));
    }
    let protectedHeader;
    if (this._protectedHeader) {
      protectedHeader = encoder.encode(encode(JSON.stringify(this._protectedHeader)));
    } else {
      protectedHeader = encoder.encode("");
    }
    const data = concat(protectedHeader, encoder.encode("."), payload);
    const signature = await sign_default(alg, key, data);
    const jws = {
      signature: encode(signature),
      payload: ""
    };
    if (b64) {
      jws.payload = decoder.decode(payload);
    }
    if (this._unprotectedHeader) {
      jws.header = this._unprotectedHeader;
    }
    if (this._protectedHeader) {
      jws.protected = decoder.decode(protectedHeader);
    }
    return jws;
  }
};

// node_modules/jose/dist/browser/jws/compact/sign.js
var CompactSign = class {
  static {
    __name(this, "CompactSign");
  }
  constructor(payload) {
    this._flattened = new FlattenedSign(payload);
  }
  setProtectedHeader(protectedHeader) {
    this._flattened.setProtectedHeader(protectedHeader);
    return this;
  }
  async sign(key, options) {
    const jws = await this._flattened.sign(key, options);
    if (jws.payload === void 0) {
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    }
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }
};

// node_modules/jose/dist/browser/jwt/produce.js
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
__name(validateInput, "validateInput");
var ProduceJWT = class {
  static {
    __name(this, "ProduceJWT");
  }
  constructor(payload = {}) {
    if (!isObject(payload)) {
      throw new TypeError("JWT Claims Set MUST be an object");
    }
    this._payload = payload;
  }
  setIssuer(issuer) {
    this._payload = { ...this._payload, iss: issuer };
    return this;
  }
  setSubject(subject) {
    this._payload = { ...this._payload, sub: subject };
    return this;
  }
  setAudience(audience) {
    this._payload = { ...this._payload, aud: audience };
    return this;
  }
  setJti(jwtId) {
    this._payload = { ...this._payload, jti: jwtId };
    return this;
  }
  setNotBefore(input) {
    if (typeof input === "number") {
      this._payload = { ...this._payload, nbf: validateInput("setNotBefore", input) };
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, nbf: validateInput("setNotBefore", epoch_default(input)) };
    } else {
      this._payload = { ...this._payload, nbf: epoch_default(/* @__PURE__ */ new Date()) + secs_default(input) };
    }
    return this;
  }
  setExpirationTime(input) {
    if (typeof input === "number") {
      this._payload = { ...this._payload, exp: validateInput("setExpirationTime", input) };
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, exp: validateInput("setExpirationTime", epoch_default(input)) };
    } else {
      this._payload = { ...this._payload, exp: epoch_default(/* @__PURE__ */ new Date()) + secs_default(input) };
    }
    return this;
  }
  setIssuedAt(input) {
    if (typeof input === "undefined") {
      this._payload = { ...this._payload, iat: epoch_default(/* @__PURE__ */ new Date()) };
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, iat: validateInput("setIssuedAt", epoch_default(input)) };
    } else if (typeof input === "string") {
      this._payload = {
        ...this._payload,
        iat: validateInput("setIssuedAt", epoch_default(/* @__PURE__ */ new Date()) + secs_default(input))
      };
    } else {
      this._payload = { ...this._payload, iat: validateInput("setIssuedAt", input) };
    }
    return this;
  }
};

// node_modules/jose/dist/browser/jwt/sign.js
var SignJWT = class extends ProduceJWT {
  static {
    __name(this, "SignJWT");
  }
  setProtectedHeader(protectedHeader) {
    this._protectedHeader = protectedHeader;
    return this;
  }
  async sign(key, options) {
    const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)));
    sig.setProtectedHeader(this._protectedHeader);
    if (Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    return sig.sign(key, options);
  }
};

// src/authentication/auth.js
var import_tweetnacl = __toESM(require_nacl_fast());

// src/pages/login.js
async function renderLoginPage() {
  const loginPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${atob("QlBC")} Login</title>
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
            <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
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
    </html>`;
  return new Response(loginPage, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Access-Control-Allow-Origin": globalThis.urlOrigin,
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, no-transform",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(renderLoginPage, "renderLoginPage");

// src/authentication/auth.js
async function generateJWTToken(request, env) {
  const password = await request.text();
  const savedPass = await env.kv.get("pwd");
  if (password !== savedPass) return new Response("Method Not Allowed", { status: 405 });
  let secretKey = await env.kv.get("secretKey");
  if (!secretKey) {
    secretKey = generateSecretKey();
    await env.kv.put("secretKey", secretKey);
  }
  const secret = new TextEncoder().encode(secretKey);
  const jwtToken = await new SignJWT({ userID: globalThis.userID }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(secret);
  return new Response("Success", {
    status: 200,
    headers: {
      "Set-Cookie": `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`,
      "Content-Type": "text/plain"
    }
  });
}
__name(generateJWTToken, "generateJWTToken");
function generateSecretKey() {
  const key = import_tweetnacl.default.randomBytes(32);
  return Array.from(key, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
__name(generateSecretKey, "generateSecretKey");
async function Authenticate(request, env) {
  try {
    const secretKey = await env.kv.get("secretKey");
    const secret = new TextEncoder().encode(secretKey);
    const cookie = request.headers.get("Cookie")?.match(/(^|;\s*)jwtToken=([^;]*)/);
    const token = cookie ? cookie[2] : null;
    if (!token) {
      console.log("Unauthorized: Token not available!");
      return false;
    }
    const { payload } = await jwtVerify(token, secret);
    console.log(`Successfully authenticated, User ID: ${payload.userID}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
__name(Authenticate, "Authenticate");
function logout() {
  return new Response("Success", {
    status: 200,
    headers: {
      "Set-Cookie": "jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "Content-Type": "text/plain"
    }
  });
}
__name(logout, "logout");
async function resetPassword(request, env) {
  let auth = await Authenticate(request, env);
  const oldPwd = await env.kv.get("pwd");
  if (oldPwd && !auth) return new Response("Unauthorized!", { status: 401 });
  const newPwd = await request.text();
  if (newPwd === oldPwd) return new Response("Please enter a new Password!", { status: 400 });
  await env.kv.put("pwd", newPwd);
  return new Response("Success", {
    status: 200,
    headers: {
      "Set-Cookie": "jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "Content-Type": "text/plain"
    }
  });
}
__name(resetPassword, "resetPassword");
async function login(request, env) {
  const auth = await Authenticate(request, env);
  if (auth) return Response.redirect(`${globalThis.urlOrigin}/panel`, 302);
  if (request.method === "POST") return await generateJWTToken(request, env);
  return await renderLoginPage();
}
__name(login, "login");

// src/cores-configs/helpers.js
async function getConfigAddresses(cleanIPs, enableIPv6) {
  const resolved = await resolveDNS(globalThis.hostName);
  const defaultIPv6 = enableIPv6 ? resolved.ipv6.map((ip) => `[${ip}]`) : [];
  return [
    globalThis.hostName,
    "www.speedtest.net",
    ...resolved.ipv4,
    ...defaultIPv6,
    ...cleanIPs ? cleanIPs.split(",") : []
  ];
}
__name(getConfigAddresses, "getConfigAddresses");
function extractWireguardParams(warpConfigs, isWoW) {
  const index = isWoW ? 1 : 0;
  const warpConfig = warpConfigs[index].account.config;
  return {
    warpIPv6: `${warpConfig.interface.addresses.v6}/128`,
    reserved: warpConfig.client_id,
    publicKey: warpConfig.peers[0].public_key,
    privateKey: warpConfigs[index].privateKey
  };
}
__name(extractWireguardParams, "extractWireguardParams");
function generateRemark(index, port, address, cleanIPs, protocol, configType) {
  let addressType;
  const type = configType ? ` ${configType}` : "";
  cleanIPs.includes(address) ? addressType = "Clean IP" : addressType = isDomain(address) ? "Domain" : isIPv4(address) ? "IPv4" : isIPv6(address) ? "IPv6" : "";
  return `\u{1F4A6} ${index} - ${protocol}${type} - ${addressType} : ${port}`;
}
__name(generateRemark, "generateRemark");
function randomUpperCase(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i];
  }
  return result;
}
__name(randomUpperCase, "randomUpperCase");
function getRandomPath(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
__name(getRandomPath, "getRandomPath");
function base64ToDecimal(base64) {
  const binaryString = atob(base64);
  const hexString = Array.from(binaryString).map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  const decimalArray = hexString.match(/.{2}/g).map((hex) => parseInt(hex, 16));
  return decimalArray;
}
__name(base64ToDecimal, "base64ToDecimal");
function isIPv4(address) {
  const ipv4Pattern = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
  return ipv4Pattern.test(address);
}
__name(isIPv4, "isIPv4");
function isIPv6(address) {
  const ipv6Pattern = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/;
  return ipv6Pattern.test(address);
}
__name(isIPv6, "isIPv6");
function getDomain(url) {
  const newUrl = new URL(url);
  const host = newUrl.hostname;
  const isHostDomain = isDomain(host);
  return { host, isHostDomain };
}
__name(getDomain, "getDomain");

// src/protocols/warp.js
var import_tweetnacl2 = __toESM(require_nacl_fast());
async function fetchWarpConfigs(env) {
  let warpConfigs = [];
  const apiBaseUrl = "https://api.cloudflareclient.com/v0a4005/reg";
  const warpKeys = [generateKeyPair(), generateKeyPair()];
  const commonPayload = {
    install_id: "",
    fcm_token: "",
    tos: (/* @__PURE__ */ new Date()).toISOString(),
    type: "Android",
    model: "PC",
    locale: "en_US",
    warp_enabled: true
  };
  const fetchAccount = /* @__PURE__ */ __name(async (key) => {
    const response = await fetch(apiBaseUrl, {
      method: "POST",
      headers: {
        "User-Agent": "insomnia/8.6.1",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...commonPayload, key: key.publicKey })
    });
    return await response.json();
  }, "fetchAccount");
  for (const key of warpKeys) {
    const accountData = await fetchAccount(key);
    warpConfigs.push({
      privateKey: key.privateKey,
      account: accountData
    });
  }
  const configs = JSON.stringify(warpConfigs);
  await env.kv.put("warpConfigs", configs);
  return { error: null, configs };
}
__name(fetchWarpConfigs, "fetchWarpConfigs");
var generateKeyPair = /* @__PURE__ */ __name(() => {
  const base64Encode = /* @__PURE__ */ __name((array) => btoa(String.fromCharCode.apply(null, array)), "base64Encode");
  let privateKey = import_tweetnacl2.default.randomBytes(32);
  privateKey[0] &= 248;
  privateKey[31] &= 127;
  privateKey[31] |= 64;
  let publicKey = import_tweetnacl2.default.scalarMult.base(privateKey);
  const publicKeyBase64 = base64Encode(publicKey);
  const privateKeyBase64 = base64Encode(privateKey);
  return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
}, "generateKeyPair");

// src/kv/handlers.js
async function getDataset(request, env) {
  let proxySettings, warpConfigs;
  try {
    proxySettings = await env.kv.get("proxySettings", { type: "json" });
    warpConfigs = await env.kv.get("warpConfigs", { type: "json" });
  } catch (error) {
    console.log(error);
    throw new Error(`An error occurred while getting KV - ${error}`);
  }
  if (!proxySettings) {
    proxySettings = await updateDataset(request, env);
    const { error, configs } = await fetchWarpConfigs(env, proxySettings);
    if (error) throw new Error(`An error occurred while getting Warp configs - ${error}`);
    warpConfigs = configs;
  }
  if (globalThis.panelVersion !== proxySettings.panelVersion) proxySettings = await updateDataset(request, env);
  return { proxySettings, warpConfigs };
}
__name(getDataset, "getDataset");
async function updateDataset(request, env) {
  let newSettings = request.method === "POST" ? await request.formData() : null;
  const isReset = newSettings?.get("resetSettings") === "true";
  let currentSettings;
  let udpNoises = [];
  if (!isReset) {
    try {
      currentSettings = await env.kv.get("proxySettings", { type: "json" });
    } catch (error) {
      console.log(error);
      throw new Error(`An error occurred while getting current KV settings - ${error}`);
    }
    const udpNoiseModes = newSettings?.getAll("udpXrayNoiseMode") || [];
    const udpNoisePackets = newSettings?.getAll("udpXrayNoisePacket") || [];
    const udpNoiseDelaysMin = newSettings?.getAll("udpXrayNoiseDelayMin") || [];
    const udpNoiseDelaysMax = newSettings?.getAll("udpXrayNoiseDelayMax") || [];
    const udpNoiseCount = newSettings?.getAll("udpXrayNoiseCount") || [];
    udpNoises.push(...udpNoiseModes.map((mode, index) => ({
      type: mode,
      packet: udpNoisePackets[index],
      delay: `${udpNoiseDelaysMin[index]}-${udpNoiseDelaysMax[index]}`,
      count: udpNoiseCount[index]
    })));
  } else {
    newSettings = null;
  }
  const validateField = /* @__PURE__ */ __name((field) => {
    const fieldValue = newSettings?.get(field);
    if (fieldValue === void 0) return null;
    if (fieldValue === "true") return true;
    if (fieldValue === "false") return false;
    return fieldValue;
  }, "validateField");
  const proxySettings = {
    remoteDNS: validateField("remoteDNS") ?? currentSettings?.remoteDNS ?? "https://8.8.8.8/dns-query",
    localDNS: validateField("localDNS") ?? currentSettings?.localDNS ?? "8.8.8.8",
    VLTRFakeDNS: validateField("VLTRFakeDNS") ?? currentSettings?.VLTRFakeDNS ?? false,
    proxyIP: validateField("proxyIP")?.replaceAll(" ", "") ?? currentSettings?.proxyIP ?? "",
    outProxy: validateField("outProxy") ?? currentSettings?.outProxy ?? "",
    outProxyParams: extractChainProxyParams(validateField("outProxy")) ?? currentSettings?.outProxyParams ?? {},
    cleanIPs: validateField("cleanIPs")?.replaceAll(" ", "") ?? currentSettings?.cleanIPs ?? "",
    enableIPv6: validateField("enableIPv6") ?? currentSettings?.enableIPv6 ?? true,
    customCdnAddrs: validateField("customCdnAddrs")?.replaceAll(" ", "") ?? currentSettings?.customCdnAddrs ?? "",
    customCdnHost: validateField("customCdnHost")?.trim() ?? currentSettings?.customCdnHost ?? "",
    customCdnSni: validateField("customCdnSni")?.trim() ?? currentSettings?.customCdnSni ?? "",
    bestVLTRInterval: validateField("bestVLTRInterval") ?? currentSettings?.bestVLTRInterval ?? "30",
    VLConfigs: validateField("VLConfigs") ?? currentSettings?.VLConfigs ?? true,
    TRConfigs: validateField("TRConfigs") ?? currentSettings?.TRConfigs ?? false,
    ports: validateField("ports")?.split(",") ?? currentSettings?.ports ?? ["443"],
    lengthMin: validateField("fragmentLengthMin") ?? currentSettings?.lengthMin ?? "100",
    lengthMax: validateField("fragmentLengthMax") ?? currentSettings?.lengthMax ?? "200",
    intervalMin: validateField("fragmentIntervalMin") ?? currentSettings?.intervalMin ?? "1",
    intervalMax: validateField("fragmentIntervalMax") ?? currentSettings?.intervalMax ?? "1",
    fragmentPackets: validateField("fragmentPackets") ?? currentSettings?.fragmentPackets ?? "tlshello",
    bypassLAN: validateField("bypass-lan") ?? currentSettings?.bypassLAN ?? false,
    bypassIran: validateField("bypass-iran") ?? currentSettings?.bypassIran ?? false,
    bypassChina: validateField("bypass-china") ?? currentSettings?.bypassChina ?? false,
    bypassRussia: validateField("bypass-russia") ?? currentSettings?.bypassRussia ?? false,
    blockAds: validateField("block-ads") ?? currentSettings?.blockAds ?? false,
    blockPorn: validateField("block-porn") ?? currentSettings?.blockPorn ?? false,
    blockUDP443: validateField("block-udp-443") ?? currentSettings?.blockUDP443 ?? false,
    customBypassRules: validateField("customBypassRules")?.replaceAll(" ", "") ?? currentSettings?.customBypassRules ?? "",
    customBlockRules: validateField("customBlockRules")?.replaceAll(" ", "") ?? currentSettings?.customBlockRules ?? "",
    warpEndpoints: validateField("warpEndpoints")?.replaceAll(" ", "") ?? currentSettings?.warpEndpoints ?? "engage.cloudflareclient.com:2408",
    warpFakeDNS: validateField("warpFakeDNS") ?? currentSettings?.warpFakeDNS ?? false,
    warpEnableIPv6: validateField("warpEnableIPv6") ?? currentSettings?.warpEnableIPv6 ?? true,
    bestWarpInterval: validateField("bestWarpInterval") ?? currentSettings?.bestWarpInterval ?? "30",
    xrayUdpNoises: (udpNoises.length ? JSON.stringify(udpNoises) : currentSettings?.xrayUdpNoises) ?? JSON.stringify([
      {
        type: "base64",
        packet: btoa(globalThis.userID),
        delay: "1-1",
        count: "1"
      }
    ]),
    hiddifyNoiseMode: validateField("hiddifyNoiseMode") ?? currentSettings?.hiddifyNoiseMode ?? "m4",
    nikaNGNoiseMode: validateField("nikaNGNoiseMode") ?? currentSettings?.nikaNGNoiseMode ?? "quic",
    noiseCountMin: validateField("noiseCountMin") ?? currentSettings?.noiseCountMin ?? "10",
    noiseCountMax: validateField("noiseCountMax") ?? currentSettings?.noiseCountMax ?? "15",
    noiseSizeMin: validateField("noiseSizeMin") ?? currentSettings?.noiseSizeMin ?? "5",
    noiseSizeMax: validateField("noiseSizeMax") ?? currentSettings?.noiseSizeMax ?? "10",
    noiseDelayMin: validateField("noiseDelayMin") ?? currentSettings?.noiseDelayMin ?? "1",
    noiseDelayMax: validateField("noiseDelayMax") ?? currentSettings?.noiseDelayMax ?? "1",
    panelVersion: globalThis.panelVersion
  };
  try {
    await env.kv.put("proxySettings", JSON.stringify(proxySettings));
    if (isReset) await updateWarpConfigs(request, env);
  } catch (error) {
    console.log(error);
    throw new Error(`An error occurred while updating KV - ${error}`);
  }
  return proxySettings;
}
__name(updateDataset, "updateDataset");
function extractChainProxyParams(chainProxy) {
  let configParams = {};
  if (!chainProxy) return {};
  const url = new URL(chainProxy);
  const protocol = url.protocol.slice(0, -1);
  if (protocol === atob("dmxlc3M=")) {
    const params = new URLSearchParams(url.search);
    configParams = {
      protocol,
      uuid: url.username,
      server: url.hostname,
      port: url.port
    };
    params.forEach((value, key) => {
      configParams[key] = value;
    });
  } else {
    configParams = {
      protocol,
      user: url.username,
      pass: url.password,
      server: url.host,
      port: url.port
    };
  }
  return JSON.stringify(configParams);
}
__name(extractChainProxyParams, "extractChainProxyParams");
async function updateWarpConfigs(request, env) {
  const auth = await Authenticate(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });
  if (request.method === "POST") {
    try {
      const { error: warpPlusError } = await fetchWarpConfigs(env);
      if (warpPlusError) return new Response(warpPlusError, { status: 400 });
      return new Response("Warp configs updated successfully", { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response(`An error occurred while updating Warp configs! - ${error}`, { status: 500 });
    }
  } else {
    return new Response("Unsupported request", { status: 405 });
  }
}
__name(updateWarpConfigs, "updateWarpConfigs");

// src/pages/home.js
async function renderHomePage(proxySettings, isPassSet) {
  const {
    remoteDNS,
    localDNS,
    VLTRFakeDNS,
    proxyIP,
    outProxy,
    cleanIPs,
    enableIPv6,
    customCdnAddrs,
    customCdnHost,
    customCdnSni,
    bestVLTRInterval,
    VLConfigs,
    TRConfigs,
    ports,
    lengthMin,
    lengthMax,
    intervalMin,
    intervalMax,
    fragmentPackets,
    warpEndpoints,
    warpFakeDNS,
    warpEnableIPv6,
    bestWarpInterval,
    xrayUdpNoises,
    hiddifyNoiseMode,
    nikaNGNoiseMode,
    noiseCountMin,
    noiseCountMax,
    noiseSizeMin,
    noiseSizeMax,
    noiseDelayMin,
    noiseDelayMax,
    bypassLAN,
    bypassIran,
    bypassChina,
    bypassRussia,
    blockAds,
    blockPorn,
    blockUDP443,
    customBypassRules,
    customBlockRules
  } = proxySettings;
  const activeProtocols = (VLConfigs ? 1 : 0) + (TRConfigs ? 1 : 0);
  let httpPortsBlock = "", httpsPortsBlock = "";
  const allPorts = [...globalThis.hostName.includes("workers.dev") ? globalThis.defaultHttpPorts : [], ...globalThis.defaultHttpsPorts];
  allPorts.forEach((port) => {
    const id = `port-${port}`;
    const isChecked = ports.includes(port) ? "checked" : "";
    const portBlock = `
            <div class="routing" style="grid-template-columns: 1fr 2fr; margin-right: 10px;">
                <input type="checkbox" id=${id} name=${port} onchange="handlePortChange(event)" value="true" ${isChecked}>
                <label style="margin-bottom: 3px;" for=${id}>${port}</label>
            </div>`;
    globalThis.defaultHttpsPorts.includes(port) ? httpsPortsBlock += portBlock : httpPortsBlock += portBlock;
  });
  let udpNoiseBlocks = "";
  JSON.parse(xrayUdpNoises).forEach((noise, index) => {
    udpNoiseBlocks += `
            <div id="udp-noise-container-${index}" class="udp-noise">
                <div class="header-container">
                    <h4 style="margin: 0 5px;">Noise ${index + 1}</h4>
                    <button type="button" onclick="deleteUdpNoise(this)" style="background: none; margin: 0; border: none; cursor: pointer;">
                        <i class="fa fa-minus-circle fa-2x" style="color: var(--button-color);" aria-hidden="true"></i>
                    </button>      
                </div>
                <div class="form-control">
                    <label for="udpXrayNoiseMode-${index}">\u{1F635}\u200D\u{1F4AB} v2ray Mode</label>
                    <div class="input-with-select">
                        <select id="udpXrayNoiseMode-${index}" name="udpXrayNoiseMode">
                            <option value="base64" ${noise.type === "base64" ? "selected" : ""}>Base64</option>
                            <option value="rand" ${noise.type === "rand" ? "selected" : ""}>Random</option>
                            <option value="str" ${noise.type === "str" ? "selected" : ""}>String</option>
                            <option value="hex" ${noise.type === "hex" ? "selected" : ""}>Hex</option>
                        </select>
                    </div>
                </div>
                <div class="form-control">
                    <label for="udpXrayNoisePacket-${index}">\u{1F4E5} Noise Packet</label>
                    <input type="text" id="udpXrayNoisePacket-${index}" name="udpXrayNoisePacket" value="${noise.packet}">
                </div>
                <div class="form-control">
                    <label for="udpXrayNoiseDelayMin-${index}">\u{1F55E} Noise Delay</label>
                    <div class="min-max">
                        <input type="number" id="udpXrayNoiseDelayMin-${index}" name="udpXrayNoiseDelayMin"
                            value="${noise.delay.split("-")[0]}" min="1" required>
                        <span> - </span>
                        <input type="number" id="udpXrayNoiseDelayMax-${index}" name="udpXrayNoiseDelayMax"
                            value="${noise.delay.split("-")[1]}" min="1" required>
                    </div>
                </div>
                <div class="form-control">
                    <label for="udpXrayNoiseCount-${index}">\u{1F39A}\uFE0F Noise Count</label>
                    <input type="number" id="udpXrayNoiseCount-${index}" name="udpXrayNoiseCount" value="${noise.count}" min="1" required>
                </div>
            </div>`;
  });
  const supportedApps = /* @__PURE__ */ __name((apps) => apps.map((app) => `
        <div>
            <span class="material-symbols-outlined symbol">verified</span>
            <span>${app}</span>
        </div>`).join(""), "supportedApps");
  const subQR = /* @__PURE__ */ __name((path, app, tag2, title, sbType, hiddifyType) => {
    const url = `${sbType ? "sing-box://import-remote-profile?url=" : ""}${hiddifyType ? "hiddify://import/" : ""}https://${globalThis.hostName}/${path}/${globalThis.subPath}${app ? `?app=${app}` : ""}#${tag2}`;
    return `
            <button onclick="openQR('${url}', '${title}')" style="margin-bottom: 8px;">
                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
            </button>`;
  }, "subQR");
  const subURL = /* @__PURE__ */ __name((path, app, tag2, hiddifyType) => {
    const url = `${hiddifyType ? "hiddify://import/" : ""}https://${globalThis.hostName}/${path}/${globalThis.subPath}${app ? `?app=${app}` : ""}#${tag2}`;
    return `
            <button onclick="copyToClipboard('${url}')">
                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
            </button>`;
  }, "subURL");
  const homePage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="timestamp" content=${Date.now()}>
        <title>${atob("QlBC")} Panel ${globalThis.panelVersion}</title>
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
            .table-container { overflow-x: auto; }
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
            .header-container { display: flex; justify-content: center; margin-bottom: 20px; }
            .udp-noise { border: 1px solid var(--border-color); border-radius: 15px; padding: 20px; margin-bottom: 10px;}
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
        <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
        <div class="form-container">
            <form id="configForm">
                <details open>
                    <summary><h2>${atob("VkxFU1M=")} - ${atob("VFJPSkFO")} \u2699\uFE0F</h2></summary>
                    <div class="form-control">
                        <label for="remoteDNS">\u{1F30F} Remote DNS</label>
                        <input type="url" id="remoteDNS" name="remoteDNS" value="${remoteDNS}" required>
                    </div>
                    <div class="form-control">
                        <label for="localDNS">\u{1F3DA}\uFE0F Local DNS</label>
                        <input type="text" id="localDNS" name="localDNS" value="${localDNS}"
                            pattern="^(?:\\d{1,3}\\.){3}\\d{1,3}$"
                            title="Please enter a valid DNS IP Address!"  required>
                    </div>
                    <div class="form-control">
                        <label for="VLTRFakeDNS">\u{1F9E2} Fake DNS</label>
                        <div class="input-with-select">
                            <select id="VLTRFakeDNS" name="VLTRFakeDNS">
                                <option value="true" ${VLTRFakeDNS ? "selected" : ""}>Enabled</option>
                                <option value="false" ${!VLTRFakeDNS ? "selected" : ""}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="proxyIP">\u{1F4CD} Proxy IPs / Domains</label>
                        <input type="text" id="proxyIP" name="proxyIP" value="${proxyIP.replaceAll(",", " , ")}">
                    </div>
                    <div class="form-control">
                        <label for="outProxy">\u2708\uFE0F Chain Proxy</label>
                        <input type="text" id="outProxy" name="outProxy" value="${outProxy}">
                    </div>
                    <div class="form-control">
                        <label for="cleanIPs">\u2728 Clean IPs / Domains</label>
                        <input type="text" id="cleanIPs" name="cleanIPs" value="${cleanIPs.replaceAll(",", " , ")}">
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
                                <option value="true" ${enableIPv6 ? "selected" : ""}>Enabled</option>
                                <option value="false" ${!enableIPv6 ? "selected" : ""}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="customCdnAddrs">\u{1F480} Custom CDN Addrs</label>
                        <input type="text" id="customCdnAddrs" name="customCdnAddrs" value="${customCdnAddrs.replaceAll(",", " , ")}">
                    </div>
                    <div class="form-control">
                        <label for="customCdnHost">\u{1F480} Custom CDN Host</label> 
                        <input type="text" id="customCdnHost" name="customCdnHost" value="${customCdnHost}">
                    </div>
                    <div class="form-control">
                        <label for="customCdnSni">\u{1F480} Custom CDN SNI</label>
                        <input type="text" id="customCdnSni" name="customCdnSni" value="${customCdnSni}">
                    </div>
                    <div class="form-control">
                        <label for="bestVLTRInterval">\u{1F504} Best Interval</label>
                        <input type="number" id="bestVLTRInterval" name="bestVLTRInterval" min="10" max="90" value="${bestVLTRInterval}">
                    </div>
                    <div class="form-control" style="padding-top: 10px;">
                        <label for="VLConfigs">\u2699\uFE0F Protocols</label>
                        <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; align-items: baseline; margin-top: 10px;">
                            <div style = "display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" id="VLConfigs" name="VLConfigs" onchange="handleProtocolChange(event)" value="true" ${VLConfigs ? "checked" : ""}>
                                <label for="VLConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">${atob("VkxFU1M=")}</label>
                            </div>
                            <div style = "display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" id="TRConfigs" name="TRConfigs" onchange="handleProtocolChange(event)" value="true" ${TRConfigs ? "checked" : ""}>
                                <label for="TRConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">${atob("VHJvamFu")}</label>
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
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${httpsPortsBlock}</div>
                                </td>    
                            </tr>
                            ${!httpPortsBlock ? "" : `<tr>
                                <td style="text-align: center; font-size: larger;"><b>Non TLS</b></td>
                                <td>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${httpPortsBlock}</div>
                                </td>    
                            </tr>`}        
                        </table>
                    </div>
                </details>
                <details>
                    <summary><h2>FRAGMENT \u2699\uFE0F</h2></summary>	
                    <div class="form-control">
                        <label for="fragmentLengthMin">\u{1F4D0} Length</label>
                        <div class="min-max">
                            <input type="number" id="fragmentLengthMin" name="fragmentLengthMin" value="${lengthMin}" min="10" required>
                            <span> - </span>
                            <input type="number" id="fragmentLengthMax" name="fragmentLengthMax" value="${lengthMax}" max="500" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="fragmentIntervalMin">\u{1F55E} Interval</label>
                        <div class="min-max">
                            <input type="number" id="fragmentIntervalMin" name="fragmentIntervalMin"
                                value="${intervalMin}" min="1" max="30" required>
                            <span> - </span>
                            <input type="number" id="fragmentIntervalMax" name="fragmentIntervalMax"
                                value="${intervalMax}" min="1" max="30" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="fragmentPackets">\u{1F4E6} Packets</label>
                        <div class="input-with-select">
                            <select id="fragmentPackets" name="fragmentPackets">
                                <option value="tlshello" ${fragmentPackets === "tlshello" ? "selected" : ""}>tlshello</option>
                                <option value="1-1" ${fragmentPackets === "1-1" ? "selected" : ""}>1-1</option>
                                <option value="1-2" ${fragmentPackets === "1-2" ? "selected" : ""}>1-2</option>
                                <option value="1-3" ${fragmentPackets === "1-3" ? "selected" : ""}>1-3</option>
                                <option value="1-5" ${fragmentPackets === "1-5" ? "selected" : ""}>1-5</option>
                            </select>
                        </div>
                    </div>
                </details>
                <details>
                    <summary><h2>WARP GENERAL \u2699\uFE0F</h2></summary>
                    <div class="form-control">
                        <label for="warpEndpoints">\u2728 Endpoints</label>
                        <input type="text" id="warpEndpoints" name="warpEndpoints" value="${warpEndpoints.replaceAll(",", " , ")}" required>
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
                                <option value="true" ${warpFakeDNS ? "selected" : ""}>Enabled</option>
                                <option value="false" ${!warpFakeDNS ? "selected" : ""}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="warpEnableIPv6">\u{1F51B} IPv6</label>
                        <div class="input-with-select">
                            <select id="warpEnableIPv6" name="warpEnableIPv6">
                                <option value="true" ${warpEnableIPv6 ? "selected" : ""}>Enabled</option>
                                <option value="false" ${!warpEnableIPv6 ? "selected" : ""}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="refreshBtn">\u267B\uFE0F Warp Configs</label>
                        <button id="refreshBtn" type="button" class="button" style="padding: 10px 0;" onclick="getWarpConfigs()">
                            Update<span class="material-symbols-outlined">autorenew</span>
                        </button>
                    </div>
                    <div class="form-control">
                        <label for="bestWarpInterval">\u{1F504} Best Interval</label>
                        <input type="number" id="bestWarpInterval" name="bestWarpInterval" min="10" max="90" value="${bestWarpInterval}">
                    </div>
                    <div class="form-control">
                        <label for="dlConfigsBtn">\u{1F4E5} Download Warp Configs</label>
                        <button id="dlConfigsBtn" type="button" class="button" style="padding: 10px 0;">
                            Download<span class="material-symbols-outlined">download</span>
                        </button>
                    </div>
                </details>
                <details>
                    <summary><h2>WARP PRO \u2699\uFE0F</h2></summary>
                    <div class="header-container">
                        <h3 style="margin: 0 5px;">V2RAYNG - V2RAYN</h3>
                        <button type="button" id="add-udp-noise" onclick="addUdpNoise()" style="background: none; margin: 0; border: none; cursor: pointer;">
                            <i class="fa fa-plus-circle fa-2x" style="color: var(--button-color);" aria-hidden="true"></i>
                        </button>       
                    </div>
                    <div id="udp-noise-container">
                        ${udpNoiseBlocks}
                    </div>
                    <h3>MAHSANG - NIKANG - HIDDIFY \u{1F527}</h3>
                    <div class="form-control">
                        <label for="hiddifyNoiseMode">\u{1F635}\u200D\u{1F4AB} Hiddify Mode</label>
                        <input type="text" id="hiddifyNoiseMode" name="hiddifyNoiseMode" 
                            pattern="^(m[1-6]|h_[0-9A-Fa-f]{2}|g_([0-9A-Fa-f]{2}_){2}[0-9A-Fa-f]{2})$" 
                            title="Enter 'm1-m6', 'h_HEX', 'g_HEX_HEX_HEX' which HEX can be between 00 to ff"
                            value="${hiddifyNoiseMode}" required>
                    </div>
                    <div class="form-control">
                        <label for="nikaNGNoiseMode">\u{1F635}\u200D\u{1F4AB} NikaNG Mode</label>
                        <input type="text" id="nikaNGNoiseMode" name="nikaNGNoiseMode" 
                            pattern="^(none|quic|random|[0-9A-Fa-f]+)$" 
                            title="Enter 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'"
                            value="${nikaNGNoiseMode}" required>
                    </div>
                    <div class="form-control">
                        <label for="noiseCountMin">\u{1F39A}\uFE0F Noise Count</label>
                        <div class="min-max">
                            <input type="number" id="noiseCountMin" name="noiseCountMin"
                                value="${noiseCountMin}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseCountMax" name="noiseCountMax"
                                value="${noiseCountMax}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="noiseSizeMin">\u{1F4CF} Noise Size</label>
                        <div class="min-max">
                            <input type="number" id="noiseSizeMin" name="noiseSizeMin"
                                value="${noiseSizeMin}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseSizeMax" name="noiseSizeMax"
                                value="${noiseSizeMax}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="noiseDelayMin">\u{1F55E} Noise Delay</label>
                        <div class="min-max">
                            <input type="number" id="noiseDelayMin" name="noiseDelayMin"
                                value="${noiseDelayMin}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseDelayMax" name="noiseDelayMax"
                                value="${noiseDelayMax}" min="1" required>
                        </div>
                    </div>
                </details>
                <details>
                    <summary><h2>ROUTING RULES \u2699\uFE0F</h2></summary>
                    <div id="routing-rules" class="form-control" style="margin-bottom: 20px;">			
                        <div class="routing">
                            <input type="checkbox" id="bypass-lan" name="bypass-lan" value="true" ${bypassLAN ? "checked" : ""}>
                            <label for="bypass-lan">Bypass LAN</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-ads" name="block-ads" value="true" ${blockAds ? "checked" : ""}>
                            <label for="block-ads">Block Ads.</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-iran" name="bypass-iran" value="true" ${bypassIran ? "checked" : ""}>
                            <label for="bypass-iran">Bypass Iran</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-porn" name="block-porn" value="true" ${blockPorn ? "checked" : ""}>
                            <label for="block-porn">Block Porn</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-china" name="bypass-china" value="true" ${bypassChina ? "checked" : ""}>
                            <label for="bypass-china">Bypass China</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-udp-443" name="block-udp-443" value="true" ${blockUDP443 ? "checked" : ""}>
                            <label for="block-udp-443">Block QUIC</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-russia" name="bypass-russia" value="true" ${bypassRussia ? "checked" : ""}>
                            <label for="bypass-russia">Bypass Russia</label>
                        </div>
                    </div>
                    <h3>CUSTOM RULES \u{1F527}</h3>
                    <div class="form-control">
                        <label for="customBypassRules">\u{1F7E9} Bypass IPs / Domains</label>
                        <input type="text" id="customBypassRules" name="customBypassRules" value="${customBypassRules.replaceAll(",", " , ")}">
                    </div>
                    <div class="form-control">
                        <label for="customBlockRules">\u{1F7E5} Block IPs / Domains</label>
                        <input type="text" id="customBlockRules" name="customBlockRules" value="${customBlockRules.replaceAll(",", " , ")}">
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
                            ${supportedApps(["v2rayNG", "NikaNG", "MahsaNG", "v2rayN", "v2rayN-PRO", "Shadowrocket", "Streisand", "Hiddify", "Nekoray (Xray)"])}
                        </td>
                        <td>
                            ${subQR("sub", "", `${atob("QlBC")}-Normal`, "Normal Subscription")}
                            ${subURL("sub", "", `${atob("QlBC")}-Normal`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["husi", "Nekobox", "Nekoray (sing-Box)", "Karing"])}
                        </td>
                        <td>
                            ${subURL("sub", "singbox", `${atob("QlBC")}-Normal`)}
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
                            ${supportedApps(["v2rayNG", "NikaNG", "MahsaNG", "v2rayN", "v2rayN-PRO", "Streisand"])}
                        </td>
                        <td>
                            ${subQR("sub", "xray", `${atob("QlBC")}-Full-Normal`, "Full normal Subscription")}
                            ${subURL("sub", "xray", `${atob("QlBC")}-Full-Normal`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["sing-box", "v2rayN (sing-box)"])}
                        </td>
                        <td>
                            ${subQR("sub", "sfa", `${atob("QlBC")}-Full-Normal`, "Full normal Subscription", true)}
                            ${subURL("sub", "sfa", `${atob("QlBC")}-Full-Normal`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["Clash Meta", "Clash Verge", "FlClash", "Stash", "v2rayN (mihomo)"])}
                        </td>
                        <td>
                            ${subQR("sub", "clash", `${atob("QlBC")}-Full-Normal`, "Full normal Subscription")}
                            ${subURL("sub", "clash", `${atob("QlBC")}-Full-Normal`)}
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
                            ${supportedApps(["v2rayNG", "NikaNG", "MahsaNG", "v2rayN", "v2rayN-PRO", "Streisand"])}
                        </td>
                        <td>
                            ${subQR("fragsub", "", `${atob("QlBC")}-Fragment`, "Fragment Subscription")}
                            ${subURL("fragsub", "", `${atob("QlBC")}-Fragment`)}
                        </td>
                    </tr>
                    <tr>
                        <td style="text-wrap: nowrap;">
                            ${supportedApps(["Hiddify"])}
                        </td>
                        <td>
                            ${subQR("fragsub", "hiddify-frag", `${atob("QlBC")}-Fragment`, "Fragment Subscription", false, true)}
                            ${subURL("fragsub", "hiddify-frag", `${atob("QlBC")}-Fragment`, true)}
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
                            ${supportedApps(["v2rayNG", "v2rayN", "Streisand"])}
                        </td>
                        <td>
                            ${subQR("warpsub", "xray", `${atob("QlBC")}-Warp`, "Warp Subscription")}
                            ${subURL("warpsub", "xray", `${atob("QlBC")}-Warp`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["sing-box", "v2rayN (sing-box)"])}
                        </td>
                        <td>
                            ${subQR("sub", "singbox", `${atob("QlBC")}-Warp`, "Warp Subscription", true)}
                            ${subURL("warpsub", "singbox", `${atob("QlBC")}-Warp`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["Hiddify"])}
                        </td>
                        <td>
                            ${subQR("warpsub", "hiddify", `${atob("QlBC")}-Warp`, "Warp Pro Subscription", false, true)}
                            ${subURL("warpsub", "hiddify", `${atob("QlBC")}-Warp`, true)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["Clash Meta", "Clash Verge", "FlClash", "Stash", "v2rayN (mihomo)"])}
                        </td>
                        <td>
                            ${subQR("warpsub", "clash", `${atob("QlBC")}-Warp`, "Warp Subscription")}
                            ${subURL("warpsub", "clash", `${atob("QlBC")}-Warp`)}
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
                            ${supportedApps(["v2rayNG", "v2rayN"])}
                        </td>
                        <td>
                            ${subQR("warpsub", "xray-pro", `${atob("QlBC")}-Warp-Pro`, "Warp Pro Subscription")}
                            ${subURL("warpsub", "xray-pro", `${atob("QlBC")}-Warp-Pro`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["NikaNG", "MahsaNG", "v2rayN-PRO"])}
                        </td>
                        <td>
                            ${subQR("warpsub", "nikang", `${atob("QlBC")}-Warp-Pro`, "Warp Pro Subscription")}
                            ${subURL("warpsub", "nikang", `${atob("QlBC")}-Warp-Pro`)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${supportedApps(["Hiddify"])}
                        </td>
                        <td>
                            ${subQR("warpsub", "hiddify-pro", `${atob("QlBC")}-Warp-Pro`, "Warp Pro Subscription", false, true)}
                            ${subURL("warpsub", "hiddify-pro", `${atob("QlBC")}-Warp-Pro`, true)}
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
                <a class="link" href="https://github.com/bia-pain-bache/${atob("QlBC")}-Worker-Panel" style="color: var(--color); text-decoration: underline;" target="_blank">Github</a>
                <button id="openModalBtn" class="button">Change Password</button>
                <button type="button" id="logout" style="background: none; color: var(--color); margin: 0; border: none; cursor: pointer;">
                    <i class="fa fa-power-off fa-2x" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <button id="darkModeToggle" class="floating-button">
            <i id="modeIcon" class="fa fa-2x fa-adjust" style="color: var(--background-color);" aria-hidden="true"></i>
        </button>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>
    <script type="module" defer>
        import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";
        polyfillCountryFlagEmojis();
    <\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
    <script>
        const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
        let activePortsNo = ${ports.length};
        let activeHttpsPortsNo = ${ports.filter((port) => globalThis.defaultHttpsPorts.includes(port)).length};
        let activeProtocols = ${activeProtocols};
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

            document.getElementById("dlConfigsBtn").addEventListener("click", async function () {
                try {
                    const response = await fetch("/get-warp-configs");
                    const configs = await response.json();
                    const zip = new JSZip();
                    configs.forEach( (config, index) => {
                        zip.file('\u{1F4A6} BPB Warp config - ' + String(index + 1) + '.conf', config);
                    });

                    zip.generateAsync({ type: "blob" }).then(function (blob) {
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "\u{1F4A6} BPB Warp configs.zip";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                } catch (error) {
                    console.error("Error fetching configs:", error);
                }
            });

            const isPassSet = ${isPassSet};
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

        const addUdpNoise = () => {
            const container = document.getElementById("udp-noise-container");
            const noiseBlock = document.getElementById("udp-noise-container-0");
            const index = container.children.length;
            const clone = noiseBlock.cloneNode(true);
            clone.querySelector("h4").textContent = "Noise " + String(index + 1);
            container.appendChild(clone);
            document.getElementById("configForm").dispatchEvent(new Event("change"));
        }
        
        const deleteUdpNoise = (button) => {
            const container = document.getElementById("udp-noise-container");
            if (container.children.length === 1) {
                alert('\u26D4 You cannot delete all noises!');
                return;
            }   
            const confirmReset = confirm('\u26A0\uFE0F This will delete the noise.\\nAre you sure?');
            if(!confirmReset) return;
            button.closest(".udp-noise").remove();
            document.getElementById("configForm").dispatchEvent(new Event("change"));
        }

        const getWarpConfigs = async () => {
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
                alert('\u2705 Warp configs updated successfully! \u{1F60E}');
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
            const is${atob("Vmxlc3M=")} = /${atob("dmxlc3M=")}:\\/\\/[^s@]+@[^\\s:]+:[^\\s]+/.test(chainProxy);
            const isSocksHttp = /^(http|socks):\\/\\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\\d+)$/.test(chainProxy);
            const hasSecurity = /security=/.test(chainProxy);
            const securityRegex = /security=(tls|none|reality)/;
            const validSecurityType = securityRegex.test(chainProxy);
            let match = chainProxy.match(securityRegex);
            const securityType = match ? match[1] : null;
            match = chainProxy.match(/:(\\d+)\\?/);
            const ${atob("dmxlc3M=")}Port = match ? match[1] : null;
            const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);
            const validIPDomain = /^((?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,})|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?:\\/(?:\\d|[12]\\d|3[0-2]))?|\\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\\](?:\\/(?:12[0-8]|1[0-1]\\d|[0-9]?\\d))?)$/i;
            const validEndpoint = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[::(?::[a-fA-F0-9]{1,4}){0,7}\\]):(?:[0-9]{1,5})$/;
            const checkedPorts = Array.from(document.querySelectorAll('input[id^="port-"]:checked')).map(input => input.id.split('-')[1]);
            formData.append('ports', checkedPorts);
            configForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                !formData.has(checkbox.name) && formData.append(checkbox.name, 'false');    
            });
            const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
            const udpNoiseModes = formData.getAll('udpXrayNoiseMode') || [];
            const udpNoisePackets = formData.getAll('udpXrayNoisePacket') || [];
            const udpNoiseDelaysMin = formData.getAll('udpXrayNoiseDelayMin') || [];
            const udpNoiseDelaysMax = formData.getAll('udpXrayNoiseDelayMax') || [];

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

            if (!(is${atob("Vmxlc3M=")} && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
                alert('\u26D4 Invalid Config! \u{1FAE4} \\n - The chain proxy should be ${atob("VkxFU1M=")}, Socks or Http!\\n - ${atob("VkxFU1M=")} transmission should be GRPC,WS or TCP\\n - ${atob("VkxFU1M=")} security should be TLS,Reality or None\\n - socks or http should be like:\\n + (socks or http)://user:pass@host:port\\n + (socks or http)://host:port');               
                return false;
            }

            if (is${atob("Vmxlc3M=")} && securityType === 'tls' && ${atob("dmxlc3M=")}Port !== '443') {
                alert('\u26D4 ${atob("VkxFU1M=")} TLS port can be only 443 to be used as a proxy chain! \u{1FAE4}');               
                return false;
            }

            if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
                alert('\u26D4 All "Custom" fields should be filled or deleted together! \u{1FAE4}');               
                return false;
            }
            
            let submisionError = false;
            for (const [index, mode] of udpNoiseModes.entries()) {
                if (udpNoiseDelaysMin[index] > udpNoiseDelaysMax[index]) {
                    alert('\u26D4 The minimum noise delay should be smaller or equal to maximum! \u{1FAE4}');
                    submisionError = true;
                    break;
                }
                
                switch (mode) {
                    case 'base64':
                        if (!base64Regex.test(udpNoisePackets[index])) {
                            alert('\u26D4 The Base64 noise packet is not a valid base64 value! \u{1FAE4}');
                            submisionError = true;
                        }
                        break;
    
                    case 'rand':
                        if (!(/^\\d+-\\d+$/.test(udpNoisePackets[index]))) {
                            alert('\u26D4 The Random noise packet should be a range like 0-10 or 10-30! \u{1FAE4}');
                            submisionError = true;
                        }
                        const [min, max] = udpNoisePackets[index].split("-").map(Number);
                        if (min > max) {
                            alert('\u26D4 The minimum Random noise packet should be smaller or equal to maximum! \u{1FAE4}');
                            submisionError = true;
                        }
                        break;

                    case 'hex':
                        if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(udpNoisePackets[index]))) {
                            alert('\u26D4 The Hex noise packet is not a valid hex value! It should have even length and consisted of 0-9, a-f and A-F. \u{1FAE4}');
                            submisionError = true;
                        }
                        break;
                }
            }
            if (submisionError) return false;

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
    </html>`;
  return new Response(homePage, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=utf-8",
      "Access-Control-Allow-Origin": globalThis.urlOrigin,
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, no-transform",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(renderHomePage, "renderHomePage");

// src/helpers/helpers.js
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
__name(isValidUUID, "isValidUUID");
async function resolveDNS(domain) {
  const dohURL = "https://cloudflare-dns.com/dns-query";
  const dohURLv4 = `${dohURL}?name=${encodeURIComponent(domain)}&type=A`;
  const dohURLv6 = `${dohURL}?name=${encodeURIComponent(domain)}&type=AAAA`;
  try {
    const [ipv4Response, ipv6Response] = await Promise.all([
      fetch(dohURLv4, { headers: { accept: "application/dns-json" } }),
      fetch(dohURLv6, { headers: { accept: "application/dns-json" } })
    ]);
    const ipv4Addresses = await ipv4Response.json();
    const ipv6Addresses = await ipv6Response.json();
    const ipv4 = ipv4Addresses.Answer ? ipv4Addresses.Answer.map((record) => record.data) : [];
    const ipv6 = ipv6Addresses.Answer ? ipv6Addresses.Answer.map((record) => record.data) : [];
    return { ipv4, ipv6 };
  } catch (error) {
    console.error("Error resolving DNS:", error);
    throw new Error(`An error occurred while resolving DNS - ${error}`);
  }
}
__name(resolveDNS, "resolveDNS");
function isDomain(address) {
  const domainPattern = /^(?!\-)(?:[A-Za-z0-9\-]{1,63}\.)+[A-Za-z]{2,}$/;
  return domainPattern.test(address);
}
__name(isDomain, "isDomain");
async function handlePanel(request, env) {
  const auth = await Authenticate(request, env);
  if (request.method === "POST") {
    if (!auth) return new Response("Unauthorized or expired session!", { status: 401 });
    await updateDataset(request, env);
    return new Response("Success", { status: 200 });
  }
  const { proxySettings } = await getDataset(request, env);
  const pwd = await env.kv.get("pwd");
  if (pwd && !auth) return Response.redirect(`${globalThis.urlOrigin}/login`, 302);
  const isPassSet = pwd?.length >= 8;
  return await renderHomePage(proxySettings, isPassSet);
}
__name(handlePanel, "handlePanel");
async function fallback(request) {
  const url = new URL(request.url);
  if (url.pathname !== "/") return new Response("Invalid path", { status: 400 });
  url.hostname = globalThis.fallbackDomain;
  url.protocol = "https:";
  const newRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual"
  });
  return await fetch(newRequest);
}
__name(fallback, "fallback");
async function getMyIP(request) {
  const ip = await request.text();
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?nocache=${Date.now()}`);
    const geoLocation = await response.json();
    return new Response(JSON.stringify(geoLocation), {
      status: 200,
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
}
__name(getMyIP, "getMyIP");
async function getWarpConfigFiles(request, env) {
  const auth = await Authenticate(request, env);
  if (!auth) return new Response("Unauthorized or expired session!", { status: 401 });
  const { warpConfigs, proxySettings } = await getDataset(request, env);
  const { warpEndpoints } = proxySettings;
  const warpConfig = extractWireguardParams(warpConfigs, false);
  const { warpIPv6, publicKey, privateKey } = warpConfig;
  const warpConfs = [];
  warpEndpoints.split(",").forEach((endpoint) => {
    const warpConf = `[Interface]
PrivateKey = ${privateKey}
Address = 172.16.0.2/32, ${warpIPv6}
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
MTU = 1280
[Peer]
PublicKey = ${publicKey}
AllowedIPs = 0.0.0.0/0
AllowedIPs = ::/0
Endpoint = ${endpoint}`;
    warpConfs.push(warpConf);
  });
  return new Response(JSON.stringify(warpConfs), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
__name(getWarpConfigFiles, "getWarpConfigFiles");

// src/helpers/init.js
function initializeParams(request, env) {
  const proxyIPs = env.PROXYIP?.split(",").map((proxyIP) => proxyIP.trim());
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  globalThis.panelVersion = "3.0.9";
  globalThis.defaultHttpPorts = ["80", "8080", "2052", "2082", "2086", "2095", "8880"];
  globalThis.defaultHttpsPorts = ["443", "8443", "2053", "2083", "2087", "2096"];
  globalThis.userID = env.UUID;
  globalThis.TRPassword = env.TR_PASS;
  globalThis.proxyIP = proxyIPs ? proxyIPs[Math.floor(Math.random() * proxyIPs.length)] : atob("YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==");
  globalThis.hostName = request.headers.get("Host");
  globalThis.pathName = url.pathname;
  globalThis.client = searchParams.get("app");
  globalThis.urlOrigin = url.origin;
  globalThis.dohURL = env.DOH_URL || "https://cloudflare-dns.com/dns-query";
  globalThis.fallbackDomain = env.FALLBACK || "speed.cloudflare.com";
  globalThis.subPath = env.SUB_PATH || userID;
  if (pathName !== "/secrets") {
    if (!userID || !globalThis.TRPassword) throw new Error(`Please set UUID and ${atob("VHJvamFu")} password first. Please visit <a href="https://${hostName}/secrets" target="_blank">here</a> to generate them.`, { cause: "init" });
    if (userID && !isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`, { cause: "init" });
    if (typeof env.kv !== "object") throw new Error("KV Dataset is not properly set! Please refer to tutorials.", { cause: "init" });
  }
}
__name(initializeParams, "initializeParams");

// src/protocols/vless.js
import { connect } from "cloudflare:sockets";
async function VLOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();
  let address = "";
  let portWithRandomLog = "";
  const log = /* @__PURE__ */ __name((info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
  }, "log");
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
  let remoteSocketWapper = {
    value: null
  };
  let udpStreamWrite = null;
  let isDns = false;
  readableWebSocketStream.pipeTo(
    new WritableStream({
      async write(chunk, controller) {
        if (isDns && udpStreamWrite) {
          return udpStreamWrite(chunk);
        }
        if (remoteSocketWapper.value) {
          const writer = remoteSocketWapper.value.writable.getWriter();
          await writer.write(chunk);
          writer.releaseLock();
          return;
        }
        const {
          hasError,
          message: message2,
          portRemote = 443,
          addressRemote = "",
          rawDataIndex,
          VLVersion = new Uint8Array([0, 0]),
          isUDP
        } = await processVLHeader(chunk, globalThis.userID);
        address = addressRemote;
        portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? "udp " : "tcp "} `;
        if (hasError) {
          throw new Error(message2);
          return;
        }
        if (isUDP) {
          if (portRemote === 53) {
            isDns = true;
          } else {
            throw new Error("UDP proxy only enable for DNS which is port 53");
            return;
          }
        }
        const VLResponseHeader = new Uint8Array([VLVersion[0], 0]);
        const rawClientData = chunk.slice(rawDataIndex);
        if (isDns) {
          const { write } = await handleUDPOutBound(webSocket, VLResponseHeader, log);
          udpStreamWrite = write;
          udpStreamWrite(rawClientData);
          return;
        }
        handleTCPOutBound(
          remoteSocketWapper,
          addressRemote,
          portRemote,
          rawClientData,
          webSocket,
          VLResponseHeader,
          log
        );
      },
      close() {
        log(`readableWebSocketStream is close`);
      },
      abort(reason) {
        log(`readableWebSocketStream is abort`, JSON.stringify(reason));
      }
    })
  ).catch((err) => {
    log("readableWebSocketStream pipeTo error", err);
  });
  return new Response(null, {
    status: 101,
    // @ts-ignore
    webSocket: client
  });
}
__name(VLOverWSHandler, "VLOverWSHandler");
async function checkUuidInApiResponse(targetUuid) {
  try {
    const apiResponse = await getApiResponse();
    if (!apiResponse) {
      return false;
    }
    const isUuidInResponse = apiResponse.users.some((user) => user.uuid === targetUuid);
    return isUuidInResponse;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
__name(checkUuidInApiResponse, "checkUuidInApiResponse");
async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, VLResponseHeader, log) {
  async function connectAndWrite(address, port) {
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) address = `${atob("d3d3Lg==")}${address}${atob("LnNzbGlwLmlv")}`;
    const tcpSocket2 = connect({
      hostname: address,
      port
    });
    remoteSocket.value = tcpSocket2;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket2.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket2;
  }
  __name(connectAndWrite, "connectAndWrite");
  async function retry() {
    const panelProxyIP = globalThis.pathName.split("/")[2];
    const panelProxyIPs = panelProxyIP ? atob(panelProxyIP).split(",") : void 0;
    const finalProxyIP = panelProxyIPs ? panelProxyIPs[Math.floor(Math.random() * panelProxyIPs.length)] : globalThis.proxyIP || addressRemote;
    const tcpSocket2 = await connectAndWrite(finalProxyIP, portRemote);
    tcpSocket2.closed.catch((error) => {
      console.log("retry tcpSocket closed error", error);
    }).finally(() => {
      safeCloseWebSocket(webSocket);
    });
    VLRemoteSocketToWS(tcpSocket2, webSocket, VLResponseHeader, null, log);
  }
  __name(retry, "retry");
  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  VLRemoteSocketToWS(tcpSocket, webSocket, VLResponseHeader, retry, log);
}
__name(handleTCPOutBound, "handleTCPOutBound");
function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message2 = event.data;
        controller.enqueue(message2);
      });
      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer has error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {
    },
    cancel(reason) {
      if (readableStreamCancel) {
        return;
      }
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    }
  });
  return stream;
}
__name(makeReadableWebSocketStream, "makeReadableWebSocketStream");
async function processVLHeader(VLBuffer, userID2) {
  if (VLBuffer.byteLength < 24) {
    return {
      hasError: true,
      message: "invalid data"
    };
  }
  const version = new Uint8Array(VLBuffer.slice(0, 1));
  let isValidUser = false;
  let isUDP = false;
  const slicedBuffer = new Uint8Array(VLBuffer.slice(1, 17));
  const slicedBufferString = stringify(slicedBuffer);
  const uuids = userID2.includes(",") ? userID2.split(",") : [userID2];
  const checkUuidInApi = await checkUuidInApiResponse(slicedBufferString);
  isValidUser = uuids.some((userUuid) => checkUuidInApi || slicedBufferString === userUuid.trim());
  console.log(`checkUuidInApi: ${await checkUuidInApiResponse(slicedBufferString)}, userID: ${slicedBufferString}`);
  if (!isValidUser) {
    return {
      hasError: true,
      message: "invalid user"
    };
  }
  const optLength = new Uint8Array(VLBuffer.slice(17, 18))[0];
  const command = new Uint8Array(VLBuffer.slice(18 + optLength, 18 + optLength + 1))[0];
  if (command === 1) {
  } else if (command === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`
    };
  }
  const portIndex = 18 + optLength + 1;
  const portBuffer = VLBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(VLBuffer.slice(addressIndex, addressIndex + 1));
  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = "";
  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(VLBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 2:
      addressLength = new Uint8Array(VLBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(VLBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3:
      addressLength = 16;
      const dataView = new DataView(VLBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invild  addressType is ${addressType}`
      };
  }
  if (!addressValue) {
    return {
      hasError: true,
      message: `addressValue is empty, addressType is ${addressType}`
    };
  }
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType,
    portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    VLVersion: version,
    isUDP
  };
}
__name(processVLHeader, "processVLHeader");
async function VLRemoteSocketToWS(remoteSocket, webSocket, VLResponseHeader, retry, log) {
  let remoteChunkCount = 0;
  let chunks = [];
  let VLHeader = VLResponseHeader;
  let hasIncomingData = false;
  await remoteSocket.readable.pipeTo(
    new WritableStream({
      start() {
      },
      /**
       *
       * @param {Uint8Array} chunk
       * @param {*} controller
       */
      async write(chunk, controller) {
        hasIncomingData = true;
        if (webSocket.readyState !== WS_READY_STATE_OPEN) {
          controller.error("webSocket.readyState is not open, maybe close");
        }
        if (VLHeader) {
          webSocket.send(await new Blob([VLHeader, chunk]).arrayBuffer());
          VLHeader = null;
        } else {
          webSocket.send(chunk);
        }
      },
      close() {
        log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
      },
      abort(reason) {
        console.error(`remoteConnection!.readable abort`, reason);
      }
    })
  ).catch((error) => {
    console.error(`${atob("dmxlc3M=")}RemoteSocketToWS has exception `, error.stack || error);
    safeCloseWebSocket(webSocket);
  });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}
__name(VLRemoteSocketToWS, "VLRemoteSocketToWS");
function base64ToArrayBuffer(base64Str) {
  if (!base64Str) {
    return { earlyData: null, error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode2 = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode2, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { earlyData: null, error };
  }
}
__name(base64ToArrayBuffer, "base64ToArrayBuffer");
var WS_READY_STATE_OPEN = 1;
var WS_READY_STATE_CLOSING = 2;
function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}
__name(safeCloseWebSocket, "safeCloseWebSocket");
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
__name(unsafeStringify, "unsafeStringify");
function stringify(arr, offset = 0) {
  const uuid = unsafeStringify(arr, offset);
  if (!isValidUUID(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
__name(stringify, "stringify");
async function handleUDPOutBound(webSocket, VLResponseHeader, log) {
  let isVLHeaderSent = false;
  const transformStream = new TransformStream({
    start(controller) {
    },
    transform(chunk, controller) {
      for (let index = 0; index < chunk.byteLength; ) {
        const lengthBuffer = chunk.slice(index, index + 2);
        const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
        const udpData = new Uint8Array(chunk.slice(index + 2, index + 2 + udpPakcetLength));
        index = index + 2 + udpPakcetLength;
        controller.enqueue(udpData);
      }
    },
    flush(controller) {
    }
  });
  transformStream.readable.pipeTo(
    new WritableStream({
      async write(chunk) {
        const resp = await fetch(
          globalThis.dohURL,
          // dns server url
          {
            method: "POST",
            headers: {
              "content-type": "application/dns-message"
            },
            body: chunk
          }
        );
        const dnsQueryResult = await resp.arrayBuffer();
        const udpSize = dnsQueryResult.byteLength;
        const udpSizeBuffer = new Uint8Array([udpSize >> 8 & 255, udpSize & 255]);
        if (webSocket.readyState === WS_READY_STATE_OPEN) {
          log(`doh success and dns message length is ${udpSize}`);
          if (isVLHeaderSent) {
            webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
          } else {
            webSocket.send(await new Blob([VLResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
            isVLHeaderSent = true;
          }
        }
      }
    })
  ).catch((error) => {
    log("dns udp has error" + error);
  });
  const writer = transformStream.writable.getWriter();
  return {
    /**
     *
     * @param {Uint8Array} chunk
    */
    write(chunk) {
      writer.write(chunk);
    }
  };
}
__name(handleUDPOutBound, "handleUDPOutBound");

// src/protocols/trojan.js
var import_js_sha256 = __toESM(require_sha256());
import { connect as connect2 } from "cloudflare:sockets";
async function TROverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();
  let address = "";
  let portWithRandomLog = "";
  const log = /* @__PURE__ */ __name((info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
  }, "log");
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream2(webSocket, earlyDataHeader, log);
  let remoteSocketWapper = {
    value: null
  };
  let udpStreamWrite = null;
  readableWebSocketStream.pipeTo(
    new WritableStream({
      async write(chunk, controller) {
        if (udpStreamWrite) {
          return udpStreamWrite(chunk);
        }
        if (remoteSocketWapper.value) {
          const writer = remoteSocketWapper.value.writable.getWriter();
          await writer.write(chunk);
          writer.releaseLock();
          return;
        }
        const {
          hasError,
          message: message2,
          portRemote = 443,
          addressRemote = "",
          rawClientData
        } = await parseTRHeader(chunk);
        address = addressRemote;
        portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
        if (hasError) {
          throw new Error(message2);
          return;
        }
        handleTCPOutBound2(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, log);
      },
      close() {
        log(`readableWebSocketStream is closed`);
      },
      abort(reason) {
        log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
      }
    })
  ).catch((err) => {
    log("readableWebSocketStream pipeTo error", err);
  });
  return new Response(null, {
    status: 101,
    // @ts-ignore
    webSocket: client
  });
}
__name(TROverWSHandler, "TROverWSHandler");
async function parseTRHeader(buffer) {
  if (buffer.byteLength < 56) {
    return {
      hasError: true,
      message: "invalid data"
    };
  }
  let crLfIndex = 56;
  if (new Uint8Array(buffer.slice(56, 57))[0] !== 13 || new Uint8Array(buffer.slice(57, 58))[0] !== 10) {
    return {
      hasError: true,
      message: "invalid header format (missing CR LF)"
    };
  }
  const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
  if (password !== import_js_sha256.default.sha224(globalThis.TRPassword)) {
    return {
      hasError: true,
      message: "invalid password"
    };
  }
  const socks5DataBuffer = buffer.slice(crLfIndex + 2);
  if (socks5DataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid SOCKS5 request data"
    };
  }
  const view = new DataView(socks5DataBuffer);
  const cmd = view.getUint8(0);
  if (cmd !== 1) {
    return {
      hasError: true,
      message: "unsupported command, only TCP (CONNECT) is allowed"
    };
  }
  const atype = view.getUint8(1);
  let addressLength = 0;
  let addressIndex = 2;
  let address = "";
  switch (atype) {
    case 1:
      addressLength = 4;
      address = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + 1))[0];
      addressIndex += 1;
      address = new TextDecoder().decode(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      address = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${atype}`
      };
  }
  if (!address) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${atype}`
    };
  }
  const portIndex = addressIndex + addressLength;
  const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: address,
    portRemote,
    rawClientData: socks5DataBuffer.slice(portIndex + 4)
  };
}
__name(parseTRHeader, "parseTRHeader");
async function handleTCPOutBound2(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, log) {
  async function connectAndWrite(address, port) {
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) address = `${atob("d3d3Lg==")}${address}${atob("LnNzbGlwLmlv")}`;
    const tcpSocket2 = connect2({
      hostname: address,
      port
    });
    remoteSocket.value = tcpSocket2;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket2.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket2;
  }
  __name(connectAndWrite, "connectAndWrite");
  async function retry() {
    const panelProxyIP = globalThis.pathName.split("/")[2];
    const panelProxyIPs = panelProxyIP ? atob(panelProxyIP).split(",") : void 0;
    const finalProxyIP = panelProxyIPs ? panelProxyIPs[Math.floor(Math.random() * panelProxyIPs.length)] : globalThis.proxyIP || addressRemote;
    const tcpSocket2 = await connectAndWrite(finalProxyIP, portRemote);
    tcpSocket2.closed.catch((error) => {
      console.log("retry tcpSocket closed error", error);
    }).finally(() => {
      safeCloseWebSocket2(webSocket);
    });
    TRRemoteSocketToWS(tcpSocket2, webSocket, null, log);
  }
  __name(retry, "retry");
  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  TRRemoteSocketToWS(tcpSocket, webSocket, retry, log);
}
__name(handleTCPOutBound2, "handleTCPOutBound");
function makeReadableWebSocketStream2(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message2 = event.data;
        controller.enqueue(message2);
      });
      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket2(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer has error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer2(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {
    },
    cancel(reason) {
      if (readableStreamCancel) {
        return;
      }
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket2(webSocketServer);
    }
  });
  return stream;
}
__name(makeReadableWebSocketStream2, "makeReadableWebSocketStream");
async function TRRemoteSocketToWS(remoteSocket, webSocket, retry, log) {
  let hasIncomingData = false;
  await remoteSocket.readable.pipeTo(
    new WritableStream({
      start() {
      },
      /**
       *
       * @param {Uint8Array} chunk
       * @param {*} controller
       */
      async write(chunk, controller) {
        hasIncomingData = true;
        if (webSocket.readyState !== WS_READY_STATE_OPEN2) {
          controller.error("webSocket connection is not open");
        }
        webSocket.send(chunk);
      },
      close() {
        log(`remoteSocket.readable is closed, hasIncomingData: ${hasIncomingData}`);
      },
      abort(reason) {
        console.error("remoteSocket.readable abort", reason);
      }
    })
  ).catch((error) => {
    console.error(`${atob("dHJvamFu")}RemoteSocketToWS error:`, error.stack || error);
    safeCloseWebSocket2(webSocket);
  });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}
__name(TRRemoteSocketToWS, "TRRemoteSocketToWS");
function base64ToArrayBuffer2(base64Str) {
  if (!base64Str) {
    return { earlyData: null, error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode2 = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode2, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { earlyData: null, error };
  }
}
__name(base64ToArrayBuffer2, "base64ToArrayBuffer");
var WS_READY_STATE_OPEN2 = 1;
var WS_READY_STATE_CLOSING2 = 2;
function safeCloseWebSocket2(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN2 || socket.readyState === WS_READY_STATE_CLOSING2) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}
__name(safeCloseWebSocket2, "safeCloseWebSocket");

// src/pages/error.js
async function renderErrorPage(error) {
  const errorPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${atob("QlBC")} Error</title>
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
            <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
            <div id="error-message">
                <h2>\u274C Something went wrong!</h2>
                <p><b>${error ? `\u26A0\uFE0F ${error.cause ? error.message.toString() : error.stack.toString()}` : ""}</b></p>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
    <\/script>
    </body>
    </html>`;
  return new Response(errorPage, { status: 200, headers: { "Content-Type": "text/html" } });
}
__name(renderErrorPage, "renderErrorPage");

// src/cores-configs/xray.js
async function buildXrayDNS(proxySettings, outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp) {
  const {
    remoteDNS,
    localDNS,
    VLTRFakeDNS,
    enableIPv6,
    warpFakeDNS,
    warpEnableIPv6,
    blockAds,
    bypassIran,
    bypassChina,
    blockPorn,
    bypassRussia,
    customBypassRules,
    customBlockRules
  } = proxySettings;
  const bypassRules = [
    { rule: bypassIran, domain: "geosite:category-ir", ip: "geoip:ir" },
    { rule: bypassChina, domain: "geosite:cn", ip: "geoip:cn" },
    { rule: bypassRussia, domain: "geosite:category-ru", ip: "geoip:ru" }
  ];
  const blockRules = [
    { rule: blockAds, host: "geosite:category-ads-all" },
    { rule: blockAds, host: "geosite:category-ads-ir" },
    { rule: blockPorn, host: "geosite:category-porn" }
  ];
  const isFakeDNS = VLTRFakeDNS && !isWarp || warpFakeDNS && isWarp;
  const isIPv62 = enableIPv6 && !isWarp || warpEnableIPv6 && isWarp;
  const outboundDomains = outboundAddrs.filter((address) => isDomain(address));
  const customBypassRulesDomains = customBypassRules.split(",").filter((address) => isDomain(address));
  const customBlockRulesDomains = customBlockRules.split(",").filter((address) => isDomain(address));
  const uniqueOutboundDomains = [...new Set(outboundDomains)];
  const isDomainRule = [...uniqueOutboundDomains, ...customBypassRulesDomains].length > 0;
  const isBypass = bypassIran || bypassChina || bypassRussia;
  const isBlock = blockAds || blockPorn || customBlockRulesDomains.length > 0;
  const finalRemoteDNS = isWorkerLess ? ["https://cloudflare-dns.com/dns-query"] : isWarp ? warpEnableIPv6 ? ["1.1.1.1", "1.0.0.1", "2606:4700:4700::1111", "2606:4700:4700::1001"] : ["1.1.1.1", "1.0.0.1"] : [remoteDNS];
  const dnsHost = {};
  if (isBlock) {
    blockRules.forEach(({ rule, host }) => {
      if (rule) dnsHost[host] = ["127.0.0.1"];
    });
    customBlockRulesDomains.forEach((domain) => {
      dnsHost[`domain:${domain}`] = ["127.0.0.1"];
    });
  }
  const staticIPs = domainToStaticIPs ? await resolveDNS(domainToStaticIPs) : void 0;
  if (staticIPs) dnsHost[domainToStaticIPs] = enableIPv6 ? [...staticIPs.ipv4, ...staticIPs.ipv6] : staticIPs.ipv4;
  if (isWorkerLess) {
    const domains = ["cloudflare-dns.com", "cloudflare.com", "dash.cloudflare.com"];
    const resolved = await Promise.all(domains.map(resolveDNS));
    const hostIPv4 = resolved.flatMap((r) => r.ipv4);
    const hostIPv6 = enableIPv6 ? resolved.flatMap((r) => r.ipv6) : [];
    dnsHost["cloudflare-dns.com"] = [
      ...hostIPv4,
      ...hostIPv6
    ];
  }
  const hosts = Object.keys(dnsHost).length ? { hosts: dnsHost } : {};
  const dnsObject = {
    ...hosts,
    servers: finalRemoteDNS,
    queryStrategy: isIPv62 ? "UseIP" : "UseIPv4",
    tag: "dns"
  };
  const dohHost = getDomain(remoteDNS);
  if (dohHost.isHostDomain && !isWorkerLess && !isWarp) dnsObject.servers.push({
    address: "https://8.8.8.8/dns-query",
    domains: [`full:${dohHost.host}`],
    skipFallback: true
  });
  if (isDomainRule) {
    const outboundDomainRules = uniqueOutboundDomains.map((domain) => `full:${domain}`);
    const bypassDomainRules = customBypassRulesDomains.map((domain) => `domain:${domain}`);
    dnsObject.servers.push({
      address: localDNS,
      domains: [...outboundDomainRules, ...bypassDomainRules],
      skipFallback: true
    });
  }
  const localDNSServer = {
    address: localDNS,
    domains: [],
    expectIPs: [],
    skipFallback: true
  };
  if (!isWorkerLess && isBypass) {
    bypassRules.forEach(({ rule, domain, ip }) => {
      if (rule) {
        localDNSServer.domains.push(domain);
        localDNSServer.expectIPs.push(ip);
      }
    });
    dnsObject.servers.push(localDNSServer);
  }
  if (isFakeDNS) {
    const fakeDNSServer = isBypass && !isWorkerLess ? { address: "fakedns", domains: localDNSServer.domains } : "fakedns";
    dnsObject.servers.unshift(fakeDNSServer);
  }
  return dnsObject;
}
__name(buildXrayDNS, "buildXrayDNS");
function buildXrayRoutingRules(proxySettings, outboundAddrs, isChain, isBalancer, isWorkerLess, isWarp) {
  const {
    remoteDNS,
    localDNS,
    warpEnableIPv6,
    bypassLAN,
    bypassIran,
    bypassChina,
    bypassRussia,
    blockAds,
    blockPorn,
    blockUDP443,
    customBypassRules,
    customBlockRules
  } = proxySettings;
  const geoRules = [
    { rule: bypassLAN, type: "direct", domain: "geosite:private", ip: "geoip:private" },
    { rule: bypassIran, type: "direct", domain: "geosite:category-ir", ip: "geoip:ir" },
    { rule: bypassChina, type: "direct", domain: "geosite:cn", ip: "geoip:cn" },
    { rule: blockAds, type: "block", domain: "geosite:category-ads-all" },
    { rule: blockAds, type: "block", domain: "geosite:category-ads-ir" },
    { rule: blockPorn, type: "block", domain: "geosite:category-porn" }
  ];
  const outboundDomains = outboundAddrs.filter((address) => isDomain(address));
  const customBypassRulesTotal = customBypassRules ? customBypassRules.split(",") : [];
  const customBlockRulesTotal = customBlockRules ? customBlockRules.split(",") : [];
  const customBypassRulesDomains = customBypassRulesTotal.filter((address) => isDomain(address));
  const isDomainRule = [...outboundDomains, ...customBypassRulesDomains].length > 0;
  const isBlock = blockAds || blockPorn || customBlockRulesTotal.length > 0;
  const isBypass = bypassIran || bypassChina || bypassRussia || customBypassRulesTotal.length > 0;
  const finallOutboundTag = isChain ? "chain" : isWorkerLess ? "fragment" : "proxy";
  const { host: dohHost, isHostDomain: isRemoteDnsDomain } = getDomain(remoteDNS);
  const remoteDNSHosts = isWarp ? warpEnableIPv6 ? ["1.1.1.1", "1.0.0.1", "2606:4700:4700::1111", "2606:4700:4700::1001"] : ["1.1.1.1", "1.0.0.1"] : [isRemoteDnsDomain ? `full:${dohHost}` : dohHost];
  const rules = [
    {
      inboundTag: [
        "dns-in"
      ],
      outboundTag: "dns-out",
      type: "field"
    },
    {
      inboundTag: [
        "socks-in",
        "http-in"
      ],
      port: "53",
      network: "udp",
      outboundTag: "dns-out",
      type: "field"
    }
  ];
  if (!isWorkerLess) {
    const port = isWarp ? "53" : "443";
    const ipDomain = isRemoteDnsDomain ? "domain" : "ip";
    const outboundType = isBalancer ? "balancerTag" : "outboundTag";
    const tag2 = isBalancer ? "all" : finallOutboundTag;
    rules.push({
      [ipDomain]: remoteDNSHosts,
      port,
      [outboundType]: tag2,
      type: "field"
    });
  }
  if (!isWorkerLess && (isDomainRule || isBypass)) rules.push({
    ip: [localDNS],
    port: "53",
    network: "udp",
    outboundTag: "direct",
    type: "field"
  });
  blockUDP443 && rules.push({
    network: "udp",
    port: "443",
    outboundTag: "block",
    type: "field"
  });
  if (isBypass || isBlock) {
    const createRule = /* @__PURE__ */ __name((type, outbound) => ({
      [type]: [],
      outboundTag: outbound,
      type: "field"
    }), "createRule");
    let domainDirectRule, ipDirectRule;
    if (!isWorkerLess) {
      domainDirectRule = createRule("domain", "direct");
      ipDirectRule = createRule("ip", "direct");
    }
    let domainBlockRule = createRule("domain", "block");
    let ipBlockRule = createRule("ip", "block");
    geoRules.forEach(({ rule, type, domain, ip }) => {
      if (rule) {
        if (type === "direct") {
          domainDirectRule?.domain.push(domain);
          ipDirectRule?.ip?.push(ip);
        } else {
          domainBlockRule.domain.push(domain);
        }
      }
    });
    customBypassRulesTotal.forEach((address) => {
      if (isDomain(address)) {
        domainDirectRule?.domain.push(`domain:${address}`);
      } else {
        ipDirectRule?.ip.push(address);
      }
    });
    customBlockRulesTotal.forEach((address) => {
      if (isDomain(address)) {
        domainBlockRule.domain.push(`domain:${address}`);
      } else {
        ipBlockRule.ip.push(address);
      }
    });
    domainBlockRule.domain.length && rules.push(domainBlockRule);
    ipBlockRule.ip.length && rules.push(ipBlockRule);
    if (!isWorkerLess) {
      domainDirectRule.domain.length && rules.push(domainDirectRule);
      ipDirectRule.ip.length && rules.push(ipDirectRule);
    }
  }
  if (isBalancer) {
    rules.push({
      network: "tcp,udp",
      balancerTag: "all",
      type: "field"
    });
  } else {
    rules.push({
      network: "tcp,udp",
      outboundTag: finallOutboundTag,
      type: "field"
    });
  }
  return rules;
}
__name(buildXrayRoutingRules, "buildXrayRoutingRules");
function buildXrayVLOutbound(tag2, address, port, host, sni, proxyIP, isFragment, allowInsecure, enableIPv6) {
  const { userID: userID2, defaultHttpsPorts } = globalThis;
  const outbound = {
    protocol: atob("dmxlc3M="),
    settings: {
      vnext: [
        {
          address,
          port: +port,
          users: [
            {
              id: userID2,
              encryption: "none",
              level: 8
            }
          ]
        }
      ]
    },
    streamSettings: {
      network: "ws",
      security: "none",
      sockopt: {},
      wsSettings: {
        host,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
        },
        path: `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}?ed=2560`
      }
    },
    tag: tag2
  };
  if (defaultHttpsPorts.includes(port)) {
    outbound.streamSettings.security = "tls";
    outbound.streamSettings.tlsSettings = {
      allowInsecure,
      fingerprint: "randomized",
      alpn: ["h2", "http/1.1"],
      serverName: sni
    };
  }
  const sockopt = outbound.streamSettings.sockopt;
  if (isFragment) {
    sockopt.dialerProxy = "fragment";
  } else {
    sockopt.tcpKeepAliveIdle = 30;
    sockopt.domainStrategy = enableIPv6 ? "UseIPv4v6" : "UseIPv4";
  }
  return outbound;
}
__name(buildXrayVLOutbound, "buildXrayVLOutbound");
function buildXrayTROutbound(tag2, address, port, host, sni, proxyIP, isFragment, allowInsecure, enableIPv6) {
  const { TRPassword, defaultHttpsPorts } = globalThis;
  const outbound = {
    protocol: atob("dHJvamFu"),
    settings: {
      servers: [
        {
          address,
          port: +port,
          password: TRPassword,
          level: 8
        }
      ]
    },
    streamSettings: {
      network: "ws",
      security: "none",
      sockopt: {},
      wsSettings: {
        headers: {
          Host: host
        },
        path: `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}?ed=2560`
      }
    },
    tag: tag2
  };
  if (defaultHttpsPorts.includes(port)) {
    outbound.streamSettings.security = "tls";
    outbound.streamSettings.tlsSettings = {
      allowInsecure,
      fingerprint: "randomized",
      alpn: ["h2", "http/1.1"],
      serverName: sni
    };
  }
  const sockopt = outbound.streamSettings.sockopt;
  if (isFragment) {
    sockopt.dialerProxy = "fragment";
  } else {
    sockopt.tcpKeepAliveIdle = 30;
    sockopt.domainStrategy = enableIPv6 ? "UseIPv4v6" : "UseIPv4";
  }
  return outbound;
}
__name(buildXrayTROutbound, "buildXrayTROutbound");
function buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, chain, client) {
  const {
    warpEnableIPv6,
    nikaNGNoiseMode,
    noiseCountMin,
    noiseCountMax,
    noiseSizeMin,
    noiseSizeMax,
    noiseDelayMin,
    noiseDelayMax
  } = proxySettings;
  const isWoW = chain === "proxy";
  const {
    warpIPv6,
    reserved,
    publicKey,
    privateKey
  } = extractWireguardParams(warpConfigs, isWoW);
  const outbound = {
    protocol: "wireguard",
    settings: {
      address: [
        "172.16.0.2/32",
        warpIPv6
      ],
      mtu: 1280,
      peers: [
        {
          endpoint: isWoW ? "162.159.192.1:2408" : endpoint,
          publicKey,
          keepAlive: 5
        }
      ],
      reserved: base64ToDecimal(reserved),
      secretKey: privateKey
    },
    streamSettings: {
      sockopt: {
        dialerProxy: chain
      }
    },
    tag: isWoW ? "chain" : "proxy"
  };
  !chain && delete outbound.streamSettings;
  client === "nikang" && !isWoW && delete outbound.streamSettings && Object.assign(outbound.settings, {
    wnoise: nikaNGNoiseMode,
    wnoisecount: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
    wpayloadsize: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
    wnoisedelay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
  });
  return outbound;
}
__name(buildXrayWarpOutbound, "buildXrayWarpOutbound");
function buildXrayChainOutbound(chainProxyParams, enableIPv6) {
  if (["socks", "http"].includes(chainProxyParams.protocol)) {
    const { protocol, server: server2, port: port2, user, pass } = chainProxyParams;
    return {
      protocol,
      settings: {
        servers: [
          {
            address: server2,
            port: +port2,
            users: [
              {
                user,
                pass,
                level: 8
              }
            ]
          }
        ]
      },
      streamSettings: {
        network: "tcp",
        sockopt: {
          dialerProxy: "proxy",
          domainStrategy: enableIPv6 ? "UseIPv4v6" : "UseIPv4"
        }
      },
      mux: {
        enabled: true,
        concurrency: 8,
        xudpConcurrency: 16,
        xudpProxyUDP443: "reject"
      },
      tag: "chain"
    };
  }
  const {
    server,
    port,
    uuid,
    flow,
    security,
    type,
    sni,
    fp,
    alpn,
    pbk,
    sid,
    spx,
    headerType,
    host,
    path,
    authority,
    serviceName,
    mode
  } = chainProxyParams;
  const proxyOutbound = {
    mux: {
      concurrency: 8,
      enabled: true,
      xudpConcurrency: 16,
      xudpProxyUDP443: "reject"
    },
    protocol: atob("dmxlc3M="),
    settings: {
      vnext: [
        {
          address: server,
          port: +port,
          users: [
            {
              encryption: "none",
              flow,
              id: uuid,
              level: 8,
              security: "auto"
            }
          ]
        }
      ]
    },
    streamSettings: {
      network: type,
      security,
      sockopt: {
        dialerProxy: "proxy",
        domainStrategy: enableIPv6 ? "UseIPv4v6" : "UseIPv4"
      }
    },
    tag: "chain"
  };
  if (security === "tls") {
    const tlsAlpns = alpn ? alpn?.split(",") : [];
    proxyOutbound.streamSettings.tlsSettings = {
      allowInsecure: false,
      fingerprint: fp,
      alpn: tlsAlpns,
      serverName: sni
    };
  }
  if (security === "reality") {
    delete proxyOutbound.mux;
    proxyOutbound.streamSettings.realitySettings = {
      fingerprint: fp,
      publicKey: pbk,
      serverName: sni,
      shortId: sid,
      spiderX: spx
    };
  }
  if (headerType === "http") {
    const httpPaths = path?.split(",");
    const httpHosts = host?.split(",");
    proxyOutbound.streamSettings.tcpSettings = {
      header: {
        request: {
          headers: { Host: httpHosts },
          method: "GET",
          path: httpPaths,
          version: "1.1"
        },
        response: {
          headers: { "Content-Type": ["application/octet-stream"] },
          reason: "OK",
          status: "200",
          version: "1.1"
        },
        type: "http"
      }
    };
  }
  if (type === "tcp" && security !== "reality" && !headerType) proxyOutbound.streamSettings.tcpSettings = {
    header: {
      type: "none"
    }
  };
  if (type === "ws") proxyOutbound.streamSettings.wsSettings = {
    headers: { Host: host },
    path
  };
  if (type === "grpc") {
    delete proxyOutbound.mux;
    proxyOutbound.streamSettings.grpcSettings = {
      authority,
      multiMode: mode === "multi",
      serviceName
    };
  }
  return proxyOutbound;
}
__name(buildXrayChainOutbound, "buildXrayChainOutbound");
function buildFreedomOutbound(proxySettings, isFragment, isUdpNoises, tag2) {
  const {
    xrayUdpNoises,
    fragmentPackets,
    lengthMin,
    lengthMax,
    intervalMin,
    intervalMax,
    enableIPv6,
    warpEnableIPv6
  } = proxySettings;
  const outbound = {
    tag: tag2,
    protocol: "freedom",
    settings: {},
    streamSettings: {
      sockopt: {
        tcpKeepAliveIdle: 30
      }
    }
  };
  if (isFragment) {
    outbound.settings.fragment = {
      packets: fragmentPackets,
      length: `${lengthMin}-${lengthMax}`,
      interval: `${intervalMin}-${intervalMax}`
    };
    outbound.settings.domainStrategy = enableIPv6 ? "UseIPv4v6" : "UseIPv4";
  }
  if (isUdpNoises) {
    outbound.settings.noises = [];
    JSON.parse(xrayUdpNoises).forEach((noise) => {
      const count = +noise.count;
      delete noise.count;
      outbound.settings.noises.push(...Array.from({ length: count }, () => noise));
    });
    if (!isFragment) outbound.settings.domainStrategy = warpEnableIPv6 ? "UseIPv4v6" : "UseIPv4";
  }
  return outbound;
}
__name(buildFreedomOutbound, "buildFreedomOutbound");
function buildXrayConfig(proxySettings, remark, isBalancer, isChain, balancerFallback, isWarp) {
  const {
    VLTRFakeDNS,
    warpFakeDNS,
    bestVLTRInterval,
    bestWarpInterval
  } = proxySettings;
  const isFakeDNS = VLTRFakeDNS && !isWarp || warpFakeDNS && isWarp;
  const config = structuredClone(xrayConfigTemp);
  config.remarks = remark;
  if (isFakeDNS) {
    config.inbounds[0].sniffing.destOverride.push("fakedns");
    config.inbounds[1].sniffing.destOverride.push("fakedns");
  }
  if (isBalancer) {
    const interval = isWarp ? bestWarpInterval : bestVLTRInterval;
    config.observatory.probeInterval = `${interval}s`;
    if (balancerFallback) config.routing.balancers[0].fallbackTag = "prox-2";
    if (isChain) {
      config.observatory.subjectSelector = ["chain"];
      config.routing.balancers[0].selector = ["chain"];
    }
  } else {
    delete config.observatory;
    delete config.routing.balancers;
  }
  return config;
}
__name(buildXrayConfig, "buildXrayConfig");
async function buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment) {
  const remark = isFragment ? `\u{1F4A6} ${atob("QlBC")} F - Best Ping \u{1F4A5}` : `\u{1F4A6} ${atob("QlBC")} - Best Ping \u{1F4A5}`;
  const config = buildXrayConfig(proxySettings, remark, true, chainProxy, true);
  config.dns = await buildXrayDNS(proxySettings, totalAddresses, void 0, false, false);
  config.routing.rules = buildXrayRoutingRules(proxySettings, totalAddresses, chainProxy, true, false, false);
  config.outbounds.unshift(...outbounds);
  return config;
}
__name(buildXrayBestPingConfig, "buildXrayBestPingConfig");
async function buildXrayBestFragmentConfig(proxySettings, hostName2, chainProxy, outbounds) {
  const bestFragValues = [
    "10-20",
    "20-30",
    "30-40",
    "40-50",
    "50-60",
    "60-70",
    "70-80",
    "80-90",
    "90-100",
    "10-30",
    "20-40",
    "30-50",
    "40-60",
    "50-70",
    "60-80",
    "70-90",
    "80-100",
    "100-200"
  ];
  const config = buildXrayConfig(proxySettings, `\u{1F4A6} ${atob("QlBC")} F - Best Fragment \u{1F60E}`, true, chainProxy, false, false);
  config.dns = await buildXrayDNS(proxySettings, [], hostName2, false, false);
  config.routing.rules = buildXrayRoutingRules(proxySettings, [], chainProxy, true, false, false);
  const bestFragOutbounds = [];
  const freedomOutbound = outbounds.pop();
  bestFragValues.forEach((fragLength, index) => {
    if (chainProxy) {
      const chainOutbound = structuredClone(chainProxy);
      chainOutbound.tag = `chain-${index + 1}`;
      chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
      bestFragOutbounds.push(chainOutbound);
    }
    const proxyOutbound = structuredClone(outbounds[chainProxy ? 1 : 0]);
    proxyOutbound.tag = `prox-${index + 1}`;
    proxyOutbound.streamSettings.sockopt.dialerProxy = `frag-${index + 1}`;
    const fragmentOutbound = structuredClone(freedomOutbound);
    fragmentOutbound.tag = `frag-${index + 1}`;
    fragmentOutbound.settings.fragment.length = fragLength;
    fragmentOutbound.settings.fragment.interval = "1-1";
    bestFragOutbounds.push(proxyOutbound, fragmentOutbound);
  });
  config.outbounds.unshift(...bestFragOutbounds);
  return config;
}
__name(buildXrayBestFragmentConfig, "buildXrayBestFragmentConfig");
async function buildXrayWorkerLessConfig(proxySettings) {
  const config = buildXrayConfig(proxySettings, `\u{1F4A6} ${atob("QlBC")} F - WorkerLess \u2B50`, false, false, false, false);
  const fragmentOutbound = buildFreedomOutbound(proxySettings, true, true, "fragment");
  config.outbounds.unshift(fragmentOutbound);
  config.dns = await buildXrayDNS(proxySettings, [], void 0, true);
  config.routing.rules = buildXrayRoutingRules(proxySettings, [], false, false, true, false);
  const fakeOutbound = buildXrayVLOutbound("fake-outbound", "google.com", "443", globalThis.userID, "google.com", "google.com", "", true, false);
  fakeOutbound.streamSettings.wsSettings.path = "/";
  config.outbounds.push(fakeOutbound);
  return config;
}
__name(buildXrayWorkerLessConfig, "buildXrayWorkerLessConfig");
async function getXrayCustomConfigs(request, env, isFragment) {
  const { hostName: hostName2, defaultHttpsPorts } = globalThis;
  const { proxySettings } = await getDataset(request, env);
  let configs = [];
  let outbounds = [];
  let protocols = [];
  let chainProxy;
  const {
    proxyIP,
    outProxy,
    outProxyParams,
    cleanIPs,
    enableIPv6,
    customCdnAddrs,
    customCdnHost,
    customCdnSni,
    VLConfigs,
    TRConfigs,
    ports
  } = proxySettings;
  if (outProxy) {
    const proxyParams = JSON.parse(outProxyParams);
    try {
      chainProxy = buildXrayChainOutbound(proxyParams, enableIPv6);
    } catch (error) {
      console.log("An error occured while parsing chain proxy: ", error);
      chainProxy = void 0;
      await env.kv.put("proxySettings", JSON.stringify({
        ...proxySettings,
        outProxy: "",
        outProxyParams: {}
      }));
    }
  }
  const Addresses = await getConfigAddresses(cleanIPs, enableIPv6);
  const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(",") : [];
  const totalAddresses = isFragment ? [...Addresses] : [...Addresses, ...customCdnAddresses];
  const totalPorts = ports.filter((port) => isFragment ? defaultHttpsPorts.includes(port) : true);
  VLConfigs && protocols.push(atob("VkxFU1M="));
  TRConfigs && protocols.push(atob("VHJvamFu"));
  let proxyIndex = 1;
  let freedomOutbound = isFragment ? buildFreedomOutbound(proxySettings, true, false, "fragment") : null;
  for (const protocol of protocols) {
    let protocolIndex = 1;
    for (const port of totalPorts) {
      for (const addr of totalAddresses) {
        const isCustomAddr = customCdnAddresses.includes(addr);
        const configType = isCustomAddr ? "C" : isFragment ? "F" : "";
        const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName2);
        const host = isCustomAddr ? customCdnHost : hostName2;
        const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
        const customConfig = buildXrayConfig(proxySettings, remark, false, chainProxy, false, false);
        isFragment && customConfig.outbounds.unshift(freedomOutbound);
        customConfig.dns = await buildXrayDNS(proxySettings, [addr], void 0, false, false);
        customConfig.routing.rules = buildXrayRoutingRules(proxySettings, [addr], chainProxy, false, false, false);
        const outbound = protocol === atob("VkxFU1M=") ? buildXrayVLOutbound("proxy", addr, port, host, sni, proxyIP, isFragment, isCustomAddr, enableIPv6) : buildXrayTROutbound("proxy", addr, port, host, sni, proxyIP, isFragment, isCustomAddr, enableIPv6);
        customConfig.outbounds.unshift({ ...outbound });
        outbound.tag = `prox-${proxyIndex}`;
        if (chainProxy) {
          customConfig.outbounds.unshift(chainProxy);
          const chainOutbound = structuredClone(chainProxy);
          chainOutbound.tag = `chain-${proxyIndex}`;
          chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${proxyIndex}`;
          outbounds.push(chainOutbound);
        }
        outbounds.push(outbound);
        configs.push(customConfig);
        proxyIndex++;
        protocolIndex++;
      }
    }
  }
  isFragment && outbounds.push(freedomOutbound);
  const bestPing = await buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment);
  const finalConfigs = [...configs, bestPing];
  if (isFragment) {
    const bestFragment = await buildXrayBestFragmentConfig(proxySettings, hostName2, chainProxy, outbounds);
    const workerLessConfig = await buildXrayWorkerLessConfig(proxySettings);
    finalConfigs.push(bestFragment, workerLessConfig);
  }
  return new Response(JSON.stringify(finalConfigs, null, 4), {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getXrayCustomConfigs, "getXrayCustomConfigs");
async function getXrayWarpConfigs(request, env, client) {
  const { proxySettings, warpConfigs } = await getDataset(request, env);
  const { warpEndpoints } = proxySettings;
  const xrayWarpConfigs = [];
  const xrayWoWConfigs = [];
  const xrayWarpOutbounds = [];
  const xrayWoWOutbounds = [];
  const outboundDomains = warpEndpoints.split(",").map((endpoint) => endpoint.split(":")[0]).filter((address) => isDomain(address));
  const proIndicator = client !== "xray" ? " Pro " : " ";
  const xrayWarpChain = client === "xray-pro" ? "udp-noise" : void 0;
  let freedomOutbound;
  for (const [index, endpoint] of warpEndpoints.split(",").entries()) {
    const endpointHost = endpoint.split(":")[0];
    const warpConfig = buildXrayConfig(proxySettings, `\u{1F4A6} ${index + 1} - Warp${proIndicator}\u{1F1EE}\u{1F1F7}`, false, false, false, true);
    const WoWConfig = buildXrayConfig(proxySettings, `\u{1F4A6} ${index + 1} - WoW${proIndicator}\u{1F30D}`, false, true, false, true);
    if (client === "xray-pro") {
      freedomOutbound = buildFreedomOutbound(proxySettings, false, true, "udp-noise");
      warpConfig.outbounds.unshift(freedomOutbound);
      WoWConfig.outbounds.unshift(freedomOutbound);
    }
    warpConfig.dns = WoWConfig.dns = await buildXrayDNS(proxySettings, [endpointHost], void 0, false, true);
    warpConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], false, false, false, true);
    WoWConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], true, false, false, true);
    const warpOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, xrayWarpChain, client);
    const WoWOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, "proxy", client);
    warpConfig.outbounds.unshift(warpOutbound);
    WoWConfig.outbounds.unshift(WoWOutbound, warpOutbound);
    xrayWarpConfigs.push(warpConfig);
    xrayWoWConfigs.push(WoWConfig);
    const proxyOutbound = structuredClone(warpOutbound);
    proxyOutbound.tag = `prox-${index + 1}`;
    const chainOutbound = structuredClone(WoWOutbound);
    chainOutbound.tag = `chain-${index + 1}`;
    chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
    xrayWarpOutbounds.push(proxyOutbound);
    xrayWoWOutbounds.push(chainOutbound);
  }
  const dnsObject = await buildXrayDNS(proxySettings, outboundDomains, void 0, false, true);
  const xrayWarpBestPing = buildXrayConfig(proxySettings, `\u{1F4A6} Warp${proIndicator}- Best Ping \u{1F680}`, true, false, false, true);
  xrayWarpBestPing.dns = dnsObject;
  xrayWarpBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, false, true, false, true);
  client === "xray-pro" && xrayWarpBestPing.outbounds.unshift(freedomOutbound);
  xrayWarpBestPing.outbounds.unshift(...xrayWarpOutbounds);
  const xrayWoWBestPing = buildXrayConfig(proxySettings, `\u{1F4A6} WoW${proIndicator}- Best Ping \u{1F680}`, true, true, false, true);
  xrayWoWBestPing.dns = dnsObject;
  xrayWoWBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, true, true, false, true);
  client === "xray-pro" && xrayWoWBestPing.outbounds.unshift(freedomOutbound);
  xrayWoWBestPing.outbounds.unshift(...xrayWoWOutbounds, ...xrayWarpOutbounds);
  const configs = [...xrayWarpConfigs, ...xrayWoWConfigs, xrayWarpBestPing, xrayWoWBestPing];
  return new Response(JSON.stringify(configs, null, 4), {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getXrayWarpConfigs, "getXrayWarpConfigs");
var xrayConfigTemp = {
  remarks: "",
  log: {
    loglevel: "warning"
  },
  dns: {},
  inbounds: [
    {
      port: 10808,
      protocol: "socks",
      settings: {
        auth: "noauth",
        udp: true,
        userLevel: 8
      },
      sniffing: {
        destOverride: ["http", "tls"],
        enabled: true,
        routeOnly: true
      },
      tag: "socks-in"
    },
    {
      port: 10809,
      protocol: "http",
      settings: {
        auth: "noauth",
        udp: true,
        userLevel: 8
      },
      sniffing: {
        destOverride: ["http", "tls"],
        enabled: true,
        routeOnly: true
      },
      tag: "http-in"
    },
    {
      port: 10853,
      protocol: "dokodemo-door",
      settings: {
        address: "1.1.1.1",
        network: "tcp,udp",
        port: 53
      },
      tag: "dns-in"
    }
  ],
  outbounds: [
    {
      protocol: "dns",
      tag: "dns-out"
    },
    {
      protocol: "freedom",
      settings: {
        domainStrategy: "UseIP"
      },
      tag: "direct"
    },
    {
      protocol: "blackhole",
      settings: {
        response: {
          type: "http"
        }
      },
      tag: "block"
    }
  ],
  policy: {
    levels: {
      8: {
        connIdle: 300,
        downlinkOnly: 1,
        handshake: 4,
        uplinkOnly: 1
      }
    },
    system: {
      statsOutboundUplink: true,
      statsOutboundDownlink: true
    }
  },
  routing: {
    domainStrategy: "IPIfNonMatch",
    rules: [],
    balancers: [
      {
        tag: "all",
        selector: ["prox"],
        strategy: {
          type: "leastPing"
        }
      }
    ]
  },
  observatory: {
    subjectSelector: [
      "prox"
    ],
    probeUrl: "https://www.gstatic.com/generate_204",
    probeInterval: "30s",
    enableConcurrency: true
  },
  stats: {}
};

// src/cores-configs/sing-box.js
function buildSingBoxDNS(proxySettings, outboundAddrs, isWarp) {
  const {
    remoteDNS,
    localDNS,
    VLTRFakeDNS,
    enableIPv6,
    warpFakeDNS,
    warpEnableIPv6,
    bypassIran,
    bypassChina,
    bypassRussia,
    blockAds,
    blockPorn,
    customBypassRules,
    customBlockRules
  } = proxySettings;
  let fakeip;
  const dohHost = getDomain(remoteDNS);
  const isFakeDNS = VLTRFakeDNS && !isWarp || warpFakeDNS && isWarp;
  const isIPv62 = enableIPv6 && !isWarp || warpEnableIPv6 && isWarp;
  const customBypassRulesDomains = customBypassRules.split(",").filter((address) => isDomain(address));
  const customBlockRulesDomains = customBlockRules.split(",").filter((address) => isDomain(address));
  const geoRules = [
    { rule: bypassIran, type: "direct", geosite: "geosite-ir", geoip: "geoip-ir" },
    { rule: bypassChina, type: "direct", geosite: "geosite-cn", geoip: "geoip-cn" },
    { rule: bypassRussia, type: "direct", geosite: "geosite-category-ru", geoip: "geoip-ru" },
    { rule: true, type: "block", geosite: "geosite-malware" },
    { rule: true, type: "block", geosite: "geosite-phishing" },
    { rule: true, type: "block", geosite: "geosite-cryptominers" },
    { rule: blockAds, type: "block", geosite: "geosite-category-ads-all" },
    { rule: blockPorn, type: "block", geosite: "geosite-nsfw" }
  ];
  const servers = [
    {
      address: isWarp ? "1.1.1.1" : remoteDNS,
      address_resolver: dohHost.isHostDomain ? "doh-resolver" : "dns-direct",
      detour: "\u2705 Selector",
      tag: "dns-remote"
    },
    {
      address: localDNS,
      detour: "direct",
      tag: "dns-direct"
    },
    {
      address: "local",
      tag: "dns-local"
    }
  ];
  dohHost.isHostDomain && !isWarp && servers.push({
    address: "https://8.8.8.8/dns-query",
    detour: "\u2705 Selector",
    tag: "doh-resolver"
  });
  let outboundRule;
  if (isWarp) {
    outboundRule = {
      outbound: "any",
      server: "dns-direct"
    };
  } else {
    const outboundDomains = outboundAddrs.filter((address) => isDomain(address));
    const uniqueDomains = [...new Set(outboundDomains)];
    outboundRule = {
      domain: uniqueDomains,
      server: "dns-direct"
    };
  }
  const rules = [
    outboundRule,
    {
      domain: "www.gstatic.com",
      server: "dns-local"
    },
    {
      domain: [
        "raw.githubusercontent.com",
        "time.apple.com"
      ],
      server: "dns-direct"
    },
    {
      clash_mode: "Direct",
      server: "dns-direct"
    },
    {
      clash_mode: "Global",
      server: "dns-remote"
    }
  ];
  let blockRule = {
    disable_cache: true,
    rule_set: [],
    action: "reject"
  };
  geoRules.forEach(({ rule, type, geosite, geoip }) => {
    rule && type === "direct" && rules.push({
      type: "logical",
      mode: "and",
      rules: [
        { rule_set: geosite },
        { rule_set: geoip }
      ],
      server: "dns-direct"
    });
    rule && type === "block" && blockRule.rule_set.push(geosite);
  });
  rules.push(blockRule);
  const createRule = /* @__PURE__ */ __name((server) => ({
    domain_suffix: [],
    server
  }), "createRule");
  let domainDirectRule, domainBlockRule;
  if (customBypassRulesDomains.length) {
    domainDirectRule = createRule("dns-direct");
    customBypassRulesDomains.forEach((domain) => {
      domainDirectRule.domain_suffix.push(domain);
    });
    rules.push(domainDirectRule);
  }
  if (customBlockRulesDomains.length) {
    domainBlockRule = createRule("dns-block");
    customBlockRulesDomains.forEach((domain) => {
      domainBlockRule.domain_suffix.push(domain);
    });
    rules.push(domainBlockRule);
  }
  if (isFakeDNS) {
    servers.push({
      address: "fakeip",
      tag: "dns-fake"
    });
    rules.push({
      disable_cache: true,
      inbound: "tun-in",
      query_type: [
        "A",
        "AAAA"
      ],
      server: "dns-fake"
    });
    fakeip = {
      enabled: true,
      inet4_range: "198.18.0.0/15"
    };
    if (isIPv62) fakeip.inet6_range = "fc00::/18";
  }
  return { servers, rules, fakeip };
}
__name(buildSingBoxDNS, "buildSingBoxDNS");
function buildSingBoxRoutingRules(proxySettings) {
  const {
    bypassLAN,
    bypassIran,
    bypassChina,
    bypassRussia,
    blockAds,
    blockPorn,
    blockUDP443,
    customBypassRules,
    customBlockRules
  } = proxySettings;
  const customBypassRulesTotal = customBypassRules ? customBypassRules.split(",") : [];
  const customBlockRulesTotal = customBlockRules ? customBlockRules.split(",") : [];
  const defaultRules = [
    {
      action: "sniff"
    },
    {
      action: "hijack-dns",
      mode: "or",
      rules: [
        {
          inbound: "dns-in"
        },
        {
          protocol: "dns"
        }
      ],
      type: "logical"
    },
    {
      clash_mode: "Direct",
      outbound: "direct"
    },
    {
      clash_mode: "Global",
      outbound: "\u2705 Selector"
    }
  ];
  const geoRules = [
    {
      rule: bypassIran,
      type: "direct",
      ruleSet: {
        geosite: "geosite-ir",
        geoip: "geoip-ir",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",
        geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs"
      }
    },
    {
      rule: bypassChina,
      type: "direct",
      ruleSet: {
        geosite: "geosite-cn",
        geoip: "geoip-cn",
        geositeURL: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        geoipURL: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs"
      }
    },
    {
      rule: bypassRussia,
      type: "direct",
      ruleSet: {
        geosite: "geosite-category-ru",
        geoip: "geoip-ru",
        geositeURL: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ru.srs",
        geoipURL: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-ru.srs"
      }
    },
    {
      rule: true,
      type: "block",
      ruleSet: {
        geosite: "geosite-malware",
        geoip: "geoip-malware",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs",
        geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs"
      }
    },
    {
      rule: true,
      type: "block",
      ruleSet: {
        geosite: "geosite-phishing",
        geoip: "geoip-phishing",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs",
        geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs"
      }
    },
    {
      rule: true,
      type: "block",
      ruleSet: {
        geosite: "geosite-cryptominers",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs"
      }
    },
    {
      rule: blockAds,
      type: "block",
      ruleSet: {
        geosite: "geosite-category-ads-all",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs"
      }
    },
    {
      rule: blockPorn,
      type: "block",
      ruleSet: {
        geosite: "geosite-nsfw",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs"
      }
    }
  ];
  const directDomainRules = [], directIPRules = [], blockDomainRules = [], blockIPRules = [], ruleSets = [];
  bypassLAN && directIPRules.push({
    ip_is_private: true,
    outbound: "direct"
  });
  const createRule = /* @__PURE__ */ __name((rule, action) => {
    return action === "direct" ? {
      [rule]: [],
      outbound: action
    } : {
      [rule]: [],
      action
    };
  }, "createRule");
  const routingRuleSet = {
    type: "remote",
    tag: "",
    format: "binary",
    url: "",
    download_detour: "direct"
  };
  const directDomainRule = createRule("rule_set", "direct");
  ;
  const directIPRule = createRule("rule_set", "direct");
  ;
  const blockDomainRule = createRule("rule_set", "reject");
  const blockIPRule = createRule("rule_set", "reject");
  geoRules.forEach(({ rule, type, ruleSet }) => {
    if (!rule) return;
    const { geosite, geoip, geositeURL, geoipURL } = ruleSet;
    const isDirect = type === "direct";
    const domainRule = isDirect ? directDomainRule : blockDomainRule;
    const ipRule = isDirect ? directIPRule : blockIPRule;
    domainRule.rule_set.push(geosite);
    ruleSets.push({ ...routingRuleSet, tag: geosite, url: geositeURL });
    if (geoip) {
      ipRule.rule_set.push(geoip);
      ruleSets.push({ ...routingRuleSet, tag: geoip, url: geoipURL });
    }
  });
  const pushRuleIfNotEmpty = /* @__PURE__ */ __name((rule, targetArray) => {
    if (rule.rule_set?.length || rule.domain_suffix?.length || rule.ip_cidr?.length) {
      targetArray.push(rule);
    }
  }, "pushRuleIfNotEmpty");
  pushRuleIfNotEmpty(directDomainRule, directDomainRules);
  pushRuleIfNotEmpty(directIPRule, directIPRules);
  pushRuleIfNotEmpty(blockDomainRule, blockDomainRules);
  pushRuleIfNotEmpty(blockIPRule, blockIPRules);
  const processRules = /* @__PURE__ */ __name((addresses, action) => {
    const domainRule = createRule("domain_suffix", action);
    const ipRule = createRule("ip_cidr", action);
    addresses.forEach((address) => {
      if (isDomain(address)) {
        domainRule.domain_suffix.push(address);
      } else {
        const ip = isIPv6(address) ? address.replace(/\[|\]/g, "") : address;
        ipRule.ip_cidr.push(ip);
      }
    });
    pushRuleIfNotEmpty(domainRule, action === "direct" ? directDomainRules : blockDomainRules);
    pushRuleIfNotEmpty(ipRule, action === "direct" ? directIPRules : blockIPRules);
  }, "processRules");
  customBypassRulesTotal.length && processRules(customBypassRulesTotal, "direct");
  customBlockRulesTotal.length && processRules(customBlockRulesTotal, "reject");
  let rules = [];
  blockUDP443 && rules.push({
    network: "udp",
    port: 443,
    protocol: "quic",
    action: "reject"
  });
  rules = [...defaultRules, ...rules, ...blockDomainRules, ...blockIPRules, ...directDomainRules, ...directIPRules];
  return { rules, rule_set: ruleSets };
}
__name(buildSingBoxRoutingRules, "buildSingBoxRoutingRules");
function buildSingBoxVLOutbound(proxySettings, remark, address, port, host, sni, allowInsecure) {
  const { userID: userID2, defaultHttpsPorts } = globalThis;
  const { enableIPv6, proxyIP } = proxySettings;
  const path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}`;
  const tls = defaultHttpsPorts.includes(port) ? true : false;
  const outbound = {
    type: atob("dmxlc3M="),
    server: address,
    server_port: +port,
    uuid: userID2,
    packet_encoding: "",
    tls: {
      alpn: "http/1.1",
      enabled: true,
      insecure: allowInsecure,
      server_name: sni,
      utls: {
        enabled: true,
        fingerprint: "randomized"
      }
    },
    transport: {
      early_data_header_name: "Sec-WebSocket-Protocol",
      max_early_data: 2560,
      headers: {
        Host: host
      },
      path,
      type: "ws"
    },
    tag: remark
  };
  if (isDomain(address)) outbound.domain_strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
  if (!tls) delete outbound.tls;
  return outbound;
}
__name(buildSingBoxVLOutbound, "buildSingBoxVLOutbound");
function buildSingBoxTROutbound(proxySettings, remark, address, port, host, sni, allowInsecure) {
  const { TRPassword, defaultHttpsPorts } = globalThis;
  const { enableIPv6, proxyIP } = proxySettings;
  const path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}`;
  const tls = defaultHttpsPorts.includes(port) ? true : false;
  const outbound = {
    type: atob("dHJvamFu"),
    password: TRPassword,
    server: address,
    server_port: +port,
    tls: {
      alpn: "http/1.1",
      enabled: true,
      insecure: allowInsecure,
      server_name: sni,
      utls: {
        enabled: true,
        fingerprint: "randomized"
      }
    },
    transport: {
      early_data_header_name: "Sec-WebSocket-Protocol",
      max_early_data: 2560,
      headers: {
        Host: host
      },
      path,
      type: "ws"
    },
    tag: remark
  };
  if (isDomain(address)) outbound.domain_strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
  if (!tls) delete outbound.tls;
  return outbound;
}
__name(buildSingBoxTROutbound, "buildSingBoxTROutbound");
function buildSingBoxWarpOutbound(proxySettings, warpConfigs, remark, endpoint, chain) {
  const ipv6Regex = /\[(.*?)\]/;
  const portRegex = /[^:]*$/;
  const endpointServer = endpoint.includes("[") ? endpoint.match(ipv6Regex)[1] : endpoint.split(":")[0];
  const endpointPort = endpoint.includes("[") ? +endpoint.match(portRegex)[0] : +endpoint.split(":")[1];
  const server = chain ? "162.159.192.1" : endpointServer;
  const port = chain ? 2408 : endpointPort;
  const { warpEnableIPv6 } = proxySettings;
  const {
    warpIPv6,
    reserved,
    publicKey,
    privateKey
  } = extractWireguardParams(warpConfigs, chain);
  const outbound = {
    address: [
      "172.16.0.2/32",
      warpIPv6
    ],
    mtu: 1280,
    peers: [
      {
        address: server,
        port,
        public_key: publicKey,
        reserved: base64ToDecimal(reserved),
        allowed_ips: [
          "0.0.0.0/0",
          "::/0"
        ],
        persistent_keepalive_interval: 5
      }
    ],
    private_key: privateKey,
    type: "wireguard",
    tag: remark
  };
  if (isDomain(server)) outbound.domain_strategy = warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only";
  if (chain) outbound.detour = chain;
  return outbound;
}
__name(buildSingBoxWarpOutbound, "buildSingBoxWarpOutbound");
function buildSingBoxChainOutbound(chainProxyParams, enableIPv6) {
  if (["socks", "http"].includes(chainProxyParams.protocol)) {
    const { protocol, server: server2, port: port2, user, pass } = chainProxyParams;
    const chainOutbound2 = {
      type: protocol,
      tag: "",
      server: server2,
      server_port: +port2,
      username: user,
      password: pass,
      detour: ""
    };
    if (isDomain(server2)) chainOutbound2.domain_strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
    if (protocol === "socks") chainOutbound2.version = "5";
    return chainOutbound2;
  }
  const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
  const chainOutbound = {
    type: atob("dmxlc3M="),
    tag: "",
    server,
    server_port: +port,
    uuid,
    flow,
    detour: ""
  };
  if (isDomain(server)) chainOutbound.domain_strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
  if (security === "tls" || security === "reality") {
    const tlsAlpns = alpn ? alpn?.split(",").filter((value) => value !== "h2") : [];
    chainOutbound.tls = {
      enabled: true,
      server_name: sni,
      insecure: false,
      alpn: tlsAlpns,
      utls: {
        enabled: true,
        fingerprint: fp
      }
    };
    if (security === "reality") {
      chainOutbound.tls.reality = {
        enabled: true,
        public_key: pbk,
        short_id: sid
      };
      delete chainOutbound.tls.alpn;
    }
  }
  if (headerType === "http") {
    const httpHosts = host?.split(",");
    chainOutbound.transport = {
      type: "http",
      host: httpHosts,
      path,
      method: "GET",
      headers: {
        "Connection": ["keep-alive"],
        "Content-Type": ["application/octet-stream"]
      }
    };
  }
  if (type === "ws") {
    const wsPath = path?.split("?ed=")[0];
    const earlyData = +path?.split("?ed=")[1] || 0;
    chainOutbound.transport = {
      type: "ws",
      path: wsPath,
      headers: { Host: host },
      max_early_data: earlyData,
      early_data_header_name: "Sec-WebSocket-Protocol"
    };
  }
  if (type === "grpc") chainOutbound.transport = {
    type: "grpc",
    service_name: serviceName
  };
  return chainOutbound;
}
__name(buildSingBoxChainOutbound, "buildSingBoxChainOutbound");
async function getSingBoxWarpConfig(request, env) {
  const { proxySettings, warpConfigs } = await getDataset(request, env);
  const { warpEndpoints } = proxySettings;
  const config = structuredClone(singboxConfigTemp);
  config.endpoints = [];
  const dnsObject = buildSingBoxDNS(proxySettings, void 0, true);
  const { rules, rule_set } = buildSingBoxRoutingRules(proxySettings);
  config.dns.servers = dnsObject.servers;
  config.dns.rules = dnsObject.rules;
  config.dns.strategy = proxySettings.warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only";
  if (dnsObject.fakeip) config.dns.fakeip = dnsObject.fakeip;
  config.route.rules = rules;
  config.route.rule_set = rule_set;
  const selector = config.outbounds[0];
  const warpUrlTest = config.outbounds[1];
  selector.outbounds = [`\u{1F4A6} Warp - Best Ping \u{1F680}`, `\u{1F4A6} WoW - Best Ping \u{1F680}`];
  config.outbounds.splice(2, 0, structuredClone(warpUrlTest));
  const WoWUrlTest = config.outbounds[2];
  warpUrlTest.tag = `\u{1F4A6} Warp - Best Ping \u{1F680}`;
  warpUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
  WoWUrlTest.tag = `\u{1F4A6} WoW - Best Ping \u{1F680}`;
  WoWUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
  const warpRemarks = [], WoWRemarks = [];
  warpEndpoints.split(",").forEach((endpoint, index) => {
    const warpRemark = `\u{1F4A6} ${index + 1} - Warp \u{1F1EE}\u{1F1F7}`;
    const WoWRemark = `\u{1F4A6} ${index + 1} - WoW \u{1F30D}`;
    const warpOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, warpRemark, endpoint, "");
    const WoWOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, WoWRemark, endpoint, warpRemark);
    config.endpoints.push(WoWOutbound, warpOutbound);
    warpRemarks.push(warpRemark);
    WoWRemarks.push(WoWRemark);
    warpUrlTest.outbounds.push(warpRemark);
    WoWUrlTest.outbounds.push(WoWRemark);
  });
  selector.outbounds.push(...warpRemarks, ...WoWRemarks);
  return new Response(JSON.stringify(config, null, 4), {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getSingBoxWarpConfig, "getSingBoxWarpConfig");
async function getSingBoxCustomConfig(request, env) {
  const { hostName: hostName2 } = globalThis;
  const { proxySettings } = await getDataset(request, env);
  let chainProxy;
  const {
    cleanIPs,
    ports,
    VLConfigs,
    TRConfigs,
    outProxy,
    outProxyParams,
    customCdnAddrs,
    customCdnHost,
    customCdnSni,
    bestVLTRInterval,
    enableIPv6
  } = proxySettings;
  if (outProxy) {
    const proxyParams = JSON.parse(outProxyParams);
    try {
      chainProxy = buildSingBoxChainOutbound(proxyParams, enableIPv6);
    } catch (error) {
      console.log("An error occured while parsing chain proxy: ", error);
      chainProxy = void 0;
      await env.kv.put("proxySettings", JSON.stringify({
        ...proxySettings,
        outProxy: "",
        outProxyParams: {}
      }));
    }
  }
  const Addresses = await getConfigAddresses(cleanIPs, enableIPv6);
  const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(",") : [];
  const totalAddresses = [...Addresses, ...customCdnAddresses];
  const config = structuredClone(singboxConfigTemp);
  const dnsObject = buildSingBoxDNS(proxySettings, totalAddresses, false);
  const { rules, rule_set } = buildSingBoxRoutingRules(proxySettings);
  config.dns.servers = dnsObject.servers;
  config.dns.rules = dnsObject.rules;
  if (dnsObject.fakeip) config.dns.fakeip = dnsObject.fakeip;
  config.dns.strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
  config.route.rules = rules;
  config.route.rule_set = rule_set;
  const selector = config.outbounds[0];
  const urlTest = config.outbounds[1];
  selector.outbounds = ["\u{1F4A6} Best Ping \u{1F4A5}"];
  urlTest.interval = `${bestVLTRInterval}s`;
  urlTest.tag = "\u{1F4A6} Best Ping \u{1F4A5}";
  let proxyIndex = 1;
  const protocols = [
    ...VLConfigs ? [atob("VkxFU1M=")] : [],
    ...TRConfigs ? [atob("VHJvamFu")] : []
  ];
  protocols.forEach((protocol) => {
    let protocolIndex = 1;
    ports.forEach((port) => {
      totalAddresses.forEach((addr) => {
        let VLOutbound, TROutbound;
        const isCustomAddr = customCdnAddresses.includes(addr);
        const configType = isCustomAddr ? "C" : "";
        const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName2);
        const host = isCustomAddr ? customCdnHost : hostName2;
        const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
        if (protocol === atob("VkxFU1M=")) {
          VLOutbound = buildSingBoxVLOutbound(
            proxySettings,
            chainProxy ? `proxy-${proxyIndex}` : remark,
            addr,
            port,
            host,
            sni,
            isCustomAddr
          );
          config.outbounds.push(VLOutbound);
        }
        if (protocol === atob("VHJvamFu")) {
          TROutbound = buildSingBoxTROutbound(
            proxySettings,
            chainProxy ? `proxy-${proxyIndex}` : remark,
            addr,
            port,
            host,
            sni,
            isCustomAddr
          );
          config.outbounds.push(TROutbound);
        }
        if (chainProxy) {
          const chain = structuredClone(chainProxy);
          chain.tag = remark;
          chain.detour = `proxy-${proxyIndex}`;
          config.outbounds.push(chain);
        }
        selector.outbounds.push(remark);
        urlTest.outbounds.push(remark);
        proxyIndex++;
        protocolIndex++;
      });
    });
  });
  return new Response(JSON.stringify(config, null, 4), {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getSingBoxCustomConfig, "getSingBoxCustomConfig");
var singboxConfigTemp = {
  log: {
    level: "warn",
    timestamp: true
  },
  dns: {
    servers: [],
    rules: [],
    independent_cache: true
  },
  inbounds: [
    {
      type: "direct",
      tag: "dns-in",
      listen: "0.0.0.0",
      listen_port: 6450,
      override_address: "1.1.1.1",
      override_port: 53
    },
    {
      type: "tun",
      tag: "tun-in",
      address: [
        "172.18.0.1/30",
        "fdfe:dcba:9876::1/126"
      ],
      mtu: 9e3,
      auto_route: true,
      strict_route: true,
      endpoint_independent_nat: true,
      stack: "mixed"
    },
    {
      type: "mixed",
      tag: "mixed-in",
      listen: "0.0.0.0",
      listen_port: 2080
    }
  ],
  outbounds: [
    {
      type: "selector",
      tag: "\u2705 Selector",
      outbounds: []
    },
    {
      type: "urltest",
      tag: "",
      outbounds: [],
      url: "https://www.gstatic.com/generate_204",
      interval: ""
    },
    {
      type: "direct",
      domain_strategy: "ipv4_only",
      tag: "direct"
    }
  ],
  route: {
    rules: [],
    rule_set: [],
    auto_detect_interface: true,
    override_android_vpn: true,
    final: "\u2705 Selector"
  },
  ntp: {
    enabled: true,
    server: "time.apple.com",
    server_port: 123,
    detour: "direct",
    interval: "30m"
  },
  experimental: {
    cache_file: {
      enabled: true,
      store_fakeip: true
    },
    clash_api: {
      external_controller: "127.0.0.1:9090",
      external_ui: "ui",
      external_ui_download_url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
      external_ui_download_detour: "direct",
      default_mode: "Rule"
    }
  }
};

// src/cores-configs/clash.js
async function buildClashDNS(proxySettings, isChain, isWarp) {
  const {
    remoteDNS,
    localDNS,
    VLTRFakeDNS,
    outProxyParams,
    enableIPv6,
    warpFakeDNS,
    warpEnableIPv6,
    bypassIran,
    bypassChina,
    bypassRussia,
    customBypassRules
  } = proxySettings;
  const warpRemoteDNS = warpEnableIPv6 ? ["1.1.1.1", "1.0.0.1", "[2606:4700:4700::1111]", "[2606:4700:4700::1001]"] : ["1.1.1.1", "1.0.0.1"];
  const isFakeDNS = VLTRFakeDNS && !isWarp || warpFakeDNS && isWarp;
  const isIPv62 = enableIPv6 && !isWarp || warpEnableIPv6 && isWarp;
  const customBypassRulesDomains = customBypassRules.split(",").filter((address) => isDomain(address));
  const isBypass = bypassIran || bypassChina || bypassRussia;
  const bypassRules = [
    { rule: bypassIran, geosite: "ir" },
    { rule: bypassChina, geosite: "cn" },
    { rule: bypassRussia, geosite: "ru" }
  ];
  const dns = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "ipv6": isIPv62,
    "respect-rules": true,
    "use-system-hosts": false,
    "nameserver": isWarp ? warpRemoteDNS.map((dns2) => `${dns2}#\u2705 Selector`) : [isChain ? `${remoteDNS}#proxy-1` : `${remoteDNS}#\u2705 Selector`],
    "proxy-server-nameserver": [`${localDNS}#DIRECT`],
    "nameserver-policy": {
      "raw.githubusercontent.com": `${localDNS}#DIRECT`,
      "time.apple.com": `${localDNS}#DIRECT`,
      "www.gstatic.com": "system"
    }
  };
  if (isChain && !isWarp) {
    const chainOutboundServer = JSON.parse(outProxyParams).server;
    if (isDomain(chainOutboundServer)) dns["nameserver-policy"][chainOutboundServer] = `${remoteDNS}#proxy-1`;
  }
  if (isBypass) {
    const geosites = [];
    bypassRules.forEach(({ rule, geosite }) => {
      rule && geosites.push(geosite);
    });
    dns["nameserver-policy"][`rule-set:${geosites.join(",")}`] = [`${localDNS}#DIRECT`];
  }
  customBypassRulesDomains.forEach((domain) => {
    dns["nameserver-policy"][`+.${domain}`] = [`${localDNS}#DIRECT`];
  });
  const dohHost = getDomain(remoteDNS);
  if (dohHost.isHostDomain && !isWarp) {
    dns["default-nameserver"] = [`https://8.8.8.8/dns-query#${isChain ? "proxy-1" : "\u2705 Selector"}`];
  }
  if (isFakeDNS) Object.assign(dns, {
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": ["geosite:private"]
  });
  return dns;
}
__name(buildClashDNS, "buildClashDNS");
function buildClashRoutingRules(proxySettings) {
  const {
    bypassLAN,
    bypassIran,
    bypassChina,
    bypassRussia,
    blockAds,
    blockPorn,
    blockUDP443,
    customBypassRules,
    customBlockRules
  } = proxySettings;
  const customBypassRulesTotal = customBypassRules ? customBypassRules.split(",") : [];
  const customBlockRulesTotal = customBlockRules ? customBlockRules.split(",") : [];
  const geoRules = [
    {
      rule: bypassLAN,
      type: "direct",
      noResolve: true,
      ruleProvider: {
        format: "yaml",
        geosite: "private",
        geoip: "private-cidr",
        geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.yaml",
        geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.yaml"
      }
    },
    {
      rule: bypassIran,
      type: "direct",
      ruleProvider: {
        format: "text",
        geosite: "ir",
        geoip: "ir-cidr",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",
        geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"
      }
    },
    {
      rule: bypassChina,
      type: "direct",
      ruleProvider: {
        format: "yaml",
        geosite: "cn",
        geoip: "cn-cidr",
        geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
        geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"
      }
    },
    {
      rule: bypassRussia,
      type: "direct",
      ruleProvider: {
        format: "yaml",
        geosite: "ru",
        geoip: "ru-cidr",
        geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",
        geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"
      }
    },
    {
      rule: true,
      type: "block",
      ruleProvider: {
        format: "text",
        geosite: "malware",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt"
      }
    },
    {
      rule: true,
      type: "block",
      ruleProvider: {
        format: "text",
        geosite: "phishing",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt"
      }
    },
    {
      rule: true,
      type: "block",
      ruleProvider: {
        format: "text",
        geosite: "cryptominers",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"
      }
    },
    {
      rule: blockAds,
      type: "block",
      ruleProvider: {
        format: "text",
        geosite: "ads",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ads.txt"
      }
    },
    {
      rule: blockPorn,
      type: "block",
      ruleProvider: {
        format: "text",
        geosite: "nsfw",
        geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt"
      }
    }
  ];
  function buildRuleProvider(tag2, format, behavior, url) {
    const fileExtension = format === "text" ? "txt" : format;
    return {
      [tag2]: {
        type: "http",
        format,
        behavior,
        url,
        path: `./ruleset/${tag2}.${fileExtension}`,
        interval: 86400
      }
    };
  }
  __name(buildRuleProvider, "buildRuleProvider");
  const directDomainRules = [], directIPRules = [], blockDomainRules = [], blockIPRules = [], ruleProviders = {};
  geoRules.forEach(({ rule, type, ruleProvider, noResolve }) => {
    const { geosite, geoip, geositeURL, geoipURL, format } = ruleProvider;
    if (rule) {
      if (geosite) {
        const targetRules = type === "direct" ? directDomainRules : blockDomainRules;
        targetRules.push(`RULE-SET,${geosite},${type === "direct" ? "DIRECT" : "REJECT"}`);
        const ruleProvider2 = buildRuleProvider(geosite, format, "domain", geositeURL);
        Object.assign(ruleProviders, ruleProvider2);
      }
      if (geoip) {
        const targetRules = type === "direct" ? directIPRules : blockIPRules;
        targetRules.push(`RULE-SET,${geoip},${type === "direct" ? "DIRECT" : "REJECT"}${noResolve ? ",no-resolve" : ""}`);
        const ruleProvider2 = buildRuleProvider(geoip, format, "ipcidr", geoipURL);
        Object.assign(ruleProviders, ruleProvider2);
      }
    }
  });
  const generateRule = /* @__PURE__ */ __name((address, action) => {
    if (isDomain(address)) {
      return `DOMAIN-SUFFIX,${address},${action}`;
    } else {
      const type = isIPv4(address) ? "IP-CIDR" : "IP-CIDR6";
      const ip = isIPv6(address) ? address.replace(/\[|\]/g, "") : address;
      const cidr = address.includes("/") ? "" : isIPv4(address) ? "/32" : "/128";
      return `${type},${ip}${cidr},${action},no-resolve`;
    }
  }, "generateRule");
  [...customBypassRulesTotal, ...customBlockRulesTotal].forEach((address, index) => {
    const isDirectRule = index < customBypassRulesTotal.length;
    const action = isDirectRule ? "DIRECT" : "REJECT";
    const targetRules = isDirectRule ? isDomain(address) ? directDomainRules : directIPRules : isDomain(address) ? blockDomainRules : blockIPRules;
    targetRules.push(generateRule(address, action));
  });
  let rules = [];
  blockUDP443 && rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
  rules.push("OR,((IP-CIDR,10.10.34.34/32),(IP-CIDR,10.10.34.35/32),(IP-CIDR,10.10.34.36/32)),REJECT");
  rules = [...rules, ...blockDomainRules, ...blockIPRules, ...directDomainRules, ...directIPRules];
  rules.push("MATCH,\u2705 Selector");
  return { rules, ruleProviders };
}
__name(buildClashRoutingRules, "buildClashRoutingRules");
function buildClashVLOutbound(remark, address, port, host, sni, path, allowInsecure) {
  const { userID: userID2, defaultHttpsPorts } = globalThis;
  const tls = defaultHttpsPorts.includes(port) ? true : false;
  const addr = isIPv6(address) ? address.replace(/\[|\]/g, "") : address;
  const outbound = {
    "name": remark,
    "type": atob("dmxlc3M="),
    "server": addr,
    "port": +port,
    "uuid": userID2,
    "packet-encoding": "",
    "tls": tls,
    "network": "ws",
    "udp": true,
    "ws-opts": {
      "path": path,
      "headers": { "host": host },
      "max-early-data": 2560,
      "early-data-header-name": "Sec-WebSocket-Protocol"
    }
  };
  if (tls) {
    Object.assign(outbound, {
      "servername": sni,
      "alpn": ["h2", "http/1.1"],
      "client-fingerprint": "random",
      "skip-cert-verify": allowInsecure
    });
  }
  return outbound;
}
__name(buildClashVLOutbound, "buildClashVLOutbound");
function buildClashTROutbound(remark, address, port, host, sni, path, allowInsecure) {
  const addr = isIPv6(address) ? address.replace(/\[|\]/g, "") : address;
  return {
    "name": remark,
    "type": atob("dHJvamFu"),
    "server": addr,
    "port": +port,
    "password": globalThis.TRPassword,
    "network": "ws",
    "udp": true,
    "ws-opts": {
      "path": path,
      "headers": { "host": host },
      "max-early-data": 2560,
      "early-data-header-name": "Sec-WebSocket-Protocol"
    },
    "sni": sni,
    "alpn": ["h2", "http/1.1"],
    "client-fingerprint": "random",
    "skip-cert-verify": allowInsecure
  };
}
__name(buildClashTROutbound, "buildClashTROutbound");
function buildClashWarpOutbound(warpConfigs, remark, endpoint, chain) {
  const ipv6Regex = /\[(.*?)\]/;
  const portRegex = /[^:]*$/;
  const endpointServer = endpoint.includes("[") ? endpoint.match(ipv6Regex)[1] : endpoint.split(":")[0];
  const endpointPort = endpoint.includes("[") ? +endpoint.match(portRegex)[0] : +endpoint.split(":")[1];
  const {
    warpIPv6,
    reserved,
    publicKey,
    privateKey
  } = extractWireguardParams(warpConfigs, chain);
  let outbound = {
    "name": remark,
    "type": "wireguard",
    "ip": "172.16.0.2/32",
    "ipv6": warpIPv6,
    "private-key": privateKey,
    "server": chain ? "162.159.192.1" : endpointServer,
    "port": chain ? 2408 : endpointPort,
    "public-key": publicKey,
    "allowed-ips": ["0.0.0.0/0", "::/0"],
    "reserved": reserved,
    "udp": true,
    "mtu": 1280
  };
  if (chain) outbound["dialer-proxy"] = chain;
  return outbound;
}
__name(buildClashWarpOutbound, "buildClashWarpOutbound");
function buildClashChainOutbound(chainProxyParams) {
  if (["socks", "http"].includes(chainProxyParams.protocol)) {
    const { protocol, server: server2, port: port2, user, pass } = chainProxyParams;
    const proxyType = protocol === "socks" ? "socks5" : protocol;
    return {
      "name": "",
      "type": proxyType,
      "server": server2,
      "port": +port2,
      "dialer-proxy": "",
      "username": user,
      "password": pass
    };
  }
  const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
  const chainOutbound = {
    "name": "\u{1F4A6} Chain Best Ping \u{1F4A5}",
    "type": atob("dmxlc3M="),
    "server": server,
    "port": +port,
    "udp": true,
    "uuid": uuid,
    "flow": flow,
    "network": type,
    "dialer-proxy": "\u{1F4A6} Best Ping \u{1F4A5}"
  };
  if (security === "tls") {
    const tlsAlpns = alpn ? alpn?.split(",") : [];
    Object.assign(chainOutbound, {
      "tls": true,
      "servername": sni,
      "alpn": tlsAlpns,
      "client-fingerprint": fp
    });
  }
  if (security === "reality") Object.assign(chainOutbound, {
    "tls": true,
    "servername": sni,
    "client-fingerprint": fp,
    "reality-opts": {
      "public-key": pbk,
      "short-id": sid
    }
  });
  if (headerType === "http") {
    const httpPaths = path?.split(",");
    chainOutbound["http-opts"] = {
      "method": "GET",
      "path": httpPaths,
      "headers": {
        "Connection": ["keep-alive"],
        "Content-Type": ["application/octet-stream"]
      }
    };
  }
  if (type === "ws") {
    const wsPath = path?.split("?ed=")[0];
    const earlyData = +path?.split("?ed=")[1];
    chainOutbound["ws-opts"] = {
      "path": wsPath,
      "headers": {
        "Host": host
      },
      "max-early-data": earlyData,
      "early-data-header-name": "Sec-WebSocket-Protocol"
    };
  }
  if (type === "grpc") chainOutbound["grpc-opts"] = {
    "grpc-service-name": serviceName
  };
  return chainOutbound;
}
__name(buildClashChainOutbound, "buildClashChainOutbound");
async function getClashWarpConfig(request, env) {
  const { proxySettings, warpConfigs } = await getDataset(request, env);
  const { warpEndpoints } = proxySettings;
  const config = structuredClone(clashConfigTemp);
  config.dns = await buildClashDNS(proxySettings, true, true);
  const { rules, ruleProviders } = buildClashRoutingRules(proxySettings);
  config.rules = rules;
  config["rule-providers"] = ruleProviders;
  const selector = config["proxy-groups"][0];
  const warpUrlTest = config["proxy-groups"][1];
  selector.proxies = ["\u{1F4A6} Warp - Best Ping \u{1F680}", "\u{1F4A6} WoW - Best Ping \u{1F680}"];
  warpUrlTest.name = "\u{1F4A6} Warp - Best Ping \u{1F680}";
  warpUrlTest.interval = +proxySettings.bestWarpInterval;
  config["proxy-groups"].push(structuredClone(warpUrlTest));
  const WoWUrlTest = config["proxy-groups"][2];
  WoWUrlTest.name = "\u{1F4A6} WoW - Best Ping \u{1F680}";
  let warpRemarks = [], WoWRemarks = [];
  warpEndpoints.split(",").forEach((endpoint, index) => {
    const warpRemark = `\u{1F4A6} ${index + 1} - Warp \u{1F1EE}\u{1F1F7}`;
    const WoWRemark = `\u{1F4A6} ${index + 1} - WoW \u{1F30D}`;
    const warpOutbound = buildClashWarpOutbound(warpConfigs, warpRemark, endpoint, "");
    const WoWOutbound = buildClashWarpOutbound(warpConfigs, WoWRemark, endpoint, warpRemark);
    config.proxies.push(WoWOutbound, warpOutbound);
    warpRemarks.push(warpRemark);
    WoWRemarks.push(WoWRemark);
    warpUrlTest.proxies.push(warpRemark);
    WoWUrlTest.proxies.push(WoWRemark);
  });
  selector.proxies.push(...warpRemarks, ...WoWRemarks);
  return new Response(JSON.stringify(config, null, 4), {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getClashWarpConfig, "getClashWarpConfig");
async function getClashNormalConfig(request, env) {
  const { hostName: hostName2, defaultHttpsPorts } = globalThis;
  const { proxySettings } = await getDataset(request, env);
  let chainProxy;
  const {
    cleanIPs,
    proxyIP,
    ports,
    VLConfigs,
    TRConfigs,
    outProxy,
    outProxyParams,
    customCdnAddrs,
    customCdnHost,
    customCdnSni,
    bestVLTRInterval,
    enableIPv6
  } = proxySettings;
  if (outProxy) {
    const proxyParams = JSON.parse(outProxyParams);
    try {
      chainProxy = buildClashChainOutbound(proxyParams);
    } catch (error) {
      console.log("An error occured while parsing chain proxy: ", error);
      chainProxy = void 0;
      await env.kv.put("proxySettings", JSON.stringify({
        ...proxySettings,
        outProxy: "",
        outProxyParams: {}
      }));
    }
  }
  const config = structuredClone(clashConfigTemp);
  const { rules, ruleProviders } = buildClashRoutingRules(proxySettings);
  config.dns = await buildClashDNS(proxySettings, chainProxy, false);
  config.rules = rules;
  config["rule-providers"] = ruleProviders;
  const selector = config["proxy-groups"][0];
  const urlTest = config["proxy-groups"][1];
  selector.proxies = ["\u{1F4A6} Best Ping \u{1F4A5}"];
  urlTest.name = "\u{1F4A6} Best Ping \u{1F4A5}";
  urlTest.interval = +bestVLTRInterval;
  const Addresses = await getConfigAddresses(cleanIPs, enableIPv6);
  const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(",") : [];
  const totalAddresses = [...Addresses, ...customCdnAddresses];
  let proxyIndex = 1, path;
  const protocols = [
    ...VLConfigs ? [atob("VkxFU1M=")] : [],
    ...TRConfigs ? [atob("VHJvamFu")] : []
  ];
  protocols.forEach((protocol) => {
    let protocolIndex = 1;
    ports.forEach((port) => {
      totalAddresses.forEach((addr) => {
        let VLOutbound, TROutbound;
        const isCustomAddr = customCdnAddresses.includes(addr);
        const configType = isCustomAddr ? "C" : "";
        const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName2);
        const host = isCustomAddr ? customCdnHost : hostName2;
        const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType).replace(" : ", " - ");
        if (protocol === atob("VkxFU1M=")) {
          path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}`;
          VLOutbound = buildClashVLOutbound(
            chainProxy ? `proxy-${proxyIndex}` : remark,
            addr,
            port,
            host,
            sni,
            path,
            isCustomAddr
          );
          config.proxies.push(VLOutbound);
          selector.proxies.push(remark);
          urlTest.proxies.push(remark);
        }
        if (protocol === atob("VHJvamFu") && defaultHttpsPorts.includes(port)) {
          path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}`;
          TROutbound = buildClashTROutbound(
            chainProxy ? `proxy-${proxyIndex}` : remark,
            addr,
            port,
            host,
            sni,
            path,
            isCustomAddr
          );
          config.proxies.push(TROutbound);
          selector.proxies.push(remark);
          urlTest.proxies.push(remark);
        }
        if (chainProxy) {
          let chain = structuredClone(chainProxy);
          chain["name"] = remark;
          chain["dialer-proxy"] = `proxy-${proxyIndex}`;
          config.proxies.push(chain);
        }
        proxyIndex++;
        protocolIndex++;
      });
    });
  });
  return new Response(JSON.stringify(config, null, 4), {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getClashNormalConfig, "getClashNormalConfig");
var clashConfigTemp = {
  "mixed-port": 7890,
  "ipv6": true,
  "allow-lan": true,
  "mode": "rule",
  "log-level": "warning",
  "disable-keep-alive": false,
  "keep-alive-idle": 30,
  "keep-alive-interval": 30,
  "unified-delay": false,
  "geo-auto-update": true,
  "geo-update-interval": 168,
  "external-controller": "127.0.0.1:9090",
  "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
  "external-ui": "ui",
  "external-controller-cors": {
    "allow-origins": ["*"],
    "allow-private-network": true
  },
  "profile": {
    "store-selected": true,
    "store-fake-ip": true
  },
  "dns": {},
  "tun": {
    "enable": true,
    "stack": "mixed",
    "auto-route": true,
    "strict-route": true,
    "auto-detect-interface": true,
    "dns-hijack": ["any:53"],
    "mtu": 9e3
  },
  "sniffer": {
    "enable": true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": false,
    "sniff": {
      "HTTP": {
        "ports": [80, 8080, 8880, 2052, 2082, 2086, 2095]
      },
      "TLS": {
        "ports": [443, 8443, 2053, 2083, 2087, 2096]
      }
    }
  },
  "proxies": [],
  "proxy-groups": [
    {
      "name": "\u2705 Selector",
      "type": "select",
      "proxies": []
    },
    {
      "name": "",
      "type": "url-test",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 30,
      "tolerance": 50,
      "proxies": []
    }
  ],
  "rule-providers": {},
  "rules": [],
  "ntp": {
    "enable": true,
    "server": "time.apple.com",
    "port": 123,
    "interval": 30
  }
};

// src/cores-configs/normalConfigs.js
async function getNormalConfigs(request, env) {
  const { hostName: hostName2, defaultHttpsPorts, client, userID: userID2, TRPassword } = globalThis;
  const { proxySettings } = await getDataset(request, env);
  const {
    remoteDNS,
    cleanIPs,
    proxyIP,
    ports,
    VLConfigs,
    TRConfigs,
    lengthMin,
    lengthMax,
    intervalMin,
    intervalMax,
    outProxy,
    customCdnAddrs,
    customCdnHost,
    customCdnSni,
    enableIPv6
  } = proxySettings;
  let VLConfs = "", TRConfs = "", chainProxy = "";
  let proxyIndex = 1;
  const Addresses = await getConfigAddresses(cleanIPs, enableIPv6);
  const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(",") : [];
  const totalAddresses = [...Addresses, ...customCdnAddresses];
  const alpn = client === "singbox" ? "http/1.1" : "h2,http/1.1";
  const TRPass = encodeURIComponent(TRPassword);
  const earlyData = client === "singbox" ? "&eh=Sec-WebSocket-Protocol&ed=2560" : encodeURIComponent("?ed=2560");
  ports.forEach((port) => {
    totalAddresses.forEach((addr, index) => {
      const isCustomAddr = index > Addresses.length - 1;
      const configType = isCustomAddr ? "C" : "";
      const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName2);
      const host = isCustomAddr ? customCdnHost : hostName2;
      const path = `${getRandomPath(16)}${proxyIP ? `/${encodeURIComponent(btoa(proxyIP))}` : ""}${earlyData}`;
      const VLRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, atob("VkxFU1M="), configType));
      const TRRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, atob("VHJvamFu"), configType));
      const tlsFields = defaultHttpsPorts.includes(port) ? `&security=tls&sni=${sni}&fp=randomized&alpn=${alpn}` : "&security=none";
      const hiddifyFragment = client === "hiddify-frag" && defaultHttpsPorts.includes(port) ? `&fragment=${lengthMin}-${lengthMax},${intervalMin}-${intervalMax},hellotls` : "";
      if (VLConfigs) VLConfs += `${atob("dmxlc3M6Ly8=")}${userID2}@${addr}:${port}?path=/${path}&encryption=none&host=${host}&type=ws${tlsFields}${hiddifyFragment}#${VLRemark}
`;
      if (TRConfigs) TRConfs += `${atob("dHJvamFuOi8v")}${TRPass}@${addr}:${port}?path=/tr${path}&host=${host}&type=ws${tlsFields}${hiddifyFragment}#${TRRemark}
`;
      proxyIndex++;
    });
  });
  if (outProxy) {
    let chainRemark = `#${encodeURIComponent("\u{1F4A6} Chain proxy \u{1F517}")}`;
    if (outProxy.startsWith("socks") || outProxy.startsWith("http")) {
      const regex = /^(?:socks|http):\/\/([^@]+)@/;
      const isUserPass = outProxy.match(regex);
      const userPass = isUserPass ? isUserPass[1] : false;
      chainProxy = userPass ? outProxy.replace(userPass, btoa(userPass)) + chainRemark : outProxy + chainRemark;
    } else {
      chainProxy = outProxy.split("#")[0] + chainRemark;
    }
  }
  const configs = btoa(VLConfs + TRConfs + chainProxy);
  const headers = {
    "Content-Type": "text/plain;charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "CDN-Cache-Control": "no-store"
  };
  client === "hiddify-frag" && Object.assign(headers, {
    "Profile-Title": "BPB Fragment",
    "DNS": remoteDNS
  });
  return new Response(configs, {
    status: 200,
    headers
  });
}
__name(getNormalConfigs, "getNormalConfigs");
async function getHiddifyWarpConfigs(request, env, isPro) {
  const { proxySettings, warpConfigs } = await getDataset(request, env);
  const {
    warpEndpoints,
    hiddifyNoiseMode,
    noiseCountMin,
    noiseCountMax,
    noiseSizeMin,
    noiseSizeMax,
    noiseDelayMin,
    noiseDelayMax
  } = proxySettings;
  let configs = "";
  warpEndpoints.split(",").forEach((endpoint, index) => {
    configs += `warp://${endpoint}${isPro ? `?ifp=${noiseCountMin}-${noiseCountMax}&ifps=${noiseSizeMin}-${noiseSizeMax}&ifpd=${noiseDelayMin}-${noiseDelayMax}&ifpm=${hiddifyNoiseMode}` : ""}#${encodeURIComponent(`\u{1F4A6} ${index + 1} - Warp \u{1F1EE}\u{1F1F7}`)}&&detour=warp://162.159.192.1:2408#${encodeURIComponent(`\u{1F4A6} ${index + 1} - WoW \u{1F30D}`)}
`;
  });
  return new Response(btoa(configs), {
    status: 200,
    headers: {
      "Profile-Title": `BPB Warp${isPro ? " Pro" : ""}`,
      "DNS": "1.1.1.1",
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getHiddifyWarpConfigs, "getHiddifyWarpConfigs");

// src/pages/secrets.js
async function renderSecretsPage() {
  const secretsPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${atob("QlBC")} Generator</title>
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
            <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> \u{1F4A6}</h1>
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
                    <strong>Random ${atob("VHJvamFu")} Password</strong>
                    <div class="output-container">
                        <span id="${atob("dHJvamFu")}-password" class="output"></span>
                        <span class="copy-icon" onclick="copyToClipboard('${atob("dHJvamFu")}-password')">\u{1F4CB}</span>
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
                document.getElementById('${atob("dHJvamFu")}-password').textContent = password;
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
    </html>`;
  return new Response(secretsPage, { status: 200, headers: { "Content-Type": "text/html" } });
}
__name(renderSecretsPage, "renderSecretsPage");

// src/worker.js
var worker_default = {
  async fetch(request, env) {
    try {
      initializeParams(request, env);
      const { pathName: pathName2, subPath, client } = globalThis;
      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        switch (pathName2) {
          case "/update-warp":
            return await updateWarpConfigs(request, env);
          case "/get-warp-configs":
            return await getWarpConfigFiles(request, env);
          case `/sub/${subPath}`:
            if (client === "sfa") return await getSingBoxCustomConfig(request, env, false);
            if (client === "clash") return await getClashNormalConfig(request, env);
            if (client === "xray") return await getXrayCustomConfigs(request, env, false);
            return await getNormalConfigs(request, env);
          case `/fragsub/${subPath}`:
            return client === "hiddify-frag" ? await getNormalConfigs(request, env) : await getXrayCustomConfigs(request, env, true);
          case `/warpsub/${subPath}`:
            if (client === "clash") return await getClashWarpConfig(request, env);
            if (client === "singbox") return await getSingBoxWarpConfig(request, env, client);
            if (client === "hiddify-pro") return await getHiddifyWarpConfigs(request, env, true);
            if (client === "hiddify") return await getHiddifyWarpConfigs(request, env, false);
            return await getXrayWarpConfigs(request, env, client);
          case "/panel":
            return await handlePanel(request, env);
          case "/login":
            return await login(request, env);
          case "/logout":
            return logout();
          case "/panel/password":
            return await resetPassword(request, env);
          case "/my-ip":
            return await getMyIP(request);
          case "/secrets":
            return await renderSecretsPage();
          default:
            return await fallback(request);
        }
      } else {
        return pathName2.startsWith("/tr") ? await TROverWSHandler(request) : await VLOverWSHandler(request);
      }
    } catch (err) {
      return await renderErrorPage(err);
    }
  }
};
export {
  worker_default as default
};
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
=======
var ma=Object.create;var Or=Object.defineProperty;var xa=Object.getOwnPropertyDescriptor;var ba=Object.getOwnPropertyNames;var ga=Object.getPrototypeOf,ya=Object.prototype.hasOwnProperty;var f=(t,r)=>Or(t,"name",{value:r,configurable:!0}),lo=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,a)=>(typeof require<"u"?require:r)[a]}):t)((function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')}));var ir=(t,r)=>()=>(r||t((r={exports:{}}).exports,r),r.exports);var wa=(t,r,a,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let l of ba(r))!ya.call(t,l)&&l!==a&&Or(t,l,{get:()=>r[l],enumerable:!(n=xa(r,l))||n.enumerable});return t};var Wr=(t,r,a)=>(a=t!=null?ma(ga(t)):{},wa(r||!t||!t.__esModule?Or(a,"default",{value:t,enumerable:!0}):a,t));var Yr=ir((()=>{}));var Xr=ir(((Ji,Cr)=>{(function(t){"use strict";var r=f((function(o){var i,s=new Float64Array(16);if(o)for(i=0;i<o.length;i++)s[i]=o[i];return s}),"gf"),a=f((function(){throw new Error("no PRNG")}),"randombytes"),n=new Uint8Array(16),l=new Uint8Array(32);l[0]=9;var p=r(),u=r([1]),v=r([56129,1]),h=r([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),g=r([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),w=r([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),y=r([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),_=r([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function k(o,i,s,e){o[i]=s>>24&255,o[i+1]=s>>16&255,o[i+2]=s>>8&255,o[i+3]=s&255,o[i+4]=e>>24&255,o[i+5]=e>>16&255,o[i+6]=e>>8&255,o[i+7]=e&255}f(k,"ts64");function B(o,i,s,e,c){var m,b=0;for(m=0;m<c;m++)b|=o[i+m]^s[e+m];return(1&b-1>>>8)-1}f(B,"vn");function K(o,i,s,e){return B(o,i,s,e,16)}f(K,"crypto_verify_16");function V(o,i,s,e){return B(o,i,s,e,32)}f(V,"crypto_verify_32");function J(o,i,s,e){for(var c=e[0]&255|(e[1]&255)<<8|(e[2]&255)<<16|(e[3]&255)<<24,m=s[0]&255|(s[1]&255)<<8|(s[2]&255)<<16|(s[3]&255)<<24,b=s[4]&255|(s[5]&255)<<8|(s[6]&255)<<16|(s[7]&255)<<24,T=s[8]&255|(s[9]&255)<<8|(s[10]&255)<<16|(s[11]&255)<<24,O=s[12]&255|(s[13]&255)<<8|(s[14]&255)<<16|(s[15]&255)<<24,oe=e[4]&255|(e[5]&255)<<8|(e[6]&255)<<16|(e[7]&255)<<24,G=i[0]&255|(i[1]&255)<<8|(i[2]&255)<<16|(i[3]&255)<<24,ke=i[4]&255|(i[5]&255)<<8|(i[6]&255)<<16|(i[7]&255)<<24,q=i[8]&255|(i[9]&255)<<8|(i[10]&255)<<16|(i[11]&255)<<24,de=i[12]&255|(i[13]&255)<<8|(i[14]&255)<<16|(i[15]&255)<<24,ue=e[8]&255|(e[9]&255)<<8|(e[10]&255)<<16|(e[11]&255)<<24,be=s[16]&255|(s[17]&255)<<8|(s[18]&255)<<16|(s[19]&255)<<24,xe=s[20]&255|(s[21]&255)<<8|(s[22]&255)<<16|(s[23]&255)<<24,pe=s[24]&255|(s[25]&255)<<8|(s[26]&255)<<16|(s[27]&255)<<24,me=s[28]&255|(s[29]&255)<<8|(s[30]&255)<<16|(s[31]&255)<<24,he=e[12]&255|(e[13]&255)<<8|(e[14]&255)<<16|(e[15]&255)<<24,ee=c,ae=m,Q=b,te=T,re=O,j=oe,S=G,C=ke,N=q,I=de,$=ue,U=be,ce=xe,ge=pe,ve=me,ye=he,d,Ce=0;Ce<20;Ce+=2)d=ee+ce|0,re^=d<<7|d>>>32-7,d=re+ee|0,N^=d<<9|d>>>32-9,d=N+re|0,ce^=d<<13|d>>>32-13,d=ce+N|0,ee^=d<<18|d>>>32-18,d=j+ae|0,I^=d<<7|d>>>32-7,d=I+j|0,ge^=d<<9|d>>>32-9,d=ge+I|0,ae^=d<<13|d>>>32-13,d=ae+ge|0,j^=d<<18|d>>>32-18,d=$+S|0,ve^=d<<7|d>>>32-7,d=ve+$|0,Q^=d<<9|d>>>32-9,d=Q+ve|0,S^=d<<13|d>>>32-13,d=S+Q|0,$^=d<<18|d>>>32-18,d=ye+U|0,te^=d<<7|d>>>32-7,d=te+ye|0,C^=d<<9|d>>>32-9,d=C+te|0,U^=d<<13|d>>>32-13,d=U+C|0,ye^=d<<18|d>>>32-18,d=ee+te|0,ae^=d<<7|d>>>32-7,d=ae+ee|0,Q^=d<<9|d>>>32-9,d=Q+ae|0,te^=d<<13|d>>>32-13,d=te+Q|0,ee^=d<<18|d>>>32-18,d=j+re|0,S^=d<<7|d>>>32-7,d=S+j|0,C^=d<<9|d>>>32-9,d=C+S|0,re^=d<<13|d>>>32-13,d=re+C|0,j^=d<<18|d>>>32-18,d=$+I|0,U^=d<<7|d>>>32-7,d=U+$|0,N^=d<<9|d>>>32-9,d=N+U|0,I^=d<<13|d>>>32-13,d=I+N|0,$^=d<<18|d>>>32-18,d=ye+ve|0,ce^=d<<7|d>>>32-7,d=ce+ye|0,ge^=d<<9|d>>>32-9,d=ge+ce|0,ve^=d<<13|d>>>32-13,d=ve+ge|0,ye^=d<<18|d>>>32-18;ee=ee+c|0,ae=ae+m|0,Q=Q+b|0,te=te+T|0,re=re+O|0,j=j+oe|0,S=S+G|0,C=C+ke|0,N=N+q|0,I=I+de|0,$=$+ue|0,U=U+be|0,ce=ce+xe|0,ge=ge+pe|0,ve=ve+me|0,ye=ye+he|0,o[0]=ee>>>0&255,o[1]=ee>>>8&255,o[2]=ee>>>16&255,o[3]=ee>>>24&255,o[4]=ae>>>0&255,o[5]=ae>>>8&255,o[6]=ae>>>16&255,o[7]=ae>>>24&255,o[8]=Q>>>0&255,o[9]=Q>>>8&255,o[10]=Q>>>16&255,o[11]=Q>>>24&255,o[12]=te>>>0&255,o[13]=te>>>8&255,o[14]=te>>>16&255,o[15]=te>>>24&255,o[16]=re>>>0&255,o[17]=re>>>8&255,o[18]=re>>>16&255,o[19]=re>>>24&255,o[20]=j>>>0&255,o[21]=j>>>8&255,o[22]=j>>>16&255,o[23]=j>>>24&255,o[24]=S>>>0&255,o[25]=S>>>8&255,o[26]=S>>>16&255,o[27]=S>>>24&255,o[28]=C>>>0&255,o[29]=C>>>8&255,o[30]=C>>>16&255,o[31]=C>>>24&255,o[32]=N>>>0&255,o[33]=N>>>8&255,o[34]=N>>>16&255,o[35]=N>>>24&255,o[36]=I>>>0&255,o[37]=I>>>8&255,o[38]=I>>>16&255,o[39]=I>>>24&255,o[40]=$>>>0&255,o[41]=$>>>8&255,o[42]=$>>>16&255,o[43]=$>>>24&255,o[44]=U>>>0&255,o[45]=U>>>8&255,o[46]=U>>>16&255,o[47]=U>>>24&255,o[48]=ce>>>0&255,o[49]=ce>>>8&255,o[50]=ce>>>16&255,o[51]=ce>>>24&255,o[52]=ge>>>0&255,o[53]=ge>>>8&255,o[54]=ge>>>16&255,o[55]=ge>>>24&255,o[56]=ve>>>0&255,o[57]=ve>>>8&255,o[58]=ve>>>16&255,o[59]=ve>>>24&255,o[60]=ye>>>0&255,o[61]=ye>>>8&255,o[62]=ye>>>16&255,o[63]=ye>>>24&255}f(J,"core_salsa20");function M(o,i,s,e){for(var c=e[0]&255|(e[1]&255)<<8|(e[2]&255)<<16|(e[3]&255)<<24,m=s[0]&255|(s[1]&255)<<8|(s[2]&255)<<16|(s[3]&255)<<24,b=s[4]&255|(s[5]&255)<<8|(s[6]&255)<<16|(s[7]&255)<<24,T=s[8]&255|(s[9]&255)<<8|(s[10]&255)<<16|(s[11]&255)<<24,O=s[12]&255|(s[13]&255)<<8|(s[14]&255)<<16|(s[15]&255)<<24,oe=e[4]&255|(e[5]&255)<<8|(e[6]&255)<<16|(e[7]&255)<<24,G=i[0]&255|(i[1]&255)<<8|(i[2]&255)<<16|(i[3]&255)<<24,ke=i[4]&255|(i[5]&255)<<8|(i[6]&255)<<16|(i[7]&255)<<24,q=i[8]&255|(i[9]&255)<<8|(i[10]&255)<<16|(i[11]&255)<<24,de=i[12]&255|(i[13]&255)<<8|(i[14]&255)<<16|(i[15]&255)<<24,ue=e[8]&255|(e[9]&255)<<8|(e[10]&255)<<16|(e[11]&255)<<24,be=s[16]&255|(s[17]&255)<<8|(s[18]&255)<<16|(s[19]&255)<<24,xe=s[20]&255|(s[21]&255)<<8|(s[22]&255)<<16|(s[23]&255)<<24,pe=s[24]&255|(s[25]&255)<<8|(s[26]&255)<<16|(s[27]&255)<<24,me=s[28]&255|(s[29]&255)<<8|(s[30]&255)<<16|(s[31]&255)<<24,he=e[12]&255|(e[13]&255)<<8|(e[14]&255)<<16|(e[15]&255)<<24,ee=c,ae=m,Q=b,te=T,re=O,j=oe,S=G,C=ke,N=q,I=de,$=ue,U=be,ce=xe,ge=pe,ve=me,ye=he,d,Ce=0;Ce<20;Ce+=2)d=ee+ce|0,re^=d<<7|d>>>32-7,d=re+ee|0,N^=d<<9|d>>>32-9,d=N+re|0,ce^=d<<13|d>>>32-13,d=ce+N|0,ee^=d<<18|d>>>32-18,d=j+ae|0,I^=d<<7|d>>>32-7,d=I+j|0,ge^=d<<9|d>>>32-9,d=ge+I|0,ae^=d<<13|d>>>32-13,d=ae+ge|0,j^=d<<18|d>>>32-18,d=$+S|0,ve^=d<<7|d>>>32-7,d=ve+$|0,Q^=d<<9|d>>>32-9,d=Q+ve|0,S^=d<<13|d>>>32-13,d=S+Q|0,$^=d<<18|d>>>32-18,d=ye+U|0,te^=d<<7|d>>>32-7,d=te+ye|0,C^=d<<9|d>>>32-9,d=C+te|0,U^=d<<13|d>>>32-13,d=U+C|0,ye^=d<<18|d>>>32-18,d=ee+te|0,ae^=d<<7|d>>>32-7,d=ae+ee|0,Q^=d<<9|d>>>32-9,d=Q+ae|0,te^=d<<13|d>>>32-13,d=te+Q|0,ee^=d<<18|d>>>32-18,d=j+re|0,S^=d<<7|d>>>32-7,d=S+j|0,C^=d<<9|d>>>32-9,d=C+S|0,re^=d<<13|d>>>32-13,d=re+C|0,j^=d<<18|d>>>32-18,d=$+I|0,U^=d<<7|d>>>32-7,d=U+$|0,N^=d<<9|d>>>32-9,d=N+U|0,I^=d<<13|d>>>32-13,d=I+N|0,$^=d<<18|d>>>32-18,d=ye+ve|0,ce^=d<<7|d>>>32-7,d=ce+ye|0,ge^=d<<9|d>>>32-9,d=ge+ce|0,ve^=d<<13|d>>>32-13,d=ve+ge|0,ye^=d<<18|d>>>32-18;o[0]=ee>>>0&255,o[1]=ee>>>8&255,o[2]=ee>>>16&255,o[3]=ee>>>24&255,o[4]=j>>>0&255,o[5]=j>>>8&255,o[6]=j>>>16&255,o[7]=j>>>24&255,o[8]=$>>>0&255,o[9]=$>>>8&255,o[10]=$>>>16&255,o[11]=$>>>24&255,o[12]=ye>>>0&255,o[13]=ye>>>8&255,o[14]=ye>>>16&255,o[15]=ye>>>24&255,o[16]=S>>>0&255,o[17]=S>>>8&255,o[18]=S>>>16&255,o[19]=S>>>24&255,o[20]=C>>>0&255,o[21]=C>>>8&255,o[22]=C>>>16&255,o[23]=C>>>24&255,o[24]=N>>>0&255,o[25]=N>>>8&255,o[26]=N>>>16&255,o[27]=N>>>24&255,o[28]=I>>>0&255,o[29]=I>>>8&255,o[30]=I>>>16&255,o[31]=I>>>24&255}f(M,"core_hsalsa20");function H(o,i,s,e){J(o,i,s,e)}f(H,"crypto_core_salsa20");function X(o,i,s,e){M(o,i,s,e)}f(X,"crypto_core_hsalsa20");var W=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function x(o,i,s,e,c,m,b){var T=new Uint8Array(16),O=new Uint8Array(64),oe,G;for(G=0;G<16;G++)T[G]=0;for(G=0;G<8;G++)T[G]=m[G];for(;c>=64;){for(H(O,T,b,W),G=0;G<64;G++)o[i+G]=s[e+G]^O[G];for(oe=1,G=8;G<16;G++)oe=oe+(T[G]&255)|0,T[G]=oe&255,oe>>>=8;c-=64,i+=64,e+=64}if(c>0)for(H(O,T,b,W),G=0;G<c;G++)o[i+G]=s[e+G]^O[G];return 0}f(x,"crypto_stream_salsa20_xor");function A(o,i,s,e,c){var m=new Uint8Array(16),b=new Uint8Array(64),T,O;for(O=0;O<16;O++)m[O]=0;for(O=0;O<8;O++)m[O]=e[O];for(;s>=64;){for(H(b,m,c,W),O=0;O<64;O++)o[i+O]=b[O];for(T=1,O=8;O<16;O++)T=T+(m[O]&255)|0,m[O]=T&255,T>>>=8;s-=64,i+=64}if(s>0)for(H(b,m,c,W),O=0;O<s;O++)o[i+O]=b[O];return 0}f(A,"crypto_stream_salsa20");function D(o,i,s,e,c){var m=new Uint8Array(32);X(m,e,c,W);for(var b=new Uint8Array(8),T=0;T<8;T++)b[T]=e[T+16];return A(o,i,s,b,m)}f(D,"crypto_stream");function E(o,i,s,e,c,m,b){var T=new Uint8Array(32);X(T,m,b,W);for(var O=new Uint8Array(8),oe=0;oe<8;oe++)O[oe]=m[oe+16];return x(o,i,s,e,c,O,T)}f(E,"crypto_stream_xor");var L=f((function(o){this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.leftover=0,this.fin=0;var i,s,e,c,m,b,T,O;i=o[0]&255|(o[1]&255)<<8,this.r[0]=i&8191,s=o[2]&255|(o[3]&255)<<8,this.r[1]=(i>>>13|s<<3)&8191,e=o[4]&255|(o[5]&255)<<8,this.r[2]=(s>>>10|e<<6)&7939,c=o[6]&255|(o[7]&255)<<8,this.r[3]=(e>>>7|c<<9)&8191,m=o[8]&255|(o[9]&255)<<8,this.r[4]=(c>>>4|m<<12)&255,this.r[5]=m>>>1&8190,b=o[10]&255|(o[11]&255)<<8,this.r[6]=(m>>>14|b<<2)&8191,T=o[12]&255|(o[13]&255)<<8,this.r[7]=(b>>>11|T<<5)&8065,O=o[14]&255|(o[15]&255)<<8,this.r[8]=(T>>>8|O<<8)&8191,this.r[9]=O>>>5&127,this.pad[0]=o[16]&255|(o[17]&255)<<8,this.pad[1]=o[18]&255|(o[19]&255)<<8,this.pad[2]=o[20]&255|(o[21]&255)<<8,this.pad[3]=o[22]&255|(o[23]&255)<<8,this.pad[4]=o[24]&255|(o[25]&255)<<8,this.pad[5]=o[26]&255|(o[27]&255)<<8,this.pad[6]=o[28]&255|(o[29]&255)<<8,this.pad[7]=o[30]&255|(o[31]&255)<<8}),"poly1305");L.prototype.blocks=function(o,i,s){for(var e=this.fin?0:2048,c,m,b,T,O,oe,G,ke,q,de,ue,be,xe,pe,me,he,ee,ae,Q,te=this.h[0],re=this.h[1],j=this.h[2],S=this.h[3],C=this.h[4],N=this.h[5],I=this.h[6],$=this.h[7],U=this.h[8],ce=this.h[9],ge=this.r[0],ve=this.r[1],ye=this.r[2],d=this.r[3],Ce=this.r[4],Re=this.r[5],_e=this.r[6],Se=this.r[7],Ee=this.r[8],Ae=this.r[9];s>=16;)c=o[i+0]&255|(o[i+1]&255)<<8,te+=c&8191,m=o[i+2]&255|(o[i+3]&255)<<8,re+=(c>>>13|m<<3)&8191,b=o[i+4]&255|(o[i+5]&255)<<8,j+=(m>>>10|b<<6)&8191,T=o[i+6]&255|(o[i+7]&255)<<8,S+=(b>>>7|T<<9)&8191,O=o[i+8]&255|(o[i+9]&255)<<8,C+=(T>>>4|O<<12)&8191,N+=O>>>1&8191,oe=o[i+10]&255|(o[i+11]&255)<<8,I+=(O>>>14|oe<<2)&8191,G=o[i+12]&255|(o[i+13]&255)<<8,$+=(oe>>>11|G<<5)&8191,ke=o[i+14]&255|(o[i+15]&255)<<8,U+=(G>>>8|ke<<8)&8191,ce+=ke>>>5|e,q=0,de=q,de+=te*ge,de+=re*(5*Ae),de+=j*(5*Ee),de+=S*(5*Se),de+=C*(5*_e),q=de>>>13,de&=8191,de+=N*(5*Re),de+=I*(5*Ce),de+=$*(5*d),de+=U*(5*ye),de+=ce*(5*ve),q+=de>>>13,de&=8191,ue=q,ue+=te*ve,ue+=re*ge,ue+=j*(5*Ae),ue+=S*(5*Ee),ue+=C*(5*Se),q=ue>>>13,ue&=8191,ue+=N*(5*_e),ue+=I*(5*Re),ue+=$*(5*Ce),ue+=U*(5*d),ue+=ce*(5*ye),q+=ue>>>13,ue&=8191,be=q,be+=te*ye,be+=re*ve,be+=j*ge,be+=S*(5*Ae),be+=C*(5*Ee),q=be>>>13,be&=8191,be+=N*(5*Se),be+=I*(5*_e),be+=$*(5*Re),be+=U*(5*Ce),be+=ce*(5*d),q+=be>>>13,be&=8191,xe=q,xe+=te*d,xe+=re*ye,xe+=j*ve,xe+=S*ge,xe+=C*(5*Ae),q=xe>>>13,xe&=8191,xe+=N*(5*Ee),xe+=I*(5*Se),xe+=$*(5*_e),xe+=U*(5*Re),xe+=ce*(5*Ce),q+=xe>>>13,xe&=8191,pe=q,pe+=te*Ce,pe+=re*d,pe+=j*ye,pe+=S*ve,pe+=C*ge,q=pe>>>13,pe&=8191,pe+=N*(5*Ae),pe+=I*(5*Ee),pe+=$*(5*Se),pe+=U*(5*_e),pe+=ce*(5*Re),q+=pe>>>13,pe&=8191,me=q,me+=te*Re,me+=re*Ce,me+=j*d,me+=S*ye,me+=C*ve,q=me>>>13,me&=8191,me+=N*ge,me+=I*(5*Ae),me+=$*(5*Ee),me+=U*(5*Se),me+=ce*(5*_e),q+=me>>>13,me&=8191,he=q,he+=te*_e,he+=re*Re,he+=j*Ce,he+=S*d,he+=C*ye,q=he>>>13,he&=8191,he+=N*ve,he+=I*ge,he+=$*(5*Ae),he+=U*(5*Ee),he+=ce*(5*Se),q+=he>>>13,he&=8191,ee=q,ee+=te*Se,ee+=re*_e,ee+=j*Re,ee+=S*Ce,ee+=C*d,q=ee>>>13,ee&=8191,ee+=N*ye,ee+=I*ve,ee+=$*ge,ee+=U*(5*Ae),ee+=ce*(5*Ee),q+=ee>>>13,ee&=8191,ae=q,ae+=te*Ee,ae+=re*Se,ae+=j*_e,ae+=S*Re,ae+=C*Ce,q=ae>>>13,ae&=8191,ae+=N*d,ae+=I*ye,ae+=$*ve,ae+=U*ge,ae+=ce*(5*Ae),q+=ae>>>13,ae&=8191,Q=q,Q+=te*Ae,Q+=re*Ee,Q+=j*Se,Q+=S*_e,Q+=C*Re,q=Q>>>13,Q&=8191,Q+=N*Ce,Q+=I*d,Q+=$*ye,Q+=U*ve,Q+=ce*ge,q+=Q>>>13,Q&=8191,q=(q<<2)+q|0,q=q+de|0,de=q&8191,q=q>>>13,ue+=q,te=de,re=ue,j=be,S=xe,C=pe,N=me,I=he,$=ee,U=ae,ce=Q,i+=16,s-=16;this.h[0]=te,this.h[1]=re,this.h[2]=j,this.h[3]=S,this.h[4]=C,this.h[5]=N,this.h[6]=I,this.h[7]=$,this.h[8]=U,this.h[9]=ce},L.prototype.finish=function(o,i){var s=new Uint16Array(10),e,c,m,b;if(this.leftover){for(b=this.leftover,this.buffer[b++]=1;b<16;b++)this.buffer[b]=0;this.fin=1,this.blocks(this.buffer,0,16)}for(e=this.h[1]>>>13,this.h[1]&=8191,b=2;b<10;b++)this.h[b]+=e,e=this.h[b]>>>13,this.h[b]&=8191;for(this.h[0]+=e*5,e=this.h[0]>>>13,this.h[0]&=8191,this.h[1]+=e,e=this.h[1]>>>13,this.h[1]&=8191,this.h[2]+=e,s[0]=this.h[0]+5,e=s[0]>>>13,s[0]&=8191,b=1;b<10;b++)s[b]=this.h[b]+e,e=s[b]>>>13,s[b]&=8191;for(s[9]-=8192,c=(e^1)-1,b=0;b<10;b++)s[b]&=c;for(c=~c,b=0;b<10;b++)this.h[b]=this.h[b]&c|s[b];for(this.h[0]=(this.h[0]|this.h[1]<<13)&65535,this.h[1]=(this.h[1]>>>3|this.h[2]<<10)&65535,this.h[2]=(this.h[2]>>>6|this.h[3]<<7)&65535,this.h[3]=(this.h[3]>>>9|this.h[4]<<4)&65535,this.h[4]=(this.h[4]>>>12|this.h[5]<<1|this.h[6]<<14)&65535,this.h[5]=(this.h[6]>>>2|this.h[7]<<11)&65535,this.h[6]=(this.h[7]>>>5|this.h[8]<<8)&65535,this.h[7]=(this.h[8]>>>8|this.h[9]<<5)&65535,m=this.h[0]+this.pad[0],this.h[0]=m&65535,b=1;b<8;b++)m=(this.h[b]+this.pad[b]|0)+(m>>>16)|0,this.h[b]=m&65535;o[i+0]=this.h[0]>>>0&255,o[i+1]=this.h[0]>>>8&255,o[i+2]=this.h[1]>>>0&255,o[i+3]=this.h[1]>>>8&255,o[i+4]=this.h[2]>>>0&255,o[i+5]=this.h[2]>>>8&255,o[i+6]=this.h[3]>>>0&255,o[i+7]=this.h[3]>>>8&255,o[i+8]=this.h[4]>>>0&255,o[i+9]=this.h[4]>>>8&255,o[i+10]=this.h[5]>>>0&255,o[i+11]=this.h[5]>>>8&255,o[i+12]=this.h[6]>>>0&255,o[i+13]=this.h[6]>>>8&255,o[i+14]=this.h[7]>>>0&255,o[i+15]=this.h[7]>>>8&255},L.prototype.update=function(o,i,s){var e,c;if(this.leftover){for(c=16-this.leftover,c>s&&(c=s),e=0;e<c;e++)this.buffer[this.leftover+e]=o[i+e];if(s-=c,i+=c,this.leftover+=c,this.leftover<16)return;this.blocks(this.buffer,0,16),this.leftover=0}if(s>=16&&(c=s-s%16,this.blocks(o,i,c),i+=c,s-=c),s){for(e=0;e<s;e++)this.buffer[this.leftover+e]=o[i+e];this.leftover+=s}};function R(o,i,s,e,c,m){var b=new L(m);return b.update(s,e,c),b.finish(o,i),0}f(R,"crypto_onetimeauth");function z(o,i,s,e,c,m){var b=new Uint8Array(16);return R(b,0,s,e,c,m),K(o,i,b,0)}f(z,"crypto_onetimeauth_verify");function P(o,i,s,e,c){var m;if(s<32)return-1;for(E(o,0,i,0,s,e,c),R(o,16,o,32,s-32,o),m=0;m<16;m++)o[m]=0;return 0}f(P,"crypto_secretbox");function F(o,i,s,e,c){var m,b=new Uint8Array(32);if(s<32||(D(b,0,32,e,c),z(i,16,i,32,s-32,b)!==0))return-1;for(E(o,0,i,0,s,e,c),m=0;m<32;m++)o[m]=0;return 0}f(F,"crypto_secretbox_open");function Y(o,i){var s;for(s=0;s<16;s++)o[s]=i[s]|0}f(Y,"set25519");function ne(o){var i,s,e=1;for(i=0;i<16;i++)s=o[i]+e+65535,e=Math.floor(s/65536),o[i]=s-e*65536;o[0]+=e-1+37*(e-1)}f(ne,"car25519");function ie(o,i,s){for(var e,c=~(s-1),m=0;m<16;m++)e=c&(o[m]^i[m]),o[m]^=e,i[m]^=e}f(ie,"sel25519");function Ie(o,i){var s,e,c,m=r(),b=r();for(s=0;s<16;s++)b[s]=i[s];for(ne(b),ne(b),ne(b),e=0;e<2;e++){for(m[0]=b[0]-65517,s=1;s<15;s++)m[s]=b[s]-65535-(m[s-1]>>16&1),m[s-1]&=65535;m[15]=b[15]-32767-(m[14]>>16&1),c=m[15]>>16&1,m[14]&=65535,ie(b,m,1-c)}for(s=0;s<16;s++)o[2*s]=b[s]&255,o[2*s+1]=b[s]>>8}f(Ie,"pack25519");function Z(o,i){var s=new Uint8Array(32),e=new Uint8Array(32);return Ie(s,o),Ie(e,i),V(s,0,e,0)}f(Z,"neq25519");function fe(o){var i=new Uint8Array(32);return Ie(i,o),i[0]&1}f(fe,"par25519");function we(o,i){var s;for(s=0;s<16;s++)o[s]=i[2*s]+(i[2*s+1]<<8);o[15]&=32767}f(we,"unpack25519");function le(o,i,s){for(var e=0;e<16;e++)o[e]=i[e]+s[e]}f(le,"A");function Pe(o,i,s){for(var e=0;e<16;e++)o[e]=i[e]-s[e]}f(Pe,"Z");function se(o,i,s){var e,c,m=0,b=0,T=0,O=0,oe=0,G=0,ke=0,q=0,de=0,ue=0,be=0,xe=0,pe=0,me=0,he=0,ee=0,ae=0,Q=0,te=0,re=0,j=0,S=0,C=0,N=0,I=0,$=0,U=0,ce=0,ge=0,ve=0,ye=0,d=s[0],Ce=s[1],Re=s[2],_e=s[3],Se=s[4],Ee=s[5],Ae=s[6],Oe=s[7],Te=s[8],Be=s[9],Ue=s[10],Le=s[11],We=s[12],ze=s[13],je=s[14],Ge=s[15];e=i[0],m+=e*d,b+=e*Ce,T+=e*Re,O+=e*_e,oe+=e*Se,G+=e*Ee,ke+=e*Ae,q+=e*Oe,de+=e*Te,ue+=e*Be,be+=e*Ue,xe+=e*Le,pe+=e*We,me+=e*ze,he+=e*je,ee+=e*Ge,e=i[1],b+=e*d,T+=e*Ce,O+=e*Re,oe+=e*_e,G+=e*Se,ke+=e*Ee,q+=e*Ae,de+=e*Oe,ue+=e*Te,be+=e*Be,xe+=e*Ue,pe+=e*Le,me+=e*We,he+=e*ze,ee+=e*je,ae+=e*Ge,e=i[2],T+=e*d,O+=e*Ce,oe+=e*Re,G+=e*_e,ke+=e*Se,q+=e*Ee,de+=e*Ae,ue+=e*Oe,be+=e*Te,xe+=e*Be,pe+=e*Ue,me+=e*Le,he+=e*We,ee+=e*ze,ae+=e*je,Q+=e*Ge,e=i[3],O+=e*d,oe+=e*Ce,G+=e*Re,ke+=e*_e,q+=e*Se,de+=e*Ee,ue+=e*Ae,be+=e*Oe,xe+=e*Te,pe+=e*Be,me+=e*Ue,he+=e*Le,ee+=e*We,ae+=e*ze,Q+=e*je,te+=e*Ge,e=i[4],oe+=e*d,G+=e*Ce,ke+=e*Re,q+=e*_e,de+=e*Se,ue+=e*Ee,be+=e*Ae,xe+=e*Oe,pe+=e*Te,me+=e*Be,he+=e*Ue,ee+=e*Le,ae+=e*We,Q+=e*ze,te+=e*je,re+=e*Ge,e=i[5],G+=e*d,ke+=e*Ce,q+=e*Re,de+=e*_e,ue+=e*Se,be+=e*Ee,xe+=e*Ae,pe+=e*Oe,me+=e*Te,he+=e*Be,ee+=e*Ue,ae+=e*Le,Q+=e*We,te+=e*ze,re+=e*je,j+=e*Ge,e=i[6],ke+=e*d,q+=e*Ce,de+=e*Re,ue+=e*_e,be+=e*Se,xe+=e*Ee,pe+=e*Ae,me+=e*Oe,he+=e*Te,ee+=e*Be,ae+=e*Ue,Q+=e*Le,te+=e*We,re+=e*ze,j+=e*je,S+=e*Ge,e=i[7],q+=e*d,de+=e*Ce,ue+=e*Re,be+=e*_e,xe+=e*Se,pe+=e*Ee,me+=e*Ae,he+=e*Oe,ee+=e*Te,ae+=e*Be,Q+=e*Ue,te+=e*Le,re+=e*We,j+=e*ze,S+=e*je,C+=e*Ge,e=i[8],de+=e*d,ue+=e*Ce,be+=e*Re,xe+=e*_e,pe+=e*Se,me+=e*Ee,he+=e*Ae,ee+=e*Oe,ae+=e*Te,Q+=e*Be,te+=e*Ue,re+=e*Le,j+=e*We,S+=e*ze,C+=e*je,N+=e*Ge,e=i[9],ue+=e*d,be+=e*Ce,xe+=e*Re,pe+=e*_e,me+=e*Se,he+=e*Ee,ee+=e*Ae,ae+=e*Oe,Q+=e*Te,te+=e*Be,re+=e*Ue,j+=e*Le,S+=e*We,C+=e*ze,N+=e*je,I+=e*Ge,e=i[10],be+=e*d,xe+=e*Ce,pe+=e*Re,me+=e*_e,he+=e*Se,ee+=e*Ee,ae+=e*Ae,Q+=e*Oe,te+=e*Te,re+=e*Be,j+=e*Ue,S+=e*Le,C+=e*We,N+=e*ze,I+=e*je,$+=e*Ge,e=i[11],xe+=e*d,pe+=e*Ce,me+=e*Re,he+=e*_e,ee+=e*Se,ae+=e*Ee,Q+=e*Ae,te+=e*Oe,re+=e*Te,j+=e*Be,S+=e*Ue,C+=e*Le,N+=e*We,I+=e*ze,$+=e*je,U+=e*Ge,e=i[12],pe+=e*d,me+=e*Ce,he+=e*Re,ee+=e*_e,ae+=e*Se,Q+=e*Ee,te+=e*Ae,re+=e*Oe,j+=e*Te,S+=e*Be,C+=e*Ue,N+=e*Le,I+=e*We,$+=e*ze,U+=e*je,ce+=e*Ge,e=i[13],me+=e*d,he+=e*Ce,ee+=e*Re,ae+=e*_e,Q+=e*Se,te+=e*Ee,re+=e*Ae,j+=e*Oe,S+=e*Te,C+=e*Be,N+=e*Ue,I+=e*Le,$+=e*We,U+=e*ze,ce+=e*je,ge+=e*Ge,e=i[14],he+=e*d,ee+=e*Ce,ae+=e*Re,Q+=e*_e,te+=e*Se,re+=e*Ee,j+=e*Ae,S+=e*Oe,C+=e*Te,N+=e*Be,I+=e*Ue,$+=e*Le,U+=e*We,ce+=e*ze,ge+=e*je,ve+=e*Ge,e=i[15],ee+=e*d,ae+=e*Ce,Q+=e*Re,te+=e*_e,re+=e*Se,j+=e*Ee,S+=e*Ae,C+=e*Oe,N+=e*Te,I+=e*Be,$+=e*Ue,U+=e*Le,ce+=e*We,ge+=e*ze,ve+=e*je,ye+=e*Ge,m+=38*ae,b+=38*Q,T+=38*te,O+=38*re,oe+=38*j,G+=38*S,ke+=38*C,q+=38*N,de+=38*I,ue+=38*$,be+=38*U,xe+=38*ce,pe+=38*ge,me+=38*ve,he+=38*ye,c=1,e=m+c+65535,c=Math.floor(e/65536),m=e-c*65536,e=b+c+65535,c=Math.floor(e/65536),b=e-c*65536,e=T+c+65535,c=Math.floor(e/65536),T=e-c*65536,e=O+c+65535,c=Math.floor(e/65536),O=e-c*65536,e=oe+c+65535,c=Math.floor(e/65536),oe=e-c*65536,e=G+c+65535,c=Math.floor(e/65536),G=e-c*65536,e=ke+c+65535,c=Math.floor(e/65536),ke=e-c*65536,e=q+c+65535,c=Math.floor(e/65536),q=e-c*65536,e=de+c+65535,c=Math.floor(e/65536),de=e-c*65536,e=ue+c+65535,c=Math.floor(e/65536),ue=e-c*65536,e=be+c+65535,c=Math.floor(e/65536),be=e-c*65536,e=xe+c+65535,c=Math.floor(e/65536),xe=e-c*65536,e=pe+c+65535,c=Math.floor(e/65536),pe=e-c*65536,e=me+c+65535,c=Math.floor(e/65536),me=e-c*65536,e=he+c+65535,c=Math.floor(e/65536),he=e-c*65536,e=ee+c+65535,c=Math.floor(e/65536),ee=e-c*65536,m+=c-1+37*(c-1),c=1,e=m+c+65535,c=Math.floor(e/65536),m=e-c*65536,e=b+c+65535,c=Math.floor(e/65536),b=e-c*65536,e=T+c+65535,c=Math.floor(e/65536),T=e-c*65536,e=O+c+65535,c=Math.floor(e/65536),O=e-c*65536,e=oe+c+65535,c=Math.floor(e/65536),oe=e-c*65536,e=G+c+65535,c=Math.floor(e/65536),G=e-c*65536,e=ke+c+65535,c=Math.floor(e/65536),ke=e-c*65536,e=q+c+65535,c=Math.floor(e/65536),q=e-c*65536,e=de+c+65535,c=Math.floor(e/65536),de=e-c*65536,e=ue+c+65535,c=Math.floor(e/65536),ue=e-c*65536,e=be+c+65535,c=Math.floor(e/65536),be=e-c*65536,e=xe+c+65535,c=Math.floor(e/65536),xe=e-c*65536,e=pe+c+65535,c=Math.floor(e/65536),pe=e-c*65536,e=me+c+65535,c=Math.floor(e/65536),me=e-c*65536,e=he+c+65535,c=Math.floor(e/65536),he=e-c*65536,e=ee+c+65535,c=Math.floor(e/65536),ee=e-c*65536,m+=c-1+37*(c-1),o[0]=m,o[1]=b,o[2]=T,o[3]=O,o[4]=oe,o[5]=G,o[6]=ke,o[7]=q,o[8]=de,o[9]=ue,o[10]=be,o[11]=xe,o[12]=pe,o[13]=me,o[14]=he,o[15]=ee}f(se,"M");function Me(o,i){se(o,i,i)}f(Me,"S");function vt(o,i){var s=r(),e;for(e=0;e<16;e++)s[e]=i[e];for(e=253;e>=0;e--)Me(s,s),e!==2&&e!==4&&se(s,s,i);for(e=0;e<16;e++)o[e]=s[e]}f(vt,"inv25519");function _t(o,i){var s=r(),e;for(e=0;e<16;e++)s[e]=i[e];for(e=250;e>=0;e--)Me(s,s),e!==1&&se(s,s,i);for(e=0;e<16;e++)o[e]=s[e]}f(_t,"pow2523");function st(o,i,s){var e=new Uint8Array(32),c=new Float64Array(80),m,b,T=r(),O=r(),oe=r(),G=r(),ke=r(),q=r();for(b=0;b<31;b++)e[b]=i[b];for(e[31]=i[31]&127|64,e[0]&=248,we(c,s),b=0;b<16;b++)O[b]=c[b],G[b]=T[b]=oe[b]=0;for(T[0]=G[0]=1,b=254;b>=0;--b)m=e[b>>>3]>>>(b&7)&1,ie(T,O,m),ie(oe,G,m),le(ke,T,oe),Pe(T,T,oe),le(oe,O,G),Pe(O,O,G),Me(G,ke),Me(q,T),se(T,oe,T),se(oe,O,ke),le(ke,T,oe),Pe(T,T,oe),Me(O,T),Pe(oe,G,q),se(T,oe,v),le(T,T,G),se(oe,oe,T),se(T,G,q),se(G,O,c),Me(O,ke),ie(T,O,m),ie(oe,G,m);for(b=0;b<16;b++)c[b+16]=T[b],c[b+32]=oe[b],c[b+48]=O[b],c[b+64]=G[b];var de=c.subarray(32),ue=c.subarray(16);return vt(de,de),se(ue,ue,de),Ie(o,ue),0}f(st,"crypto_scalarmult");function it(o,i){return st(o,i,l)}f(it,"crypto_scalarmult_base");function It(o,i){return a(i,32),it(o,i)}f(It,"crypto_box_keypair");function St(o,i,s){var e=new Uint8Array(32);return st(e,s,i),X(o,n,e,W)}f(St,"crypto_box_beforenm");var Ke=P,Xe=F;function Je(o,i,s,e,c,m){var b=new Uint8Array(32);return St(b,c,m),Ke(o,i,s,e,b)}f(Je,"crypto_box");function Tr(o,i,s,e,c,m){var b=new Uint8Array(32);return St(b,c,m),Xe(o,i,s,e,b)}f(Tr,"crypto_box_open");var Ne=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function Fe(o,i,s,e){for(var c=new Int32Array(16),m=new Int32Array(16),b,T,O,oe,G,ke,q,de,ue,be,xe,pe,me,he,ee,ae,Q,te,re,j,S,C,N,I,$,U,ce=o[0],ge=o[1],ve=o[2],ye=o[3],d=o[4],Ce=o[5],Re=o[6],_e=o[7],Se=i[0],Ee=i[1],Ae=i[2],Oe=i[3],Te=i[4],Be=i[5],Ue=i[6],Le=i[7],We=0;e>=128;){for(re=0;re<16;re++)j=8*re+We,c[re]=s[j+0]<<24|s[j+1]<<16|s[j+2]<<8|s[j+3],m[re]=s[j+4]<<24|s[j+5]<<16|s[j+6]<<8|s[j+7];for(re=0;re<80;re++)if(b=ce,T=ge,O=ve,oe=ye,G=d,ke=Ce,q=Re,de=_e,ue=Se,be=Ee,xe=Ae,pe=Oe,me=Te,he=Be,ee=Ue,ae=Le,S=_e,C=Le,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=(d>>>14|Te<<32-14)^(d>>>18|Te<<32-18)^(Te>>>41-32|d<<32-(41-32)),C=(Te>>>14|d<<32-14)^(Te>>>18|d<<32-18)^(d>>>41-32|Te<<32-(41-32)),N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,S=d&Ce^~d&Re,C=Te&Be^~Te&Ue,N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,S=Ne[re*2],C=Ne[re*2+1],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,S=c[re%16],C=m[re%16],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,Q=$&65535|U<<16,te=N&65535|I<<16,S=Q,C=te,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=(ce>>>28|Se<<32-28)^(Se>>>34-32|ce<<32-(34-32))^(Se>>>39-32|ce<<32-(39-32)),C=(Se>>>28|ce<<32-28)^(ce>>>34-32|Se<<32-(34-32))^(ce>>>39-32|Se<<32-(39-32)),N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,S=ce&ge^ce&ve^ge&ve,C=Se&Ee^Se&Ae^Ee&Ae,N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,de=$&65535|U<<16,ae=N&65535|I<<16,S=oe,C=pe,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=Q,C=te,N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,oe=$&65535|U<<16,pe=N&65535|I<<16,ge=b,ve=T,ye=O,d=oe,Ce=G,Re=ke,_e=q,ce=de,Ee=ue,Ae=be,Oe=xe,Te=pe,Be=me,Ue=he,Le=ee,Se=ae,re%16===15)for(j=0;j<16;j++)S=c[j],C=m[j],N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=c[(j+9)%16],C=m[(j+9)%16],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,Q=c[(j+1)%16],te=m[(j+1)%16],S=(Q>>>1|te<<32-1)^(Q>>>8|te<<32-8)^Q>>>7,C=(te>>>1|Q<<32-1)^(te>>>8|Q<<32-8)^(te>>>7|Q<<32-7),N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,Q=c[(j+14)%16],te=m[(j+14)%16],S=(Q>>>19|te<<32-19)^(te>>>61-32|Q<<32-(61-32))^Q>>>6,C=(te>>>19|Q<<32-19)^(Q>>>61-32|te<<32-(61-32))^(te>>>6|Q<<32-6),N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,c[j]=$&65535|U<<16,m[j]=N&65535|I<<16;S=ce,C=Se,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[0],C=i[0],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[0]=ce=$&65535|U<<16,i[0]=Se=N&65535|I<<16,S=ge,C=Ee,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[1],C=i[1],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[1]=ge=$&65535|U<<16,i[1]=Ee=N&65535|I<<16,S=ve,C=Ae,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[2],C=i[2],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[2]=ve=$&65535|U<<16,i[2]=Ae=N&65535|I<<16,S=ye,C=Oe,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[3],C=i[3],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[3]=ye=$&65535|U<<16,i[3]=Oe=N&65535|I<<16,S=d,C=Te,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[4],C=i[4],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[4]=d=$&65535|U<<16,i[4]=Te=N&65535|I<<16,S=Ce,C=Be,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[5],C=i[5],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[5]=Ce=$&65535|U<<16,i[5]=Be=N&65535|I<<16,S=Re,C=Ue,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[6],C=i[6],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[6]=Re=$&65535|U<<16,i[6]=Ue=N&65535|I<<16,S=_e,C=Le,N=C&65535,I=C>>>16,$=S&65535,U=S>>>16,S=o[7],C=i[7],N+=C&65535,I+=C>>>16,$+=S&65535,U+=S>>>16,I+=N>>>16,$+=I>>>16,U+=$>>>16,o[7]=_e=$&65535|U<<16,i[7]=Le=N&65535|I<<16,We+=128,e-=128}return e}f(Fe,"crypto_hashblocks_hl");function et(o,i,s){var e=new Int32Array(8),c=new Int32Array(8),m=new Uint8Array(256),b,T=s;for(e[0]=1779033703,e[1]=3144134277,e[2]=1013904242,e[3]=2773480762,e[4]=1359893119,e[5]=2600822924,e[6]=528734635,e[7]=1541459225,c[0]=4089235720,c[1]=2227873595,c[2]=4271175723,c[3]=1595750129,c[4]=2917565137,c[5]=725511199,c[6]=4215389547,c[7]=327033209,Fe(e,c,i,s),s%=128,b=0;b<s;b++)m[b]=i[T-s+b];for(m[s]=128,s=256-128*(s<112?1:0),m[s-9]=0,k(m,s-8,T/536870912|0,T<<3),Fe(e,c,m,s),b=0;b<8;b++)k(o,8*b,e[b],c[b]);return 0}f(et,"crypto_hash");function ot(o,i){var s=r(),e=r(),c=r(),m=r(),b=r(),T=r(),O=r(),oe=r(),G=r();Pe(s,o[1],o[0]),Pe(G,i[1],i[0]),se(s,s,G),le(e,o[0],o[1]),le(G,i[0],i[1]),se(e,e,G),se(c,o[3],i[3]),se(c,c,g),se(m,o[2],i[2]),le(m,m,m),Pe(b,e,s),Pe(T,m,c),le(O,m,c),le(oe,e,s),se(o[0],b,T),se(o[1],oe,O),se(o[2],O,T),se(o[3],b,oe)}f(ot,"add");function Ht(o,i,s){var e;for(e=0;e<4;e++)ie(o[e],i[e],s)}f(Ht,"cswap");function Kt(o,i){var s=r(),e=r(),c=r();vt(c,i[2]),se(s,i[0],c),se(e,i[1],c),Ie(o,e),o[31]^=fe(s)<<7}f(Kt,"pack");function rr(o,i,s){var e,c;for(Y(o[0],p),Y(o[1],u),Y(o[2],u),Y(o[3],p),c=255;c>=0;--c)e=s[c/8|0]>>(c&7)&1,Ht(o,i,e),ot(i,o),ot(o,o),Ht(o,i,e)}f(rr,"scalarmult");function or(o,i){var s=[r(),r(),r(),r()];Y(s[0],w),Y(s[1],y),Y(s[2],u),se(s[3],w,y),rr(o,s,i)}f(or,"scalarbase");function $r(o,i,s){var e=new Uint8Array(64),c=[r(),r(),r(),r()],m;for(s||a(i,32),et(e,i,32),e[0]&=248,e[31]&=127,e[31]|=64,or(c,e),Kt(o,c),m=0;m<32;m++)i[m+32]=o[m];return 0}f($r,"crypto_sign_keypair");var ar=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function Dr(o,i){var s,e,c,m;for(e=63;e>=32;--e){for(s=0,c=e-32,m=e-12;c<m;++c)i[c]+=s-16*i[e]*ar[c-(e-32)],s=Math.floor((i[c]+128)/256),i[c]-=s*256;i[c]+=s,i[e]=0}for(s=0,c=0;c<32;c++)i[c]+=s-(i[31]>>4)*ar[c],s=i[c]>>8,i[c]&=255;for(c=0;c<32;c++)i[c]-=s*ar[c];for(e=0;e<32;e++)i[e+1]+=i[e]>>8,o[e]=i[e]&255}f(Dr,"modL");function Nr(o){var i=new Float64Array(64),s;for(s=0;s<64;s++)i[s]=o[s];for(s=0;s<64;s++)o[s]=0;Dr(o,i)}f(Nr,"reduce");function no(o,i,s,e){var c=new Uint8Array(64),m=new Uint8Array(64),b=new Uint8Array(64),T,O,oe=new Float64Array(64),G=[r(),r(),r(),r()];et(c,e,32),c[0]&=248,c[31]&=127,c[31]|=64;var ke=s+64;for(T=0;T<s;T++)o[64+T]=i[T];for(T=0;T<32;T++)o[32+T]=c[32+T];for(et(b,o.subarray(32),s+32),Nr(b),or(G,b),Kt(o,G),T=32;T<64;T++)o[T]=e[T];for(et(m,o,s+64),Nr(m),T=0;T<64;T++)oe[T]=0;for(T=0;T<32;T++)oe[T]=b[T];for(T=0;T<32;T++)for(O=0;O<32;O++)oe[T+O]+=m[T]*c[O];return Dr(o.subarray(32),oe),ke}f(no,"crypto_sign");function da(o,i){var s=r(),e=r(),c=r(),m=r(),b=r(),T=r(),O=r();return Y(o[2],u),we(o[1],i),Me(c,o[1]),se(m,c,h),Pe(c,c,o[2]),le(m,o[2],m),Me(b,m),Me(T,b),se(O,T,b),se(s,O,c),se(s,s,m),_t(s,s),se(s,s,c),se(s,s,m),se(s,s,m),se(o[0],s,m),Me(e,o[0]),se(e,e,m),Z(e,c)&&se(o[0],o[0],_),Me(e,o[0]),se(e,e,m),Z(e,c)?-1:(fe(o[0])===i[31]>>7&&Pe(o[0],p,o[0]),se(o[3],o[0],o[1]),0)}f(da,"unpackneg");function Fr(o,i,s,e){var c,m=new Uint8Array(32),b=new Uint8Array(64),T=[r(),r(),r(),r()],O=[r(),r(),r(),r()];if(s<64||da(O,e))return-1;for(c=0;c<s;c++)o[c]=i[c];for(c=0;c<32;c++)o[c+32]=e[c];if(et(b,o,s),Nr(b),rr(T,O,b),or(O,i.subarray(32)),ot(T,O),Kt(m,T),s-=64,V(i,0,m,0)){for(c=0;c<s;c++)o[c]=0;return-1}for(c=0;c<s;c++)o[c]=i[c+64];return s}f(Fr,"crypto_sign_open");var Mr=32,nr=24,Vt=32,Tt=16,Jt=32,sr=32,zt=32,jt=32,Br=32,so=nr,ua=Vt,pa=Tt,ut=64,Ct=32,$t=64,Ur=32,Lr=64;t.lowlevel={crypto_core_hsalsa20:X,crypto_stream_xor:E,crypto_stream:D,crypto_stream_salsa20_xor:x,crypto_stream_salsa20:A,crypto_onetimeauth:R,crypto_onetimeauth_verify:z,crypto_verify_16:K,crypto_verify_32:V,crypto_secretbox:P,crypto_secretbox_open:F,crypto_scalarmult:st,crypto_scalarmult_base:it,crypto_box_beforenm:St,crypto_box_afternm:Ke,crypto_box:Je,crypto_box_open:Tr,crypto_box_keypair:It,crypto_hash:et,crypto_sign:no,crypto_sign_keypair:$r,crypto_sign_open:Fr,crypto_secretbox_KEYBYTES:Mr,crypto_secretbox_NONCEBYTES:nr,crypto_secretbox_ZEROBYTES:Vt,crypto_secretbox_BOXZEROBYTES:Tt,crypto_scalarmult_BYTES:Jt,crypto_scalarmult_SCALARBYTES:sr,crypto_box_PUBLICKEYBYTES:zt,crypto_box_SECRETKEYBYTES:jt,crypto_box_BEFORENMBYTES:Br,crypto_box_NONCEBYTES:so,crypto_box_ZEROBYTES:ua,crypto_box_BOXZEROBYTES:pa,crypto_sign_BYTES:ut,crypto_sign_PUBLICKEYBYTES:Ct,crypto_sign_SECRETKEYBYTES:$t,crypto_sign_SEEDBYTES:Ur,crypto_hash_BYTES:Lr,gf:r,D:h,L:ar,pack25519:Ie,unpack25519:we,M:se,A:le,S:Me,Z:Pe,pow2523:_t,add:ot,set25519:Y,modL:Dr,scalarmult:rr,scalarbase:or};function io(o,i){if(o.length!==Mr)throw new Error("bad key size");if(i.length!==nr)throw new Error("bad nonce size")}f(io,"checkLengths");function ha(o,i){if(o.length!==zt)throw new Error("bad public key size");if(i.length!==jt)throw new Error("bad secret key size")}f(ha,"checkBoxLengths");function tt(){for(var o=0;o<arguments.length;o++)if(!(arguments[o]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}f(tt,"checkArrayTypes");function co(o){for(var i=0;i<o.length;i++)o[i]=0}f(co,"cleanup"),t.randomBytes=function(o){var i=new Uint8Array(o);return a(i,o),i},t.secretbox=function(o,i,s){tt(o,i,s),io(s,i);for(var e=new Uint8Array(Vt+o.length),c=new Uint8Array(e.length),m=0;m<o.length;m++)e[m+Vt]=o[m];return P(c,e,e.length,i,s),c.subarray(Tt)},t.secretbox.open=function(o,i,s){tt(o,i,s),io(s,i);for(var e=new Uint8Array(Tt+o.length),c=new Uint8Array(e.length),m=0;m<o.length;m++)e[m+Tt]=o[m];return e.length<32||F(c,e,e.length,i,s)!==0?null:c.subarray(Vt)},t.secretbox.keyLength=Mr,t.secretbox.nonceLength=nr,t.secretbox.overheadLength=Tt,t.scalarMult=function(o,i){if(tt(o,i),o.length!==sr)throw new Error("bad n size");if(i.length!==Jt)throw new Error("bad p size");var s=new Uint8Array(Jt);return st(s,o,i),s},t.scalarMult.base=function(o){if(tt(o),o.length!==sr)throw new Error("bad n size");var i=new Uint8Array(Jt);return it(i,o),i},t.scalarMult.scalarLength=sr,t.scalarMult.groupElementLength=Jt,t.box=function(o,i,s,e){var c=t.box.before(s,e);return t.secretbox(o,i,c)},t.box.before=function(o,i){tt(o,i),ha(o,i);var s=new Uint8Array(Br);return St(s,o,i),s},t.box.after=t.secretbox,t.box.open=function(o,i,s,e){var c=t.box.before(s,e);return t.secretbox.open(o,i,c)},t.box.open.after=t.secretbox.open,t.box.keyPair=function(){var o=new Uint8Array(zt),i=new Uint8Array(jt);return It(o,i),{publicKey:o,secretKey:i}},t.box.keyPair.fromSecretKey=function(o){if(tt(o),o.length!==jt)throw new Error("bad secret key size");var i=new Uint8Array(zt);return it(i,o),{publicKey:i,secretKey:new Uint8Array(o)}},t.box.publicKeyLength=zt,t.box.secretKeyLength=jt,t.box.sharedKeyLength=Br,t.box.nonceLength=so,t.box.overheadLength=t.secretbox.overheadLength,t.sign=function(o,i){if(tt(o,i),i.length!==$t)throw new Error("bad secret key size");var s=new Uint8Array(ut+o.length);return no(s,o,o.length,i),s},t.sign.open=function(o,i){if(tt(o,i),i.length!==Ct)throw new Error("bad public key size");var s=new Uint8Array(o.length),e=Fr(s,o,o.length,i);if(e<0)return null;for(var c=new Uint8Array(e),m=0;m<c.length;m++)c[m]=s[m];return c},t.sign.detached=function(o,i){for(var s=t.sign(o,i),e=new Uint8Array(ut),c=0;c<e.length;c++)e[c]=s[c];return e},t.sign.detached.verify=function(o,i,s){if(tt(o,i,s),i.length!==ut)throw new Error("bad signature size");if(s.length!==Ct)throw new Error("bad public key size");var e=new Uint8Array(ut+o.length),c=new Uint8Array(ut+o.length),m;for(m=0;m<ut;m++)e[m]=i[m];for(m=0;m<o.length;m++)e[m+ut]=o[m];return Fr(c,e,e.length,s)>=0},t.sign.keyPair=function(){var o=new Uint8Array(Ct),i=new Uint8Array($t);return $r(o,i),{publicKey:o,secretKey:i}},t.sign.keyPair.fromSecretKey=function(o){if(tt(o),o.length!==$t)throw new Error("bad secret key size");for(var i=new Uint8Array(Ct),s=0;s<i.length;s++)i[s]=o[32+s];return{publicKey:i,secretKey:new Uint8Array(o)}},t.sign.keyPair.fromSeed=function(o){if(tt(o),o.length!==Ur)throw new Error("bad seed size");for(var i=new Uint8Array(Ct),s=new Uint8Array($t),e=0;e<32;e++)s[e]=o[e];return $r(i,s,!0),{publicKey:i,secretKey:s}},t.sign.publicKeyLength=Ct,t.sign.secretKeyLength=$t,t.sign.seedLength=Ur,t.sign.signatureLength=ut,t.hash=function(o){tt(o);var i=new Uint8Array(Lr);return et(i,o,o.length),i},t.hash.hashLength=Lr,t.verify=function(o,i){return tt(o,i),o.length===0||i.length===0||o.length!==i.length?!1:B(o,0,i,0,o.length)===0},t.setPRNG=function(o){a=o},function(){var o=typeof self<"u"?self.crypto||self.msCrypto:null;if(o&&o.getRandomValues){var i=65536;t.setPRNG((function(s,e){var c,m=new Uint8Array(e);for(c=0;c<e;c+=i)o.getRandomValues(m.subarray(c,c+Math.min(e-c,i)));for(c=0;c<e;c++)s[c]=m[c];co(m)}))}else typeof lo<"u"&&(o=Yr(),o&&o.randomBytes&&t.setPRNG((function(s,e){var c,m=o.randomBytes(e);for(c=0;c<e;c++)s[c]=m[c];co(m)})))}()})(typeof Cr<"u"&&Cr.exports?Cr.exports:self.nacl=self.nacl||{})}));var Ho=ir((()=>{}));var Ko=ir(((Ec,_r)=>{(function(){"use strict";var t="input is invalid type",r=typeof window=="object",a=r?window:{};a.JS_SHA256_NO_WINDOW&&(r=!1);var n=!r&&typeof self=="object",l=!a.JS_SHA256_NO_NODE_JS&&typeof process=="object"&&process.versions&&process.versions.node;l?a=global:n&&(a=self);var p=!a.JS_SHA256_NO_COMMON_JS&&typeof _r=="object"&&_r.exports,u=typeof define=="function"&&define.amd,v=!a.JS_SHA256_NO_ARRAY_BUFFER&&typeof ArrayBuffer<"u",h="0123456789abcdef".split(""),g=[-2147483648,8388608,32768,128],w=[24,16,8,0],y=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],_=["hex","array","digest","arrayBuffer"],k=[];(a.JS_SHA256_NO_NODE_JS||!Array.isArray)&&(Array.isArray=function(x){return Object.prototype.toString.call(x)==="[object Array]"}),v&&(a.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW||!ArrayBuffer.isView)&&(ArrayBuffer.isView=function(x){return typeof x=="object"&&x.buffer&&x.buffer.constructor===ArrayBuffer});var B=f((function(x,A){return function(D){return new H(A,!0).update(D)[x]()}}),"createOutputMethod"),K=f((function(x){var A=B("hex",x);l&&(A=V(A,x)),A.create=function(){return new H(x)},A.update=function(L){return A.create().update(L)};for(var D=0;D<_.length;++D){var E=_[D];A[E]=B(E,x)}return A}),"createMethod"),V=f((function(x,A){var D=Yr(),E=Ho().Buffer,L=A?"sha224":"sha256",R;E.from&&!a.JS_SHA256_NO_BUFFER_FROM?R=E.from:R=f((function(P){return new E(P)}),"bufferFrom");var z=f((function(P){if(typeof P=="string")return D.createHash(L).update(P,"utf8").digest("hex");if(P==null)throw new Error(t);return P.constructor===ArrayBuffer&&(P=new Uint8Array(P)),Array.isArray(P)||ArrayBuffer.isView(P)||P.constructor===E?D.createHash(L).update(R(P)).digest("hex"):x(P)}),"nodeMethod");return z}),"nodeWrap"),J=f((function(x,A){return function(D,E){return new X(D,A,!0).update(E)[x]()}}),"createHmacOutputMethod"),M=f((function(x){var A=J("hex",x);A.create=function(L){return new X(L,x)},A.update=function(L,R){return A.create(L).update(R)};for(var D=0;D<_.length;++D){var E=_[D];A[E]=J(E,x)}return A}),"createHmacMethod");function H(x,A){A?(k[0]=k[16]=k[1]=k[2]=k[3]=k[4]=k[5]=k[6]=k[7]=k[8]=k[9]=k[10]=k[11]=k[12]=k[13]=k[14]=k[15]=0,this.blocks=k):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],x?(this.h0=3238371032,this.h1=914150663,this.h2=812702999,this.h3=4144912697,this.h4=4290775857,this.h5=1750603025,this.h6=1694076839,this.h7=3204075428):(this.h0=1779033703,this.h1=3144134277,this.h2=1013904242,this.h3=2773480762,this.h4=1359893119,this.h5=2600822924,this.h6=528734635,this.h7=1541459225),this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0,this.is224=x}f(H,"Sha256"),H.prototype.update=function(x){if(!this.finalized){var A,D=typeof x;if(D!=="string"){if(D==="object"){if(x===null)throw new Error(t);if(v&&x.constructor===ArrayBuffer)x=new Uint8Array(x);else if(!Array.isArray(x)&&(!v||!ArrayBuffer.isView(x)))throw new Error(t)}else throw new Error(t);A=!0}for(var E,L=0,R,z=x.length,P=this.blocks;L<z;){if(this.hashed&&(this.hashed=!1,P[0]=this.block,this.block=P[16]=P[1]=P[2]=P[3]=P[4]=P[5]=P[6]=P[7]=P[8]=P[9]=P[10]=P[11]=P[12]=P[13]=P[14]=P[15]=0),A)for(R=this.start;L<z&&R<64;++L)P[R>>>2]|=x[L]<<w[R++&3];else for(R=this.start;L<z&&R<64;++L)E=x.charCodeAt(L),E<128?P[R>>>2]|=E<<w[R++&3]:E<2048?(P[R>>>2]|=(192|E>>>6)<<w[R++&3],P[R>>>2]|=(128|E&63)<<w[R++&3]):E<55296||E>=57344?(P[R>>>2]|=(224|E>>>12)<<w[R++&3],P[R>>>2]|=(128|E>>>6&63)<<w[R++&3],P[R>>>2]|=(128|E&63)<<w[R++&3]):(E=65536+((E&1023)<<10|x.charCodeAt(++L)&1023),P[R>>>2]|=(240|E>>>18)<<w[R++&3],P[R>>>2]|=(128|E>>>12&63)<<w[R++&3],P[R>>>2]|=(128|E>>>6&63)<<w[R++&3],P[R>>>2]|=(128|E&63)<<w[R++&3]);this.lastByteIndex=R,this.bytes+=R-this.start,R>=64?(this.block=P[16],this.start=R-64,this.hash(),this.hashed=!0):this.start=R}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},H.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var x=this.blocks,A=this.lastByteIndex;x[16]=this.block,x[A>>>2]|=g[A&3],this.block=x[16],A>=56&&(this.hashed||this.hash(),x[0]=this.block,x[16]=x[1]=x[2]=x[3]=x[4]=x[5]=x[6]=x[7]=x[8]=x[9]=x[10]=x[11]=x[12]=x[13]=x[14]=x[15]=0),x[14]=this.hBytes<<3|this.bytes>>>29,x[15]=this.bytes<<3,this.hash()}},H.prototype.hash=function(){var x=this.h0,A=this.h1,D=this.h2,E=this.h3,L=this.h4,R=this.h5,z=this.h6,P=this.h7,F=this.blocks,Y,ne,ie,Ie,Z,fe,we,le,Pe,se,Me;for(Y=16;Y<64;++Y)Z=F[Y-15],ne=(Z>>>7|Z<<25)^(Z>>>18|Z<<14)^Z>>>3,Z=F[Y-2],ie=(Z>>>17|Z<<15)^(Z>>>19|Z<<13)^Z>>>10,F[Y]=F[Y-16]+ne+F[Y-7]+ie<<0;for(Me=A&D,Y=0;Y<64;Y+=4)this.first?(this.is224?(le=300032,Z=F[0]-1413257819,P=Z-150054599<<0,E=Z+24177077<<0):(le=704751109,Z=F[0]-210244248,P=Z-1521486534<<0,E=Z+143694565<<0),this.first=!1):(ne=(x>>>2|x<<30)^(x>>>13|x<<19)^(x>>>22|x<<10),ie=(L>>>6|L<<26)^(L>>>11|L<<21)^(L>>>25|L<<7),le=x&A,Ie=le^x&D^Me,we=L&R^~L&z,Z=P+ie+we+y[Y]+F[Y],fe=ne+Ie,P=E+Z<<0,E=Z+fe<<0),ne=(E>>>2|E<<30)^(E>>>13|E<<19)^(E>>>22|E<<10),ie=(P>>>6|P<<26)^(P>>>11|P<<21)^(P>>>25|P<<7),Pe=E&x,Ie=Pe^E&A^le,we=P&L^~P&R,Z=z+ie+we+y[Y+1]+F[Y+1],fe=ne+Ie,z=D+Z<<0,D=Z+fe<<0,ne=(D>>>2|D<<30)^(D>>>13|D<<19)^(D>>>22|D<<10),ie=(z>>>6|z<<26)^(z>>>11|z<<21)^(z>>>25|z<<7),se=D&E,Ie=se^D&x^Pe,we=z&P^~z&L,Z=R+ie+we+y[Y+2]+F[Y+2],fe=ne+Ie,R=A+Z<<0,A=Z+fe<<0,ne=(A>>>2|A<<30)^(A>>>13|A<<19)^(A>>>22|A<<10),ie=(R>>>6|R<<26)^(R>>>11|R<<21)^(R>>>25|R<<7),Me=A&D,Ie=Me^A&E^se,we=R&z^~R&P,Z=L+ie+we+y[Y+3]+F[Y+3],fe=ne+Ie,L=x+Z<<0,x=Z+fe<<0,this.chromeBugWorkAround=!0;this.h0=this.h0+x<<0,this.h1=this.h1+A<<0,this.h2=this.h2+D<<0,this.h3=this.h3+E<<0,this.h4=this.h4+L<<0,this.h5=this.h5+R<<0,this.h6=this.h6+z<<0,this.h7=this.h7+P<<0},H.prototype.hex=function(){this.finalize();var x=this.h0,A=this.h1,D=this.h2,E=this.h3,L=this.h4,R=this.h5,z=this.h6,P=this.h7,F=h[x>>>28&15]+h[x>>>24&15]+h[x>>>20&15]+h[x>>>16&15]+h[x>>>12&15]+h[x>>>8&15]+h[x>>>4&15]+h[x&15]+h[A>>>28&15]+h[A>>>24&15]+h[A>>>20&15]+h[A>>>16&15]+h[A>>>12&15]+h[A>>>8&15]+h[A>>>4&15]+h[A&15]+h[D>>>28&15]+h[D>>>24&15]+h[D>>>20&15]+h[D>>>16&15]+h[D>>>12&15]+h[D>>>8&15]+h[D>>>4&15]+h[D&15]+h[E>>>28&15]+h[E>>>24&15]+h[E>>>20&15]+h[E>>>16&15]+h[E>>>12&15]+h[E>>>8&15]+h[E>>>4&15]+h[E&15]+h[L>>>28&15]+h[L>>>24&15]+h[L>>>20&15]+h[L>>>16&15]+h[L>>>12&15]+h[L>>>8&15]+h[L>>>4&15]+h[L&15]+h[R>>>28&15]+h[R>>>24&15]+h[R>>>20&15]+h[R>>>16&15]+h[R>>>12&15]+h[R>>>8&15]+h[R>>>4&15]+h[R&15]+h[z>>>28&15]+h[z>>>24&15]+h[z>>>20&15]+h[z>>>16&15]+h[z>>>12&15]+h[z>>>8&15]+h[z>>>4&15]+h[z&15];return this.is224||(F+=h[P>>>28&15]+h[P>>>24&15]+h[P>>>20&15]+h[P>>>16&15]+h[P>>>12&15]+h[P>>>8&15]+h[P>>>4&15]+h[P&15]),F},H.prototype.toString=H.prototype.hex,H.prototype.digest=function(){this.finalize();var x=this.h0,A=this.h1,D=this.h2,E=this.h3,L=this.h4,R=this.h5,z=this.h6,P=this.h7,F=[x>>>24&255,x>>>16&255,x>>>8&255,x&255,A>>>24&255,A>>>16&255,A>>>8&255,A&255,D>>>24&255,D>>>16&255,D>>>8&255,D&255,E>>>24&255,E>>>16&255,E>>>8&255,E&255,L>>>24&255,L>>>16&255,L>>>8&255,L&255,R>>>24&255,R>>>16&255,R>>>8&255,R&255,z>>>24&255,z>>>16&255,z>>>8&255,z&255];return this.is224||F.push(P>>>24&255,P>>>16&255,P>>>8&255,P&255),F},H.prototype.array=H.prototype.digest,H.prototype.arrayBuffer=function(){this.finalize();var x=new ArrayBuffer(this.is224?28:32),A=new DataView(x);return A.setUint32(0,this.h0),A.setUint32(4,this.h1),A.setUint32(8,this.h2),A.setUint32(12,this.h3),A.setUint32(16,this.h4),A.setUint32(20,this.h5),A.setUint32(24,this.h6),this.is224||A.setUint32(28,this.h7),x};function X(x,A,D){var E,L=typeof x;if(L==="string"){var R=[],z=x.length,P=0,F;for(E=0;E<z;++E)F=x.charCodeAt(E),F<128?R[P++]=F:F<2048?(R[P++]=192|F>>>6,R[P++]=128|F&63):F<55296||F>=57344?(R[P++]=224|F>>>12,R[P++]=128|F>>>6&63,R[P++]=128|F&63):(F=65536+((F&1023)<<10|x.charCodeAt(++E)&1023),R[P++]=240|F>>>18,R[P++]=128|F>>>12&63,R[P++]=128|F>>>6&63,R[P++]=128|F&63);x=R}else if(L==="object"){if(x===null)throw new Error(t);if(v&&x.constructor===ArrayBuffer)x=new Uint8Array(x);else if(!Array.isArray(x)&&(!v||!ArrayBuffer.isView(x)))throw new Error(t)}else throw new Error(t);x.length>64&&(x=new H(A,!0).update(x).array());var Y=[],ne=[];for(E=0;E<64;++E){var ie=x[E]||0;Y[E]=92^ie,ne[E]=54^ie}H.call(this,A,D),this.update(ne),this.oKeyPad=Y,this.inner=!0,this.sharedMemory=D}f(X,"HmacSha256"),X.prototype=new H,X.prototype.finalize=function(){if(H.prototype.finalize.call(this),this.inner){this.inner=!1;var x=this.array();H.call(this,this.is224,this.sharedMemory),this.update(this.oKeyPad),this.update(x),H.prototype.finalize.call(this)}};var W=K();W.sha256=W,W.sha224=K(!0),W.sha256.hmac=M(),W.sha224.hmac=M(!0),p?_r.exports=W:(a.sha256=W.sha256,a.sha224=W.sha224,u&&define((function(){return W})))})()}));var mt=crypto,cr=f((t=>t instanceof CryptoKey),"isCryptoKey");var Ze=new TextEncoder,at=new TextDecoder,vn=2**32;function lr(...t){let r=t.reduce(((l,{length:p})=>l+p),0),a=new Uint8Array(r),n=0;for(let l of t)a.set(l,n),n+=l.length;return a}f(lr,"concat");var va=f((t=>{let r=t;typeof r=="string"&&(r=Ze.encode(r));let a=32768,n=[];for(let l=0;l<r.length;l+=a)n.push(String.fromCharCode.apply(null,r.subarray(l,l+a)));return btoa(n.join(""))}),"encodeBase64"),fr=f((t=>va(t).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")),"encode"),Sa=f((t=>{let r=atob(t),a=new Uint8Array(r.length);for(let n=0;n<r.length;n++)a[n]=r.charCodeAt(n);return a}),"decodeBase64"),ct=f((t=>{let r=t;r instanceof Uint8Array&&(r=at.decode(r)),r=r.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,"");try{return Sa(r)}catch{throw new TypeError("The input to be decoded is not correctly encoded.")}}),"decode");var He=class extends Error{constructor(r,a){super(r,a),this.code="ERR_JOSE_GENERIC",this.name=this.constructor.name,Error.captureStackTrace?.(this,this.constructor)}};f(He,"JOSEError");He.code="ERR_JOSE_GENERIC";var Qe=class extends He{constructor(r,a,n="unspecified",l="unspecified"){super(r,{cause:{claim:n,reason:l,payload:a}}),this.code="ERR_JWT_CLAIM_VALIDATION_FAILED",this.claim=n,this.reason=l,this.payload=a}};f(Qe,"JWTClaimValidationFailed");Qe.code="ERR_JWT_CLAIM_VALIDATION_FAILED";var Pt=class extends He{constructor(r,a,n="unspecified",l="unspecified"){super(r,{cause:{claim:n,reason:l,payload:a}}),this.code="ERR_JWT_EXPIRED",this.claim=n,this.reason=l,this.payload=a}};f(Pt,"JWTExpired");Pt.code="ERR_JWT_EXPIRED";var Dt=class extends He{constructor(){super(...arguments),this.code="ERR_JOSE_ALG_NOT_ALLOWED"}};f(Dt,"JOSEAlgNotAllowed");Dt.code="ERR_JOSE_ALG_NOT_ALLOWED";var Ye=class extends He{constructor(){super(...arguments),this.code="ERR_JOSE_NOT_SUPPORTED"}};f(Ye,"JOSENotSupported");Ye.code="ERR_JOSE_NOT_SUPPORTED";var dr=class extends He{constructor(r="decryption operation failed",a){super(r,a),this.code="ERR_JWE_DECRYPTION_FAILED"}};f(dr,"JWEDecryptionFailed");dr.code="ERR_JWE_DECRYPTION_FAILED";var ur=class extends He{constructor(){super(...arguments),this.code="ERR_JWE_INVALID"}};f(ur,"JWEInvalid");ur.code="ERR_JWE_INVALID";var $e=class extends He{constructor(){super(...arguments),this.code="ERR_JWS_INVALID"}};f($e,"JWSInvalid");$e.code="ERR_JWS_INVALID";var lt=class extends He{constructor(){super(...arguments),this.code="ERR_JWT_INVALID"}};f(lt,"JWTInvalid");lt.code="ERR_JWT_INVALID";var pr=class extends He{constructor(){super(...arguments),this.code="ERR_JWK_INVALID"}};f(pr,"JWKInvalid");pr.code="ERR_JWK_INVALID";var hr=class extends He{constructor(){super(...arguments),this.code="ERR_JWKS_INVALID"}};f(hr,"JWKSInvalid");hr.code="ERR_JWKS_INVALID";var mr=class extends He{constructor(r="no applicable key found in the JSON Web Key Set",a){super(r,a),this.code="ERR_JWKS_NO_MATCHING_KEY"}};f(mr,"JWKSNoMatchingKey");mr.code="ERR_JWKS_NO_MATCHING_KEY";var xr=class extends He{constructor(r="multiple matching keys found in the JSON Web Key Set",a){super(r,a),this.code="ERR_JWKS_MULTIPLE_MATCHING_KEYS"}};f(xr,"JWKSMultipleMatchingKeys");xr.code="ERR_JWKS_MULTIPLE_MATCHING_KEYS";var br=class extends He{constructor(r="request timed out",a){super(r,a),this.code="ERR_JWKS_TIMEOUT"}};f(br,"JWKSTimeout");br.code="ERR_JWKS_TIMEOUT";var Nt=class extends He{constructor(r="signature verification failed",a){super(r,a),this.code="ERR_JWS_SIGNATURE_VERIFICATION_FAILED"}};f(Nt,"JWSSignatureVerificationFailed");Nt.code="ERR_JWS_SIGNATURE_VERIFICATION_FAILED";function ft(t,r="algorithm.name"){return new TypeError(`CryptoKey does not support this operation, its ${r} must be ${t}`)}f(ft,"unusable");function Gt(t,r){return t.name===r}f(Gt,"isAlgorithm");function Hr(t){return parseInt(t.name.slice(4),10)}f(Hr,"getHashLength");function Pa(t){switch(t){case"ES256":return"P-256";case"ES384":return"P-384";case"ES512":return"P-521";default:throw new Error("unreachable")}}f(Pa,"getNamedCurve");function Ea(t,r){if(r.length&&!r.some((a=>t.usages.includes(a)))){let a="CryptoKey does not support this operation, its usages must include ";if(r.length>2){let n=r.pop();a+=`one of ${r.join(", ")}, or ${n}.`}else r.length===2?a+=`one of ${r[0]} or ${r[1]}.`:a+=`${r[0]}.`;throw new TypeError(a)}}f(Ea,"checkUsage");function fo(t,r,...a){switch(r){case"HS256":case"HS384":case"HS512":{if(!Gt(t.algorithm,"HMAC"))throw ft("HMAC");let n=parseInt(r.slice(2),10);if(Hr(t.algorithm.hash)!==n)throw ft(`SHA-${n}`,"algorithm.hash");break}case"RS256":case"RS384":case"RS512":{if(!Gt(t.algorithm,"RSASSA-PKCS1-v1_5"))throw ft("RSASSA-PKCS1-v1_5");let n=parseInt(r.slice(2),10);if(Hr(t.algorithm.hash)!==n)throw ft(`SHA-${n}`,"algorithm.hash");break}case"PS256":case"PS384":case"PS512":{if(!Gt(t.algorithm,"RSA-PSS"))throw ft("RSA-PSS");let n=parseInt(r.slice(2),10);if(Hr(t.algorithm.hash)!==n)throw ft(`SHA-${n}`,"algorithm.hash");break}case"EdDSA":{if(t.algorithm.name!=="Ed25519"&&t.algorithm.name!=="Ed448")throw ft("Ed25519 or Ed448");break}case"Ed25519":{if(!Gt(t.algorithm,"Ed25519"))throw ft("Ed25519");break}case"ES256":case"ES384":case"ES512":{if(!Gt(t.algorithm,"ECDSA"))throw ft("ECDSA");let n=Pa(r);if(t.algorithm.namedCurve!==n)throw ft(n,"algorithm.namedCurve");break}default:throw new TypeError("CryptoKey does not support this operation")}Ea(t,a)}f(fo,"checkSigCryptoKey");function uo(t,r,...a){if(a=a.filter(Boolean),a.length>2){let n=a.pop();t+=`one of type ${a.join(", ")}, or ${n}.`}else a.length===2?t+=`one of type ${a[0]} or ${a[1]}.`:t+=`of type ${a[0]}.`;return r==null?t+=` Received ${r}`:typeof r=="function"&&r.name?t+=` Received function ${r.name}`:typeof r=="object"&&r!=null&&r.constructor?.name&&(t+=` Received an instance of ${r.constructor.name}`),t}f(uo,"message");var Kr=f(((t,...r)=>uo("Key must be ",t,...r)),"default");function Vr(t,r,...a){return uo(`Key for the ${t} algorithm must be `,r,...a)}f(Vr,"withAlg");var Jr=f((t=>cr(t)?!0:t?.[Symbol.toStringTag]==="KeyObject"),"default"),Ft=["CryptoKey"];var Aa=f(((...t)=>{let r=t.filter(Boolean);if(r.length===0||r.length===1)return!0;let a;for(let n of r){let l=Object.keys(n);if(!a||a.size===0){a=new Set(l);continue}for(let p of l){if(a.has(p))return!1;a.add(p)}}return!0}),"isDisjoint"),gr=Aa;function ka(t){return typeof t=="object"&&t!==null}f(ka,"isObjectLike");function rt(t){if(!ka(t)||Object.prototype.toString.call(t)!=="[object Object]")return!1;if(Object.getPrototypeOf(t)===null)return!0;let r=t;for(;Object.getPrototypeOf(r)!==null;)r=Object.getPrototypeOf(r);return Object.getPrototypeOf(t)===r}f(rt,"isObject");var yr=f(((t,r)=>{if(t.startsWith("RS")||t.startsWith("PS")){let{modulusLength:a}=r.algorithm;if(typeof a!="number"||a<2048)throw new TypeError(`${t} requires key modulusLength to be 2048 bits or larger`)}}),"default");function pt(t){return rt(t)&&typeof t.kty=="string"}f(pt,"isJWK");function po(t){return t.kty!=="oct"&&typeof t.d=="string"}f(po,"isPrivateJWK");function ho(t){return t.kty!=="oct"&&typeof t.d>"u"}f(ho,"isPublicJWK");function mo(t){return pt(t)&&t.kty==="oct"&&typeof t.k=="string"}f(mo,"isSecretJWK");function _a(t){let r,a;switch(t.kty){case"RSA":{switch(t.alg){case"PS256":case"PS384":case"PS512":r={name:"RSA-PSS",hash:`SHA-${t.alg.slice(-3)}`},a=t.d?["sign"]:["verify"];break;case"RS256":case"RS384":case"RS512":r={name:"RSASSA-PKCS1-v1_5",hash:`SHA-${t.alg.slice(-3)}`},a=t.d?["sign"]:["verify"];break;case"RSA-OAEP":case"RSA-OAEP-256":case"RSA-OAEP-384":case"RSA-OAEP-512":r={name:"RSA-OAEP",hash:`SHA-${parseInt(t.alg.slice(-3),10)||1}`},a=t.d?["decrypt","unwrapKey"]:["encrypt","wrapKey"];break;default:throw new Ye('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break}case"EC":{switch(t.alg){case"ES256":r={name:"ECDSA",namedCurve:"P-256"},a=t.d?["sign"]:["verify"];break;case"ES384":r={name:"ECDSA",namedCurve:"P-384"},a=t.d?["sign"]:["verify"];break;case"ES512":r={name:"ECDSA",namedCurve:"P-521"},a=t.d?["sign"]:["verify"];break;case"ECDH-ES":case"ECDH-ES+A128KW":case"ECDH-ES+A192KW":case"ECDH-ES+A256KW":r={name:"ECDH",namedCurve:t.crv},a=t.d?["deriveBits"]:[];break;default:throw new Ye('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break}case"OKP":{switch(t.alg){case"Ed25519":r={name:"Ed25519"},a=t.d?["sign"]:["verify"];break;case"EdDSA":r={name:t.crv},a=t.d?["sign"]:["verify"];break;case"ECDH-ES":case"ECDH-ES+A128KW":case"ECDH-ES+A192KW":case"ECDH-ES+A256KW":r={name:t.crv},a=t.d?["deriveBits"]:[];break;default:throw new Ye('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')}break}default:throw new Ye('Invalid or unsupported JWK "kty" (Key Type) Parameter value')}return{algorithm:r,keyUsages:a}}f(_a,"subtleMapping");var Ia=f((async t=>{if(!t.alg)throw new TypeError('"alg" argument is required when "jwk.alg" is not present');let{algorithm:r,keyUsages:a}=_a(t),n=[r,t.ext??!1,t.key_ops??a],l={...t};return delete l.alg,delete l.use,mt.subtle.importKey("jwk",l,...n)}),"parse"),wr=Ia;var xo=f((t=>ct(t)),"exportKeyValue"),Mt,Bt,bo=f((t=>t?.[Symbol.toStringTag]==="KeyObject"),"isKeyObject"),vr=f((async(t,r,a,n,l=!1)=>{let p=t.get(r);if(p?.[n])return p[n];let u=await wr({...a,alg:n});return l&&Object.freeze(r),p?p[n]=u:t.set(r,{[n]:u}),u}),"importAndCache"),Ta=f(((t,r)=>{if(bo(t)){let a=t.export({format:"jwk"});return delete a.d,delete a.dp,delete a.dq,delete a.p,delete a.q,delete a.qi,a.k?xo(a.k):(Bt||(Bt=new WeakMap),vr(Bt,t,a,r))}return pt(t)?t.k?ct(t.k):(Bt||(Bt=new WeakMap),vr(Bt,t,t,r,!0)):t}),"normalizePublicKey"),$a=f(((t,r)=>{if(bo(t)){let a=t.export({format:"jwk"});return a.k?xo(a.k):(Mt||(Mt=new WeakMap),vr(Mt,t,a,r))}return pt(t)?t.k?ct(t.k):(Mt||(Mt=new WeakMap),vr(Mt,t,t,r,!0)):t}),"normalizePrivateKey"),zr={normalizePublicKey:Ta,normalizePrivateKey:$a};async function go(t,r){if(!rt(t))throw new TypeError("JWK must be an object");switch(r||(r=t.alg),t.kty){case"oct":if(typeof t.k!="string"||!t.k)throw new TypeError('missing "k" (Key Value) Parameter value');return ct(t.k);case"RSA":if("oth"in t&&t.oth!==void 0)throw new Ye('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');case"EC":case"OKP":return wr({...t,alg:r});default:throw new Ye('Unsupported "kty" (Key Type) Parameter value')}}f(go,"importJWK");var Ut=f((t=>t?.[Symbol.toStringTag]),"tag"),jr=f(((t,r,a)=>{if(r.use!==void 0&&r.use!=="sig")throw new TypeError("Invalid key for this operation, when present its use must be sig");if(r.key_ops!==void 0&&r.key_ops.includes?.(a)!==!0)throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${a}`);if(r.alg!==void 0&&r.alg!==t)throw new TypeError(`Invalid key for this operation, when present its alg must be ${t}`);return!0}),"jwkMatchesOp"),Da=f(((t,r,a,n)=>{if(!(r instanceof Uint8Array)){if(n&&pt(r)){if(mo(r)&&jr(t,r,a))return;throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present')}if(!Jr(r))throw new TypeError(Vr(t,r,...Ft,"Uint8Array",n?"JSON Web Key":null));if(r.type!=="secret")throw new TypeError(`${Ut(r)} instances for symmetric algorithms must be of type "secret"`)}}),"symmetricTypeCheck"),Na=f(((t,r,a,n)=>{if(n&&pt(r))switch(a){case"sign":if(po(r)&&jr(t,r,a))return;throw new TypeError("JSON Web Key for this operation be a private JWK");case"verify":if(ho(r)&&jr(t,r,a))return;throw new TypeError("JSON Web Key for this operation be a public JWK")}if(!Jr(r))throw new TypeError(Vr(t,r,...Ft,n?"JSON Web Key":null));if(r.type==="secret")throw new TypeError(`${Ut(r)} instances for asymmetric algorithms must not be of type "secret"`);if(a==="sign"&&r.type==="public")throw new TypeError(`${Ut(r)} instances for asymmetric algorithm signing must be of type "private"`);if(a==="decrypt"&&r.type==="public")throw new TypeError(`${Ut(r)} instances for asymmetric algorithm decryption must be of type "private"`);if(r.algorithm&&a==="verify"&&r.type==="private")throw new TypeError(`${Ut(r)} instances for asymmetric algorithm verifying must be of type "public"`);if(r.algorithm&&a==="encrypt"&&r.type==="private")throw new TypeError(`${Ut(r)} instances for asymmetric algorithm encryption must be of type "public"`)}),"asymmetricTypeCheck");function yo(t,r,a,n){r.startsWith("HS")||r==="dir"||r.startsWith("PBES2")||/^A\d{3}(?:GCM)?KW$/.test(r)?Da(r,a,n,t):Na(r,a,n,t)}f(yo,"checkKeyType");var ss=yo.bind(void 0,!1),Yt=yo.bind(void 0,!0);function Fa(t,r,a,n,l){if(l.crit!==void 0&&n?.crit===void 0)throw new t('"crit" (Critical) Header Parameter MUST be integrity protected');if(!n||n.crit===void 0)return new Set;if(!Array.isArray(n.crit)||n.crit.length===0||n.crit.some((u=>typeof u!="string"||u.length===0)))throw new t('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');let p;a!==void 0?p=new Map([...Object.entries(a),...r.entries()]):p=r;for(let u of n.crit){if(!p.has(u))throw new Ye(`Extension Header Parameter "${u}" is not recognized`);if(l[u]===void 0)throw new t(`Extension Header Parameter "${u}" is missing`);if(p.get(u)&&n[u]===void 0)throw new t(`Extension Header Parameter "${u}" MUST be integrity protected`)}return new Set(n.crit)}f(Fa,"validateCrit");var Sr=Fa;var Ma=f(((t,r)=>{if(r!==void 0&&(!Array.isArray(r)||r.some((a=>typeof a!="string"))))throw new TypeError(`"${t}" option must be an array of strings`);if(r)return new Set(r)}),"validateAlgorithms"),wo=Ma;function Xt(t,r){let a=`SHA-${t.slice(-3)}`;switch(t){case"HS256":case"HS384":case"HS512":return{hash:a,name:"HMAC"};case"PS256":case"PS384":case"PS512":return{hash:a,name:"RSA-PSS",saltLength:t.slice(-3)>>3};case"RS256":case"RS384":case"RS512":return{hash:a,name:"RSASSA-PKCS1-v1_5"};case"ES256":case"ES384":case"ES512":return{hash:a,name:"ECDSA",namedCurve:r.namedCurve};case"Ed25519":return{name:"Ed25519"};case"EdDSA":return{name:r.name};default:throw new Ye(`alg ${t} is not supported either by JOSE or your javascript runtime`)}}f(Xt,"subtleDsa");async function Qt(t,r,a){if(a==="sign"&&(r=await zr.normalizePrivateKey(r,t)),a==="verify"&&(r=await zr.normalizePublicKey(r,t)),cr(r))return fo(r,t,a),r;if(r instanceof Uint8Array){if(!t.startsWith("HS"))throw new TypeError(Kr(r,...Ft));return mt.subtle.importKey("raw",r,{hash:`SHA-${t.slice(-3)}`,name:"HMAC"},!1,[a])}throw new TypeError(Kr(r,...Ft,"Uint8Array","JSON Web Key"))}f(Qt,"getCryptoKey");var Ba=f((async(t,r,a,n)=>{let l=await Qt(t,r,"verify");yr(t,l);let p=Xt(t,l.algorithm);try{return await mt.subtle.verify(p,l,a,n)}catch{return!1}}),"verify"),vo=Ba;async function So(t,r,a){if(!rt(t))throw new $e("Flattened JWS must be an object");if(t.protected===void 0&&t.header===void 0)throw new $e('Flattened JWS must have either of the "protected" or "header" members');if(t.protected!==void 0&&typeof t.protected!="string")throw new $e("JWS Protected Header incorrect type");if(t.payload===void 0)throw new $e("JWS Payload missing");if(typeof t.signature!="string")throw new $e("JWS Signature missing or incorrect type");if(t.header!==void 0&&!rt(t.header))throw new $e("JWS Unprotected Header incorrect type");let n={};if(t.protected)try{let K=ct(t.protected);n=JSON.parse(at.decode(K))}catch{throw new $e("JWS Protected Header is invalid")}if(!gr(n,t.header))throw new $e("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let l={...n,...t.header},p=Sr($e,new Map([["b64",!0]]),a?.crit,n,l),u=!0;if(p.has("b64")&&(u=n.b64,typeof u!="boolean"))throw new $e('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:v}=l;if(typeof v!="string"||!v)throw new $e('JWS "alg" (Algorithm) Header Parameter missing or invalid');let h=a&&wo("algorithms",a.algorithms);if(h&&!h.has(v))throw new Dt('"alg" (Algorithm) Header Parameter value not allowed');if(u){if(typeof t.payload!="string")throw new $e("JWS Payload must be a string")}else if(typeof t.payload!="string"&&!(t.payload instanceof Uint8Array))throw new $e("JWS Payload must be a string or an Uint8Array instance");let g=!1;typeof r=="function"?(r=await r(n,t),g=!0,Yt(v,r,"verify"),pt(r)&&(r=await go(r,v))):Yt(v,r,"verify");let w=lr(Ze.encode(t.protected??""),Ze.encode("."),typeof t.payload=="string"?Ze.encode(t.payload):t.payload),y;try{y=ct(t.signature)}catch{throw new $e("Failed to base64url decode the signature")}if(!await vo(v,r,y,w))throw new Nt;let k;if(u)try{k=ct(t.payload)}catch{throw new $e("Failed to base64url decode the payload")}else typeof t.payload=="string"?k=Ze.encode(t.payload):k=t.payload;let B={payload:k};return t.protected!==void 0&&(B.protectedHeader=n),t.header!==void 0&&(B.unprotectedHeader=t.header),g?{...B,key:r}:B}f(So,"flattenedVerify");async function Co(t,r,a){if(t instanceof Uint8Array&&(t=at.decode(t)),typeof t!="string")throw new $e("Compact JWS must be a string or Uint8Array");let{0:n,1:l,2:p,length:u}=t.split(".");if(u!==3)throw new $e("Invalid Compact JWS");let v=await So({payload:l,protected:n,signature:p},r,a),h={payload:v.payload,protectedHeader:v.protectedHeader};return typeof r=="function"?{...h,key:v.key}:h}f(Co,"compactVerify");var dt=f((t=>Math.floor(t.getTime()/1e3)),"default");var Ua=/^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i,Et=f((t=>{let r=Ua.exec(t);if(!r||r[4]&&r[1])throw new TypeError("Invalid time period format");let a=parseFloat(r[2]),n=r[3].toLowerCase(),l;switch(n){case"sec":case"secs":case"second":case"seconds":case"s":l=Math.round(a);break;case"minute":case"minutes":case"min":case"mins":case"m":l=Math.round(a*60);break;case"hour":case"hours":case"hr":case"hrs":case"h":l=Math.round(a*3600);break;case"day":case"days":case"d":l=Math.round(a*86400);break;case"week":case"weeks":case"w":l=Math.round(a*604800);break;default:l=Math.round(a*31557600);break}return r[1]==="-"||r[4]==="ago"?-l:l}),"default");var Po=f((t=>t.toLowerCase().replace(/^application\//,"")),"normalizeTyp"),La=f(((t,r)=>typeof t=="string"?r.includes(t):Array.isArray(t)?r.some(Set.prototype.has.bind(new Set(t))):!1),"checkAudiencePresence"),Eo=f(((t,r,a={})=>{let n;try{n=JSON.parse(at.decode(r))}catch{}if(!rt(n))throw new lt("JWT Claims Set must be a top-level JSON object");let{typ:l}=a;if(l&&(typeof t.typ!="string"||Po(t.typ)!==Po(l)))throw new Qe('unexpected "typ" JWT header value',n,"typ","check_failed");let{requiredClaims:p=[],issuer:u,subject:v,audience:h,maxTokenAge:g}=a,w=[...p];g!==void 0&&w.push("iat"),h!==void 0&&w.push("aud"),v!==void 0&&w.push("sub"),u!==void 0&&w.push("iss");for(let B of new Set(w.reverse()))if(!(B in n))throw new Qe(`missing required "${B}" claim`,n,B,"missing");if(u&&!(Array.isArray(u)?u:[u]).includes(n.iss))throw new Qe('unexpected "iss" claim value',n,"iss","check_failed");if(v&&n.sub!==v)throw new Qe('unexpected "sub" claim value',n,"sub","check_failed");if(h&&!La(n.aud,typeof h=="string"?[h]:h))throw new Qe('unexpected "aud" claim value',n,"aud","check_failed");let y;switch(typeof a.clockTolerance){case"string":y=Et(a.clockTolerance);break;case"number":y=a.clockTolerance;break;case"undefined":y=0;break;default:throw new TypeError("Invalid clockTolerance option type")}let{currentDate:_}=a,k=dt(_||new Date);if((n.iat!==void 0||g)&&typeof n.iat!="number")throw new Qe('"iat" claim must be a number',n,"iat","invalid");if(n.nbf!==void 0){if(typeof n.nbf!="number")throw new Qe('"nbf" claim must be a number',n,"nbf","invalid");if(n.nbf>k+y)throw new Qe('"nbf" claim timestamp check failed',n,"nbf","check_failed")}if(n.exp!==void 0){if(typeof n.exp!="number")throw new Qe('"exp" claim must be a number',n,"exp","invalid");if(n.exp<=k-y)throw new Pt('"exp" claim timestamp check failed',n,"exp","check_failed")}if(g){let B=k-n.iat,K=typeof g=="number"?g:Et(g);if(B-y>K)throw new Pt('"iat" claim timestamp check failed (too far in the past)',n,"iat","check_failed");if(B<0-y)throw new Qe('"iat" claim timestamp check failed (it should be in the past)',n,"iat","check_failed")}return n}),"default");async function Gr(t,r,a){let n=await Co(t,r,a);if(n.protectedHeader.crit?.includes("b64")&&n.protectedHeader.b64===!1)throw new lt("JWTs MUST NOT use unencoded payload");let p={payload:Eo(n.protectedHeader,n.payload,a),protectedHeader:n.protectedHeader};return typeof r=="function"?{...p,key:n.key}:p}f(Gr,"jwtVerify");var Oa=f((async(t,r,a)=>{let n=await Qt(t,r,"sign");yr(t,n);let l=await mt.subtle.sign(Xt(t,n.algorithm),n,a);return new Uint8Array(l)}),"sign"),Ao=Oa;var qt=class{constructor(r){if(!(r instanceof Uint8Array))throw new TypeError("payload must be an instance of Uint8Array");this._payload=r}setProtectedHeader(r){if(this._protectedHeader)throw new TypeError("setProtectedHeader can only be called once");return this._protectedHeader=r,this}setUnprotectedHeader(r){if(this._unprotectedHeader)throw new TypeError("setUnprotectedHeader can only be called once");return this._unprotectedHeader=r,this}async sign(r,a){if(!this._protectedHeader&&!this._unprotectedHeader)throw new $e("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");if(!gr(this._protectedHeader,this._unprotectedHeader))throw new $e("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");let n={...this._protectedHeader,...this._unprotectedHeader},l=Sr($e,new Map([["b64",!0]]),a?.crit,this._protectedHeader,n),p=!0;if(l.has("b64")&&(p=this._protectedHeader.b64,typeof p!="boolean"))throw new $e('The "b64" (base64url-encode payload) Header Parameter must be a boolean');let{alg:u}=n;if(typeof u!="string"||!u)throw new $e('JWS "alg" (Algorithm) Header Parameter missing or invalid');Yt(u,r,"sign");let v=this._payload;p&&(v=Ze.encode(fr(v)));let h;this._protectedHeader?h=Ze.encode(fr(JSON.stringify(this._protectedHeader))):h=Ze.encode("");let g=lr(h,Ze.encode("."),v),w=await Ao(u,r,g),y={signature:fr(w),payload:""};return p&&(y.payload=at.decode(v)),this._unprotectedHeader&&(y.header=this._unprotectedHeader),this._protectedHeader&&(y.protected=at.decode(h)),y}};f(qt,"FlattenedSign");var Zt=class{constructor(r){this._flattened=new qt(r)}setProtectedHeader(r){return this._flattened.setProtectedHeader(r),this}async sign(r,a){let n=await this._flattened.sign(r,a);if(n.payload===void 0)throw new TypeError("use the flattened module for creating JWS with b64: false");return`${n.protected}.${n.payload}.${n.signature}`}};f(Zt,"CompactSign");function At(t,r){if(!Number.isFinite(r))throw new TypeError(`Invalid ${t} input`);return r}f(At,"validateInput");var er=class{constructor(r={}){if(!rt(r))throw new TypeError("JWT Claims Set MUST be an object");this._payload=r}setIssuer(r){return this._payload={...this._payload,iss:r},this}setSubject(r){return this._payload={...this._payload,sub:r},this}setAudience(r){return this._payload={...this._payload,aud:r},this}setJti(r){return this._payload={...this._payload,jti:r},this}setNotBefore(r){return typeof r=="number"?this._payload={...this._payload,nbf:At("setNotBefore",r)}:r instanceof Date?this._payload={...this._payload,nbf:At("setNotBefore",dt(r))}:this._payload={...this._payload,nbf:dt(new Date)+Et(r)},this}setExpirationTime(r){return typeof r=="number"?this._payload={...this._payload,exp:At("setExpirationTime",r)}:r instanceof Date?this._payload={...this._payload,exp:At("setExpirationTime",dt(r))}:this._payload={...this._payload,exp:dt(new Date)+Et(r)},this}setIssuedAt(r){return typeof r>"u"?this._payload={...this._payload,iat:dt(new Date)}:r instanceof Date?this._payload={...this._payload,iat:At("setIssuedAt",dt(r))}:typeof r=="string"?this._payload={...this._payload,iat:At("setIssuedAt",dt(new Date)+Et(r))}:this._payload={...this._payload,iat:At("setIssuedAt",r)},this}};f(er,"ProduceJWT");var Lt=class extends er{setProtectedHeader(r){return this._protectedHeader=r,this}async sign(r,a){let n=new Zt(Ze.encode(JSON.stringify(this._payload)));if(n.setProtectedHeader(this._protectedHeader),Array.isArray(this._protectedHeader?.crit)&&this._protectedHeader.crit.includes("b64")&&this._protectedHeader.b64===!1)throw new lt("JWTs MUST NOT use unencoded payload");return n.sign(r,a)}};f(Lt,"SignJWT");var Ro=Wr(Xr());async function ko(){let t=`\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${atob("QlBC")} Login</title>\n    <style>\n        :root {\n            --color: black;\n            --primary-color: #09639f;\n            --header-color: #09639f; \n            --background-color: #fff;\n            --form-background-color: #f9f9f9;\n            --lable-text-color: #333;\n            --h2-color: #3b3b3b;\n            --border-color: #ddd;\n            --input-background-color: white;\n            --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);\n        }\n        html, body { height: 100%; margin: 0; }\n        body {\n            font-family: system-ui;\n            background-color: var(--background-color);\n            position: relative;\n            overflow: hidden;\n        }\n        body.dark-mode {\n            --color: white;\n            --primary-color: #09639F;\n            --header-color: #3498DB; \n            --background-color: #121212;\n            --form-background-color: #121212;\n            --lable-text-color: #DFDFDF;\n            --h2-color: #D5D5D5;\n            --border-color: #353535;\n            --input-background-color: #252525;\n            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);\n        }\n        html, body { height: 100%; margin: 0; }\n        .container {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            width: 90%;\n        }\n        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        \n        h2 { text-align: center; color: var(--h2-color) }\n        .form-container {\n            background: var(--form-background-color);\n            border: 1px solid var(--border-color);\n            border-radius: 10px;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n            padding: 20px;\n        }\n        .form-control { margin-bottom: 15px; display: flex; align-items: center; }\n        label {\n            display: block;\n            margin-bottom: 5px;\n            padding-right: 20px;\n            font-size: 110%;\n            font-weight: 600;\n            color: var(--lable-text-color);\n        }\n        input[type="text"],\n        input[type="password"] {\n            width: 100%;\n            padding: 10px;\n            border: 1px solid var(--border-color);\n            border-radius: 5px;\n            color: var(--lable-text-color);\n            background-color: var(--input-background-color);\n        }\n        button {\n            display: block;\n            width: 100%;\n            padding: 10px;\n            font-size: 16px;\n            font-weight: 600;\n            border: none;\n            border-radius: 5px;\n            color: white;\n            background-color: var(--primary-color);\n            cursor: pointer;\n            transition: background-color 0.3s ease;\n        }\n        .button:hover,\n        button:focus {\n            background-color: #2980b9;\n            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);\n            transform: translateY(-2px);\n        }\n        button.button:hover { color: white; }\n        .button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }\n        @media only screen and (min-width: 768px) {\n            .container { width: 30%; }\n        }\n    </style>\n    </head>\n    <body>\n        <div class="container">\n            <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> 💦</h1>\n            <div class="form-container">\n                <h2>User Login</h2>\n                <form id="loginForm">\n                    <div class="form-control">\n                        <label for="password">Password</label>\n                        <input type="password" id="password" name="password" required>\n                    </div>\n                    <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>\n                    <button type="submit" class="button">Login</button>\n                </form>\n            </div>\n        </div>\n    <script>\n        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');\n        document.getElementById('loginForm').addEventListener('submit', async (event) => {\n            event.preventDefault();\n            const password = document.getElementById('password').value;\n\n            try {\n                const response = await fetch('/login', {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'text/plain'\n                    },\n                    body: password\n                });\n            \n                if (!response.ok) {\n                    passwordError.textContent = '⚠️ Wrong Password!';\n                    const errorMessage = await response.text();\n                    console.error('Login failed:', errorMessage);\n                    return;\n                }\n                window.location.href = '/panel';\n            } catch (error) {\n                console.error('Error during login:', error);\n            }\n        });\n    <\/script>\n    </body>\n    </html>`;return new Response(t,{status:200,headers:{"Content-Type":"text/html;charset=utf-8","Access-Control-Allow-Origin":globalThis.urlOrigin,"Access-Control-Allow-Methods":"GET, POST","Access-Control-Allow-Headers":"Content-Type, Authorization","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate, no-transform","CDN-Cache-Control":"no-store"}})}f(ko,"renderLoginPage");async function Wa(t,r){let a=await t.text(),n=await r.kv.get("pwd");if(a!==n)return new Response("Method Not Allowed",{status:405});let l=await r.kv.get("secretKey");l||(l=Ha(),await r.kv.put("secretKey",l));let p=(new TextEncoder).encode(l),u=await new Lt({userID:globalThis.userID}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("24h").sign(p);return new Response("Success",{status:200,headers:{"Set-Cookie":`jwtToken=${u}; HttpOnly; Secure; Max-Age=${7*24*60*60}; Path=/; SameSite=Strict`,"Content-Type":"text/plain"}})}f(Wa,"generateJWTToken");function Ha(){let t=Ro.default.randomBytes(32);return Array.from(t,(r=>r.toString(16).padStart(2,"0"))).join("")}f(Ha,"generateSecretKey");async function kt(t,r){try{let a=await r.kv.get("secretKey"),n=(new TextEncoder).encode(a),l=t.headers.get("Cookie")?.match(/(^|;\s*)jwtToken=([^;]*)/),p=l?l[2]:null;if(!p)return console.log("Unauthorized: Token not available!"),!1;let{payload:u}=await Gr(p,n);return console.log(`Successfully authenticated, User ID: ${u.userID}`),!0}catch(a){return console.log(a),!1}}f(kt,"Authenticate");function _o(){return new Response("Success",{status:200,headers:{"Set-Cookie":"jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT","Content-Type":"text/plain"}})}f(_o,"logout");async function Io(t,r){let a=await kt(t,r),n=await r.kv.get("pwd");if(n&&!a)return new Response("Unauthorized!",{status:401});let l=await t.text();return l===n?new Response("Please enter a new Password!",{status:400}):(await r.kv.put("pwd",l),new Response("Success",{status:200,headers:{"Set-Cookie":"jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT","Content-Type":"text/plain"}}))}f(Io,"resetPassword");async function To(t,r){return await kt(t,r)?Response.redirect(`${globalThis.urlOrigin}/panel`,302):t.method==="POST"?await Wa(t,r):await ko()}f(To,"login");async function xt(t,r){let a=await tr(globalThis.hostName),n=r?a.ipv6.map((l=>`[${l}]`)):[];return[globalThis.hostName,"www.speedtest.net",...a.ipv4,...n,...t?t.split(","):[]]}f(xt,"getConfigAddresses");function bt(t,r){let a=r?1:0,n=t[a].account.config;return{warpIPv6:`${n.interface.addresses.v6}/128`,reserved:n.client_id,publicKey:n.peers[0].public_key,privateKey:t[a].privateKey}}f(bt,"extractWireguardParams");function ht(t,r,a,n,l,p){let u,v=p?` ${p}`:"";return n.includes(a)?u="Clean IP":u=De(a)?"Domain":Er(a)?"IPv4":Rt(a)?"IPv6":"",`💦 ${t} - ${l}${v} - ${u} : ${r}`}f(ht,"generateRemark");function gt(t){let r="";for(let a=0;a<t.length;a++)r+=Math.random()<.5?t[a].toUpperCase():t[a];return r}f(gt,"randomUpperCase");function nt(t){let r="",a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=a.length;for(let l=0;l<t;l++)r+=a.charAt(Math.floor(Math.random()*n));return r}f(nt,"getRandomPath");function Pr(t){let r=atob(t);return Array.from(r).map((l=>l.charCodeAt(0).toString(16).padStart(2,"0"))).join("").match(/.{2}/g).map((l=>parseInt(l,16)))}f(Pr,"base64ToDecimal");function Er(t){return/^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(t)}f(Er,"isIPv4");function Rt(t){return/^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\](?:\/(1[0-1][0-9]|12[0-8]|[0-9]?[0-9]))?$/.test(t)}f(Rt,"isIPv6");function Ot(t){let a=new URL(t).hostname,n=De(a);return{host:a,isHostDomain:n}}f(Ot,"getDomain");var Qr=Wr(Xr());async function qr(t){let r=[],a="https://api.cloudflareclient.com/v0a4005/reg",n=[$o(),$o()],l={install_id:"",fcm_token:"",tos:(new Date).toISOString(),type:"Android",model:"PC",locale:"en_US",warp_enabled:!0},p=f((async v=>await(await fetch(a,{method:"POST",headers:{"User-Agent":"insomnia/8.6.1","Content-Type":"application/json"},body:JSON.stringify({...l,key:v.publicKey})})).json()),"fetchAccount");for(let v of n){let h=await p(v);r.push({privateKey:v.privateKey,account:h})}let u=JSON.stringify(r);return await t.kv.put("warpConfigs",u),{error:null,configs:u}}f(qr,"fetchWarpConfigs");var $o=f((()=>{let t=f((p=>btoa(String.fromCharCode.apply(null,p))),"base64Encode"),r=Qr.default.randomBytes(32);r[0]&=248,r[31]&=127,r[31]|=64;let a=Qr.default.scalarMult.base(r),n=t(a),l=t(r);return{publicKey:n,privateKey:l}}),"generateKeyPair");async function qe(t,r){let a,n;try{a=await r.kv.get("proxySettings",{type:"json"}),n=await r.kv.get("warpConfigs",{type:"json"})}catch(l){throw console.log(l),new Error(`An error occurred while getting KV - ${l}`)}if(!a){a=await Ar(t,r);let{error:l,configs:p}=await qr(r,a);if(l)throw new Error(`An error occurred while getting Warp configs - ${l}`);n=p}return globalThis.panelVersion!==a.panelVersion&&(a=await Ar(t,r)),{proxySettings:a,warpConfigs:n}}f(qe,"getDataset");async function Ar(t,r){let a=t.method==="POST"?await t.formData():null,n=a?.get("resetSettings")==="true",l,p=[];if(n)a=null;else{try{l=await r.kv.get("proxySettings",{type:"json"})}catch(k){throw console.log(k),new Error(`An error occurred while getting current KV settings - ${k}`)}let h=a?.getAll("udpXrayNoiseMode")||[],g=a?.getAll("udpXrayNoisePacket")||[],w=a?.getAll("udpXrayNoiseDelayMin")||[],y=a?.getAll("udpXrayNoiseDelayMax")||[],_=a?.getAll("udpXrayNoiseCount")||[];p.push(...h.map(((k,B)=>({type:k,packet:g[B],delay:`${w[B]}-${y[B]}`,count:_[B]}))))}let u=f((h=>{let g=a?.get(h);return g===void 0?null:g==="true"?!0:g==="false"?!1:g}),"validateField"),v={remoteDNS:u("remoteDNS")??l?.remoteDNS??"https://8.8.8.8/dns-query",localDNS:u("localDNS")??l?.localDNS??"8.8.8.8",VLTRFakeDNS:u("VLTRFakeDNS")??l?.VLTRFakeDNS??!1,proxyIP:u("proxyIP")?.replaceAll(" ","")??l?.proxyIP??"",outProxy:u("outProxy")??l?.outProxy??"",outProxyParams:Ka(u("outProxy"))??l?.outProxyParams??{},cleanIPs:u("cleanIPs")?.replaceAll(" ","")??l?.cleanIPs??"",enableIPv6:u("enableIPv6")??l?.enableIPv6??!0,customCdnAddrs:u("customCdnAddrs")?.replaceAll(" ","")??l?.customCdnAddrs??"",customCdnHost:u("customCdnHost")?.trim()??l?.customCdnHost??"",customCdnSni:u("customCdnSni")?.trim()??l?.customCdnSni??"",bestVLTRInterval:u("bestVLTRInterval")??l?.bestVLTRInterval??"30",VLConfigs:u("VLConfigs")??l?.VLConfigs??!0,TRConfigs:u("TRConfigs")??l?.TRConfigs??!1,ports:u("ports")?.split(",")??l?.ports??["443"],lengthMin:u("fragmentLengthMin")??l?.lengthMin??"100",lengthMax:u("fragmentLengthMax")??l?.lengthMax??"200",intervalMin:u("fragmentIntervalMin")??l?.intervalMin??"1",intervalMax:u("fragmentIntervalMax")??l?.intervalMax??"1",fragmentPackets:u("fragmentPackets")??l?.fragmentPackets??"tlshello",bypassLAN:u("bypass-lan")??l?.bypassLAN??!1,bypassIran:u("bypass-iran")??l?.bypassIran??!1,bypassChina:u("bypass-china")??l?.bypassChina??!1,bypassRussia:u("bypass-russia")??l?.bypassRussia??!1,blockAds:u("block-ads")??l?.blockAds??!1,blockPorn:u("block-porn")??l?.blockPorn??!1,blockUDP443:u("block-udp-443")??l?.blockUDP443??!1,customBypassRules:u("customBypassRules")?.replaceAll(" ","")??l?.customBypassRules??"",customBlockRules:u("customBlockRules")?.replaceAll(" ","")??l?.customBlockRules??"",warpEndpoints:u("warpEndpoints")?.replaceAll(" ","")??l?.warpEndpoints??"engage.cloudflareclient.com:2408",warpFakeDNS:u("warpFakeDNS")??l?.warpFakeDNS??!1,warpEnableIPv6:u("warpEnableIPv6")??l?.warpEnableIPv6??!0,bestWarpInterval:u("bestWarpInterval")??l?.bestWarpInterval??"30",xrayUdpNoises:(p.length?JSON.stringify(p):l?.xrayUdpNoises)??JSON.stringify([{type:"base64",packet:btoa(globalThis.userID),delay:"1-1",count:"1"}]),hiddifyNoiseMode:u("hiddifyNoiseMode")??l?.hiddifyNoiseMode??"m4",nikaNGNoiseMode:u("nikaNGNoiseMode")??l?.nikaNGNoiseMode??"quic",noiseCountMin:u("noiseCountMin")??l?.noiseCountMin??"10",noiseCountMax:u("noiseCountMax")??l?.noiseCountMax??"15",noiseSizeMin:u("noiseSizeMin")??l?.noiseSizeMin??"5",noiseSizeMax:u("noiseSizeMax")??l?.noiseSizeMax??"10",noiseDelayMin:u("noiseDelayMin")??l?.noiseDelayMin??"1",noiseDelayMax:u("noiseDelayMax")??l?.noiseDelayMax??"1",panelVersion:globalThis.panelVersion};try{await r.kv.put("proxySettings",JSON.stringify(v)),n&&await Zr(t,r)}catch(h){throw console.log(h),new Error(`An error occurred while updating KV - ${h}`)}return v}f(Ar,"updateDataset");function Ka(t){let r={};if(!t)return{};let a=new URL(t),n=a.protocol.slice(0,-1);if(n===atob("dmxlc3M=")){let l=new URLSearchParams(a.search);r={protocol:n,uuid:a.username,server:a.hostname,port:a.port},l.forEach(((p,u)=>{r[u]=p}))}else r={protocol:n,user:a.username,pass:a.password,server:a.host,port:a.port};return JSON.stringify(r)}f(Ka,"extractChainProxyParams");async function Zr(t,r){if(!await kt(t,r))return new Response("Unauthorized",{status:401});if(t.method==="POST")try{let{error:n}=await qr(r);return n?new Response(n,{status:400}):new Response("Warp configs updated successfully",{status:200})}catch(n){return console.log(n),new Response(`An error occurred while updating Warp configs! - ${n}`,{status:500})}else return new Response("Unsupported request",{status:405})}f(Zr,"updateWarpConfigs");async function Do(t,r){let{remoteDNS:a,localDNS:n,VLTRFakeDNS:l,proxyIP:p,outProxy:u,cleanIPs:v,enableIPv6:h,customCdnAddrs:g,customCdnHost:w,customCdnSni:y,bestVLTRInterval:_,VLConfigs:k,TRConfigs:B,ports:K,lengthMin:V,lengthMax:J,intervalMin:M,intervalMax:H,fragmentPackets:X,warpEndpoints:W,warpFakeDNS:x,warpEnableIPv6:A,bestWarpInterval:D,xrayUdpNoises:E,hiddifyNoiseMode:L,nikaNGNoiseMode:R,noiseCountMin:z,noiseCountMax:P,noiseSizeMin:F,noiseSizeMax:Y,noiseDelayMin:ne,noiseDelayMax:ie,bypassLAN:Ie,bypassIran:Z,bypassChina:fe,bypassRussia:we,blockAds:le,blockPorn:Pe,blockUDP443:se,customBypassRules:Me,customBlockRules:vt}=t,_t=(k?1:0)+(B?1:0),st="",it="";[...globalThis.hostName.includes("workers.dev")?globalThis.defaultHttpPorts:[],...globalThis.defaultHttpsPorts].forEach((Ne=>{let Fe=`port-${Ne}`,et=K.includes(Ne)?"checked":"",ot=`\n            <div class="routing" style="grid-template-columns: 1fr 2fr; margin-right: 10px;">\n                <input type="checkbox" id=${Fe} name=${Ne} onchange="handlePortChange(event)" value="true" ${et}>\n                <label style="margin-bottom: 3px;" for=${Fe}>${Ne}</label>\n            </div>`;globalThis.defaultHttpsPorts.includes(Ne)?it+=ot:st+=ot}));let St="";JSON.parse(E).forEach(((Ne,Fe)=>{St+=`\n            <div id="udp-noise-container-${Fe}" class="udp-noise">\n                <div class="header-container">\n                    <h4 style="margin: 0 5px;">Noise ${Fe+1}</h4>\n                    <button type="button" onclick="deleteUdpNoise(this)" style="background: none; margin: 0; border: none; cursor: pointer;">\n                        <i class="fa fa-minus-circle fa-2x" style="color: var(--button-color);" aria-hidden="true"></i>\n                    </button>      \n                </div>\n                <div class="form-control">\n                    <label for="udpXrayNoiseMode-${Fe}">😵‍💫 v2ray Mode</label>\n                    <div class="input-with-select">\n                        <select id="udpXrayNoiseMode-${Fe}" name="udpXrayNoiseMode">\n                            <option value="base64" ${Ne.type==="base64"?"selected":""}>Base64</option>\n                            <option value="rand" ${Ne.type==="rand"?"selected":""}>Random</option>\n                            <option value="str" ${Ne.type==="str"?"selected":""}>String</option>\n                            <option value="hex" ${Ne.type==="hex"?"selected":""}>Hex</option>\n                        </select>\n                    </div>\n                </div>\n                <div class="form-control">\n                    <label for="udpXrayNoisePacket-${Fe}">📥 Noise Packet</label>\n                    <input type="text" id="udpXrayNoisePacket-${Fe}" name="udpXrayNoisePacket" value="${Ne.packet}">\n                </div>\n                <div class="form-control">\n                    <label for="udpXrayNoiseDelayMin-${Fe}">🕞 Noise Delay</label>\n                    <div class="min-max">\n                        <input type="number" id="udpXrayNoiseDelayMin-${Fe}" name="udpXrayNoiseDelayMin"\n                            value="${Ne.delay.split("-")[0]}" min="1" required>\n                        <span> - </span>\n                        <input type="number" id="udpXrayNoiseDelayMax-${Fe}" name="udpXrayNoiseDelayMax"\n                            value="${Ne.delay.split("-")[1]}" min="1" required>\n                    </div>\n                </div>\n                <div class="form-control">\n                    <label for="udpXrayNoiseCount-${Fe}">🎚️ Noise Count</label>\n                    <input type="number" id="udpXrayNoiseCount-${Fe}" name="udpXrayNoiseCount" value="${Ne.count}" min="1" required>\n                </div>\n            </div>`}));let Ke=f((Ne=>Ne.map((Fe=>`\n        <div>\n            <span class="material-symbols-outlined symbol">verified</span>\n            <span>${Fe}</span>\n        </div>`)).join("")),"supportedApps"),Xe=f(((Ne,Fe,et,ot,Ht,Kt)=>`\n            <button onclick="openQR('${`${Ht?"sing-box://import-remote-profile?url=":""}${Kt?"hiddify://import/":""}https://${globalThis.hostName}/${Ne}/${globalThis.subPath}${Fe?`?app=${Fe}`:""}#${et}`}', '${ot}')" style="margin-bottom: 8px;">\n                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>\n            </button>`),"subQR"),Je=f(((Ne,Fe,et,ot)=>`\n            <button onclick="copyToClipboard('${`${ot?"hiddify://import/":""}https://${globalThis.hostName}/${Ne}/${globalThis.subPath}${Fe?`?app=${Fe}`:""}#${et}`}')">\n                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>\n            </button>`),"subURL"),Tr=`\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <meta name="timestamp" content=${Date.now()}>\n        <title>${atob("QlBC")} Panel ${globalThis.panelVersion}</title>\n        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />\n        <title>Collapsible Sections</title>\n        <style>\n            :root {\n                --color: black;\n                --primary-color: #09639f;\n                --secondary-color: #3498db;\n                --header-color: #09639f; \n                --background-color: #fff;\n                --form-background-color: #f9f9f9;\n                --table-active-color: #f2f2f2;\n                --hr-text-color: #3b3b3b;\n                --lable-text-color: #333;\n                --border-color: #ddd;\n                --button-color: #09639f;\n                --input-background-color: white;\n                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);\n            }\n            body { font-family: Twemoji Country Flags, system-ui; background-color: var(--background-color); color: var(--color) }\n            body.dark-mode {\n                --color: white;\n                --primary-color: #09639F;\n                --secondary-color: #3498DB;\n                --header-color: #3498DB; \n                --background-color: #121212;\n                --form-background-color: #121212;\n                --table-active-color: #252525;\n                --hr-text-color: #D5D5D5;\n                --lable-text-color: #DFDFDF;\n                --border-color: #353535;\n                --button-color: #3498DB;\n                --input-background-color: #252525;\n                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);\n            }\n            .material-symbols-outlined {\n                margin-left: 5px;\n                font-variation-settings:\n                'FILL' 0,\n                'wght' 400,\n                'GRAD' 0,\n                'opsz' 24\n            }\n            details { border-bottom: 1px solid var(--border-color); }\n            summary {\n                font-weight: bold;\n                cursor: pointer;\n                text-align: center;\n                text-wrap: nowrap;\n            }\n            summary::marker { font-size: 1.5rem; color: var(--secondary-color); }\n            summary h2 { display: inline-flex; }\n            h1 { font-size: 2.5em; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }\n            h2,h3 { margin: 30px 0; text-align: center; color: var(--hr-text-color); }\n            hr { border: 1px solid var(--border-color); margin: 20px 0; }\n            .footer {\n                display: flex;\n                font-weight: 600;\n                margin: 10px auto 0 auto;\n                justify-content: center;\n                align-items: center;\n            }\n            .footer button {margin: 0 20px; background: #212121; max-width: fit-content;}\n            .footer button:hover, .footer button:focus { background: #3b3b3b;}\n            .form-control a, a.link { text-decoration: none; }\n            .form-control {\n                margin-bottom: 20px;\n                font-family: Arial, sans-serif;\n                display: flex;\n                flex-direction: column;\n            }\n            .form-control button {\n                background-color: var(--form-background-color);\n                font-size: 1.1rem;\n                font-weight: 600;\n                color: var(--button-color);\n                border-color: var(--primary-color);\n                border: 1px solid;\n            }\n            #apply {display: block; margin-top: 20px;}\n            input.button {font-weight: 600; padding: 15px 0; font-size: 1.1rem;}\n            label {\n                display: block;\n                margin-bottom: 5px;\n                font-size: 110%;\n                font-weight: 600;\n                color: var(--lable-text-color);\n            }\n            input[type="text"],\n            input[type="number"],\n            input[type="url"],\n            textarea,\n            select {\n                width: 100%;\n                text-align: center;\n                padding: 10px;\n                border: 1px solid var(--border-color);\n                border-radius: 5px;\n                font-size: 16px;\n                color: var(--lable-text-color);\n                background-color: var(--input-background-color);\n                box-sizing: border-box;\n                transition: border-color 0.3s ease;\n            }\t\n            input[type="text"]:focus,\n            input[type="number"]:focus,\n            input[type="url"]:focus,\n            textarea:focus,\n            select:focus { border-color: var(--secondary-color); outline: none; }\n            .button,\n            table button {\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                width: 100%;\n                white-space: nowrap;\n                padding: 10px 15px;\n                font-size: 16px;\n                font-weight: 600;\n                letter-spacing: 1px;\n                border: none;\n                border-radius: 5px;\n                color: white;\n                background-color: var(--primary-color);\n                cursor: pointer;\n                outline: none;\n                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n                transition: all 0.3s ease;\n            }\n            input[type="checkbox"] { \n                background-color: var(--input-background-color);\n                style="margin: 0; \n                grid-column: 2;"\n            }\n            table button { margin: auto; width: auto; }\n            .button.disabled {\n                background-color: #ccc;\n                cursor: not-allowed;\n                box-shadow: none;\n                pointer-events: none;\n            }\n            .button:hover,\n            table button:hover,\n            table button:focus {\n                background-color: #2980b9;\n                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);\n                transform: translateY(-2px);\n            }\n            .header-container button:hover {\n                transform: scale(1.1);\n            }\n            button.button:hover { color: white; }\n            .button:active,\n            table button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }\n            .form-container {\n                max-width: 90%;\n                margin: 0 auto;\n                padding: 20px;\n                background: var(--form-background-color);\n                border: 1px solid var(--border-color);\n                border-radius: 10px;\n                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n                margin-bottom: 100px;\n            }\n            .table-container { overflow-x: auto; }\n            table { \n                width: 100%;\n                border: 1px solid var(--border-color);\n                border-collapse: separate;\n                border-spacing: 0; \n                border-radius: 10px;\n                margin-bottom: 20px;\n                overflow: hidden;\n            }\n            th, td { padding: 10px; border-bottom: 1px solid var(--border-color); }\n            td div { display: flex; align-items: center; }\n            th { background-color: var(--secondary-color); color: white; font-weight: bold; font-size: 1.1rem; width: 50%;}\n            td:last-child { background-color: var(--table-active-color); }               \n            tr:hover { background-color: var(--table-active-color); }\n            .modal {\n                display: none;\n                position: fixed;\n                z-index: 1;\n                left: 0;\n                top: 0;\n                width: 100%;\n                height: 100%;\n                overflow: auto;\n                background-color: rgba(0, 0, 0, 0.4);\n            }\n            .modal-content {\n                background-color: var(--form-background-color);\n                margin: auto;\n                padding: 10px 20px 20px;\n                border: 1px solid var(--border-color);\n                border-radius: 10px;\n                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n                width: 80%;\n                position: absolute;\n                top: 50%;\n                left: 50%;\n                transform: translate(-50%, -50%);\n            }\n            .close { color: var(--color); float: right; font-size: 28px; font-weight: bold; }\n            .close:hover,\n            .close:focus { color: black; text-decoration: none; cursor: pointer; }\n            .form-control label {\n                display: block;\n                margin-bottom: 8px;\n                font-size: 110%;\n                font-weight: 600;\n                color: var(--lable-text-color);\n                line-height: 1.3em;\n            }\n            .form-control input[type="password"] {\n                width: 100%;\n                padding: 10px;\n                border: 1px solid var(--border-color);\n                border-radius: 5px;\n                font-size: 16px;\n                color: var(--lable-text-color);\n                background-color: var(--input-background-color);\n                box-sizing: border-box;\n                margin-bottom: 15px;\n                transition: border-color 0.3s ease;\n            }\n            .routing { \n                display: grid;\n                justify-content: flex-start;\n                grid-template-columns: 1fr 1fr 10fr 1fr;\n                margin-bottom: 15px;\n            }\n            .form-control .routing input { grid-column: 2 / 3; }\n            #routing-rules.form-control { display: grid; grid-template-columns: 1fr 1fr; }\n            .routing label {\n                text-align: left;\n                margin: 0 0 0 10px;\n                font-weight: 400;\n                font-size: 100%;\n                text-wrap: nowrap;\n            }\n            .form-control input[type="password"]:focus { border-color: var(--secondary-color); outline: none; }\n            #passwordError { color: red; margin-bottom: 10px; }\n            .symbol { margin-right: 8px; }\n            .modalQR {\n                display: none;\n                position: fixed;\n                z-index: 1;\n                left: 0;\n                top: 0;\n                width: 100%;\n                height: 100%;\n                overflow: auto;\n                background-color: rgba(0, 0, 0, 0.4);\n            }\n            .floating-button {\n                position: fixed;\n                bottom: 20px;\n                left: 20px;\n                background-color: var(--color);\n                color: white;\n                border: none;\n                border-radius: 50%;\n                width: 60px;\n                height: 60px;\n                font-size: 24px;\n                cursor: pointer;\n                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n                transition: background-color 0.3s, transform 0.3s;\n            }\n            .floating-button:hover { transform: scale(1.1); }\n            .min-max { display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline; width: 100%; }\n            .min-max span { text-align: center; white-space: pre; }\n            .input-with-select { width: 100%; }\n            body.dark-mode .floating-button { background-color: var(--color); }\n            body.dark-mode .floating-button:hover { transform: scale(1.1); }\n            #ips th { background-color: var(--hr-text-color); color: var(--background-color); width: unset; }\n            #ips td { background-color: unset; }\n            #ips td:first-child { background-color: var(--table-active-color); }\n            .header-container { display: flex; justify-content: center; margin-bottom: 20px; }\n            .udp-noise { border: 1px solid var(--border-color); border-radius: 15px; padding: 20px; margin-bottom: 10px;}\n            @media only screen and (min-width: 768px) {\n                .form-container { max-width: 70%; }\n                .form-control { \n                    margin-bottom: 15px;\n                    display: grid;\n                    grid-template-columns: 1fr 1fr;\n                    align-items: baseline;\n                    justify-content: flex-end;\n                    font-family: Arial, sans-serif;\n                }\n                #apply { display: block; margin: 20px auto 0 auto; max-width: 50%; }\n                .modal-content { width: 30% }\n                .routing { display: grid; grid-template-columns: 4fr 1fr 3fr 4fr; }\n            }\n        </style>\n    </head>\n    <body>\n        <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> 💦</h1>\n        <div class="form-container">\n            <form id="configForm">\n                <details open>\n                    <summary><h2>${atob("VkxFU1M=")} - ${atob("VFJPSkFO")} ⚙️</h2></summary>\n                    <div class="form-control">\n                        <label for="remoteDNS">🌏 Remote DNS</label>\n                        <input type="url" id="remoteDNS" name="remoteDNS" value="${a}" required>\n                    </div>\n                    <div class="form-control">\n                        <label for="localDNS">🏚️ Local DNS</label>\n                        <input type="text" id="localDNS" name="localDNS" value="${n}"\n                            pattern="^(localhost|(?:\\d{1,3}\\.){3}\\d{1,3})$"\n                            title="Please enter a valid DNS IP Address!"  required>\n                    </div>\n                    <div class="form-control">\n                        <label for="VLTRFakeDNS">🧢 Fake DNS</label>\n                        <div class="input-with-select">\n                            <select id="VLTRFakeDNS" name="VLTRFakeDNS">\n                                <option value="true" ${l?"selected":""}>Enabled</option>\n                                <option value="false" ${l?"":"selected"}>Disabled</option>\n                            </select>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="proxyIP">📍 Proxy IPs / Domains</label>\n                        <input type="text" id="proxyIP" name="proxyIP" value="${p.replaceAll(","," , ")}">\n                    </div>\n                    <div class="form-control">\n                        <label for="outProxy">✈️ Chain Proxy</label>\n                        <input type="text" id="outProxy" name="outProxy" value="${u}">\n                    </div>\n                    <div class="form-control">\n                        <label for="cleanIPs">✨ Clean IPs / Domains</label>\n                        <input type="text" id="cleanIPs" name="cleanIPs" value="${v.replaceAll(","," , ")}">\n                    </div>\n                    <div class="form-control">\n                        <label for="scanner">🔎 Clean IP Scanner</label>\n                        <a href="https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/releases/tag/v2.2.5" name="scanner" target="_blank" style="width: 100%;">\n                            <button type="button" id="scanner" class="button">\n                                Download Scanner\n                                <span class="material-symbols-outlined">open_in_new</span>\n                            </button>\n                        </a>\n                    </div>\n                    <div class="form-control">\n                        <label for="enableIPv6">🔛 IPv6</label>\n                        <div class="input-with-select">\n                            <select id="enableIPv6" name="enableIPv6">\n                                <option value="true" ${h?"selected":""}>Enabled</option>\n                                <option value="false" ${h?"":"selected"}>Disabled</option>\n                            </select>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="customCdnAddrs">💀 Custom CDN Addrs</label>\n                        <input type="text" id="customCdnAddrs" name="customCdnAddrs" value="${g.replaceAll(","," , ")}">\n                    </div>\n                    <div class="form-control">\n                        <label for="customCdnHost">💀 Custom CDN Host</label> \n                        <input type="text" id="customCdnHost" name="customCdnHost" value="${w}">\n                    </div>\n                    <div class="form-control">\n                        <label for="customCdnSni">💀 Custom CDN SNI</label>\n                        <input type="text" id="customCdnSni" name="customCdnSni" value="${y}">\n                    </div>\n                    <div class="form-control">\n                        <label for="bestVLTRInterval">🔄 Best Interval</label>\n                        <input type="number" id="bestVLTRInterval" name="bestVLTRInterval" min="10" max="90" value="${_}">\n                    </div>\n                    <div class="form-control" style="padding-top: 10px;">\n                        <label for="VLConfigs">⚙️ Protocols</label>\n                        <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; align-items: baseline; margin-top: 10px;">\n                            <div style = "display: flex; justify-content: center; align-items: center;">\n                                <input type="checkbox" id="VLConfigs" name="VLConfigs" onchange="handleProtocolChange(event)" value="true" ${k?"checked":""}>\n                                <label for="VLConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">${atob("VkxFU1M=")}</label>\n                            </div>\n                            <div style = "display: flex; justify-content: center; align-items: center;">\n                                <input type="checkbox" id="TRConfigs" name="TRConfigs" onchange="handleProtocolChange(event)" value="true" ${B?"checked":""}>\n                                <label for="TRConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">${atob("VHJvamFu")}</label>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="table-container">\n                        <table id="ports-block">\n                            <tr>\n                                <th style="text-wrap: nowrap; background-color: gray;">Config type</th>\n                                <th style="text-wrap: nowrap; background-color: gray;">Ports</th>\n                            </tr>\n                            <tr>\n                                <td style="text-align: center; font-size: larger;"><b>TLS</b></td>\n                                <td>\n                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${it}</div>\n                                </td>    \n                            </tr>\n                            ${st?`<tr>\n                                <td style="text-align: center; font-size: larger;"><b>Non TLS</b></td>\n                                <td>\n                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${st}</div>\n                                </td>    \n                            </tr>`:""}        \n                        </table>\n                    </div>\n                </details>\n                <details>\n                    <summary><h2>FRAGMENT ⚙️</h2></summary>\t\n                    <div class="form-control">\n                        <label for="fragmentLengthMin">📐 Length</label>\n                        <div class="min-max">\n                            <input type="number" id="fragmentLengthMin" name="fragmentLengthMin" value="${V}" min="10" required>\n                            <span> - </span>\n                            <input type="number" id="fragmentLengthMax" name="fragmentLengthMax" value="${J}" max="500" required>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="fragmentIntervalMin">🕞 Interval</label>\n                        <div class="min-max">\n                            <input type="number" id="fragmentIntervalMin" name="fragmentIntervalMin"\n                                value="${M}" min="1" max="30" required>\n                            <span> - </span>\n                            <input type="number" id="fragmentIntervalMax" name="fragmentIntervalMax"\n                                value="${H}" min="1" max="30" required>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="fragmentPackets">📦 Packets</label>\n                        <div class="input-with-select">\n                            <select id="fragmentPackets" name="fragmentPackets">\n                                <option value="tlshello" ${X==="tlshello"?"selected":""}>tlshello</option>\n                                <option value="1-1" ${X==="1-1"?"selected":""}>1-1</option>\n                                <option value="1-2" ${X==="1-2"?"selected":""}>1-2</option>\n                                <option value="1-3" ${X==="1-3"?"selected":""}>1-3</option>\n                                <option value="1-5" ${X==="1-5"?"selected":""}>1-5</option>\n                            </select>\n                        </div>\n                    </div>\n                </details>\n                <details>\n                    <summary><h2>WARP GENERAL ⚙️</h2></summary>\n                    <div class="form-control">\n                        <label for="warpEndpoints">✨ Endpoints</label>\n                        <input type="text" id="warpEndpoints" name="warpEndpoints" value="${W.replaceAll(","," , ")}" required>\n                    </div>\n                    <div class="form-control">\n                        <label for="endpointScanner" style="line-height: 1.5;">🔎 Scan Endpoint</label>\n                        <button type="button" id="endpointScanner" class="button" style="padding: 10px 0;" onclick="copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/bia-pain-bache/warp-script/refs/heads/main/endip/install.sh)', false)">\n                            Copy Script<span class="material-symbols-outlined">terminal</span>\n                        </button>\n                    </div>\n                    <div class="form-control">\n                        <label for="warpFakeDNS">🧢 Fake DNS</label>\n                        <div class="input-with-select">\n                            <select id="warpFakeDNS" name="warpFakeDNS">\n                                <option value="true" ${x?"selected":""}>Enabled</option>\n                                <option value="false" ${x?"":"selected"}>Disabled</option>\n                            </select>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="warpEnableIPv6">🔛 IPv6</label>\n                        <div class="input-with-select">\n                            <select id="warpEnableIPv6" name="warpEnableIPv6">\n                                <option value="true" ${A?"selected":""}>Enabled</option>\n                                <option value="false" ${A?"":"selected"}>Disabled</option>\n                            </select>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="refreshBtn">♻️ Warp Configs</label>\n                        <button id="refreshBtn" type="button" class="button" style="padding: 10px 0;" onclick="getWarpConfigs()">\n                            Update<span class="material-symbols-outlined">autorenew</span>\n                        </button>\n                    </div>\n                    <div class="form-control">\n                        <label for="bestWarpInterval">🔄 Best Interval</label>\n                        <input type="number" id="bestWarpInterval" name="bestWarpInterval" min="10" max="90" value="${D}">\n                    </div>\n                    <div class="form-control">\n                        <label for="dlConfigsBtn">📥 Download Warp Configs</label>\n                        <button id="dlConfigsBtn" type="button" class="button" style="padding: 10px 0;">\n                            Download<span class="material-symbols-outlined">download</span>\n                        </button>\n                    </div>\n                </details>\n                <details>\n                    <summary><h2>WARP PRO ⚙️</h2></summary>\n                    <div class="header-container">\n                        <h3 style="margin: 0 5px;">V2RAYNG - V2RAYN</h3>\n                        <button type="button" id="add-udp-noise" onclick="addUdpNoise()" style="background: none; margin: 0; border: none; cursor: pointer;">\n                            <i class="fa fa-plus-circle fa-2x" style="color: var(--button-color);" aria-hidden="true"></i>\n                        </button>       \n                    </div>\n                    <div id="udp-noise-container">\n                        ${St}\n                    </div>\n                    <h3>MAHSANG - NIKANG - HIDDIFY 🔧</h3>\n                    <div class="form-control">\n                        <label for="hiddifyNoiseMode">😵‍💫 Hiddify Mode</label>\n                        <input type="text" id="hiddifyNoiseMode" name="hiddifyNoiseMode" \n                            pattern="^(m[1-6]|h_[0-9A-Fa-f]{2}|g_([0-9A-Fa-f]{2}_){2}[0-9A-Fa-f]{2})$" \n                            title="Enter 'm1-m6', 'h_HEX', 'g_HEX_HEX_HEX' which HEX can be between 00 to ff"\n                            value="${L}" required>\n                    </div>\n                    <div class="form-control">\n                        <label for="nikaNGNoiseMode">😵‍💫 NikaNG Mode</label>\n                        <input type="text" id="nikaNGNoiseMode" name="nikaNGNoiseMode" \n                            pattern="^(none|quic|random|[0-9A-Fa-f]+)$" \n                            title="Enter 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'"\n                            value="${R}" required>\n                    </div>\n                    <div class="form-control">\n                        <label for="noiseCountMin">🎚️ Noise Count</label>\n                        <div class="min-max">\n                            <input type="number" id="noiseCountMin" name="noiseCountMin"\n                                value="${z}" min="1" required>\n                            <span> - </span>\n                            <input type="number" id="noiseCountMax" name="noiseCountMax"\n                                value="${P}" min="1" required>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="noiseSizeMin">📏 Noise Size</label>\n                        <div class="min-max">\n                            <input type="number" id="noiseSizeMin" name="noiseSizeMin"\n                                value="${F}" min="1" required>\n                            <span> - </span>\n                            <input type="number" id="noiseSizeMax" name="noiseSizeMax"\n                                value="${Y}" min="1" required>\n                        </div>\n                    </div>\n                    <div class="form-control">\n                        <label for="noiseDelayMin">🕞 Noise Delay</label>\n                        <div class="min-max">\n                            <input type="number" id="noiseDelayMin" name="noiseDelayMin"\n                                value="${ne}" min="1" required>\n                            <span> - </span>\n                            <input type="number" id="noiseDelayMax" name="noiseDelayMax"\n                                value="${ie}" min="1" required>\n                        </div>\n                    </div>\n                </details>\n                <details>\n                    <summary><h2>ROUTING RULES ⚙️</h2></summary>\n                    <div id="routing-rules" class="form-control" style="margin-bottom: 20px;">\t\t\t\n                        <div class="routing">\n                            <input type="checkbox" id="bypass-lan" name="bypass-lan" value="true" ${Ie?"checked":""}>\n                            <label for="bypass-lan">Bypass LAN</label>\n                        </div>\n                        <div class="routing">\n                            <input type="checkbox" id="block-ads" name="block-ads" value="true" ${le?"checked":""}>\n                            <label for="block-ads">Block Ads.</label>\n                        </div>\n                        <div class="routing">\n                            <input type="checkbox" id="bypass-iran" name="bypass-iran" value="true" ${Z?"checked":""}>\n                            <label for="bypass-iran">Bypass Iran</label>\n                        </div>\n                        <div class="routing">\n                            <input type="checkbox" id="block-porn" name="block-porn" value="true" ${Pe?"checked":""}>\n                            <label for="block-porn">Block Porn</label>\n                        </div>\n                        <div class="routing">\n                            <input type="checkbox" id="bypass-china" name="bypass-china" value="true" ${fe?"checked":""}>\n                            <label for="bypass-china">Bypass China</label>\n                        </div>\n                        <div class="routing">\n                            <input type="checkbox" id="block-udp-443" name="block-udp-443" value="true" ${se?"checked":""}>\n                            <label for="block-udp-443">Block QUIC</label>\n                        </div>\n                        <div class="routing">\n                            <input type="checkbox" id="bypass-russia" name="bypass-russia" value="true" ${we?"checked":""}>\n                            <label for="bypass-russia">Bypass Russia</label>\n                        </div>\n                    </div>\n                    <h3>CUSTOM RULES 🔧</h3>\n                    <div class="form-control">\n                        <label for="customBypassRules">🟩 Bypass IPs / Domains</label>\n                        <input type="text" id="customBypassRules" name="customBypassRules" value="${Me.replaceAll(","," , ")}">\n                    </div>\n                    <div class="form-control">\n                        <label for="customBlockRules">🟥 Block IPs / Domains</label>\n                        <input type="text" id="customBlockRules" name="customBlockRules" value="${vt.replaceAll(","," , ")}">\n                    </div>\n                </details>\n                <div id="apply" class="form-control">\n                    <div style="grid-column: 2; width: 100%; display: inline-flex;">\n                        <input type="submit" id="applyButton" style="margin-right: 10px;" class="button disabled" value="APPLY SETTINGS 💥" form="configForm">\n                        <button type="button" id="resetSettings" style="background: none; margin: 0; border: none; cursor: pointer;">\n                            <i class="fa fa-refresh fa-2x fa-border" style="border-radius: .2em; border-color: var(--border-color);" aria-hidden="true"></i>\n                        </button>\n                    </div>\n                </div>\n            </form>\n            <hr>            \n            <h2>🔗 NORMAL SUB</h2>\n            <div class="table-container">\n                <table id="normal-configs-table">\n                    <tr>\n                        <th>Application</th>\n                        <th>Subscription</th>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["v2rayNG","NikaNG","MahsaNG","v2rayN","v2rayN-PRO","Shadowrocket","Streisand","Hiddify","Nekoray (Xray)"])}\n                        </td>\n                        <td>\n                            ${Xe("sub","",`${atob("QlBC")}-Normal`,"Normal Subscription")}\n                            ${Je("sub","",`${atob("QlBC")}-Normal`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["husi","Nekobox","Nekoray (sing-Box)","Karing"])}\n                        </td>\n                        <td>\n                            ${Je("sub","singbox",`${atob("QlBC")}-Normal`)}\n                        </td>\n                    </tr>\n                </table>\n            </div>\n            <h2>🔗 FULL NORMAL SUB</h2>\n            <div class="table-container">\n                <table id="full-normal-configs-table">\n                    <tr>\n                        <th>Application</th>\n                        <th>Subscription</th>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["v2rayNG","NikaNG","MahsaNG","v2rayN","v2rayN-PRO","Streisand"])}\n                        </td>\n                        <td>\n                            ${Xe("sub","xray",`${atob("QlBC")}-Full-Normal`,"Full normal Subscription")}\n                            ${Je("sub","xray",`${atob("QlBC")}-Full-Normal`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["sing-box","v2rayN (sing-box)"])}\n                        </td>\n                        <td>\n                            ${Xe("sub","sfa",`${atob("QlBC")}-Full-Normal`,"Full normal Subscription",!0)}\n                            ${Je("sub","sfa",`${atob("QlBC")}-Full-Normal`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["Clash Meta","Clash Verge","FlClash","Stash","v2rayN (mihomo)"])}\n                        </td>\n                        <td>\n                            ${Xe("sub","clash",`${atob("QlBC")}-Full-Normal`,"Full normal Subscription")}\n                            ${Je("sub","clash",`${atob("QlBC")}-Full-Normal`)}\n                        </td>\n                    </tr>\n                </table>\n            </div>\n            <h2>🔗 FRAGMENT SUB</h2>\n            <div class="table-container">\n                <table id="frag-sub-table">\n                    <tr>\n                        <th style="text-wrap: nowrap;">Application</th>\n                        <th style="text-wrap: nowrap;">Subscription</th>\n                    </tr>\n                    <tr>\n                        <td style="text-wrap: nowrap;">\n                            ${Ke(["v2rayNG","NikaNG","MahsaNG","v2rayN","v2rayN-PRO","Streisand"])}\n                        </td>\n                        <td>\n                            ${Xe("fragsub","",`${atob("QlBC")}-Fragment`,"Fragment Subscription")}\n                            ${Je("fragsub","",`${atob("QlBC")}-Fragment`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td style="text-wrap: nowrap;">\n                            ${Ke(["Hiddify"])}\n                        </td>\n                        <td>\n                            ${Xe("fragsub","hiddify-frag",`${atob("QlBC")}-Fragment`,"Fragment Subscription",!1,!0)}\n                            ${Je("fragsub","hiddify-frag",`${atob("QlBC")}-Fragment`,!0)}\n                        </td>\n                    </tr>\n                </table>\n            </div>\n            <h2>🔗 WARP SUB</h2>\n            <div class="table-container">\n                <table id="normal-configs-table">\n                    <tr>\n                        <th>Application</th>\n                        <th>Subscription</th>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["v2rayNG","v2rayN","Streisand"])}\n                        </td>\n                        <td>\n                            ${Xe("warpsub","xray",`${atob("QlBC")}-Warp`,"Warp Subscription")}\n                            ${Je("warpsub","xray",`${atob("QlBC")}-Warp`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["sing-box","v2rayN (sing-box)"])}\n                        </td>\n                        <td>\n                            ${Xe("sub","singbox",`${atob("QlBC")}-Warp`,"Warp Subscription",!0)}\n                            ${Je("warpsub","singbox",`${atob("QlBC")}-Warp`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["Hiddify"])}\n                        </td>\n                        <td>\n                            ${Xe("warpsub","hiddify",`${atob("QlBC")}-Warp`,"Warp Pro Subscription",!1,!0)}\n                            ${Je("warpsub","hiddify",`${atob("QlBC")}-Warp`,!0)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["Clash Meta","Clash Verge","FlClash","Stash","v2rayN (mihomo)"])}\n                        </td>\n                        <td>\n                            ${Xe("warpsub","clash",`${atob("QlBC")}-Warp`,"Warp Subscription")}\n                            ${Je("warpsub","clash",`${atob("QlBC")}-Warp`)}\n                        </td>\n                    </tr>\n                </table>\n            </div>\n            <h2>🔗 WARP PRO SUB</h2>\n            <div class="table-container">\n                <table id="warp-pro-configs-table">\n                    <tr>\n                        <th>Application</th>\n                        <th>Subscription</th>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["v2rayNG","v2rayN"])}\n                        </td>\n                        <td>\n                            ${Xe("warpsub","xray-pro",`${atob("QlBC")}-Warp-Pro`,"Warp Pro Subscription")}\n                            ${Je("warpsub","xray-pro",`${atob("QlBC")}-Warp-Pro`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["NikaNG","MahsaNG","v2rayN-PRO"])}\n                        </td>\n                        <td>\n                            ${Xe("warpsub","nikang",`${atob("QlBC")}-Warp-Pro`,"Warp Pro Subscription")}\n                            ${Je("warpsub","nikang",`${atob("QlBC")}-Warp-Pro`)}\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>\n                            ${Ke(["Hiddify"])}\n                        </td>\n                        <td>\n                            ${Xe("warpsub","hiddify-pro",`${atob("QlBC")}-Warp-Pro`,"Warp Pro Subscription",!1,!0)}\n                            ${Je("warpsub","hiddify-pro",`${atob("QlBC")}-Warp-Pro`,!0)}\n                        </td>\n                    </tr>\n                </table>\n            </div>\n            <div id="myModal" class="modal">\n                <div class="modal-content">\n                    <span class="close">&times;</span>\n                    <form id="passwordChangeForm">\n                        <h2>Change Password</h2>\n                        <div class="form-control">\n                            <label for="newPassword">New Password</label>\n                            <input type="password" id="newPassword" name="newPassword" required>\n                            </div>\n                        <div class="form-control">\n                            <label for="confirmPassword">Confirm Password</label>\n                            <input type="password" id="confirmPassword" name="confirmPassword" required>\n                        </div>\n                        <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>\n                        <button id="changePasswordBtn" type="submit" class="button">Change Password</button>\n                    </form>\n                </div>\n            </div>\n            <div id="myQRModal" class="modalQR">\n                <div class="modal-content" style="width: auto; text-align: center;">\n                    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">\n                        <span id="closeQRModal" class="close" style="align-self: flex-end;">&times;</span>\n                        <span id="qrcodeTitle" style="align-self: center; font-weight: bold;"></span>\n                    </div>\n                    <div id="qrcode-container"></div>\n                </div>\n            </div>\n            <hr>\n            <div class="header-container">\n                <h2 style="margin: 0 5px;">💡 MY IP</h2>\n                <button type="button" id="refresh-geo-location" onclick="fetchIPInfo()" style="background: none; margin: 0; border: none; cursor: pointer;">\n                    <i class="fa fa-refresh fa-2x" style="color: var(--button-color);" aria-hidden="true"></i>\n                </button>       \n            </div>\n            <div class="table-container">\n                <table id="ips" style="text-align: center; margin-bottom: 15px; text-wrap-mode: nowrap;">\n                    <tr>\n                        <th>Target Address</th>\n                        <th>IP</th>\n                        <th>Country</th>\n                        <th>City</th>\n                        <th>ISP</th>\n                    </tr>\n                    <tr>\n                        <td>Cloudflare CDN</td>\n                        <td id="cf-ip"></td>\n                        <td><b id="cf-country"></b></td>\n                        <td><b id="cf-city"></b></td>\n                        <td><b id="cf-isp"></b></td>\n                    </tr>\n                    <tr>\n                        <td>Others</td>\n                        <td id="ip"></td>\n                        <td><b id="country"></b></td>\n                        <td><b id="city"></b></td>\n                        <td><b id="isp"></b></td>\n                    </tr>\n                </table>\n            </div>\n            <hr>\n            <div class="footer">\n                <i class="fa fa-github" style="font-size:36px; margin-right: 10px;"></i>\n                <a class="link" href="https://github.com/bia-pain-bache/${atob("QlBC")}-Worker-Panel" style="color: var(--color); text-decoration: underline;" target="_blank">Github</a>\n                <button id="openModalBtn" class="button">Change Password</button>\n                <button type="button" id="logout" style="background: none; color: var(--color); margin: 0; border: none; cursor: pointer;">\n                    <i class="fa fa-power-off fa-2x" aria-hidden="true"></i>\n                </button>\n            </div>\n        </div>\n        <button id="darkModeToggle" class="floating-button">\n            <i id="modeIcon" class="fa fa-2x fa-adjust" style="color: var(--background-color);" aria-hidden="true"></i>\n        </button>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"><\/script>\n    <script type="module" defer>\n        import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";\n        polyfillCountryFlagEmojis();\n    <\/script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>\n    <script>\n        const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];\n        let activePortsNo = ${K.length};\n        let activeHttpsPortsNo = ${K.filter((Ne=>globalThis.defaultHttpsPorts.includes(Ne))).length};\n        let activeProtocols = ${_t};\n        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');\n\n        document.addEventListener('DOMContentLoaded', async () => {\n            const configForm = document.getElementById('configForm');            \n            const changePass = document.getElementById('openModalBtn');\n            const closeBtn = document.querySelector(".close");\n            const passwordChangeForm = document.getElementById('passwordChangeForm');                    \n            const initialFormData = new FormData(configForm);\n            const modal = document.getElementById('myModal');\n            const closeQR = document.getElementById('closeQRModal');\n            const resetSettings = document.getElementById('resetSettings');\n            let modalQR = document.getElementById('myQRModal');\n            let qrcodeContainer = document.getElementById('qrcode-container');\n            let forcedPassChange = false;\n            const darkModeToggle = document.getElementById('darkModeToggle');\n                    \n            const hasFormDataChanged = () => {\n                const currentFormData = new FormData(configForm);\n                const currentFormDataEntries = [...currentFormData.entries()];\n\n                const nonCheckboxFieldsChanged = currentFormDataEntries.some(\n                    ([key, value]) => !initialFormData.has(key) || initialFormData.get(key) !== value\n                );\n\n                const checkboxFieldsChanged = Array.from(configForm.elements)\n                    .filter((element) => element.type === 'checkbox')\n                    .some((checkbox) => {\n                    const initialValue = initialFormData.has(checkbox.name)\n                        ? initialFormData.get(checkbox.name)\n                        : false;\n                    const currentValue = currentFormDataEntries.find(([key]) => key === checkbox.name)?.[1] || false;\n                    return initialValue !== currentValue;\n                });\n\n                return nonCheckboxFieldsChanged || checkboxFieldsChanged;\n            };\n            \n            const enableApplyButton = () => {\n                const isChanged = hasFormDataChanged();\n                applyButton.disabled = !isChanged;\n                applyButton.classList.toggle('disabled', !isChanged);\n            };\n                        \n            passwordChangeForm.addEventListener('submit', event => resetPassword(event));\n            document.getElementById('logout').addEventListener('click', event => logout(event));\n            configForm.addEventListener('submit', (event) => applySettings(event, configForm));\n            configForm.addEventListener('input', enableApplyButton);\n            configForm.addEventListener('change', enableApplyButton);\n            changePass.addEventListener('click', () => {\n                forcedPassChange ? closeBtn.style.display = 'none' : closeBtn.style.display = '';\n                modal.style.display = "block";\n                document.body.style.overflow = "hidden";\n                forcedPassChange = false;\n            });        \n            closeBtn.addEventListener('click', () => {\n                modal.style.display = "none";\n                document.body.style.overflow = "";\n            });\n            closeQR.addEventListener('click', () => {\n                modalQR.style.display = "none";\n                qrcodeContainer.lastElementChild.remove();\n            });\n            resetSettings.addEventListener('click', async () => {\n                const confirmReset = confirm('⚠️ This will reset all panel settings.\\nAre you sure?');\n                if(!confirmReset) return;\n                const formData = new FormData();\n                formData.append('resetSettings', 'true');\n                try {\n                    document.body.style.cursor = 'wait';\n                    const refreshButtonVal = refreshBtn.innerHTML;\n                    refreshBtn.innerHTML = '⌛ Loading...';\n\n                    const response = await fetch('/panel', {\n                        method: 'POST',\n                        body: formData,\n                        credentials: 'include'\n                    });\n\n                    document.body.style.cursor = 'default';\n                    refreshBtn.innerHTML = refreshButtonVal;\n                    if (!response.ok) {\n                        const errorMessage = await response.text();\n                        console.error(errorMessage, response.status);\n                        alert('⚠️ An error occured, Please try again!\\n⛔ ' + errorMessage);\n                        return;\n                    }       \n                    alert('✅ Panel settings reset to default successfully! 😎');\n                    window.location.reload(true);\n                } catch (error) {\n                    console.error('Error:', error);\n                }\n            });\n            window.onclick = (event) => {\n                if (event.target == modalQR) {\n                    modalQR.style.display = "none";\n                    qrcodeContainer.lastElementChild.remove();\n                }\n            }\n            darkModeToggle.addEventListener('click', () => {\n                const isDarkMode = document.body.classList.toggle('dark-mode');\n                localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');\n            });\n\n            document.getElementById("dlConfigsBtn").addEventListener("click", async function () {\n                try {\n                    const response = await fetch("/get-warp-configs");\n                    const configs = await response.json();\n                    const zip = new JSZip();\n                    configs.forEach( (config, index) => {\n                        zip.file('BPB-Warp-' + String(index + 1) + '.conf', config);\n                    });\n\n                    zip.generateAsync({ type: "blob" }).then(function (blob) {\n                        const link = document.createElement("a");\n                        link.href = URL.createObjectURL(blob);\n                        link.download = "BPB Warp configs.zip";\n                        document.body.appendChild(link);\n                        link.click();\n                        document.body.removeChild(link);\n                    });\n                } catch (error) {\n                    console.error("Error fetching configs:", error);\n                }\n            });\n\n            const isPassSet = ${r};\n            if (!isPassSet) {\n                forcedPassChange = true;\n                changePass.click();\n            }\n\n            await fetchIPInfo();\n        });\n\n        const fetchIPInfo = async () => {\n            const updateUI = (ip = '-', country = '-', countryCode = '-', city = '-', isp = '-', cfIP) => {\n                const flag = countryCode !== '-' ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';\n                document.getElementById(cfIP ? 'cf-ip' : 'ip').textContent = ip;\n                document.getElementById(cfIP ? 'cf-country' : 'country').textContent = country + ' ' + flag;\n                document.getElementById(cfIP ? 'cf-city' : 'city').textContent = city;\n                document.getElementById(cfIP ? 'cf-isp' : 'isp').textContent = isp;\n            };\n\n            const refreshIcon = document.getElementById("refresh-geo-location").querySelector('i');\n            refreshIcon.classList.add('fa-spin');\n            document.body.style.cursor = 'wait';\n\n            try {\n                const ipResponse = await fetch('https://ipwho.is/' + '?nocache=' + Date.now(), { cache: "no-store" });\n                const ipResponseObj = await ipResponse.json();\n                const geoResponse = await fetch('/my-ip', { \n                    method: 'POST',\n                    body: ipResponseObj.ip\n                });\n                const ipGeoLocation = await geoResponse.json();\n                updateUI(ipResponseObj.ip, ipGeoLocation.country, ipGeoLocation.countryCode, ipGeoLocation.city, ipGeoLocation.isp);\n                const cfIPresponse = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });\n                const cfIP = await cfIPresponse.text();\n                const cfGeoResponse = await fetch('/my-ip', { \n                    method: 'POST',\n                    body: cfIP.trim()\n                });\n                const cfIPGeoLocation = await cfGeoResponse.json();\n                updateUI(cfIP, cfIPGeoLocation.country, cfIPGeoLocation.countryCode, cfIPGeoLocation.city, cfIPGeoLocation.isp, true);\n                refreshIcon.classList.remove('fa-spin');\n                document.body.style.cursor = 'default';\n            } catch (error) {\n                console.error('Error fetching IP address:', error);\n            }\n        }\n\n        const addUdpNoise = () => {\n            const container = document.getElementById("udp-noise-container");\n            const noiseBlock = document.getElementById("udp-noise-container-0");\n            const index = container.children.length;\n            const clone = noiseBlock.cloneNode(true);\n            clone.querySelector("h4").textContent = "Noise " + String(index + 1);\n            container.appendChild(clone);\n            document.getElementById("configForm").dispatchEvent(new Event("change"));\n        }\n        \n        const deleteUdpNoise = (button) => {\n            const container = document.getElementById("udp-noise-container");\n            if (container.children.length === 1) {\n                alert('⛔ You cannot delete all noises!');\n                return;\n            }   \n            const confirmReset = confirm('⚠️ This will delete the noise.\\nAre you sure?');\n            if(!confirmReset) return;\n            button.closest(".udp-noise").remove();\n            document.getElementById("configForm").dispatchEvent(new Event("change"));\n        }\n\n        const getWarpConfigs = async () => {\n            const confirmReset = confirm('⚠️ Are you sure?');\n            if(!confirmReset) return;\n            const refreshBtn = document.getElementById('refreshBtn');\n\n            try {\n                document.body.style.cursor = 'wait';\n                const refreshButtonVal = refreshBtn.innerHTML;\n                refreshBtn.innerHTML = '⌛ Loading...';\n\n                const response = await fetch('/update-warp', {\n                    method: 'POST',\n                    credentials: 'include'\n                });\n\n                document.body.style.cursor = 'default';\n                refreshBtn.innerHTML = refreshButtonVal;\n                if (!response.ok) {\n                    const errorMessage = await response.text();\n                    console.error(errorMessage, response.status);\n                    alert('⚠️ An error occured, Please try again!\\n⛔ ' + errorMessage);\n                    return;\n                }          \n                alert('✅ Warp configs updated successfully! 😎');\n            } catch (error) {\n                console.error('Error:', error);\n            } \n        }\n\n        const handlePortChange = (event) => {\n            \n            if(event.target.checked) { \n                activePortsNo++ \n                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo++;\n            } else {\n                activePortsNo--;\n                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo--;\n            }\n\n            if (activePortsNo === 0) {\n                event.preventDefault();\n                event.target.checked = !event.target.checked;\n                alert("⛔ At least one port should be selected! 🫤");\n                activePortsNo = 1;\n                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo++;\n                return false;\n            }\n                \n            if (activeHttpsPortsNo === 0) {\n                event.preventDefault();\n                event.target.checked = !event.target.checked;\n                alert("⛔ At least one TLS(https) port should be selected! 🫤");\n                activeHttpsPortsNo = 1;\n                return false;\n            }\n        }\n        \n        const handleProtocolChange = (event) => {\n            \n            if(event.target.checked) { \n                activeProtocols++ \n            } else {\n                activeProtocols--;\n            }\n\n            if (activeProtocols === 0) {\n                event.preventDefault();\n                event.target.checked = !event.target.checked;\n                alert("⛔ At least one Protocol should be selected! 🫤");\n                activeProtocols = 1;\n                return false;\n            }\n        }\n\n        const openQR = (url, title) => {\n            let qrcodeContainer = document.getElementById("qrcode-container");\n            let qrcodeTitle = document.getElementById("qrcodeTitle");\n            const modalQR = document.getElementById("myQRModal");\n            qrcodeTitle.textContent = title;\n            modalQR.style.display = "block";\n            let qrcodeDiv = document.createElement("div");\n            qrcodeDiv.className = "qrcode";\n            qrcodeDiv.style.padding = "2px";\n            qrcodeDiv.style.backgroundColor = "#ffffff";\n            new QRCode(qrcodeDiv, {\n                text: url,\n                width: 256,\n                height: 256,\n                colorDark: "#000000",\n                colorLight: "#ffffff",\n                correctLevel: QRCode.CorrectLevel.H\n            });\n            qrcodeContainer.appendChild(qrcodeDiv);\n        }\n\n        const copyToClipboard = (text) => {\n            const textarea = document.createElement('textarea');\n            textarea.value = text;\n            document.body.appendChild(textarea);\n            textarea.select();\n            document.execCommand('copy');\n            document.body.removeChild(textarea);\n            alert('📋 Copied to clipboard:\\n\\n' +  text);\n        }\n\n        const applySettings = async (event, configForm) => {\n            event.preventDefault();\n            event.stopPropagation();\n            const applyButton = document.getElementById('applyButton');\n            const getValue = (id) => parseInt(document.getElementById(id).value, 10);              \n            const lengthMin = getValue('fragmentLengthMin');\n            const lengthMax = getValue('fragmentLengthMax');\n            const intervalMin = getValue('fragmentIntervalMin');\n            const intervalMax = getValue('fragmentIntervalMax');\n            const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split(',').filter(addr => addr !== '');\n            const customCdnHost = document.getElementById('customCdnHost').value;\n            const customCdnSni = document.getElementById('customCdnSni').value;\n            const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';\n            const warpEndpoints = document.getElementById('warpEndpoints').value?.replaceAll(' ', '').split(',');\n            const noiseCountMin = getValue('noiseCountMin');\n            const noiseCountMax = getValue('noiseCountMax');\n            const noiseSizeMin = getValue('noiseSizeMin');\n            const noiseSizeMax = getValue('noiseSizeMax');\n            const noiseDelayMin = getValue('noiseDelayMin');\n            const noiseDelayMax = getValue('noiseDelayMax');\n            const cleanIPs = document.getElementById('cleanIPs').value?.split(',');\n            const proxyIPs = document.getElementById('proxyIP').value?.split(',');\n            const chainProxy = document.getElementById('outProxy').value?.trim();\n            const customBypassRules = document.getElementById('customBypassRules').value?.split(',');                    \n            const customBlockRules = document.getElementById('customBlockRules').value?.split(',');                    \n            const formData = new FormData(configForm);\n            const is${atob("Vmxlc3M=")} = /${atob("dmxlc3M=")}:\\/\\/[^s@]+@[^\\s:]+:[^\\s]+/.test(chainProxy);\n            const isSocksHttp = /^(http|socks):\\/\\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\\d+)$/.test(chainProxy);\n            const hasSecurity = /security=/.test(chainProxy);\n            const securityRegex = /security=(tls|none|reality)/;\n            const validSecurityType = securityRegex.test(chainProxy);\n            let match = chainProxy.match(securityRegex);\n            const securityType = match ? match[1] : null;\n            match = chainProxy.match(/:(\\d+)\\?/);\n            const ${atob("dmxlc3M=")}Port = match ? match[1] : null;\n            const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);\n            const validIPDomain = /^((?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,})|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?:\\/(?:\\d|[12]\\d|3[0-2]))?|\\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\\](?:\\/(?:12[0-8]|1[0-1]\\d|[0-9]?\\d))?)$/i;\n            const validEndpoint = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[::(?::[a-fA-F0-9]{1,4}){0,7}\\]):(?:[0-9]{1,5})$/;\n            const checkedPorts = Array.from(document.querySelectorAll('input[id^="port-"]:checked')).map(input => input.id.split('-')[1]);\n            formData.append('ports', checkedPorts);\n            configForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {\n                !formData.has(checkbox.name) && formData.append(checkbox.name, 'false');    \n            });\n            const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;\n            const udpNoiseModes = formData.getAll('udpXrayNoiseMode') || [];\n            const udpNoisePackets = formData.getAll('udpXrayNoisePacket') || [];\n            const udpNoiseDelaysMin = formData.getAll('udpXrayNoiseDelayMin') || [];\n            const udpNoiseDelaysMax = formData.getAll('udpXrayNoiseDelayMax') || [];\n\n            const invalidIPs = [...cleanIPs, ...proxyIPs, ...customCdnAddrs, ...customBypassRules, ...customBlockRules, customCdnHost, customCdnSni]?.filter(value => {\n                if (value) {\n                    const trimmedValue = value.trim();\n                    return !validIPDomain.test(trimmedValue);\n                }\n            });\n\n            const invalidEndpoints = warpEndpoints?.filter(value => {\n                if (value) {\n                    const trimmedValue = value.trim();\n                    return !validEndpoint.test(trimmedValue);\n                }\n            });\n\n            if (invalidIPs.length) {\n                alert('⛔ Invalid IPs or Domains 🫤\\n\\n' + invalidIPs.map(ip => '⚠️ ' + ip).join('\\n'));\n                return false;\n            }\n            \n            if (invalidEndpoints.length) {\n                alert('⛔ Invalid endpoint 🫤\\n\\n' + invalidEndpoints.map(endpoint => '⚠️ ' + endpoint).join('\\n'));\n                return false;\n            }\n\n            if (lengthMin >= lengthMax || intervalMin > intervalMax || noiseCountMin > noiseCountMax || noiseSizeMin > noiseSizeMax || noiseDelayMin > noiseDelayMax) {\n                alert('⛔ Minimum should be smaller or equal to Maximum! 🫤');               \n                return false;\n            }\n\n            if (!(is${atob("Vmxlc3M=")} && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {\n                alert('⛔ Invalid Config! 🫤 \\n - The chain proxy should be ${atob("VkxFU1M=")}, Socks or Http!\\n - ${atob("VkxFU1M=")} transmission should be GRPC,WS or TCP\\n - ${atob("VkxFU1M=")} security should be TLS,Reality or None\\n - socks or http should be like:\\n + (socks or http)://user:pass@host:port\\n + (socks or http)://host:port');               \n                return false;\n            }\n\n            if (is${atob("Vmxlc3M=")} && securityType === 'tls' && ${atob("dmxlc3M=")}Port !== '443') {\n                alert('⛔ ${atob("VkxFU1M=")} TLS port can be only 443 to be used as a proxy chain! 🫤');               \n                return false;\n            }\n\n            if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {\n                alert('⛔ All "Custom" fields should be filled or deleted together! 🫤');               \n                return false;\n            }\n            \n            let submisionError = false;\n            for (const [index, mode] of udpNoiseModes.entries()) {\n                if (udpNoiseDelaysMin[index] > udpNoiseDelaysMax[index]) {\n                    alert('⛔ The minimum noise delay should be smaller or equal to maximum! 🫤');\n                    submisionError = true;\n                    break;\n                }\n                \n                switch (mode) {\n                    case 'base64':\n                        if (!base64Regex.test(udpNoisePackets[index])) {\n                            alert('⛔ The Base64 noise packet is not a valid base64 value! 🫤');\n                            submisionError = true;\n                        }\n                        break;\n    \n                    case 'rand':\n                        if (!(/^\\d+-\\d+$/.test(udpNoisePackets[index]))) {\n                            alert('⛔ The Random noise packet should be a range like 0-10 or 10-30! 🫤');\n                            submisionError = true;\n                        }\n                        const [min, max] = udpNoisePackets[index].split("-").map(Number);\n                        if (min > max) {\n                            alert('⛔ The minimum Random noise packet should be smaller or equal to maximum! 🫤');\n                            submisionError = true;\n                        }\n                        break;\n\n                    case 'hex':\n                        if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(udpNoisePackets[index]))) {\n                            alert('⛔ The Hex noise packet is not a valid hex value! It should have even length and consisted of 0-9, a-f and A-F. 🫤');\n                            submisionError = true;\n                        }\n                        break;\n                }\n            }\n            if (submisionError) return false;\n\n            try {\n                document.body.style.cursor = 'wait';\n                const applyButtonVal = applyButton.value;\n                applyButton.value = '⌛ Loading...';\n\n                const response = await fetch('/panel', {\n                    method: 'POST',\n                    body: formData,\n                    credentials: 'include'\n                });\n\n                document.body.style.cursor = 'default';\n                applyButton.value = applyButtonVal;\n\n                if (!response.ok) {\n                    const errorMessage = await response.text();\n                    console.error(errorMessage, response.status);\n                    alert('⚠️ Session expired! Please login again.');\n                    window.location.href = '/login';\n                    return;\n                }                \n                alert('✅ Parameters applied successfully 😎');\n                window.location.reload();\n            } catch (error) {\n                console.error('Error:', error);\n            }\n        }\n\n        const logout = async (event) => {\n            event.preventDefault();\n\n            try {\n                const response = await fetch('/logout', {\n                    method: 'GET',\n                    credentials: 'same-origin'\n                });\n            \n                if (!response.ok) {\n                    console.error('Failed to log out:', response.status);\n                    return;\n                }\n                window.location.href = '/login';\n            } catch (error) {\n                console.error('Error:', error);\n            }\n        }\n\n        const resetPassword = async (event) => {\n            event.preventDefault();\n            const modal = document.getElementById('myModal');\n            const newPasswordInput = document.getElementById('newPassword');\n            const confirmPasswordInput = document.getElementById('confirmPassword');\n            const passwordError = document.getElementById('passwordError');             \n            const newPassword = newPasswordInput.value;\n            const confirmPassword = confirmPasswordInput.value;\n\n            if (newPassword !== confirmPassword) {\n                passwordError.textContent = "Passwords do not match";\n                return false;\n            }\n\n            const hasCapitalLetter = /[A-Z]/.test(newPassword);\n            const hasNumber = /[0-9]/.test(newPassword);\n            const isLongEnough = newPassword.length >= 8;\n\n            if (!(hasCapitalLetter && hasNumber && isLongEnough)) {\n                passwordError.textContent = '⚠️ Password must contain at least one capital letter, one number, and be at least 8 characters long.';\n                return false;\n            }\n                    \n            try {\n                const response = await fetch('/panel/password', {\n                    method: 'POST',\n                    headers: {\n                        'Content-Type': 'text/plain'\n                    },\n                    body: newPassword,\n                    credentials: 'same-origin'\n                });\n            \n                if (response.ok) {\n                    modal.style.display = "none";\n                    document.body.style.overflow = "";\n                    alert("✅ Password changed successfully! 👍");\n                    window.location.href = '/login';\n                } else if (response.status === 401) {\n                    const errorMessage = await response.text();\n                    passwordError.textContent = '⚠️ ' + errorMessage;\n                    console.error(errorMessage, response.status);\n                    alert('⚠️ Session expired! Please login again.');\n                    window.location.href = '/login';\n                } else {\n                    const errorMessage = await response.text();\n                    passwordError.textContent = '⚠️ ' + errorMessage;\n                    console.error(errorMessage, response.status);\n                    return false;\n                }\n            } catch (error) {\n                console.error('Error:', error);\n            }\n        }\n    <\/script>\n    </body>\t\n    </html>`;return new Response(Tr,{status:200,headers:{"Content-Type":"text/html;charset=utf-8","Access-Control-Allow-Origin":globalThis.urlOrigin,"Access-Control-Allow-Methods":"GET, POST","Access-Control-Allow-Headers":"Content-Type, Authorization","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate, no-transform","CDN-Cache-Control":"no-store"}})}f(Do,"renderHomePage");function kr(t){return/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t)}f(kr,"isValidUUID");async function tr(t){let r="https://cloudflare-dns.com/dns-query",a=`${r}?name=${encodeURIComponent(t)}&type=A`,n=`${r}?name=${encodeURIComponent(t)}&type=AAAA`;try{let[l,p]=await Promise.all([fetch(a,{headers:{accept:"application/dns-json"}}),fetch(n,{headers:{accept:"application/dns-json"}})]),u=await l.json(),v=await p.json(),h=u.Answer?u.Answer.map((w=>w.data)):[],g=v.Answer?v.Answer.map((w=>w.data)):[];return{ipv4:h,ipv6:g}}catch(l){throw console.error("Error resolving DNS:",l),new Error(`An error occurred while resolving DNS - ${l}`)}}f(tr,"resolveDNS");function De(t){return/^(?!\-)(?:[A-Za-z0-9\-]{1,63}\.)+[A-Za-z]{2,}$/.test(t)}f(De,"isDomain");async function No(t,r){let a=await kt(t,r);if(t.method==="POST")return a?(await Ar(t,r),new Response("Success",{status:200})):new Response("Unauthorized or expired session!",{status:401});let{proxySettings:n}=await qe(t,r),l=await r.kv.get("pwd");if(l&&!a)return Response.redirect(`${globalThis.urlOrigin}/login`,302);let p=l?.length>=8;return await Do(n,p)}f(No,"handlePanel");async function Fo(t){let r=new URL(t.url);r.hostname=globalThis.fallbackDomain,r.protocol="https:";let a=new Request(r.toString(),{method:t.method,headers:t.headers,body:t.body,redirect:"manual"});return await fetch(a)}f(Fo,"fallback");async function Mo(t){let r=await t.text();try{let n=await(await fetch(`http://ip-api.com/json/${r}?nocache=${Date.now()}`)).json();return new Response(JSON.stringify(n),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8"}})}catch(a){console.error("Error fetching IP address:",a)}}f(Mo,"getMyIP");async function Bo(t,r){if(!await kt(t,r))return new Response("Unauthorized or expired session!",{status:401});let{warpConfigs:n,proxySettings:l}=await qe(t,r),{warpEndpoints:p}=l,u=bt(n,!1),{warpIPv6:v,publicKey:h,privateKey:g}=u,w=[];return p.split(",").forEach((y=>{let _=`[Interface]\nPrivateKey = ${g}\nAddress = 172.16.0.2/32, ${v}\nDNS = 1.1.1.1, 1.0.0.1\nMTU = 1280\n[Peer]\nPublicKey = ${h}\nAllowedIPs = 0.0.0.0/0, ::/0\nEndpoint = ${y}`;w.push(_)})),new Response(JSON.stringify(w),{status:200,headers:{"Content-Type":"application/json"}})}f(Bo,"getWarpConfigFiles");function Uo(t,r){let a=r.PROXYIP?.split(",").map((p=>p.trim())),n=new URL(t.url),l=new URLSearchParams(n.search);if(globalThis.panelVersion="3.1.1",globalThis.defaultHttpPorts=["80","8080","2052","2082","2086","2095","8880"],globalThis.defaultHttpsPorts=["443","8443","2053","2083","2087","2096"],globalThis.userID=r.UUID,globalThis.TRPassword=r.TR_PASS,globalThis.proxyIP=a?a[Math.floor(Math.random()*a.length)]:atob("YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ=="),globalThis.hostName=t.headers.get("Host"),globalThis.pathName=n.pathname,globalThis.client=l.get("app"),globalThis.urlOrigin=n.origin,globalThis.dohURL=r.DOH_URL||"https://cloudflare-dns.com/dns-query",globalThis.fallbackDomain=r.FALLBACK||"speed.cloudflare.com",globalThis.subPath=r.SUB_PATH||userID,pathName!=="/secrets"){if(!userID||!globalThis.TRPassword)throw new Error(`Please set UUID and ${atob("VHJvamFu")} password first. Please visit <a href="https://${hostName}/secrets" target="_blank">here</a> to generate them.`,{cause:"init"});if(userID&&!kr(userID))throw new Error(`Invalid UUID: ${userID}`,{cause:"init"});if(typeof r.kv!="object")throw new Error("KV Dataset is not properly set! Please refer to tutorials.",{cause:"init"})}}f(Uo,"initializeParams");import{connect as Va}from"cloudflare:sockets";async function Wo(t){let r=new WebSocketPair,[a,n]=Object.values(r);n.accept();let l="",p="",u=f(((_,k)=>{console.log(`[${l}:${p}] ${_}`,k||"")}),"log"),v=t.headers.get("sec-websocket-protocol")||"",h=za(n,v,u),g={value:null},w=null,y=!1;return h.pipeTo(new WritableStream({async write(_,k){if(y&&w)return w(_);if(g.value){let A=g.value.writable.getWriter();await A.write(_),A.releaseLock();return}let{hasError:B,message:K,portRemote:V=443,addressRemote:J="",rawDataIndex:M,VLVersion:H=new Uint8Array([0,0]),isUDP:X}=await ja(_,globalThis.userID);if(l=J,p=`${V}--${Math.random()} ${X?"udp ":"tcp "} `,B)throw new Error(K);if(X)if(V===53)y=!0;else throw new Error("UDP proxy only enable for DNS which is port 53");let W=new Uint8Array([H[0],0]),x=_.slice(M);if(y){let{write:A}=await qa(n,W,u);w=A,w(x);return}Ja(g,J,V,x,n,W,u)},close(){u("readableWebSocketStream is close")},abort(_){u("readableWebSocketStream is abort",JSON.stringify(_))}})).catch((_=>{u("readableWebSocketStream pipeTo error",_)})),new Response(null,{status:101,webSocket:a})}f(Wo,"VLOverWSHandler");async function Lo(t){try{let r=await getApiResponse();return r?r.users.some((n=>n.uuid===t)):!1}catch(r){return console.error("Error:",r),!1}}f(Lo,"checkUuidInApiResponse");async function Ja(t,r,a,n,l,p,u){async function v(w,y){/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(w)&&(w=`${atob("d3d3Lg==")}${w}${atob("LnNzbGlwLmlv")}`);let _=Va({hostname:w,port:y});t.value=_,u(`connected to ${w}:${y}`);let k=_.writable.getWriter();return await k.write(n),k.releaseLock(),_}f(v,"connectAndWrite");async function h(){let w=globalThis.pathName.split("/")[2],y=w?atob(w).split(","):void 0,_=y?y[Math.floor(Math.random()*y.length)]:globalThis.proxyIP||r,k=await v(_,a);k.closed.catch((B=>{console.log("retry tcpSocket closed error",B)})).finally((()=>{Rr(l)})),Oo(k,l,p,null,u)}f(h,"retry");let g=await v(r,a);Oo(g,l,p,h,u)}f(Ja,"handleTCPOutBound");function za(t,r,a){let n=!1;return new ReadableStream({start(p){t.addEventListener("message",(h=>{if(n)return;let g=h.data;p.enqueue(g)})),t.addEventListener("close",(()=>{Rr(t),!n&&p.close()})),t.addEventListener("error",(h=>{a("webSocketServer has error"),p.error(h)}));let{earlyData:u,error:v}=Ga(r);v?p.error(v):u&&p.enqueue(u)},pull(p){},cancel(p){n||(a(`ReadableStream was canceled, due to ${p}`),n=!0,Rr(t))}})}f(za,"makeReadableWebSocketStream");async function ja(t,r){if(t.byteLength<24)return{hasError:!0,message:"invalid data"};let a=new Uint8Array(t.slice(0,1)),n=!1,l=!1,p=new Uint8Array(t.slice(1,17)),u=Qa(p),v=r.includes(",")?r.split(","):[r],h=await Lo(u);if(n=v.some((X=>h||u===X.trim())),console.log(`checkUuidInApi: ${await Lo(u)}, userID: ${u}`),!n)return{hasError:!0,message:"invalid user"};let g=new Uint8Array(t.slice(17,18))[0],w=new Uint8Array(t.slice(18+g,18+g+1))[0];if(w!==1)if(w===2)l=!0;else return{hasError:!0,message:`command ${w} is not support, command 01-tcp,02-udp,03-mux`};let y=18+g+1,_=t.slice(y,y+2),k=new DataView(_).getUint16(0),B=y+2,V=new Uint8Array(t.slice(B,B+1))[0],J=0,M=B+1,H="";switch(V){case 1:J=4,H=new Uint8Array(t.slice(M,M+J)).join(".");break;case 2:J=new Uint8Array(t.slice(M,M+1))[0],M+=1,H=(new TextDecoder).decode(t.slice(M,M+J));break;case 3:J=16;let X=new DataView(t.slice(M,M+J)),W=[];for(let x=0;x<8;x++)W.push(X.getUint16(x*2).toString(16));H=W.join(":");break;default:return{hasError:!0,message:`invild  addressType is ${V}`}}return H?{hasError:!1,addressRemote:H,addressType:V,portRemote:k,rawDataIndex:M+J,VLVersion:a,isUDP:l}:{hasError:!0,message:`addressValue is empty, addressType is ${V}`}}f(ja,"processVLHeader");async function Oo(t,r,a,n,l){let p=0,u=[],v=a,h=!1;await t.readable.pipeTo(new WritableStream({start(){},async write(g,w){h=!0,r.readyState!==eo&&w.error("webSocket.readyState is not open, maybe close"),v?(r.send(await new Blob([v,g]).arrayBuffer()),v=null):r.send(g)},close(){l(`remoteConnection!.readable is close with hasIncomingData is ${h}`)},abort(g){console.error("remoteConnection!.readable abort",g)}})).catch((g=>{console.error(`${atob("dmxlc3M=")}RemoteSocketToWS has exception `,g.stack||g),Rr(r)})),h===!1&&n&&(l("retry"),n())}f(Oo,"VLRemoteSocketToWS");function Ga(t){if(!t)return{earlyData:null,error:null};try{t=t.replace(/-/g,"+").replace(/_/g,"/");let r=atob(t);return{earlyData:Uint8Array.from(r,(n=>n.charCodeAt(0))).buffer,error:null}}catch(r){return{earlyData:null,error:r}}}f(Ga,"base64ToArrayBuffer");var eo=1,Ya=2;function Rr(t){try{(t.readyState===eo||t.readyState===Ya)&&t.close()}catch(r){console.error("safeCloseWebSocket error",r)}}f(Rr,"safeCloseWebSocket");var Ve=[];for(let t=0;t<256;++t)Ve.push((t+256).toString(16).slice(1));function Xa(t,r=0){return(Ve[t[r+0]]+Ve[t[r+1]]+Ve[t[r+2]]+Ve[t[r+3]]+"-"+Ve[t[r+4]]+Ve[t[r+5]]+"-"+Ve[t[r+6]]+Ve[t[r+7]]+"-"+Ve[t[r+8]]+Ve[t[r+9]]+"-"+Ve[t[r+10]]+Ve[t[r+11]]+Ve[t[r+12]]+Ve[t[r+13]]+Ve[t[r+14]]+Ve[t[r+15]]).toLowerCase()}f(Xa,"unsafeStringify");function Qa(t,r=0){let a=Xa(t,r);if(!kr(a))throw TypeError("Stringified UUID is invalid");return a}f(Qa,"stringify");async function qa(t,r,a){let n=!1,l=new TransformStream({start(u){},transform(u,v){for(let h=0;h<u.byteLength;){let g=u.slice(h,h+2),w=new DataView(g).getUint16(0),y=new Uint8Array(u.slice(h+2,h+2+w));h=h+2+w,v.enqueue(y)}},flush(u){}});l.readable.pipeTo(new WritableStream({async write(u){let h=await(await fetch(globalThis.dohURL,{method:"POST",headers:{"content-type":"application/dns-message"},body:u})).arrayBuffer(),g=h.byteLength,w=new Uint8Array([g>>8&255,g&255]);t.readyState===eo&&(a(`doh success and dns message length is ${g}`),n?t.send(await new Blob([w,h]).arrayBuffer()):(t.send(await new Blob([r,w,h]).arrayBuffer()),n=!0))}})).catch((u=>{a("dns udp has error"+u)}));let p=l.writable.getWriter();return{write(u){p.write(u)}}}f(qa,"handleUDPOutBound");var Jo=Wr(Ko());import{connect as Za}from"cloudflare:sockets";async function zo(t){let r=new WebSocketPair,[a,n]=Object.values(r);n.accept();let l="",p="",u=f(((y,_)=>{console.log(`[${l}:${p}] ${y}`,_||"")}),"log"),v=t.headers.get("sec-websocket-protocol")||"",h=rn(n,v,u),g={value:null},w=null;return h.pipeTo(new WritableStream({async write(y,_){if(w)return w(y);if(g.value){let M=g.value.writable.getWriter();await M.write(y),M.releaseLock();return}let{hasError:k,message:B,portRemote:K=443,addressRemote:V="",rawClientData:J}=await en(y);if(l=V,p=`${K}--${Math.random()} tcp`,k)throw new Error(B);tn(g,V,K,J,n,u)},close(){u("readableWebSocketStream is closed")},abort(y){u("readableWebSocketStream is aborted",JSON.stringify(y))}})).catch((y=>{u("readableWebSocketStream pipeTo error",y)})),new Response(null,{status:101,webSocket:a})}f(zo,"TROverWSHandler");async function en(t){if(t.byteLength<56)return{hasError:!0,message:"invalid data"};let r=56;if(new Uint8Array(t.slice(56,57))[0]!==13||new Uint8Array(t.slice(57,58))[0]!==10)return{hasError:!0,message:"invalid header format (missing CR LF)"};if((new TextDecoder).decode(t.slice(0,r))!==Jo.default.sha224(globalThis.TRPassword))return{hasError:!0,message:"invalid password"};let n=t.slice(r+2);if(n.byteLength<6)return{hasError:!0,message:"invalid SOCKS5 request data"};let l=new DataView(n);if(l.getUint8(0)!==1)return{hasError:!0,message:"unsupported command, only TCP (CONNECT) is allowed"};let u=l.getUint8(1),v=0,h=2,g="";switch(u){case 1:v=4,g=new Uint8Array(n.slice(h,h+v)).join(".");break;case 3:v=new Uint8Array(n.slice(h,h+1))[0],h+=1,g=(new TextDecoder).decode(n.slice(h,h+v));break;case 4:v=16;let k=new DataView(n.slice(h,h+v)),B=[];for(let K=0;K<8;K++)B.push(k.getUint16(K*2).toString(16));g=B.join(":");break;default:return{hasError:!0,message:`invalid addressType is ${u}`}}if(!g)return{hasError:!0,message:`address is empty, addressType is ${u}`};let w=h+v,y=n.slice(w,w+2),_=new DataView(y).getUint16(0);return{hasError:!1,addressRemote:g,portRemote:_,rawClientData:n.slice(w+4)}}f(en,"parseTRHeader");async function tn(t,r,a,n,l,p){async function u(g,w){/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(g)&&(g=`${atob("d3d3Lg==")}${g}${atob("LnNzbGlwLmlv")}`);let y=Za({hostname:g,port:w});t.value=y,p(`connected to ${g}:${w}`);let _=y.writable.getWriter();return await _.write(n),_.releaseLock(),y}f(u,"connectAndWrite");async function v(){let g=globalThis.pathName.split("/")[2],w=g?atob(g).split(","):void 0,y=w?w[Math.floor(Math.random()*w.length)]:globalThis.proxyIP||r,_=await u(y,a);_.closed.catch((k=>{console.log("retry tcpSocket closed error",k)})).finally((()=>{Ir(l)})),Vo(_,l,null,p)}f(v,"retry");let h=await u(r,a);Vo(h,l,v,p)}f(tn,"handleTCPOutBound");function rn(t,r,a){let n=!1;return new ReadableStream({start(p){t.addEventListener("message",(h=>{if(n)return;let g=h.data;p.enqueue(g)})),t.addEventListener("close",(()=>{Ir(t),!n&&p.close()})),t.addEventListener("error",(h=>{a("webSocketServer has error"),p.error(h)}));let{earlyData:u,error:v}=on(r);v?p.error(v):u&&p.enqueue(u)},pull(p){},cancel(p){n||(a(`ReadableStream was canceled, due to ${p}`),n=!0,Ir(t))}})}f(rn,"makeReadableWebSocketStream");async function Vo(t,r,a,n){let l=!1;await t.readable.pipeTo(new WritableStream({start(){},async write(p,u){l=!0,r.readyState!==jo&&u.error("webSocket connection is not open"),r.send(p)},close(){n(`remoteSocket.readable is closed, hasIncomingData: ${l}`)},abort(p){console.error("remoteSocket.readable abort",p)}})).catch((p=>{console.error(`${atob("dHJvamFu")}RemoteSocketToWS error:`,p.stack||p),Ir(r)})),l===!1&&a&&(n("retry"),a())}f(Vo,"TRRemoteSocketToWS");function on(t){if(!t)return{earlyData:null,error:null};try{t=t.replace(/-/g,"+").replace(/_/g,"/");let r=atob(t);return{earlyData:Uint8Array.from(r,(n=>n.charCodeAt(0))).buffer,error:null}}catch(r){return{earlyData:null,error:r}}}f(on,"base64ToArrayBuffer");var jo=1,an=2;function Ir(t){try{(t.readyState===jo||t.readyState===an)&&t.close()}catch(r){console.error("safeCloseWebSocket error",r)}}f(Ir,"safeCloseWebSocket");async function Go(t){let r=`\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <title>${atob("QlBC")} Error</title>\n        <style>\n            :root {\n                --color: black;\n                --header-color: #09639f; \n                --background-color: #fff;\n                --border-color: #ddd;\n                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);\n            }\n            body, html {\n                height: 100%;\n                width: 100%;\n                margin: 0;\n                display: flex;\n                justify-content: center;\n                align-items: center;\n                font-family: system-ui;\n                color: var(--color);\n                background-color: var(--background-color);\n            }\n            body.dark-mode {\n                --color: white;\n                --header-color: #3498DB; \n                --background-color: #121212;\n                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);          \n            }\n            h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }\n            #error-container { text-align: center; }\n        </style>\n    </head>\n    <body>\n        <div id="error-container">\n            <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> 💦</h1>\n            <div id="error-message">\n                <h2>❌ Something went wrong!</h2>\n                <p><b>${t?`⚠️ ${t.cause?t.message.toString():t.stack.toString()}`:""}</b></p>\n            </div>\n        </div>\n    <script>\n        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');\n    <\/script>\n    </body>\n    </html>`;return new Response(r,{status:200,headers:{"Content-Type":"text/html"}})}f(Go,"renderErrorPage");async function Wt(t,r,a,n,l){let{remoteDNS:p,localDNS:u,VLTRFakeDNS:v,enableIPv6:h,warpFakeDNS:g,warpEnableIPv6:w,blockAds:y,bypassIran:_,bypassChina:k,blockPorn:B,bypassRussia:K,customBypassRules:V,customBlockRules:J}=t,M=[{rule:_,domain:"geosite:category-ir",ip:"geoip:ir"},{rule:k,domain:"geosite:cn",ip:"geoip:cn"},{rule:K,domain:"geosite:category-ru",ip:"geoip:ru"}],H=[{rule:y,host:"geosite:category-ads-all"},{rule:y,host:"geosite:category-ads-ir"},{rule:B,host:"geosite:category-porn"}],X=v&&!l||g&&l,W=h&&!l||w&&l,x=r.filter((fe=>De(fe))),A=V.split(",").filter((fe=>De(fe))),D=J.split(",").filter((fe=>De(fe))),E=[...new Set(x)],L=[...E,...A].length>0,R=_||k||K,z=y||B||D.length>0,P=n?["https://cloudflare-dns.com/dns-query"]:l?w?["1.1.1.1","1.0.0.1","2606:4700:4700::1111","2606:4700:4700::1001"]:["1.1.1.1","1.0.0.1"]:[p],F={};z&&(H.forEach((({rule:fe,host:we})=>{fe&&(F[we]=["127.0.0.1"])})),D.forEach((fe=>{F[`domain:${fe}`]=["127.0.0.1"]})));let Y=a?await tr(a):void 0;if(Y&&(F[a]=h?[...Y.ipv4,...Y.ipv6]:Y.ipv4),n){let fe=["cloudflare-dns.com","cloudflare.com","dash.cloudflare.com"],we=await Promise.all(fe.map(tr)),le=we.flatMap((se=>se.ipv4)),Pe=h?we.flatMap((se=>se.ipv6)):[];F["cloudflare-dns.com"]=[...le,...Pe]}let ie={...Object.keys(F).length?{hosts:F}:{},servers:P,queryStrategy:W?"UseIP":"UseIPv4",tag:"dns"},Ie=Ot(p);if(Ie.isHostDomain&&!n&&!l&&ie.servers.push({address:"https://8.8.8.8/dns-query",domains:[`full:${Ie.host}`],skipFallback:!0}),L){let fe=E.map((le=>`full:${le}`)),we=A.map((le=>`domain:${le}`));ie.servers.push({address:u,domains:[...fe,...we],skipFallback:!0})}let Z={address:u,domains:[],expectIPs:[],skipFallback:!0};if(!n&&R&&(M.forEach((({rule:fe,domain:we,ip:le})=>{fe&&(Z.domains.push(we),Z.expectIPs.push(le))})),ie.servers.push(Z)),X){let fe=R&&!n?{address:"fakedns",domains:Z.domains}:"fakedns";ie.servers.unshift(fe)}return ie}f(Wt,"buildXrayDNS");function yt(t,r,a,n,l){let{localDNS:p,bypassLAN:u,bypassIran:v,bypassChina:h,bypassRussia:g,blockAds:w,blockPorn:y,blockUDP443:_,customBypassRules:k,customBlockRules:B}=t,K=[{rule:u,type:"direct",domain:"geosite:private",ip:"geoip:private"},{rule:v,type:"direct",domain:"geosite:category-ir",ip:"geoip:ir"},{rule:h,type:"direct",domain:"geosite:cn",ip:"geoip:cn"},{rule:w,type:"block",domain:"geosite:category-ads-all"},{rule:w,type:"block",domain:"geosite:category-ads-ir"},{rule:y,type:"block",domain:"geosite:category-porn"}],V=r.filter((E=>De(E))),J=k?k.split(","):[],M=B?B.split(","):[],H=J.filter((E=>De(E))),X=[...V,...H].length>0,W=w||y||M.length>0,x=v||h||g||J.length>0,A=a?"chain":l?"fragment":"proxy",D=[{inboundTag:["dns-in"],outboundTag:"dns-out",type:"field"},{inboundTag:["socks-in","http-in"],port:"53",network:"udp",outboundTag:"dns-out",type:"field"}];if(!l&&(X||x)&&p!=="localhost"&&D.push({inboundTag:["dns"],ip:[p],port:"53",outboundTag:"direct",type:"field"}),l||D.push({inboundTag:["dns"],[n?"balancerTag":"outboundTag"]:n?"all":A,type:"field"}),_&&D.push({network:"udp",port:"443",outboundTag:"block",type:"field"}),x||W){let E=f(((F,Y)=>({[F]:[],outboundTag:Y,type:"field"})),"createRule"),L,R;l||(L=E("domain","direct"),R=E("ip","direct"));let z=E("domain","block"),P=E("ip","block");K.forEach((({rule:F,type:Y,domain:ne,ip:ie})=>{F&&(Y==="direct"?(L?.domain.push(ne),R?.ip?.push(ie)):z.domain.push(ne))})),J.forEach((F=>{De(F)?L?.domain.push(`domain:${F}`):R?.ip.push(F)})),M.forEach((F=>{De(F)?z.domain.push(`domain:${F}`):P.ip.push(F)})),z.domain.length&&D.push(z),P.ip.length&&D.push(P),l||(L.domain.length&&D.push(L),R.ip.length&&D.push(R))}return n?D.push({network:"tcp,udp",balancerTag:"all",type:"field"}):D.push({network:"tcp,udp",outboundTag:A,type:"field"}),D}f(yt,"buildXrayRoutingRules");function Xo(t,r,a,n,l,p,u,v,h){let{userID:g,defaultHttpsPorts:w}=globalThis,y={protocol:atob("dmxlc3M="),settings:{vnext:[{address:r,port:+a,users:[{id:g,encryption:"none",level:8}]}]},streamSettings:{network:"ws",security:"none",sockopt:{},wsSettings:{host:n,headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"},path:`/${nt(16)}${p?`/${btoa(p)}`:""}?ed=2560`}},tag:t};w.includes(a)&&(y.streamSettings.security="tls",y.streamSettings.tlsSettings={allowInsecure:v,fingerprint:"randomized",alpn:["h2","http/1.1"],serverName:l});let _=y.streamSettings.sockopt;return u?_.dialerProxy="fragment":_.domainStrategy=h?"UseIPv4v6":"UseIPv4",y}f(Xo,"buildXrayVLOutbound");function nn(t,r,a,n,l,p,u,v,h){let{TRPassword:g,defaultHttpsPorts:w}=globalThis,y={protocol:atob("dHJvamFu"),settings:{servers:[{address:r,port:+a,password:g,level:8}]},streamSettings:{network:"ws",security:"none",sockopt:{},wsSettings:{headers:{Host:n},path:`/tr${nt(16)}${p?`/${btoa(p)}`:""}?ed=2560`}},tag:t};w.includes(a)&&(y.streamSettings.security="tls",y.streamSettings.tlsSettings={allowInsecure:v,fingerprint:"randomized",alpn:["h2","http/1.1"],serverName:l});let _=y.streamSettings.sockopt;return u?_.dialerProxy="fragment":_.domainStrategy=h?"UseIPv4v6":"UseIPv4",y}f(nn,"buildXrayTROutbound");function Yo(t,r,a,n,l){let{warpEnableIPv6:p,nikaNGNoiseMode:u,noiseCountMin:v,noiseCountMax:h,noiseSizeMin:g,noiseSizeMax:w,noiseDelayMin:y,noiseDelayMax:_}=t,k=n==="proxy",{warpIPv6:B,reserved:K,publicKey:V,privateKey:J}=bt(r,k),M={protocol:"wireguard",settings:{address:["172.16.0.2/32",B],mtu:1280,peers:[{endpoint:k?"162.159.192.1:2408":a,publicKey:V,keepAlive:5}],reserved:Pr(K),secretKey:J},streamSettings:{sockopt:{dialerProxy:n}},tag:k?"chain":"proxy"};return!n&&delete M.streamSettings,l==="nikang"&&!k&&delete M.streamSettings&&Object.assign(M.settings,{wnoise:u,wnoisecount:v===h?v:`${v}-${h}`,wpayloadsize:g===w?g:`${g}-${w}`,wnoisedelay:y===_?y:`${y}-${_}`}),M}f(Yo,"buildXrayWarpOutbound");function sn(t,r){if(["socks","http"].includes(t.protocol)){let{protocol:W,server:x,port:A,user:D,pass:E}=t;return{protocol:W,settings:{servers:[{address:x,port:+A,users:[{user:D,pass:E,level:8}]}]},streamSettings:{network:"tcp",sockopt:{dialerProxy:"proxy",domainStrategy:r?"UseIPv4v6":"UseIPv4"}},mux:{enabled:!0,concurrency:8,xudpConcurrency:16,xudpProxyUDP443:"reject"},tag:"chain"}}let{server:a,port:n,uuid:l,flow:p,security:u,type:v,sni:h,fp:g,alpn:w,pbk:y,sid:_,spx:k,headerType:B,host:K,path:V,authority:J,serviceName:M,mode:H}=t,X={mux:{concurrency:8,enabled:!0,xudpConcurrency:16,xudpProxyUDP443:"reject"},protocol:atob("dmxlc3M="),settings:{vnext:[{address:a,port:+n,users:[{encryption:"none",flow:p,id:l,level:8,security:"auto"}]}]},streamSettings:{network:v,security:u,sockopt:{dialerProxy:"proxy",domainStrategy:r?"UseIPv4v6":"UseIPv4"}},tag:"chain"};if(u==="tls"){let W=w?w?.split(","):[];X.streamSettings.tlsSettings={allowInsecure:!1,fingerprint:g,alpn:W,serverName:h}}if(u==="reality"&&(delete X.mux,X.streamSettings.realitySettings={fingerprint:g,publicKey:y,serverName:h,shortId:_,spiderX:k}),B==="http"){let W=V?.split(","),x=K?.split(",");X.streamSettings.tcpSettings={header:{request:{headers:{Host:x},method:"GET",path:W,version:"1.1"},response:{headers:{"Content-Type":["application/octet-stream"]},reason:"OK",status:"200",version:"1.1"},type:"http"}}}return v==="tcp"&&u!=="reality"&&!B&&(X.streamSettings.tcpSettings={header:{type:"none"}}),v==="ws"&&(X.streamSettings.wsSettings={headers:{Host:K},path:V}),v==="grpc"&&(delete X.mux,X.streamSettings.grpcSettings={authority:J,multiMode:H==="multi",serviceName:M}),X}f(sn,"buildXrayChainOutbound");function to(t,r,a,n){let{xrayUdpNoises:l,fragmentPackets:p,lengthMin:u,lengthMax:v,intervalMin:h,intervalMax:g,enableIPv6:w,warpEnableIPv6:y}=t,_={tag:n,protocol:"freedom",settings:{}};return r&&(_.settings.fragment={packets:p,length:`${u}-${v}`,interval:`${h}-${g}`},_.settings.domainStrategy=w?"UseIPv4v6":"UseIPv4"),a&&(_.settings.noises=[],JSON.parse(l).forEach((k=>{let B=+k.count;delete k.count,_.settings.noises.push(...Array.from({length:B},(()=>k)))})),r||(_.settings.domainStrategy=y?"UseIPv4v6":"UseIPv4")),_}f(to,"buildFreedomOutbound");function wt(t,r,a,n,l,p){let{VLTRFakeDNS:u,warpFakeDNS:v,bestVLTRInterval:h,bestWarpInterval:g}=t,w=u&&!p||v&&p,y=structuredClone(dn);if(y.remarks=r,w&&(y.inbounds[0].sniffing.destOverride.push("fakedns"),y.inbounds[1].sniffing.destOverride.push("fakedns")),a){let _=p?g:h;y.observatory.probeInterval=`${_}s`,l&&(y.routing.balancers[0].fallbackTag="prox-2"),n&&(y.observatory.subjectSelector=["chain"],y.routing.balancers[0].selector=["chain"])}else delete y.observatory,delete y.routing.balancers;return y}f(wt,"buildXrayConfig");async function cn(t,r,a,n,l){let p=l?`💦 ${atob("QlBC")} F - Best Ping 💥`:`💦 ${atob("QlBC")} - Best Ping 💥`,u=wt(t,p,!0,a,!0);return u.dns=await Wt(t,r,void 0,!1,!1),u.routing.rules=yt(t,r,a,!0,!1),u.outbounds.unshift(...n),u}f(cn,"buildXrayBestPingConfig");async function ln(t,r,a,n){let l=["10-20","20-30","30-40","40-50","50-60","60-70","70-80","80-90","90-100","10-30","20-40","30-50","40-60","50-70","60-80","70-90","80-100","100-200"],p=wt(t,`💦 ${atob("QlBC")} F - Best Fragment 😎`,!0,a,!1,!1);p.dns=await Wt(t,[],r,!1,!1),p.routing.rules=yt(t,[],a,!0,!1);let u=[],v=n.pop();return l.forEach(((h,g)=>{if(a){let _=structuredClone(a);_.tag=`chain-${g+1}`,_.streamSettings.sockopt.dialerProxy=`prox-${g+1}`,u.push(_)}let w=structuredClone(n[a?1:0]);w.tag=`prox-${g+1}`,w.streamSettings.sockopt.dialerProxy=`frag-${g+1}`;let y=structuredClone(v);y.tag=`frag-${g+1}`,y.settings.fragment.length=h,y.settings.fragment.interval="1-1",u.push(w,y)})),p.outbounds.unshift(...u),p}f(ln,"buildXrayBestFragmentConfig");async function fn(t){let r=wt(t,`💦 ${atob("QlBC")} F - WorkerLess ⭐`,!1,!1,!1,!1),a=to(t,!0,!0,"fragment");r.outbounds.unshift(a),r.dns=await Wt(t,[],void 0,!0),r.routing.rules=yt(t,[],!1,!1,!0);let n=Xo("fake-outbound","google.com","443",globalThis.userID,"google.com","google.com","",!0,!1);return n.streamSettings.wsSettings.path="/",r.outbounds.push(n),r}f(fn,"buildXrayWorkerLessConfig");async function ro(t,r,a){let{hostName:n,defaultHttpsPorts:l}=globalThis,{proxySettings:p}=await qe(t,r),u=[],v=[],h=[],g,{proxyIP:w,outProxy:y,outProxyParams:_,cleanIPs:k,enableIPv6:B,customCdnAddrs:K,customCdnHost:V,customCdnSni:J,VLConfigs:M,TRConfigs:H,ports:X}=p;if(y){let P=JSON.parse(_);try{g=sn(P,B)}catch(F){console.log("An error occured while parsing chain proxy: ",F),g=void 0,await r.kv.put("proxySettings",JSON.stringify({...p,outProxy:"",outProxyParams:{}}))}}let W=await xt(k,B),x=K?K.split(","):[],A=a?[...W]:[...W,...x],D=X.filter((P=>a?l.includes(P):!0));M&&h.push(atob("VkxFU1M=")),H&&h.push(atob("VHJvamFu"));let E=1,L=a?to(p,!0,!1,"fragment"):null;for(let P of h){let F=1;for(let Y of D)for(let ne of A){let ie=x.includes(ne),Ie=ie?"C":a?"F":"",Z=ie?J:gt(n),fe=ie?V:n,we=ht(F,Y,ne,k,P,Ie),le=wt(p,we,!1,g,!1,!1);a&&le.outbounds.unshift(L),le.dns=await Wt(p,[ne],void 0,!1,!1),le.routing.rules=yt(p,[ne],g,!1,!1);let Pe=P===atob("VkxFU1M=")?Xo("proxy",ne,Y,fe,Z,w,a,ie,B):nn("proxy",ne,Y,fe,Z,w,a,ie,B);if(le.outbounds.unshift({...Pe}),Pe.tag=`prox-${E}`,g){le.outbounds.unshift(g);let se=structuredClone(g);se.tag=`chain-${E}`,se.streamSettings.sockopt.dialerProxy=`prox-${E}`,v.push(se)}v.push(Pe),u.push(le),E++,F++}}a&&v.push(L);let R=await cn(p,A,g,v,a),z=[...u,R];if(a){let P=await ln(p,n,g,v),F=await fn(p);z.push(P,F)}return new Response(JSON.stringify(z,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(ro,"getXrayCustomConfigs");async function Qo(t,r,a){let{proxySettings:n,warpConfigs:l}=await qe(t,r),{warpEndpoints:p}=n,u=[],v=[],h=[],g=[],w=p.split(",").map((M=>M.split(":")[0])).filter((M=>De(M))),y=a!=="xray"?" Pro ":" ",_=a==="xray-pro"?"udp-noise":void 0,k;for(let[M,H]of p.split(",").entries()){let X=H.split(":")[0],W=wt(n,`💦 ${M+1} - Warp${y}🇮🇷`,!1,!1,!1,!0),x=wt(n,`💦 ${M+1} - WoW${y}🌍`,!1,!0,!1,!0);a==="xray-pro"&&(k=to(n,!1,!0,"udp-noise"),W.outbounds.unshift(k),x.outbounds.unshift(k)),W.dns=x.dns=await Wt(n,[X],void 0,!1,!0),W.routing.rules=yt(n,[X],!1,!1,!1),x.routing.rules=yt(n,[X],!0,!1,!1);let A=Yo(n,l,H,_,a),D=Yo(n,l,H,"proxy",a);W.outbounds.unshift(A),x.outbounds.unshift(D,A),u.push(W),v.push(x);let E=structuredClone(A);E.tag=`prox-${M+1}`;let L=structuredClone(D);L.tag=`chain-${M+1}`,L.streamSettings.sockopt.dialerProxy=`prox-${M+1}`,h.push(E),g.push(L)}let B=await Wt(n,w,void 0,!1,!0),K=wt(n,`💦 Warp${y}- Best Ping 🚀`,!0,!1,!1,!0);K.dns=B,K.routing.rules=yt(n,w,!1,!0,!1),a==="xray-pro"&&K.outbounds.unshift(k),K.outbounds.unshift(...h);let V=wt(n,`💦 WoW${y}- Best Ping 🚀`,!0,!0,!1,!0);V.dns=B,V.routing.rules=yt(n,w,!0,!0,!1),a==="xray-pro"&&V.outbounds.unshift(k),V.outbounds.unshift(...g,...h);let J=[...u,...v,K,V];return new Response(JSON.stringify(J,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(Qo,"getXrayWarpConfigs");var dn={remarks:"",log:{loglevel:"warning"},dns:{},inbounds:[{port:10808,protocol:"socks",settings:{auth:"noauth",udp:!0,userLevel:8},sniffing:{destOverride:["http","tls"],enabled:!0,routeOnly:!0},tag:"socks-in"},{port:10809,protocol:"http",settings:{auth:"noauth",udp:!0,userLevel:8},sniffing:{destOverride:["http","tls"],enabled:!0,routeOnly:!0},tag:"http-in"},{port:10853,protocol:"dokodemo-door",settings:{address:"1.1.1.1",network:"tcp,udp",port:53},tag:"dns-in"}],outbounds:[{protocol:"dns",tag:"dns-out"},{protocol:"freedom",settings:{domainStrategy:"UseIP"},tag:"direct"},{protocol:"blackhole",settings:{response:{type:"http"}},tag:"block"}],policy:{levels:{8:{connIdle:300,downlinkOnly:1,handshake:4,uplinkOnly:1}},system:{statsOutboundUplink:!0,statsOutboundDownlink:!0}},routing:{domainStrategy:"IPIfNonMatch",rules:[],balancers:[{tag:"all",selector:["prox"],strategy:{type:"leastPing"}}]},observatory:{subjectSelector:["prox"],probeUrl:"https://www.gstatic.com/generate_204",probeInterval:"30s",enableConcurrency:!0},stats:{}};function Zo(t,r,a){let{remoteDNS:n,localDNS:l,VLTRFakeDNS:p,enableIPv6:u,warpFakeDNS:v,warpEnableIPv6:h,bypassIran:g,bypassChina:w,bypassRussia:y,blockAds:_,blockPorn:k,customBypassRules:B,customBlockRules:K}=t,V,J=Ot(n),M=p&&!a||v&&a,H=u&&!a||h&&a,X=B.split(",").filter((F=>De(F))),W=K.split(",").filter((F=>De(F))),x=[{rule:g,type:"direct",geosite:"geosite-ir",geoip:"geoip-ir"},{rule:w,type:"direct",geosite:"geosite-cn",geoip:"geoip-cn"},{rule:y,type:"direct",geosite:"geosite-category-ru",geoip:"geoip-ru"},{rule:!0,type:"block",geosite:"geosite-malware"},{rule:!0,type:"block",geosite:"geosite-phishing"},{rule:!0,type:"block",geosite:"geosite-cryptominers"},{rule:_,type:"block",geosite:"geosite-category-ads-all"},{rule:k,type:"block",geosite:"geosite-nsfw"}],A=[{address:a?"1.1.1.1":n,address_resolver:J.isHostDomain?"doh-resolver":"dns-direct",detour:"✅ Selector",tag:"dns-remote"},{address:l==="localhost"?"local":l,detour:"direct",tag:"dns-direct"},{address:"local",tag:"dns-local"}];J.isHostDomain&&!a&&A.push({address:"https://8.8.8.8/dns-query",detour:"✅ Selector",tag:"doh-resolver"});let D;if(a)D={outbound:"any",server:"dns-direct"};else{let F=r.filter((ne=>De(ne)));D={domain:[...new Set(F)],server:"dns-direct"}}let E=[D,{domain:"www.gstatic.com",server:"dns-local"},{domain:["raw.githubusercontent.com","time.apple.com"],server:"dns-direct"},{clash_mode:"Direct",server:"dns-direct"},{clash_mode:"Global",server:"dns-remote"}],L={disable_cache:!0,rule_set:[],action:"reject"};x.forEach((({rule:F,type:Y,geosite:ne,geoip:ie})=>{F&&Y==="direct"&&E.push({type:"logical",mode:"and",rules:[{rule_set:ne},{rule_set:ie}],server:"dns-direct"}),F&&Y==="block"&&L.rule_set.push(ne)})),E.push(L);let R=f((F=>({domain_suffix:[],server:F})),"createRule"),z,P;return X.length&&(z=R("dns-direct"),X.forEach((F=>{z.domain_suffix.push(F)})),E.push(z)),W.length&&(P=R("dns-block"),W.forEach((F=>{P.domain_suffix.push(F)})),E.push(P)),M&&(A.push({address:"fakeip",tag:"dns-fake"}),E.push({disable_cache:!0,inbound:"tun-in",query_type:["A","AAAA"],server:"dns-fake"}),V={enabled:!0,inet4_range:"198.18.0.0/15"},H&&(V.inet6_range="fc00::/18")),{servers:A,rules:E,fakeip:V}}f(Zo,"buildSingBoxDNS");function ea(t){let{bypassLAN:r,bypassIran:a,bypassChina:n,bypassRussia:l,blockAds:p,blockPorn:u,blockUDP443:v,customBypassRules:h,customBlockRules:g}=t,w=h?h.split(","):[],y=g?g.split(","):[],_=[{action:"sniff"},{action:"hijack-dns",mode:"or",rules:[{inbound:"dns-in"},{protocol:"dns"}],type:"logical"},{clash_mode:"Direct",outbound:"direct"},{clash_mode:"Global",outbound:"✅ Selector"}],k=[{rule:a,type:"direct",ruleSet:{geosite:"geosite-ir",geoip:"geoip-ir",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs"}},{rule:n,type:"direct",ruleSet:{geosite:"geosite-cn",geoip:"geoip-cn",geositeURL:"https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",geoipURL:"https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs"}},{rule:l,type:"direct",ruleSet:{geosite:"geosite-category-ru",geoip:"geoip-ru",geositeURL:"https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ru.srs",geoipURL:"https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-ru.srs"}},{rule:!0,type:"block",ruleSet:{geosite:"geosite-malware",geoip:"geoip-malware",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs"}},{rule:!0,type:"block",ruleSet:{geosite:"geosite-phishing",geoip:"geoip-phishing",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs"}},{rule:!0,type:"block",ruleSet:{geosite:"geosite-cryptominers",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs"}},{rule:p,type:"block",ruleSet:{geosite:"geosite-category-ads-all",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs"}},{rule:u,type:"block",ruleSet:{geosite:"geosite-nsfw",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs"}}],B=[],K=[],V=[],J=[],M=[];r&&K.push({ip_is_private:!0,outbound:"direct"});let H=f(((z,P)=>P==="direct"?{[z]:[],outbound:P}:{[z]:[],action:P}),"createRule"),X={type:"remote",tag:"",format:"binary",url:"",download_detour:"direct"},W=H("rule_set","direct"),x=H("rule_set","direct"),A=H("rule_set","reject"),D=H("rule_set","reject");k.forEach((({rule:z,type:P,ruleSet:F})=>{if(!z)return;let{geosite:Y,geoip:ne,geositeURL:ie,geoipURL:Ie}=F,Z=P==="direct",fe=Z?W:A,we=Z?x:D;fe.rule_set.push(Y),M.push({...X,tag:Y,url:ie}),ne&&(we.rule_set.push(ne),M.push({...X,tag:ne,url:Ie}))}));let E=f(((z,P)=>{(z.rule_set?.length||z.domain_suffix?.length||z.ip_cidr?.length)&&P.push(z)}),"pushRuleIfNotEmpty");E(W,B),E(x,K),E(A,V),E(D,J);let L=f(((z,P)=>{let F=H("domain_suffix",P),Y=H("ip_cidr",P);z.forEach((ne=>{if(De(ne))F.domain_suffix.push(ne);else{let ie=Rt(ne)?ne.replace(/\[|\]/g,""):ne;Y.ip_cidr.push(ie)}})),E(F,P==="direct"?B:V),E(Y,P==="direct"?K:J)}),"processRules");w.length&&L(w,"direct"),y.length&&L(y,"reject");let R=[];return v&&R.push({network:"udp",port:443,protocol:"quic",action:"reject"}),R=[..._,...R,...V,...J,...B,...K],{rules:R,rule_set:M}}f(ea,"buildSingBoxRoutingRules");function un(t,r,a,n,l,p,u){let{userID:v,defaultHttpsPorts:h}=globalThis,{enableIPv6:g,proxyIP:w}=t,y=`/${nt(16)}${w?`/${btoa(w)}`:""}`,_=!!h.includes(n),k={type:atob("dmxlc3M="),server:a,server_port:+n,uuid:v,packet_encoding:"",tls:{alpn:"http/1.1",enabled:!0,insecure:u,server_name:p,utls:{enabled:!0,fingerprint:"randomized"}},transport:{early_data_header_name:"Sec-WebSocket-Protocol",max_early_data:2560,headers:{Host:l},path:y,type:"ws"},tag:r};return De(a)&&(k.domain_strategy=g?"prefer_ipv4":"ipv4_only"),_||delete k.tls,k}f(un,"buildSingBoxVLOutbound");function pn(t,r,a,n,l,p,u){let{TRPassword:v,defaultHttpsPorts:h}=globalThis,{enableIPv6:g,proxyIP:w}=t,y=`/tr${nt(16)}${w?`/${btoa(w)}`:""}`,_=!!h.includes(n),k={type:atob("dHJvamFu"),password:v,server:a,server_port:+n,tls:{alpn:"http/1.1",enabled:!0,insecure:u,server_name:p,utls:{enabled:!0,fingerprint:"randomized"}},transport:{early_data_header_name:"Sec-WebSocket-Protocol",max_early_data:2560,headers:{Host:l},path:y,type:"ws"},tag:r};return De(a)&&(k.domain_strategy=g?"prefer_ipv4":"ipv4_only"),_||delete k.tls,k}f(pn,"buildSingBoxTROutbound");function qo(t,r,a,n,l){let p=/\[(.*?)\]/,u=/[^:]*$/,v=n.includes("[")?n.match(p)[1]:n.split(":")[0],h=n.includes("[")?+n.match(u)[0]:+n.split(":")[1],g=l?"162.159.192.1":v,w=l?2408:h,{warpEnableIPv6:y}=t,{warpIPv6:_,reserved:k,publicKey:B,privateKey:K}=bt(r,l),V={address:["172.16.0.2/32",_],mtu:1280,peers:[{address:g,port:w,public_key:B,reserved:Pr(k),allowed_ips:["0.0.0.0/0","::/0"],persistent_keepalive_interval:5}],private_key:K,type:"wireguard",tag:a};return De(g)&&(V.domain_strategy=y?"prefer_ipv4":"ipv4_only"),l&&(V.detour=l),V}f(qo,"buildSingBoxWarpOutbound");function hn(t,r){if(["socks","http"].includes(t.protocol)){let{protocol:M,server:H,port:X,user:W,pass:x}=t,A={type:M,tag:"",server:H,server_port:+X,username:W,password:x,detour:""};return De(H)&&(A.domain_strategy=r?"prefer_ipv4":"ipv4_only"),M==="socks"&&(A.version="5"),A}let{server:a,port:n,uuid:l,flow:p,security:u,type:v,sni:h,fp:g,alpn:w,pbk:y,sid:_,headerType:k,host:B,path:K,serviceName:V}=t,J={type:atob("dmxlc3M="),tag:"",server:a,server_port:+n,uuid:l,flow:p,detour:""};if(De(a)&&(J.domain_strategy=r?"prefer_ipv4":"ipv4_only"),u==="tls"||u==="reality"){let M=w?w?.split(",").filter((H=>H!=="h2")):[];J.tls={enabled:!0,server_name:h,insecure:!1,alpn:M,utls:{enabled:!0,fingerprint:g}},u==="reality"&&(J.tls.reality={enabled:!0,public_key:y,short_id:_},delete J.tls.alpn)}if(k==="http"){let M=B?.split(",");J.transport={type:"http",host:M,path:K,method:"GET",headers:{Connection:["keep-alive"],"Content-Type":["application/octet-stream"]}}}if(v==="ws"){let M=K?.split("?ed=")[0],H=+K?.split("?ed=")[1]||0;J.transport={type:"ws",path:M,headers:{Host:B},max_early_data:H,early_data_header_name:"Sec-WebSocket-Protocol"}}return v==="grpc"&&(J.transport={type:"grpc",service_name:V}),J}f(hn,"buildSingBoxChainOutbound");async function ta(t,r){let{proxySettings:a,warpConfigs:n}=await qe(t,r),{warpEndpoints:l}=a,p=structuredClone(oa);p.endpoints=[];let u=Zo(a,void 0,!0),{rules:v,rule_set:h}=ea(a);p.dns.servers=u.servers,p.dns.rules=u.rules,u.fakeip&&(p.dns.fakeip=u.fakeip),p.route.rules=v,p.route.rule_set=h;let g=p.outbounds[0],w=p.outbounds[1];g.outbounds=["💦 Warp - Best Ping 🚀","💦 WoW - Best Ping 🚀"],p.outbounds.splice(2,0,structuredClone(w));let y=p.outbounds[2];w.tag="💦 Warp - Best Ping 🚀",w.interval=`${a.bestWarpInterval}s`,y.tag="💦 WoW - Best Ping 🚀",y.interval=`${a.bestWarpInterval}s`;let _=[],k=[];return l.split(",").forEach(((B,K)=>{let V=`💦 ${K+1} - Warp 🇮🇷`,J=`💦 ${K+1} - WoW 🌍`,M=qo(a,n,V,B,""),H=qo(a,n,J,B,V);p.endpoints.push(H,M),_.push(V),k.push(J),w.outbounds.push(V),y.outbounds.push(J)})),g.outbounds.push(..._,...k),new Response(JSON.stringify(p,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(ta,"getSingBoxWarpConfig");async function ra(t,r){let{hostName:a}=globalThis,{proxySettings:n}=await qe(t,r),l,{cleanIPs:p,ports:u,VLConfigs:v,TRConfigs:h,outProxy:g,outProxyParams:w,customCdnAddrs:y,customCdnHost:_,customCdnSni:k,bestVLTRInterval:B,enableIPv6:K}=n;if(g){let R=JSON.parse(w);try{l=hn(R,K)}catch(z){console.log("An error occured while parsing chain proxy: ",z),l=void 0,await r.kv.put("proxySettings",JSON.stringify({...n,outProxy:"",outProxyParams:{}}))}}let V=await xt(p,K),J=y?y.split(","):[],M=[...V,...J],H=structuredClone(oa),X=Zo(n,M,!1),{rules:W,rule_set:x}=ea(n);H.dns.servers=X.servers,H.dns.rules=X.rules,X.fakeip&&(H.dns.fakeip=X.fakeip),H.route.rules=W,H.route.rule_set=x;let A=H.outbounds[0],D=H.outbounds[1];A.outbounds=["💦 Best Ping 💥"],D.interval=`${B}s`,D.tag="💦 Best Ping 💥";let E=1;return[...v?[atob("VkxFU1M=")]:[],...h?[atob("VHJvamFu")]:[]].forEach((R=>{let z=1;u.forEach((P=>{M.forEach((F=>{let Y,ne,ie=J.includes(F),Ie=ie?"C":"",Z=ie?k:gt(a),fe=ie?_:a,we=ht(z,P,F,p,R,Ie);if(R===atob("VkxFU1M=")&&(Y=un(n,l?`proxy-${E}`:we,F,P,fe,Z,ie),H.outbounds.push(Y)),R===atob("VHJvamFu")&&(ne=pn(n,l?`proxy-${E}`:we,F,P,fe,Z,ie),H.outbounds.push(ne)),l){let le=structuredClone(l);le.tag=we,le.detour=`proxy-${E}`,H.outbounds.push(le)}A.outbounds.push(we),D.outbounds.push(we),E++,z++}))}))})),new Response(JSON.stringify(H,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(ra,"getSingBoxCustomConfig");var oa={log:{level:"warn",timestamp:!0},dns:{servers:[],rules:[],strategy:"ipv4_only",independent_cache:!0},inbounds:[{type:"direct",tag:"dns-in",listen:"0.0.0.0",listen_port:6450,override_address:"1.1.1.1",override_port:53},{type:"tun",tag:"tun-in",address:["172.18.0.1/30","fdfe:dcba:9876::1/126"],mtu:9e3,auto_route:!0,strict_route:!0,endpoint_independent_nat:!0,stack:"mixed"},{type:"mixed",tag:"mixed-in",listen:"0.0.0.0",listen_port:2080}],outbounds:[{type:"selector",tag:"✅ Selector",outbounds:[]},{type:"urltest",tag:"",outbounds:[],url:"https://www.gstatic.com/generate_204",interval:""},{type:"direct",domain_strategy:"ipv4_only",tag:"direct"}],route:{rules:[],rule_set:[],auto_detect_interface:!0,override_android_vpn:!0,final:"✅ Selector"},ntp:{enabled:!0,server:"time.apple.com",server_port:123,detour:"direct",interval:"30m"},experimental:{cache_file:{enabled:!0,store_fakeip:!0},clash_api:{external_controller:"127.0.0.1:9090",external_ui:"ui",external_ui_download_url:"https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",external_ui_download_detour:"direct",default_mode:"Rule"}}};async function na(t,r,a){let{remoteDNS:n,localDNS:l,VLTRFakeDNS:p,outProxyParams:u,enableIPv6:v,warpFakeDNS:h,warpEnableIPv6:g,bypassIran:w,bypassChina:y,bypassRussia:_,customBypassRules:k}=t,B=g?["1.1.1.1","1.0.0.1","[2606:4700:4700::1111]","[2606:4700:4700::1001]"]:["1.1.1.1","1.0.0.1"],K=l==="localhost"?"system":`${l}#DIRECT`,V=p&&!a||h&&a,J=v&&!a||g&&a,M=k.split(",").filter((A=>De(A))),H=w||y||_,X=[{rule:w,geosite:"ir"},{rule:y,geosite:"cn"},{rule:_,geosite:"ru"}],W={enable:!0,listen:"0.0.0.0:1053",ipv6:J,"respect-rules":!0,"use-system-hosts":!1,nameserver:a?B.map((A=>`${A}#✅ Selector`)):[r?`${n}#proxy-1`:`${n}#✅ Selector`],"proxy-server-nameserver":[K],"nameserver-policy":{"raw.githubusercontent.com":K,"time.apple.com":K,"www.gstatic.com":"system"}};if(r&&!a){let A=JSON.parse(u).server;De(A)&&(W["nameserver-policy"][A]=`${n}#proxy-1`)}if(H){let A=[];X.forEach((({rule:D,geosite:E})=>{D&&A.push(E)})),W["nameserver-policy"][`rule-set:${A.join(",")}`]=[`${l}#DIRECT`]}return M.forEach((A=>{W["nameserver-policy"][`+.${A}`]=[`${l}#DIRECT`]})),Ot(n).isHostDomain&&!a&&(W["default-nameserver"]=[`https://8.8.8.8/dns-query#${r?"proxy-1":"✅ Selector"}`]),V&&Object.assign(W,{"enhanced-mode":"fake-ip","fake-ip-range":"198.18.0.1/16","fake-ip-filter":["geosite:private"]}),W}f(na,"buildClashDNS");function sa(t){let{bypassLAN:r,bypassIran:a,bypassChina:n,bypassRussia:l,blockAds:p,blockPorn:u,blockUDP443:v,customBypassRules:h,customBlockRules:g}=t,w=h?h.split(","):[],y=g?g.split(","):[],_=[{rule:r,type:"direct",noResolve:!0,ruleProvider:{format:"yaml",geosite:"private",geoip:"private-cidr",geositeURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.yaml",geoipURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.yaml"}},{rule:a,type:"direct",ruleProvider:{format:"text",geosite:"ir",geoip:"ir-cidr",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",geoipURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"}},{rule:n,type:"direct",ruleProvider:{format:"yaml",geosite:"cn",geoip:"cn-cidr",geositeURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",geoipURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"}},{rule:l,type:"direct",ruleProvider:{format:"yaml",geosite:"ru",geoip:"ru-cidr",geositeURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",geoipURL:"https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"}},{rule:!0,type:"block",ruleProvider:{format:"text",geosite:"malware",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt"}},{rule:!0,type:"block",ruleProvider:{format:"text",geosite:"phishing",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt"}},{rule:!0,type:"block",ruleProvider:{format:"text",geosite:"cryptominers",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"}},{rule:p,type:"block",ruleProvider:{format:"text",geosite:"ads",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ads.txt"}},{rule:u,type:"block",ruleProvider:{format:"text",geosite:"nsfw",geositeURL:"https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt"}}];function k(W,x,A,D){let E=x==="text"?"txt":x;return{[W]:{type:"http",format:x,behavior:A,url:D,path:`./ruleset/${W}.${E}`,interval:86400}}}f(k,"buildRuleProvider");let B=[],K=[],V=[],J=[],M={};_.forEach((({rule:W,type:x,ruleProvider:A,noResolve:D})=>{let{geosite:E,geoip:L,geositeURL:R,geoipURL:z,format:P}=A;if(W){if(E){(x==="direct"?B:V).push(`RULE-SET,${E},${x==="direct"?"DIRECT":"REJECT"}`);let Y=k(E,P,"domain",R);Object.assign(M,Y)}if(L){(x==="direct"?K:J).push(`RULE-SET,${L},${x==="direct"?"DIRECT":"REJECT"}${D?",no-resolve":""}`);let Y=k(L,P,"ipcidr",z);Object.assign(M,Y)}}}));let H=f(((W,x)=>{if(De(W))return`DOMAIN-SUFFIX,${W},${x}`;{let A=Er(W)?"IP-CIDR":"IP-CIDR6",D=Rt(W)?W.replace(/\[|\]/g,""):W,E=W.includes("/")?"":Er(W)?"/32":"/128";return`${A},${D}${E},${x},no-resolve`}}),"generateRule");[...w,...y].forEach(((W,x)=>{let A=x<w.length,D=A?"DIRECT":"REJECT";(A?De(W)?B:K:De(W)?V:J).push(H(W,D))}));let X=[];return v&&X.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT"),X.push("OR,((IP-CIDR,10.10.34.34/32),(IP-CIDR,10.10.34.35/32),(IP-CIDR,10.10.34.36/32)),REJECT"),X=[...X,...V,...J,...B,...K],X.push("MATCH,✅ Selector"),{rules:X,ruleProviders:M}}f(sa,"buildClashRoutingRules");function mn(t,r,a,n,l,p,u){let{userID:v,defaultHttpsPorts:h}=globalThis,g=!!h.includes(a),w=Rt(r)?r.replace(/\[|\]/g,""):r,y={name:t,type:atob("dmxlc3M="),server:w,port:+a,uuid:v,"packet-encoding":"",tls:g,network:"ws",udp:!0,"ws-opts":{path:p,headers:{host:n},"max-early-data":2560,"early-data-header-name":"Sec-WebSocket-Protocol"}};return g&&Object.assign(y,{servername:l,alpn:["h2","http/1.1"],"client-fingerprint":"random","skip-cert-verify":u}),y}f(mn,"buildClashVLOutbound");function xn(t,r,a,n,l,p,u){let v=Rt(r)?r.replace(/\[|\]/g,""):r;return{name:t,type:atob("dHJvamFu"),server:v,port:+a,password:globalThis.TRPassword,network:"ws",udp:!0,"ws-opts":{path:p,headers:{host:n},"max-early-data":2560,"early-data-header-name":"Sec-WebSocket-Protocol"},sni:l,alpn:["h2","http/1.1"],"client-fingerprint":"random","skip-cert-verify":u}}f(xn,"buildClashTROutbound");function aa(t,r,a,n){let l=/\[(.*?)\]/,p=/[^:]*$/,u=a.includes("[")?a.match(l)[1]:a.split(":")[0],v=a.includes("[")?+a.match(p)[0]:+a.split(":")[1],{warpIPv6:h,reserved:g,publicKey:w,privateKey:y}=bt(t,n),_={name:r,type:"wireguard",ip:"172.16.0.2/32",ipv6:h,"private-key":y,server:n?"162.159.192.1":u,port:n?2408:v,"public-key":w,"allowed-ips":["0.0.0.0/0","::/0"],reserved:g,udp:!0,mtu:1280};return n&&(_["dialer-proxy"]=n),_}f(aa,"buildClashWarpOutbound");function bn(t){if(["socks","http"].includes(t.protocol)){let{protocol:J,server:M,port:H,user:X,pass:W}=t;return{name:"",type:J==="socks"?"socks5":J,server:M,port:+H,"dialer-proxy":"",username:X,password:W}}let{server:r,port:a,uuid:n,flow:l,security:p,type:u,sni:v,fp:h,alpn:g,pbk:w,sid:y,headerType:_,host:k,path:B,serviceName:K}=t,V={name:"💦 Chain Best Ping 💥",type:atob("dmxlc3M="),server:r,port:+a,udp:!0,uuid:n,flow:l,network:u,"dialer-proxy":"💦 Best Ping 💥"};if(p==="tls"){let J=g?g?.split(","):[];Object.assign(V,{tls:!0,servername:v,alpn:J,"client-fingerprint":h})}if(p==="reality"&&Object.assign(V,{tls:!0,servername:v,"client-fingerprint":h,"reality-opts":{"public-key":w,"short-id":y}}),_==="http"){let J=B?.split(",");V["http-opts"]={method:"GET",path:J,headers:{Connection:["keep-alive"],"Content-Type":["application/octet-stream"]}}}if(u==="ws"){let J=B?.split("?ed=")[0],M=+B?.split("?ed=")[1];V["ws-opts"]={path:J,headers:{Host:k},"max-early-data":M,"early-data-header-name":"Sec-WebSocket-Protocol"}}return u==="grpc"&&(V["grpc-opts"]={"grpc-service-name":K}),V}f(bn,"buildClashChainOutbound");async function ia(t,r){let{proxySettings:a,warpConfigs:n}=await qe(t,r),{warpEndpoints:l}=a,p=structuredClone(la);p.dns=await na(a,!0,!0);let{rules:u,ruleProviders:v}=sa(a);p.rules=u,p["rule-providers"]=v;let h=p["proxy-groups"][0],g=p["proxy-groups"][1];h.proxies=["💦 Warp - Best Ping 🚀","💦 WoW - Best Ping 🚀"],g.name="💦 Warp - Best Ping 🚀",g.interval=+a.bestWarpInterval,p["proxy-groups"].push(structuredClone(g));let w=p["proxy-groups"][2];w.name="💦 WoW - Best Ping 🚀";let y=[],_=[];return l.split(",").forEach(((k,B)=>{let K=`💦 ${B+1} - Warp 🇮🇷`,V=`💦 ${B+1} - WoW 🌍`,J=aa(n,K,k,""),M=aa(n,V,k,K);p.proxies.push(M,J),y.push(K),_.push(V),g.proxies.push(K),w.proxies.push(V)})),h.proxies.push(...y,..._),new Response(JSON.stringify(p,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(ia,"getClashWarpConfig");async function ca(t,r){let{hostName:a,defaultHttpsPorts:n}=globalThis,{proxySettings:l}=await qe(t,r),p,{cleanIPs:u,proxyIP:v,ports:h,VLConfigs:g,TRConfigs:w,outProxy:y,outProxyParams:_,customCdnAddrs:k,customCdnHost:B,customCdnSni:K,bestVLTRInterval:V,enableIPv6:J}=l;if(y){let P=JSON.parse(_);try{p=bn(P)}catch(F){console.log("An error occured while parsing chain proxy: ",F),p=void 0,await r.kv.put("proxySettings",JSON.stringify({...l,outProxy:"",outProxyParams:{}}))}}let M=structuredClone(la),{rules:H,ruleProviders:X}=sa(l);M.dns=await na(l,p,!1),M.rules=H,M["rule-providers"]=X;let W=M["proxy-groups"][0],x=M["proxy-groups"][1];W.proxies=["💦 Best Ping 💥"],x.name="💦 Best Ping 💥",x.interval=+V;let A=await xt(u,J),D=k?k.split(","):[],E=[...A,...D],L=1,R;return[...g?[atob("VkxFU1M=")]:[],...w?[atob("VHJvamFu")]:[]].forEach((P=>{let F=1;h.forEach((Y=>{E.forEach((ne=>{let ie,Ie,Z=D.includes(ne),fe=Z?"C":"",we=Z?K:gt(a),le=Z?B:a,Pe=ht(F,Y,ne,u,P,fe).replace(" : "," - ");if(P===atob("VkxFU1M=")&&(R=`/${nt(16)}${v?`/${btoa(v)}`:""}`,ie=mn(p?`proxy-${L}`:Pe,ne,Y,le,we,R,Z),M.proxies.push(ie),W.proxies.push(Pe),x.proxies.push(Pe)),P===atob("VHJvamFu")&&n.includes(Y)&&(R=`/tr${nt(16)}${v?`/${btoa(v)}`:""}`,Ie=xn(p?`proxy-${L}`:Pe,ne,Y,le,we,R,Z),M.proxies.push(Ie),W.proxies.push(Pe),x.proxies.push(Pe)),p){let se=structuredClone(p);se.name=Pe,se["dialer-proxy"]=`proxy-${L}`,M.proxies.push(se)}L++,F++}))}))})),new Response(JSON.stringify(M,null,4),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(ca,"getClashNormalConfig");var la={"mixed-port":7890,ipv6:!0,"allow-lan":!0,mode:"rule","log-level":"warning","disable-keep-alive":!1,"keep-alive-idle":30,"keep-alive-interval":30,"unified-delay":!1,"geo-auto-update":!0,"geo-update-interval":168,"external-controller":"127.0.0.1:9090","external-ui-url":"https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip","external-ui":"ui","external-controller-cors":{"allow-origins":["*"],"allow-private-network":!0},profile:{"store-selected":!0,"store-fake-ip":!0},dns:{},tun:{enable:!0,stack:"mixed","auto-route":!0,"strict-route":!0,"auto-detect-interface":!0,"dns-hijack":["any:53"],mtu:9e3},sniffer:{enable:!0,"force-dns-mapping":!0,"parse-pure-ip":!0,"override-destination":!1,sniff:{HTTP:{ports:[80,8080,8880,2052,2082,2086,2095]},TLS:{ports:[443,8443,2053,2083,2087,2096]}}},proxies:[],"proxy-groups":[{name:"✅ Selector",type:"select",proxies:[]},{name:"",type:"url-test",url:"https://www.gstatic.com/generate_204",interval:30,tolerance:50,proxies:[]}],"rule-providers":{},rules:[],ntp:{enable:!0,server:"time.apple.com",port:123,interval:30}};async function oo(t,r){let{hostName:a,defaultHttpsPorts:n,client:l,userID:p,TRPassword:u}=globalThis,{proxySettings:v}=await qe(t,r),{remoteDNS:h,cleanIPs:g,proxyIP:w,ports:y,VLConfigs:_,TRConfigs:k,lengthMin:B,lengthMax:K,intervalMin:V,intervalMax:J,outProxy:M,customCdnAddrs:H,customCdnHost:X,customCdnSni:W,enableIPv6:x}=v,A="",D="",E="",L=1,R=await xt(g,x),z=H?H.split(","):[],P=[...R,...z],F=l==="singbox"?"http/1.1":"h2,http/1.1",Y=encodeURIComponent(u),ne=l==="singbox"?"&eh=Sec-WebSocket-Protocol&ed=2560":encodeURIComponent("?ed=2560");if(y.forEach((Z=>{P.forEach(((fe,we)=>{let le=we>R.length-1,Pe=le?"C":"",se=le?W:gt(a),Me=le?X:a,vt=`${nt(16)}${w?`/${encodeURIComponent(btoa(w))}`:""}${ne}`,_t=encodeURIComponent(ht(L,Z,fe,g,atob("VkxFU1M="),Pe)),st=encodeURIComponent(ht(L,Z,fe,g,atob("VHJvamFu"),Pe)),it=n.includes(Z)?`&security=tls&sni=${se}&fp=randomized&alpn=${F}`:"&security=none",It=l==="hiddify-frag"&&n.includes(Z)?`&fragment=${B}-${K},${V}-${J},hellotls`:"";_&&(A+=`${atob("dmxlc3M6Ly8=")}${p}@${fe}:${Z}?path=/${vt}&encryption=none&host=${Me}&type=ws${it}${It}#${_t}\n`),k&&(D+=`${atob("dHJvamFuOi8v")}${Y}@${fe}:${Z}?path=/tr${vt}&host=${Me}&type=ws${it}${It}#${st}\n`),L++}))})),M){let Z=`#${encodeURIComponent("💦 Chain proxy 🔗")}`;if(M.startsWith("socks")||M.startsWith("http")){let fe=/^(?:socks|http):\/\/([^@]+)@/,we=M.match(fe),le=we?we[1]:!1;E=le?M.replace(le,btoa(le))+Z:M+Z}else E=M.split("#")[0]+Z}let ie=btoa(A+D+E),Ie={"Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"};return l==="hiddify-frag"&&Object.assign(Ie,{"Profile-Title":"BPB Fragment",DNS:h}),new Response(ie,{status:200,headers:Ie})}f(oo,"getNormalConfigs");async function ao(t,r,a){let{proxySettings:n,warpConfigs:l}=await qe(t,r),{warpEndpoints:p,hiddifyNoiseMode:u,noiseCountMin:v,noiseCountMax:h,noiseSizeMin:g,noiseSizeMax:w,noiseDelayMin:y,noiseDelayMax:_}=n,k="";return p.split(",").forEach(((B,K)=>{k+=`warp://${B}${a?`?ifp=${v}-${h}&ifps=${g}-${w}&ifpd=${y}-${_}&ifpm=${u}`:""}#${encodeURIComponent(`💦 ${K+1} - Warp 🇮🇷`)}&&detour=warp://162.159.192.1:2408#${encodeURIComponent(`💦 ${K+1} - WoW 🌍`)}\n`})),new Response(btoa(k),{status:200,headers:{"Profile-Title":`BPB Warp${a?" Pro":""}`,DNS:"1.1.1.1","Content-Type":"text/plain;charset=utf-8","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate","CDN-Cache-Control":"no-store"}})}f(ao,"getHiddifyWarpConfigs");async function fa(){let t=`\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${atob("QlBC")} Generator</title>\n    <style>\n        :root {\n            --color: black;\n            --primary-color: #09639f;\n            --header-color: #09639f; \n            --background-color: #fff;\n            --form-background-color: #f9f9f9;\n            --lable-text-color: #333;\n            --h2-color: #3b3b3b;\n            --border-color: #ddd;\n            --input-background-color: white;\n            --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);\n        }\n        html, body { height: 100%; margin: 0; }\n        body {\n            font-family: system-ui;\n            background-color: var(--background-color);\n            position: relative;\n            overflow: hidden;\n            text-align: center;\n        }\n        body.dark-mode {\n            --color: white;\n            --primary-color: #09639F;\n            --header-color: #3498DB; \n            --background-color: #121212;\n            --form-background-color: #121212;\n            --lable-text-color: #DFDFDF;\n            --h2-color: #D5D5D5;\n            --border-color: #353535;\n            --input-background-color: #252525;\n            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);\n        }\n        html, body { height: 100%; margin: 0; }\n        .container {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            width: 90%;\n        }\n        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        \n        h2 { text-align: center; color: var(--h2-color) }\n        strong { color: var(--lable-text-color); }\n        .output-container {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin: 15px 0;\n            padding: 10px;\n            background-color: var(--input-background-color);\n            color: var(--lable-text-color);\n            border: 1px solid var(--border-color);\n            border-radius: 5px;\n            font-family: monospace;\n            font-size: 1rem;\n            word-wrap: break-word;\n        }\n        .output { flex: 1; margin-right: 10px; overflow-wrap: break-word; }\n        .copy-icon {\n            cursor: pointer;\n            font-size: 1.2rem;\n            color: var(--primary-color);\n            transition: color 0.2s;\n        }\n        .copy-icon:hover { color: #2980b9; }\n        .form-container {\n            background: var(--form-background-color);\n            border: 1px solid var(--border-color);\n            border-radius: 10px;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n            padding: 20px;\n        }\n        .form-control { margin-bottom: 15px; display: flex; align-items: center; }\n        button {\n            display: block;\n            width: 100%;\n            padding: 10px;\n            font-size: 16px;\n            font-weight: 600;\n            border: none;\n            border-radius: 5px;\n            color: white;\n            background-color: var(--primary-color);\n            cursor: pointer;\n            transition: background-color 0.3s ease;\n        }\n        .button:hover,\n        button:focus {\n            background-color: #2980b9;\n            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);\n            transform: translateY(-2px);\n        }\n        button.button:hover { color: white; }\n        .button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }\n        @media only screen and (min-width: 768px) {\n            .container { width: 40%; }\n        }\n    </style>\n    </head>\n    <body>\n        <div class="container">\n            <h1>${atob("QlBC")} Panel <span style="font-size: smaller;">${globalThis.panelVersion}</span> 💦</h1>\n            <div class="form-container">\n                <h2>Secrets generator</h2>\n                <div>\n                    <strong>Random UUID</strong>\n                    <div class="output-container">\n                        <span id="uuid" class="output"></span>\n                        <span class="copy-icon" onclick="copyToClipboard('uuid')">📋</span>\n                    </div>\n                </div>\n                <div>\n                    <strong>Random ${atob("VHJvamFu")} Password</strong>\n                    <div class="output-container">\n                        <span id="${atob("dHJvamFu")}-password" class="output"></span>\n                        <span class="copy-icon" onclick="copyToClipboard('${atob("dHJvamFu")}-password')">📋</span>\n                    </div>\n                </div>\n                <div>\n                    <strong>Random Subscription URI path</strong>\n                    <div class="output-container">\n                        <span id="sub-path" class="output"></span>\n                        <span class="copy-icon" onclick="copyToClipboard('sub-path')">📋</span>\n                    </div>\n                </div>\n                <button class="button" onclick="generateCredentials()">Generate Again ♻️</button>\n            </div>\n        </div>\n        <script>\n            localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');\n            function generateUUID() {\n                return crypto.randomUUID();\n            }\n    \n            function generateStrongPassword() {\n                const charset =\n                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";\n                let password = '';\n                const randomValues = new Uint8Array(16);\n                crypto.getRandomValues(randomValues);\n    \n                for (let i = 0; i < 16; i++) {\n                    password += charset[randomValues[i] % charset.length];\n                }\n                return password;\n            }\n            \n            function generateSubURIPath() {\n                const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&*_-+;:,.";\n                let uriPath = '';\n                const randomValues = new Uint8Array(16);\n                crypto.getRandomValues(randomValues);\n    \n                for (let i = 0; i < 16; i++) {\n                    uriPath += charset[randomValues[i] % charset.length];\n                }\n                return uriPath;\n            }\n    \n            function generateCredentials() {\n                const uuid = generateUUID();\n                const password = generateStrongPassword();\n                const uriPath = generateSubURIPath();\n    \n                document.getElementById('uuid').textContent = uuid;\n                document.getElementById('${atob("dHJvamFu")}-password').textContent = password;\n                document.getElementById('sub-path').textContent = uriPath;\n            }\n    \n            function copyToClipboard(elementId) {\n                const textToCopy = document.getElementById(elementId).textContent;\n                navigator.clipboard.writeText(textToCopy)\n                    .then(() => alert('✅ Copied to clipboard!'))\n                    .catch(err => console.error('Failed to copy text:', err));\n            }\n    \n            generateCredentials();\n        <\/script>\n    </body>\n    </html>`;return new Response(t,{status:200,headers:{"Content-Type":"text/html"}})}f(fa,"renderSecretsPage");var pl={async fetch(t,r){try{Uo(t,r);let{pathName:a,subPath:n,client:l}=globalThis,p=t.headers.get("Upgrade");if(!p||p!=="websocket")switch(a){case"/update-warp":return await Zr(t,r);case"/get-warp-configs":return await Bo(t,r);case`/sub/${n}`:return l==="sfa"?await ra(t,r,!1):l==="clash"?await ca(t,r):l==="xray"?await ro(t,r,!1):await oo(t,r);case`/fragsub/${n}`:return l==="hiddify-frag"?await oo(t,r):await ro(t,r,!0);case`/warpsub/${n}`:return l==="clash"?await ia(t,r):l==="singbox"?await ta(t,r,l):l==="hiddify-pro"?await ao(t,r,!0):l==="hiddify"?await ao(t,r,!1):await Qo(t,r,l);case"/panel":return await No(t,r);case"/login":return await To(t,r);case"/logout":return _o();case"/panel/password":return await Io(t,r);case"/my-ip":return await Mo(t);case"/secrets":return await fa();default:return await Fo(t)}else return a.startsWith("/tr")?await zo(t):await Wo(t)}catch(a){return await Go(a)}}};export{pl as default};
>>>>>>> 1dd685e3cfd05fb416fbc20cf3b6f1773df09627

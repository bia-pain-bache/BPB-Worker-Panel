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
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
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
        if (init)
          for (i = 0; i < init.length; i++)
            r[i] = init[i];
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
        for (i = 0; i < n; i++)
          d |= x[xi + i] ^ y[yi + i];
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
        for (i = 0; i < 16; i++)
          z[i] = 0;
        for (i = 0; i < 8; i++)
          z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++)
            c[cpos + i] = m[mpos + i] ^ x[i];
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
          for (i = 0; i < b; i++)
            c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
      }
      __name(crypto_stream_salsa20_xor, "crypto_stream_salsa20_xor");
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u, i;
        for (i = 0; i < 16; i++)
          z[i] = 0;
        for (i = 0; i < 8; i++)
          z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++)
            c[cpos + i] = x[i];
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
          for (i = 0; i < b; i++)
            c[cpos + i] = x[i];
        }
        return 0;
      }
      __name(crypto_stream_salsa20, "crypto_stream_salsa20");
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++)
          sn[i] = n[i + 16];
        return crypto_stream_salsa20(c, cpos, d, sn, s);
      }
      __name(crypto_stream, "crypto_stream");
      function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++)
          sn[i] = n[i + 16];
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
          for (; i < 16; i++)
            this.buffer[i] = 0;
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
        for (i = 0; i < 10; i++)
          g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++)
          this.h[i] = this.h[i] & mask | g[i];
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
        if (d < 32)
          return -1;
        crypto_stream_xor(c, 0, m, 0, d, n, k);
        crypto_onetimeauth(c, 16, c, 32, d - 32, c);
        for (i = 0; i < 16; i++)
          c[i] = 0;
        return 0;
      }
      __name(crypto_secretbox, "crypto_secretbox");
      function crypto_secretbox_open(m, c, d, n, k) {
        var i;
        var x = new Uint8Array(32);
        if (d < 32)
          return -1;
        crypto_stream(x, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0)
          return -1;
        crypto_stream_xor(m, 0, c, 0, d, n, k);
        for (i = 0; i < 32; i++)
          m[i] = 0;
        return 0;
      }
      __name(crypto_secretbox_open, "crypto_secretbox_open");
      function set25519(r, a) {
        var i;
        for (i = 0; i < 16; i++)
          r[i] = a[i] | 0;
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
        for (i = 0; i < 16; i++)
          t[i] = n[i];
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
        for (i = 0; i < 16; i++)
          o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 32767;
      }
      __name(unpack25519, "unpack25519");
      function A(o, a, b) {
        for (var i = 0; i < 16; i++)
          o[i] = a[i] + b[i];
      }
      __name(A, "A");
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++)
          o[i] = a[i] - b[i];
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
        for (a = 0; a < 16; a++)
          c[a] = i[a];
        for (a = 253; a >= 0; a--) {
          S(c, c);
          if (a !== 2 && a !== 4)
            M(c, c, i);
        }
        for (a = 0; a < 16; a++)
          o[a] = c[a];
      }
      __name(inv25519, "inv25519");
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++)
          c[a] = i[a];
        for (a = 250; a >= 0; a--) {
          S(c, c);
          if (a !== 1)
            M(c, c, i);
        }
        for (a = 0; a < 16; a++)
          o[a] = c[a];
      }
      __name(pow2523, "pow2523");
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32);
        var x = new Float64Array(80), r, i;
        var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
        for (i = 0; i < 31; i++)
          z[i] = n[i];
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
        for (i = 0; i < n; i++)
          x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++)
          ts64(out, 8 * i, hh[i], hl[i]);
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
        if (!seeded)
          randombytes(sk, 32);
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i = 0; i < 32; i++)
          sk[i + 32] = pk[i];
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
        for (j = 0; j < 32; j++)
          x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      __name(modL, "modL");
      function reduce(r) {
        var x = new Float64Array(64), i;
        for (i = 0; i < 64; i++)
          x[i] = r[i];
        for (i = 0; i < 64; i++)
          r[i] = 0;
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
        for (i = 0; i < n; i++)
          sm[64 + i] = m[i];
        for (i = 0; i < 32; i++)
          sm[32 + i] = d[32 + i];
        crypto_hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; i++)
          sm[i] = sk[i];
        crypto_hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++)
          x[i] = 0;
        for (i = 0; i < 32; i++)
          x[i] = r[i];
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
        if (neq25519(chk, num))
          M(r[0], r[0], I);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num))
          return -1;
        if (par25519(r[0]) === p[31] >> 7)
          Z(r[0], gf0, r[0]);
        M(r[3], r[0], r[1]);
        return 0;
      }
      __name(unpackneg, "unpackneg");
      function crypto_sign_open(m, sm, n, pk) {
        var i;
        var t = new Uint8Array(32), h = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        if (n < 64)
          return -1;
        if (unpackneg(q, pk))
          return -1;
        for (i = 0; i < n; i++)
          m[i] = sm[i];
        for (i = 0; i < 32; i++)
          m[i + 32] = pk[i];
        crypto_hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++)
            m[i] = 0;
          return -1;
        }
        for (i = 0; i < n; i++)
          m[i] = sm[i + 64];
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
        if (k.length !== crypto_secretbox_KEYBYTES)
          throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES)
          throw new Error("bad nonce size");
      }
      __name(checkLengths, "checkLengths");
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
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
        for (var i = 0; i < arr.length; i++)
          arr[i] = 0;
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
        for (var i = 0; i < msg.length; i++)
          m[i + crypto_secretbox_ZEROBYTES] = msg[i];
        crypto_secretbox(c, m, m.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl3.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m = new Uint8Array(c.length);
        for (var i = 0; i < box.length; i++)
          c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
        if (c.length < 32)
          return null;
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0)
          return null;
        return m.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl3.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl3.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl3.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl3.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES)
          throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES)
          throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl3.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES)
          throw new Error("bad n size");
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
        if (mlen < 0)
          return null;
        var m = new Uint8Array(mlen);
        for (var i = 0; i < m.length; i++)
          m[i] = tmp[i];
        return m;
      };
      nacl3.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl3.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i = 0; i < sig.length; i++)
          sig[i] = signedMsg[i];
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
        for (i = 0; i < crypto_sign_BYTES; i++)
          sm[i] = sig[i];
        for (i = 0; i < msg.length; i++)
          sm[i + crypto_sign_BYTES] = msg[i];
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
        for (var i = 0; i < pk.length; i++)
          pk[i] = secretKey[32 + i];
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl3.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i = 0; i < 32; i++)
          sk[i] = seed[i];
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
        if (x.length === 0 || y.length === 0)
          return false;
        if (x.length !== y.length)
          return false;
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
            for (i = 0; i < n; i++)
              x[i] = v[i];
            cleanup(v);
          });
        } else if (typeof __require !== "undefined") {
          crypto2 = require_crypto();
          if (crypto2 && crypto2.randomBytes) {
            nacl3.setPRNG(function(x, n) {
              var i, v = crypto2.randomBytes(n);
              for (i = 0; i < n; i++)
                x[i] = v[i];
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
  constructor(message2, options) {
    super(message2, options);
    this.code = "ERR_JOSE_GENERIC";
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
__name(JOSEError, "JOSEError");
JOSEError.code = "ERR_JOSE_GENERIC";
var JWTClaimValidationFailed = class extends JOSEError {
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
__name(JWTClaimValidationFailed, "JWTClaimValidationFailed");
JWTClaimValidationFailed.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
var JWTExpired = class extends JOSEError {
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_EXPIRED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
__name(JWTExpired, "JWTExpired");
JWTExpired.code = "ERR_JWT_EXPIRED";
var JOSEAlgNotAllowed = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
};
__name(JOSEAlgNotAllowed, "JOSEAlgNotAllowed");
JOSEAlgNotAllowed.code = "ERR_JOSE_ALG_NOT_ALLOWED";
var JOSENotSupported = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
};
__name(JOSENotSupported, "JOSENotSupported");
JOSENotSupported.code = "ERR_JOSE_NOT_SUPPORTED";
var JWEDecryptionFailed = class extends JOSEError {
  constructor(message2 = "decryption operation failed", options) {
    super(message2, options);
    this.code = "ERR_JWE_DECRYPTION_FAILED";
  }
};
__name(JWEDecryptionFailed, "JWEDecryptionFailed");
JWEDecryptionFailed.code = "ERR_JWE_DECRYPTION_FAILED";
var JWEInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWE_INVALID";
  }
};
__name(JWEInvalid, "JWEInvalid");
JWEInvalid.code = "ERR_JWE_INVALID";
var JWSInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWS_INVALID";
  }
};
__name(JWSInvalid, "JWSInvalid");
JWSInvalid.code = "ERR_JWS_INVALID";
var JWTInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWT_INVALID";
  }
};
__name(JWTInvalid, "JWTInvalid");
JWTInvalid.code = "ERR_JWT_INVALID";
var JWKInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWK_INVALID";
  }
};
__name(JWKInvalid, "JWKInvalid");
JWKInvalid.code = "ERR_JWK_INVALID";
var JWKSInvalid = class extends JOSEError {
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_INVALID";
  }
};
__name(JWKSInvalid, "JWKSInvalid");
JWKSInvalid.code = "ERR_JWKS_INVALID";
var JWKSNoMatchingKey = class extends JOSEError {
  constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_NO_MATCHING_KEY";
  }
};
__name(JWKSNoMatchingKey, "JWKSNoMatchingKey");
JWKSNoMatchingKey.code = "ERR_JWKS_NO_MATCHING_KEY";
var JWKSMultipleMatchingKeys = class extends JOSEError {
  constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
};
__name(JWKSMultipleMatchingKeys, "JWKSMultipleMatchingKeys");
JWKSMultipleMatchingKeys.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
var JWKSTimeout = class extends JOSEError {
  constructor(message2 = "request timed out", options) {
    super(message2, options);
    this.code = "ERR_JWKS_TIMEOUT";
  }
};
__name(JWKSTimeout, "JWKSTimeout");
JWKSTimeout.code = "ERR_JWKS_TIMEOUT";
var JWSSignatureVerificationFailed = class extends JOSEError {
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
    this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
};
__name(JWSSignatureVerificationFailed, "JWSSignatureVerificationFailed");
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
      if (jwk.oth !== void 0) {
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
__name(FlattenedSign, "FlattenedSign");

// node_modules/jose/dist/browser/jws/compact/sign.js
var CompactSign = class {
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
__name(CompactSign, "CompactSign");

// node_modules/jose/dist/browser/jwt/produce.js
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
__name(validateInput, "validateInput");
var ProduceJWT = class {
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
__name(ProduceJWT, "ProduceJWT");

// node_modules/jose/dist/browser/jwt/sign.js
var SignJWT = class extends ProduceJWT {
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
__name(SignJWT, "SignJWT");

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
  if (password !== savedPass)
    return new Response("Method Not Allowed", { status: 405 });
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
  if (oldPwd && !auth)
    return new Response("Unauthorized!", { status: 401 });
  const newPwd = await request.text();
  if (newPwd === oldPwd)
    return new Response("Please enter a new Password!", { status: 400 });
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
  if (auth)
    return Response.redirect(`${globalThis.urlOrigin}/panel`, 302);
  if (request.method === "POST")
    return await generateJWTToken(request, env);
  return await renderLoginPage();
}
__name(login, "login");

// src/protocols/warp.js
var import_tweetnacl2 = __toESM(require_nacl_fast());
async function fetchWarpConfigs(env, proxySettings) {
  let warpConfigs = [];
  const apiBaseUrl = "https://api.cloudflareclient.com/v0a4005/reg";
  const { warpPlusLicense } = proxySettings;
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
  const updateAccount = /* @__PURE__ */ __name(async (accountData, key) => {
    const response = await fetch(`${apiBaseUrl}/${accountData.id}/account`, {
      method: "PUT",
      headers: {
        "User-Agent": "insomnia/8.6.1",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accountData.token}`
      },
      body: JSON.stringify({ ...commonPayload, key: key.publicKey, license: warpPlusLicense })
    });
    return {
      status: response.status,
      data: await response.json()
    };
  }, "updateAccount");
  for (const key of warpKeys) {
    const accountData = await fetchAccount(key);
    warpConfigs.push({
      privateKey: key.privateKey,
      account: accountData
    });
    if (warpPlusLicense) {
      const { status, data: responseData } = await updateAccount(accountData, key);
      if (status !== 200 && !responseData.success) {
        return { error: responseData.errors[0]?.message, configs: null };
      }
    }
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
    if (error)
      throw new Error(`An error occurred while getting Warp configs - ${error}`);
    warpConfigs = configs;
  }
  if (globalThis.panelVersion !== proxySettings.panelVersion)
    proxySettings = await updateDataset(request, env);
  return { proxySettings, warpConfigs };
}
__name(getDataset, "getDataset");
async function updateDataset(request, env) {
  let newSettings = request.method === "POST" ? await request.formData() : null;
  const isReset = newSettings?.get("resetSettings") === "true";
  let currentSettings;
  if (!isReset) {
    try {
      currentSettings = await env.kv.get("proxySettings", { type: "json" });
    } catch (error) {
      console.log(error);
      throw new Error(`An error occurred while getting current KV settings - ${error}`);
    }
  } else {
    newSettings = null;
  }
  const validateField = /* @__PURE__ */ __name((field) => {
    const fieldValue = newSettings?.get(field);
    if (fieldValue === void 0)
      return null;
    if (fieldValue === "true")
      return true;
    if (fieldValue === "false")
      return false;
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
    warpPlusLicense: validateField("warpPlusLicense") ?? currentSettings?.warpPlusLicense ?? "",
    bestWarpInterval: validateField("bestWarpInterval") ?? currentSettings?.bestWarpInterval ?? "30",
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
    if (isReset)
      await updateWarpConfigs(request, env);
  } catch (error) {
    console.log(error);
    throw new Error(`An error occurred while updating KV - ${error}`);
  }
  return proxySettings;
}
__name(updateDataset, "updateDataset");
function extractChainProxyParams(chainProxy) {
  let configParams = {};
  if (!chainProxy)
    return {};
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
  if (!auth)
    return new Response("Unauthorized", { status: 401 });
  if (request.method === "POST") {
    try {
      const { proxySettings } = await getDataset(request, env);
      const { error: warpPlusError } = await fetchWarpConfigs(env, proxySettings);
      if (warpPlusError)
        return new Response(warpPlusError, { status: 400 });
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
    warpPlusLicense,
    bestWarpInterval,
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
  const isWarpPlus = warpPlusLicense ? true : false;
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
  const supportedApps = /* @__PURE__ */ __name((apps) => apps.map((app) => `
        <div>
            <span class="material-symbols-outlined symbol">verified</span>
            <span>${app}</span>
        </div>`).join(""), "supportedApps");
  const subQR = /* @__PURE__ */ __name((path, app, tag2, title, sbType) => {
    const url = `${sbType ? "sing-box://import-remote-profile?url=" : ""}https://${globalThis.hostName}/${path}/${globalThis.subPath}${app ? `?app=${app}` : ""}#${tag2}`;
    return `
            <button onclick="openQR('${url}', '${title}')" style="margin-bottom: 8px;">
                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
            </button>`;
  }, "subQR");
  const subURL = /* @__PURE__ */ __name((path, app, tag2) => {
    const url = `https://${globalThis.hostName}/${path}/${globalThis.subPath}${app ? `?app=${app}` : ""}#${tag2}`;
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
                        <label for="warpPlusLicense">\u2795 Warp+ License</label>
                        <input type="text" id="warpPlusLicense" name="warpPlusLicense" value="${warpPlusLicense}" 
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
                        <input type="number" id="bestWarpInterval" name="bestWarpInterval" min="10" max="90" value="${bestWarpInterval}">
                    </div>
                </details>
                <details>
                    <summary><h2>WARP PRO \u2699\uFE0F</h2></summary>
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
                            ${subQR("fragsub", "hiddify", `${atob("QlBC")}-Fragment`, "Fragment Subscription")}
                            ${subURL("fragsub", "hiddify", `${atob("QlBC")}-Fragment`)}
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
                            ${supportedApps(["Hiddify", "sing-box", "v2rayN (sing-box)"])}
                        </td>
                        <td>
                            ${subQR("sub", "singbox", `${atob("QlBC")}-Warp`, "Warp Subscription", true)}
                            ${subURL("warpsub", "singbox", `${atob("QlBC")}-Warp`)}
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
                            ${subQR("warpsub", "hiddify", `${atob("QlBC")}-Warp-Pro`, "Warp Pro Subscription", true)}
                            ${subURL("warpsub", "hiddify", `${atob("QlBC")}-Warp-Pro`)}
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
        const warpPlusLicense = '${warpPlusLicense}';
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
                ${isWarpPlus ? `alert('\u2705 Warp configs upgraded to PLUS successfully! \u{1F60E}');` : `alert('\u2705 Warp configs updated successfully! \u{1F60E}');`}
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
    if (!auth)
      return new Response("Unauthorized or expired session!", { status: 401 });
    await updateDataset(request, env);
    return new Response("Success", { status: 200 });
  }
  const { proxySettings } = await getDataset(request, env);
  const pwd = await env.kv.get("pwd");
  if (pwd && !auth)
    return Response.redirect(`${globalThis.urlOrigin}/login`, 302);
  const isPassSet = pwd?.length >= 8;
  return await renderHomePage(proxySettings, isPassSet);
}
__name(handlePanel, "handlePanel");
async function fallback(request) {
  const url = new URL(request.url);
  url.hostname = globalThis.fallbackDomain;
  url.protocol = "https:";
  request = new Request(url, request);
  return await fetch(request);
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

// src/helpers/init.js
function initializeParams(request, env) {
  const proxyIPs = env.PROXYIP?.split(",").map((proxyIP) => proxyIP.trim());
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  globalThis.panelVersion = "3.0.4";
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
    if (!userID || !globalThis.TRPassword)
      throw new Error(`Please set UUID and ${atob("VHJvamFu")} password first. Please visit <a href="https://${hostName}/secrets" target="_blank">here</a> to generate them.`, { cause: "init" });
    if (userID && !isValidUUID(userID))
      throw new Error(`Invalid UUID: ${userID}`, { cause: "init" });
    if (typeof env.kv !== "object")
      throw new Error("KV Dataset is not properly set! Please refer to tutorials.", { cause: "init" });
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
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address))
      address = `${atob("d3d3Lg==")}${address}${atob("LnNzbGlwLmlv")}`;
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
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address))
      address = `${atob("d3d3Lg==")}${address}${atob("LnNzbGlwLmlv")}`;
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
      if (rule)
        dnsHost[host] = ["127.0.0.1"];
    });
    customBlockRulesDomains.forEach((domain) => {
      dnsHost[`domain:${domain}`] = ["127.0.0.1"];
    });
  }
  const staticIPs = domainToStaticIPs ? await resolveDNS(domainToStaticIPs) : void 0;
  if (staticIPs)
    dnsHost[domainToStaticIPs] = enableIPv6 ? [...staticIPs.ipv4, ...staticIPs.ipv6] : staticIPs.ipv4;
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
  if (dohHost.isHostDomain && !isWorkerLess && !isWarp)
    dnsObject.servers.push({
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
      outboundTag: "dns-out",
      type: "field"
    }
  ];
  if (!isWorkerLess && (isDomainRule || isBypass))
    rules.push({
      ip: [localDNS],
      port: "53",
      network: "udp",
      outboundTag: "direct",
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
    if (!isWorkerLess) {
      domainDirectRule.domain.length && rules.push(domainDirectRule);
      ipDirectRule.ip.length && rules.push(ipDirectRule);
    }
    domainBlockRule.domain.length && rules.push(domainBlockRule);
    ipBlockRule.ip.length && rules.push(ipBlockRule);
  }
  blockUDP443 && rules.push({
    network: "udp",
    port: "443",
    outboundTag: "block",
    type: "field"
  });
  if (isChain) {
    const rule = {
      [isBalancer ? "balancerTag" : "outboundTag"]: isBalancer ? "all-proxy" : "proxy",
      type: "field"
    };
    if (!isWarp) {
      const url = new URL(remoteDNS);
      const remoteDNSServer = url.hostname;
      rules.push({
        [isDomain(remoteDNSServer) ? "domain" : "ip"]: [remoteDNSServer],
        network: "tcp",
        ...rule
      });
    } else {
      rules.push({
        network: "udp",
        port: "53",
        ...rule
      });
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
      outboundTag: isChain ? "chain" : isWorkerLess ? "fragment" : "proxy",
      type: "field"
    });
  }
  return rules;
}
__name(buildXrayRoutingRules, "buildXrayRoutingRules");
function buildXrayVLOutbound(tag2, address, port, host, sni, proxyIP, isFragment, allowInsecure, enableIPv6) {
  const outbound = {
    protocol: atob("dmxlc3M="),
    settings: {
      vnext: [
        {
          address,
          port: +port,
          users: [
            {
              id: globalThis.userID,
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
  if (globalThis.defaultHttpsPorts.includes(port)) {
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
    sockopt.tcpNoDelay = true;
    sockopt.domainStrategy = enableIPv6 ? "UseIPv4v6" : "UseIPv4";
  }
  return outbound;
}
__name(buildXrayVLOutbound, "buildXrayVLOutbound");
function buildXrayTROutbound(tag2, address, port, host, sni, proxyIP, isFragment, allowInsecure, enableIPv6) {
  const outbound = {
    protocol: atob("dHJvamFu"),
    settings: {
      servers: [
        {
          address,
          port: +port,
          password: globalThis.TRPassword,
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
  if (globalThis.defaultHttpsPorts.includes(port)) {
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
    sockopt.tcpNoDelay = true;
    sockopt.domainStrategy = enableIPv6 ? "UseIPv4v6" : "UseIPv4";
  }
  return outbound;
}
__name(buildXrayTROutbound, "buildXrayTROutbound");
function buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, isChain, client) {
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
  const {
    warpIPv6,
    reserved,
    publicKey,
    privateKey
  } = extractWireguardParams(warpConfigs, isChain);
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
          endpoint,
          publicKey,
          keepAlive: 5
        }
      ],
      reserved: base64ToDecimal(reserved),
      secretKey: privateKey
    },
    streamSettings: {
      sockopt: {
        dialerProxy: "proxy",
        domainStrategy: warpEnableIPv6 ? "UseIPv4v6" : "UseIPv4"
      }
    },
    tag: isChain ? "chain" : "proxy"
  };
  !isChain && delete outbound.streamSettings;
  client === "nikang" && !isChain && Object.assign(outbound.settings, {
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
          domainStrategy: enableIPv6 ? "UseIPv4v6" : "UseIPv4",
          tcpNoDelay: true
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
        domainStrategy: enableIPv6 ? "UseIPv4v6" : "UseIPv4",
        tcpNoDelay: true
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
  if (type === "tcp" && security !== "reality" && !headerType)
    proxyOutbound.streamSettings.tcpSettings = {
      header: {
        type: "none"
      }
    };
  if (type === "ws")
    proxyOutbound.streamSettings.wsSettings = {
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
function buildXrayConfig(proxySettings, remark, isFragment, isBalancer, isChain, balancerFallback, isWarp) {
  const {
    VLTRFakeDNS,
    enableIPv6,
    warpFakeDNS,
    bestVLTRInterval,
    bestWarpInterval,
    lengthMin,
    lengthMax,
    intervalMin,
    intervalMax,
    fragmentPackets
  } = proxySettings;
  const isFakeDNS = VLTRFakeDNS && !isWarp || warpFakeDNS && isWarp;
  const config = structuredClone(xrayConfigTemp);
  config.remarks = remark;
  if (isFakeDNS) {
    config.inbounds[0].sniffing.destOverride.push("fakedns");
    config.inbounds[1].sniffing.destOverride.push("fakedns");
  }
  if (isFragment) {
    const fragment = config.outbounds[0].settings.fragment;
    fragment.length = `${lengthMin}-${lengthMax}`;
    fragment.interval = `${intervalMin}-${intervalMax}`;
    fragment.packets = fragmentPackets;
    config.outbounds[0].settings.domainStrategy = enableIPv6 ? "UseIPv4v6" : "UseIPv4";
  } else {
    config.outbounds.shift();
  }
  if (isBalancer) {
    const interval = isWarp ? bestWarpInterval : bestVLTRInterval;
    config.observatory.pingConfig.interval = `${interval}s`;
    if (balancerFallback)
      config.routing.balancers[0].fallbackTag = "prox-2";
    if (isChain) {
      config.observatory.subjectSelector.push("chain");
      const chainBalancer = structuredClone(config.routing.balancers[0]);
      if (balancerFallback)
        chainBalancer.fallbackTag = "chain-2";
      config.routing.balancers.push({ ...chainBalancer, selector: ["chain"] });
      config.routing.balancers[0].tag = "all-proxy";
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
  const config = buildXrayConfig(proxySettings, remark, isFragment, true, chainProxy, true);
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
  const config = buildXrayConfig(proxySettings, `\u{1F4A6} ${atob("QlBC")} F - Best Fragment \u{1F60E}`, true, true, chainProxy, false, false);
  config.dns = await buildXrayDNS(proxySettings, [], hostName2, false, false);
  config.routing.rules = buildXrayRoutingRules(proxySettings, [], chainProxy, true, false, false);
  const fragment = config.outbounds.shift();
  const bestFragOutbounds = [];
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
    const fragmentOutbound = structuredClone(fragment);
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
  const config = buildXrayConfig(proxySettings, `\u{1F4A6} ${atob("QlBC")} F - WorkerLess \u2B50`, true, false, false, false, false);
  config.dns = await buildXrayDNS(proxySettings, [], void 0, true);
  config.routing.rules = buildXrayRoutingRules(proxySettings, [], false, false, true, false);
  const fakeOutbound = buildXrayVLOutbound("fake-outbound", "google.com", "443", globalThis.userID, "google.com", "google.com", "", true, false);
  delete fakeOutbound.streamSettings.sockopt;
  fakeOutbound.streamSettings.wsSettings.path = "/";
  config.outbounds.push(fakeOutbound);
  return config;
}
__name(buildXrayWorkerLessConfig, "buildXrayWorkerLessConfig");
async function getXrayCustomConfigs(request, env, isFragment) {
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
  const totalPorts = ports.filter((port) => isFragment ? globalThis.defaultHttpsPorts.includes(port) : true);
  VLConfigs && protocols.push(atob("VkxFU1M="));
  TRConfigs && protocols.push(atob("VHJvamFu"));
  let proxyIndex = 1;
  for (const protocol of protocols) {
    let protocolIndex = 1;
    for (const port of totalPorts) {
      for (const addr of totalAddresses) {
        const isCustomAddr = customCdnAddresses.includes(addr);
        const configType = isCustomAddr ? "C" : isFragment ? "F" : "";
        const sni = isCustomAddr ? customCdnSni : randomUpperCase(globalThis.hostName);
        const host = isCustomAddr ? customCdnHost : globalThis.hostName;
        const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
        const customConfig = buildXrayConfig(proxySettings, remark, isFragment, false, chainProxy, false, false);
        customConfig.dns = await buildXrayDNS(proxySettings, [addr], void 0);
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
  const bestPing = await buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment);
  const finalConfigs = [...configs, bestPing];
  if (isFragment) {
    const bestFragment = await buildXrayBestFragmentConfig(proxySettings, globalThis.hostName, chainProxy, outbounds);
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
  const xrayWarpConfigs = [];
  const xrayWoWConfigs = [];
  const xrayWarpOutbounds = [];
  const xrayWoWOutbounds = [];
  const { warpEndpoints } = proxySettings;
  const outboundDomains = warpEndpoints.split(",").map((endpoint) => endpoint.split(":")[0]).filter((address) => isDomain(address));
  const proIndicator = client === "nikang" ? " Pro " : " ";
  for (const [index, endpoint] of warpEndpoints.split(",").entries()) {
    const endpointHost = endpoint.split(":")[0];
    const warpConfig = buildXrayConfig(proxySettings, `\u{1F4A6} ${index + 1} - Warp${proIndicator}\u{1F1EE}\u{1F1F7}`, false, false, false, false, true);
    const WoWConfig = buildXrayConfig(proxySettings, `\u{1F4A6} ${index + 1} - WoW${proIndicator}\u{1F30D}`, false, false, true, false, true);
    warpConfig.dns = WoWConfig.dns = await buildXrayDNS(proxySettings, [endpointHost], void 0, false, true);
    warpConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], false, false, false, true);
    WoWConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], true, false, false, true);
    const warpOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, false, client);
    const WoWOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, true, client);
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
  const xrayWarpBestPing = buildXrayConfig(proxySettings, `\u{1F4A6} Warp${proIndicator}- Best Ping \u{1F680}`, false, true, false, false, true);
  xrayWarpBestPing.dns = dnsObject;
  xrayWarpBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, false, true, false, true);
  xrayWarpBestPing.outbounds.unshift(...xrayWarpOutbounds);
  const xrayWoWBestPing = buildXrayConfig(proxySettings, `\u{1F4A6} WoW${proIndicator}- Best Ping \u{1F680}`, false, true, true, false, true);
  xrayWoWBestPing.dns = dnsObject;
  xrayWoWBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, true, true, false, true);
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
      listen: "127.0.0.1",
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
      tag: "fragment",
      protocol: "freedom",
      settings: {
        fragment: {
          packets: "tlshello",
          length: "",
          interval: ""
        },
        domainStrategy: "UseIP"
      },
      streamSettings: {
        sockopt: {
          tcpKeepAliveIdle: 30,
          tcpNoDelay: true
        }
      }
    },
    {
      protocol: "dns",
      tag: "dns-out"
    },
    {
      protocol: "freedom",
      settings: {},
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
    subjectSelector: ["prox"],
    pingConfig: {
      destination: "https://connectivitycheck.gstatic.com/generate_204",
      connectivity: "https://www.google.com/generate_204",
      interval: "30s",
      sampling: 1,
      timeout: "10s"
    }
  },
  stats: {}
};

// src/cores-configs/sing-box.js
function buildSingBoxDNS(proxySettings, outboundAddrs, isWarp, remoteDNSDetour) {
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
      detour: remoteDNSDetour,
      tag: "dns-remote"
    },
    {
      address: localDNS,
      detour: "direct",
      tag: "dns-direct"
    },
    {
      address: "rcode://success",
      tag: "dns-block"
    }
  ];
  dohHost.isHostDomain && !isWarp && servers.push({
    address: "https://8.8.8.8/dns-query",
    detour: "direct",
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
    server: "dns-block"
  };
  geoRules.forEach(({ rule, type, geosite, geoip }) => {
    rule && type === "direct" && rules.push({
      type: "logical",
      mode: "and",
      rules: [
        { rule_set: geosite },
        { rule_set: geoip }
      ],
      "server": "dns-direct"
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
    if (isIPv62)
      fakeip.inet6_range = "fc00::/18";
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
      protocol: "dns",
      outbound: "dns-out"
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
  const createRule = /* @__PURE__ */ __name((rule, outbound) => ({
    [rule]: [],
    outbound
  }), "createRule");
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
  const blockDomainRule = createRule("rule_set", "block");
  const blockIPRule = createRule("rule_set", "block");
  geoRules.forEach(({ rule, type, ruleSet }) => {
    if (!rule)
      return;
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
  customBlockRulesTotal.length && processRules(customBlockRulesTotal, "block");
  const rules = [...defaultRules, ...directDomainRules, ...directIPRules, ...blockDomainRules, ...blockIPRules];
  blockUDP443 && rules.push({
    network: "udp",
    port: 443,
    protocol: "quic",
    outbound: "block"
  });
  return { rules, rule_set: ruleSets };
}
__name(buildSingBoxRoutingRules, "buildSingBoxRoutingRules");
function buildSingBoxVLOutbound(proxySettings, remark, address, port, host, sni, allowInsecure, isFragment) {
  const { enableIPv6, lengthMin, lengthMax, intervalMin, intervalMax, proxyIP } = proxySettings;
  const path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}`;
  const tls = globalThis.defaultHttpsPorts.includes(port) ? true : false;
  const outbound = {
    type: atob("dmxlc3M="),
    server: address,
    server_port: +port,
    domain_strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
    uuid: globalThis.userID,
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
  if (!tls)
    delete outbound.tls;
  if (isFragment)
    outbound.tls_fragment = {
      enabled: true,
      size: `${lengthMin}-${lengthMax}`,
      sleep: `${intervalMin}-${intervalMax}`
    };
  return outbound;
}
__name(buildSingBoxVLOutbound, "buildSingBoxVLOutbound");
function buildSingBoxTROutbound(proxySettings, remark, address, port, host, sni, allowInsecure, isFragment) {
  const { enableIPv6, lengthMin, lengthMax, intervalMin, intervalMax, proxyIP } = proxySettings;
  const path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ""}`;
  const tls = globalThis.defaultHttpsPorts.includes(port) ? true : false;
  const outbound = {
    type: atob("dHJvamFu"),
    password: globalThis.TRPassword,
    server: address,
    server_port: +port,
    domain_strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
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
  if (!tls)
    delete outbound.tls;
  if (isFragment)
    outbound.tls_fragment = {
      enabled: true,
      size: `${lengthMin}-${lengthMax}`,
      sleep: `${intervalMin}-${intervalMax}`
    };
  return outbound;
}
__name(buildSingBoxTROutbound, "buildSingBoxTROutbound");
function buildSingBoxWarpOutbound(proxySettings, warpConfigs, remark, endpoint, chain, client) {
  const ipv6Regex = /\[(.*?)\]/;
  const portRegex = /[^:]*$/;
  const endpointServer = endpoint.includes("[") ? endpoint.match(ipv6Regex)[1] : endpoint.split(":")[0];
  const endpointPort = endpoint.includes("[") ? +endpoint.match(portRegex)[0] : +endpoint.split(":")[1];
  const {
    warpEnableIPv6,
    hiddifyNoiseMode,
    noiseCountMin,
    noiseCountMax,
    noiseSizeMin,
    noiseSizeMax,
    noiseDelayMin,
    noiseDelayMax
  } = proxySettings;
  const {
    warpIPv6,
    reserved,
    publicKey,
    privateKey
  } = extractWireguardParams(warpConfigs, chain);
  const outbound = {
    local_address: [
      "172.16.0.2/32",
      warpIPv6
    ],
    mtu: 1280,
    peer_public_key: publicKey,
    private_key: privateKey,
    reserved,
    server: endpointServer,
    server_port: endpointPort,
    domain_strategy: warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only",
    type: "wireguard",
    detour: chain,
    tag: remark
  };
  client === "hiddify" && Object.assign(outbound, {
    fake_packets_mode: hiddifyNoiseMode,
    fake_packets: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
    fake_packets_size: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
    fake_packets_delay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
  });
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
    if (protocol === "socks")
      chainOutbound2.version = "5";
    return chainOutbound2;
  }
  const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
  const chainOutbound = {
    type: atob("dmxlc3M="),
    tag: "",
    server,
    server_port: +port,
    domain_strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
    uuid,
    flow,
    detour: ""
  };
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
  if (type === "grpc")
    chainOutbound.transport = {
      type: "grpc",
      service_name: serviceName
    };
  return chainOutbound;
}
__name(buildSingBoxChainOutbound, "buildSingBoxChainOutbound");
async function getSingBoxWarpConfig(request, env, client) {
  const { proxySettings, warpConfigs } = await getDataset(request, env);
  const { warpEndpoints } = proxySettings;
  const config = structuredClone(singboxConfigTemp);
  const proIndicator = client === "hiddify" ? " Pro " : " ";
  const dnsObject = buildSingBoxDNS(proxySettings, void 0, true, `\u{1F4A6} Warp${proIndicator}- Best Ping \u{1F680}`);
  const { rules, rule_set } = buildSingBoxRoutingRules(proxySettings);
  config.dns.servers = dnsObject.servers;
  config.dns.rules = dnsObject.rules;
  config.dns.strategy = proxySettings.warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only";
  if (dnsObject.fakeip)
    config.dns.fakeip = dnsObject.fakeip;
  config.route.rules = rules;
  config.route.rule_set = rule_set;
  const selector = config.outbounds[0];
  const warpUrlTest = config.outbounds[1];
  selector.outbounds = [`\u{1F4A6} Warp${proIndicator}- Best Ping \u{1F680}`, `\u{1F4A6} WoW${proIndicator}- Best Ping \u{1F680}`];
  config.outbounds.splice(2, 0, structuredClone(warpUrlTest));
  const WoWUrlTest = config.outbounds[2];
  warpUrlTest.tag = `\u{1F4A6} Warp${proIndicator}- Best Ping \u{1F680}`;
  warpUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
  WoWUrlTest.tag = `\u{1F4A6} WoW${proIndicator}- Best Ping \u{1F680}`;
  WoWUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
  const warpRemarks = [], WoWRemarks = [];
  warpEndpoints.split(",").forEach((endpoint, index) => {
    const warpRemark = `\u{1F4A6} ${index + 1} - Warp \u{1F1EE}\u{1F1F7}`;
    const WoWRemark = `\u{1F4A6} ${index + 1} - WoW \u{1F30D}`;
    const warpOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, warpRemark, endpoint, "", client);
    const WoWOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, WoWRemark, endpoint, warpRemark, client);
    config.outbounds.push(WoWOutbound, warpOutbound);
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
async function getSingBoxCustomConfig(request, env, isFragment) {
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
  const dnsObject = buildSingBoxDNS(proxySettings, totalAddresses, false, chainProxy ? "proxy-1" : "\u2705 Selector");
  const { rules, rule_set } = buildSingBoxRoutingRules(proxySettings);
  config.dns.servers = dnsObject.servers;
  config.dns.rules = dnsObject.rules;
  if (dnsObject.fakeip)
    config.dns.fakeip = dnsObject.fakeip;
  config.dns.strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
  config.route.rules = rules;
  config.route.rule_set = rule_set;
  const selector = config.outbounds[0];
  const urlTest = config.outbounds[1];
  selector.outbounds = ["\u{1F4A6} Best Ping \u{1F4A5}"];
  urlTest.interval = `${bestVLTRInterval}s`;
  urlTest.tag = "\u{1F4A6} Best Ping \u{1F4A5}";
  const totalPorts = ports.filter((port) => isFragment ? globalThis.defaultHttpsPorts.includes(port) : true);
  let proxyIndex = 1;
  const protocols = [
    ...VLConfigs ? [atob("VkxFU1M=")] : [],
    ...TRConfigs ? [atob("VHJvamFu")] : []
  ];
  protocols.forEach((protocol) => {
    let protocolIndex = 1;
    totalPorts.forEach((port) => {
      totalAddresses.forEach((addr) => {
        let VLOutbound, TROutbound;
        const isCustomAddr = customCdnAddresses.includes(addr);
        const configType = isCustomAddr ? "C" : isFragment ? "F" : "";
        const sni = isCustomAddr ? customCdnSni : randomUpperCase(globalThis.hostName);
        const host = isCustomAddr ? customCdnHost : globalThis.hostName;
        const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
        if (protocol === atob("VkxFU1M=")) {
          VLOutbound = buildSingBoxVLOutbound(
            proxySettings,
            chainProxy ? `proxy-${proxyIndex}` : remark,
            addr,
            port,
            host,
            sni,
            isCustomAddr,
            isFragment
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
            isCustomAddr,
            isFragment
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
      type: "tun",
      tag: "tun-in",
      address: [
        "172.18.0.1/28",
        "fdfe:dcba:9876::1/126"
      ],
      mtu: 9e3,
      auto_route: true,
      strict_route: true,
      stack: "mixed",
      endpoint_independent_nat: true,
      sniff: true,
      sniff_override_destination: true
    },
    {
      type: "mixed",
      tag: "mixed-in",
      listen: "127.0.0.1",
      listen_port: 2080,
      sniff: true,
      sniff_override_destination: false
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
    },
    {
      type: "block",
      tag: "block"
    },
    {
      type: "dns",
      tag: "dns-out"
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
    "nameserver": isWarp ? warpRemoteDNS.map((dns2) => isChain ? `${dns2}#\u{1F4A6} Warp - Best Ping \u{1F680}` : `${dns2}#\u2705 Selector`) : [isChain ? `${remoteDNS}#proxy-1` : `${remoteDNS}#\u2705 Selector`],
    "proxy-server-nameserver": [`${localDNS}#DIRECT`],
    "nameserver-policy": {
      "raw.githubusercontent.com": `${localDNS}#DIRECT`,
      "time.apple.com": `${localDNS}#DIRECT`
    }
  };
  if (isChain && !isWarp) {
    const chainOutboundServer = JSON.parse(outProxyParams).server;
    if (isDomain(chainOutboundServer))
      dns["nameserver-policy"][chainOutboundServer] = `${remoteDNS}#proxy-1`;
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
  if (isFakeDNS)
    Object.assign(dns, {
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
  const rules = [...directDomainRules, ...directIPRules, ...blockDomainRules, ...blockIPRules];
  blockUDP443 && rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
  rules.push("MATCH,\u2705 Selector");
  return { rules, ruleProviders };
}
__name(buildClashRoutingRules, "buildClashRoutingRules");
function buildClashVLOutbound(remark, address, port, host, sni, path, allowInsecure) {
  const tls = globalThis.defaultHttpsPorts.includes(port) ? true : false;
  const addr = isIPv6(address) ? address.replace(/\[|\]/g, "") : address;
  const outbound = {
    "name": remark,
    "type": atob("dmxlc3M="),
    "server": addr,
    "port": +port,
    "uuid": globalThis.userID,
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
  return {
    "name": remark,
    "type": "wireguard",
    "ip": "172.16.0.2/32",
    "ipv6": warpIPv6,
    "private-key": privateKey,
    "server": endpointServer,
    "port": endpointPort,
    "public-key": publicKey,
    "allowed-ips": ["0.0.0.0/0", "::/0"],
    "reserved": reserved,
    "udp": true,
    "mtu": 1280,
    "dialer-proxy": chain
  };
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
  if (security === "reality")
    Object.assign(chainOutbound, {
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
  if (type === "grpc")
    chainOutbound["grpc-opts"] = {
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
        const sni = isCustomAddr ? customCdnSni : randomUpperCase(globalThis.hostName);
        const host = isCustomAddr ? customCdnHost : globalThis.hostName;
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
        if (protocol === atob("VHJvamFu") && globalThis.defaultHttpsPorts.includes(port)) {
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
  const { proxySettings } = await getDataset(request, env);
  const {
    cleanIPs,
    proxyIP,
    ports,
    VLConfigs,
    TRConfigs,
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
  const alpn = globalThis.client === "singbox" ? "http/1.1" : "h2,http/1.1";
  const TRPass = encodeURIComponent(globalThis.TRPassword);
  const earlyData = globalThis.client === "singbox" ? "&eh=Sec-WebSocket-Protocol&ed=2560" : encodeURIComponent("?ed=2560");
  ports.forEach((port) => {
    totalAddresses.forEach((addr, index) => {
      const isCustomAddr = index > Addresses.length - 1;
      const configType = isCustomAddr ? "C" : "";
      const sni = isCustomAddr ? customCdnSni : randomUpperCase(globalThis.hostName);
      const host = isCustomAddr ? customCdnHost : globalThis.hostName;
      const path = `${getRandomPath(16)}${proxyIP ? `/${encodeURIComponent(btoa(proxyIP))}` : ""}${earlyData}`;
      const VLRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, atob("VkxFU1M="), configType));
      const TRRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, atob("VHJvamFu"), configType));
      const tlsFields = globalThis.defaultHttpsPorts.includes(port) ? `&security=tls&sni=${sni}&fp=randomized&alpn=${alpn}` : "&security=none";
      if (VLConfigs) {
        VLConfs += `${atob("dmxlc3M6Ly8=")}${globalThis.userID}@${addr}:${port}?path=/${path}&encryption=none&host=${host}&type=ws${tlsFields}#${VLRemark}
`;
      }
      if (TRConfigs) {
        TRConfs += `${atob("dHJvamFuOi8v")}${TRPass}@${addr}:${port}?path=/tr${path}&host=${host}&type=ws${tlsFields}#${TRRemark}
`;
      }
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
  return new Response(configs, {
    status: 200,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store"
    }
  });
}
__name(getNormalConfigs, "getNormalConfigs");

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
      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        switch (globalThis.pathName) {
          case "/update-warp":
            return await updateWarpConfigs(request, env);
          case `/sub/${globalThis.subPath}`:
            if (globalThis.client === "sfa")
              return await getSingBoxCustomConfig(request, env, false);
            if (globalThis.client === "clash")
              return await getClashNormalConfig(request, env);
            if (globalThis.client === "xray")
              return await getXrayCustomConfigs(request, env, false);
            return await getNormalConfigs(request, env);
          case `/fragsub/${globalThis.subPath}`:
            return globalThis.client === "hiddify" ? await getSingBoxCustomConfig(request, env, true) : await getXrayCustomConfigs(request, env, true);
          case `/warpsub/${globalThis.subPath}`:
            if (globalThis.client === "clash")
              return await getClashWarpConfig(request, env);
            if (globalThis.client === "singbox" || globalThis.client === "hiddify")
              return await getSingBoxWarpConfig(request, env, globalThis.client);
            return await getXrayWarpConfigs(request, env, globalThis.client);
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
        return globalThis.pathName.startsWith("/tr") ? await TROverWSHandler(request) : await VLOverWSHandler(request);
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

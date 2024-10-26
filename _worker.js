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

    (function(nacl2) {

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

        this.pad[6] =

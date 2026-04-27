/**
 * @typedef {number} byte   - 8-bit unsigned integer
 * @typedef {number} sbyte  - 8-bit signed integer
 * @typedef {number} ushort - 16-bit unsigned integer
 * @typedef {number} uint   - 32-bit unsigned integer
 * @typedef {number} int    - 32-bit signed integer
 * @typedef {bigint} ulong  - 64-bit unsigned integer
 */

/**
 * @param {ArrayBuffer} buf - The ArrayBuffer to extract the string from
 * @returns {string}
 */
export function getStringFromBuffer(buf) {
    var dv = new DataView(buf);
    var res = "";

    for (var i = 0; i < dv.byteLength; i += 2) {
        var char = dv.getUint16(i, true);
        if (char == 0) break;
        res += String.fromCharCode(char);
    }
    return res;
}

/**
 * Checks the requested bit index from data
 * @param {byte} data 
 * @param {int} bitIndex 
 * @returns {boolean}
 */
export function GetFlag(data, bitIndex) {
    bitIndex &= 7;
    return (data >>> bitIndex) & 1 == 0;
}

var firstnational3 = 252;
var firstinternal3 = 277;

var table3 = [
  -25, -25, -25,
  -25, -25, -25, -25, -25, -25, -25, -25, -25, -25,
  -25, -25, -25, -25, -25, -25, -25, -25, -25, -25,
  -25, -11, -11, -11, -28, -28, -21, -21, 19, -31,
  -31, -28, -28, 7, 7, -15, -15, 35, 25, 25,
  -21, 3, -20, 16, 16, 45, 15, 15, 21, 21,
  -12, -12, -4, -4, -4, -39, -39, -28, -28, -17,
  -17, 22, 22, 22, -13, -13, 15, 15, -11, -11,
  -52, -26, -26, -42, -42, -52, -49, -49, -25, -25,
  0, -6, -6, -48, -77, -77, -77, -51, -51, -12,
  -77, -77, -77, -7, -7, -7, -17, -24, -24, -43,
  -45, -12, -78, -78, -78, -34, -73, -73, -43, -43,
  -43, -43, -112, -112, -112, -24, -24, -24, -24, -24,
  -24, -24, -24, -24, -22, -22, -22, -27, -27, -24,
  -24, -53,
];

var first9 = 917;

var table9 = [
  65, -1, -1, -1, -1, 31, 31, 47, 47, 29, 29, 53, 31, 31, 46, 44, 30, 30, -7,
  -7, -7, 13, 13, -2, -2, 23, 23, 24, -21, -21, 27, 27, 47, 47, 47, 26, 14, -33,
  -33, -33, -17, -17, 3, -29, 12, -12, -31, -31, -31, 3, 3, -24, -24, -44, -44,
  -30, -30, -28, -28, 23, 23, 6, 7, 29, 8, 3, 4, 4, 20, 4, 23, 6, 3, 3, 4, -1,
  13, 9, 7, 5, 7, 9, 9, -43, -43, -43, -68, -68, -68, -58, -58, -25, -29, -31,
  6, -1, 6, 0, 0, 0, 3, 3, 4, 2, 3, 3, -5, -12, -12,
];

export function getSpecies3(id) {
  return getNational3(id);
}

function getNational3(raw) {
  if (raw < firstnational3) return raw;
  var shift = raw - firstinternal3;
  if (shift >= table3.length) return 0;
  return raw + table[shift];
}

export function getSpecies9(id) {
  return getNational9(id);
}

function getNational9(raw) {
  if (raw < first9) return raw;
  return raw + table9[raw - first9];
}

/**
 * Swaps bits at a given position
 * @param {int} value  - Value to swap bit for
 * @param {int} p1     - Position of the first bit to be swapped
 * @param {int} p2     - Position of the second bit to be swapped
 * @returns {int}
 */
export function SwapBits(value, p1, p2) {
  var bit1 = (value >>> p1) & 1;
  var bit2 = (value >>> p2) & 1;
  var x = bit1 ^ bit2;
  x = (x << p1) | (x << p2);
  return value ^ x;
}
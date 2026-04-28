import { getStringFromBuffer, SwapBits, getSpecies3 } from "./util/util.js";

/**
 * @typedef {number} byte   - 8-bit unsigned integer
 * @typedef {number} sbyte  - 8-bit signed integer
 * @typedef {number} ushort - 16-bit unsigned integer
 * @typedef {number} uint   - 32-bit unsigned integer
 * @typedef {number} int    - 32-bit signed integer
 * @typedef {bigint} ulong  - 64-bit unsigned integer
 */

/**
 * Read-only Pokemon Container for Ruby/Sapphire/Emerald/FireRed/LeafGreen
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/Shared/G3PKM.cs
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/PK3.cs
 */
export class PK3 {
    /** @type {ushort} */
    static SIZE = 100;

    /**
     * @param {ArrayBuffer} buf - An ArrayBuffer containing the raw decrypted pk3 data
     */
    constructor(buf) {
        this.buf = buf;
        this.dv = new DataView(buf);
    }

    //// 0x20 Intro
    /** @returns {uint} */ get PID() { return this.dv.getUint32(0x00, true) >>> 0; }
    /** @returns {uint} */ get PSV() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) >>> 3; }
    
    /** @returns {uint} */ get ID32() { return this.dv.getUint32(0x04, true) >>> 0; }
    /** @returns {ushort} */ get TID16() { return this.dv.getUint16(0x04, true); }
    /** @returns {ushort} */ get SID16() { return this.dv.getUint16(0x06, true); }
    /** @returns {uint} */ get TSV() { return (this.TID16 ^ this.SID16) >>> 3; }

    /** @returns {string} */
    get Nickname() {
        var slice = this.buf.slice(0x08, 0x08 + 20);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get Language() { return this.dv.getUint8(0x12); }

    /** @returns {boolean} */ get FlagIsBadEgg() { return (this.dv.getUint8(0x13) & 1) != 0; }
    
    /** @returns {boolean} */ get FlagHasSpecies() { return (this.dv.getUint8(0x13) & 2) != 0; }
    
    /** @returns {boolean} */ get FlaIsEgg() { return (this.dv.getUint8(0x13) & 4) != 0; }

    /** @returns {string} */
    get OriginalTrainerName() {
        var slice = this.buf.slice(0x14, 0x14 + 14);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get MarkingValue() { return SwapBits(this.dv.getUint8(0x1b), 1, 2); }

    /** @returns {ushort} */ get Checksum() { return this.dv.getUint16(0x1c, true); }

    /** @returns {ushort} */ get Sanity() { return this.dv.getUint16(0x1e, true); }


    //// Block A

    /** @returns {ushort} */ get SpeciesInternal() { return this.dv.getUint16(0x20, true); }
    
    /** @returns {ushort} */ get Species() { return getSpecies3(this.SpeciesInternal); }

    /** @returns {ushort} */ get HeldItem() { return this.dv.getUint16(0x22, true); }


    /** @returns {uint} */ get EXP() { return this.dv.getUint32(0x24, true) >>> 0; }

    /** @returns {byte} */ get PPUps() { return this.dv.getUint8(0x28); }
    /** @returns {int} */ get Move1_PPUps() { return (this.PPUps >>> 0) & 3; }
    /** @returns {int} */ get Move2_PPUps() { return (this.PPUps >>> 2) & 3; }
    /** @returns {int} */ get Move3_PPUps() { return (this.PPUps >>> 4) & 3; }
    /** @returns {int} */ get Move4_PPUps() { return (this.PPUps >>> 6) & 3; }

    /** @returns {byte} */ get OriginalTrainerFriendship() { return this.dv.getUint8(0x29, true); }

    /** @returns {int} */ get Ability() { return this.PID & 0x0000_0001; }

    /** @returns {byte} */ get Nature() { return this.PID % 25; }

    /** @returns {uint} */ get ShinyXOR() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) ^ this.TID16 ^ this.SID16; }
    /** @returns {boolean} */ get IsShiny() { return this.TSV == this.PSV; }
    /** @returns {boolean} */ get IsSquareShiny() { return this.IsShiny && (this.FatefulEncounter || this.ShinyXOR == 0); }
    /** @returns {boolean} */ get IsStarShiny() {return this.IsShiny && !this.IsSquareShiny }

    //// Block B
    /** @returns {ushort} */ get Move1() { return this.dv.getUint16(0x2c, true); }
    /** @returns {ushort} */ get Move2() { return this.dv.getUint16(0x2e, true); }
    /** @returns {ushort} */ get Move3() { return this.dv.getUint16(0x30, true); }
    /** @returns {ushort} */ get Move4() { return this.dv.getUint16(0x32, true); }

    /** @returns {int} */ get Move1_PP() { return this.dv.getUint8(0x34); }
    /** @returns {int} */ get Move2_PP() { return this.dv.getUint8(0x35); }
    /** @returns {int} */ get Move3_PP() { return this.dv.getUint8(0x36); }
    /** @returns {int} */ get Move4_PP() { return this.dv.getUint8(0x37); }

    //// Block C
    /** @returns {int} */ get EV_HP() { return this.dv.getUint8(0x38); }
    /** @returns {int} */ get EV_ATK() { return this.dv.getUint8(0x39); }
    /** @returns {int} */ get EV_DEF() { return this.dv.getUint8(0x3a); }
    /** @returns {int} */ get EV_SPE() { return this.dv.getUint8(0x3b); }
    /** @returns {int} */ get EV_SPA() { return this.dv.getUint8(0x3c); }
    /** @returns {int} */ get EV_SPD() { return this.dv.getUint8(0x3d); }

    /** @returns {byte} */ get ContestCool() { return this.dv.getUint8(0x3e); }
    /** @returns {byte} */ get ContestBeauty() { return this.dv.getUint8(0x3f); }
    /** @returns {byte} */ get ContestCute() { return this.dv.getUint8(0x40); }
    /** @returns {byte} */ get ContestSmart() { return this.dv.getUint8(0x41); }
    /** @returns {byte} */ get ContestTough() { return this.dv.getUint8(0x42); }
    /** @returns {byte} */ get ContestSheen() { return this.dv.getUint8(0x43); }

    //// Block D
    /** @returns {byte} */ get PokerusState() { return this.dv.getUint8(0x82); }
    /** @returns {int} */ get PokerusDays() { return (this.PokerusState & 0xF) >>> 0; }
    /** @returns {int} */ get PokerusStrain() { return (this.PokerusState >> 4) >>> 0; }

    /** @returns {ushort} */ get MetLocation() { return this.dv.getUint8(0x45); }

    /** @returns {ushort} */ get Origins() { return this.dv.getUint16(0x46); }
    /** @returns {byte} */ get MetLevel() { return this.Origins & 0x7f; }
    /** @returns {byte} */ get GameVersion() { return (this.Origins >>> 7) & 0xf; }
    /** @returns {byte} */ get Ball() { return (this.Origins >>> 11) & 0xf; }
    /** @returns {byte} */ get OriginalTrainerGender() { return (this.Origins >>> 15) & 1; }

    /** @returns {uint} */ get IV32() { return this.dv.getUint32(0x48, true) >>> 0; }

    /** @returns {byte} */ get IV_HP()  { return (this.IV32 >> 0) & 0x1F; }
    /** @returns {byte} */ get IV_ATK() { return (this.IV32 >> 5) & 0x1F; }
    /** @returns {byte} */ get IV_DEF() { return (this.IV32 >> 10) & 0x1F; }
    /** @returns {byte} */ get IV_SPE() { return (this.IV32 >> 15) & 0x1F; }
    /** @returns {byte} */ get IV_SPA() { return (this.IV32 >> 20) & 0x1F; }
    /** @returns {byte} */ get IV_SPD() { return (this.IV32 >> 25) & 0x1F; }

    /** @returns {boolean} */ get IsEgg() { return ((this.IV32 >> 30) & 1) === 1; }

    /** @returns {uint} */ get RIB0() { return this.dv.getUint32(0x4c) >>> 0; }

    /** @returns {byte} */ get RibbonCountG3Cool() { return ((this.RIB0 >>> 0) & 0x7); }
    /** @returns {byte} */ get RibbonCountG3Beauty() {return ((this.RIB0 >>> 3) & 0x7); }
    /** @returns {byte} */ get RibbonCountG3Cute() { return ((this.RIB0 >>> 6) & 0x7); }
    /** @returns {byte} */ get RibbonCountG3Smart() { return ((this.RIB0 >>> 9) & 0x7); }
    /** @returns {byte} */ get RibbonCountG3Tough() { return ((this.RIB0 >>> 12) & 0x7); }
    
    /** @returns {boolean} */ get RibbRibbonChampionG3() { return (this.RIB0 & (1 << 15)) == 1 << 15; }
    /** @returns {boolean} */ get RibbonWinning() { return (this.RIB0 & (1 << 16)) == 1 << 16; }
    /** @returns {boolean} */ get RibboRibbonVictory() { return (this.RIB0 & (1 << 17)) == 1 << 17; }

    /** @returns {boolean} */ get RibbonArtist() { return (this.RIB0 & (1 << 18)) == 1 << 18; }
    /** @returns {boolean} */ get RibbonEffort() { return (this.RIB0 & (1 << 19)) == 1 << 19; }
    /** @returns {boolean} */ get RibbonChampionBattle() { return (this.RIB0 & (1 << 20)) == 1 << 20; }
    /** @returns {boolean} */ get RibbonChampionRegional() { return (this.RIB0 & (1 << 21)) == 1 << 21; }
    /** @returns {boolean} */ get RibbonChampionNational() { return (this.RIB0 & (1 << 22)) == 1 << 22; }
    /** @returns {boolean} */ get RibbonCountry() { return (this.RIB0 & (1 << 23)) == 1 << 23; }
    /** @returns {boolean} */ get RibbonNational() { return (this.RIB0 & (1 << 24)) == 1 << 24; }
    /** @returns {boolean} */ get RibbonEarth() { return (this.RIB0 & (1 << 25)) == 1 << 25; }

    /** @returns {boolean} */ get RibbonWorld() { return (this.RIB0 & (1 << 26)) == 1 << 26; }

    /** @returns {boolean} */ get FatefulEncounter() { return this.RIB0 >>> 31 == 1; }

    /** @returns {int} */
    get RibbonCount() {
        var part1 = this.RIB0 & 0b00000111_11111111_11111111_11111111;
        
        var ct = 0;
        var parts = [part1];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) ct++;
            }
        }
        return ct;
    }

    /** @returns {boolean} */ get RibbonG3Cool() { return this.RibbonCountG3Cool > 0; }
    /** @returns {boolean} */ get RibbonG3CoolSuper() { return this.RibbonCountG3Cool > 1; }
    /** @returns {boolean} */ get RibbonG3CoolHyper() { return this.RibbonCountG3Cool > 2; }
    /** @returns {boolean} */ get RibbonG3CoolMaster() { return this.RibbonCountG3Cool > 3; }
    /** @returns {boolean} */ get RibbonG3Beauty() { return this.RibbonCountG3Beauty > 0; }
    /** @returns {boolean} */ get RibbonG3BeautySuper() { return this.RibbonCountG3Beauty > 1; }
    /** @returns {boolean} */ get RibbonG3BeautyHyper() { return this.RibbonCountG3Beauty > 2; }
    /** @returns {boolean} */ get RibbonG3BeautyMaster() { return this.RibbonCountG3Beauty > 3; }

    /** @returns {boolean} */ get RibbonG3Cute() { return this.RibbonCountG3Cute > 0; }
    /** @returns {boolean} */ get RibbonG3CuteSuper() { return this.RibbonCountG3Cute > 1; }
    /** @returns {boolean} */ get RibbonG3CuteHyper() { return this.RibbonCountG3Cute > 2; }
    /** @returns {boolean} */ get RibbonG3CuteMaster() { return this.RibbonCountG3Cute > 3; }
    /** @returns {boolean} */ get RibbonG3Smart() { return this.RibbonCountG3Smart > 0; }
    /** @returns {boolean} */ get RibbonG3SmartSuper() { return this.RibbonCountG3Smart > 1; }
    /** @returns {boolean} */ get RibbonG3SmartHyper() { return this.RibbonCountG3Smart > 2; }
    /** @returns {boolean} */ get RibbonG3SmartMaster() { return this.RibbonCountG3Smart > 3; }

    /** @returns {boolean} */ get RibbonG3Tough() { return this.RibbonCountG3Tough > 0; }
    /** @returns {boolean} */ get RibbonG3ToughSuper() { return this.RibbonCountG3Tough > 1; }
    /** @returns {boolean} */ get RibbonG3ToughHyper() { return this.RibbonCountG3Tough > 2; }
    /** @returns {boolean} */ get RibbonG3ToughMaster() { return this.RibbonCountG3Tough > 3; }

    /** @returns {int} */ get Status_Condition() { return this.dv.getInt32(0x50, true) >>> 0; }
};
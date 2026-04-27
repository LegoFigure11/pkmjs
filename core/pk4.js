import { getStringFromBuffer } from "./util/util.js";

/**
 * @typedef {number} byte   - 8-bit unsigned integer
 * @typedef {number} sbyte  - 8-bit signed integer
 * @typedef {number} ushort - 16-bit unsigned integer
 * @typedef {number} uint   - 32-bit unsigned integer
 * @typedef {number} int    - 32-bit signed integer
 * @typedef {bigint} ulong  - 64-bit unsigned integer
 */

/**
 * Read-only Pokemon Container for Diamond/Pearl/Platinum/HeartGold/SoulSilver
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/Shared/G4PKM.cs
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/PK4.cs
 */
export class PK4 {
    /** @type {ushort} */
    static SIZE = 236;

    /**
     * @param {ArrayBuffer} buf - An ArrayBuffer containing the raw decrypted pk4 data
     */
    constructor(buf) {
        this.buf = buf;
        this.dv = new DataView(buf);
    }

    /** @returns {uint} */ get PID() { return this.dv.getUint32(0x00, true) >>> 0; }
    /** @returns {uint} */ get PSV() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) >>> 3; }

    /** @returns {ushort} */ get Sanity() { return this.dv.getUint16(0x04, true); }

    /** @returns {ushort} */ get Checksum() { return this.dv.getUint16(0x06, true); }

    //// Block A

    /** @returns {ushort} */ get Species() {  return this.dv.getUint16(0x08, true); }

    /** @returns {ushort} */ get HeldItem() { return this.dv.getUint16(0x0A, true); }

    /** @returns {uint} */ get ID32() { return this.dv.getUint32(0x0C, true) >>> 0; }
    /** @returns {ushort} */ get TID16() { return this.dv.getUint16(0x0C, true); }
    /** @returns {ushort} */ get SID16() { return this.dv.getUint16(0x0E, true); }
    /** @returns {uint} */ get TSV() { return (this.TID16 ^ this.SID16) >>> 3; }

    /** @returns {uint} */ get EXP() { return this.dv.getUint32(0x10, true) >>> 0; }

    /** @returns {int} */ get OriginalTrainerFriendship() { return this.dv.getUint16(0x14, true); }

    /** @returns {int} */ get Ability() { return this.dv.getUint16(0x15, true); }

    /** @returns {byte} */ get Nature() { return this.PID % 25; }

    /** @returns {uint} */ get ShinyXOR() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) ^ this.TID16 ^ this.SID16; }
    /** @returns {boolean} */ get IsShiny() { return this.TSV == this.PSV; }
    /** @returns {boolean} */ get IsSquareShiny() { return this.IsShiny && (this.FatefulEncounter || this.ShinyXOR == 0); }
    /** @returns {boolean} */ get IsStarShiny() {return this.IsShiny && !this.IsSquareShiny }

    /** @returns {byte} */ get MarkingValue() { return this.dv.getUint8(0x16); }

    /** @returns {byte} */ get Language() { return this.dv.getUint8(0x17); }

    /** @returns {int} */ get EV_HP() { return this.dv.getUint8(0x18); }
    /** @returns {int} */ get EV_ATK() { return this.dv.getUint8(0x19); }
    /** @returns {int} */ get EV_DEF() { return this.dv.getUint8(0x1a); }
    /** @returns {int} */ get EV_SPE() { return this.dv.getUint8(0x1b); }
    /** @returns {int} */ get EV_SPA() { return this.dv.getUint8(0x1c); }
    /** @returns {int} */ get EV_SPD() { return this.dv.getUint8(0x1d); }

    /** @returns {byte} */ get ContestCool() { return this.dv.getUint8(0x1e); }
    /** @returns {byte} */ get ContestBeauty() { return this.dv.getUint8(0x1f); }
    /** @returns {byte} */ get ContestCute() { return this.dv.getUint8(0x20); }
    /** @returns {byte} */ get ContestSmart() { return this.dv.getUint8(0x21); }
    /** @returns {byte} */ get ContestTough() { return this.dv.getUint8(0x22); }
    /** @returns {byte} */ get ContestSheen() { return this.dv.getUint8(0x23); }

    /** @returns {byte} */ get RIB0() { return this.dv.getUint8(0x24); }
    /** @returns {byte} */ get RIB1() { return this.dv.getUint8(0x25); }
    /** @returns {byte} */ get RIB2() { return this.dv.getUint8(0x26); }
    /** @returns {byte} */ get RIB3() { return this.dv.getUint8(0x27); }

    /** @returns {boolean} */ get RibbonChampionSinnoh() { return (this.RIB0 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonAbility() { return (this.RIB0 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonAbilityGreat() { return (this.RIB0 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonAbilityDouble() { return (this.RIB0 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonAbilityMulti() { return (this.RIB0 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonAbilityPair() { return (this.RIB0 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonAbilityWorld() { return (this.RIB0 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonAlert() { return (this.RIB0 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonShock() { return (this.RIB1 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonDowncast() { return (this.RIB1 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonCareless() { return (this.RIB1 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonRelax() { return (this.RIB1 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonSnooze() { return (this.RIB1 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonSmile() { return (this.RIB1 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonGorgeous() { return (this.RIB1 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonRoyal() { return (this.RIB1 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonGorgeousRoyal() { return (this.RIB2 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonFootprint() { return (this.RIB2 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonRecord() { return (this.RIB2 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonEvent() { return (this.RIB2 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonLegend() { return (this.RIB2 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonChampionWorld() { return (this.RIB2 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonBirthday() { return (this.RIB2 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonSpecial() { return (this.RIB2 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonSouvenir() { return (this.RIB3 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonWishing() { return (this.RIB3 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonClassic() { return (this.RIB3 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonPremier() { return (this.RIB3 & (1 << 3)) == 1 << 3; }

    /** @returns {uint} */ get Ribbons1() { return this.dv.getUint32(0x24) >>> 0 };
    /** @returns {uint} */ get Ribbons2() { return this.dv.getUint32(0x3c) >>> 0 };
    /** @returns {uint} */ get Ribbons3() { return this.dv.getUint32(0x60) >>> 0 };

    /** @returns {int} */
    get RibbonCount() {
        var part1 = this.Ribbon1 & 0b00001111_11111111_11111111_11111111;
        var part2 = this.Ribbon2 & 0b11111111_11111111_11111111_11111111;
        var part3 = this.Ribbon3 & 0b00000000_00001111_11111111_11111111;
        
        var ct = 0;
        var parts = [part1, part2, part3];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) ct++;
            }
        }
        return ct;
    }

    //// Block B
    /** @returns {ushort} */ get Move1() { return this.dv.getUint16(0x28, true); }
    /** @returns {ushort} */ get Move2() { return this.dv.getUint16(0x2a, true); }
    /** @returns {ushort} */ get Move3() { return this.dv.getUint16(0x2c, true); }
    /** @returns {ushort} */ get Move4() { return this.dv.getUint16(0x2e, true); }

    /** @returns {int} */ get Move1_PP() { return this.dv.getUint8(0x30); }
    /** @returns {int} */ get Move2_PP() { return this.dv.getUint8(0x31); }
    /** @returns {int} */ get Move3_PP() { return this.dv.getUint8(0x32); }
    /** @returns {int} */ get Move4_PP() { return this.dv.getUint8(0x33); }

    /** @returns {int} */ get Move1_PPUps() { return this.dv.getUint8(0x34); }
    /** @returns {int} */ get Move2_PPUps() { return this.dv.getUint8(0x35); }
    /** @returns {int} */ get Move3_PPUps() { return this.dv.getUint8(0x36); }
    /** @returns {int} */ get Move4_PPUps() { return this.dv.getUint8(0x37); }

    /** @returns {uint} */ get IV32() { return this.dv.getUint32(0x38, true) >>> 0; }

    /** @returns {byte} */ get IV_HP()  { return (this.IV32 >> 0) & 0x1F; }
    /** @returns {byte} */ get IV_ATK() { return (this.IV32 >> 5) & 0x1F; }
    /** @returns {byte} */ get IV_DEF() { return (this.IV32 >> 10) & 0x1F; }
    /** @returns {byte} */ get IV_SPE() { return (this.IV32 >> 15) & 0x1F; }
    /** @returns {byte} */ get IV_SPA() { return (this.IV32 >> 20) & 0x1F; }
    /** @returns {byte} */ get IV_SPD() { return (this.IV32 >> 25) & 0x1F; }

    /** @returns {boolean} */ get IsEgg() { return ((this.IV32 >> 30) & 1) === 1; }
    /** @returns {boolean} */ get IsNicknamed() { return ((this.IV32 >> 31) & 1) === 1; }

    /** @returns {byte} */ get RIB4() { return this.dv.getUint8(0x3c); }
    /** @returns {byte} */ get RIB5() { return this.dv.getUint8(0x3d); }
    /** @returns {byte} */ get RIB6() { return this.dv.getUint8(0x3e); }
    /** @returns {byte} */ get RIB7() { return this.dv.getUint8(0x3f); }

    /** @returns {boolean} */ get RibbonG3Cool() { return (this.RIB4 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonG3CoolSuper() { return (this.RIB4 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonG3CoolHyper() { return (this.RIB4 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonG3CoolMaster() { return (this.RIB4 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonG3Beauty() { return (this.RIB4 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonG3BeautySuper() { return (this.RIB4 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonG3BeautyHyper() { return (this.RIB4 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonG3BeautyMaster() { return (this.RIB4 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonG3Cute() { return (this.RIB5 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonG3CuteSuper() { return (this.RIB5 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonG3CuteHyper() { return (this.RIB5 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonG3CuteMaster() { return (this.RIB5 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonG3Smart() { return (this.RIB5 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonG3SmartSuper() { return (this.RIB5 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonG3SmartHyper() { return (this.RIB5 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonG3SmartMaster() { return (this.RIB5 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonG3Tough() { return (this.RIB6 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonG3ToughSuper() { return (this.RIB6 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonG3ToughHyper() { return (this.RIB6 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonG3ToughMaster() { return (this.RIB6 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonChampionG3() { return (this.RIB6 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonWinning() { return (this.RIB6 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonVictory() { return (this.RIB6 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonArtist() { return (this.RIB6 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonEffort() { return (this.RIB7 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonChampionBattle() { return (this.RIB7 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonChampionRegional() { return (this.RIB7 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonChampionNational() { return (this.RIB7 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonCountry() { return (this.RIB7 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonNational() { return (this.RIB7 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonEarth() { return (this.RIB7 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonWorld() { return (this.RIB7 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get FatefulEncounter() { return (this.dv.getUint8(0x40) & 1) === 1; }

    /** @returns {byte} */ get Gender() { return (this.dv.getUint8(0x40) >>> 1) & 0x3; }

    /** @returns {byte} */ get Form() { return this.dv.getUint8(0x40) >>> 3; }

    /** @returns {int} */ get ShinyLeaf() { return this.dv.getUint8(0x41); }

    /** @returns {ushort} */ get EggLocationExtended() { return this.dv.getUint16(0x44); }
    
    /** @returns {ushort} */ get MetLocationExtended() { return this.dv.getUint16(0x46); }


    //// Block C

    /** @returns {string} */
    get Nickname() {
        var slice = this.buf.slice(0x48, 0x48 + 22);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get Version() { return this.dv.getUint8(0x5f); }

    /** @returns {byte} */ get RIB8() { return this.dv.getUint8(0x60); }
    /** @returns {byte} */ get RIB9() { return this.dv.getUint8(0x61); }
    /** @returns {byte} */ get RIBA() { return this.dv.getUint8(0x62); }

    /** @returns {boolean} */ get RibbonG4Cool() { return (this.RIB8 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonG4CoolGreat() { return (this.RIB8 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonG4CoolUltra() { return (this.RIB8 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonG4CoolMaster() { return (this.RIB8 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonG4Beauty() { return (this.RIB8 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonG4BeautyGreat() { return (this.RIB8 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonG4BeautyUltra() { return (this.RIB8 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonG4BeautyMaster() { return (this.RIB8 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonG4Cute() { return (this.RIB9 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonG4CuteGreat() { return (this.RIB9 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonG4CuteUltra() { return (this.RIB9 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonG4CuteMaster() { return (this.RIB9 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonG4Smart() { return (this.RIB9 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonG4SmartGreat() { return (this.RIB9 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonG4SmartUltra() { return (this.RIB9 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonG4SmartMaster() { return (this.RIB9 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonG4Tough() { return (this.RIBA & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonG4ToughGreat() { return (this.RIBA & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonG4ToughUltra() { return (this.RIBA & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonG4ToughMaster() { return (this.RIBA & (1 << 3)) == 1 << 3; }

    //// Block D
    
    get OriginalTrainerName() {
        var slice = this.buf.slice(0x68, 0x68 + 16);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get EggYear() { return this.dv.getUint8(0x78); }
    /** @returns {byte} */ get EggMonth() { return this.dv.getUint8(0x79); }
    /** @returns {byte} */ get EggDay() { return this.dv.getUint8(0x7a); }

    /** @returns {byte} */ get MetYear() { return this.dv.getUint8(0x7b); }
    /** @returns {byte} */ get MetMonth() { return this.dv.getUint8(0x7c); }
    /** @returns {byte} */ get MetDay() { return this.dv.getUint8(0x7d); }

    /** @returns {ushort} */ get EggLocationDP() { return this.dv.getUint16(0x7e, true); }
    /** @returns {ushort} */ get MetLocationDP() { return this.dv.getUint16(0x80, true); }

    /** @returns {ushort} */ get EggLocation() { return this.EggLocationExtended == 0 ? this.EggLocationDP : this.EggLocationExtended; }
    /** @returns {ushort} */ get MetLocation() { return this.MetLocationExtended == 0 ? this.MetLocationDP : this.MetLocationExtended; }

    /** @returns {byte} */ get PokerusState() { return this.dv.getUint8(0x82); }
    /** @returns {int} */ get PokerusDays() { return (this.PokerusState & 0xF) >>> 0; }
    /** @returns {int} */ get PokerusStrain() { return (this.PokerusState >> 4) >>> 0; }

    /** @returns {byte} */ get BallDPPt() { return this.dv.getUint8(0x83); }

    /** @returns {byte} */ get MetLevel() { return this.dv.getUint8(0x84) & ~0x80; }
    
    /** @returns {byte} */ get OriginalTrainerGender() { return this.dv.getUint8(0x84) >> 7; }

    /** @returns {byte} */ get GroundTile() { return this.dv.getUint8(0x85); }
    
    /** @returns {byte} */ get BallHGSS() { return this.dv.getUint8(0x86); }

    /** @returns {byte} */ get Ball() { return Math.max(this.BallHGSS, this.BallHGSS); }

    /** @returns {sbyte} */ get WalkingMood() { return this.dv.getInt8(0x87); }

    /** @returns {int} */ get Status_Condition() { return this.dv.getInt32(0x88, true) >>> 0; }
};
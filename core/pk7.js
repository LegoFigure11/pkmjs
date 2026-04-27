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
 * Read-only Pokemon Container for (Ultra) Sun/Moon
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/PK6.cs
 */
export class PK7 {
    /** @type {ushort} */
    static SIZE = 260;

    /**
     * @param {ArrayBuffer} buf - An ArrayBuffer containing the raw decrypted pk7 data
     */
    constructor(buf) {
        this.buf = buf;
        this.dv = new DataView(buf);
    }

    //// Block A

    /** @returns {uint} */ get EncryptionConstant() { return this.dv.getUint32(0x00, true) >>> 0; }

    /** @returns {ushort} */ get Sanity() { return this.dv.getUint16(0x04, true); }

    /** @returns {ushort} */ get Checksum() { return this.dv.getUint16(0x06, true); }

    /** @returns {ushort} */ get Species() {  return this.dv.getUint16(0x08, true); }

    /** @returns {ushort} */ get HeldItem() { return this.dv.getUint16(0x0A, true); }

    /** @returns {uint} */ get ID32() { return this.dv.getUint32(0x0C, true) >>> 0; }
    /** @returns {ushort} */ get TID16() { return this.dv.getUint16(0x0C, true); }
    /** @returns {ushort} */ get SID16() { return this.dv.getUint16(0x0E, true); }

    /** @returns {uint} */ get TSV() {return (this.TID16 ^ this.SID16) >>> 4 }

    /** @returns {uint} */ get EXP() { return this.dv.getUint32(0x10, true) >>> 0; }

    /** @returns {int} */ get Ability() { return this.dv.getUint16(0x14, true); }

    /** @returns {int} */ get AbilityNumber() { return (this.dv.getUint8(0x15) & 7); }

    /** @returns {ushort} */ get MarkingValue() { return this.dv.getUint16(0x16, true); }

    /** @returns {uint} */ get PID() { return this.dv.getUint32(0x18, true) >>> 0; }
    /** @returns {uint} */ get PSV() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) >>> 4; }

    /** @returns {uint} */ get ShinyXOR() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) ^ this.TID16 ^ this.SID16; }
    /** @returns {boolean} */ get IsShiny() { return this.TSV == this.PSV; }
    /** @returns {boolean} */ get IsSquareShiny() { return this.IsShiny && (this.FatefulEncounter || this.ShinyXOR == 0); }
    /** @returns {boolean} */ get IsStarShiny() {return this.IsShiny && !this.IsSquareShiny }

    /** @returns {byte} */ get Nature() { return this.dv.getUint8(0x1c); }

    /** @returns {boolean} */ get FatefulEncounter() { return (this.dv.getUint8(0x1d) & 1) === 1; }

    /** @returns {byte} */ get Gender() { return (this.dv.getUint8(0x1d) >>> 1) & 0x3; }

    /** @returns {byte} */ get Form() { return this.dv.getUint8(0x1d) >>> 3; }

    /** @returns {int} */ get EV_HP() { return this.dv.getUint8(0x1e); }
    /** @returns {int} */ get EV_ATK() { return this.dv.getUint8(0x1f); }
    /** @returns {int} */ get EV_DEF() { return this.dv.getUint8(0x20); }
    /** @returns {int} */ get EV_SPE() { return this.dv.getUint8(0x21); }
    /** @returns {int} */ get EV_SPA() { return this.dv.getUint8(0x22); }
    /** @returns {int} */ get EV_SPD() { return this.dv.getUint8(0x23); }

    /** @returns {byte} */ get ContestCool() { return this.dv.getUint8(0x24); }
    /** @returns {byte} */ get ContestBeauty() { return this.dv.getUint8(0x25); }
    /** @returns {byte} */ get ContestCute() { return this.dv.getUint8(0x26); }
    /** @returns {byte} */ get ContestSmart() { return this.dv.getUint8(0x27); }
    /** @returns {byte} */ get ContestTough() { return this.dv.getUint8(0x28); }
    /** @returns {byte} */ get ContestSheen() { return this.dv.getUint8(0x29); }

    /** @returns {byte} */ get ResortEventStatus() { return this.dv.getUint8(0x2a); }

    /** @returns {byte} */ get PokerusState() { return this.dv.getUint8(0x2b); }
    /** @returns {int} */ get PokerusDays() { return (this.PokerusState & 0xF) >>> 0; }
    /** @returns {int} */ get PokerusStrain() { return (this.PokerusState >> 4) >>> 0; }

    /** @returns {byte} */ get ST1() { return this.dv.getUint8(0x2c); }
    /** @returns {boolean} */ get SuperTrain1_SPA() { return (this.ST1 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get SuperTrain1_HP() { return (this.ST1 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get SuperTrain1_ATK() { return (this.ST1 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get SuperTrain1_SPD() { return (this.ST1 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get SuperTrain1_SPE() { return (this.ST1 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get SuperTrain1_DEF() { return (this.ST1 & (1 << 7)) == 1 << 7; }

    /** @returns {byte} */ get ST2() { return this.dv.getUint8(0x2d); }
    /** @returns {boolean} */ get SuperTrain2_SPA() { return (this.ST2 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get SuperTrain2_HP() { return (this.ST2 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get SuperTrain2_ATK() { return (this.ST2 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get SuperTrain2_SPD() { return (this.ST2 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get SuperTrain2_SPE() { return (this.ST2 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get SuperTrain2_DEF() { return (this.ST2 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get SuperTrain3_SPA() { return (this.ST2 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get SuperTrain3_HP() { return (this.ST2 & (1 << 7)) == 1 << 7; }

    /** @returns {byte} */ get ST3() { return this.dv.getUint8(0x2e); }
    /** @returns {boolean} */ get SuperTrain3_ATK() { return (this.ST3 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get SuperTrain3_SPD() { return (this.ST3 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get SuperTrain3_SPE() { return (this.ST3 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get SuperTrain3_DEF() { return (this.ST3 & (1 << 3)) == 1 << 3; }

    /** @returns {uint} */ get SuperTrainBitFlags() { return this.dv.getUint32(0x2c) >>> 0; }
    
    /** @returns {byte} */ get RIB0() { return this.dv.getUint8(0x30); }
    /** @returns {byte} */ get RIB1() { return this.dv.getUint8(0x31); }
    /** @returns {byte} */ get RIB2() { return this.dv.getUint8(0x32); }
    /** @returns {byte} */ get RIB3() { return this.dv.getUint8(0x33); }
    /** @returns {byte} */ get RIB4() { return this.dv.getUint8(0x34); }
    /** @returns {byte} */ get RIB5() { return this.dv.getUint8(0x35); }
    /** @returns {byte} */ get RIB6() { return this.dv.getUint8(0x36); }

    /** @returns {uint} */ get Ribbons1() { return this.dv.getUint32(0x30) >>> 0; }
    /** @returns {uint} */ get Ribbons2() { return this.dv.getUint32(0x34) >>> 0; }

    /** @returns {boolean} */ get RibbonChampionKalos() { return (this.RIB0 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonChampionG3() { return (this.RIB0 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonChampionSinnoh() { return (this.RIB0 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonBestFriends() { return (this.RIB0 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonTraining() { return (this.RIB0 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonBattlerSkillful() { return (this.RIB0 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonBattlerExpert() { return (this.RIB0 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonEffort() { return (this.RIB0 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonAlert() { return (this.RIB1 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonShock() { return (this.RIB1 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonDowncast() { return (this.RIB1 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonCareless() { return (this.RIB1 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonRelax() { return (this.RIB1 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonSnooze() { return (this.RIB1 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonSmile() { return (this.RIB1 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonGorgeous() { return (this.RIB1 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonRoyal() { return (this.RIB2 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonGorgeousRoyal() { return (this.RIB2 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonArtist() { return (this.RIB2 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonFootprint() { return (this.RIB2 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonRecord() { return (this.RIB2 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonLegend() { return (this.RIB2 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonCountry() { return (this.RIB2 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonNational() { return (this.RIB2 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonEarth() { return (this.RIB3 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonWorld() { return (this.RIB3 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonClassic() { return (this.RIB3 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonPremier() { return (this.RIB3 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonEvent() { return (this.RIB3 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonBirthday() { return (this.RIB3 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonSpecial() { return (this.RIB3 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonSouvenir() { return (this.RIB3 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonWishing() { return (this.RIB4 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonChampionBattle() { return (this.RIB4 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonChampionRegional() { return (this.RIB4 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonChampionNational() { return (this.RIB4 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonChampionWorld() { return (this.RIB4 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get HasContestMemoryRibbon() { return (this.RIB4 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get HasBattleMemoryRibbon() { return (this.RIB4 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonChampionG6Hoenn() { return (this.RIB4 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonContestStar() { return (this.RIB5 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonMasterCoolness() { return (this.RIB5 & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get RibbonMasterBeauty() { return (this.RIB5 & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get RibbonMasterCuteness() { return (this.RIB5 & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get RibbonMasterCleverness() { return (this.RIB5 & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get RibbonMasterToughness() { return (this.RIB5 & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get RibbonChampionAlola() { return (this.RIB5 & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get RibbonBattleRoyale() { return (this.RIB5 & (1 << 7)) == 1 << 7; }

    /** @returns {boolean} */ get RibbonBattleTreeGreat() { return (this.RIB6 & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get RibbonBattleTreeMaster() { return (this.RIB6 & (1 << 1)) == 1 << 1; }

    /** @returns {byte} */ get RibbonCountMemoryContest() { return this.dv.getUint8(0x35); }
    /** @returns {byte} */ get RibbonCountMemoryBattle() { return this.dv.getUint8(0x36); }

    /** @returns {int} */
    get RibbonCount() {
        var part1 = this.Ribbon1 & 0b11111111_11111111_11111111_11111111;
        var part2 = this.Ribbon2 & 0b00000000_00000011_11111111_11111111;
        
        var ct = 0;
        var parts = [part1, part2];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) ct++;
            }
        }
        return ct;
    }

    /** @returns {ushort} */ get DistTrainBitFlags() { return this.dv.getUint16(0x3a); }
    /** @returns {boolean} */ get DistSuperTrain1() { return (this.DistTrainBitFlags & (1 << 0)) == 1 << 0; }
    /** @returns {boolean} */ get DistSuperTrain2() { return (this.DistTrainBitFlags & (1 << 1)) == 1 << 1; }
    /** @returns {boolean} */ get DistSuperTrain3() { return (this.DistTrainBitFlags & (1 << 2)) == 1 << 2; }
    /** @returns {boolean} */ get DistSuperTrain4() { return (this.DistTrainBitFlags & (1 << 3)) == 1 << 3; }
    /** @returns {boolean} */ get DistSuperTrain5() { return (this.DistTrainBitFlags & (1 << 4)) == 1 << 4; }
    /** @returns {boolean} */ get DistSuperTrain6() { return (this.DistTrainBitFlags & (1 << 5)) == 1 << 5; }
    /** @returns {boolean} */ get Dist7() { return (this.DistTrainBitFlags & (1 << 6)) == 1 << 6; }
    /** @returns {boolean} */ get Dist8() { return (this.DistTrainBitFlags & (1 << 7)) == 1 << 7; }

    /** @returns {uint} */ get FormArgument() { return this.dv.getUint32(0x3c, true) >>> 0; }
    /** @returns {byte} */ get FormArgumentRemain() { return (this.formArgument & 0xFF) >>> 0; }
    /** @returns {byte} */ get FormArgumentElapsed() { return (this.formArgument >> 8) & 0xFF; }
    /** @returns {byte} */ get FormArgumentMaximum() { return (this.formArgument >> 16) & 0xFF; }

    //// Block B
    /** @returns {string} */
    get Nickname() {
        var slice = this.buf.slice(0x40, 0x40 + 26);
        return getStringFromBuffer(slice);
    }
    
    /** @returns {ushort} */ get Move1() { return this.dv.getUint16(0x5a, true); }
    /** @returns {ushort} */ get Move2() { return this.dv.getUint16(0x5c, true); }
    /** @returns {ushort} */ get Move3() { return this.dv.getUint16(0x5e, true); }
    /** @returns {ushort} */ get Move4() { return this.dv.getUint16(0x60, true); }

    /** @returns {int} */ get Move1_PP() { return this.dv.getUint8(0x62); }
    /** @returns {int} */ get Move2_PP() { return this.dv.getUint8(0x63); }
    /** @returns {int} */ get Move3_PP() { return this.dv.getUint8(0x64); }
    /** @returns {int} */ get Move4_PP() { return this.dv.getUint8(0x65); }

    /** @returns {int} */ get Move1_PPUps() { return this.dv.getUint8(0x66); }
    /** @returns {int} */ get Move2_PPUps() { return this.dv.getUint8(0x67); }
    /** @returns {int} */ get Move3_PPUps() { return this.dv.getUint8(0x68); }
    /** @returns {int} */ get Move4_PPUps() { return this.dv.getUint8(0x69); }

    /** @returns {ushort} */ get RelearnMove1() { return this.dv.getUint16(0x6a, true); }
    /** @returns {ushort} */ get RelearnMove2() { return this.dv.getUint16(0x6c, true); }
    /** @returns {ushort} */ get RelearnMove3() { return this.dv.getUint16(0x6e, true); }
    /** @returns {ushort} */ get RelearnMove4() { return this.dv.getUint16(0x70, true); }

    /** @returns {boolean} */ get SecretSuperTrainingUnlocked() { return this.dv.getUint8(0x72) & 1 == 1; }
    /** @returns {boolean} */ get SuperTrainSupremelyTrained() { return this.dv.getUint8(0x72) & 2 == 2; }

    /** @returns {uint} */ get IV32() { return this.dv.getUint32(0x74, true) >>> 0; }

    /** @returns {byte} */ get IV_HP()  { return (this.IV32 >> 0) & 0x1F; }
    /** @returns {byte} */ get IV_ATK() { return (this.IV32 >> 5) & 0x1F; }
    /** @returns {byte} */ get IV_DEF() { return (this.IV32 >> 10) & 0x1F; }
    /** @returns {byte} */ get IV_SPE() { return (this.IV32 >> 15) & 0x1F; }
    /** @returns {byte} */ get IV_SPA() { return (this.IV32 >> 20) & 0x1F; }
    /** @returns {byte} */ get IV_SPD() { return (this.IV32 >> 25) & 0x1F; }

    /** @returns {boolean} */ get IsEgg() { return ((this.IV32 >> 30) & 1) === 1; }
    /** @returns {boolean} */ get IsNicknamed() { return ((this.IV32 >> 31) & 1) === 1; }

    //// Block C
    /** @returns {string} */
    get HandlingTrainerName() {
        var slice = this.buf.slice(0x78, 0x78 + 26);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get HandlingTrainerGender() { return this.dv.getUint8(0x92); }
    /** @returns {byte} */ get CurrentHandler() { return this.dv.getUint8(0x93); }

    /** @returns {byte} */ get Geo1_Region() { return this.dv.getUint8(0x94); }
    /** @returns {byte} */ get Geo1_Country() { return this.dv.getUint8(0x95); }
    /** @returns {byte} */ get Geo2_Region() { return this.dv.getUint8(0x96); }
    /** @returns {byte} */ get Geo2_Country() { return this.dv.getUint8(0x97); }
    /** @returns {byte} */ get Geo3_Region() { return this.dv.getUint8(0x98); }
    /** @returns {byte} */ get Geo3_Country() { return this.dv.getUint8(0x99); }
    /** @returns {byte} */ get Geo4_Region() { return this.dv.getUint8(0x9a); }
    /** @returns {byte} */ get Geo4_Country() { return this.dv.getUint8(0x9b); }
    /** @returns {byte} */ get Geo5_Region() { return this.dv.getUint8(0x9c); }
    /** @returns {byte} */ get Geo5_Country() { return this.dv.getUint8(0x9d); }

    /** @returns {byte} */ get HandlingTrainerFriendship() { return this.dv.getUint8(0xa2); }
    /** @returns {byte} */ get HandlingTrainerAffection() { return this.dv.getUint8(0xa3); }
    /** @returns {byte} */ get HandlingTrainerMemoryIntensity() { return this.dv.getUint8(0xa4); }
    /** @returns {byte} */ get HandlingTrainerMemory() { return this.dv.getUint8(0xa5); }
    /** @returns {byte} */ get HandlingTrainerMemoryFeeling() { return this.dv.getUint8(0xa6); }
    /** @returns {ushort} */ get HandlingTrainerMemoryVariable() { return this.dv.getUint16(0xa8, true); }

    /** @returns {byte} */ get Fullness() { return this.dv.getUint8(0xae); }
    /** @returns {byte} */ get Enjoyment() { return this.dv.getUint8(0xaf); }

    //// Block D
    get OriginalTrainerName() {
        var slice = this.buf.slice(0xB0, 0xB0 + 26);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get OriginalTrainerFriendship() { return this.dv.getUint8(0xca); }
    /** @returns {byte} */ get OriginalTrainerAffection() { return this.dv.getUint8(0xcb); }
    /** @returns {byte} */ get OriginalTrainerMemoryIntensity() { return this.dv.getUint8(0xcc); }
    /** @returns {byte} */ get OriginalTrainerMemory() { return this.dv.getUint8(0xcd); }
    /** @returns {ushort} */ get OriginalTrainerMemoryVariable() { return this.dv.getUint16(0xce, true); }
    /** @returns {byte} */ get OriginalTrainerMemoryFeeling() { return this.dv.getUint8(0xd0); }

    /** @returns {byte} */ get EggYear() { return this.dv.getUint8(0xd1); }
    /** @returns {byte} */ get EggMonth() { return this.dv.getUint8(0xd2); }
    /** @returns {byte} */ get EggDay() { return this.dv.getUint8(0xd3); }

    /** @returns {byte} */ get MetYear() { return this.dv.getUint8(0xd4); }
    /** @returns {byte} */ get MetMonth() { return this.dv.getUint8(0xd5); }
    /** @returns {byte} */ get MetDay() { return this.dv.getUint8(0xd6); }

    /** @returns {ushort} */ get EggLocation() { return this.dv.getUint16(0xd8, true); }
    /** @returns {ushort} */ get MetLocation() { return this.dv.getUint16(0xda, true); }

    /** @returns {byte} */ get Ball() { return this.dv.getUint8(0xdc); }

    /** @returns {byte} */ get MetLevel() { return this.dv.getUint8(0xdd) & ~0x80; }
    
    /** @returns {byte} */ get OriginalTrainerGender() { return this.dv.getUint8(0xdd) >> 7; }

    /** @returns {byte} */ get HyperTrainFlags() { return this.dv.getUint8(0xde); }

    /** @returns {boolean} */ get HT_HP()  { return ((this.HyperTrainFlags >> 0) & 1) === 1; }
    /** @returns {boolean} */ get HT_ATK() { return ((this.HyperTrainFlags >> 1) & 1) === 1; }
    /** @returns {boolean} */ get HT_DEF() { return ((this.HyperTrainFlags >> 2) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPA() { return ((this.HyperTrainFlags >> 3) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPD() { return ((this.HyperTrainFlags >> 4) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPE() { return ((this.HyperTrainFlags >> 5) & 1) === 1; }
    
    /** @returns {byte} */ get Version() { return this.dv.getUint8(0xdf); }
    
    /** @returns {byte} */ get Country() { return this.dv.getUint8(0xe0); }
    /** @returns {byte} */ get Region() { return this.dv.getUint8(0xe1); }
    /** @returns {byte} */ get ConsoleRegion() { return this.dv.getUint8(0xe2); }

    /** @returns {int} */ get Language() { return this.dv.getUint8(0xe3); }


    /** @returns {int} */ get Status_Condition() { return this.dv.getInt32(0xe8, true) >>> 0; }
};
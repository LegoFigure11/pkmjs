import { getSpecies9, getStringFromBuffer } from "./util/util.js";

/**
 * @typedef {number} byte   - 8-bit unsigned integer
 * @typedef {number} sbyte  - 8-bit signed integer
 * @typedef {number} ushort - 16-bit unsigned integer
 * @typedef {number} uint   - 32-bit unsigned integer
 * @typedef {number} int    - 32-bit signed integer
 * @typedef {bigint} ulong  - 64-bit unsigned integer
 */

/**
 * Read-only Pokemon Container for Legends: Arceus
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/PA8.cs
 */
export class PA8 {
    /** @type {ushort} */
    static SIZE = 344;

    /**
     * @param {ArrayBuffer} buf - An ArrayBuffer containing the raw decrypted pa8 data
     */
    constructor(buf) {
        this.buf = buf;
        this.dv = new DataView(buf);
    }

    /** @returns {uint} */ get EncryptionConstant() { return this.dv.getUint32(0x00, true) >>> 0; }

    /** @returns {ushort} */ get Sanity() { return this.dv.getUint16(0x04, true); }

    /** @returns {ushort} */ get Checksum() { return this.dv.getUint16(0x06, true); }

    //// Block A
    /** @returns {ushort} */ get SpeciesInternal() { return this.dv.getUint16(0x08, true); }
    /** @returns {ushort} */ get Species() { return getSpecies9(this.SpeciesInternal); }

    /** @returns {ushort} */ get HeldItem() { return this.dv.getUint16(0x0A, true); }

    /** @returns {uint} */ get ID32() { return this.dv.getUint32(0x0C, true) >>> 0; }
    /** @returns {ushort} */ get TID16() { return this.dv.getUint16(0x0C, true); }
    /** @returns {ushort} */ get SID16() { return this.dv.getUint16(0x0E, true); }

    /** @returns {uint} */ get TSV() {return (this.TID16 ^ this.SID16) >>> 4 }

    /** @returns {uint} */ get EXP() { return this.dv.getUint32(0x10, true) >>> 0; }

    /** @returns {int} */ get Ability() { return this.dv.getUint16(0x14, true); }

    /** @returns {int} */ get AbilityNumber() { return (this.dv.getUint8(0x16) & 7); }

    /** @returns {boolean} */ get IsFavorite() { return (this.dv.getUint8(0x16) & 8) !== 0; }
    /** @returns {boolean} */ get CanGigantamax() { return (this.dv.getUint8(0x16) & 16) !== 0; }
    /** @returns {boolean} */ get IsAlpha() { return (this.dv.getUint8(0x16) & 32) !== 0; }
    /** @returns {boolean} */ get IsNoble() { return (this.dv.getUint8(0x16) & 64) !== 0; }

    /** @returns {ushort} */ get MarkingValue() { return this.dv.getUint16(0x18, true); }

    /** @returns {uint} */ get PID() { return this.dv.getUint32(0x1C, true) >>> 0; }
    /** @returns {uint} */ get PSV() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) >>> 4; }

    /** @returns {uint} */ get ShinyXOR() { return (this.PID >>> 16) ^ (this.PID & 0xFFFF) ^ this.TID16 ^ this.SID16; }
    /** @returns {boolean} */ get IsShiny() { return this.TSV == this.PSV; }
    /** @returns {boolean} */ get IsSquareShiny() { return this.IsShiny && (this.FatefulEncounter || this.ShinyXOR == 0); }
    /** @returns {boolean} */ get IsStarShiny() {return this.IsShiny && !this.IsSquareShiny }

    /** @returns {byte} */ get Nature() { return this.dv.getUint8(0x20); }

    /** @returns {byte} */ get StatNature() { return this.dv.getUint8(0x21); }

    /** @returns {boolean} */ get FatefulEncounter() { return (this.dv.getUint8(0x22) & 1) === 1; }

    /** @returns {byte} */ get Gender() { return (this.dv.getUint8(0x22) >>> 2) & 0x3; }

    /** @returns {byte} */ get Form() { return this.dv.getUint8(0x24); }

    /** @returns {int} */ get EV_HP() { return this.dv.getUint8(0x26); }
    /** @returns {int} */ get EV_ATK() { return this.dv.getUint8(0x27); }
    /** @returns {int} */ get EV_DEF() { return this.dv.getUint8(0x28); }
    /** @returns {int} */ get EV_SPE() { return this.dv.getUint8(0x29); }
    /** @returns {int} */ get EV_SPA() { return this.dv.getUint8(0x2A); }
    /** @returns {int} */ get EV_SPD() { return this.dv.getUint8(0x2B); }

    /** @returns {byte} */ get ContestCool() { return this.dv.getUint8(0x2C); }
    /** @returns {byte} */ get ContestBeauty() { return this.dv.getUint8(0x2D); }
    /** @returns {byte} */ get ContestCute() { return this.dv.getUint8(0x2E); }
    /** @returns {byte} */ get ContestSmart() { return this.dv.getUint8(0x2F); }
    /** @returns {byte} */ get ContestTough() { return this.dv.getUint8(0x30); }
    /** @returns {byte} */ get ContestSheen() { return this.dv.getUint8(0x31); }

    /** @returns {byte} */ get PokerusState() { return this.dv.getUint8(0x32); }

    /** @returns {int} */ get PokerusDays() { return (this.PokerusState & 0xF) >>> 0; }

    /** @returns {int} */ get PokerusStrain() { return (this.PokerusState >> 4) >>> 0; }

    
    /** @returns {uint} */ get Ribbon1() { return this.dv.getUint32(0x34, true) >>> 0 };
    
    /** @returns {uint} */ get Ribbon2() { return this.dv.getUint32(0x38, true) >>> 0 };
    
    /** @returns {uint} */ get Ribbon3() { return this.dv.getUint32(0x40, true) >>> 0 };
    
    /** @returns {uint} */ get Ribbon4() { return this.dv.getUint32(0x44, true) >>> 0 };

    /** @returns {boolean} */ get RibbonChampionKalos() { return this.util.GetFlag(this.dv.getUint8(0x34), 0); }
    /** @returns {boolean} */ get RibbonChampionG3() { return this.util.GetFlag(this.dv.getUint8(0x34), 1); }
    /** @returns {boolean} */ get RibbonChampionSinnoh() { return this.util.GetFlag(this.dv.getUint8(0x34), 2); }
    /** @returns {boolean} */ get RibbonBestFriends() { return this.util.GetFlag(this.dv.getUint8(0x34), 3); }
    /** @returns {boolean} */ get RibbonTraining() { return this.util.GetFlag(this.dv.getUint8(0x34), 4); }
    /** @returns {boolean} */ get RibbonBattlerSkillful() { return this.util.GetFlag(this.dv.getUint8(0x34), 5); }
    /** @returns {boolean} */ get RibbonBattlerExpert() { return this.util.GetFlag(this.dv.getUint8(0x34), 6); }
    /** @returns {boolean} */ get RibbonEffort() { return this.util.GetFlag(this.dv.getUint8(0x34), 7); }
    
    /** @returns {boolean} */ get RibbonAlert() { return this.util.GetFlag(this.dv.getUint8(0x35), 0); }
    /** @returns {boolean} */ get RibbonShock() { return this.util.GetFlag(this.dv.getUint8(0x35), 1); }
    /** @returns {boolean} */ get RibbonDowncast() { return this.util.GetFlag(this.dv.getUint8(0x35), 2); }
    /** @returns {boolean} */ get RibbonCareless() { return this.util.GetFlag(this.dv.getUint8(0x35), 3); }
    /** @returns {boolean} */ get RibbonRelax() { return this.util.GetFlag(this.dv.getUint8(0x35), 4); }
    /** @returns {boolean} */ get RibbonSnooze() { return this.util.GetFlag(this.dv.getUint8(0x35), 5); }
    /** @returns {boolean} */ get RibbonSmile() { return this.util.GetFlag(this.dv.getUint8(0x35), 6); }
    /** @returns {boolean} */ get RibbonGorgeous() { return this.util.GetFlag(this.dv.getUint8(0x35), 7); }
    
    /** @returns {boolean} */ get RibbonRoyal() { return this.util.GetFlag(this.dv.getUint8(0x36), 0); }
    /** @returns {boolean} */ get RibbonGorgeousRoyal() { return this.util.GetFlag(this.dv.getUint8(0x36), 1); }
    /** @returns {boolean} */ get RibbonArtist() { return this.util.GetFlag(this.dv.getUint8(0x36), 2); }
    /** @returns {boolean} */ get RibbonFootprint() { return this.util.GetFlag(this.dv.getUint8(0x36), 3); }
    /** @returns {boolean} */ get RibbonRecord() { return this.util.GetFlag(this.dv.getUint8(0x36), 4); }
    /** @returns {boolean} */ get RibbonLegend() { return this.util.GetFlag(this.dv.getUint8(0x36), 5); }
    /** @returns {boolean} */ get RibbonCountry() { return this.util.GetFlag(this.dv.getUint8(0x36), 6); }
    /** @returns {boolean} */ get RibbonNational() { return this.util.GetFlag(this.dv.getUint8(0x36), 7); }
    
    /** @returns {boolean} */ get RibbonEarth() { return this.util.GetFlag(this.dv.getUint8(0x37), 0); }
    /** @returns {boolean} */ get RibbonWorld() { return this.util.GetFlag(this.dv.getUint8(0x37), 1); }
    /** @returns {boolean} */ get RibbonClassic() { return this.util.GetFlag(this.dv.getUint8(0x37), 2); }
    /** @returns {boolean} */ get RibbonPremier() { return this.util.GetFlag(this.dv.getUint8(0x37), 3); }
    /** @returns {boolean} */ get RibbonEvent() { return this.util.GetFlag(this.dv.getUint8(0x37), 4); }
    /** @returns {boolean} */ get RibbonBirthday() { return this.util.GetFlag(this.dv.getUint8(0x37), 5); }
    /** @returns {boolean} */ get RibbonSpecial() { return this.util.GetFlag(this.dv.getUint8(0x37), 6); }
    /** @returns {boolean} */ get RibbonSouvenir() { return this.util.GetFlag(this.dv.getUint8(0x37), 7); }
    
    /** @returns {boolean} */ get RibbonWishing() { return this.util.GetFlag(this.dv.getUint8(0x38), 0); }
    /** @returns {boolean} */ get RibbonChampionBattle() { return this.util.GetFlag(this.dv.getUint8(0x38), 1); }
    /** @returns {boolean} */ get RibbonChampionRegional() { return this.util.GetFlag(this.dv.getUint8(0x38), 2); }
    /** @returns {boolean} */ get RibbonChampionNational() { return this.util.GetFlag(this.dv.getUint8(0x38), 3); }
    /** @returns {boolean} */ get RibbonChampionWorld() { return this.util.GetFlag(this.dv.getUint8(0x38), 4); }
    /** @returns {boolean} */ get HasContestMemoryRibbon() { return this.util.GetFlag(this.dv.getUint8(0x38), 5); }
    /** @returns {boolean} */ get HasBattleMemoryRibbon() { return this.util.GetFlag(this.dv.getUint8(0x38), 6); }
    /** @returns {boolean} */ get RibbonChampionG6Hoenn() { return this.util.GetFlag(this.dv.getUint8(0x38), 7); }
    
    /** @returns {boolean} */ get RibbonContestStar() { return this.util.GetFlag(this.dv.getUint8(0x39), 0); }
    /** @returns {boolean} */ get RibbonMasterCoolness() { return this.util.GetFlag(this.dv.getUint8(0x39), 1); }
    /** @returns {boolean} */ get RibbonMasterBeauty() { return this.util.GetFlag(this.dv.getUint8(0x39), 2); }
    /** @returns {boolean} */ get RibbonMasterCuteness() { return this.util.GetFlag(this.dv.getUint8(0x39), 3); }
    /** @returns {boolean} */ get RibbonMasterCleverness() { return this.util.GetFlag(this.dv.getUint8(0x39), 4); }
    /** @returns {boolean} */ get RibbonMasterToughness() { return this.util.GetFlag(this.dv.getUint8(0x39), 5); }
    /** @returns {boolean} */ get RibbonChampionAlola() { return this.util.GetFlag(this.dv.getUint8(0x39), 6); }
    /** @returns {boolean} */ get RibbonBattleRoyale() { return this.util.GetFlag(this.dv.getUint8(0x39), 7); }
    
    /** @returns {boolean} */ get RibbonBattleTreeGreat() { return this.util.GetFlag(this.dv.getUint8(0x3a), 0); }
    /** @returns {boolean} */ get RibbonBattleTreeMaster() { return this.util.GetFlag(this.dv.getUint8(0x3a), 1); }
    /** @returns {boolean} */ get RibbonChampionGalar() { return this.util.GetFlag(this.dv.getUint8(0x3a), 2); }
    /** @returns {boolean} */ get RibbonTowerMaster() { return this.util.GetFlag(this.dv.getUint8(0x3a), 3); }
    /** @returns {boolean} */ get RibbonMasterRank() { return this.util.GetFlag(this.dv.getUint8(0x3a), 4); }
    /** @returns {boolean} */ get RibbonMarkLunchtime() { return this.util.GetFlag(this.dv.getUint8(0x3a), 5); }
    /** @returns {boolean} */ get RibbonMarkSleepyTime() { return this.util.GetFlag(this.dv.getUint8(0x3a), 6); }
    /** @returns {boolean} */ get RibbonMarkDusk() { return this.util.GetFlag(this.dv.getUint8(0x3a), 7); }
    
    /** @returns {boolean} */ get RibbonMarkDawn() { return this.util.GetFlag(this.dv.getUint8(0x3b), 0); }
    /** @returns {boolean} */ get RibbonMarkCloudy() { return this.util.GetFlag(this.dv.getUint8(0x3b), 1); }
    /** @returns {boolean} */ get RibbonMarkRainy() { return this.util.GetFlag(this.dv.getUint8(0x3b), 2); }
    /** @returns {boolean} */ get RibbonMarkStormy() { return this.util.GetFlag(this.dv.getUint8(0x3b), 3); }
    /** @returns {boolean} */ get RibbonMarkSnowy() { return this.util.GetFlag(this.dv.getUint8(0x3b), 4); }
    /** @returns {boolean} */ get RibbonMarkBlizzard() { return this.util.GetFlag(this.dv.getUint8(0x3b), 5); }
    /** @returns {boolean} */ get RibbonMarkDry() { return this.util.GetFlag(this.dv.getUint8(0x3b), 6); }
    /** @returns {boolean} */ get RibbonMarkSandstorm() { return this.util.GetFlag(this.dv.getUint8(0x3b), 7); }

    /** @returns {byte} */ get RibbonCountMemoryContest() { return this.dv.getUint8(0x3c); }
    /** @returns {byte} */ get RibbonCountMemoryBattle() { return this.dv.getUint8(0x3d); }

    /** @returns {boolean} */ get RibbonMarkMisty() { return this.util.GetFlag(this.dv.getUint8(0x40), 0); }
    /** @returns {boolean} */ get RibbonMarkDestiny() { return this.util.GetFlag(this.dv.getUint8(0x40), 1); }
    /** @returns {boolean} */ get RibbonMarkFishing() { return this.util.GetFlag(this.dv.getUint8(0x40), 2); }
    /** @returns {boolean} */ get RibbonMarkCurry() { return this.util.GetFlag(this.dv.getUint8(0x40), 3); }
    /** @returns {boolean} */ get RibbonMarkUncommon() { return this.util.GetFlag(this.dv.getUint8(0x40), 4); }
    /** @returns {boolean} */ get RibbonMarkRare() { return this.util.GetFlag(this.dv.getUint8(0x40), 5); }
    /** @returns {boolean} */ get RibbonMarkRowdy() { return this.util.GetFlag(this.dv.getUint8(0x40), 6); }
    /** @returns {boolean} */ get RibbonMarkAbsentMinded() { return this.util.GetFlag(this.dv.getUint8(0x40), 7); }

    /** @returns {boolean} */ get RibbonMarkJittery() { return this.util.GetFlag(this.dv.getUint8(0x41), 0); }
    /** @returns {boolean} */ get RibbonMarkExcited() { return this.util.GetFlag(this.dv.getUint8(0x41), 1); }
    /** @returns {boolean} */ get RibbonMarkCharismatic() { return this.util.GetFlag(this.dv.getUint8(0x41), 2); }
    /** @returns {boolean} */ get RibbonMarkCalmness() { return this.util.GetFlag(this.dv.getUint8(0x41), 3); }
    /** @returns {boolean} */ get RibbonMarkIntense() { return this.util.GetFlag(this.dv.getUint8(0x41), 4); }
    /** @returns {boolean} */ get RibbonMarkZonedOut() { return this.util.GetFlag(this.dv.getUint8(0x41), 5); }
    /** @returns {boolean} */ get RibbonMarkJoyful() { return this.util.GetFlag(this.dv.getUint8(0x41), 6); }
    /** @returns {boolean} */ get RibbonMarkAngry() { return this.util.GetFlag(this.dv.getUint8(0x41), 7); }

    /** @returns {boolean} */ get RibbonMarkSmiley() { return this.util.GetFlag(this.dv.getUint8(0x42), 0); }
    /** @returns {boolean} */ get RibbonMarkTeary() { return this.util.GetFlag(this.dv.getUint8(0x42), 1); }
    /** @returns {boolean} */ get RibbonMarkUpbeat() { return this.util.GetFlag(this.dv.getUint8(0x42), 2); }
    /** @returns {boolean} */ get RibbonMarkPeeved() { return this.util.GetFlag(this.dv.getUint8(0x42), 3); }
    /** @returns {boolean} */ get RibbonMarkIntellectual() { return this.util.GetFlag(this.dv.getUint8(0x42), 4); }
    /** @returns {boolean} */ get RibbonMarkFerocious() { return this.util.GetFlag(this.dv.getUint8(0x42), 5); }
    /** @returns {boolean} */ get RibbonMarkCrafty() { return this.util.GetFlag(this.dv.getUint8(0x42), 6); }
    /** @returns {boolean} */ get RibbonMarkScowling() { return this.util.GetFlag(this.dv.getUint8(0x42), 7); }

    /** @returns {boolean} */ get RibbonMarkKindly() { return this.util.GetFlag(this.dv.getUint8(0x43), 0); }
    /** @returns {boolean} */ get RibbonMarkFlustered() { return this.util.GetFlag(this.dv.getUint8(0x43), 1); }
    /** @returns {boolean} */ get RibbonMarkPumpedUp() { return this.util.GetFlag(this.dv.getUint8(0x43), 2); }
    /** @returns {boolean} */ get RibbonMarkZeroEnergy() { return this.util.GetFlag(this.dv.getUint8(0x43), 3); }
    /** @returns {boolean} */ get RibbonMarkPrideful() { return this.util.GetFlag(this.dv.getUint8(0x43), 4); }
    /** @returns {boolean} */ get RibbonMarkUnsure() { return this.util.GetFlag(this.dv.getUint8(0x43), 5); }
    /** @returns {boolean} */ get RibbonMarkHumble() { return this.util.GetFlag(this.dv.getUint8(0x43), 6); }
    /** @returns {boolean} */ get RibbonMarkThorny() { return this.util.GetFlag(this.dv.getUint8(0x43), 7); }

    /** @returns {boolean} */ get RibbonMarkVigor() { return this.util.GetFlag(this.dv.getUint8(0x44), 0); }
    /** @returns {boolean} */ get RibbonMarkSlump() { return this.util.GetFlag(this.dv.getUint8(0x44), 1); }
    /** @returns {boolean} */ get RibbonHisui() { return this.util.GetFlag(this.dv.getUint8(0x44), 2); }
    /** @returns {boolean} */ get RibbonTwinklingStar() { return this.util.GetFlag(this.dv.getUint8(0x44), 3); }
    /** @returns {boolean} */ get RibbonChampionPaldea() { return this.util.GetFlag(this.dv.getUint8(0x44), 4); }
    /** @returns {boolean} */ get RibbonMarkJumbo() { return this.util.GetFlag(this.dv.getUint8(0x44), 5); }
    /** @returns {boolean} */ get RibbonMarkMini() { return this.util.GetFlag(this.dv.getUint8(0x44), 6); }
    /** @returns {boolean} */ get RibbonMarkItemfinder() { return this.util.GetFlag(this.dv.getUint8(0x44), 7); }

    /** @returns {boolean} */ get RibbonMarkPartner() { return this.util.GetFlag(this.dv.getUint8(0x45), 0); }
    /** @returns {boolean} */ get RibbonMarkGourmand() { return this.util.GetFlag(this.dv.getUint8(0x45), 1); }
    /** @returns {boolean} */ get RibbonOnceInALifetime() { return this.util.GetFlag(this.dv.getUint8(0x45), 2); }
    /** @returns {boolean} */ get RibbonMarkAlpha() { return this.util.GetFlag(this.dv.getUint8(0x45), 3); }
    /** @returns {boolean} */ get RibbonMarkMightiest() { return this.util.GetFlag(this.dv.getUint8(0x45), 4); }
    /** @returns {boolean} */ get RibbonMarkTitan() { return this.util.GetFlag(this.dv.getUint8(0x45), 5); }
    /** @returns {boolean} */ get RibbonPartner() { return this.util.GetFlag(this.dv.getUint8(0x45), 6); }

    /** @returns {int} */
    get RibbonCount() {
        var part1 = this.Ribbon1 & 0b11111111_11111111_11111111_11111111;
        var part2 = this.Ribbon2 & 0b00000000_00011111_11111111_11111111;
        var part3 = this.Ribbon3 & 0b00000000_00000000_00000000_00000000;
        var part4 = this.Ribbon4 & 0b00000000_00000000_00000100_00011100;
        
        var ct = 0;
        var parts = [part1, part2, part3, part4];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) ct++;
            }
        }
        return ct;
    }

    /** @returns {int} */
    get MarkCount() {
        var part1 = this.Ribbon1 & 0b00000000_00000000_00000000_00000000;
        var part2 = this.Ribbon2 & 0b11111111_11100000_00000000_00000000;
        var part3 = this.Ribbon3 & 0b11111111_11111111_11111111_11111111;
        var part4 = this.Ribbon4 & 0b00000000_00000000_00111011_11100011;
        
        var ct = 0;
        var parts = [part1, part2, part3, part4];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) ct++;
            }
        }
        return ct;
    }

    /** @returns {int} */
    get RibbonMarkCount() {
        return this.RibbonCount() + this.MarkCount();
    }

    /** @returns {boolean} */
    get HasMarkEncounter8() {
        var part1 = this.Ribbon1 & 0b00000000_00000000_00000000_00000000;
        var part2 = this.Ribbon2 & 0b11111111_11100000_00000000_00000000;
        var part3 = this.Ribbon3 & 0b11111111_11111111_11111111_11111111;
        var part4 = this.Ribbon4 & 0b00000000_00000000_00000000_00000011;
        
        var ct = 0;
        var parts = [part1, part2, part3, part4];
        for (var j = 0; j < parts.length; j++) {
            var part = parts[j];

            for (var i = 0; i < 32; i++) {
                if ((part >>> i) & 1 == 1) ct++;
            }
        }
        return ct !== 0;
    }

    /** @returns {boolean} */
    get HasMarkEncounter9() {
        return (this.dv.getUint8(0x45) & 0b00111000) !== 0;
    }

    /** @returns {byte} */ get HeightScalar() { return this.dv.getUint8(0x50); }
    /** @returns {byte} */ get WeightScalar() { return this.dv.getUint8(0x51); }
    /** @returns {byte} */ get Scale() { return this.dv.getUint8(0x52); }

    /** @returns {ushort} */ get Move1() { return this.dv.getUint16(0x54, true); }
    /** @returns {ushort} */ get Move2() { return this.dv.getUint16(0x56, true); }
    /** @returns {ushort} */ get Move3() { return this.dv.getUint16(0x58, true); }
    /** @returns {ushort} */ get Move4() { return this.dv.getUint16(0x5a, true); }

    /** @returns {int} */ get Move1_PP() { return this.dv.getUint8(0x5c); }
    /** @returns {int} */ get Move2_PP() { return this.dv.getUint8(0x5d); }
    /** @returns {int} */ get Move3_PP() { return this.dv.getUint8(0x5e); }
    /** @returns {int} */ get Move4_PP() { return this.dv.getUint8(0x5f); }

    //// Block B
    /** @returns {string} */
    get Nickname() {
        var slice = this.buf.slice(0x60, 0x60 + 26);
        return getStringFromBuffer(slice);
    }

    /** @returns {int} */ get Move1_PPUps() { return this.dv.getUint8(0x86); }
    /** @returns {int} */ get Move2_PPUps() { return this.dv.getUint8(0x87); }
    /** @returns {int} */ get Move3_PPUps() { return this.dv.getUint8(0x88); }
    /** @returns {int} */ get Move4_PPUps() { return this.dv.getUint8(0x89); }

    /** @returns {ushort} */ get RelearnMove1() { return this.dv.getUint16(0x8a, true); }
    /** @returns {ushort} */ get RelearnMove2() { return this.dv.getUint16(0x8c, true); }
    /** @returns {ushort} */ get RelearnMove3() { return this.dv.getUint16(0x8e, true); }
    /** @returns {ushort} */ get RelearnMove4() { return this.dv.getUint16(0x90, true); }

    /** @returns {int} */ get Stat_HPCurrent() { return this.dv.getUint16(0x92, true); }

    /** @returns {uint} */ get IV32() { return this.dv.getUint32(0x94, true) >>> 0; }

    /** @returns {byte} */ get IV_HP()  { return (this.IV32 >> 0) & 0x1F; }
    /** @returns {byte} */ get IV_ATK() { return (this.IV32 >> 5) & 0x1F; }
    /** @returns {byte} */ get IV_DEF() { return (this.IV32 >> 10) & 0x1F; }
    /** @returns {byte} */ get IV_SPE() { return (this.IV32 >> 15) & 0x1F; }
    /** @returns {byte} */ get IV_SPA() { return (this.IV32 >> 20) & 0x1F; }
    /** @returns {byte} */ get IV_SPD() { return (this.IV32 >> 25) & 0x1F; }

    /** @returns {boolean} */ get IsEgg() { return ((this.IV32 >> 30) & 1) === 1; }
    /** @returns {boolean} */ get IsNicknamed() { return ((this.IV32 >> 31) & 1) === 1; }

    /** @returns {byte} */ get DynamaxLevel() { return this.dv.getUint8(0x98); }

    /** @returns {int} */ get Status_Condition() { return this.dv.getInt32(0x9c, true) >>> 0; }

    /** @returns {byte} */ get GV_HP() { return this.dv.getUint8(0xa4); }
    /** @returns {byte} */ get GV_ATK() { return this.dv.getUint8(0xa5); }
    /** @returns {byte} */ get GV_DEF() { return this.dv.getUint8(0xa6); }
    /** @returns {byte} */ get GV_SPE() { return this.dv.getUint8(0xa7); }
    /** @returns {byte} */ get GV_SPA() { return this.dv.getUint8(0xa8); }
    /** @returns {byte} */ get GV_SPD() { return this.dv.getUint8(0xa9); }

    /** @returns {number} */ get HeightAbsolute() { return this.dv.getFloat32(0xac, true); }
    /** @returns {number} */ get WeightAbsolute() { return this.dv.getFloat32(0xb0, true); }


    //// Block C
    /** @returns {string} */
    get HandlingTrainerName() {
        var slice = this.buf.slice(0xB8, 0xB8 + 26);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get HandlingTrainerGender() { return this.dv.getUint8(0xd2); }
    /** @returns {byte} */ get HandlingTrainerLanguage() { return this.dv.getUint8(0xd3); }
    /** @returns {byte} */ get CurrentHandler() { return this.dv.getUint8(0xd4); }
    /** @returns {ushort} */ get HandlingTrainerID() { return this.dv.getUint16(0xd6, true); }
    /** @returns {byte} */ get HandlingTrainerFriendship() { return this.dv.getUint8(0xd8); }
    /** @returns {byte} */ get HandlingTrainerMemoryIntensity() { return this.dv.getUint8(0xd9); }
    /** @returns {byte} */ get HandlingTrainerMemory() { return this.dv.getUint8(0xda); }
    /** @returns {byte} */ get HandlingTrainerMemoryFeeling() { return this.dv.getUint8(0xdb); }
    /** @returns {ushort} */ get HandlingTrainerMemoryVariable() { return this.dv.getUint16(0xdc, true); }

    /** @returns {byte} */ get Fullness() { return this.dv.getUint8(0xec); }
    /** @returns {byte} */ get Enjoyment() { return this.dv.getUint8(0xed); }

    /** @returns {byte} */ get Version() { return this.dv.getUint8(0xee); }
    /** @returns {byte} */ get BattleVersion() { return this.dv.getUint8(0xef); }

    /** @returns {int} */ get Language() { return this.dv.getUint8(0xf2); }

    /** @returns {uint} */ get FormArgument() { return this.dv.getUint32(0xf4, true) >>> 0; }
    /** @returns {byte} */ get FormArgumentRemain() { return (this.formArgument & 0xFF) >>> 0; }
    /** @returns {byte} */ get FormArgumentElapsed() { return (this.formArgument >> 8) & 0xFF; }
    /** @returns {byte} */ get FormArgumentMaximum() { return (this.formArgument >> 16) & 0xFF; }

    
    /** @returns {sbyte} */ get AffixedRibbon() { return this.dv.getInt8(0xf8); }


    //// Block D
    get OriginalTrainerName() {
        var slice = this.buf.slice(0x110, 0x110 + 26);
        return getStringFromBuffer(slice);
    }

    /** @returns {byte} */ get OriginalTrainerFriendship() { return this.dv.getUint8(0x12a); }
    /** @returns {byte} */ get OriginalTrainerMemoryIntensity() { return this.dv.getUint8(0x12b); }
    /** @returns {byte} */ get OriginalTrainerMemory() { return this.dv.getUint8(0x12c); }
    /** @returns {ushort} */ get OriginalTrainerMemoryVariable() { return this.dv.getUint16(0x12e, true); }
    /** @returns {byte} */ get OriginalTrainerMemoryFeeling() { return this.dv.getUint8(0x130); }

    /** @returns {byte} */ get EggYear() { return this.dv.getUint8(0x131); }
    /** @returns {byte} */ get EggMonth() { return this.dv.getUint8(0x132); }
    /** @returns {byte} */ get EggDay() { return this.dv.getUint8(0x133); }

    /** @returns {byte} */ get MetYear() { return this.dv.getUint8(0x134); }
    /** @returns {byte} */ get MetMonth() { return this.dv.getUint8(0x135); }
    /** @returns {byte} */ get MetDay() { return this.dv.getUint8(0x136); }

    /** @returns {byte} */ get Ball() { return this.dv.getUint8(0x137); }

    /** @returns {ushort} */ get EggLocation() { return this.dv.getUint16(0x138, true); }
    /** @returns {ushort} */ get MetLocation() { return this.dv.getUint16(0x13a, true); }


    /** @returns {byte} */ get MetLevel() { return this.dv.getUint8(0x13d) & ~0x80; }

    /** @returns {byte} */ get OriginalTrainerGender() { return this.dv.getUint8(0x13d) >> 7; }

    /** @returns {byte} */ get HyperTrainFlags() { return this.dv.getUint8(0x13e); }

    /** @returns {boolean} */ get HT_HP()  { return ((this.HyperTrainFlags >> 0) & 1) === 1; }
    /** @returns {boolean} */ get HT_ATK() { return ((this.HyperTrainFlags >> 1) & 1) === 1; }
    /** @returns {boolean} */ get HT_DEF() { return ((this.HyperTrainFlags >> 2) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPA() { return ((this.HyperTrainFlags >> 3) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPD() { return ((this.HyperTrainFlags >> 4) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPE() { return ((this.HyperTrainFlags >> 5) & 1) === 1; }

    /** @returns {ulong} */ get Tracker() { return this.dv.getBigUint64(0x14D, true); }
}
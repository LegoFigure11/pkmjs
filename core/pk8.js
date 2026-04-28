import { GetFlag, getStringFromBuffer6789 } from "./util/util.js";

/**
 * @typedef {number} byte   - 8-bit unsigned integer
 * @typedef {number} sbyte  - 8-bit signed integer
 * @typedef {number} ushort - 16-bit unsigned integer
 * @typedef {number} uint   - 32-bit unsigned integer
 * @typedef {number} int    - 32-bit signed integer
 * @typedef {bigint} ulong  - 64-bit unsigned integer
 */

/**
 * Read-only Pokemon Container for Sword/Shield
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/PK8.cs
 * @see https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/Shared/G8PKM.cs
 */
export class PK8 {
    /** @type {ushort} */
    static SIZE = 344;

    /**
     * @param {ArrayBuffer} buf - An ArrayBuffer containing the raw decrypted pk8 data
     */
    constructor(buf) {
        this.buf = buf;
        this.dv = new DataView(buf);
    }

    /** @returns {uint} */ get EncryptionConstant() { return this.dv.getUint32(0x00, true) >>> 0; }

    /** @returns {ushort} */ get Sanity() { return this.dv.getUint16(0x04, true); }

    /** @returns {ushort} */ get Checksum() { return this.dv.getUint16(0x06, true); }

    //// Block A
    /** @returns {ushort} */ get Species() {  return this.dv.getUint16(0x08, true); }

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

    /** @returns {boolean} */ get RibbonChampionKalos() { return GetFlag(this.dv.getUint8(0x34), 0); }
    /** @returns {boolean} */ get RibbonChampionG3() { return GetFlag(this.dv.getUint8(0x34), 1); }
    /** @returns {boolean} */ get RibbonChampionSinnoh() { return GetFlag(this.dv.getUint8(0x34), 2); }
    /** @returns {boolean} */ get RibbonBestFriends() { return GetFlag(this.dv.getUint8(0x34), 3); }
    /** @returns {boolean} */ get RibbonTraining() { return GetFlag(this.dv.getUint8(0x34), 4); }
    /** @returns {boolean} */ get RibbonBattlerSkillful() { return GetFlag(this.dv.getUint8(0x34), 5); }
    /** @returns {boolean} */ get RibbonBattlerExpert() { return GetFlag(this.dv.getUint8(0x34), 6); }
    /** @returns {boolean} */ get RibbonEffort() { return GetFlag(this.dv.getUint8(0x34), 7); }
    
    /** @returns {boolean} */ get RibbonAlert() { return GetFlag(this.dv.getUint8(0x35), 0); }
    /** @returns {boolean} */ get RibbonShock() { return GetFlag(this.dv.getUint8(0x35), 1); }
    /** @returns {boolean} */ get RibbonDowncast() { return GetFlag(this.dv.getUint8(0x35), 2); }
    /** @returns {boolean} */ get RibbonCareless() { return GetFlag(this.dv.getUint8(0x35), 3); }
    /** @returns {boolean} */ get RibbonRelax() { return GetFlag(this.dv.getUint8(0x35), 4); }
    /** @returns {boolean} */ get RibbonSnooze() { return GetFlag(this.dv.getUint8(0x35), 5); }
    /** @returns {boolean} */ get RibbonSmile() { return GetFlag(this.dv.getUint8(0x35), 6); }
    /** @returns {boolean} */ get RibbonGorgeous() { return GetFlag(this.dv.getUint8(0x35), 7); }
    
    /** @returns {boolean} */ get RibbonRoyal() { return GetFlag(this.dv.getUint8(0x36), 0); }
    /** @returns {boolean} */ get RibbonGorgeousRoyal() { return GetFlag(this.dv.getUint8(0x36), 1); }
    /** @returns {boolean} */ get RibbonArtist() { return GetFlag(this.dv.getUint8(0x36), 2); }
    /** @returns {boolean} */ get RibbonFootprint() { return GetFlag(this.dv.getUint8(0x36), 3); }
    /** @returns {boolean} */ get RibbonRecord() { return GetFlag(this.dv.getUint8(0x36), 4); }
    /** @returns {boolean} */ get RibbonLegend() { return GetFlag(this.dv.getUint8(0x36), 5); }
    /** @returns {boolean} */ get RibbonCountry() { return GetFlag(this.dv.getUint8(0x36), 6); }
    /** @returns {boolean} */ get RibbonNational() { return GetFlag(this.dv.getUint8(0x36), 7); }
    
    /** @returns {boolean} */ get RibbonEarth() { return GetFlag(this.dv.getUint8(0x37), 0); }
    /** @returns {boolean} */ get RibbonWorld() { return GetFlag(this.dv.getUint8(0x37), 1); }
    /** @returns {boolean} */ get RibbonClassic() { return GetFlag(this.dv.getUint8(0x37), 2); }
    /** @returns {boolean} */ get RibbonPremier() { return GetFlag(this.dv.getUint8(0x37), 3); }
    /** @returns {boolean} */ get RibbonEvent() { return GetFlag(this.dv.getUint8(0x37), 4); }
    /** @returns {boolean} */ get RibbonBirthday() { return GetFlag(this.dv.getUint8(0x37), 5); }
    /** @returns {boolean} */ get RibbonSpecial() { return GetFlag(this.dv.getUint8(0x37), 6); }
    /** @returns {boolean} */ get RibbonSouvenir() { return GetFlag(this.dv.getUint8(0x37), 7); }
    
    /** @returns {boolean} */ get RibbonWishing() { return GetFlag(this.dv.getUint8(0x38), 0); }
    /** @returns {boolean} */ get RibbonChampionBattle() { return GetFlag(this.dv.getUint8(0x38), 1); }
    /** @returns {boolean} */ get RibbonChampionRegional() { return GetFlag(this.dv.getUint8(0x38), 2); }
    /** @returns {boolean} */ get RibbonChampionNational() { return GetFlag(this.dv.getUint8(0x38), 3); }
    /** @returns {boolean} */ get RibbonChampionWorld() { return GetFlag(this.dv.getUint8(0x38), 4); }
    /** @returns {boolean} */ get HasContestMemoryRibbon() { return GetFlag(this.dv.getUint8(0x38), 5); }
    /** @returns {boolean} */ get HasBattleMemoryRibbon() { return GetFlag(this.dv.getUint8(0x38), 6); }
    /** @returns {boolean} */ get RibbonChampionG6Hoenn() { return GetFlag(this.dv.getUint8(0x38), 7); }
    
    /** @returns {boolean} */ get RibbonContestStar() { return GetFlag(this.dv.getUint8(0x39), 0); }
    /** @returns {boolean} */ get RibbonMasterCoolness() { return GetFlag(this.dv.getUint8(0x39), 1); }
    /** @returns {boolean} */ get RibbonMasterBeauty() { return GetFlag(this.dv.getUint8(0x39), 2); }
    /** @returns {boolean} */ get RibbonMasterCuteness() { return GetFlag(this.dv.getUint8(0x39), 3); }
    /** @returns {boolean} */ get RibbonMasterCleverness() { return GetFlag(this.dv.getUint8(0x39), 4); }
    /** @returns {boolean} */ get RibbonMasterToughness() { return GetFlag(this.dv.getUint8(0x39), 5); }
    /** @returns {boolean} */ get RibbonChampionAlola() { return GetFlag(this.dv.getUint8(0x39), 6); }
    /** @returns {boolean} */ get RibbonBattleRoyale() { return GetFlag(this.dv.getUint8(0x39), 7); }
    
    /** @returns {boolean} */ get RibbonBattleTreeGreat() { return GetFlag(this.dv.getUint8(0x3a), 0); }
    /** @returns {boolean} */ get RibbonBattleTreeMaster() { return GetFlag(this.dv.getUint8(0x3a), 1); }
    /** @returns {boolean} */ get RibbonChampionGalar() { return GetFlag(this.dv.getUint8(0x3a), 2); }
    /** @returns {boolean} */ get RibbonTowerMaster() { return GetFlag(this.dv.getUint8(0x3a), 3); }
    /** @returns {boolean} */ get RibbonMasterRank() { return GetFlag(this.dv.getUint8(0x3a), 4); }
    /** @returns {boolean} */ get RibbonMarkLunchtime() { return GetFlag(this.dv.getUint8(0x3a), 5); }
    /** @returns {boolean} */ get RibbonMarkSleepyTime() { return GetFlag(this.dv.getUint8(0x3a), 6); }
    /** @returns {boolean} */ get RibbonMarkDusk() { return GetFlag(this.dv.getUint8(0x3a), 7); }
    
    /** @returns {boolean} */ get RibbonMarkDawn() { return GetFlag(this.dv.getUint8(0x3b), 0); }
    /** @returns {boolean} */ get RibbonMarkCloudy() { return GetFlag(this.dv.getUint8(0x3b), 1); }
    /** @returns {boolean} */ get RibbonMarkRainy() { return GetFlag(this.dv.getUint8(0x3b), 2); }
    /** @returns {boolean} */ get RibbonMarkStormy() { return GetFlag(this.dv.getUint8(0x3b), 3); }
    /** @returns {boolean} */ get RibbonMarkSnowy() { return GetFlag(this.dv.getUint8(0x3b), 4); }
    /** @returns {boolean} */ get RibbonMarkBlizzard() { return GetFlag(this.dv.getUint8(0x3b), 5); }
    /** @returns {boolean} */ get RibbonMarkDry() { return GetFlag(this.dv.getUint8(0x3b), 6); }
    /** @returns {boolean} */ get RibbonMarkSandstorm() { return GetFlag(this.dv.getUint8(0x3b), 7); }

    /** @returns {byte} */ get RibbonCountMemoryContest() { return this.dv.getUint8(0x3c); }
    /** @returns {byte} */ get RibbonCountMemoryBattle() { return this.dv.getUint8(0x3d); }

    /** @returns {boolean} */ get RibbonMarkMisty() { return GetFlag(this.dv.getUint8(0x40), 0); }
    /** @returns {boolean} */ get RibbonMarkDestiny() { return GetFlag(this.dv.getUint8(0x40), 1); }
    /** @returns {boolean} */ get RibbonMarkFishing() { return GetFlag(this.dv.getUint8(0x40), 2); }
    /** @returns {boolean} */ get RibbonMarkCurry() { return GetFlag(this.dv.getUint8(0x40), 3); }
    /** @returns {boolean} */ get RibbonMarkUncommon() { return GetFlag(this.dv.getUint8(0x40), 4); }
    /** @returns {boolean} */ get RibbonMarkRare() { return GetFlag(this.dv.getUint8(0x40), 5); }
    /** @returns {boolean} */ get RibbonMarkRowdy() { return GetFlag(this.dv.getUint8(0x40), 6); }
    /** @returns {boolean} */ get RibbonMarkAbsentMinded() { return GetFlag(this.dv.getUint8(0x40), 7); }

    /** @returns {boolean} */ get RibbonMarkJittery() { return GetFlag(this.dv.getUint8(0x41), 0); }
    /** @returns {boolean} */ get RibbonMarkExcited() { return GetFlag(this.dv.getUint8(0x41), 1); }
    /** @returns {boolean} */ get RibbonMarkCharismatic() { return GetFlag(this.dv.getUint8(0x41), 2); }
    /** @returns {boolean} */ get RibbonMarkCalmness() { return GetFlag(this.dv.getUint8(0x41), 3); }
    /** @returns {boolean} */ get RibbonMarkIntense() { return GetFlag(this.dv.getUint8(0x41), 4); }
    /** @returns {boolean} */ get RibbonMarkZonedOut() { return GetFlag(this.dv.getUint8(0x41), 5); }
    /** @returns {boolean} */ get RibbonMarkJoyful() { return GetFlag(this.dv.getUint8(0x41), 6); }
    /** @returns {boolean} */ get RibbonMarkAngry() { return GetFlag(this.dv.getUint8(0x41), 7); }

    /** @returns {boolean} */ get RibbonMarkSmiley() { return GetFlag(this.dv.getUint8(0x42), 0); }
    /** @returns {boolean} */ get RibbonMarkTeary() { return GetFlag(this.dv.getUint8(0x42), 1); }
    /** @returns {boolean} */ get RibbonMarkUpbeat() { return GetFlag(this.dv.getUint8(0x42), 2); }
    /** @returns {boolean} */ get RibbonMarkPeeved() { return GetFlag(this.dv.getUint8(0x42), 3); }
    /** @returns {boolean} */ get RibbonMarkIntellectual() { return GetFlag(this.dv.getUint8(0x42), 4); }
    /** @returns {boolean} */ get RibbonMarkFerocious() { return GetFlag(this.dv.getUint8(0x42), 5); }
    /** @returns {boolean} */ get RibbonMarkCrafty() { return GetFlag(this.dv.getUint8(0x42), 6); }
    /** @returns {boolean} */ get RibbonMarkScowling() { return GetFlag(this.dv.getUint8(0x42), 7); }

    /** @returns {boolean} */ get RibbonMarkKindly() { return GetFlag(this.dv.getUint8(0x43), 0); }
    /** @returns {boolean} */ get RibbonMarkFlustered() { return GetFlag(this.dv.getUint8(0x43), 1); }
    /** @returns {boolean} */ get RibbonMarkPumpedUp() { return GetFlag(this.dv.getUint8(0x43), 2); }
    /** @returns {boolean} */ get RibbonMarkZeroEnergy() { return GetFlag(this.dv.getUint8(0x43), 3); }
    /** @returns {boolean} */ get RibbonMarkPrideful() { return GetFlag(this.dv.getUint8(0x43), 4); }
    /** @returns {boolean} */ get RibbonMarkUnsure() { return GetFlag(this.dv.getUint8(0x43), 5); }
    /** @returns {boolean} */ get RibbonMarkHumble() { return GetFlag(this.dv.getUint8(0x43), 6); }
    /** @returns {boolean} */ get RibbonMarkThorny() { return GetFlag(this.dv.getUint8(0x43), 7); }

    /** @returns {boolean} */ get RibbonMarkVigor() { return GetFlag(this.dv.getUint8(0x44), 0); }
    /** @returns {boolean} */ get RibbonMarkSlump() { return GetFlag(this.dv.getUint8(0x44), 1); }
    /** @returns {boolean} */ get RibbonHisui() { return GetFlag(this.dv.getUint8(0x44), 2); }
    /** @returns {boolean} */ get RibbonTwinklingStar() { return GetFlag(this.dv.getUint8(0x44), 3); }
    /** @returns {boolean} */ get RibbonChampionPaldea() { return GetFlag(this.dv.getUint8(0x44), 4); }
    /** @returns {boolean} */ get RibbonMarkJumbo() { return GetFlag(this.dv.getUint8(0x44), 5); }
    /** @returns {boolean} */ get RibbonMarkMini() { return GetFlag(this.dv.getUint8(0x44), 6); }
    /** @returns {boolean} */ get RibbonMarkItemfinder() { return GetFlag(this.dv.getUint8(0x44), 7); }

    /** @returns {boolean} */ get RibbonMarkPartner() { return GetFlag(this.dv.getUint8(0x45), 0); }
    /** @returns {boolean} */ get RibbonMarkGourmand() { return GetFlag(this.dv.getUint8(0x45), 1); }
    /** @returns {boolean} */ get RibbonOnceInALifetime() { return GetFlag(this.dv.getUint8(0x45), 2); }
    /** @returns {boolean} */ get RibbonMarkAlpha() { return GetFlag(this.dv.getUint8(0x45), 3); }
    /** @returns {boolean} */ get RibbonMarkMightiest() { return GetFlag(this.dv.getUint8(0x45), 4); }
    /** @returns {boolean} */ get RibbonMarkTitan() { return GetFlag(this.dv.getUint8(0x45), 5); }
    /** @returns {boolean} */ get RibbonPartner() { return GetFlag(this.dv.getUint8(0x45), 6); }

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

    /** @returns {uint} */ get Sociability() { return this.dv.getUint32(0x48) >>> 0; }

    /** @returns {byte} */ get HeightScalar() { return this.dv.getUint8(0x50); }
    /** @returns {byte} */ get WeightScalar() { return this.dv.getUint8(0x51); }

    //// Block B
    /** @returns {string} */
    get Nickname() {
        var slice = this.buf.slice(0x58, 0x58 + 26);
        return getStringFromBuffer6789(slice);
    }

    /** @returns {ushort} */ get Move1() { return this.dv.getUint16(0x72, true); }
    /** @returns {ushort} */ get Move2() { return this.dv.getUint16(0x74, true); }
    /** @returns {ushort} */ get Move3() { return this.dv.getUint16(0x76, true); }
    /** @returns {ushort} */ get Move4() { return this.dv.getUint16(0x78, true); }

    /** @returns {int} */ get Move1_PP() { return this.dv.getUint8(0x7A); }
    /** @returns {int} */ get Move2_PP() { return this.dv.getUint8(0x7B); }
    /** @returns {int} */ get Move3_PP() { return this.dv.getUint8(0x7C); }
    /** @returns {int} */ get Move4_PP() { return this.dv.getUint8(0x7D); }

    /** @returns {int} */ get Move1_PPUps() { return this.dv.getUint8(0x7E); }
    /** @returns {int} */ get Move2_PPUps() { return this.dv.getUint8(0x7F); }
    /** @returns {int} */ get Move3_PPUps() { return this.dv.getUint8(0x80); }
    /** @returns {int} */ get Move4_PPUps() { return this.dv.getUint8(0x81); }

    /** @returns {ushort} */ get RelearnMove1() { return this.dv.getUint16(0x82, true); }
    /** @returns {ushort} */ get RelearnMove2() { return this.dv.getUint16(0x84, true); }
    /** @returns {ushort} */ get RelearnMove3() { return this.dv.getUint16(0x86, true); }
    /** @returns {ushort} */ get RelearnMove4() { return this.dv.getUint16(0x88, true); }

    /** @returns {int} */ get Stat_HPCurrent() { return this.dv.getUint16(0x8A, true); }

    /** @returns {uint} */ get IV32() { return this.dv.getUint32(0x8C, true) >>> 0; }

    /** @returns {byte} */ get IV_HP()  { return (this.IV32 >> 0) & 0x1F; }
    /** @returns {byte} */ get IV_ATK() { return (this.IV32 >> 5) & 0x1F; }
    /** @returns {byte} */ get IV_DEF() { return (this.IV32 >> 10) & 0x1F; }
    /** @returns {byte} */ get IV_SPE() { return (this.IV32 >> 15) & 0x1F; }
    /** @returns {byte} */ get IV_SPA() { return (this.IV32 >> 20) & 0x1F; }
    /** @returns {byte} */ get IV_SPD() { return (this.IV32 >> 25) & 0x1F; }

    /** @returns {boolean} */ get IsEgg() { return ((this.IV32 >> 30) & 1) === 1; }
    /** @returns {boolean} */ get IsNicknamed() { return ((this.IV32 >> 31) & 1) === 1; }

    /** @returns {byte} */ get DynamaxLevel() { return this.dv.getUint8(0x90); }

    /** @returns {int} */ get Status_Condition() { return this.dv.getInt32(0x94, true) >>> 0; }
    /** @returns {int} */ get Palma() { return this.dv.getInt32(0x98, true) >>> 0; }

    //// Block C
    /** @returns {string} */
    get HandlingTrainerName() {
        var slice = this.buf.slice(0xA8, 0xA8 + 26);
        return getStringFromBuffer6789(slice);
    }

    /** @returns {byte} */ get HandlingTrainerGender() { return this.dv.getUint8(0xC2); }
    /** @returns {byte} */ get HandlingTrainerLanguage() { return this.dv.getUint8(0xC3); }
    /** @returns {byte} */ get CurrentHandler() { return this.dv.getUint8(0xC4); }
    /** @returns {ushort} */ get HandlingTrainerID() { return this.dv.getUint16(0xC6, true); }
    /** @returns {byte} */ get HandlingTrainerFriendship() { return this.dv.getUint8(0xC8); }
    /** @returns {byte} */ get HandlingTrainerMemoryIntensity() { return this.dv.getUint8(0xC9); }
    /** @returns {byte} */ get HandlingTrainerMemory() { return this.dv.getUint8(0xCA); }
    /** @returns {byte} */ get HandlingTrainerMemoryFeeling() { return this.dv.getUint8(0xCB); }
    /** @returns {ushort} */ get HandlingTrainerMemoryVariable() { return this.dv.getUint16(0xCC, true); }

    /** @returns {byte} */ get Fullness() { return this.dv.getUint8(0xDC); }
    /** @returns {byte} */ get Enjoyment() { return this.dv.getUint8(0xDD); }

    /** @returns {byte} */ get Version() { return this.dv.getUint8(0xDE); }
    /** @returns {byte} */ get BattleVersion() { return this.dv.getUint8(0xDF); }

    /** @returns {uint} */ get FormArgument() { return this.dv.getUint32(0xE4, true) >>> 0; }
    /** @returns {byte} */ get FormArgumentRemain() { return (this.formArgument & 0xFF) >>> 0; }
    /** @returns {byte} */ get FormArgumentElapsed() { return (this.formArgument >> 8) & 0xFF; }
    /** @returns {byte} */ get FormArgumentMaximum() { return (this.formArgument >> 16) & 0xFF; }

    /** @returns {int} */ get Language() { return this.dv.getUint8(0xE2); }
    
    /** @returns {sbyte} */ get AffixedRibbon() { return this.dv.getInt8(0xE8); }


    //// Block D
    get OriginalTrainerName() {
        var slice = this.buf.slice(0xF8, 0xF8 + 26);
        return getStringFromBuffer6789(slice);
    }

    /** @returns {byte} */ get OriginalTrainerFriendship() { return this.dv.getUint8(0x112); }
    /** @returns {byte} */ get OriginalTrainerMemoryIntensity() { return this.dv.getUint8(0x113); }
    /** @returns {byte} */ get OriginalTrainerMemory() { return this.dv.getUint8(0x114); }
    /** @returns {ushort} */ get OriginalTrainerMemoryVariable() { return this.dv.getUint16(0x116, true); }
    /** @returns {byte} */ get OriginalTrainerMemoryFeeling() { return this.dv.getUint8(0x118); }

    /** @returns {byte} */ get EggYear() { return this.dv.getUint8(0x119); }
    /** @returns {byte} */ get EggMonth() { return this.dv.getUint8(0x11A); }
    /** @returns {byte} */ get EggDay() { return this.dv.getUint8(0x11B); }

    /** @returns {byte} */ get MetYear() { return this.dv.getUint8(0x11C); }
    /** @returns {byte} */ get MetMonth() { return this.dv.getUint8(0x11D); }
    /** @returns {byte} */ get MetDay() { return this.dv.getUint8(0x11E); }


    /** @returns {ushort} */ get EggLocation() { return this.dv.getUint16(0x120, true); }
    /** @returns {ushort} */ get MetLocation() { return this.dv.getUint16(0x122, true); }

    /** @returns {byte} */ get Ball() { return this.dv.getUint8(0x124); }

    /** @returns {byte} */ get MetLevel() { return this.dv.getUint8(0x125) & 0x7F; }

    /** @returns {byte} */ get OriginalTrainerGender() { return this.dv.getUint8(0x125) >> 7; }

    /** @returns {byte} */ get HyperTrainFlags() { return this.dv.getUint8(0x126); }

    /** @returns {boolean} */ get HT_HP()  { return ((this.HyperTrainFlags >> 0) & 1) === 1; }
    /** @returns {boolean} */ get HT_ATK() { return ((this.HyperTrainFlags >> 1) & 1) === 1; }
    /** @returns {boolean} */ get HT_DEF() { return ((this.HyperTrainFlags >> 2) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPA() { return ((this.HyperTrainFlags >> 3) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPD() { return ((this.HyperTrainFlags >> 4) & 1) === 1; }
    /** @returns {boolean} */ get HT_SPE() { return ((this.HyperTrainFlags >> 5) & 1) === 1; }

    /** @returns {ulong} */ get Tracker() { return this.dv.getBigUint64(0x135, true); }

    /** @returns {int} */ get DynamaxType() { return this.dv.getUint16(0x156, true); }
};
import type {GEAR_TYPE} from "../inventory/components/Gear.tsx";
import type {StatsState} from "../inventory/components/Stats.tsx";

export interface Item {
    id: number
    name: string
    type: GEAR_TYPE
    iconUrl: string
    statMod: StatsState
}

export const ItemList: Item[] = [
    {
        id: 1,
        name: 'Espada Larga',
        type: 'R_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_05.jpg',
        statMod: {
            STR: 3,
            DEX: 2,
            CON: 0,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
    {
        id: 2,
        name: 'Espada Ancha',
        type: 'R_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_25.jpg',
        statMod: {
            STR: 4,
            DEX: -1,
            CON: 0,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
    {
        id: 3,
        name: 'Katana',
        type: 'R_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_41.jpg',
        statMod: {
            STR: 2,
            DEX: 4,
            CON: 0,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
    {
        id: 4,
        name: 'Round Shield',
        type: 'L_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_10.jpg',
        statMod: {
            STR: 0,
            DEX: -1,
            CON: 4,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
    {
        id: 5,
        name: 'Hood',
        type: 'HEAD',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_29.jpg',
        statMod: {
            STR: 0,
            DEX: 0,
            CON: 0,
            WIS: 5,
            INT: 2,
            CHA: 0,
        }
    },
    {
        id: 6,
        name: 'Helmet',
        type: 'HEAD',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_03.jpg',
        statMod: {
            STR: 0,
            DEX: 0,
            CON: 3,
            WIS: -2,
            INT: 0,
            CHA: 3,
        }
    },
    {
        id: 6,
        name: 'Leather Boots',
        type: 'FEET',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_boot_armor_civilianadventurer_b_01.jpg',
        statMod: {
            STR: 0,
            DEX: 4,
            CON: 1,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
    {
        id: 7,
        name: 'Leather Armor',
        type: 'CHEST',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_tabard_blue_armor_goblinbruiser_d_01.jpg',
        statMod: {
            STR: 0,
            DEX: 3,
            CON: 1,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
    {
        id: 8,
        name: 'Leather Pants',
        type: 'LEGS',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_armor_corehound_c_01_pant.jpg',
        statMod: {
            STR: 2,
            DEX: 3,
            CON: 1,
            WIS: 0,
            INT: 0,
            CHA: 0,
        }
    },
];
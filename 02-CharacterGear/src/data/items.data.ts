import type {GEAR_TYPE} from "../inventory/components/Gear.tsx";

export interface Item {
    id: number
    name: string
    type: GEAR_TYPE
    iconUrl: string
}

export const ItemList: Item[] = [
    {
        id: 1,
        name: 'Espada Larga',
        type: 'R_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_05.jpg',
    },
    {
        id: 2,
        name: 'Espada Ancha',
        type: 'R_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_25.jpg',
    },
    {
        id: 3,
        name: 'Katana',
        type: 'R_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_41.jpg',
    },
    {
        id: 4,
        name: 'Round Shield',
        type: 'L_HAND',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_10.jpg',
    },
    {
        id: 5,
        name: 'Hood',
        type: 'HEAD',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_29.jpg',
    },
    {
        id: 6,
        name: 'Helmet',
        type: 'HEAD',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_03.jpg',
    },
    {
        id: 6,
        name: 'Leather Boots',
        type: 'FEET',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_boot_armor_civilianadventurer_b_01.jpg',
    },
    {
        id: 7,
        name: 'Leather Armor',
        type: 'CHEST',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_tabard_blue_armor_goblinbruiser_d_01.jpg',
    },
    {
        id: 8,
        name: 'Leather Pants',
        type: 'LEGS',
        iconUrl: 'https://wow.zamimg.com/images/wow/icons/large/inv_armor_corehound_c_01_pant.jpg',
    },

];
import {Bag} from "./Bag.tsx";
import {Gear, type GEAR_TYPE, type GearState} from "./Gear.tsx";
import {ItemList, type Item} from "../../data/items.data.ts";
import {useEffect, useMemo, useState} from "react";
import {Stats, type StatsState} from "./Stats.tsx";


const BAG_SPACE = 24

const initialGear = {
    HEAD: null,
    CHEST: null,
    R_HAND: null,
    L_HAND: null,
    LEGS: null,
    FEET: null,
}

const initialStats = {
    STR: 0,
    DEX: 0,
    CON: 0,
    WIS: 0,
    INT: 0,
    CHA: 0,
}

export const InventoryScreen = () => {
    const initialBag: (Item | null)[] = useMemo(() => {
        const arr = Array<Item | null>(BAG_SPACE).fill(null);
        for (let i = 0; i < Math.min(ItemList.length, BAG_SPACE); i++) {
            arr[i] = ItemList[i];
        }
        return arr;
    }, []);

    const [bag, setBag] = useState<(Item | null)[]>(initialBag)
    const [gear, setGear] = useState<GearState>(initialGear)
    const [stats, setStats] = useState<StatsState>(initialStats)

    const firstEmptyBagIndex = (b: (Item | null)[]) => b.findIndex(x => x == null);

    useEffect(() => {
        const headStats = gear.HEAD ? gear.HEAD.statMod : initialStats
        const chestStats = gear.CHEST ? gear.CHEST.statMod : initialStats
        const lefHandStats = gear.L_HAND ? gear.L_HAND.statMod : initialStats
        const rightHandStats = gear.R_HAND ? gear.R_HAND.statMod : initialStats
        const legStats = gear.LEGS ? gear.LEGS.statMod : initialStats
        const feetStats = gear.FEET ? gear.FEET.statMod : initialStats

        const strSum = headStats.STR + chestStats.STR + legStats.STR + lefHandStats.STR + rightHandStats.STR + feetStats.STR
        const dexSum = headStats.DEX + chestStats.DEX + legStats.DEX + lefHandStats.DEX + rightHandStats.DEX + feetStats.DEX
        const conSum = headStats.CON + chestStats.CON + legStats.CON + lefHandStats.CON + rightHandStats.CON + feetStats.CON
        const wisSum = headStats.WIS + chestStats.WIS + legStats.WIS + lefHandStats.WIS + rightHandStats.WIS + feetStats.WIS
        const intSum = headStats.INT + chestStats.INT + legStats.INT + lefHandStats.INT + rightHandStats.INT + feetStats.INT
        const charSum = headStats.CHA + chestStats.CHA + legStats.CHA + lefHandStats.CHA + rightHandStats.CHA + feetStats.CHA

        setStats({
            STR: strSum,
            DEX: dexSum,
            CON: conSum,
            WIS: wisSum,
            INT: intSum,
            CHA: charSum,
        })

    }, [gear, stats])
    const handleBagSlotDoubleClick = (index: number) => {
        const item = bag[index];
        if (!item) return;

        const slotType = item.type;

        const currentEquipped = gear[slotType];
        setGear(prev => ({...prev, [slotType]: item}));
        setBag(prev => {
            const next = [...prev];
            next[index] = currentEquipped ?? null;
            return next;
        });


    }

    const handleGearSlotDoubleClick = (slotType: GEAR_TYPE) => {
        const equipped = gear[slotType];
        if (!equipped) return;

        const emptyIdx = firstEmptyBagIndex(bag);
        if (emptyIdx === -1) {
            return;
        }

        setGear(prev => ({...prev, [slotType]: null}));
        setBag(prev => {
            const next = [...prev];
            next[emptyIdx] = equipped;
            return next;
        });
    };


    return (
        <>
            <div className="max-w-4xl mx-auto">

                {/*<!-- Title -->*/}
                <h1 className="text-white text-2xl font-bold mb-6">Inventario</h1>

                {/*<!-- Main Container -->*/}
                <div className="flex gap-8">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        {/*<!-- Stats section -->*/}
                        <Stats stats={stats}/>
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        {/*<!-- Gear section -->*/}
                        <Gear gear={gear} onSlotDoubleClick={handleGearSlotDoubleClick}/>
                    </div>


                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex-1">
                        {/* <!-- Bag section (Grid) --> */}
                        <Bag items={bag} onSlotDoubleClick={handleBagSlotDoubleClick}/>
                    </div>

                </div>

            </div>
        </>
    )
}
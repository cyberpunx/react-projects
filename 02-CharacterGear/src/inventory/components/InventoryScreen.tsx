import {Bag} from "./Bag.tsx";
import {Gear, type GEAR_TYPE, type GearState} from "./Gear.tsx";
import {ItemList, type Item} from "../../data/items.data.ts";
import {useMemo, useState} from "react";


const BAG_SPACE = 24

const initialGear = {
    HEAD: null,
    CHEST: null,
    R_HAND: null,
    L_HAND: null,
    LEGS: null,
    FEET: null,
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

    const firstEmptyBagIndex = (b: (Item | null)[]) => b.findIndex(x => x == null);

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
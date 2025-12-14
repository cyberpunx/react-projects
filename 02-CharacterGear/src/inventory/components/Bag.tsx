import {BagSlot} from "./BagSlot.tsx";
import {type Item} from "../../data/items.data.ts";

interface BagProps {
    items: (Item | null)[]
    onSlotDoubleClick: (i: number) => void
}

export const Bag = ({items, onSlotDoubleClick}: BagProps) => {
    return (
        <>
            <h2 className="text-white text-lg font-semibold mb-4">Objetos</h2>
            <div className="grid grid-cols-6 gap-2">
                {/* -- Slots de inventario (24 slots) --> */}
                {items.map((item, index) => (
                    <BagSlot key={index} item={item} onDoubleClick={() => onSlotDoubleClick(index)}/>
                ))}
            </div>
        </>
    )
}
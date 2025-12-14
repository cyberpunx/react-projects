import type {GEAR_TYPE} from "./Gear.tsx";
import type {Item} from "../../data/items.data.ts";

interface GearSlotProps {
    label: string
    type: GEAR_TYPE
    img?: string
    item?: Item | null
    onDoubleClick: () => void
}

export const GearSlot = ({label, type, img, item, onDoubleClick}: GearSlotProps) => {
    if (!item) return (
        <>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg">
                    <img alt={type} src={img}/>
                </div>
                <span className="text-gray-400 text-sm mt-1">{label}</span>
            </div>
        </>
    )

    return (
        <>
            <div className="flex flex-col items-center">
                <div
                    className="relative group w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-lg cursor-pointer"
                    onDoubleClick={onDoubleClick}
                >
                    <img src={item.iconUrl} alt={item.name} className="w-full h-full object-contain p-1"/>
                    <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                        {item.name} - {item.type}
                    </div>
                </div>
                <span className="text-gray-400 text-sm mt-1">{label}</span>
            </div>
        </>
    )
}
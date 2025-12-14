import type {Item} from "../../data/items.data.ts";

interface BagSlotProps {
    item: (Item | null)
    onDoubleClick: () => void
}

export const BagSlot = ({item, onDoubleClick}: BagSlotProps) => {
    if (!item) return (
        <>
            <div className="relative group w-14 h-14 bg-gray-700 border border-gray-600 rounded cursor-pointer">
            </div>
        </>
    )


    return (
        <>
            <div className="relative group w-14 h-14 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                 onDoubleClick={onDoubleClick}

            >
                <img alt={item?.name} src={item?.iconUrl} className="w-full h-full object-contain p-1"/>
                <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    {item?.name} - {item?.type}
                </div>
            </div>
        </>
    )

}
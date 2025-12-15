import {useDraggable, useDroppable} from "@dnd-kit/core"
import {CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card"

interface CombinatorProps {
    slots: Array<CardType | null>
    slotCount: number
    heightClassName?: string
    onRightClickSlot: (cardId: string, slotIndex: number) => void
}

export const Combinator = ({slots, slotCount, heightClassName = "h-1/2", onRightClickSlot,}: CombinatorProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "combinator"})

    return (
        <div
            ref={setNodeRef}
            className={[heightClassName, "w-[420px] border-2 rounded-xl p-4", isOver ? "border-cyan-400" : "border-cyan-700",].join(" ")}
        >
            <div className="mb-3 text-sm opacity-70">COMBINATOR</div>

            <div className="flex gap-3">
                {Array.from({length: slotCount}, (_, idx) => (
                    <Slot
                        key={idx}
                        index={idx}
                        card={slots[idx] ?? null}
                        onRightClickSlot={onRightClickSlot}
                    />
                ))}
            </div>

            <div className="mt-3 text-xs opacity-60">
                Drop aquí o en un slot. Si no hay espacio, se destruye.
            </div>
        </div>
    )
}

interface SlotProps {
    index: number
    card: CardType | null
    onRightClickSlot: (cardId: string, slotIndex: number) => void
}

const Slot = ({index, card, onRightClickSlot,}: SlotProps) => {
    const {isOver, setNodeRef} = useDroppable({id: `slot-${index}`})

    const draggable = useDraggable({
        id: card?.id ?? `empty-${index}`,
        data: card ? {origin: "combinator" as const, slotIndex: index} : undefined,
        disabled: !card,
    })

    return (
        <div
            ref={setNodeRef}
            className={[
                "border border-dashed rounded-lg flex items-center justify-center",
                isOver ? "border-cyan-300" : "border-cyan-800",
            ].join(" ")}
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                opacity: card ? 1 : 0.6,
            }}
            title={card ? "Drag o click derecho" : "Slot vacío"}
        >
            {card ? (
                <div
                    ref={draggable.setNodeRef}
                    {...draggable.listeners}
                    {...draggable.attributes}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        onRightClickSlot(card.id, index)
                    }}
                    style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                        backgroundColor: card.color,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        cursor: "grab",
                        userSelect: "none",
                        touchAction: "none",
                    }}
                >
                    <span className="text-3xl">{card.value}</span>
                </div>
            ) : (
                <span className="text-xs opacity-70">slot {index + 1}</span>
            )}
        </div>
    )
}

import {useDraggable, useDroppable} from "@dnd-kit/core"
import {CARD_BASE_CLASS, CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card"
import {CARD_PALETTE} from "../theme/cardPalette"
import {
    COMBINATOR_CONTAINER_BASE,
    COMBINATOR_CONTAINER_IDLE,
    COMBINATOR_CONTAINER_OVER,
    SECTION_HINT_CLASS,
    SECTION_TITLE_CLASS,
} from "../theme/containers"
import {SLOT_BASE_CLASS, SLOT_IDLE_CLASS, SLOT_OVER_CLASS} from "../theme/slots"

interface CombinatorProps {
    slots: Array<CardType | null>
    slotCount: number
    result: CardType | null
    heightClassName?: string
    onSlotRightClick: (slotIndex: number) => void
    onCombine: () => void
}

export const Combinator = ({
                               slots,
                               slotCount,
                               result,
                               heightClassName = "h-1/2",
                               onSlotRightClick,
                               onCombine
                           }: CombinatorProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "combinator"})

    return (
        <div
            ref={setNodeRef}
            className={[
                heightClassName,
                COMBINATOR_CONTAINER_BASE,
                isOver ? COMBINATOR_CONTAINER_OVER : COMBINATOR_CONTAINER_IDLE,
            ].join(" ")}
        >
            <div className={SECTION_TITLE_CLASS}>COMBINATOR</div>

            <div className="flex gap-3">
                {Array.from({length: slotCount}, (_, idx) => (
                    <Slot
                        key={idx}
                        index={idx}
                        card={slots[idx] ?? null}
                        onSlotRightClick={onSlotRightClick}
                    />
                ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
                <button
                    className="px-3 py-1 rounded bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onCombine}
                >
                    Combinar
                </button>

                <ResultSlot card={result}/>
            </div>

            <div className={SECTION_HINT_CLASS}>
                Drop aquí o en un slot. Si no hay espacio, se destruye.
            </div>
        </div>
    )
}

interface SlotProps {
    index: number
    card: CardType | null
    onSlotRightClick: (slotIndex: number) => void
}

const Slot = ({index, card, onSlotRightClick}: SlotProps) => {
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
                SLOT_BASE_CLASS,
                isOver ? SLOT_OVER_CLASS : SLOT_IDLE_CLASS,
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
                        e.preventDefault();
                        onSlotRightClick(index);
                    }}
                    className={`${CARD_BASE_CLASS} cursor-grab`}
                    style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                        backgroundColor: CARD_PALETTE[card.color],
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

interface ResultSlotProps {
    card: CardType | null
}

const ResultSlot = ({card}: ResultSlotProps) => {
    const draggable = useDraggable({
        id: card?.id ?? `empty-result`,
        data: card ? {origin: "result" as const} : undefined,
        disabled: !card,
    })

    return (
        <div
            className={[SLOT_BASE_CLASS, SLOT_IDLE_CLASS].join(" ")}
            style={{width: CARD_WIDTH, height: CARD_HEIGHT, opacity: card ? 1 : 0.6}}
            title={card ? "Drag para usar el resultado" : "Resultado vacío"}
        >
            {card ? (
                <div
                    ref={draggable.setNodeRef}
                    {...draggable.listeners}
                    {...draggable.attributes}
                    className={`${CARD_BASE_CLASS} cursor-grab`}
                    style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                        backgroundColor: CARD_PALETTE[card.color],
                    }}
                >
                    <span className="text-3xl">{card.value}</span>
                </div>
            ) : (
                <span className="text-xs opacity-70">resultado</span>
            )}
        </div>
    )
}

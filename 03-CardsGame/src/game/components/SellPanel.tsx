import {useDraggable, useDroppable} from "@dnd-kit/core"
import {CARD_BASE_CLASS, CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card"
import {CARD_PALETTE} from "../theme/cardPalette"
import {
    SECTION_TITLE_CLASS,
    SECTION_HINT_CLASS,
    COMBINATOR_CONTAINER_BASE,
    COMBINATOR_CONTAINER_IDLE
} from "../theme/containers"
import {SLOT_BASE_CLASS, SLOT_IDLE_CLASS, SLOT_OVER_CLASS} from "../theme/slots"
import {getSellPrice} from "../domain/economy"

interface SellPanelProps {
    card: CardType | null
    onSell: () => void
}

export const SellPanel = ({card, onSell}: SellPanelProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "sellSlot"})
    const draggable = useDraggable({
        id: card?.id ?? "empty-sell",
        data: card ? {origin: "sellSlot" as const} : undefined,
        disabled: !card,
    })

    const price = card ? getSellPrice(card.value) : null

    return (
        <div className={[COMBINATOR_CONTAINER_BASE, COMBINATOR_CONTAINER_IDLE].join(" ")}>
            <div className={SECTION_TITLE_CLASS}>VENDER</div>

            <div className="flex items-center gap-3">
                <div
                    ref={setNodeRef}
                    className={[SLOT_BASE_CLASS, isOver ? SLOT_OVER_CLASS : SLOT_IDLE_CLASS].join(" ")}
                    style={{width: CARD_WIDTH, height: CARD_HEIGHT, opacity: card ? 1 : 0.6}}
                    title={card ? "Arrastra para sacar la carta" : "Soltá una carta para vender"}
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
                        <span className="text-xs opacity-70">sell</span>
                    )}
                </div>

                <button
                    className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onSell}
                    disabled={!card}
                >
                    Vender
                </button>
            </div>

            <div className={SECTION_HINT_CLASS}>
                {price !== null ? `Vas a ganar $${price}` : "Arrastra una carta para ver su precio"}
            </div>
        </div>
    )
}

import {CARD_BASE_CLASS, CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card"
import {CARD_PALETTE} from "../theme/cardPalette"

export const CardPreview = ({value, color}: Pick<CardType, "value" | "color">) => {
    return (
        <div
            className={`${CARD_BASE_CLASS} cursor-grabbing`}
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: CARD_PALETTE[color],
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
        >
            <span className="text-3xl">{value}</span>
        </div>
    )
}

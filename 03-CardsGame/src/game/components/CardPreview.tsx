import {CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card";

export const CardPreview = ({value, color}: Pick<CardType, "value" | "color">) => {
    return (
        <div
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: color,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "grabbing",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
        >
            {value}
        </div>
    )
}

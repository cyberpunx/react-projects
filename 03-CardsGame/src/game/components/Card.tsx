import {useDraggable} from "@dnd-kit/core"
import {motion} from "motion/react"

export const CARD_HEIGHT = 80
export const CARD_WIDTH = 60

export type CardColor = "red" | "blue" | "orange"
export const CARD_COLORS: CardColor[] = ["red", "blue", "orange"]

export type CardType = {
    id: string
    x: number
    value: number
    color: CardColor
}

interface CardProps extends CardType {
    beltHeight: number
    fallDurationMs: number
    onExpire: (id: string) => void
    onRightClick?: (id: string) => void
}

export const Card = ({id, x, value, color, beltHeight, fallDurationMs, onExpire, onRightClick,}: CardProps) => {
    const {attributes, listeners, setNodeRef} = useDraggable({id, data: {origin: "belt" as const}})

    return (
        <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            initial={{y: -CARD_HEIGHT, opacity: 1}}
            animate={{y: beltHeight + CARD_HEIGHT, opacity: 1}}
            exit={{opacity: 0}}
            transition={{
                duration: fallDurationMs / 1000,
                ease: "linear",
            }}
            onAnimationComplete={() => onExpire(id)}
            onContextMenu={(e) => {
                e.preventDefault()
                onRightClick?.(id)
            }}
            style={{
                position: "absolute",
                left: x,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: color,
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
            <span className="text-3xl">{value}</span>
        </motion.div>
    )
}

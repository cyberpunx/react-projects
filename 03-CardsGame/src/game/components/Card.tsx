import {motion} from "motion/react"
import {CSS} from "@dnd-kit/utilities";
import {useDraggable} from "@dnd-kit/core";

export const CARD_HEIGHT = 80
export const CARD_WIDTH = 60

export type CardType = {
    id: string
    x: number
    value: number
    color: CardColor
};

interface CardProps extends CardType {
    beltHeight: number
    fallDurationMs: number
    onExpire: (id: string) => void
    onRightClick?: (id: string) => void
}

export type CardColor = 'red' | 'blue' | 'orange'
export const CARD_COLORS: CardColor[] = ['red', 'blue', 'orange']


export const Card = ({id, x, value, color, beltHeight, fallDurationMs, onExpire, onRightClick}: CardProps) => {
    const {attributes, listeners, setNodeRef, isDragging} = useDraggable({id})

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
            onContextMenu={(e) => {
                e.preventDefault()
                onRightClick?.(id)
            }}
            onAnimationComplete={() => onExpire(id)}
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
            <span className="text-3xl ">{value}</span>
        </motion.div>
    )
}
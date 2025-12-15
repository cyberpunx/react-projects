import {useDroppable} from "@dnd-kit/core";
import {CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card";

interface CombinatorProps {
    slots: Array<CardType | null>
    heightClassName?: string
}

export const Combinator = ({slots, heightClassName = "h-1/2"}: CombinatorProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "combinator"})

    return (
        <div
            ref={setNodeRef}
            className={[
                heightClassName,
                "w-[420px] border-2 rounded-xl p-4",
                isOver ? "border-cyan-400" : "border-cyan-700",
            ].join(" ")}
        >
            <div className="mb-3 text-sm opacity-70">COMBINATOR</div>

            <div className="flex gap-3">
                {slots.map((slot, idx) => (
                    <div
                        key={idx}
                        className="border border-dashed rounded-lg flex items-center justify-center"
                        style={{
                            width: CARD_WIDTH,
                            height: CARD_HEIGHT,
                            opacity: slot ? 1 : 0.5,
                        }}
                    >
                        {slot ? (
                            <div
                                style={{
                                    width: CARD_WIDTH,
                                    height: CARD_HEIGHT,
                                    backgroundColor: slot.color,
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                {slot.value}
                            </div>
                        ) : (
                            <span className="text-xs opacity-70">slot {idx + 1}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
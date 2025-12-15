import {useDroppable} from "@dnd-kit/core";
import {CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card.tsx";

interface WorkspaceProps {
    cards: CardType[]
}

export const Workspace = ({cards}: WorkspaceProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "workspace"})

    return (
        <div
            ref={setNodeRef}
            className={[
                "h-1/2 w-[420px] border-2 border-dashed rounded-xl p-4",
                isOver ? "border-green-500" : "border-gray-500",
            ].join(" ")}
        >
            <div className="mb-3 text-sm opacity-70">
                WORKSPACE — cartas: {cards.length}
            </div>

            {/* Grilla simple para acumular */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
                    gap: 12,
                    alignContent: "start",
                }}
            >
                {cards.map((c) => (
                    <div
                        key={c.id}
                        style={{
                            width: CARD_WIDTH,
                            height: CARD_HEIGHT,
                            backgroundColor: c.color,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            opacity: 0.95,
                        }}
                    >
                        {c.value}
                    </div>
                ))}
            </div>
        </div>
    )
}
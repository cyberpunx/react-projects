import {useDraggable, useDroppable} from "@dnd-kit/core";
import {CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card";

interface WorkspaceProps {
    cards: CardType[];
    onRightClickCard: (cardId: string) => void;
}

export const Workspace = ({cards, onRightClickCard}: WorkspaceProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "workspace"});

    return (
        <div
            ref={setNodeRef}
            className={[
                "h-1/2 w-[420px] border-2 border-dashed rounded-xl p-4 overflow-auto",
                isOver ? "border-green-500" : "border-gray-500",
            ].join(" ")}
        >
            <div className="mb-3 text-sm opacity-70">
                WORKSPACE — cartas: {cards.length}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
                    gap: 12,
                    alignContent: "start",
                }}
            >
                {cards.map((c) => (
                    <WorkspaceCard
                        key={c.id}
                        card={c}
                        onRightClick={() => onRightClickCard(c.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const WorkspaceCard = ({
                           card,
                           onRightClick,
                       }: {
    card: CardType;
    onRightClick: () => void;
}) => {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: card.id,
        data: {origin: "workspace" as const},
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onContextMenu={(e) => {
                e.preventDefault();
                onRightClick();
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
            title="Drag o click derecho"
        >
            <span className="text-3xl">{card.value}</span>
        </div>
    );
};

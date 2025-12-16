import {useDraggable, useDroppable} from "@dnd-kit/core"
import {CARD_BASE_CLASS, CARD_HEIGHT, CARD_WIDTH, type CardType} from "./Card"
import {CARD_PALETTE} from "../theme/cardPalette"
import {
    SECTION_TITLE_CLASS,
    WORKSPACE_CONTAINER_BASE,
    WORKSPACE_CONTAINER_IDLE,
    WORKSPACE_CONTAINER_OVER,
} from "../theme/containers"
import {WORKSPACE_SLOTS} from "../state/gameReducer"

interface WorkspaceProps {
    cards: CardType[]
    onRightClickCard: (cardId: string) => void
}

export const Workspace = ({cards, onRightClickCard}: WorkspaceProps) => {
    const {isOver, setNodeRef} = useDroppable({id: "workspace"})

    return (
        <div
            ref={setNodeRef}
            className={[
                WORKSPACE_CONTAINER_BASE,
                isOver ? WORKSPACE_CONTAINER_OVER : WORKSPACE_CONTAINER_IDLE,
            ].join(" ")}
        >
            <div className={SECTION_TITLE_CLASS}>
                WORKSPACE — cartas: {cards.length}/{WORKSPACE_SLOTS}
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
                    <WorkspaceCard key={c.id} card={c} onRightClick={() => onRightClickCard(c.id)}/>
                ))}
            </div>
        </div>
    )
}

interface WorkspaceCardProps {
    card: CardType
    onRightClick: () => void
}

const WorkspaceCard = ({card, onRightClick,}: WorkspaceCardProps) => {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: card.id,
        data: {origin: "workspace" as const},
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onContextMenu={(e) => {
                e.preventDefault()
                onRightClick()
            }}
            className={`${CARD_BASE_CLASS} cursor-grab`}
            style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                backgroundColor: CARD_PALETTE[card.color],
            }}
            title="Drag o click derecho"
        >
            <span className="text-3xl">{card.value}</span>
        </div>
    )
}

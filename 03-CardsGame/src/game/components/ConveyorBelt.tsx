import {CARD_WIDTH, Card, type CardType} from "./Card.tsx";

export const LANE_GAP = 20;
export const LANE_COUNT = 5;

export const buildLanes = (laneCount: number) => {
    return Array.from({length: laneCount}, (_, i) => {
        return 10 + i * (CARD_WIDTH + LANE_GAP);
    });
};

interface ConveyorBeltProps {
    cards: CardType[]
    beltHeight: number
    beltWidth: number
    fallDurationMs: number
    onExpire: (id: string) => void
    onCardRightClick: (cardId: string) => void
}


export const ConveyorBelt = ({
                                 cards,
                                 beltHeight,
                                 beltWidth,
                                 fallDurationMs,
                                 onExpire,
                                 onCardRightClick
                             }: ConveyorBeltProps) => {
    return (
        <div className="relative h-screen overflow-hidden border-2 border-purple-600"
             style={{
                 width: beltWidth
             }}>
            {cards.map((card) => (
                <Card
                    key={card.id}
                    {...card}
                    beltHeight={beltHeight}
                    fallDurationMs={fallDurationMs}
                    onExpire={onExpire}
                    onRightClick={onCardRightClick}
                />
            ))}
        </div>
    )
}
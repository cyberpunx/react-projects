import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {Workspace} from "./Workspace";
import {Combinator} from "./Combinator";
import {buildLanes, ConveyorBelt, LANE_COUNT, LANE_GAP} from "./ConveyorBelt.tsx";
import {CARD_WIDTH, type CardType} from "./Card.tsx";
import {randomInt} from "../lib/utils.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import {randomColor} from "../lib/helpers.ts";
import {snapCenterToCursor} from "@dnd-kit/modifiers";
import {CardPreview} from "./CardPreview.tsx";

const WINDOW_HEIGHT = window.innerHeight
const FALL_DURATION_MS = 9000
const SPAWN_BASE_MS = 1400
const COMBINATOR_SLOTS = 3;

type CombinatorSlots = Array<CardType | null>;


export const CardsGame = () => {
    const [cards, setCards] = useState<CardType[]>([])
    const [workspaceCards, setWorkspaceCards] = useState<CardType[]>([]);
    const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
    const beltHeight = WINDOW_HEIGHT
    const beltWidth = LANE_COUNT * (CARD_WIDTH + LANE_GAP)
    const [combinatorSlots, setCombinatorSlots] = useState<CombinatorSlots>(Array.from({length: COMBINATOR_SLOTS}, () => null))

    const lanes = useMemo(() => buildLanes(LANE_COUNT), [])
    const lastLaneRef = useRef<number | null>(null)

    const handleExpire = (id: string) => {
        setCards((prev) => prev.filter((c) => c.id !== id))
    };

    useEffect(() => {
        let cancelled = false
        let timeoutId: number | null = null

        const spawnOnce = () => {
            if (cancelled) return

            setCards((prev) => {
                const lastLane = lastLaneRef.current
                const possible = lanes.filter((x) => x !== lastLane)
                const x = possible[randomInt(0, possible.length - 1)]
                lastLaneRef.current = x;

                const newCard: CardType = {
                    id: crypto.randomUUID(),
                    x,
                    value: randomInt(0, 9),
                    color: randomColor(),
                };
                return [...prev, newCard]
            })
            const jitter = SPAWN_BASE_MS * 0.6
            const nextInMs = Math.max(80, Math.round(SPAWN_BASE_MS + randomInt(-jitter, jitter)))
            timeoutId = window.setTimeout(spawnOnce, nextInMs)
        };

        spawnOnce()
        return () => {
            cancelled = true
            if (timeoutId !== null) window.clearTimeout(timeoutId)
        }
    }, [lanes])

    const onDragStart = (event: DragStartEvent) => {
        const id = String(event.active.id)

        setCards((prev) => {
            const card = prev.find((c) => c.id === id)
            if (!card) return prev

            setDraggedCard(card)
            return prev.filter((c) => c.id !== id)
        })
    }

    const onDragEnd = (event: DragEndEvent) => {
        const overId = event.over?.id
        if (draggedCard && overId === "workspace") {
            setWorkspaceCards((prev) => [...prev, draggedCard])
        }
        setDraggedCard(null)
    }

    const onDragCancel = () => {
        setDraggedCard(null)
    }

    const sendToCombinator = (card: CardType) => {
        setCombinatorSlots((prev) => {
            const firstFree = prev.findIndex((s) => s === null)
            if (firstFree === -1) return prev

            const next = [...prev]
            next[firstFree] = card
            return next;
        })
    }

    const onCardRightClick = (origin: "belt" | "workspace", cardId: string) => {
        const source = origin === "belt" ? cards : workspaceCards
        const card = source.find((c) => c.id === cardId)
        if (!card) return

        let moved = false
        setCombinatorSlots((prev) => {
            const firstFree = prev.findIndex((s) => s === null)
            if (firstFree === -1) return prev

            const next = [...prev]
            next[firstFree] = card
            moved = true
            return next
        })

        if (moved) {
            if (origin === "belt") setCards((prev) => prev.filter((c) => c.id !== cardId))
            else setWorkspaceCards((prev) => prev.filter((c) => c.id !== cardId))
        }
    }


    return (
        <>
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
                modifiers={[snapCenterToCursor]}
            >
                <div className="flex w-screen h-screen">
                    {/* IZQUIERDA */}
                    <div className="w-[420px] h-screen flex flex-col gap-4 p-2">
                        <Combinator slots={combinatorSlots}/>
                        <Workspace
                            cards={workspaceCards}
                            onCardRightClick={(cardId) => onCardRightClick("workspace", cardId)}
                        />
                    </div>

                    {/* DERECHA */}
                    <div className="ml-auto">
                        <ConveyorBelt
                            cards={cards}
                            beltHeight={beltHeight}
                            beltWidth={beltWidth}
                            fallDurationMs={FALL_DURATION_MS}
                            onExpire={handleExpire}
                            onCardRightClick={(cardId) => onCardRightClick("belt", cardId)}
                        />
                    </div>
                </div>
            </DndContext>
        </>
    )
}
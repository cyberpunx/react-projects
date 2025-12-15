import {DndContext, DragOverlay, type DragCancelEvent, type DragEndEvent, type DragStartEvent,} from "@dnd-kit/core"
import {snapCenterToCursor} from "@dnd-kit/modifiers"
import {useEffect, useMemo, useReducer, useRef} from "react"
import {Workspace} from "./Workspace"
import {Combinator} from "./Combinator"
import {CardPreview} from "./CardPreview"
import {buildLanes, ConveyorBelt, LANE_COUNT, LANE_GAP,} from "./ConveyorBelt"
import {CARD_WIDTH, type CardType} from "./Card"
import {COMBINATOR_SLOTS, initialState, reducer, type Origin,} from "../state/gameReducer"
import {randomInt} from "../lib/utils.ts"
import {randomColor} from "../lib/helpers.ts"

const WINDOW_HEIGHT = window.innerHeight
const FALL_DURATION_MS = 15000
const SPAWN_BASE_MS = 1400

export const CardsGame = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const lanes = useMemo(() => buildLanes(LANE_COUNT), [])
    const lastLaneRef = useRef<number | null>(null)
    const beltWidth = LANE_COUNT * (CARD_WIDTH + LANE_GAP)
    const handleExpire = (id: string) => {
        dispatch({type: "EXPIRE_CARD", payload: {id}})
    }

    useEffect(() => {
        let cancelled = false
        let timeoutId: number | null = null

        const spawnOnce = () => {
            if (cancelled) return
            const lastLane = lastLaneRef.current
            const possible = lanes.filter((x) => x !== lastLane)
            const x = possible[randomInt(0, possible.length - 1)]
            lastLaneRef.current = x
            const card: CardType = {id: crypto.randomUUID(), x, value: randomInt(0, 9), color: randomColor(),}
            dispatch({type: "SPAWN_CARD", payload: card})
            const jitter = SPAWN_BASE_MS * 0.6
            const nextInMs = Math.max(80, Math.round(SPAWN_BASE_MS + randomInt(-jitter, jitter)))
            timeoutId = window.setTimeout(spawnOnce, nextInMs)
        }
        spawnOnce()
        return () => {
            cancelled = true
            if (timeoutId !== null) window.clearTimeout(timeoutId)
        }
    }, [lanes])

    const onDragStart = (event: DragStartEvent) => {
        const id = String(event.active.id)
        const origin = event.active.data.current?.origin as Origin | undefined
        const slotIndex = event.active.data.current?.slotIndex as number | undefined

        if (!origin) return

        dispatch({
            type: "PICKUP_CARD",
            payload: {id, origin, slotIndex},
        })
    }

    const onDragEnd = (event: DragEndEvent) => {
        const overId = event.over?.id ? String(event.over.id) : undefined
        dispatch({type: "DROP_CARD", payload: {overId}})
    }

    const onDragCancel = (_event: DragCancelEvent) => {
        dispatch({type: "DESTROY_DRAG"})
    }

    const onRightClick = (origin: Origin, id: string, slotIndex?: number) => {
        dispatch({type: "RIGHT_TO_COMBINATOR", payload: {id, origin, slotIndex}})
    }

    return (
        <DndContext
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            modifiers={[snapCenterToCursor]}
        >
            <div className="flex w-screen h-screen">
                {/* IZQUIERDA */}
                <div className="w-[420px] h-screen flex flex-col gap-4 p-2">
                    <Combinator
                        slotCount={COMBINATOR_SLOTS}
                        slots={state.combinator}
                        onRightClickSlot={(cardId, slotIndex) =>
                            onRightClick("combinator", cardId, slotIndex)
                        }
                    />

                    <Workspace
                        cards={state.workspace}
                        onRightClickCard={(cardId) => onRightClick("workspace", cardId)}
                    />
                </div>

                {/* DERECHA */}
                <div className="ml-auto">
                    <ConveyorBelt
                        cards={state.belt}
                        beltHeight={WINDOW_HEIGHT}
                        beltWidth={beltWidth}
                        fallDurationMs={FALL_DURATION_MS}
                        onExpire={handleExpire}
                        onCardRightClick={(cardId) => onRightClick("belt", cardId)}
                    />
                </div>
            </div>

            <DragOverlay>
                {state.drag ? (<CardPreview value={state.drag.card.value} color={state.drag.card.color}/>) : null}
            </DragOverlay>
        </DndContext>
    )
}

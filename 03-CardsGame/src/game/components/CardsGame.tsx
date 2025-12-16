import {DndContext, DragOverlay, type DragCancelEvent, type DragEndEvent, type DragStartEvent,} from "@dnd-kit/core"
import {snapCenterToCursor} from "@dnd-kit/modifiers"
import {useEffect, useMemo, useReducer, useRef, useState} from "react"
import {Workspace} from "./Workspace"
import {Combinator} from "./Combinator"
import {CardPreview} from "./CardPreview"
import {buildLanes, ConveyorBelt, LANE_COUNT, LANE_GAP,} from "./ConveyorBelt"
import {CARD_WIDTH} from "./Card"
import {COMBINATOR_SLOTS, initialState, reducer, type Origin,} from "../state/gameReducer"
import {randomInt} from "../lib/utils.ts"
import {randomColor} from "../lib/helpers.ts"
import {APP_CONTAINER_CLASS, LEFT_PANEL_CLASS} from "../theme/layout"
import {createCard} from "../domain/cards"

const FALL_DURATION_MS = 15000
const SPAWN_BASE_MS = 1400
const VALUE_MAX = 2
const VALUE_MIN = 1

// SSR-safe y reactivo al resize
function useViewportHeight() {
    const [h, setH] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 0))
    useEffect(() => {
        if (typeof window === "undefined") return
        const onResize = () => setH(window.innerHeight)
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])
    return h
}

export const CardsGame = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const viewportHeight = useViewportHeight()
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
            const valueMin = VALUE_MIN
            const valueMax = VALUE_MAX
            const card = createCard({x, valueMin, valueMax})
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

    const onCombinatorSlotRightClick = (slotIndex: number) => {
        dispatch({
            type: "RIGHT_TO_WORKSPACE",
            payload: {slotIndex},
        });
    };

    return (
        <DndContext
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            modifiers={[snapCenterToCursor]}
        >
            <div className={APP_CONTAINER_CLASS}>
                {/* IZQUIERDA */}
                <div className={LEFT_PANEL_CLASS}>
                    <Combinator
                        slotCount={COMBINATOR_SLOTS}
                        slots={state.combinator}
                        onSlotRightClick={onCombinatorSlotRightClick}
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
                        beltHeight={viewportHeight}
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

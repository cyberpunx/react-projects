import {DndContext, DragOverlay, type DragEndEvent, type DragStartEvent,} from "@dnd-kit/core"
import {snapCenterToCursor} from "@dnd-kit/modifiers"
import {useEffect, useMemo, useReducer, useRef, useState} from "react"
import {Workspace} from "./Workspace"
import {Combinator} from "./Combinator"
import {SellPanel} from "./SellPanel"
import {CardPreview} from "./CardPreview"
import {buildLanes, ConveyorBelt, LANE_COUNT, LANE_GAP,} from "./ConveyorBelt"
import {CARD_WIDTH} from "./Card"
import {COMBINATOR_SLOTS, WIN_GOAL, initialState, reducer, type Origin,} from "../state/gameReducer"
import {PRICE_TABLE} from "../domain/economy"
import {randomInt} from "../lib/utils.ts"
import {APP_CONTAINER_CLASS, LEFT_PANEL_CLASS} from "../theme/layout"
import {createCard} from "../domain/cards"

const FALL_DURATION_MS = 30000
const SPAWN_BASE_MS = 5000
const VALUE_MAX = 2
const VALUE_MIN = 1

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

        const initialDelay = 200
        timeoutId = window.setTimeout(spawnOnce, initialDelay)
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

    const onDragCancel = () => {
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
                    <SellPanel
                        card={state.sellSlot}
                        onSell={() => dispatch({type: "SELL_CONFIRM"})}
                    />

                    <Combinator
                        slotCount={COMBINATOR_SLOTS}
                        slots={state.combinator}
                        result={state.result}
                        onSlotRightClick={onCombinatorSlotRightClick}
                        onCombine={() => dispatch({type: "COMBINE_CARDS"})}
                    />

                    <Workspace
                        cards={state.workspace}
                        onRightClickCard={(cardId) => onRightClick("workspace", cardId)}
                    />
                </div>

                {/* COLUMNA CENTRAL */}
                <div className="flex-1 flex flex-col items-center p-2">
                    {state.victory ? (
                        <div className="mb-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold">
                            ¡Victoria! Objetivo alcanzado ({WIN_GOAL}$)
                        </div>
                    ) : null}
                    <div className="text-2xl font-bold">{state.money}$</div>

                    {/* Tabla de precios */}
                    <div className="mt-2 w-full max-w-sm p-5">
                        <div className="text-sm opacity-70 mb-1 text-center">Lista de precios</div>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                            <tr className="text-center">
                                <th className="border-b border-slate-500 pb-1 text-center">Valor</th>
                                <th className="border-b border-slate-500 pb-1 text-center">Precio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(PRICE_TABLE)
                                .sort((a, b) => Number(a[0]) - Number(b[0]))
                                .map(([value, price]) => (
                                    <tr key={value}>
                                        <td className="py-1 pr-2 text-center">{value}</td>
                                        <td className="py-1 text-center">${price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

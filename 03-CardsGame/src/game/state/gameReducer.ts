import type {CardType} from "../components/Card"
import {getSellPrice} from "../domain/economy"

export const COMBINATOR_SLOTS = 3
export const VALUE_LIMIT = 7

export type Origin = "belt" | "workspace" | "combinator" | "result" | "sellSlot"

export type DragState =
    | { card: CardType, origin: Origin, slotIndex?: number }
    | null

export type GameState = {
    belt: CardType[]
    workspace: CardType[]
    combinator: Array<CardType | null>
    result: CardType | null
    drag: DragState
    sellSlot: CardType | null
    money: number
}

export type Action =
    | { type: "SPAWN_CARD", payload: CardType }
    | { type: "EXPIRE_CARD", payload: { id: string } }
    | { type: "PICKUP_CARD", payload: { id: string, origin: Origin, slotIndex?: number } }
    | { type: "DROP_CARD", payload: { overId?: string } }
    | { type: "RIGHT_TO_COMBINATOR", payload: { id: string, origin: Origin, slotIndex?: number } }
    | { type: "DESTROY_DRAG" }
    | { type: "RIGHT_TO_WORKSPACE", payload: { slotIndex: number } }
    | { type: "COMBINE_CARDS" }
    | { type: "SELL_CONFIRM" }


export const initialState: GameState = {
    belt: [],
    workspace: [],
    combinator: Array.from({length: COMBINATOR_SLOTS}, () => null),
    result: null,
    drag: null,
    sellSlot: null,
    money: 0,
}

const firstFreeSlot = (slots: Array<CardType | null>) =>
    slots.findIndex((s) => s === null)

const placeInCombinator = (
    slots: Array<CardType | null>,
    card: CardType,
    preferredIdx?: number
): Array<CardType | null> | null => {
    const next = [...slots]

    // slot específico
    if (preferredIdx !== undefined) {
        if (preferredIdx < 0 || preferredIdx >= next.length) return null
        if (next[preferredIdx] !== null) return null
        next[preferredIdx] = card
        return next
    }

    // primer slot libre
    const idx = firstFreeSlot(next)
    if (idx === -1) return null
    next[idx] = card
    return next
}

const removeFromOrigin = (
    state: GameState,
    id: string,
    origin: Origin,
    slotIndex?: number
): GameState => {
    if (origin === "belt") {
        return {...state, belt: state.belt.filter((c) => c.id !== id)}
    }
    if (origin === "workspace") {
        return {...state, workspace: state.workspace.filter((c) => c.id !== id)}
    }
    if (origin === "result") {
        if (state.result?.id !== id) return state
        return {...state, result: null}
    }
    if (origin === "sellSlot") {
        if (state.sellSlot?.id !== id) return state
        return {...state, sellSlot: null}
    }

    if (slotIndex === undefined) return state
    const next = [...state.combinator]
    if (next[slotIndex]?.id === id) next[slotIndex] = null
    return {...state, combinator: next}
}

const findInOrigin = (
    state: GameState,
    id: string,
    origin: Origin,
    slotIndex?: number
): CardType | null => {
    if (origin === "belt") return state.belt.find((c) => c.id === id) ?? null
    if (origin === "workspace")
        return state.workspace.find((c) => c.id === id) ?? null
    if (origin === "result") return state.result && state.result.id === id ? state.result : null
    if (origin === "sellSlot") return state.sellSlot && state.sellSlot.id === id ? state.sellSlot : null

    // combinator
    if (slotIndex === undefined) return null
    const card = state.combinator[slotIndex]
    if (!card) return null
    return card.id === id ? card : null
}

const parseSlotIndex = (overId: string): number | null => {
    if (!overId.startsWith("slot-")) return null
    const n = Number(overId.replace("slot-", ""))
    return Number.isFinite(n) ? n : null
}

export function reducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case "SPAWN_CARD": {
            return {...state, belt: [...state.belt, action.payload]}
        }

        case "EXPIRE_CARD": {
            const {id} = action.payload
            return {...state, belt: state.belt.filter((c) => c.id !== id)}
        }

        case "PICKUP_CARD": {
            const {id, origin, slotIndex} = action.payload
            const card = findInOrigin(state, id, origin, slotIndex)
            if (!card) return state

            const removed = removeFromOrigin(state, id, origin, slotIndex)
            return {
                ...removed,
                drag: {card, origin, slotIndex},
            }
        }

        case "DROP_CARD": {
            if (!state.drag) return state

            const {card} = state.drag
            const overId = action.payload.overId

            if (overId === "workspace") {
                return {
                    ...state,
                    workspace: [...state.workspace, card],
                    drag: null,
                }
            }

            if (overId) {
                const idx = parseSlotIndex(overId)
                if (idx !== null) {
                    const placed = placeInCombinator(state.combinator, card, idx)
                    return {
                        ...state,
                        combinator: placed ?? state.combinator,
                        drag: null,
                    }
                }
                if (overId === "sellSlot") {
                    if (state.sellSlot === null) {
                        return {
                            ...state,
                            sellSlot: card,
                            drag: null,
                        }
                    } else {
                        return {
                            ...state,
                            drag: null,
                        }
                    }
                }
            }

            if (overId === "combinator") {
                const placed = placeInCombinator(state.combinator, card)
                return {
                    ...state,
                    combinator: placed ?? state.combinator,
                    drag: null,
                }
            }

            return {...state, drag: null}
        }

        case "RIGHT_TO_COMBINATOR": {
            const {id, origin, slotIndex} = action.payload
            const card = findInOrigin(state, id, origin, slotIndex)
            if (!card) return state

            const placed = placeInCombinator(state.combinator, card)
            if (!placed) return state

            const removed = removeFromOrigin(state, id, origin, slotIndex)
            return {...removed, combinator: placed}
        }

        case "RIGHT_TO_WORKSPACE": {
            const {slotIndex} = action.payload;
            const card = state.combinator[slotIndex];

            if (!card) return state;

            const nextCombinator = [...state.combinator];
            nextCombinator[slotIndex] = null;

            return {
                ...state,
                combinator: nextCombinator,
                workspace: [...state.workspace, card],
            };
        }

        case "COMBINE_CARDS": {
            const cards = state.combinator
            if (cards.some((c) => c === null)) return state

            const filled = cards as CardType[]
            const first = filled[0]
            const sameColor = filled.every((c) => c.color === first.color)
            const sameValue = filled.every((c) => c.value === first.value)
            if (!sameColor || !sameValue) return state

            if (first.value >= VALUE_LIMIT) return state

            if (state.result !== null) return state

            const resultCard: CardType = {
                id: crypto.randomUUID(),
                x: 0,
                value: first.value + 1,
                color: first.color,
            }

            const emptied = state.combinator.map(() => null)

            return {
                ...state,
                combinator: emptied,
                result: resultCard,
            }
        }

        case "SELL_CONFIRM": {
            const card = state.sellSlot
            if (!card) return state
            const income = getSellPrice(card.value)
            return {
                ...state,
                money: state.money + income,
                sellSlot: null,
            }
        }


        case "DESTROY_DRAG": {
            return {...state, drag: null}
        }

        default:
            return state
    }
}

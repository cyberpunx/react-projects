import type {CardType} from "../components/Card"

export const COMBINATOR_SLOTS = 3

export type Origin = "belt" | "workspace" | "combinator"

export type DragState =
    | { card: CardType, origin: Origin, slotIndex?: number }
    | null

export type GameState = {
    belt: CardType[]
    workspace: CardType[]
    combinator: Array<CardType | null>
    drag: DragState
}

export type Action =
    | { type: "SPAWN_CARD", payload: CardType }
    | { type: "EXPIRE_CARD", payload: { id: string } }
    | { type: "PICKUP_CARD", payload: { id: string, origin: Origin, slotIndex?: number } }
    | { type: "DROP_CARD", payload: { overId?: string } }
    | { type: "RIGHT_TO_COMBINATOR", payload: { id: string, origin: Origin, slotIndex?: number } }
    | { type: "DESTROY_DRAG" }
    | { type: "RIGHT_TO_WORKSPACE", payload: { slotIndex: number } }


export const initialState: GameState = {
    belt: [],
    workspace: [],
    combinator: Array.from({length: COMBINATOR_SLOTS}, () => null),
    drag: null,
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

    // combinator
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

            // ✅ Workspace: siempre acumula
            if (overId === "workspace") {
                return {
                    ...state,
                    workspace: [...state.workspace, card],
                    drag: null,
                }
            }

            // ✅ Slot específico: si no cabe -> destruir
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
            }

            // ✅ Combinator general: primer slot libre si no cabe -> destruir
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

        case "DESTROY_DRAG": {
            return {...state, drag: null}
        }

        default:
            return state
    }
}

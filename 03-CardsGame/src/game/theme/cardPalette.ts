export const CARD_PALETTE = {
    red: "#ef4444",
    blue: "#3b82f6",
    orange: "#f59e0b",
} as const

export type CardColor = keyof typeof CARD_PALETTE

export const CARD_COLORS = Object.keys(CARD_PALETTE) as CardColor[]

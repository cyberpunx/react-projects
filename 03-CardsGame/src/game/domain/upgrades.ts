export type UpgradeKind = "beltSpeed" | "rarity" | "amount" | "autoSeller"

export type Upgrades = {
    beltSpeed: 0 | 1 | 2 | 3
    rarity: 0 | 1 | 2 | 3
    amount: 0 | 1 | 2
    autoSeller: boolean
}

const COSTS = {
    beltSpeed: [25, 150, 3000],
    rarity: [75, 500, 7000],
    amount: [200, 10000],
    autoSeller: [5000],
} as const

export function getUpgradeCost(kind: UpgradeKind, currentLevelOrEnabled: number | boolean): number | null {
    if (kind === "autoSeller") {
        return currentLevelOrEnabled ? null : COSTS.autoSeller[0]
    }
    const level = currentLevelOrEnabled as number
    const arr = COSTS[kind]
    return level >= arr.length ? null : arr[level]
}

export function isMax(kind: UpgradeKind, currentLevelOrEnabled: number | boolean): boolean {
    if (kind === "autoSeller") return !!currentLevelOrEnabled
    const level = currentLevelOrEnabled as number
    const arr = COSTS[kind]
    return level >= arr.length
}


const FALL_DURATION_MS_LEVELS = [15000, 10000, 7000, 5000] as const
const SPAWN_BASE_MS_LEVELS = [2000, 1200, 700] as const
const RARITY_VALUE_RANGES: ReadonlyArray<readonly [number, number]> = [
    [1, 2], // lvl 0
    [1, 3], // lvl 1
    [2, 4], // lvl 2
    [3, 5], // lvl 3
]

export type DerivedRules = {
    fallDurationMs: number
    spawnBaseMs: number
    minValue: number
    maxValue: number
    autoSellEnabled: boolean
}

export function getDerivedRules(up: Upgrades): DerivedRules {
    const fallDurationMs = FALL_DURATION_MS_LEVELS[up.beltSpeed]
    const spawnBaseMs = SPAWN_BASE_MS_LEVELS[up.amount]
    const [minValue, maxValue] = RARITY_VALUE_RANGES[up.rarity]
    return {
        fallDurationMs,
        spawnBaseMs,
        minValue,
        maxValue,
        autoSellEnabled: up.autoSeller,
    }
}

export const UPGRADE_LABELS: Record<UpgradeKind, string> = {
    beltSpeed: "Belt Speed",
    rarity: "Rarity",
    amount: "Amount of cards",
    autoSeller: "Automatic Seller",
}

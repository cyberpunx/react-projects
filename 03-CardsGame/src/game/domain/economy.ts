export const PRICE_TABLE: Record<number, number> = {
    1: 1,
    2: 5,
    3: 20,
    4: 80,
    5: 300,
    6: 1000,
    7: 5000,
};

export function getSellPrice(value: number): number {
    return PRICE_TABLE[value] ?? 0;
}

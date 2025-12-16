import {UPGRADE_LABELS, type UpgradeKind, type Upgrades, getUpgradeCost, isMax} from "../domain/upgrades"

type Props = {
    upgrades: Upgrades
    money: number
    onBuy: (kind: UpgradeKind) => void
}

export const UpgradesPanel = ({upgrades, money, onBuy}: Props) => {
    const items: Array<{ kind: UpgradeKind; label: string; levelText: string; cost: number | null; maxed: boolean }> = [
        {
            kind: "beltSpeed",
            label: UPGRADE_LABELS.beltSpeed,
            levelText: `Nivel ${upgrades.beltSpeed}/3`,
            cost: getUpgradeCost("beltSpeed", upgrades.beltSpeed),
            maxed: isMax("beltSpeed", upgrades.beltSpeed),
        },
        {
            kind: "rarity",
            label: UPGRADE_LABELS.rarity,
            levelText: `Nivel ${upgrades.rarity}/3`,
            cost: getUpgradeCost("rarity", upgrades.rarity),
            maxed: isMax("rarity", upgrades.rarity),
        },
        {
            kind: "amount",
            label: UPGRADE_LABELS.amount,
            levelText: `Nivel ${upgrades.amount}/2`,
            cost: getUpgradeCost("amount", upgrades.amount),
            maxed: isMax("amount", upgrades.amount),
        },
        {
            kind: "autoSeller",
            label: UPGRADE_LABELS.autoSeller,
            levelText: upgrades.autoSeller ? "Activado" : "Desactivado",
            cost: getUpgradeCost("autoSeller", upgrades.autoSeller),
            maxed: isMax("autoSeller", upgrades.autoSeller),
        },
    ]

    return (
        <div className="rounded-xl border border-slate-600 p-3">
            <div className="text-sm opacity-70 mb-2 text-center">Upgrades</div>
            <div className="flex flex-col gap-2">
                {items.map((it) => {
                    const disabled = it.maxed || it.cost === null || money < (it.cost ?? 0)
                    const btnText = it.maxed ? "Max" : it.cost === null ? "N/A" : `Comprar $${it.cost}`
                    return (
                        <div key={it.kind} className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="font-medium">{it.label}</span>
                                <span className="text-xs opacity-70">{it.levelText}</span>
                            </div>
                            <button
                                className="px-3 py-1 rounded bg-indigo-700 text-white hover:bg-indigo-600 active:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={disabled}
                                onClick={() => onBuy(it.kind)}
                                title={disabled && !it.maxed && it.cost !== null && money < it.cost ? "Dinero insuficiente" : undefined}
                            >
                                {btnText}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

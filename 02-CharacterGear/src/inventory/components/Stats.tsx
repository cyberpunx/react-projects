export type STAT_TYPE = 'STR' | 'DEX' | 'CON' | 'WIS' | 'INT' | 'CHA'
export type StatsState = Record<STAT_TYPE, number>;

interface StatsProps {
    stats: StatsState
}

export const Stats = ({stats}: StatsProps) => {
    return (
        <>
            <h2 className="text-white text-lg font-semibold mb-4">Stats</h2>
            <ul className="font-bold start text-justify font-mono">
                <li>STR: {stats.STR}</li>
                <li>DEX: {stats.DEX}</li>
                <li>CON: {stats.CON}</li>
                <li>WIS: {stats.WIS}</li>
                <li>INT: {stats.INT}</li>
                <li>CHA: {stats.CHA}</li>
            </ul>
        </>
    )
}
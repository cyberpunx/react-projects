interface ElevatorButtonProps {
    label: string
    isActive: boolean
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

}

export const PanelButton = ({label, isActive, onClick}: ElevatorButtonProps) => {
    const inactiveClasses = "bg-gray-700 w-16 h-16 rounded-full text-gray-200 text-2xl border-2 border-gray-600"
    const activeClasses = "bg-gray-700 w-16 h-16 rounded-full text-orange-400 text-2xl border-2 border-orange-400 text-shadow-amber-500"

    return (
        <>
            <button
                className={isActive ? activeClasses : inactiveClasses}
                onClick={onClick}
            >
                {label}
            </button>
        </>

    )
}
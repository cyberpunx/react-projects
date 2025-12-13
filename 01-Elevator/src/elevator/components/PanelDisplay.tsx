import type {ElevatorStatus} from "./ElevatorPanel.tsx";

interface PanelDisplayProps {
    floorText: string
    status: ElevatorStatus
}

export const PanelDisplay = ({floorText, status}: PanelDisplayProps) => {
    const activeTextClasses = "text-orange-400"
    const inactiveTextClasses = "text-gray-600"
    const statusText = status.toUpperCase()

    return (
        <>
            <div className="w-40 bg-gray-800 pt-5 pb-2 border-2 border-gray-900">
                <div>
                    <span className={`text-3xl ${status === 'up' ? activeTextClasses : inactiveTextClasses}`}>
                    ↑
                    </span>
                    <span className={`text-3xl mx-5 ${activeTextClasses}`}>
                    {floorText}
                    </span>
                    <span className={`text-3xl ${status === 'down' ? activeTextClasses : inactiveTextClasses}`}>
                    ↓
                    </span>
                </div>
                <div className="mt-2">
                <span className={`text-sm mx-5 ${status !== 'idle' ? activeTextClasses : inactiveTextClasses}`}>
                    {statusText.toUpperCase()}
                </span>
                </div>
            </div>
        </>

    )
}
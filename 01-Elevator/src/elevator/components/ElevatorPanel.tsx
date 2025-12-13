import {PanelButton} from "./PanelButton.tsx";
import {PanelDisplay} from "./PanelDisplay.tsx";
import {useEffect, useState} from "react";

const FLOORS = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2]
const FLOOR_LABELS: Record<number, string> = {
    0: "PB",
    [-1]: "S1",
    [-2]: "S2",
};

export type ElevatorStatus = 'up' | 'down' | 'idle'


export const ElevatorPanel = () => {
    const [status, setStatus] = useState<ElevatorStatus>('idle')
    const [floor, setFloor] = useState<number>(-2)
    const [queue, setQueue] = useState<number[]>([])

    const handleButtonClick = (selectedFloor: number) => {
        // if selected floor is already in queue, we do nothing
        if (queue.includes(selectedFloor)) return

        // if we're already on selected floor, we do nothing
        if (selectedFloor === floor) return

        // add floor to the queue
        setQueue((prev) => [...prev, selectedFloor])
    }

    useEffect(() => {
        if (queue.length === 0) {
            setStatus('idle')
            return
        }

        console.log("La cola es: " + queue)
        const targetFloor = queue[0]

        if (floor === targetFloor) {
            console.log("Llegamos a destino")
            setQueue((prev) => {
                const currentQueue = prev.filter(number => number !== floor)
                return currentQueue;
            });
            setStatus('idle')
            return
        }

        if (floor < targetFloor) {
            setStatus('up')
        } else {
            setStatus('down')
        }
        console.log("El destino es: " + targetFloor)
        console.log("Piso actual: " + floor)

        // traveling time
        const travel = setTimeout(() => {
            setFloor((prev) => (status === 'up' ? prev + 1 : prev - 1))
        }, 1000)

        // cleanup function
        return () => {
            clearTimeout(travel)
        }
    }, [queue, status, floor])

    return (
        <div className="border-2 border-gray-700 p-10 rounded-md">
            <div className="flex justify-center mb-10">
                <PanelDisplay floorText={FLOOR_LABELS[floor] ?? floor.toString()} status={status}/>
            </div>
            <hr className="border-gray-700 mb-7"/>
            <div className="grid grid-cols-3 gap-3">
                {FLOORS.map((f) => (
                    <PanelButton
                        key={f}
                        label={FLOOR_LABELS[f] ?? f.toString()}
                        isActive={f === floor || queue.includes(f)}
                        onClick={() => handleButtonClick(f)}/>
                ))}
            </div>
            <hr className="border-gray-700 mt-7 mb-2"/>
            <span className="text-gray-700 tracking-widest">
                •OTIS•
            </span>
        </div>
    )
}
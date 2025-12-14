import {GearSlot} from "./GearSlot.tsx";
import Head from '../../../public/icons/barbute.svg'
import Chest from '../../../public/icons/chest-armor.svg'
import LeftHand from '../../../public/icons/gauntlet.svg'
import RightHand from '../../../public/icons/gauntlet1.svg'
import Legs from '../../../public/icons/greaves.svg'
import Feet from '../../../public/icons/feet.svg'
import type {Item} from "../../data/items.data.ts";


export type GEAR_TYPE = 'HEAD' | 'CHEST' | 'R_HAND' | 'L_HAND' | 'LEGS' | 'FEET'
export type GearState = Record<GEAR_TYPE, Item | null>;

interface GearProps {
    gear: GearState
    onSlotDoubleClick: (i: GEAR_TYPE) => void
}

export const Gear = ({gear, onSlotDoubleClick}: GearProps) => {
    return (
        <>
            <h2 className="text-white text-lg font-semibold mb-4">Equipo</h2>
            <div className="flex flex-col items-center gap-4">
                {/*<!-- Cabeza -->*/}
                <GearSlot label={"Cabeza"} type={'HEAD'} img={Head} item={gear.HEAD}
                          onDoubleClick={() => onSlotDoubleClick('HEAD')}/>

                {/*<!-- Pecho -->*/}
                <GearSlot label={"Pecho"} type={'CHEST'} img={Chest} item={gear.CHEST}
                          onDoubleClick={() => onSlotDoubleClick('CHEST')}/>

                {/*<!-- Manos (Izquierda y Derecha) -->*/}
                <div className="flex gap-8">
                    <GearSlot label={"Mano Izq."} type={'L_HAND'} img={LeftHand} item={gear.L_HAND}
                              onDoubleClick={() => onSlotDoubleClick('L_HAND')}/>
                    <GearSlot label={"Mano Der."} type={'R_HAND'} img={RightHand} item={gear.R_HAND}
                              onDoubleClick={() => onSlotDoubleClick('R_HAND')}/>
                </div>

                {/*<!-- Piernas -->*/}
                <GearSlot label={"Piernas"} type={'LEGS'} img={Legs} item={gear.LEGS}
                          onDoubleClick={() => onSlotDoubleClick('LEGS')}/>

                {/*<!-- Pies -->*/}
                <GearSlot label={"Pies"} type={'FEET'} img={Feet} item={gear.FEET}
                          onDoubleClick={() => onSlotDoubleClick('FEET')}/>
            </div>
        </>
    )
}
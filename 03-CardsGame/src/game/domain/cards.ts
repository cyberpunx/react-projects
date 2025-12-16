import type {CardType} from "../components/Card"
import {randomInt} from "../lib/utils"
import {randomColor} from "../lib/helpers"

export type CreateCardOpts = {
    x: number
    id?: string
    valueMin: number
    valueMax: number
    color?: CardType["color"]
}

export function createCard({
                               x,
                               id = crypto.randomUUID(),
                               valueMin,
                               valueMax,
                               color,
                           }: CreateCardOpts): CardType {
    return {
        id,
        x,
        value: randomInt(valueMin, valueMax),
        color: color ?? randomColor(),
    }
}

import {CARD_COLORS, type CardColor} from "../components/Card.tsx";
import {randomInt} from "./utils.ts";

export const randomColor = (): CardColor => {
    const colors = CARD_COLORS
    return colors[randomInt(0, colors.length - 1)];
};
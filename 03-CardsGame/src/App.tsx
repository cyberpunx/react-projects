import {CardsGame} from "./game/components/CardsGame.tsx";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        window.addEventListener("contextmenu", disableContextMenu);
        return () => window.removeEventListener("contextmenu", disableContextMenu);
    }, []);


    return (
        <>
            <CardsGame/>
        </>
    )
}

export default App

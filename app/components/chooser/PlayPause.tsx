import { useClient } from "@/lib/ClientContext";
import { Play, Pause } from "@phosphor-icons/react";

export default function PlayPause() {
    const { sendAction, context } = useClient();

    const play = () => {
        sendAction("play");
    }
    const pause = () => {
        sendAction("pause");
    }

    return (
        <div className="pointer">
            {!context?.playing && (
                <div onClick={play}>
                    <Play size={32} weight="fill" />
                </div>
            )}
            {context?.playing && (
                <div onClick={pause}>
                    <Pause size={32} weight="fill" />
                </div>
            )}
        </div>
    )
}
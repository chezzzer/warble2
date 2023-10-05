import { useClient } from "@/lib/ClientContext";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

export default function Restart() {
    const {sendAction} = useClient();
    
    const restart = () => {
        sendAction("restart");
    }

    return (
        <div className="pointer" onClick={restart}>
            <ArrowCounterClockwise  size={32} weight="fill" />
        </div>
    )
}
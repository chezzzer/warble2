import { useClient } from "@/lib/ClientContext";
import { ArrowFatLineLeft } from "@phosphor-icons/react";

export default function Previous() {
    const {sendAction} = useClient();
    
    const previous = () => {
        sendAction("previous");
    }

    return (
        <div className="pointer" onClick={previous}>
            <ArrowFatLineLeft  size={32} weight="fill" />
        </div>
    )
}
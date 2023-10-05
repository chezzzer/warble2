import { useClient } from "@/lib/ClientContext";
import { ArrowFatLineRight } from "@phosphor-icons/react";

export default function Next() {
    const {sendAction} = useClient();
    
    const next = () => {
        sendAction("next");
    }

    return (
        <div className="pointer" onClick={next}>
            <ArrowFatLineRight  size={32} weight="fill" />
        </div>
    )
}
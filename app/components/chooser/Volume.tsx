import { SpeakerHigh, SpeakerLow, SpeakerNone } from "@phosphor-icons/react";
import styles from "@/styles/chooser/Volume.module.css";
import { useClient } from "@/lib/ClientContext";
import { useState } from "react";

export default function Volume() {
    const {sendAction, context} = useClient();

    const [volume, setVolume] = useState<number>(0);

    const icon = () => {
        if (volume == 0) {
            return <SpeakerNone size={40} weight="fill" />;
        }

        if (volume < 50) {
            return <SpeakerLow size={40} weight="fill" />;
        }

        return <SpeakerHigh size={40} weight="fill" />;
    }

    return (
        <div className={styles.volume}>
            <div>
                {icon()}
            </div>
            <input
                type="range"
                className="form-range"
                onInput={(e) => {
                    setVolume(e.currentTarget.valueAsNumber);
                }}
                onMouseUp={(e) => {
                    sendAction("setVolume", e.currentTarget.valueAsNumber);
                }}
                onTouchEnd={(e) => {
                    sendAction("setVolume", e.currentTarget.valueAsNumber);
                }}
                defaultValue={context?.volume ?? 0}
                min={0}
                max={100}
                step={5}
            />
        </div>
    );
}

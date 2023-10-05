import { SpeakerHigh } from "@phosphor-icons/react";
import styles from "@/styles/chooser/Volume.module.css";
import { useClient } from "@/lib/ClientContext";

export default function Volume() {
    const {sendAction, context} = useClient();

    return (
        <div className={styles.volume}>
            <div>
                <SpeakerHigh size={40} weight="fill" />
            </div>
            <input
                type="range"
                className="form-range"
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

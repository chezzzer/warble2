import Volume from "@/components/chooser/Volume";
import Restart from "@/components/chooser/Restart";
import PlayPause from "@/components/chooser/PlayPause";
import Track from "@/components/Track";

import { useClient } from "@/lib/ClientContext";

import styles from "@/styles/chooser/Footer.module.css";

export default function Footer() {
    const { context, progress } = useClient();

    return (
        <div className={styles.footer}>
            <div className="h-100">
                {context?.track && (
                    <Track progress={progress!} track={context?.track} />
                )}
            </div>
            <div className={styles.controls}>
                <Restart />
                <PlayPause />
                <Volume />
            </div>
        </div>
    );
}

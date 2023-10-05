import { useAdmin } from "@/lib/AdminContext";
import { useState } from "react";

import styles from "@/styles/admin/Sync.module.css";

export default function Sync() {
    const [sync, setSync] = useState(0);

    const { sendAction } = useAdmin();

    const submit = () => {
        const e = document.querySelector("#sync") as HTMLInputElement;
        e.value = "0";
        sendAction("sync", sync);
        setSync(0);
    };

    return (
        <div className={`${styles.sync} card card-body`}>
            <div className="d-flex justify-content-between">
                <div>
                    <h6>Sync</h6>
                    <div>Lyrics are Faster</div>
                </div>
                <div className="text-end">
                    <h6>{sync/1000} seconds</h6>
                    <div>Lyrics are Slower</div>
                </div>
            </div>
            <input
                id="sync"
                type="range"
                step={10}
                min={-5000}
                max={5000}
                defaultValue={0}
                className="form-range"
                onMouseUp={submit}
                onTouchEnd={submit}
                onChange={(e) => setSync(e.target.valueAsNumber)}
            />
        </div>
    );
}

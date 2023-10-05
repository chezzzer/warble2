import Next from "../chooser/Next";
import PlayPause from "../chooser/PlayPause";
import Previous from "../chooser/Previous";
import Restart from "../chooser/Restart";
import Volume from "../chooser/Volume";

import styles from "@/styles/admin/Controls.module.css"

export default function Controls() {
    return <div className="card card-body">
        <h6>
            Controls
        </h6>

        <div className="d-flex justify-content-between">
            <div><Previous/></div>
            <div><Restart/></div>
            <div><PlayPause/></div>
            <div><Next/></div>
        </div>
        <hr />
        <div className={styles.volume}>
            <Volume/>
        </div>
    </div>
}
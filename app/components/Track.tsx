import { formatSeconds } from "@/lib/common";
import { WarbleTrack } from "../../server/src/inc/context";
import styles from "@/styles/Track.module.css";
import Link from "next/link";

type TrackProps = {
    track: WarbleTrack;
    progress?: number;
};

export default function Track({ track, progress }: TrackProps) {
    return (
        <div className={styles.track}>
            <div>
                <img
                    className="rounded"
                    src={track.album?.images[1].url}
                    width={75}
                    alt={track.name}
                />
            </div>
            <div>
                <h5 className="mb-0 fw-bold">{track.name}</h5>
                <div className="mb-1">
                    {track.artists.map((a) => a.name).join(", ")}
                </div>
                {progress && track.duration && (
                    <small className="opacity-75">
                        {formatSeconds(progress / 1000)} /{" "}
                        {formatSeconds(track.duration / 1000)}
                    </small>
                )}
            </div>
        </div>
    );
}

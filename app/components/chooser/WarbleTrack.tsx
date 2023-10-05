import { formatSeconds } from "@/lib/common";
import { WarbleTrack } from "../../../server/src/inc/context";

type WarbleTrackProps = {
    track: WarbleTrack;
    seconds: number;
}

export default function WarbleTrack({track, seconds}: WarbleTrackProps) {
    const now = new Date().getTime();
    const date = new Date(now + seconds * 1000);
    return (
        <div className="card card-body">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <img
                            className="rounded"
                            src={track.album?.images[1].url}
                            width={75}
                            alt={track.name}
                        />
                    </div>
                    <div>
                        <h4 className="mb-0 fw-bold">{track.name}</h4>
                        <div className="lead">
                            {track.artists.map((a) => a.name).join(", ")}
                        </div>
                        <div className="opacity-75">
                            Playing at {date.toLocaleTimeString()} (in {formatSeconds(seconds)})
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
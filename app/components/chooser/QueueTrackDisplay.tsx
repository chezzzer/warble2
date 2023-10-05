import { formatSeconds } from "@/lib/common";
import { WarbleTrack } from "../../../server/src/inc/context";
import { QueueTrack } from "../../../server/src/inc/spotify";

type QueueTrackProps = {
    track: QueueTrack;
}

export default function QueueTrackDisplay({track}: QueueTrackProps) {
    return (
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <img
                            className="rounded"
                            src={track.image}
                            width={75}
                            alt={track.name}
                        />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold">{track.name}</h5>
                        <div>
                            {track.artists}
                        </div>
                    </div>
                </div>
            </div>
    )
}
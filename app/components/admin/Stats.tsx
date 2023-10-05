import { useAdmin } from "@/lib/AdminContext";
import { useClient } from "@/lib/ClientContext";
import { formatSeconds } from "@/lib/common";

export default function Stats() {
    const { stats } = useAdmin();
    const { queue, context, progress } = useClient();

    if (!stats) return <></>;

    function lyricType() {
        if (context?.lyrics?.type == "track.richsync.get") {
            return "Rich Sync";
        } else if (context?.lyrics?.type == "track.subtitles.get") {
            return "Subtitles";
        } else {
            return "None";
        }
    }

    return (
        <div className="card card-body">
            <div className="row">
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">CPU Usage</div>
                        <div>{stats.cpu}%</div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Memory Usage</div>
                        <div>{stats.memory / (1024 * 1000)} MB</div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Lyrics Error</div>
                        <div>
                            {context?.lyrics?.error
                                ? context.lyrics.error.error
                                : "No"}
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Lyric Type</div>
                        <div>{lyricType()}</div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Track Progress</div>
                        <div>
                            {formatSeconds(progress! / 1000)} /{" "}
                            {formatSeconds(context?.track?.duration! / 1000)}
                        </div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Track Playing</div>
                        <div>{context?.playing ? "Yes" : "No"}</div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Track Explicit</div>
                        <div>{context?.track?.explicit ? "Yes" : "No"}</div>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold">Server Uptime</div>
                        <div>{formatSeconds(stats.elapsed / 1000)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

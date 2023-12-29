import { useAdmin } from "@/lib/AdminContext";
import { useClient } from "@/lib/ClientContext";

export default function LyricType() {
    const { context } = useClient();
    const { sendAction } = useAdmin();

    if (!context) return <></>;

    const richsync = context.lyrics?.type == "track.richsync.get";

    const toggle = () => {
        if (richsync) {
            sendAction("setLyricType", "track.subtitles.get");
        } else {
            sendAction("setLyricType", "track.richsync.get");
        }
    }

    return (
        <div className="card card-body">
            <h6>Lyric Type</h6>
            <div className="d-flex">
                <div>
                    <h4 className="mb-0">Subtitles</h4>
                </div>
                <div className="w-100 px-3 my-1 d-flex justify-content-center">
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={richsync}
                            onInput={toggle}
                            style={{width: 200}}
                        />
                    </div>
                </div>
                <div>
                    <h4 className="mb-0">Richsync</h4>
                </div>
            </div>
        </div>
    );
}

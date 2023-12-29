import { useClient } from "@/lib/ClientContext";
import styles from "@/styles/admin/Seeker.module.css";
import { RichsyncLyric, SubtitleLyric } from "../../../server/src/inc/lyrics";
import { formatSeconds } from "@/lib/common";

export default function Seeker() {
    const { context, progress, sendAction } = useClient();

    const seek = (seconds: number) => {
        sendAction("seek", seconds);
    };

    function Lyric({
        time,
        lyric,
        end,
    }: {
        lyric: SubtitleLyric | RichsyncLyric;
        time: number;
        end: number;
    }) {
        const active = progress! >= time && progress! < end;
        return (
            <>
                <div
                    onClick={() => seek(time)}
                    className={`${styles.lyric} ${active ? styles.active : ""}`}
                >
                    <span className="badge">{formatSeconds(time / 1000)}</span> {lyric.text}
                </div>
                <hr />
            </>
        );
    }

    function Lyrics() {
        if (context?.lyrics?.error) {
            return (
                <div className="text-center">
                    <h6>{context.lyrics.error.error}</h6>
                    <p>{context.lyrics.error.description}</p>
                </div>
            );
        }
        if (context?.lyrics?.type == "track.richsync.get") {
            const lyrics = context.lyrics.list as RichsyncLyric[];
            return (
                <>
                    {lyrics.map((lyric, i) => {
                        return (
                            <Lyric
                                key={i}
                                time={lyric.start * 1000}
                                end={lyric.end * 1000}
                                lyric={lyric}
                            />
                        );
                    })}
                </>
            );
        }

        if (context?.lyrics?.type == "track.subtitles.get") {
            const lyrics = context.lyrics.list as SubtitleLyric[];
            return (
                <>
                    {lyrics.map((lyric, i) => {
                        return (
                            <Lyric
                                key={i}
                                time={lyric.time.total * 1000}
                                end={lyrics[i + 1]?.time.total * 1000}
                                lyric={lyric}
                            />
                        );
                    })}
                </>
            );
        }
    }

    return (
        <div className="card card-body">
            <h6>Lyric Seeker</h6>
            <input
                onInput={(e) => seek(e.currentTarget.valueAsNumber)}
                type="range"
                value={progress ?? 0}
                min={0}
                max={context?.track?.duration}
            />
            <div className={styles.lyrics}>{Lyrics()}</div>
        </div>
    );
}

import { useLyric } from "@/lib/LyricContext";
import styles from "@/styles/LyricList.module.css";
import { useEffect } from "react";
import LyricCountdown from "./LyricCountdown";
import { RichsyncLyric } from "../../../server/src/inc/lyrics";

export default function LyricList() {
    const { context, index, timeToNext, word } = useLyric();

    useEffect(() => {
        const lyric = document.querySelector(`.${styles.current}`);
        if (lyric) {
            lyric.scrollIntoView({
                behavior: index == 0 ? "instant" : "smooth",
                block: "center",
                inline: "center",
            });
        }
    }, [index]);

    if (!context?.lyrics) {
        return <></>;
    }

    function RichSync() {
        const current = context?.lyrics?.list[index!];

        if (context?.lyrics?.type == "track.subtitles.get") {
            return current?.text ? current?.text : "...";
        }

        const richsync = current as RichsyncLyric;
        if (!current) return "...";
        return richsync.lyric.map((segment, i) => {
            if (word && i <= word) {
                const length =
                    (richsync.lyric[i + 1]
                        ? richsync.lyric[i + 1].offset
                        : richsync.end - richsync.start) - segment.offset;
                return (
                    <span
                        style={{["--timing" as any]: length + "s"}}
                        className={`${styles.word} ${styles.activeWord}`}
                    >
                        {segment.text}
                    </span>
                );
            }

            return <span className={styles.word}>{segment.text}</span>;
        });
    }

    return (
        <div className={styles.lyrics}>
            {context.lyrics.list.map((lyric, i) => {
                const current = i == index;
                const next = i - 1 == index;
                const previous = i + 1 == index;
                return (
                    <>
                        <div
                            className={`${styles.lyric} 
                            ${current ? styles.current : ""}
                            ${next ? styles.next : ""}
                            ${previous ? styles.previous : ""}
                            `}
                        >
                            {current && RichSync()}
                            {next && <LyricCountdown countdown={timeToNext!} />}
                            {!current && (lyric.text ? lyric.text : "...")}
                        </div>
                    </>
                );
            })}
        </div>
    );
}

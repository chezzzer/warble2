import { useLyric } from "@/lib/LyricContext";
import styles from "@/styles/Lyrics.module.css";
import LyricError from "./LyricError";
import LyricCountdown from "./LyricCountdown";
import { formatSeconds } from "@/lib/common";
import Track from "../Track";
import { useEffect } from "react";
import { useAnimate } from "framer-motion";
import LyricList from "./LyricList";

export default function LyricLayout() {
    const { error, index, timeToNext, context, progress, word } = useLyric();

    if (error) {
        return <LyricError error={error} />;
    }

    if (index! < 0) {
        return <LyricError error="Waiting for lyrics..." />;
    }

    return (
        <>
            <main>
                <div className={styles.progress}>
                    <div
                        className={styles.progressBar}
                        style={{
                            ["--value" as any]:
                                (progress! / context?.track?.duration!) * 100 +
                                "%",
                        }}
                    ></div>
                </div>

                <div className={styles.track}>
                    {context?.track && (
                        <Track track={context?.track} progress={progress!} />
                    )}
                </div>

                <div className={styles.copyright}>
                    {context?.lyrics?.copyright && (
                        <>{context.lyrics.copyright}</>
                    )}
                </div>

                <div
                    className={styles.lyrics}
                    style={{
                        ["--image" as any]: `url("${context?.track?.album?.images[0].url}")`,
                    }}
                >
                    {/* <div>
                        <h4 className={styles.previous}>
                            <LyricSubLine lyric={previous} />
                        </h4>
                        <h1 className={styles.current}>
                            <LyricMainLine />
                        </h1>
                        <div className="d-flex gap-3 align-items-center justify-content-center">
                            <h3 className={styles.next}>
                                <LyricSubLine lyric={next} />
                            </h3>
                            {timeToNext && (
                                <LyricCountdown countdown={timeToNext} />
                            )}
                        </div>
                    </div> */}
                    <LyricList />
                </div>
            </main>
        </>
    );
}

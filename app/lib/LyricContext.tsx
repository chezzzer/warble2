import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type { WarbleContext } from "../../server/src/inc/context";
import type { PropsWithChildren } from "react";
import { config } from "./config";
import { RichsyncLyric, SubtitleLyric } from "../../server/src/inc/lyrics";
import { useClient } from "./ClientContext";

function useProviderValue() {
    const [context, setContext] = useState<WarbleContext | null>(null);

    const [progress, setProgress] = useState<number>();
    const [error, setError] = useState<string>();

    const [index, setIndex] = useState<number>();

    const [word, setWord] = useState<number>();

    const { socket } = useClient();

    useEffect(() => {
        if (!context) {
            setError("Connecting...");
            return;
        }

        if (!context.track) {
            setError("Waiting for a track...");
            return;
        }

        if (!context.lyrics) {
            setError("No Lyrics for this one ☹️.");
            return;
        }

        if (context.lyrics.error) {
            setError(context.lyrics.error.description);
            return;
        }

        setError(undefined);
    }, [context]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!context?.playing) {
                return;
            }
            if (progress) {
                setProgress(progress + 50);
            }
        }, 50);

        return () => {
            clearInterval(interval);
        };
    }, [progress]);

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "context") {
                setContext(data.data as unknown as WarbleContext);
                setProgress(data.data.progress);
            }

            if (data.type == "progress") {
                setProgress(data.data);
            }

            if (data.type == "trackChange") {
                setIndex(undefined);
                setWord(undefined);
                setProgress(0);
            }

            if (data.type == "lyricChange") {
                if (data.data.error) return;

                setIndex(undefined);
                setWord(undefined);
            }
        });
    }, [socket]);

    let timeToNext = calculateTimeToNext();
    function calculateTimeToNext(): number | undefined {
        const next = context?.lyrics?.list[index! + 1];

        if (context?.lyrics?.type == "track.richsync.get") {
            if (!index || !progress) return;

            const nextRichsync = next as RichsyncLyric;
            if (!nextRichsync) return;

            const seconds = progress / 1000;

            return nextRichsync.start - seconds;
        }

        if (context?.lyrics?.type == "track.subtitles.get") {
            if (!index || !progress) return;

            const nextSubtitle = next as SubtitleLyric;
            if (!nextSubtitle) return;

            const seconds = progress / 1000;

            return (nextSubtitle?.time?.total! ?? 0) - seconds;
        }
    }

    useEffect(() => {
        if (!progress) return;

        let seconds = progress / 1000;
        let current = -1;
        let list = [] as RichsyncLyric[] | SubtitleLyric[];

        if (context?.lyrics?.type == "track.richsync.get") {
            list = context?.lyrics?.list as RichsyncLyric[];
            current = list.findIndex(
                (segment) => seconds >= segment.start && seconds <= segment.end
            );

            const first = list[0];
                const last = list[list.length - 1];
            const isIntro = list.find(
                (segment) => seconds < first.start
            );

            const isOutro = list.find(
                (segment) => seconds > last.start
            );
            if (current < 0) {
                if (isIntro) {
                    current = 0;
                }

                if (isOutro) {
                    current = list.length - 1;
                }

                if (!isIntro && !isOutro) {
                    return;
                }
            }

            const now = list[current];
            const nextLyric = list[current + 1];
            setIndex(current);

            const wordIndex = now.lyric.findIndex((segment, i) => {
                const next = now.lyric[i + 1];
                const end = next ? now.start + next?.offset : nextLyric?.start ?? now.end;
                return seconds >= now.start + segment.offset && seconds <= end;
            });

            setWord(wordIndex);
        }

        if (context?.lyrics?.type == "track.subtitles.get") {
            list = context?.lyrics?.list as SubtitleLyric[];
            current = list.findIndex((lyric, i) => {
                const next = list[i + 1] as SubtitleLyric;
                return (
                    seconds >= lyric.time.total && seconds <= next?.time.total
                );
            });

            if (current < 0) {
                const first = list[0];
                const last = list[list.length - 1];
                const isIntro = list.find(
                    (segment) => seconds < first.time.total
                );

                const isOutro = list.find(
                    (segment) => seconds > last.time.total
                );

                if (isIntro) {
                    current = 0;
                }

                if (isOutro) {
                    current = list.length - 1;
                }

                if (!isIntro && !isOutro) {
                    return;
                }
            }

            setIndex(current);
            setWord(undefined);
        }
    }, [progress, context]);

    return {
        socket,
        context,
        progress,
        word,
        timeToNext,
        index,
        error,
    };
}

export type Context = ReturnType<typeof useProviderValue>;

const LyricContext = createContext<Context | undefined>(undefined);
LyricContext.displayName = "LyricProvider";

export const LyricProvider = (props: PropsWithChildren) => {
    const value = useProviderValue();
    return <LyricContext.Provider value={value} {...props} />;
};

export function useLyric() {
    const context = useContext(LyricContext);
    if (context === undefined) {
        throw new Error(`useLyric must be used within a LyricContext`);
    }
    return context;
}

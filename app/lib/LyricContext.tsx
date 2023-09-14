import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ContextData } from "../../server/src/inc/spotify";

import type { PropsWithChildren } from "react";
import { config } from "./config";
import { Lyric } from "../../server/src/inc/lyrics";

function useProviderValue() {
    const socket = useMemo(
        () =>
            typeof window != "undefined"
                ? new WebSocket(`ws://${config.server_host}/socket`)
                : null,
        []
    );

    const [context, setContext] = useState<ContextData | null>(null);
    const [previous, setPrevious] = useState<Lyric>();
    const [current, setCurrent] = useState<Lyric>();
    const [next, setNext] = useState<Lyric>();

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "context") {
                setContext(data.context as unknown as ContextData);
            }
        });

        socket.addEventListener("close", () => {
            console.log("close");
        });

        socket.addEventListener("error", (error) => {
            console.log("error", error);
        });

        return () => {
            socket.close();
        };
    }, [socket]);

    useEffect(() => {
        const interval = setInterval(() => {
            const progress = context?.progress! / 1000;

            if (context?.lyrics) {
                context.lyrics.forEach((lyric, i) => {
                    if (!context.lyrics) return;
                    if (lyric.start <= progress && lyric.end >= progress) {
                        setPrevious(context.lyrics[i - 1]);
                        setCurrent(lyric);
                        setNext(context.lyrics[i + 1]);
                    }
                });
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [context]);

    // const currentWord = currentLyric?.body.find(word => {
    //     console.log(word.offset)
    //     return progress >= currentLyric.start+word.offset;
    // })

    // console.log(currentWord?.text);

    return {
        socket,
        context,
        current,
        previous,
        next
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

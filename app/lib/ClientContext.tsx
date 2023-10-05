import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { WarbleContext, WarbleTrack } from "../../server/src/inc/context";
import type { PropsWithChildren } from "react";
import { config } from "./config";

function useProviderValue() {
    const [reconnect, setReconnect] = useState(0);
    
    let socket = useMemo(
        () =>
            typeof window != "undefined"
                ? new WebSocket(`ws://${config.server_host}/socket`)
                : null,
        [reconnect]
    );

    const [context, setContext] = useState<WarbleContext | null>(null);

    const [queue, setQueue] = useState<WarbleTrack[]>([]);
    const [progress, setProgress] = useState<number>();

    useEffect(() => {
        console.log(queue);
    }, [queue])

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "context") {
                setContext(data.data as unknown as WarbleContext);
                setProgress(data.data.progress);
                setQueue(data.data.queue);
            }

            if (data.type == "progress") {
                setProgress(data.data);
            }

            if (data.type == "queue") {
                setQueue(data.data);
            }
        });

        socket.addEventListener("close", () => {
            setProgress(undefined);
            setContext(null);
            setTimeout(() => {
                setReconnect(reconnect + 1);
            }, 1000)
        });

        socket.addEventListener("error", (error) => {
            console.log("error", error);
        });

        return () => {
            socket?.close();
        };
    }, [socket]);

    const sendAction = (action: string, data?: any) => {
        if (!socket) return;

        socket.send(JSON.stringify({ action, data }));
    }

    return {
        socket,
        context,
        progress,
        queue,
        sendAction
    };
}

export type Context = ReturnType<typeof useProviderValue>;

const ClientContext = createContext<Context | undefined>(undefined);
ClientContext.displayName = "ClientProvider";

export const ClientProvider = (props: PropsWithChildren) => {
    const value = useProviderValue();
    return <ClientContext.Provider value={value} {...props} />;
};

export function useClient() {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error(`useClient must be used within a ClientContext`);
    }
    return context;
}

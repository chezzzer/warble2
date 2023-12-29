import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { WarbleStatus, Playlists } from "../../server/src/inc/socket";
import type { PropsWithChildren } from "react";
import { config } from "./config";
import { toast } from "react-toastify";

function useProviderValue() {
    const [password, setPassword] = useState<string>();
    const [authenticated, setAuthenticated] = useState<boolean>();
    const [reconnect, setReconnect] = useState(0);
    const [stats, setStats] = useState<WarbleStatus>();
    const [playlists, setPlaylists] = useState<Playlists>();

    const socket = useMemo(
        () =>
            typeof window != "undefined"
                ? new WebSocket(`ws://${config.server_host}/admin/socket`, reconnect.toString())
                : null,
        [reconnect]
    );

    useEffect(() => {
        if (!socket) return;
        if (!password) return;

        socket.send(JSON.stringify({ action: "auth", data: password }));
    }, [socket, password]);

    useEffect(() => {
        if (!socket) return;

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.type == "error") {
                toast.error(data.data);
            }

            if (data.type == "success") {
                toast.success("Logged in successfully");
                setAuthenticated(true);
            }

            if (data.type == "stats") {
                setStats(data.data);
            }

            if (data.type == "playlists") {
                setPlaylists(data.data);
            }
        });

        socket.addEventListener("close", () => {
            setPassword(undefined);
            setAuthenticated(false);
            setTimeout(() => {
                setReconnect(reconnect + 1);
            }, 1000);
        });

        socket.addEventListener("error", (error) => {
            console.log("error", error);
        });

        return () => {
            socket.close();
        };
    }, [socket]);

    const sendAction = (action: string, data?: any) => {
        if (!socket) return;

        socket.send(JSON.stringify({ action, data }));
    };

    return {
        sendAction,
        setPassword,
        stats,
        playlists,
        authenticated,
    };
}

export type Context = ReturnType<typeof useProviderValue>;

const AdminContext = createContext<Context | undefined>(undefined);
AdminContext.displayName = "AdminProvider";

export const AdminProvider = (props: PropsWithChildren) => {
    const value = useProviderValue();
    return <AdminContext.Provider value={value} {...props} />;
};

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error(`useAdmin must be used within a AdminContext`);
    }
    return context;
}

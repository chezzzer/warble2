import { Playlist, Track } from "spotify-api.js";
import { ClientError } from "./ClientError.js";
import { app } from "./app.js";
import { context } from "./context.js";
import { events } from "./events.js";
import { client } from "./spotify.js";
import pidusage, { Status } from "pidusage";
import { CONFIG } from "./config.js";

export type WarbleStatus = Status;
export type Playlists = {
    popular_playlist: Playlist;
    top_playlist: Playlist;
}

app.ws("/socket", (ws, req) => {
    const listeners: any[] = [];

    function send(type: string, json: any) {
        ws.send(JSON.stringify({ type, data: json }));
    }

    function sendContext() {
        send("context", context);
    }

    function sendProgress(progress: number) {
        send("progress", progress);
    }

    function sendClientError(error: ClientError) {
        send("clientError", error);
    }

    function sendTrackChange() {
        send("trackChange", undefined);
    }

    function sendLyricChange() {
        send("lyricChange", context.lyrics);
    }

    function sendQueue(queue: Track[]) {
        send("queue", queue);
    }

    sendContext();

    events.on("clientError", sendClientError);
    listeners.push(["clientError", sendClientError]);

    events.on("lyricChange", sendContext);
    listeners.push(["lyricChange", sendContext]);

    events.on("lyricChange", sendLyricChange);
    listeners.push(["lyricChange", sendLyricChange]);

    events.on("trackChange", sendTrackChange);
    listeners.push(["trackChange", sendTrackChange]);

    events.on("play", sendContext);
    listeners.push(["play", sendContext]);

    events.on("pause", sendContext);
    listeners.push(["pause", sendContext]);

    events.on("login", sendContext);
    listeners.push(["login", sendContext]);

    events.on("progress", sendProgress);
    listeners.push(["progress", sendProgress]);

    events.on("queue", sendQueue);
    listeners.push(["queue", sendQueue]);

    ws.on("message", (msg) => {
        let data: any;
        try {
            data = JSON.parse(msg.toString());
        } catch (_) {
            send("error", "Invalid JSON");
            return;
        }

        if (!data) {
            send("error", "No action specified");
            return;
        }

        if (data.action == "setVolume") {
            if (!client) return;
            if (isNaN(data.data)) return;
            client.user.player.setVolume(data.data);
            context.volume = data.data;
        }

        if (data.action == "seek") {
            if (!client) return;
            if (isNaN(data.data)) return;
            client.user.player.seek(data.data);
        }

        if (data.action == "restart") {
            if (!client) return;

            client.user.player.seek(0);
        }

        if (data.action == "previous") {
            if (!client) return;

            client.user.player.previous();
        }

        if (data.action == "next") {
            if (!client) return;

            client.user.player.skip();
        }

        if (data.action == "play") {
            if (!client) return;

            client.user.player.play();
        }

        if (data.action == "pause") {
            if (!client) return;

            client.user.player.pause();
        }
    });

    ws.on("close", () => {
        listeners.forEach((listener) => {
            events.removeListener(listener[0], listener[1]);
        });
    });
});

app.ws("/admin/socket", (ws, req) => {
    let authenticated = false;

    function send(type: string, json: any) {
        ws.send(JSON.stringify({ type, data: json }));
    }

    async function sendStats() {
        const stats = await pidusage(process.pid);

        send("stats", stats);
    }

    async function sendPlaylists() {
        if (!client) return;

        const popular_playlist = await client.playlists.get(CONFIG.popular_playlist)
        const top_playlist = await client.playlists.get(CONFIG.top_playlist)

        send("playlists", {
            popular_playlist,
            top_playlist,
        });
    }

    ws.on("message", (msg) => {
        let data: any;
        try {
            data = JSON.parse(msg.toString());
        } catch (_) {
            send("error", "Invalid JSON");
            return;
        }

        if (!data) {
            send("error", "No action specified");
            return;
        }

        if (data.action == "auth") {
            if (data.data !== process.env.APP_PASSWORD) {
                send("error", "Invalid password");
                return;
            }

            authenticated = true;
            send("success", undefined);

            sendStats();
            sendPlaylists();
            setInterval(sendStats, 1000);
        }

        if (!authenticated) {
            send("error", "Not authenticated");
            return;
        }

        if (data.action == "restart") {
            process.exit();
        }

        if (data.action == "sync") {
            context.sync += data.data;
        }
    });
});

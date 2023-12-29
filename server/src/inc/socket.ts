import { Playlist, Track } from "spotify-api.js";
import { ClientError } from "./ClientError.js";
import { app } from "./app.js";
import { context } from "./context.js";
import { events, sendClientError } from "./events.js";
import { client } from "./spotify.js";
import pidusage, { Status } from "pidusage";
import { CONFIG } from "./config.js";
import { fetchLyricsFromISRC, getLyricsFromISRC } from "./lyrics.js";

export type WarbleStatus = Status;
export type Playlists = {
    best_playlist: Playlist;
    top_playlist: Playlist;
};

type WarbleMessage = {
    action: string;
    data: any;
};

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

    async function sendGenres() {
        if (!client) return;

        const genres = await client.browse.getRecommendationGenreSeeds();

        send("genres", genres.genres);
    }

    function sendDisplay(display: boolean) {
        send("display", display);
    }

    sendContext();
    sendGenres();

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

    events.on("login", sendGenres);
    listeners.push(["login", sendGenres]);

    events.on("progress", sendProgress);
    listeners.push(["progress", sendProgress]);

    events.on("queue", sendQueue);
    listeners.push(["queue", sendQueue]);

    events.on("display", sendDisplay);
    listeners.push(["display", sendDisplay]);

    ws.on("message", (msg: any) => {
        let data: WarbleMessage;
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

        if (data.action == "setQueue") {
            context.queue = data.data;
            events.emit("queue", context.queue);
        }
    });

    ws.on("close", () => {
        listeners.forEach((listener) => {
            events.removeListener(listener[0], listener[1]);
        });
    });
});

app.ws("/admin/socket", (ws, req) => {
    const listeners: any[] = [];

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

        const best_playlist = await client.playlists.get(CONFIG.best_playlist);
        const top_playlist = await client.playlists.get(CONFIG.top_playlist);

        send("playlists", {
            best_playlist,
            top_playlist,
        });
    }

    ws.on("close", () => {
        listeners.forEach((listener) => {
            events.removeListener(listener[0], listener[1]);
        });
    });

    function sendClientError(error: ClientError) {
        send("clientError", error);
    }

    events.on("clientError", sendClientError);
    listeners.push(["clientError", sendClientError]);

    ws.on("message", async (msg: any) => {
        let data: WarbleMessage;
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

        if (data.action == "display") {
            context.display = data.data;
            events.emit("display", data.data);
        }

        if (data.action == "setLyricType") {
            const isrc = context.track?.externalID?.isrc;

            if (!isrc) {
                sendClientError(
                    new ClientError(
                        "WARBLE_NOISRC",
                        "This track does not have an ISRC attached to it, meaning we cannot retrieve the lyrics."
                    )
                );
                return;
            }

            if (
                data.data !== "track.subtitles.get" &&
                data.data !== "track.richsync.get"
            ) {
                sendClientError(
                    new ClientError(
                        "WARBLE_INVALIDTYPE",
                        "This is not a valid lyric type."
                    )
                );
                return;
            }

            try {
                context.lyrics = await fetchLyricsFromISRC(isrc, data.data);
            } catch (e: any) {
                sendClientError(e);
                context.lyrics = null;
            }

            events.emit("lyricChange", context.lyrics);
        }
    });
});

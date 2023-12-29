import { Client, PlaylistTrack, Track } from "spotify-api.js";
import { events, sendClientError } from "./events.js";
import { app } from "./app.js";
import { randomBytes } from "crypto";
import { stringify } from "querystring";
import { context } from "./context.js";
import { getLyricsFromISRC } from "./lyrics.js";
import { ClientError } from "./ClientError.js";
import { CONFIG } from "./config.js";

export type QueueTrack = {
    uri: string;
    isrc: string;
    name: string;
    artists: string;
    image: string;
};

const POLL_INTERVAL = 1000; // every 1 second
let interval: NodeJS.Timeout;

export let client: Client | null = null;

export const setClient = (newClient: Client) => {
    client = newClient;
};

export async function startTracking() {
    if (interval) clearInterval(interval);
    interval = setInterval(trackPlayback, POLL_INTERVAL);
    await trackPlayback();
}

export async function stopTracking() {
    clearInterval(interval);
}

export async function trackPlayback() {
    try {
        if (!client) return events.emit("clientError", "No client");
        const playback = await client.user.player.getCurrentPlayback();

        if (!playback || !playback.item || !playback.isPlaying) {
            if (context.playing === true) {
                context.playing = false;
                events.emit("pause");
            }
            return;
        }

        if (!context.playing) {
            context.playing = true;
            events.emit("play");
        }

        context.progress = playback.progress + context.sync;
        events.emit("progress", context.progress);
        if (playback.device.volumePercent) {
            context.volume = playback.device.volumePercent;
        }

        if (playback.item.id !== context.track?.id) {
            events.emit("trackChange", playback.item);
            context.track = playback.item as Track;
            context.sync = 0;

            if (
                context.queue.length &&
                context.queue[0].id == playback.item.id
            ) {
                context.queue.shift();
            }
        }
    } catch (e: any) {
        console.error("Error while tracking playback", e);
    }
}

events.on("trackChange", async (track: Track) => {
    const isrc = track.externalID?.isrc;

    if (!isrc) {
        sendClientError(
            new ClientError(
                "WARBLE_NOISRC",
                "This track does not have an ISRC attached to it, meaning we cannot retrieve the lyrics."
            )
        );
        return;
    }

    try {
        context.lyrics = await getLyricsFromISRC(isrc);
    } catch (e: any) {
        context.lyrics = { error: e };
        sendClientError(e);
    }

    events.emit("lyricChange", context.lyrics);
});

app.get("/callback", async (req, res) => {
    try {
        const code = req.query.code as string | null;

        if (!code) {
            res.status(400).json({ error: "No code provided" });
            return;
        }

        const clientID = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectURL = process.env.SPOTIFY_REDIRECT_URI;

        if (!clientID || !clientSecret || !redirectURL) {
            res.status(500).json({
                error: "Please fill in all .env variables.",
            });
            return;
        }

        const client = await Client.create({
            refreshToken: true,

            token: { clientID, clientSecret, code, redirectURL },

            cacheSettings: {
                tracks: true,
            },

            onRefresh() {
                console.log(
                    `Token has been refreshed. New token: ${client.token}!`
                );
            },
        });

        setClient(client);
        startTracking().then(() => {
            events.emit("login");
        });

        setInterval(async () => {
            await client.refreshFromMeta();
        }, 3000 * 1000);

        res.redirect(process.env.APP_URL!);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
        return;
    }
});

app.get("/login", async (req, res) => {
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            stringify({
                response_type: "code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: "user-read-playback-state user-read-private user-read-email user-read-currently-playing user-modify-playback-state user-read-recently-played",
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                state: randomBytes(16).toString("hex"),
            })
    );
});

export function convertTracks(tracks: Track[]): QueueTrack[] {
    const filteredTracks = tracks.filter((track) => {
        if (CONFIG.explicit) return true;

        return track.explicit === false;
    });

    const trimmedTracks = filteredTracks.map((track) => {
        const isrc = track.externalID?.isrc;

        return {
            uri: track.uri,
            isrc: isrc!,
            name: track.name,
            artists: track.artists.map((a) => a.name).join(", "),
            image: track.album?.images[2].url ?? "",
        };
    });

    return trimmedTracks;
}

app.post("/queue", async (req, res) => {
    if (!client) return res.status(500).json({ error: "No client" });

    const uri = req.body.uri as string | null;
    const isrc = req.body.isrc as string | null;

    if (!uri) {
        return res.status(400).json({ error: "No uri provided" });
    }

    if (!isrc) {
        return res.status(400).json({ error: "No isrc provided" });
    }

    try {
        await getLyricsFromISRC(isrc);
    } catch (_) {
        return res
            .status(400)
            .json({ error: "This song is not in our catalogue." });
    }

    const track = await client.tracks.get(uri.split(":")[2]);

    context.queue.push(track as Track);

    events.emit("queue", context.queue);

    try {
        await client.user.player.addItem(uri);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/search", async (req, res) => {
    if (!client) return res.status(500).json({ error: "No client" });

    const query = req.body.query as string | null;

    if (!query) {
        return res.status(400).json({ error: "No query provided" });
    }

    try {
        const results = await client.search(query, { types: ["track"] });

        if (!results.tracks)
            return res.status(404).json({ error: "No tracks" });

        res.json(convertTracks(results.tracks));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/tracks/best", async (req, res) => {
    if (!client) return res.status(500).json({ error: "No client" });

    if (!CONFIG.best_playlist) {
        return res.status(500).json({ error: "No popular playlist" });
    }

    const tracks = await client.playlists.getTracks(CONFIG.best_playlist);

    const items = tracks.map((item) => item.track as Track);

    if (!items) {
        return res.json([]);
    }

    res.json(convertTracks(items));
});

app.get("/tracks/recommended", async (req, res) => {
    if (!client) return res.status(500).json({ error: "No client" });

    const genres = req.query.genres
        ? req.query.genres
        : CONFIG.recommendation_genres.join(",");

    const tracks = await client.browse.getRecommendations({
        limit: 99,
        seed_genres: genres as string,
        seed_artists: "",
        seed_tracks: "",
    });

    const items = tracks?.tracks.map((item) => item as Track);

    if (!items) {
        return res.json({
            genres,
            tracks: [],
        });
    }

    res.json({
        genres,
        tracks: convertTracks(items),
    });
});

app.get("/tracks/history", async (req, res) => {
    if (!client) return res.status(500).json({ error: "No client" });

    const tracks = await client.user.player.getRecentlyPlayed();

    const items = tracks.items.map((item) => item.track as Track);

    res.json(convertTracks(items));
});

app.get("/tracks/top", async (req, res) => {
    if (!client) return res.status(500).json({ error: "No client" });

    if (!CONFIG.top_playlist) {
        return res.status(500).json({ error: "No top playlist" });
    }

    const tracks = await client.playlists.getTracks(CONFIG.top_playlist);

    const items = tracks.map((item) => item.track as Track);

    if (!items) {
        return res.json([]);
    }

    res.json(convertTracks(items));
});

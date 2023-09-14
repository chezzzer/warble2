import { Client } from "spotify-api.js";
import { SimplifiedTrack } from "spotify-types";
import { Lyric, LyricResponse, get } from "./lyrics.js";
import { events } from "./events.js";

export type ContextData = {
    is_playing: boolean;
    item?: SimplifiedTrack;
    progress?: number;
    lyrics?: Lyric[] | null;
};

let interval: NodeJS.Timeout;

export let client: Client | null = null;

export let context: ContextData = { is_playing: false };

export const setClient = (newClient: Client) => {
    client = newClient;
};

export async function startTracking() {
    if (interval) clearInterval(interval);
    interval = setInterval(trackPlayback, 1000);
}

export async function stopTracking() {
    clearInterval(interval);
}

export async function trackPlayback() {
    if (!client) return events.emit("clientError", "No client");
    const playback = await client.user.player.getCurrentPlayback();

    if (!playback) {
        context = {
            is_playing: false,
        };

        return;
    }

    const track = playback.item as unknown as SimplifiedTrack & {
        externalID?: { isrc?: string };
    };
    const isrc = track.externalID?.isrc;

    if (!isrc) return events.emit("clientError", "Track not supported");

    let lyrics: LyricResponse | undefined;

    try {
        lyrics = await get(isrc);
    } catch (e) {
        console.error(e);
    }


    context = {
        is_playing: false,
        item: track,
        progress: playback.progress,
        lyrics: lyrics?.richsync_body ?? null,
    };

    events.emit("context", context);
}

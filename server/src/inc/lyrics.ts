import "dotenv/config";
import { WarbleLyrics } from "./context";
import { ClientError } from "./ClientError.js";

const BASE_URL = "https://curators.musixmatch.com/ws/1.1";

const tokens = process.env.MUSIXMATCH_USERTOKENS?.split(",") ?? [];

const cache = new Map<string, WarbleLyrics>();

export type RichsyncLyric = {
    start: number;
    end: number;
    lyric: RichsyncLyricBody[];
    text: string;
};

export interface RichsyncLyricBody {
    text: string;
    offset: number;
}

export type SubtitleLyric = {
    text: string;
    time: {
        total: number;
        minutes: number;
        seconds: number;
        hundredths: number;
    };
};

export type LyricType = "track.subtitles.get" | "track.richsync.get";

export function getRandomToken() {
    return tokens[Math.floor(Math.random() * tokens.length)];
}

export async function getLyricsFromISRC(isrc: string): Promise<WarbleLyrics> {
    if (cache.has(isrc)) {
        return cache.get(isrc)!;
    }

    let lyrics: WarbleLyrics | null = null;

    try {
        lyrics = await fetchLyricsFromISRC(isrc, "track.richsync.get");
    } catch (e: any) {
        console.warn("Warning, no richsync lyrics found, trying subtitles.", e);
        try {
            lyrics = await fetchLyricsFromISRC(isrc, "track.subtitles.get");
        } catch (e: any) {
            console.log(e);
            throw e;
        }
    }

    return lyrics;
}

export async function fetchLyricsFromISRC(
    isrc: string,
    type: LyricType
): Promise<WarbleLyrics> {
    const token = getRandomToken();

    if (!token) {
        throw new ClientError(
            "WARBLE_NOTOKEN",
            "Please add a musixmatch token to environment."
        );
    }

    const params = buildSearchParams(isrc, token);
    const url = `${BASE_URL}/${type}?${params.toString()}`;

    const res = await fetch(url, {
        headers: {
            Cookie: "x-mxm-user-id=",
        },
    });

    const json = await res.json();

    if (!json.message.body || (!json.message.body.subtitle_list && !json.message.body.richsync)) {
        throw new ClientError(
            "WARBLE_NOTFOUND",
            "No lyrics found for this track."
        );
    }

    if (json.message.header.status_code != 200) {
        throw new ClientError(
            "WARBLE_NOTFOUND",
            "No lyrics found for this track."
        );
    }

    if (type == "track.richsync.get") {
        const richsync = json.message.body.richsync;

        if (richsync.restricted) {
            throw new ClientError(
                "WARBLE_RESTRICTED",
                "Lyrics are restricted for this track."
            );
        }

        if (!richsync.richsync_body) {
            throw new ClientError(
                "WARBLE_NOTFOUND",
                "No lyrics found for this track."
            );
        }

        let body = JSON.parse(richsync.richsync_body);

        body = body.map((lyric: any) => ({
            start: lyric.ts,
            end: lyric.te,
            lyric: lyric.l.map((l: any) => ({ text: l.c, offset: l.o })),
            text: lyric.x,
        }));

        const lyric = {
            list: body,
            copyright: richsync.lyrics_copyright,
            type,
        };

        cache.set(isrc, lyric);

        return lyric;
    }

    if (type == "track.subtitles.get") {
        const subtitle = json.message.body.subtitle_list[0].subtitle;

        if (subtitle.restricted) {
            throw new ClientError(
                "WARBLE_RESTRICTED",
                "Lyrics are restricted for this track."
            );
        }

        if (!subtitle.subtitle_body) {
            throw new ClientError(
                "WARBLE_NOTFOUND",
                "No lyrics found for this track."
            );
        }

        const body = JSON.parse(subtitle.subtitle_body);

        const lyric = {
            list: body,
            copyright: subtitle.lyrics_copyright,
            type,
        };

        cache.set(isrc, lyric);

        return lyric;
    }

    throw new ClientError("WARBLE_UNKNOWN_LYRIC_TYPE");
}

function buildSearchParams(isrc: string, token: string) {
    const params = {
        format: "json",
        track_isrc: isrc,
        tags: "nowplaying",
        user_language: "en",
        subtitle_format: "mxm",
        app_id: "web-desktop-app-v1.0",
        usertoken: token,
    };
    return new URLSearchParams(params);
}

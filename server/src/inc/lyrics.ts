import MusixMatch from "musixmatch-richsync";

const cache = new Map<string, LyricResponse | undefined>();

//@ts-ignore
const mm = new MusixMatch.default(
    process.env.MUSIXMATCH_USERTOKENS?.split(",") ?? []
);

export type Lyric = {
    start: number;
    end: number;
    body: LyricBody[];
    text: string;
};

export interface LyricBody {
    text: string;
    offset: number;
}

export type LyricResponse = {
    richsync_id: number;
    restricted: number;
    richsync_body: Lyric[];
    lyrics_copyright: string;
    richsync_length: number;
    richssync_language: string;
    richsync_language_description: string;
    richsync_avg_count: number;
    updated_time: string;
};

export async function get(isrc: string): Promise<LyricResponse | undefined> {
    if (cache.has(isrc)) return cache.get(isrc);

    let lyrics;

    try {
        lyrics = await mm.getRichsyncLyrics(isrc);
    } catch (e:any) {
        cache.set(isrc, undefined);
        throw new Error(e);
    }

    if (!lyrics) {
        cache.set(isrc, undefined);
        throw new Error("No lyrics");
    }

    cache.set(isrc, lyrics);

    console.log(cache);

    return lyrics as LyricResponse;
}

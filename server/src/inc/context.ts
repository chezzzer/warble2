import { Track } from "spotify-api.js";
import { LyricType, RichsyncLyric, SubtitleLyric } from "./lyrics";
import { ClientError } from "./ClientError";

export type WarbleTrack = Track;

export interface WarbleContext {
    playing: boolean | null;
    track: Track | null;
    progress: number | null;
    lyrics: WarbleLyrics | null;
    volume: number | null;
    queue: Track[];
    sync: number;
}

export interface WarbleLyrics {
    list: RichsyncLyric[] | SubtitleLyric[];
    type: LyricType;
    copyright: string;
    error?: ClientError
}

export let context: WarbleContext = {
    playing: null,
    track: null,
    progress: null,
    lyrics: null,
    volume: null,
    queue: [],
    sync: 0
};
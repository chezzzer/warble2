import { RecommendationQuery } from "spotify-api.js";

type Config = {
    explicit: boolean;
    best_playlist: string;
    top_playlist: string;
    recommendation_genres: string[];
}

export const CONFIG = {
    explicit: true,
    best_playlist: "37i9dQZF1DX5I05jXm1F2M",
    top_playlist: "37i9dQZEVXbMDoHDwVN2tF",
    recommendation_genres: [
        "rock",
        "blues",
        "rock-n-roll",
        "dance"
    ]
} as Config
import { RecommendationQuery } from "spotify-api.js";

type Config = {
    explicit: boolean;
    popular_playlist: string;
    top_playlist: string;
    recommendation_settings: RecommendationQuery
}

export const CONFIG = {
    explicit: true,
    popular_playlist: "37i9dQZF1DX5I05jXm1F2M",
    top_playlist: "37i9dQZEVXbMDoHDwVN2tF",
    recommendation_settings: {
        limit: 100,
        seed_artists: "3PhoLpVuITZKcymswpck5b",

    }
} as Config
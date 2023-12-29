import Head from "next/head";
import ChooserLayout from "@/components/chooser/ChooserLayout";
import { config } from "@/lib/config";

import type { QueueTrack } from "../../server/src/inc/spotify";
import QueueableTrack from "@/components/chooser/QueueableTrack";
import { ClientError } from "../../server/src/inc/ClientError";
import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { useClient } from "@/lib/ClientContext";
import { WarbleTrack } from "../../server/src/inc/context";
import { Spinner } from "react-bootstrap";

export default function RecommendedTracks() {
    const [searchGenres, setGenres] = useState<string[]>([]);
    const [tracks, setTracks] = useState<QueueTrack[]>([]);
    const [loading, setLoading] = useState(false);

    const { genres } = useClient();

    useEffect(() => {
        setLoading(true);

        fetch(
            `http://${
                config.server_host
            }/tracks/recommended?genres=${searchGenres.join(",")}`
        )
            .then((res) => res.json())
            .then((data) => {
                setTracks(data.tracks);
                setLoading(false);
            });
    }, [searchGenres]);

    const addGenre = (genre: string) => {
        if (searchGenres.includes(genre)) return;
        setGenres([...searchGenres, genre]);
    };

    const removeGenre = (genre: string) => {
        setGenres(searchGenres.filter((g) => g !== genre));
    };

    const formatGenreName = (genre: string) => {
        return genre
            .replaceAll("-", " ")
            .split(" ")
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(" ");
    }

    return (
        <>
            <Head>
                <title>WARBLE - Recommended Tracks</title>
                <meta name="description" content="Browse recommended tracks!" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="robots" content="noindex" />
                <meta name="googlebot" content="noindex" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ChooserLayout>
                <div className="container">
                    <div className="py-5 text-center">
                        <h1>Recommended Tracks</h1>
                    </div>
                    <div className="d-flex gap-3 mb-3">
                        <select
                            onChange={(e) => {
                                addGenre(
                                    e.target.options[e.target.selectedIndex]
                                        .value
                                )
                                e.target.selectedIndex = 0;
                            }
                            }
                            className="form-control-plaintext text-dark bg-white rounded px-2"
                            data-bs-theme="dark"
                            style={{ width: 150 }}
                        >
                            <option value="">Filter by Genre</option>
                            {genres &&
                                genres.map((genre) => {
                                    if (searchGenres.includes(genre)) return;
                                    return (
                                        <option className="py-3" value={genre} key={genre}>
                                            {formatGenreName(genre)}
                                        </option>
                                    );
                                })}
                        </select>
                        {searchGenres.map((genre) => (
                            <button
                                key={genre}
                                type="button"
                                className="btn btn-light rounded-pill"
                                onClick={() => removeGenre(genre)}
                            >
                                {formatGenreName(genre)} <X />
                            </button>
                        ))}
                    </div>
                    <div className="row me-2">
                        {!loading &&
                            tracks.map((track) => (
                                <div className="col-sm-4 mb-4" key={track.uri}>
                                    <QueueableTrack track={track} />
                                </div>
                            ))}
                        {loading && (
                            <h1 className="py-5 text-center">
                                <Spinner animation="grow" />
                            </h1>
                        )}
                    </div>
                </div>
            </ChooserLayout>
        </>
    );
}

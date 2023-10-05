import Head from "next/head";
import ChooserLayout from "@/components/chooser/ChooserLayout";
import { config } from "@/lib/config";

import type { QueueTrack } from "../../server/src/inc/spotify";
import QueueableTrack from "@/components/chooser/QueueableTrack";

type RecommendedTracksProps = {
    tracks: QueueTrack[];
};

export async function getStaticProps() {
    const tracks = await fetch(
        `http://${config.server_host}/tracks/recommended`
    );

    const data = await tracks.json();

    return {
        props: {
            tracks: data,
        },
        revalidate: 3600,
    };
}

export default function RecommendedTracks({ tracks }: RecommendedTracksProps) {
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
                    <div className="row me-2">
                        {tracks.map((track) => (
                            <div className="col-sm-4 mb-4" key={track.uri}>
                                <QueueableTrack track={track} />
                            </div>
                        ))}
                    </div>
                </div>
            </ChooserLayout>
        </>
    );
}
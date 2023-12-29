import Head from "next/head";
import ChooserLayout from "@/components/chooser/ChooserLayout";
import { config } from "@/lib/config";

import type { QueueTrack } from "../../server/src/inc/spotify";
import QueueableTrack from "@/components/chooser/QueueableTrack";
import { ClientError } from "../../server/src/inc/ClientError";

type TrackHistoryProps = {
    tracks: QueueTrack[];
};

export async function getStaticProps() {
    try {
        const tracks = await fetch(
            `http://${config.server_host}/tracks/history`
        );

        const data = await tracks.json();

        return {
            props: {
                tracks: data,
            },
            revalidate: 30,
        };
    } catch (_) {
        throw new Error("WARBLE: Please run the server to build this page.");
    }
}

export default function TrackHistory({ tracks }: TrackHistoryProps) {
    return (
        <>
            <Head>
                <title>WARBLE - Track History</title>
                <meta
                    name="description"
                    content="See recently played tracks."
                />
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
                        <h1>Track History</h1>
                    </div>
                    <div className="row me-2">
                        {tracks.map((track) => (
                            <div className="mb-3" key={track.uri}>
                                <QueueableTrack track={track} />
                            </div>
                        ))}
                    </div>
                </div>
            </ChooserLayout>
        </>
    );
}

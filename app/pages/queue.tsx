import Head from "next/head";
import ChooserLayout from "@/components/chooser/ChooserLayout";
import { config } from "@/lib/config";
import QueueableTrack from "@/components/chooser/QueueableTrack";
import { useClient } from "@/lib/ClientContext";
import WarbleTrack from "@/components/chooser/WarbleTrack";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export default function Queue() {
    const { queue, progress, context } = useClient();

    return (
        <>
            <Head>
                <title>WARBLE - Queue</title>
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
                        <h1>Queue</h1>
                    </div>
                    {queue.length === 0 && (
                        <div className="text-center">
                            <div className="lead">No Queued Tracks</div>
                            <Link
                                href="/recommended-tracks"
                                className="btn btn-info mt-5"
                            >
                                Browse Recommended Tracks <ArrowRight/>
                            </Link>
                        </div>
                    )}
                    {queue.map((track) => {
                        let time = (context?.track?.duration! - progress!) ?? 0;
                        for (let i = 0; i < queue.length; i++) {
                            if (queue[i].uri === track.uri) {
                                break;
                            }

                            time += queue[i].duration;
                        }

                        

                        return (
                            <div className="mb-3" key={track.uri}>
                                <WarbleTrack track={track} seconds={time/1000} />
                            </div>
                        );
                    })}
                </div>
            </ChooserLayout>
        </>
    );
}

import Head from "next/head";
import ChooserLayout from "@/components/chooser/ChooserLayout";

import styles from "@/styles/chooser/Home.module.css";
import Track from "@/components/Track";
import { useClient } from "@/lib/ClientContext";
import Link from "next/link";
import { List, ListNumbers, MicrophoneStage, MusicNote, TrendUp, Waveform } from "@phosphor-icons/react";
import HomeSearch from "@/components/chooser/HomeSearch";

export default function Home() {
    const { context, progress } = useClient();

    return (
        <>
            <Head>
                <title>WARBLE - Home</title>
                <meta
                    name="description"
                    content="Choose your next karaoke song!"
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
                <div className={`row ${styles.grid}`}>
                    <div className="col-sm-3 h-100">
                        <div className="d-flex flex-column gap-3 h-100">
                            <div>
                                {context?.track && (
                                    <div
                                        className={styles.track}
                                        style={{
                                            ["--background" as any]: `url(${context.track.album?.images[1].url})`,
                                        }}
                                    >
                                        <Track
                                            track={context?.track}
                                            progress={progress!}
                                        />
                                    </div>
                                )}
                            </div>
                            <HomeSearch />
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="row h-100">
                            <div className="col-sm-6 d-flex flex-column gap-4">
                                <Link href="/best-tracks" className="h-100">
                                    <div
                                        className={`${styles.popular} ${styles.card}`}
                                    >
                                        <MicrophoneStage
                                            className={styles.icon}
                                            size={300}
                                        />
                                        <div className={styles.content}>
                                            <h3 className="mb-0">
                                                <b>Best Karaoke Tracks</b>
                                            </h3>
                                            <div>
                                                Browse the best and biggest karaoke hits.
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href="/recommended-tracks"
                                    className="h-100"
                                >
                                    <div
                                        className={`${styles.recommended} ${styles.card}`}
                                    >
                                        <Waveform
                                            className={styles.icon}
                                            size={300}
                                        />
                                        <div className={styles.content}>
                                            <h3 className="mb-0">
                                                <b>Recommended Tracks</b>
                                            </h3>
                                            <div>
                                                Browse popular tracks and add
                                                them to the queue.
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-sm-6 d-flex flex-column gap-4">
                                <Link href="/top-tracks" className="h-100">
                                    <div
                                        className={`${styles.top} ${styles.card}`}
                                    >
                                        <TrendUp
                                            className={styles.icon}
                                            size={300}
                                        />
                                        <div className={styles.content}>
                                            <h3 className="mb-0">
                                                <b>Top Tracks</b>
                                            </h3>
                                            <div>
                                                Browse the charts for something popular.
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link
                                    href="/queue"
                                    className="h-100"
                                >
                                    <div
                                        className={`${styles.history} ${styles.card}`}
                                    >
                                        <ListNumbers
                                            className={styles.icon}
                                            size={300}
                                        />
                                        <div className={styles.content}>
                                            <h3 className="mb-0">
                                                <b>Track Queue</b>
                                            </h3>
                                            <div>
                                                See whats coming up next and when your track is going to be played.
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </ChooserLayout>
        </>
    );
}

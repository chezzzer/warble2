import { CheckCircle, CircleNotch, PlusCircle } from "@phosphor-icons/react";
import { QueueTrack } from "../../../server/src/inc/spotify";
import { useClient } from "@/lib/ClientContext";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import { toast } from "react-toastify";
import Link from "next/link";
import Track from "../Track";
import QueueTrackDisplay from "./QueueTrackDisplay";
import styles from "@/styles/chooser/QueueableTrack.module.css";

type QueueableTrackProps = {
    track: QueueTrack;
};

export default function QueueableTrack({ track }: QueueableTrackProps) {
    const [queued, setQueued] = useState(false);
    const [queueing, setQueueing] = useState(false);

    const { queue } = useClient();

    useEffect(() => {
        if (queue.map((t) => t.uri).includes(track.uri)) {
            setQueued(true);
        }
    }, [queue, track]);

    const queueTrack = async () => {
        setQueueing(true);

        const res = await fetch(`/api/queue/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uri: track.uri,
                isrc: track.isrc,
            }),
        });

        const data = await res.json();

        setQueueing(false);

        if (res.status !== 200) {
            toast.error(data.error);
            return;
        }

        toast.success(
            <>
                <Link
                    href="/queue"
                    style={{ color: "inherit", textDecoration: "none" }}
                >
                    <QueueTrackDisplay track={track} />
                </Link>
            </>,
            {
                theme: "dark",
            }
        );
        setQueued(true);
    };

    useEffect(() => {
        const e = document.querySelector(`.${styles.info}`);

        if (!e) return;

        console.log(e.scrollWidth);

        e.scrollTo({
            left: 10000000000000000000000,
            behavior: "smooth",
        });
    }, []);

    return (
        <div
            className={`card card-body pointer
            ${queued && "opacity-25 pointer-events-none"} 
            ${queueing && "opacity-75 pointer-events-none"}
            `}
            onClick={queueTrack}
        >
            <div className={styles.container}>
                <div>
                    <img
                        src={track.image}
                        width="100%"
                        style={{aspectRatio: 1/1, objectFit: "cover"}}
                        alt=""
                        className="rounded"
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>{track.name}</div>
                    <div className={styles.artist}>{track.artists}</div>
                </div>
                <div className="text-center">
                    {!queued && !queueing && (
                        <PlusCircle size={32} weight="fill" />
                    )}

                    {queueing && (
                        <CircleNotch
                            size={32}
                            weight="fill"
                            className="spinning"
                        />
                    )}

                    {queued && !queueing && (
                        <CheckCircle size={32} weight="fill" />
                    )}
                </div>
            </div>
        </div>
    );
}

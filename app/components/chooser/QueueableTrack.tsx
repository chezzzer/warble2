import { CheckCircle, CircleNotch, PlusCircle } from "@phosphor-icons/react";
import { QueueTrack } from "../../../server/src/inc/spotify";
import { useClient } from "@/lib/ClientContext";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import { toast } from "react-toastify";
import Link from "next/link";
import Track from "../Track";
import QueueTrackDisplay from "./QueueTrackDisplay";

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
    }, [queue]);

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

    return (
        <div
            className={`card card-body pointer
            ${queued && "opacity-25 pointer-events-none"} 
            ${queueing && "opacity-75 pointer-events-none"}
            `}
            onClick={queueTrack}
        >
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <img
                            src={track.image}
                            width={50}
                            alt=""
                            className="rounded"
                        />
                    </div>
                    <div>
                        <div style={{ width: 250 }} className="overflow-hidden">
                            <h5 className="mb-0 truncate text-nowrap">
                                {track.name}
                            </h5>
                        </div>
                        <div>{track.artists}</div>
                    </div>
                </div>
                <div>
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

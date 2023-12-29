import { useClient } from "@/lib/ClientContext";
import { formatSeconds } from "@/lib/common";
import { ArrowDown, ArrowUp, X } from "@phosphor-icons/react";

export default function Queue() {
    const { queue, context, progress, sendAction } = useClient();

    const removeQueue = (index: number) => {
        const check = confirm("Are you sure you want to remove this track?");
        if (!check) {
            return;
        }

        queue.splice(index, 1);

        sendAction("setQueue", queue);
    };

    const moveQueue = (index: number, direction: "up" | "down") => {
        if (direction == "up") {
            if (index == 0) {
                return;
            }

            const temp = queue[index - 1];
            queue[index - 1] = queue[index];
            queue[index] = temp;
        } else {
            if (index == queue.length - 1) {
                return;
            }

            const temp = queue[index + 1];
            queue[index + 1] = queue[index];
            queue[index] = temp;
        }

        sendAction("setQueue", queue);
    };

    return (
        <div className="card card-body">
            <h6>Queue</h6>
            <table
                className="table table-bordered table-striped table-dark table-sm table-borderless mb-0"
                style={{
                    ["--bs-table-bg" as any]: "var(--background)",
                    ["--bs-table-striped-bg" as any]: "var(--dark)",
                }}
            >
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Time</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {queue.map((track, index) => {
                        let time = context?.track?.duration! - progress! ?? 0;
                        for (let i = 0; i < queue.length; i++) {
                            if (queue[i].uri === track.uri) {
                                break;
                            }

                            time += queue[i].duration;
                        }

                        return (
                            <tr key={track.id}>
                                <td>{index + 1}</td>
                                <td>{track.name}</td>
                                <td>{track.artists[0].name}</td>
                                <td>{formatSeconds(time / 1000)}</td>
                                <td>
                                    <div className="d-flex">
                                        <div
                                            className="pointer btn text-white"
                                            onClick={() =>
                                                moveQueue(index, "up")
                                            }
                                        >
                                            <ArrowUp weight="bold" />
                                        </div>
                                        <div
                                            className="pointer btn text-white"
                                            onClick={() =>
                                                moveQueue(index, "down")
                                            }
                                        >
                                            <ArrowDown weight="bold" />
                                        </div>
                                        <div
                                            className="pointer btn btn-danger"
                                            onClick={() => removeQueue(index)}
                                        >
                                            <X weight="bold" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

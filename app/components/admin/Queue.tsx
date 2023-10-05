import { useClient } from "@/lib/ClientContext";
import { formatSeconds } from "@/lib/common";

export default function Queue() {
    const { queue, context, progress } = useClient();

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
                        <th scope="col">Time To</th>
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
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

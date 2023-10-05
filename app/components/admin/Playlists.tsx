import { useAdmin } from "@/lib/AdminContext";
import { ArrowSquareOut } from "@phosphor-icons/react";
import Link from "next/link";

export default function Playlists() {
    const { playlists } = useAdmin();

    if (!playlists) return <></>;

    return (
        <div className="card card-body">
            <h6>Playlists</h6>
            <div className="row">
                <div className="col-sm-6">
                    <h6 className="badge ps-0">TOP PLAYLIST</h6>
                    <div className="d-flex gap-3 align-items-center">
                        <div>
                            <img
                                src={playlists.popular_playlist.images[0].url}
                                width={75}
                                className="rounded"
                                alt=""
                            />
                        </div>
                        <div>
                            <h5 className="mb-0">
                                {playlists.popular_playlist.name}
                            </h5>
                            <div>
                                <Link
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    href={
                                        playlists.popular_playlist.externalURL
                                            .spotify
                                    }
                                    target="_blank"
                                >
                                    View <ArrowSquareOut />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <h6 className="badge ps-0">POPULAR PLAYLIST</h6>
                    <div className="d-flex gap-3 align-items-center">
                        <div>
                            <img
                                src={playlists.top_playlist.images[0].url}
                                width={75}
                                className="rounded"
                                alt=""
                            />
                        </div>
                        <div>
                            <h5 className="mb-0">
                                {playlists.top_playlist.name}
                            </h5>
                            <div>
                                <Link
                                    style={{
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    href={
                                        playlists.top_playlist.externalURL
                                            .spotify
                                    }
                                    target="_blank"
                                >
                                    View <ArrowSquareOut />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

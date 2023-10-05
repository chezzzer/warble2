import styles from "@/styles/chooser/HomeSearch.module.css";
import { QueueTrack } from "../../../server/src/inc/spotify";
import { useEffect, useState } from "react";
import QueueableTrack from "./QueueableTrack";
import { X } from "@phosphor-icons/react";

export default function HomeSearch() {
    const [results, setResults] = useState<QueueTrack[]>([]);

    const [query, setQuery] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            if (!query) {
                setResults([]);
                setLoading(false);
                return;
            }

            fetch(`/api/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setResults(data);
                    setLoading(false);
                });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const reset = () => {
        setQuery("");
        setResults([]);
    }

    useEffect(() => {
        const searchElement = document.querySelector(".search") as HTMLInputElement;
        searchElement.focus();
    }, [])

    return (
        <div className="d-flex flex-column overflow-auto h-100">
            <div className={styles.searchInput}>
                <input
                    type="text"
                    className={`form-control-lg search`}
                    placeholder="Add tracks to the queue here..."
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                />
                {loading && (
                    <div className={styles.status}>
                        <div className="spinner-border" />
                    </div>
                )}
                {!loading && query && (
                    <div className={styles.status} onClick={reset}>
                        <X size={30}/>
                    </div>
                )}
            </div>
            <div className={styles.tracks}>
                {!results.length && (
                    <div className="opacity-50 text-center d-flex justify-content-center align-items-center h-100">
                        <div>
                            <h4>Tracks will appear here</h4>
                            <div>Start Typing Above</div>
                        </div>
                    </div>
                )}
                {results.map((track, i) => (
                    <div className="mb-2" key={i}>
                        <QueueableTrack track={track} key={i} />
                    </div>
                ))}
            </div>
        </div>
    );
}

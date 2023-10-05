import {
    MicrophoneStage,
    House,
    TrendUp,
    Waveform,
    MusicNote,
    ListNumbers,
} from "@phosphor-icons/react";
import Link from "next/link";
import styles from "@/styles/chooser/Header.module.css";
import { useEffect, useState } from "react";

export default function Header() {
    const [time, setTime] = useState<string>();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        setTime(new Date().toLocaleTimeString("en-US"));

        interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString("en-US"));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={styles.header}>
            <h4 className={styles.logo}>
                <Link href="/">
                    <MicrophoneStage size={32} weight="duotone" /> Warble
                    Karaoke
                </Link>
            </h4>
            <header>
                <div>
                    <Link href="/">
                        <House weight="fill" /> Home
                    </Link>
                </div>
                <div>
                    <Link href="/recommended-tracks">
                        <Waveform weight="fill" /> Recommended Tracks
                    </Link>
                </div>
                <div>
                    <Link href="/best-tracks">
                        <MicrophoneStage weight="fill" /> Best Karaoke Tracks
                    </Link>
                </div>
                <div>
                    <Link href="/top-tracks">
                        <TrendUp weight="fill" /> Top Tracks
                    </Link>
                </div>
                <div>
                    <Link href="/track-history">
                        <MusicNote weight="fill" /> Track History
                    </Link>
                </div>
                <div>
                    <Link href="/queue">
                        <ListNumbers weight="fill" /> Track Queue
                    </Link>
                </div>
                <div>{time}</div>
            </header>
        </div>
    );
}

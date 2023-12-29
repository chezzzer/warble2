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
import { useRouter } from "next/router";

type HeaderItem = {
    name: string;
    icon: JSX.Element;
    link: string;
};

export default function Header() {
    const [time, setTime] = useState<string>();
    const router = useRouter();

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

    const items = [
        {
            name: "Home",
            icon: <House weight="fill" />,
            link: "/",
        },
        {
            name: "Recommended Tracks",
            icon: <Waveform weight="fill" />,
            link: "/recommended-tracks",
        },
        {
            name: "Best Karaoke Tracks",
            icon: <MicrophoneStage weight="fill" />,
            link: "/best-tracks",
        },
        {
            name: "Top Tracks",
            icon: <TrendUp weight="fill" />,
            link: "/top-tracks",
        },
        {
            name: "Track History",
            icon: <MusicNote weight="fill" />,
            link: "/track-history",
        },
        {
            name: "Track Queue",
            icon: <ListNumbers weight="fill" />,
            link: "/queue",
        },
    ] as HeaderItem[];

    return (
        <div className={styles.header}>
            <h4 className={styles.logo}>
                <Link href="/">
                    <MicrophoneStage size={32} weight="duotone" /> Warble
                    Karaoke
                </Link>
            </h4>
            <header>
                {items.map((item, i) => (
                    <div
                        className={`${styles.item} ${
                            item.link == router.pathname ? styles.active : ""
                        }`}
                        key={i}
                    >
                        <Link href={item.link} key={item.name}>
                            {item.icon} {item.name}
                        </Link>
                    </div>
                ))}
                <div>{time}</div>
            </header>
        </div>
    );
}

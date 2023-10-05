import Head from "next/head";
import styles from "@/styles/Lyrics.module.css";

import { LyricProvider } from "@/lib/LyricContext";
import LyricLayout from "@/components/lyrics/LyricLayout";

export default function Lyrics() {
    return (
        <>
            <Head>
                <title>WARBLE - Lyrics</title>
                <meta
                    name="description"
                    content="Lyrics screen to view live song lyrics."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="robots" content="noindex" />
                <meta name="googlebot" content="noindex" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LyricProvider>
                <LyricLayout />
            </LyricProvider>
        </>
    );
}

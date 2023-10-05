import styles from "@/styles/chooser/Chooser.module.css";

import Header from "./Header";
import Footer from "./Footer";
import { ClientProvider } from "@/lib/ClientContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { config } from "@/lib/config";

type ChooserLayoutProps = {
    children: React.ReactNode;
};

export default function ChooserLayout({ children }: ChooserLayoutProps) {
    const router = useRouter();

    useEffect(() => {
        if (!config.screen_timeout) return;

        let timeout: NodeJS.Timeout;

        function restart() {
            timeout = setTimeout(() => {
                if (router.pathname !== "/") {
                    router.push("/");
                }
            }, config.screen_timeout * 1000);
        }

        window.addEventListener("click", () => {
            clearTimeout(timeout);
            restart();
        });

        restart();
        return () => {
            clearTimeout(timeout);
        };
    }, [router]);

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.content}>{children}</div>
            <Footer />
        </main>
    );
}

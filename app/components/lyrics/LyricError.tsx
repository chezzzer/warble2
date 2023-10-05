type LyricErrorProps = {
    error: string;
};
import styles from "@/styles/Lyrics.module.css";

export default function LyricError({ error }: LyricErrorProps) {
    return (
        <div className={styles.lyrics}>
            <h1>{error}</h1>
        </div>
    );
}

type LyricErrorProps = {
    error: string;
};
import styles from "@/styles/Lyrics.module.css";

export default function LyricError({ error }: LyricErrorProps) {
    return <h1>{error}</h1>;
}

import styles from "@/styles/LyricCountdown.module.css"

type LyricCountdownProps = {
    countdown: number;
}

export default function LyricCountdown({countdown}:LyricCountdownProps) {
    const number = Math.ceil(countdown );
    
    if (isNaN(number)) return <></>
    if (number < 0) return <></>

    return (
        <span className={styles.lyricCountdown}>
            {number}
        </span>
    )
}
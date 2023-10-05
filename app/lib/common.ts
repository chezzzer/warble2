export function formatSeconds(seconds: number | undefined): string {
    if (!seconds) {
        return "--:--";
    }

    seconds = Math.ceil(seconds);

    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Ensure that both minutes and seconds have two digits
    const formattedHours = String(hours);
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${
        hours > 0 ? formattedHours + ":" : ""
    }${formattedMinutes}:${formattedSeconds}`;
}

// import { useLyric } from "@/lib/LyricContext";
// import { RichsyncLyric } from "../../../server/src/inc/lyrics";
// import { useState } from "react";

// import styles from "@/styles/Lyrics.module.css";

// export default function LyricMainLine() {
//     const { context, current, word } = useLyric();

//     if (!context?.lyrics) return "...";
//     if (!current) return "...";

//     if (context.lyrics.type == "track.richsync.get") {
//         const lyric = current as RichsyncLyric;
//         return lyric.lyric.map((segment, i) => {
//             const length =
//                 (lyric.lyric[i + 1]
//                     ? lyric.lyric[i + 1].offset
//                     : lyric.end - lyric.start) - segment.offset;
//             if (word && i <= word) {
//                 return (
//                     <span
//                         className={`${styles.word} ${styles.activeWord}`}
//                         style={{ ["--timing" as any]: length + "s" }}
//                     >
//                         {segment.text}
//                     </span>
//                 );
//             }

//             return (
//                 <span
//                     className={styles.word}
//                     style={{ ["--timing" as any]: length + "s" }}
//                 >
//                     {segment.text}
//                 </span>
//             );
//         });
//     }

//     if (context.lyrics.type == "track.subtitles.get") {
//         if (!current.text) return "...";
//         return current.text;
//     }
// }

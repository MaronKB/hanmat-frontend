import styles from "./Detail.module.css";
import {Review} from "./Main.tsx";
export default function Detail({review, open}: {review: Review, open: (isOpened: boolean) => void}) {
    return (
        <div className={styles.container} onClick={() => open(false)}>
            <header className={styles.header}>{review.title}</header>
        </div>
    )
}
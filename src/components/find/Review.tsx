import styles from "./Review.module.css";
import {Review} from "../reviews/Main.tsx";

export default function ModalReview({review}: {review: Review}) {
    return (
        <div className={styles.review}>
            <div className={styles.header}>
                <h3>{review.title}</h3>
                <p>{review.author}</p>
            </div>
            <p>{review.content}</p>
        </div>
    );

}
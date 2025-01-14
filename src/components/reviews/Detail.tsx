import { useState, useEffect } from "react";
import styles from "./Detail.module.css";

interface Comment {
    id: number;
    text: string;
}

export interface Review {
    id: number;
    title: string;
    content: string;
    rating: number;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
}

export default function Detail({
    review,
    closeModal,
}: {
    review: Review;
    closeModal: () => void;
}) {
    const [images, setImages] = useState<string[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");

    useEffect(() => {
        // 리뷰에서 등록된 이미지만 필터링
        const filteredImages = [review.image1, review.image2, review.image3, review.image4].filter(
            (img) => !!img && typeof img === "string" && img.trim() !== ""
        );
        setImages(filteredImages);
    }, [review]);

    const addComment = () => {
        if (!newComment.trim()) return;
        setComments([...comments, { id: comments.length + 1, text: newComment }]);
        setNewComment("");
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`${styles.star} ${
                    index < rating ? styles.starFilled : styles.starEmpty
                }`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className={styles.backdrop} onClick={closeModal}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                {/* 닫기 버튼 */}
                <button className={styles.closeButton} onClick={closeModal}>
                    ×
                </button>

                {/* 제목 및 별점 */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{review.title}</h2>
                    <div className={styles.ratingAndRecommend}>
                        <div className={styles.stars}>{renderStars(review.rating)}</div>
                        <div>이 리뷰를</div><button className={styles.recommendButton}>추천</button>
                    </div>
                </div>
                {/* 본문 및 이미지 */}
                <div className={styles.body}>
                    <div className={styles.text}>
                        <p>{review.content}</p>
                    </div>
                    <div className={styles.images}>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={`https://portfolio.mrkb.kr/hanmat/media/${image}`} // base URL 추가
                                alt={`Review image ${index + 1}`}
                                className={styles.image}
                            />
                        ))}
                    </div>
                </div>

                {/* 댓글 */}
                <div className={styles.commentsSection}>
                    <h3>댓글</h3>
                    <div className={styles.comments}>
                        {comments.map((comment) => (
                            <p key={comment.id} className={styles.comment}>
                                {comment.text}
                            </p>
                        ))}
                    </div>
                    <textarea
                        className={styles.commentInput}
                        placeholder="댓글을 입력하세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className={styles.addCommentButton} onClick={addComment}>
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
}
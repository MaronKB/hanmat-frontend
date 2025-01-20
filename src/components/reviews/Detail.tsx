import { useState, useEffect } from "react";
import styles from "./Detail.module.css";
import {Review} from "./Main.tsx";
import Modal from "../common/Modal.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

interface Comment {
    id: number;
    text: string;
}

export default function Detail({
    review,
    isOpened,
    closeModal,
}: {
    review: Review;
    isOpened: boolean;
    closeModal: () => void;
}) {
    const [images, setImages] = useState<string[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // 현재 클릭된 이미지를 저장

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
                <FontAwesomeIcon icon={faStar} />
            </span>
        ));
    };

    return (
        <Modal title={review.title} isOpened={isOpened} close={closeModal}>
            <div className={styles.header}>
                <h2 className={styles.title}>{review.title}</h2>
                <div className={styles.ratingAndRecommend}>
                    <div className={styles.stars}>{renderStars(review.rating)}</div>
                    <div>이 리뷰를</div>
                    <button className={styles.recommendButton}>추천</button>
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
                            onClick={() =>
                                setSelectedImage(`https://portfolio.mrkb.kr/hanmat/media/${image}`)
                            } // 클릭 이벤트 추가
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
           {selectedImage && (
               <div className={styles.imageModal} onClick={(e) => e.stopPropagation()}>
                   <div className={styles.imageContainer}>
                       {/* 이미지 */}
                       <img
                           src={selectedImage}
                           alt="Selected Review"
                           className={styles.largeImage}
                       />
                       {/* 닫기 버튼 */}
                       <button
                           className={styles.imageCloseButton}
                           onClick={() => setSelectedImage(null)}
                       >
                           닫기
                       </button>
                   </div>
               </div>
           )}
       </Modal>
    );
}
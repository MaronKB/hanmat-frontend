import { useState, useEffect } from "react";
import styles from "./Detail.module.css";
import { Review } from "./Main.tsx";
import Modal from "../common/Modal.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface Comment {
  id: number;
  text: string;
  likes: number;
  liked: boolean;
  regBy: string; // 댓글 작성자 정보
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
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 상태
  const [newComment, setNewComment] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 리뷰 이미지 불러오기
  useEffect(() => {
    const filteredImages = [review.image1, review.image2, review.image3, review.image4].filter(
      (img) => !!img && typeof img === "string" && img.trim() !== ""
    );
    setImages(filteredImages);
  }, [review]);

  // 댓글 데이터 서버에서 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/hanmat/api/comment/all?page=1&size=10&sort=id`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch comments.");
        }
        const result = await response.json();
        if (result.success) {
          setComments(result.data.items); // 서버의 댓글 데이터로 상태 반영
        } else {
          console.error("Error fetching comments:", result.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments(); // 컴포넌트 최초 렌더링 시 댓글 로드
  }, [review.id]);

  // 댓글 추가
 const addComment = async () => {
   if (!newComment.trim()) {
     alert("댓글 내용을 입력하세요.");
     return;
   }

   // 동적으로 로그인한 사용자 이메일 가져오기 (sessionStorage에서 불러오기)
 const regBy = sessionStorage.getItem("userEmail");
 if (!regBy || regBy.trim() === "") {
   console.log("로그인 사용자 이메일이 없습니다.");
   alert("로그인이 필요합니다.");
   return;
 }

   // 부적절한 이메일 여부 확인 (추가 검증)
   if (regBy.length > 50) {
     alert("작성자 정보는 50자를 초과할 수 없습니다.");
     return;
   }

   console.log("Request Data:", {
     postId: review.id,
     content: newComment.trim(),
     regBy,
   });

   try {
     const response = await fetch(`http://localhost:8080/hanmat/api/comment/add`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         postId: review.id, // 게시물 ID
         content: newComment.trim(), // 댓글 내용
         regBy, // 동적으로 가져온 작성자 정보
       }),
     });

     if (!response.ok) {
       throw new Error("Failed to add comment.");
     }

     const result = await response.json();

     if (result.success) {
       setComments((prevComments) => [...prevComments, result.data]); // 댓글 리스트 갱신
       setNewComment(""); // 댓글 입력 필드 초기화
     } else {
       console.error("댓글 등록 실패:", result.message);
       alert("댓글 등록 실패: " + result.message);
     }
   } catch (error) {
     console.error("Error adding comment:", error);
     alert("댓글 등록 중 오류가 발생했습니다.");
   }
 };

  // 좋아요 토글 함수
  const toggleLike = (id: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id
          ? { ...comment, likes: comment.likes + 1 } // 좋아요 숫자 증가
          : comment
      )
    );
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
            <div key={comment.id} className={styles.commentContainer}>
              <p className={styles.comment}>{comment.text}</p>
              <div className={styles.likeSection}>
                {/* 좋아요 버튼 */}
                <button
                  className={styles.likeButton}
                  onClick={() => toggleLike(comment.id)}
                >
                  ❤️
                </button>
                {/* 좋아요 숫자 */}
                <span className={styles.likeCount}>{comment.likes}</span>
              </div>
              <div className={styles.commentAuthor}>
                작성자: {comment.regBy} {/* 댓글 작성자 표시 */}
              </div>
            </div>
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
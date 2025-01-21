import {useState, useEffect, useRef} from "react";
import styles from "./Detail.module.css";
import { Review } from "./Main.tsx";
import Modal from "../common/Modal.tsx";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHeart, faStar, faThumbsUp, faX} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

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
    const token = localStorage.getItem("token");
    const user = useRef<AuthData | null>(token ? JSON.parse(token) : null);
    const {t} = useTranslation("reviews");

  const [images, setImages] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]); // 기존 댓글 리스트
  const [newComment, setNewComment] = useState<string>(""); // 새로
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 리뷰 이미지 불러오기
  useEffect(() => {
    const filteredImages = [review.image1, review.image2, review.image3, review.image4].filter(
      (img) => !!img && typeof img === "string" && img.trim() !== ""
    );
    setImages(filteredImages);
  }, [review]);

   // 댓글 목록 불러오기
   useEffect(() => {
     const fetchComments = async () => {
       setIsLoading(true);
       setError(null);

       try {
         const response = await fetch(
           `${import.meta.env.VITE_BACKEND_URL}/api/comment/all?page=1&size=10&sort=id`,
           { method: "GET" }
         );

         if (!response.ok) {
           throw new Error("댓글 데이터를 가져올 수 없습니다.");
         }

         const result = await response.json();
         if (result.success) {
           setComments(result.data.items);
         } else {
           throw new Error(result.message || "댓글 가져오기 실패");
         }
       } catch (error: any) {
         console.error("댓글 가져오기 오류:", error);
         setError(error.message || "댓글 불러오는 중 에러가 발생했습니다.");
       } finally {
         setIsLoading(false);
       }
     };

     fetchComments();
   }, [review.id]);

   // 댓글 추가 기능
   const addComment = async () => {
     const regBy = user.current?.email;

     console.log("현재 sessionStorage 값:", regBy);

     if (!regBy || regBy.trim() === "") {
       alert("로그인이 필요합니다.");
       return;
     }

     if (!newComment.trim()) {
       alert("댓글 내용을 입력하세요.");
       return;
     }

     try {
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comment/add`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           postId: review.id,
           content: newComment.trim(),
           regBy,
         }),
       });

       if (!response.ok) {
         const error = await response.json();
         throw new Error(error.message || "댓글 등록 실패.");
       }

       const result = await response.json();
       if (result.success) {
         setComments((prevComments) => [...prevComments, result.data]); // 새로운 댓글 추가
         setNewComment(""); // 입력창 초기화
         alert("댓글이 성공적으로 등록되었습니다.");
       } else {
         alert("댓글 등록 실패: " + result.message);
       }
     } catch (error) {
       console.error("댓글 등록 오류:", error);
       alert("댓글 등록 중 문제가 발생했습니다.");
     }
   };

   // 로딩, 에러 상태 처리 및 렌더링
   if (isLoading) {
     return <p>Loading...</p>;
   }

   if (error) {
     return <p style={{ color: "red" }}>오류 발생: {error}</p>;
   }

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
          <button className={styles.recommendButton}><FontAwesomeIcon icon={faThumbsUp}/></button>
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
        <h3>{t("reviews:comments")}</h3>
        <div className={styles.comments}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentContainer}>
            <div className={styles.commentAuthor}>
               {comment.regBy.split("@")[0].length > 10
                        ? `${comment.regBy.split("@")[0].slice(0, 10)}...`
                        : comment.regBy.split("@")[0]}
            </div>
              <p className={styles.comment}>{comment.text}</p>
             <div className={styles.likeSection}>
               {/* 좋아요 버튼 */}
               <button
                 className={styles.likeButton}
                 onClick={() => toggleLike(comment.id)}
               >
                 <FontAwesomeIcon icon={faHeart} style={{ color: 'red' }} />
               </button>
               {/* 좋아요 숫자 */}
               <span className={styles.likeCount}>{comment.likes}</span>
             </div>
            </div>
          ))}
        </div>
        <textarea
          className={styles.commentInput}
          placeholder={t("reviews:writeComment")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className={styles.addCommentButton} onClick={addComment}>{t("reviews:submitComment")}</button>
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
            <button className={styles.imageCloseButton} onClick={() => setSelectedImage(null)}><FontAwesomeIcon icon={faX}/></button>
          </div>
        </div>
      )}
    </Modal>
  );
}



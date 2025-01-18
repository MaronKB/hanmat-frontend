import React, { useEffect, useState } from "react";
import "./ReviewModal.css";

interface Comment {
  id: number;
  text: string;
}

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
}

interface ReviewModalProps {
  review: Review | null;
  onClose: () => void;
}

const COMMENTS_PER_PAGE = 5;

const ReviewModal: React.FC<ReviewModalProps> = ({ review, onClose }) => {
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (!review) {
    return null;
  }

  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const paginatedComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj: Comment = {
      id: comments.length + 1,
      text: newComment,
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  useEffect(() => {
    const imageFiles = [review.image1, review.image2, review.image3, review.image4];
    const filteredImages = imageFiles.filter((image) => image !== "");
    setImages(filteredImages);
    setMainImage(filteredImages[0] || "");
  }, [review]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fa fa-star${index < rating ? " filled" : ""}`}
        aria-hidden="true"
      ></i>
    ));
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
        <button className="review-modal-close-button" onClick={onClose}>
          ×
        </button>
        <div className="review-modal-content">
          {/* 왼쪽: 이미지 영역 */}
          <div className="review-modal-images-section">
            <div className="review-modal-main-image">
              <img src={mainImage} alt="Main Review" className="review-modal-image" />
            </div>
            {images.length > 1 && (
              <div className="review-modal-thumbnails">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`review-modal-thumbnail ${
                      image === mainImage ? "active-thumbnail" : ""
                    }`}
                    onClick={() => setMainImage(image)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* 오른쪽: 콘텐츠 영역 */}
          <div className="review-modal-body">
            <div className="review-modal-header">
              <h2>{review.title}</h2>
              <div className="review-modal-rating-container">
                <div className="review-modal-stars">{renderStars(review.rating)}</div>
                <div>이 리뷰를</div>
                <button className="review-modal-recommend-button">추천</button>
              </div>
            </div>
            <div className="review-modal-text">
              <p>{review.content}</p>
            </div>
            <div className="review-modal-comments-section">
              <h3>댓글</h3>
              <div className="review-modal-comments">
                {paginatedComments.map((comment) => (
                  <div key={comment.id} className="review-modal-comment-card">
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="review-modal-pagination">
                {Array.from(
                  { length: Math.ceil(comments.length / COMMENTS_PER_PAGE) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={`review-modal-pagination-button ${
                      page === currentPage ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
            <div className="review-modal-comment-input-section">
              <textarea
                className="review-modal-comment-input"
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="review-modal-add-comment-button"
                onClick={handleAddComment}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
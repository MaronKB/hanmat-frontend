import React, { useState, useRef } from 'react';
import './Modal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, image: string, reviewText: string) => void;
  initialReview: string;
  initialRating: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialReview,
  initialRating,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialReview);
  const [image, setImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 검색창 */}
        <input
          type="text"
          placeholder="Search store or review title..."
          className="search-input"
        />

        {/* 별점 */}
        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? 'star selected' : 'star'}
            >
              ★
            </span>
          ))}
          <span>Please select a rating!</span>
        </div>

        {/* 이미지 업로드 */}
        <div className="image-upload-section">
          {image ? (
            <img src={image} alt="Uploaded" className="uploaded-image" />
          ) : (
            <div className="image-placeholder">
              <label htmlFor="file-upload" className="upload-button">+</label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        {/* 리뷰 텍스트 */}
        <textarea
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="review-textarea"
        />

        {/* 버튼 */}
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="submit-btn"
            onClick={() => onSubmit(rating, image, reviewText)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

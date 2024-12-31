import React, { useState } from 'react';
import './Main.review.css';
import ReviewList from './ReviewList';
import Pagination from './Pagination';

const Main: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('NEW');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null); // 별점 미리보기
  const [images, setImages] = useState<File[]>([]);

  // 새 리뷰 추가 핸들러
  const handleAddReview = () => {
    if (!newReview.trim()) {
      alert('Please write your review!');
      return;
    }
    if (rating === 0) {
      alert('Please select a star rating!');
      return;
    }

    console.log('New Review Submitted:', { review: newReview, rating, images });
    alert('Your review has been submitted successfully!');

    // 초기화
    setNewReview('');
    setRating(0);
    setImages([]);
    setShowModal(false);
  };

  // 별점을 선택하는 함수
  const handleRating = (index: number) => {
    setRating(index + 1);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 3)); // 최대 3개
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // 별점 미리보기 및 선택 상태 결정
  const currentRating = hoverRating ?? rating;

  return (
    <div className="main-container">
      <h2 className="main-title">Review of the Month</h2>
      <div className="main-controls">
        <button className="button-rv">My Reviews</button>
        <button className="button-cn" onClick={() => setShowModal(true)}>
          Create New
        </button>
        <select
          className="select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="NEW">Sort: New</option>
          <option value="OLD">Sort: Old</option>
        </select>
      </div>

      <ReviewList sortOption={sortOption} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="search-container">
              <input type="text" placeholder="Search..." className="search-input" />
              <button className="search-button">
                <i className="fa fa-search"></i>
              </button>
              <button className="close-modal-button" onClick={() => setShowModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* 별점 영역 */}
            <div className="star-rating-container">
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fa fa-star ${index < currentRating ? 'filled' : ''}`}
                    onMouseEnter={() => setHoverRating(index + 1)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRating(index)}
                  ></i>
                ))}
              </div>
              <span className="rating-instruction">
                {rating > 0
                  ? `You selected ${rating} star${rating > 1 ? 's' : ''}!`
                  : 'Please select a rating!'}
              </span>
            </div>

            {/* 이미지 업로드 */}
            <div className="image-upload">
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="image-thumbnail-container">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`preview ${index}`}
                      className="image-thumbnail"
                      onLoad={() => URL.revokeObjectURL(image)}
                    />
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="file-upload" className="upload-label">
                <i className="fa fa-plus"></i>
              </label>
              <input
                type="file"
                id="file-upload"
                className="file-input"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
              />
            </div>

            {/* 리뷰 내용 입력 */}
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
            />
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleAddReview}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;

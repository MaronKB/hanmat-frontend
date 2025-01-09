import React, { useState, useEffect } from 'react';
import './Main.review.css'; // 스타일을 적용할 CSS 파일
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
  const [showOnlyMyReviews, setShowOnlyMyReviews] = useState<boolean>(false); // My Reviews 필터 상태
  const [reviews, setReviews] = useState<
    Array<{ id: number; title: string; content: string; rating: number; userEmail: string; images: File[] }>
  >([]);

  // 초기 데이터 가져오기
  useEffect(() => {
   const fetchReviews = async () => {
     try {
       const response = await fetch('http://localhost:8080/hanmat/api/post/all', { method: 'GET' });
       if (!response.ok) {
         throw new Error('Failed to fetch reviews.');
       }
       const result = await response.json(); // 결과 parsing
       if (result.success) {
         setReviews(result.data);
       } else {
         console.error('Failed to fetch reviews:', result.message);
       }
     } catch (error) {
       console.error('Error fetching reviews:', error);
     }
   };
    fetchReviews();
  }, []); // 최초 렌더 시 실행

  // My Reviews 버튼 클릭 핸들러
  const handleToggleMyReviews = async () => {
    setShowOnlyMyReviews((prev) => !prev); // 상태 토글

    if (!showOnlyMyReviews) {
      try {
        const response = await fetch('http://localhost:8080/hanmat/api/post/my?userEmail=user@example.com', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Failed to fetch user reviews.');
        }

        const result = await response.json();
        if (result.success) {
          setReviews(result.data); // 사용자 리뷰만 상태에 저장
        } else {
          console.error('Failed to fetch user reviews:', result.message);
        }
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    } else {
      // 모든 리뷰 다시 가져오기
      const fetchReviews = async () => {
        try {
          const response = await fetch('http://localhost:8080/hanmat/api/post/all', { method: 'GET' });
          if (!response.ok) {
            throw new Error('Failed to fetch reviews.');
          }

          const result = await response.json();
          if (result.success) {
            setReviews(result.data);
          }
        } catch (error) {
          console.error('Error fetching all reviews:', error);
        }
      };

      fetchReviews();
    }
  };

  // 모달 열기 함수
  const openModal = () => {
    setNewReview(''); // 리뷰 내용 초기화
    setRating(0); // 별점 초기화
    setHoverRating(null); // 별점 미리보기 초기화
    setImages([]); // 업로드된 이미지 초기화
    setShowModal(true); // 모달 열기
  };

  // 새 리뷰 추가 핸들러
  const handleAddReview = async () => {
    if (!newReview.trim()) {
      alert('Please write your review!');
      return;
    }
    if (rating === 0) {
      alert('Please select a star rating!');
      return;
    }

    const newReviewData = {
      title: `Review ${reviews.length + 1}`,
      content: newReview,
      rating,
      userEmail: 'user@example.com', // 로그인된 사용자 이메일
      images: images.map((image) => URL.createObjectURL(image)), // 이미지 URL 생성
    };

    try {
      const response = await fetch('http://localhost:8080/hanmat/api/post/save', {  // 올바른 백엔드 URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to save the review.');
      }

      const savedReview = await response.json(); // 서버에서 반환된 저장된 리뷰
      setReviews((prevReviews) => [savedReview.data, ...prevReviews]); // 상태 업데이트
      alert('Your review has been submitted successfully!');
      setShowModal(false); // 모달 닫기
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save the review. Please try again.');
    }
  };

  // 별점 선택 함수
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

  // filteredReviews와 sortedReviews 정의
  const filteredReviews = showOnlyMyReviews
    ? reviews.filter((review) => review.userEmail === 'user@example.com') // userEmail에 따른 필터링
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOption === 'NEW') return b.id - a.id;
    if (sortOption === 'OLD') return a.id - b.id;
    if (sortOption === 'LIKES') return (b.rating || 0) - (a.rating || 0); // null 방어, 좋아요 많은 순
    return 0;
  });

  const currentRating = hoverRating ?? rating;

  return (
    <div className="main-container">
      <h2 className="main-title">Review of the Month</h2>
      <div className="main-controls">
        <button className="button-rv" onClick={handleToggleMyReviews}>
          {showOnlyMyReviews ? 'All Reviews' : 'My Reviews'}
        </button>
        <button className="button-cn" onClick={openModal}>
          Create New
        </button>
        <select
          className="select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="NEW">Sort: New</option>
          <option value="OLD">Sort: Old</option>
          <option value="LIKES">Sort: Likes</option>
        </select>
      </div>

      <ReviewList reviews={sortedReviews} sortOption={sortOption} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredReviews.length / 10)} // filteredReviews 기준으로 계산
        onPageChange={(page) => setCurrentPage(page)}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {/* 모달 헤더 */}
            <div className="modal-header">
              <div className="search-input-container">
                <i className="fa fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search store or review title..."
                  className="search-input"
                />
              </div>
              <button className="close-modal-button" onClick={() => setShowModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            {/* 별점 및 이미지 업로드 */}
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

            <div className="image-upload">
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-thumbnail-container">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
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

            {/* 텍스트 입력 및 버튼 */}
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              rows={5}
              style={{ resize: 'vertical' }}
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
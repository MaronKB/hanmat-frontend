import React, { useState } from 'react';
import './Main.review.css'; // CSS 파일을 가져옴
import ReviewList from './ReviewList';
import Pagination from './Pagination';

const Main: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('NEW');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 상태 관리
  const [newReview, setNewReview] = useState<string>(''); // 새 리뷰 내용 상태 관리
  const [rating, setRating] = useState<number>(0); // 별점 상태 관리

  // 새 리뷰 추가 핸들러
  const handleAddReview = () => {
    if (newReview.trim()) {
      console.log('새 리뷰 등록:', newReview, '별점:', rating);
      setNewReview(''); // 입력 초기화
      setRating(0); // 별점 초기화
      setShowModal(false); // 모달 닫기
    }
  };

  // 별점을 선택하는 함수
  const handleRating = (index: number) => {
    setRating(index + 1); // 클릭한 별을 포함해 그 이하 별들을 선택된 것으로 설정
  };

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

      {/* 모달 창 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {/* 검색창 */}
            <div className="search-container">
              <input type="text" placeholder="Search..." className="search-input" />
              <button className="search-button">
                <i className="fa fa-search"></i>
              </button>
              <button className="close-modal-button" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>

            {/* 별점 영역 */}
            <div className="star-rating">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fa fa-star ${index < rating ? 'filled' : ''}`}
                  onClick={() => handleRating(index)}
                ></i>
              ))}
            </div>

            {/* 리뷰 내용 입력 */}
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
            />
            <div className="modal-buttons">
              <button onClick={handleAddReview}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;

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
  const [images, setImages] = useState<File[]>([]); // 업로드된 이미지 목록 상태 관리

  // 새 리뷰 추가 핸들러
  const handleAddReview = () => {
    if (newReview.trim()) {
      console.log('새 리뷰 등록:', newReview, '별점:', rating);
      if (images.length > 0) {
        console.log('업로드된 이미지:', images.map((image) => image.name));
      }
      setNewReview(''); // 입력 초기화
      setRating(0); // 별점 초기화
      setImages([]); // 이미지 초기화
      setShowModal(false); // 모달 닫기
    }
  };

  // 별점을 선택하는 함수
  const handleRating = (index: number) => {
    setRating(index + 1); // 클릭한 별을 포함해 그 이하 별들을 선택된 것으로 설정
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 3)); // 최대 3개 이미지만 선택
    }
  };

  // 이미지 미리보기 URL을 생성하는 함수
  const generateImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index); // 삭제된 이미지를 제외한 나머지 이미지만 남김
    setImages(updatedImages);
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
                <i className="fa fa-times"></i> {/* x 모양 아이콘 */}
              </button>
            </div>

            {/* 별점 영역 */}
           <div className="star-rating-container">
             <div className="star-rating">
               {[...Array(5)].map((_, index) => (
                 <i
                   key={index}
                   className={`fa fa-star ${index < rating ? 'filled' : ''}`}
                   onMouseEnter={() => setRating(index + 1)} // 마우스 올릴 때 미리보기 효과
                   onMouseLeave={() => setRating(0)} // 마우스 나가면 초기화
                   onClick={() => handleRating(index)}
                 ></i>
               ))}
             </div>
             <span className={`rating-instruction ${rating > 0 ? 'highlight' : ''}`}>
               {rating > 0 ? `You selected ${rating} star${rating > 1 ? 's' : ''}!` : 'Please select a rating!'}
             </span>
           </div>


            {/* 사진 업로드 영역 */}
            <div className="image-upload">
              <div className="image-preview">
                {images.map((image, index) => (
                  <div key={index} className="image-thumbnail-container">
                    <img
                      src={generateImagePreview(image)}
                      alt={`preview ${index}`}
                      className="image-thumbnail"
                    />
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <i className="fa fa-times"></i> {/* x 아이콘 */}
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="file-upload" className="upload-label">
                <i className="fa fa-plus"></i> {/* + 아이콘 */}
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

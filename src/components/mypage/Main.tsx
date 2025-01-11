import React, { useState, useRef } from 'react';
import "./Main.css";
import Modal from './Modal';

const MyPage: React.FC = () => {
    const [image, setImage] = useState('/default-profile.png');
  const fileInputRef = useRef(null); // 파일 입력 요소 참조
  const [introduce, setIntroduce] = useState('');
  const [isBuddyVisible, setIsBuddyVisible] = useState(true);
  const [isAutoTranslate, setIsAutoTranslate] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [radius, setRadius] = useState('5km');
  const [favoriteStores, setFavoriteStores] = useState(['식당 1', '식당 2', '식당 3', '식당 4']);
  const [myReviews, setMyReviews] = useState(['리뷰 1', '리뷰 2', '리뷰 3', '리뷰 4']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState('');
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number | null>(null);

  const handleIntroduceChange = (e: React.ChangeEvent<HTMLInputElement>) => setIntroduce(e.target.value);
  const toggleBuddyVisibility = () => setIsBuddyVisible(!isBuddyVisible);
  const toggleAutoTranslate = () => setIsAutoTranslate(!isAutoTranslate);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setRadius(e.target.value);
  const removeFavoriteStore = (index: number) => setFavoriteStores(favoriteStores.filter((_, i) => i !== index));

  const editReview = (index: number) => {
    setCurrentReview(myReviews[index]);
    setCurrentReviewIndex(index);
    setIsModalOpen(true);
  };

  const saveEditedReview = () => {
    if (currentReviewIndex !== null) {
      const updatedReviews = [...myReviews];
      updatedReviews[currentReviewIndex] = currentReview;
      setMyReviews(updatedReviews);
      setIsModalOpen(false);
      setCurrentReviewIndex(null);
    }
  };

  const handleWithdrawal = () => {
    if (window.confirm('탈퇴하시겠습니까?')) {
      alert('탈퇴 처리되었습니다.');
    }
  };
  // 파일 입력 클릭 핸들러
  const handleImageClick = () => {
      fileInputRef.current.click(); // 숨겨진 파일 입력 클릭
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="mypage-container">
      {/* 이미지 업로드 */}
      <div className="section">
        <div
                onClick={handleImageClick}
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '2px solid #ccc',
                  margin: '0 auto'
                }}
              >
                <img
                  src={image}
                  alt="Profile Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              {/* 숨겨진 파일 입력 */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
        <input
          type="text"
          value={introduce}
          onChange={handleIntroduceChange}
          placeholder="자기소개를 입력하세요"
        />
        <button type="submit" className="submit-btn">등록</button>
      </div>

      {/* 설정 섹션 */}
        <div className="section">
            <label>BUDDY에 자신을 보이기</label>
            <input type="checkbox" className="checkbox" checked={isBuddyVisible}
                   onChange={toggleBuddyVisibility}/> {/* className="checkbox" 추가 */}
        </div>
        <div className="section">
            <label>자동 번역</label>
            <input type="checkbox" className="checkbox" checked={isAutoTranslate}
                   onChange={toggleAutoTranslate}/> {/* className="checkbox" 추가 */}
        </div>
        <div className="section">
            <label>다크 모드</label>
            <input type="checkbox" className="checkbox" checked={isDarkMode}
                   onChange={toggleDarkMode}/> {/* className="checkbox" 추가 */}
        </div>
        <div className="section">
            <label>주변 반경 설정</label>
            <select value={radius} onChange={handleRadiusChange}>
                {['1km', '3km', '5km', '10km', '20km', '30km'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* 관심 가게 */}
      <div className="section">
        <h3>관심 가게 목록</h3>
        <ul>
          {favoriteStores.map((store, index) => (
            <li key={index}>{store} <button className="remove-btn" onClick={() => removeFavoriteStore(index)}>삭제</button></li>
          ))}
        </ul>
      </div>

      {/* 리뷰 */}
      <div className="section">
        <h3>나의 리뷰 목록</h3>
        <ul>
          {myReviews.map((review, index) => (
            <li key={index}>
              {review}
              <button className="fix-btn" onClick={() => editReview(index)}>수정</button>
            </li>
          ))}
        </ul>
      </div>

      <button className="withdraw-btn" onClick={handleWithdrawal}>탈퇴하기</button>

      {/* 모달 창 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>리뷰 수정</h3>
        <input
          type="text"
          value={currentReview}
          onChange={(e) => setCurrentReview(e.target.value)}
        />
        <button onClick={saveEditedReview}>저장</button>
      </Modal>
    </div>
  );
};

export default MyPage;

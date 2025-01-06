// MyPage.tsx
import React, { useState } from 'react';
import './Main.css';

const MyPage: React.FC = () => {
  const [introduce, setIntroduce] = useState('');
  const [isBuddyVisible, setIsBuddyVisible] = useState(true);
  const [isAutoTranslate, setIsAutoTranslate] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [radius, setRadius] = useState('5km');
  const [favoriteStores, setFavoriteStores] = useState(['식당 1', '식당 2', '식당 3', '식당 4']);
  const [myReviews, setMyReviews] = useState(['리뷰 1', '리뷰 2', '리뷰 3', '리뷰 4']);
  const [postImg, setPostImg] = useState([]);

  const handleIntroduceChange = (e: React.ChangeEvent<HTMLInputElement>) => setIntroduce(e.target.value);
  const toggleBuddyVisibility = () => setIsBuddyVisible(!isBuddyVisible);
  const toggleAutoTranslate = () => setIsAutoTranslate(!isAutoTranslate);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setRadius(e.target.value);
  const removeFavoriteStore = (index: number) => setFavoriteStores(favoriteStores.filter((_, i) => i !== index));
  const editReview = (index: number) => alert(`리뷰 ${index + 1} 수정 모달 열림`);
  const handleWithdrawal = () => {
    if (window.confirm('탈퇴하시겠습니까?')) {
      alert('탈퇴 처리되었습니다.');
    }
  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  // 이미지 업로드 input의 onChange
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        setImgFile(reader.result);
    };
  };
  const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
  const fileInput = useRef(null)
};

  return (
    <div className={`mypage-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="section">
        <form>
          <input
          className="signup-profileImg-input"
          type="file"
          accept="image/*"
          id="profileImg"
          />
        </form>
        <input type="text" value={introduce} onChange={handleIntroduceChange} placeholder="자기소개를 입력하세요" />
        <button>등록</button>
      </div>
      <div className="section">
        <label>BUDDY에 자신을 보이기</label>
        <input type="checkbox" checked={isBuddyVisible} onChange={toggleBuddyVisibility} />
      </div>
      <div className="section">
        <label>자동 번역</label>
        <input type="checkbox" checked={isAutoTranslate} onChange={toggleAutoTranslate} />
      </div>
      <div className="section">
        <label>다크 모드</label>
        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
      </div>
      <div className="section">
        <label>주변 반경 설정</label>
        <select value={radius} onChange={handleRadiusChange}>
          {['1km', '3km', '5km', '10km', '20km', '30km'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="section">
        <h3>관심 가게 목록</h3>
        <ul>
          {favoriteStores.map((store, index) => (
            <li key={index}>{store} <button onClick={() => removeFavoriteStore(index)}>삭제</button></li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h3>나의 리뷰 목록</h3>
        <ul>
          {myReviews.map((review, index) => (
            <li key={index}>{review} <button className={'modal-close-btn'} onClick={() => editReview(index)}>수정</button></li>
          ))}
        </ul>
      </div>
      <button className="withdraw-btn" onClick={handleWithdrawal}>탈퇴하기</button>
    </div>
  );
};

export default MyPage;
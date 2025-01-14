import React, { useState, useRef, useEffect } from 'react';
import styles from './Main.module.css';
import Modal from './Modal';
import {AuthData} from "../oauth/GoogleOAuth.tsx";

const MyPage: React.FC = () => {
    const token = localStorage.getItem('token');
    const user = useRef<AuthData | null>(token ? JSON.parse(token) : null);
    const [image, setImage] = useState('/default-profile.png');
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
    const [username, setUsername] = useState('Guest');
    const [email, setEmail] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 컴포넌트 마운트 시 localStorage에서 사용자 정보 로드
    useEffect(() => {
        if (user.current) {
            setUsername(user.current.nickname || 'Guest'); // 닉네임 설정
            setEmail(user.current.email || ''); // 이메일 설정
        }
    }, []);

    const handleIntroduceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setIntroduce(e.target.value);
    const toggleBuddyVisibility = () => setIsBuddyVisible(!isBuddyVisible);
    const toggleAutoTranslate = () => setIsAutoTranslate(!isAutoTranslate);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setRadius(e.target.value);
    const removeFavoriteStore = (index: number) =>
        setFavoriteStores(favoriteStores.filter((_, i) => i !== index));

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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user.current) {
        alert('로그인이 필요합니다.');
        location.href = '/';
        return <div>로그인이 필요합니다.</div>;
    }

    return (
        <div className={`${styles['mypage-container']} ${isDarkMode ? styles.dark : ''}`}>
            {/* 이미지 업로드 */}
            <div className={styles.section}>
                <div
                    className={styles['profile-img-container']}
                >
                    <img
                        src={image}
                        alt="Profile Preview"
                        className={styles['profile-img']}
                        onClick={handleImageClick}
                    />
                    <div className={styles['account-inf']}>
                        <h2>{username}</h2>
                        <p>{email}</p>
                    </div>
                    <div className={styles['introduce-section']}>
                        <input
                            type="text"
                            value={introduce}
                            onChange={handleIntroduceChange}
                            placeholder="자기소개를 입력하세요"
                        />
                        <button type="submit" className={styles['submit-btn']}>
                            등록
                        </button>
                    </div>
                </div>


                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>

            {/* 설정 섹션 */}
            <div className={styles.section}>
                <label>BUDDY에 자신을 보이기</label>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isBuddyVisible}
                    onChange={toggleBuddyVisibility}
                />
            </div>
            <div className={styles.section}>
                <label>자동 번역</label>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isAutoTranslate}
                    onChange={toggleAutoTranslate}
                />
            </div>
            <div className={styles.section}>
                <label>다크 모드</label>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                />
            </div>
            <div className={styles.section}>
                <label>주변 반경 설정</label>
                <select value={radius} onChange={handleRadiusChange}>
                    {['1km', '3km', '5km', '10km', '20km', '30km'].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* 관심 가게 */}
            <div className={styles.section}>
                <h3>관심 가게 목록</h3>
                <ul>
                    {favoriteStores.map((store, index) => (
                        <li key={index}>
                            {store}
                            <button
                                className={styles['remove-btn']}
                                onClick={() => removeFavoriteStore(index)}
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 리뷰 */}
            <div className={styles.section}>
                <h3>나의 리뷰 목록</h3>
                <ul>
                    {myReviews.map((review, index) => (
                        <li key={index}>
                            {review}
                            <button
                                className={styles['fix-btn']}
                                onClick={() => editReview(index)}
                            >
                                수정
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <button className={styles['withdraw-btn']} onClick={handleWithdrawal}>
                탈퇴하기
            </button>

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

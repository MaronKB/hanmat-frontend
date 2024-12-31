import React, { useEffect, useState } from 'react';
import './FindModal.css';
import axios from 'axios';

function Modal({ type, onClose, storeId }) {
  const [storeData, setStoreData] = useState({
    name: '',
    level: '',
    photo: '',
    description: '',
    reviews: [],
  });

  const [loading, setLoading] = useState(true);

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/store/${storeId}`);
        setStoreData(response.data);
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* 공통 상단 영역 */}
        <div className="modal-header">
          <span className="store-name">{storeData.name || '가게 이름'}</span> {/* API 데이터 */}
          <span className="level">LV.{storeData.level || '0'}</span>
          <span className="favorite">⭐</span>
          <button className="close-button" onClick={onClose}>✖</button>
        </div>

        {/* 상세 설명 모달 */}
        {type === 'detail' && (
          <div className="modal-content detail">
            <div className="photo-area">
              <img
                src={storeData.photo || 'https://via.placeholder.com/300'}
                alt="가게 사진"
              />
            </div>
            <div className="simple-description">{storeData.description || '간단 설명 영역'}</div>
            <div className="detailed-description">
              {storeData.details || '상세 설명 영역'}
            </div>
            <div className="scroll-bar">스크롤</div>
          </div>
        )}

        {/* 리뷰 모달 */}
        {type === 'review' && (
          <div className="modal-content review">
            <div className="review-area">리뷰</div>
            <div className="review-grid">
              {storeData.reviews.length > 0 ? (
                storeData.reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    {review.comment}
                  </div>
                ))
              ) : (
                <p>리뷰가 없습니다.</p>
              )}
            </div>
            <div className="pagination">
              {[...Array(9)].map((_, index) => (
                <button key={index}>{index + 1}</button>
              ))}
            </div>
            <button className="write-review">리뷰 작성</button>
            <div className="scroll-bar">스크롤</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;

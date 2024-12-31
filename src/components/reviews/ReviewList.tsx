import React from 'react';
import './ReviewList.css'; // 스타일을 적용할 CSS 파일

const ReviewList: React.FC = () => {
  // 더미 데이터
  const reviews = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Review ${index + 1}`,
    content: `This is the content of review ${index + 1}.`,
  }));

  return (
    <div className="review-list-container">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <h3>{review.title}</h3>
          <p>{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

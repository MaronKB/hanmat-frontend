import React from 'react';
import './ReviewItem.css'; // CSS 파일을 가져옴

interface ReviewItemProps {
  content: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ content }) => {
  return (
    <div className="review-item">
      {content}
    </div>
  );
};

export default ReviewItem;

import React, { useState } from 'react';
import ReviewModal from './ReviewModal';
import './ReviewList.css';

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  images: File[];
}

interface ReviewListProps {
  reviews: Review[];
  sortOption: string;
  currentPage: number;
}

const REVIEWS_PER_PAGE = 10;

const ReviewList: React.FC<ReviewListProps> = ({ reviews, sortOption, currentPage }) => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'NEW') return b.id - a.id;
    if (sortOption === 'OLD') return a.id - b.id;
    if (sortOption === 'LIKES') return b.rating - a.rating;
    return 0;
  });

  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  return (
    <div className="review-list-container">
      {paginatedReviews.map((review) => (
        <div
          key={review.id}
          className="review-card"
          onClick={() => setSelectedReview(review)}
        >
          <h3>{review.title}</h3>
          <p>{review.content}</p>
          <div className="review-rating">Rating: {review.rating} ★</div>
          {review.images.length > 0 && (
            <div className="review-images">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Review ${review.id} - Image ${index + 1}`}
                  className="review-image"
                  onLoad={() => URL.revokeObjectURL(image)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          comments={[]}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default ReviewList;

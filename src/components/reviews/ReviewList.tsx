import React, {useEffect, useState} from 'react';
import ReviewModal from './ReviewModal';
import './ReviewList.css';

interface Review {
    id: number;
    title: string;
    content: string;
    rating: number;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
}

interface ReviewListProps {
    reviews: Review[];
    sortOption: string;
    currentPage: number;
}

const REVIEWS_PER_PAGE = 10;

const ReviewList: React.FC<ReviewListProps> = ({ reviews, sortOption, currentPage }) => {
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [images, setImages] = useState<string[]>([]);

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOption === 'NEW') return b.id - a.id;
        if (sortOption === 'OLD') return a.id - b.id;
        if (sortOption === 'LIKES') return b.rating - a.rating;
        return 0;
    });

    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const paginatedReviews = sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

    useEffect(() => {
        const imageFiles = sortedReviews.flatMap((review) => [
            review.image1,
            review.image2,
            review.image3,
            review.image4,
        ]);
        setImages(imageFiles.filter((image) => image !== ""));
    }, []);

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
                    {images[0] !== "" && (
                        <div className="review-images">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
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
                    onClose={() => setSelectedReview(null)}
                />
            )}
        </div>
    );
};

export default ReviewList;

import React, { useState, useEffect, useRef } from 'react';
import styles from './Main.module.css'; // 스타일을 적용할 CSS 파일
import Pagination from './Pagination';
import { AuthData } from "../oauth/GoogleOAuth.tsx";
import Item from "./Item.tsx";
import New from "./New.tsx";
import Detail from "./Detail.tsx";

export interface Review {
    id: number;
    title: string;
    author: string;
    content: string;
    rating: number;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
}

const Main: React.FC = () => {
    const PAGE_SIZE = 12;

    const token = localStorage.getItem('token');
    const user = useRef<AuthData>(JSON.parse(token || '{}'));

    const [sortOption, setSortOption] = useState<string>('NEW');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isNewModalOpened, setNewModalOpened] = useState<boolean>(false);
    const [modalData, setModalData] = useState<Review | null>(null); // 리뷰 데이터만 관리
    const [showOnlyMyReviews, setShowOnlyMyReviews] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Array<Review>>([]);

    const getReviews = async (page: number = 1) => {
        const query = !showOnlyMyReviews ? 'all?' : `my?email=${user.current.email}&`;
        try {
            const response = await fetch(`http://localhost:8080/hanmat/api/post/${query}page=${page}&size=${PAGE_SIZE}&sortBy=id&sortAs=desc`, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to fetch user reviews.');
            }

            const result = await response.json();
            if (result.success) {
                setTotalPages(result.data.totalPages);
                setReviews(result.data.items); // 사용자 리뷰만 상태에 저장
            } else {
                console.error('Failed to fetch user reviews:', result.message);
            }
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    };

    const handleReviewClick = (review: Review) => {
        setModalData(review); // 클릭한 리뷰 데이터만 저장
    };

    useEffect(() => {
        getReviews(currentPage);
    }, [currentPage, showOnlyMyReviews]);

    return (
        <main className={styles.main}>
            <h2 className={styles["main-title"]}>Review of the Month</h2>
            <div className={styles["main-controls"]}>
                <button className={styles["button-rv"]} onClick={() => setShowOnlyMyReviews(!showOnlyMyReviews)}>
                    {showOnlyMyReviews ? 'All Reviews' : 'My Reviews'}
                </button>
                <button className={styles["button-cn"]} onClick={() => setNewModalOpened(true)}>
                    Create New
                </button>
                <select
                    className={styles["select"]}
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="NEW">Sort: New</option>
                    <option value="OLD">Sort: Old</option>
                    <option value="LIKES">Sort: Likes</option>
                </select>
            </div>
            {reviews.length > 0 && (
                <div className={styles.container}>
                    {reviews.map((review) => (
                        <Item
                            key={review.id}
                            review={review}
                            onClick={() => handleReviewClick(review)} // 클릭 시 좌표 계산 제거
                        />
                    ))}
                </div>
            )}
            {reviews.length === 0 && <p className={styles["no-reviews"]}>No reviews found.</p>}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
            {isNewModalOpened && <New open={setNewModalOpened} />}
            {modalData && (
                <Detail
                    review={modalData} // 리뷰 데이터만 전달
                    closeModal={() => setModalData(null)}
                />
            )}
        </main>
    );
};

export default Main;
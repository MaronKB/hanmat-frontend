import React, {useState, useEffect, useRef} from 'react';
import styles from './Main.module.css'; // 스타일을 적용할 CSS 파일
import Pagination from './Pagination';
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import Item from "./Item.tsx";
import New from "./New.tsx";

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
    const [showOnlyMyReviews, setShowOnlyMyReviews] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Array<Review>>([]);
    const [currentReview, setCurrentReview] = useState<Review>();

    const getReviews = async (page: number = 1) => {
        const query = !showOnlyMyReviews ? 'all?' : `my?email=${user.current.email}&`;
        try {
            const response = await fetch(`http://localhost:8080/hanmat/api/post/${query}page=${page}&size=${PAGE_SIZE}`, {method: 'GET'});
            if (!response.ok) {
                throw new Error('Failed to fetch user reviews.');
            }

            const result = await response.json();
            console.log(result)
            if (result.success) {
                setTotalPages(result.data.totalPages);
                setReviews(result.data.items); // 사용자 리뷰만 상태에 저장
            } else {
                console.error('Failed to fetch user reviews:', result.message);
            }
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    }

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
            {reviews.length > 0 && <div className={styles.container}>
                {reviews.map((review) => (
                    <Item key={review.id} review={review} set={setCurrentReview} />
                ))}
            </div>}
            {reviews.length === 0 && <p className={styles["no-reviews"]}>No reviews found.</p>}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages} // filteredReviews 기준으로 계산
                onPageChange={(page) => setCurrentPage(page)}
            />
            {isNewModalOpened && <New open={setNewModalOpened}/>}
        </main>
    );
};

export default Main;
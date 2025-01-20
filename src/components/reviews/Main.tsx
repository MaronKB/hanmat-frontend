import React, { useState, useEffect, useRef } from 'react';
import styles from './Main.module.css'; // 스타일 적용
import Pagination from './Pagination';
import { AuthData } from '../oauth/GoogleOAuth.tsx';
import Item from './Item.tsx';
import New from './New.tsx';
import Detail from './Detail.tsx';
import reviewImg from '../../assets/images/reviewimg.png';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownWideShort, faBook, faPencil} from "@fortawesome/free-solid-svg-icons";


export type Review = {
    id: number;
    title: string;
    author: string;
    content: string;
    rating: number;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
};

const Main: React.FC = () => {
    const PAGE_SIZE = 12;
    const token = localStorage.getItem('token');
    const user = useRef<AuthData>(JSON.parse(token || '{}'));

    const [sortOption, setSortOption] = useState<string>('NEW');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isNewModalOpened, setNewModalOpened] = useState<boolean>(false);
    const [isDetailModalOpened, setIsDetailModalOpened] = useState<boolean>(false);
    const [modalData, setModalData] = useState<Review | null>(null);
    const [showOnlyMyReviews, setShowOnlyMyReviews] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Array<Review>>([]);

    const getReviews = async (page: number = 1) => {
        const query = !showOnlyMyReviews
            ? 'all?'
            : `my?email=${user.current.email}&`;
        try {
            const response = await fetch(
                `http://localhost:8080/hanmat/api/post/${query}page=${page}&size=${PAGE_SIZE}&sort=id&sortAs=desc`,
                { method: 'GET' }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch user reviews.');
            }

            const result = await response.json();
            if (result.success) {
                setTotalPages(result.data.totalPages);
                setReviews(result.data.items);
            } else {
                console.error('Failed to fetch user reviews:', result.message);
            }
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        }
    };

    const handleReviewClick = (review: Review) => {
        setModalData(review);
        setIsDetailModalOpened(true);
    };

    useEffect(() => {
        getReviews(currentPage);
    }, [currentPage, showOnlyMyReviews]);

    const handleSortChange = (selectedOption: string) => {
        setSortOption(selectedOption); // 상태 업데이트
        fetchReviewsWithSort(selectedOption); // 정렬된 데이터를 가져오는 함수 호출
    };

    useEffect(() => {
        fetchReviewsWithSort(sortOption);
    }, [sortOption, currentPage, showOnlyMyReviews]);

    const fetchReviewsWithSort = async (sort: string) => {
        const query = !showOnlyMyReviews
            ? 'all?'
            : `my?email=${user.current.email}&`;
        try {
            const response = await fetch(
                `http://localhost:8080/hanmat/api/post/${query}page=${currentPage}&size=${PAGE_SIZE}&sort=${sort}`,
                { method: 'GET' }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch sorted reviews.');
            }

            const result = await response.json();
            if (result.success) {
                setTotalPages(result.data.totalPages);

                if (JSON.stringify(reviews) !== JSON.stringify(result.data.items)) {
                    setReviews(result.data.items);
                } else {
                    console.log('No changes in reviews. Skipping state update.');
                }
            } else {
                console.error('Failed to fetch reviews:', result.message);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    return (
        <main className={styles.main}>


            <div className={styles['review-background']}>
                <img className={styles['review-image']} src={reviewImg} alt={"review-image"}/>
                <div className={styles['text-area']}>
                    <h2 className={styles['review-title']}>Hanmat Reviews</h2>
                    <p className={styles['sub-title']}>Hanmat Reviews is a reliable platform for sharing honest<br />
                        opinions about Korean cuisine. Users can explore reviews<br />
                        on dishes, restaurants, and unique flavors across  Korea.<br />
                        Each review includes details on taste, spice level, and overall <br />dining experience. Join the community to share your thoughts<br />
                        and discover hidden culinary gems!</p>
                </div>

                <div className={styles['review-section']}>
                    <button className={styles['review-button']}>best review</button>
                    <button className={styles['review-button']} onClick={() => setNewModalOpened(true)}>
                        <FontAwesomeIcon icon={faPencil}/>
                        <span>Create New</span>
                    </button>
                    {/*<button className={styles['review-button']}>Click</button>*/}
                </div>
            </div>
            <div className={styles['main-controls']}>
                {/* 정렬 버튼 + My Reviews 버튼 */}
                <div className={styles['select-buttons']}>
                    <div className={`${styles['sort-buttons']}`}>
                        <FontAwesomeIcon icon={faArrowDownWideShort}/>
                        <button
                            className={`${styles['button-nw']} ${sortOption === 'new' ? styles['active'] : ''}`}
                            onClick={() => handleSortChange('new')}
                        >
                            New
                        </button>
                        <button
                            className={`${styles['button-od']} ${sortOption === 'old' ? styles['active'] : ''}`}
                            onClick={() => handleSortChange('old')}
                        >
                            Old
                        </button>
                        <button
                            className={`${styles['button-rg']} ${sortOption === 'rating' ? styles['active'] : ''}`}
                            onClick={() => handleSortChange('rating')}
                        >
                            Rating
                        </button>
                    </div>
                    <button
                        className={styles['button-rv']}
                        onClick={() => setShowOnlyMyReviews(!showOnlyMyReviews)}
                    >
                        <FontAwesomeIcon icon={faBook}/>
                        {showOnlyMyReviews ? 'All Reviews' : 'My Reviews'}
                    </button>
                </div>
            </div>
            {reviews.length > 0 && (
                <div className={styles.container}>
                    {reviews.map((review) => (
                        <Item
                            key={review.id}
                            review={review}
                            onClick={() => handleReviewClick(review)}
                        />
                    ))}
                </div>
            )}
            {reviews.length === 0 && (
                <p className={styles['no-reviews']}>No reviews found.</p>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchReviewsWithSort(sortOption);
                }}
            />
            {isNewModalOpened && <New isOpened={isNewModalOpened} open={setNewModalOpened} />}
            {modalData && (
                <Detail
                    review={modalData}
                    isOpened={isDetailModalOpened}
                    closeModal={() => setIsDetailModalOpened(false)}
                />
            )}
        </main>
    );
};

export default Main;

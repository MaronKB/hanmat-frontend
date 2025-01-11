import React, { useEffect, useState } from 'react';
import styles from './AdminReviews.module.css';

interface ReviewDTO {
    id: number;
    restaurantName: string;
    title: string;
    content: string;
    imageUrl: string;
    regDate: string;
    isHidden: boolean;
    isReported: boolean;
}

interface Review {
    id: number;
    restaurantName: string;
    title: string;
    content: string;
    imageUrl: string;
    regDate: string;
    isHidden: boolean;
    isReported: boolean;
}

const AdminReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('restaurantName');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rowsPerPage = 10;

    const fetchReviews = async (page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/hanmat/api/post/all?page=${page}&size=${rowsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();
                console.log('Raw data from backend:', data);

                const reviewDTOs: ReviewDTO[] = data.data.items;

                const transformedReviews: Review[] = reviewDTOs.map((dto) => ({
                    id: dto.id,
                    restaurantName: dto.restaurantName,
                    title: dto.title,
                    content: dto.content,
                    imageUrl: dto.imageUrl || 'https://via.placeholder.com/50x50',
                    regDate: dto.regDate,
                    isHidden: dto.isHidden,
                    isReported: dto.isReported,
                }));

                setReviews(transformedReviews);
                setTotalPages(data.data.totalPages);
            } else {
                console.error('Failed to fetch reviews');
                setError('데이터를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }

        const filteredReviews = reviews.filter((review) => {
            const keyword = searchKeyword.toLowerCase();
            switch (searchCategory) {
                case 'restaurantName':
                    return review.restaurantName.toLowerCase().includes(keyword);
                case 'title':
                    return review.title.toLowerCase().includes(keyword);
                case 'content':
                    return review.content.toLowerCase().includes(keyword);
                default:
                    return true;
            }
        });

        setReviews(filteredReviews);
        setTotalPages(Math.ceil(filteredReviews.length / rowsPerPage));
        setCurrentPage(1);
    };

    const createPagination = () => {
        const pageButtons = [];

        pageButtons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageBtn}
            >
                &lt;
            </button>
        );

        for (let i = 1; i <= totalPages; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${styles.pageBtn} ${currentPage === i ? styles.active : ''}`}
                >
                    {i}
                </button>
            );
        }

        pageButtons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
            >
                &gt;
            </button>
        );

        return pageButtons;
    };

    return (
        <div className={styles.container}>
            {isLoading && <p>로딩 중...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.searchContainer}>
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className={styles.selectBox}
                >
                    <option value="restaurantName">식당이름</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className={styles.inputBox}
                />
                <button onClick={handleSearch} className={styles.searchBtn}>
                    조회
                </button>
            </div>

            <table className={styles.reviewTable}>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>식당이름</th>
                    <th>제목</th>
                    <th>내용</th>
                    <th>사진</th>
                    <th>등록일시</th>
                    <th>숨겨짐</th>
                    <th>신고여부</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>{review.restaurantName}</td>
                        <td>{review.title}</td>
                        <td>{review.content}</td>
                        <td>
                            <img
                                src={review.imageUrl}
                                alt="리뷰 이미지"
                                className={styles.reviewImage}
                            />
                        </td>
                        <td>{review.regDate}</td>
                        <td>{review.isHidden ? '숨김' : '표시'}</td>
                        <td>{review.isReported ? '신고됨' : '미신고'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.pagination}>{createPagination()}</div>
        </div>
    );
};

export default AdminReviews;

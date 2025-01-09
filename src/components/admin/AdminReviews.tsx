import React, {useEffect, useState} from 'react';
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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editReview, setEditReview] = useState<Review | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rowsPerPage = 20;

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8080/hanmat/api/post/all');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Raw data from backend:', data);
                    setTotalPages(data.data.totalPages);

                    const reviewDTOs: ReviewDTO[] = data.data.items;

                    const transformedReviews: Review[] = reviewDTOs.map(
                        (dto) => ({
                            id: dto.id,
                            restaurantName: dto.restaurantName,
                            title: dto.title,
                            content: dto.content,
                            imageUrl: dto.imageUrl,
                            regDate: dto.regDate,
                            isHidden: dto.isHidden,
                            isReported: dto.isReported,
                        })
                    );
                    console.log('Transformed data:', transformedReviews);

                    setReviews(transformedReviews);
                    setTotalPages(Math.ceil(transformedReviews.length / rowsPerPage));
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

        fetchReviews();
    }, []);

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        reviewId: number
    ) => {
        if (event.target.checked) {
            setSelectedReviews([...selectedReviews, reviewId]);
        } else {
            setSelectedReviews(
                selectedReviews.filter((id) => id !== reviewId)
            );
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allReviewIds = reviews.map((review) => review.id);
            setSelectedReviews(allReviewIds);
        } else {
            setSelectedReviews([]);
        }
    };

    const handleDelete = () => {
        if (selectedReviews.length === 0) {
            alert('삭제할 리뷰를 선택해주세요.');
            return;
        }

        if (!confirm('해당 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        const updatedReviews = reviews.filter(
            (review) => !selectedReviews.includes(review.id)
        );
        setReviews(updatedReviews);
        setSelectedReviews([]);
        setTotalPages(Math.ceil(updatedReviews.length / rowsPerPage));
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
                case 'isReported':
                    return review.isReported.toString().includes(keyword);
                default:
                    return true;
            }
        });

        setReviews(filteredReviews);
        setTotalPages(Math.ceil(filteredReviews.length / rowsPerPage));
        setCurrentPage(1);
    };

    const handleEdit = (review: Review) => {
        setEditReview(review);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditReview(null);
    };

    const handleSaveEdit = () => {
        if (!editReview) return;

        const updatedReviews = reviews.map((review) =>
            review.id === editReview.id ? editReview : review
        );
        setReviews(updatedReviews);
        handleCloseModal();
    };

    const getCurrentPageReviews = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return reviews.slice(startIndex, endIndex);
    };

    const createPagination = () => {
        const pageButtons = [];

        pageButtons.push(
            <button
                key="prev"
                onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(i)}
                    className={`${styles.pageBtn} ${
                        currentPage === i ? styles.active : ''
                    }`}
                >
                    {i}
                </button>
            );
        }

        pageButtons.push(
            <button
                key="next"
                onClick={() => setCurrentPage(currentPage + 1)}
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
            <div className={styles.searchContainer}>
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className={styles.selectBox}
                >
                    <option value="restaurantName">식당이름</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="isReported">신고여부</option>
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
                    <th className={styles.checkboxCell}>
                        <input
                            type="checkbox"
                            checked={
                                selectedReviews.length === reviews.length &&
                                reviews.length > 0
                            }
                            onChange={handleSelectAll}
                        />
                    </th>
                    <th className={styles.idCell}>번호</th>
                    <th className={styles.restaurantNameCell}>식당이름</th>
                    <th className={styles.titleCell}>제목</th>
                    <th className={styles.contentCell}>내용</th>
                    <th className={styles.imageCell}>사진</th>
                    <th className={styles.regDateCell}>등록일시</th>
                    <th className={styles.hiddenCell}>숨겨짐</th>
                    <th className={styles.reportCell}>신고여부</th>
                    <th className={styles.editCell}>수정</th>
                </tr>
                </thead>
                <tbody>
                {getCurrentPageReviews().map((review) => (
                    <tr key={review.id}>
                        <td className={styles.checkboxCell}>
                            <input
                                type="checkbox"
                                checked={selectedReviews.includes(review.id)}
                                onChange={(e) => handleCheckboxChange(e, review.id)}
                            />
                        </td>
                        <td className={styles.idCell}>{review.id}</td>
                        <td className={styles.restaurantNameCell}>
                            {review.restaurantName}
                        </td>
                        <td className={styles.titleCell}>{review.title}</td>
                        <td className={styles.contentCell}>{review.content}</td>
                        <td className={styles.imageCell}>
                            <img
                                src={review.imageUrl}
                                alt="리뷰 이미지"
                                className={styles.reviewImage}
                            />
                        </td>
                        <td className={styles.regDateCell}>
                            {review.regDate}
                        </td>
                        <td className={styles.hiddenCell}>
                            {review.isHidden ? '숨김' : '표시'}
                        </td>
                        <td className={styles.reportCell}>
                            {review.isReported ? '신고됨' : '미신고'}
                        </td>
                        <td className={styles.editCell}>
                            <button
                                onClick={() => handleEdit(review)}
                                className={styles.editBtn}
                            >
                                수정
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.controls}>
                <div className={styles.pagination}>{createPagination()}</div>

                <div className={styles.buttons}>
                    <button onClick={handleDelete} className={styles.deleteBtn}>
                        삭제
                    </button>
                </div>
            </div>

            {/*모달*/}
            {showModal && editReview && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>리뷰 수정</h2>
                        <label className={styles.modalLabel}>
                            식당이름:
                            <input
                                type="text"
                                value={editReview.restaurantName}
                                onChange={(e) =>
                                    setEditReview({
                                        ...editReview,
                                        restaurantName: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            제목:
                            <input
                                type="text"
                                value={editReview.title}
                                onChange={(e) =>
                                    setEditReview({
                                        ...editReview,
                                        title: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            내용:
                            <input
                                type="text"
                                value={editReview.content}
                                onChange={(e) =>
                                    setEditReview({
                                        ...editReview,
                                        content: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            사진 URL:
                            <input
                                type="text"
                                value={editReview.imageUrl}
                                onChange={(e) =>
                                    setEditReview({
                                        ...editReview,
                                        imageUrl: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            등록일시:
                            <input
                                type="text"
                                value={editReview.regDate}
                                disabled
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            숨겨짐:
                            <select
                                value={editReview.isHidden ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditReview({
                                        ...editReview,
                                        isHidden: e.target.value === 'true',
                                    })
                                }
                                className={styles.selectBox}
                            >
                                <option value="true">숨김</option>
                                <option value="false">표시</option>
                            </select>
                        </label>
                        <label className={styles.modalLabel}>
                            신고여부:
                            <select
                                value={editReview.isReported ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditReview({
                                        ...editReview,
                                        isReported: e.target.value === 'true',
                                    })
                                }
                                className={styles.selectBox}
                            >
                                <option value="true">신고됨</option>
                                <option value="false">미신고</option>
                            </select>
                        </label>
                        <div className={styles.modalButtons}>
                            <button onClick={handleSaveEdit} className={styles.saveBtn}>
                                저장
                            </button>
                            <button onClick={handleCloseModal} className={styles.closeBtn}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;

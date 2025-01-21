import React, {useState, useEffect} from 'react';
import styles from './AdminReviews.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';



interface Review {
    id: number;
    restaurantId: string;
    author: string;
    rating: number;
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
    const [searchCategory, setSearchCategory] = useState<string>('title');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [appliedSearchKeyword, setAppliedSearchKeyword] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const [newReview, setNewReview] = useState<Review>({
        id: 0,
        restaurantId: '',
        author: '',
        rating: 0,
        title: '',
        content: '',
        imageUrl: '',
        regDate: '',
        isHidden: false,
        isReported: false,
    });

    const rowsPerPage = 10;

    const fetchReviews = async (category: string, keyword: string, page: number) => {
        const endpoint =
            keyword.trim()
                ? `${import.meta.env.VITE_BACKEND_URL}/api/post/search?category=${category}&keyword=${keyword}&page=${page}&size=${rowsPerPage}`
                : `${import.meta.env.VITE_BACKEND_URL}/api/post/all?page=${page}&size=${rowsPerPage}`;

        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                const reviews: Review[] = data.data.items.map((review: any) => ({
                    id: review.id,
                    restaurantId: review.restaurantId,
                    author: review.author,
                    rating: review.rating,
                    title: review.title,
                    content: review.content,
                    imageUrl: review.image1 || 'https://via.placeholder.com/50x50',
                    regDate: review.regDate,
                    isHidden: review.isHidden,
                    isReported: review.isReported,
                }));

                setReviews(reviews);
                setTotalPages(data.data.totalPages);
            } else {
                console.error('Failed to fetch reviews.');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews(searchCategory, appliedSearchKeyword, currentPage);
    }, [currentPage, searchCategory, appliedSearchKeyword]);

    const handleSearch = () => {
        setAppliedSearchKeyword(searchKeyword);
        setCurrentPage(1);
    };

    const handleCheckboxChange = (reviewId: number) => {
        setSelectedReviews((prev) =>
            prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedReviews(reviews.map((review) => review.id));
        } else {
            setSelectedReviews([]);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const createPagination = () => {
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className={styles.pagination}>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        );
    };

    const handleDelete = async () => {
        if (selectedReviews.length === 0) {
            alert('삭제할 리뷰를 선택해주세요.');
            return;
        }

        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedReviews),
            });

            if (response.ok) {
                alert('리뷰가 삭제되었습니다.');
                fetchReviews(searchCategory, appliedSearchKeyword, currentPage);
                setSelectedReviews([]);
            } else {
                console.error('Failed to delete reviews.');
            }
        } catch (error) {
            console.error('Error deleting reviews:', error);
        }
    };

    const saveReview = async () => {
        if (!selectedReview) return;

        const payload = {
            ...selectedReview,
            isHidden: selectedReview.isHidden,
            isReported: selectedReview.isReported,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Review updated successfully.');
                fetchReviews(searchCategory, appliedSearchKeyword, currentPage);
                setIsModalOpen(false);
            } else {
                console.error('Failed to update review.');
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    // 추가
    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setNewReview({
            id: 0,
            restaurantId: '',
            author: '',
            rating: 0,
            title: '',
            content: '',
            imageUrl: '',
            regDate: '',
            isHidden: false,
            isReported: false,
        });
        setIsAddModalOpen(false);
    };

    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReview({
            ...newReview,
            [name]: value,
        });
    };

    const handleAddReview = async () => {
        if (!newReview.restaurantId || !newReview.title || !newReview.content || newReview.rating === 0) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const payload = {
            restaurantId: newReview.restaurantId,
            author: newReview.author || 'system@hanmat.com',
            title: newReview.title,
            content: newReview.content,
            imageUrl: newReview.imageUrl || '',
            regDate: newReview.regDate || new Date().toISOString(),
            rating: newReview.rating,  // rating 추가
            isHidden: newReview.isHidden,
            isReported: newReview.isReported,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("리뷰가 성공적으로 추가되었습니다.");
                fetchReviews(searchCategory, appliedSearchKeyword, currentPage);
                handleCloseAddModal();
            } else {
                const result = await response.json();
                alert(`추가 실패: ${result.message}`);
            }
        } catch (error) {
            alert("추가 중 오류가 발생했습니다.");
            console.error(error);
        }
    };




    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className={styles.selectBox}
                >
                    <option value="restaurantId">식당 번호</option>
                    <option value="author">작성자</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="regDate">등록일시</option>
                    <option value="isHidden">숨김 여부</option>
                    <option value="isReported">신고 여부</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className={styles.inputBox}
                />
                <button onClick={handleSearch} className={styles.searchBtn}>
                    검색
                </button>
            </div>

            <table className={styles.reviewTable}>
                <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedReviews.length === reviews.length}
                        />
                    </th>
                    <th>번호</th>
                    <th>식당 번호</th>
                    <th>작성자</th>
                    <th>별점</th>
                    <th>제목</th>
                    <th>내용</th>
                    <th>사진</th>
                    <th>등록일시</th>
                    <th>숨김 여부</th>
                    <th>신고 여부</th>
                    <th>수정</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedReviews.includes(review.id)}
                                onChange={() => handleCheckboxChange(review.id)}
                            />
                        </td>
                        <td>{review.id}</td>
                        <td>{review.restaurantId}</td>
                        <td>{review.author}</td>
                        <td>
                            {Array.from({length: 5}, (_, index) => (
                                <FontAwesomeIcon
                                    key={index}
                                    icon={index < review.rating ? solidStar : regularStar}
                                    className={styles.starIcon}
                                />
                            ))}
                        </td>
                        <td>{review.title}</td>
                        <td>{review.content}</td>
                        <td>
                            <img src={review.imageUrl} alt="리뷰 이미지" className={styles.reviewImage}/>
                        </td>
                        <td>{review.regDate}</td>
                        <td>{review.isHidden ? '숨김' : '표시'}</td>
                        <td>{review.isReported ? '신고됨' : '미신고'}</td>
                        <td>
                            <button
                                className={styles.editBtn}
                                onClick={() => {
                                    setSelectedReview(review);
                                    setIsModalOpen(true);
                                }}
                            >
                                수정
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.controls}>
                <div className={styles.buttons}>
                    <button onClick={handleOpenAddModal} className={styles.addBtn}>
                        추가
                    </button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>
                        삭제
                    </button>
                </div>
                <div className={styles.pgn}>
                    {createPagination()}
                </div>
            </div>

            {isModalOpen && selectedReview && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>리뷰 수정</h2>
                        <label className={styles.modalLabel}>
                            별점
                            <div>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <FontAwesomeIcon
                                        key={num}
                                        icon={num <= (hoverRating ?? selectedReview.rating) ? solidStar : regularStar}
                                        className={`${styles.editStarIcon} ${num <= (hoverRating ?? selectedReview.rating) ? styles.filled : ''}`}
                                        onClick={() => setSelectedReview({...selectedReview, rating: num})}
                                        onMouseEnter={() => setHoverRating(num)}
                                        onMouseLeave={() => setHoverRating(null)}
                                    />
                                ))}
                            </div>
                        </label>
                        <label>
                            제목
                            <input
                                type="text"
                                value={selectedReview.title}
                                onChange={(e) =>
                                    setSelectedReview({...selectedReview, title: e.target.value} as Review)
                                }
                            />
                        </label>
                        <label>
                            내용
                            <textarea
                                value={selectedReview.content}
                                onChange={(e) =>
                                    setSelectedReview({...selectedReview, content: e.target.value} as Review)
                                }
                            />
                        </label>
                        <label>
                            숨김 여부
                            <select
                                value={selectedReview.isHidden ? '숨김' : '표시'}
                                onChange={(e) =>
                                    setSelectedReview({
                                        ...selectedReview,
                                        isHidden: e.target.value === '숨김',
                                    } as Review)
                                }
                            >
                                <option value="표시">표시</option>
                                <option value="숨김">숨김</option>
                            </select>
                        </label>
                        <label>
                            신고 여부
                            <select
                                value={selectedReview.isReported ? '신고됨' : '미신고'}
                                onChange={(e) =>
                                    setSelectedReview({
                                        ...selectedReview,
                                        isReported: e.target.value === '신고됨',
                                    } as Review)
                                }
                            >
                                <option value="미신고">미신고</option>
                                <option value="신고됨">신고됨</option>
                            </select>
                        </label>
                        <button onClick={saveReview}>저장</button>
                        <button onClick={() => setIsModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>리뷰 추가</h2>
                        <label className={styles.modalLabel}>
                            식당 번호
                            <input
                                type="text"
                                name="restaurantId"
                                value={newReview.restaurantId}
                                onChange={handleNewInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            작성자
                            <input
                                type="text"
                                name="author"
                                value={newReview.author}
                                onChange={handleNewInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            별점
                            <div>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <FontAwesomeIcon
                                        key={num}
                                        icon={num <= (hoverRating ?? newReview.rating) ? solidStar : regularStar}
                                        className={`${styles.editStarIcon} ${num <= (hoverRating ?? newReview.rating) ? styles.filled : ''}`}
                                        onClick={() => setNewReview({...newReview, rating: num})}
                                        onMouseEnter={() => setHoverRating(num)}
                                        onMouseLeave={() => setHoverRating(null)}
                                    />
                                ))}
                            </div>
                        </label>
                        <label className={styles.modalLabel}>
                            제목
                            <input
                                type="text"
                                name="title"
                                value={newReview.title}
                                onChange={handleNewInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            내용
                            <textarea
                                name="content"
                                value={newReview.content}
                                onChange={handleNewInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            이미지 URL
                            <input
                                type="text"
                                name="imageUrl"
                                value={newReview.imageUrl}
                                onChange={handleNewInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            등록일시
                            <input
                                type="datetime-local"
                                name="regDate"
                                value={newReview.regDate}
                                onChange={handleNewInputChange}
                            />
                        </label>
                        {/*<label className={styles.modalLabel}>*/}
                        {/*    숨김 여부*/}
                        {/*    <select name="isHidden" value={newReview.isHidden ? '숨김' : '표시'} onChange={handleNewInputChange}>*/}
                        {/*        <option value="false">표시</option>*/}
                        {/*        <option value="true">숨김</option>*/}
                        {/*    </select>*/}
                        {/*</label>*/}
                        {/*<label className={styles.modalLabel}>*/}
                        {/*    신고 여부*/}
                        {/*    <select name="isReported" value={newReview.isReported ? '신고됨' : '미신고'} onChange={handleNewInputChange}>*/}
                        {/*        <option value="false">미신고</option>*/}
                        {/*        <option value="true">신고됨</option>*/}
                        {/*    </select>*/}
                        {/*</label>*/}
                        <div className={styles.modalButtons}>
                            <button className={styles.saveBtn} onClick={handleAddReview}>추가</button>
                            <button className={styles.closeBtn} onClick={handleCloseAddModal}>닫기</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminReviews;

import React, { useState } from 'react';
import styles from './AdminReviews.module.css';

interface Restaurant {
    id: number;
    restaurantName: string;
    title: string;
    content: string;
    imageUrl: string;
    registrationDate: string;
    isHidden: boolean;
    isReported: boolean;
}

// 임시
const initialRestaurants: Restaurant[] = [
    {
        id: 1,
        restaurantName: '맛집1',
        title: '리뷰1 제목',
        content: '리뷰1 내용',
        imageUrl: 'https://via.placeholder.com/50x50',
        registrationDate: '2023-01-01',
        isHidden: false,
        isReported: false,
    },
    {
        id: 2,
        restaurantName: '맛집2',
        title: '리뷰2 제목',
        content: '리뷰2 내용',
        imageUrl: 'https://via.placeholder.com/50x50',
        registrationDate: '2023-02-15',
        isHidden: true,
        isReported: true,
    },
    {
        id: 3,
        restaurantName: '맛집2',
        title: '리뷰3 제목',
        content: '리뷰3 내용',
        imageUrl: 'https://via.placeholder.com/50x50',
        registrationDate: '2023-02-15',
        isHidden: true,
        isReported: true,
    },
    {
        id: 4,
        restaurantName: '맛집2',
        title: '리뷰4 제목',
        content: '리뷰4 내용',
        imageUrl: 'https://via.placeholder.com/50x50',
        registrationDate: '2023-02-15',
        isHidden: true,
        isReported: true,
    },
    {
        id: 5,
        restaurantName: '맛집2',
        title: '리뷰5 제목',
        content: '리뷰5 내용',
        imageUrl: 'https://via.placeholder.com/50x50',
        registrationDate: '2023-02-15',
        isHidden: true,
        isReported: true,
    },
    {
        id: 6,
        restaurantName: '맛집2',
        title: '리뷰6 제목',
        content: '리뷰6 내용',
        imageUrl: 'https://via.placeholder.com/50x50',
        registrationDate: '2023-02-15',
        isHidden: true,
        isReported: true,
    },

];

const AdminReviews: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(
        Math.ceil(initialRestaurants.length / 20)
    );
    const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('restaurantName');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);

    const rowsPerPage = 20;


    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        restaurantId: number
    ) => {
        if (event.target.checked) {
            setSelectedRestaurants([...selectedRestaurants, restaurantId]);
        } else {
            setSelectedRestaurants(
                selectedRestaurants.filter((id) => id !== restaurantId)
            );
        }
    };


    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allRestaurantIds = restaurants.map((restaurant) => restaurant.id);
            setSelectedRestaurants(allRestaurantIds);
        } else {
            setSelectedRestaurants([]);
        }
    };


    const handleDelete = () => {
        if (selectedRestaurants.length === 0) {
            alert('삭제할 리뷰를 선택해주세요.');
            return;
        }

        if (!confirm('해당 리뷰를 삭제하시겠습니까?')) {
            return;
        }


        const updatedRestaurants = restaurants.filter(
            (restaurant) => !selectedRestaurants.includes(restaurant.id)
        );
        setRestaurants(updatedRestaurants);
        setSelectedRestaurants([]);
        setTotalPages(Math.ceil(updatedRestaurants.length / rowsPerPage));
    };


    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }


        const filteredRestaurants = initialRestaurants.filter((restaurant) => {
            const keyword = searchKeyword.toLowerCase();
            switch (searchCategory) {
                case 'restaurantName':
                    return restaurant.restaurantName.toLowerCase().includes(keyword);
                case 'title':
                    return restaurant.title.toLowerCase().includes(keyword);
                case 'content':
                    return restaurant.content.toLowerCase().includes(keyword);
                case 'isReported':
                    return restaurant.isReported.toString().includes(keyword);
                default:
                    return true;
            }
        });

        setRestaurants(filteredRestaurants);
        setTotalPages(Math.ceil(filteredRestaurants.length / rowsPerPage));
        setCurrentPage(1);
    };


    const handleEdit = (restaurant: Restaurant) => {
        setEditRestaurant(restaurant);
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setEditRestaurant(null);
    };


    const handleSaveEdit = () => {
        if (!editRestaurant) return;


        const updatedRestaurants = restaurants.map((restaurant) =>
            restaurant.id === editRestaurant.id ? editRestaurant : restaurant
        );
        setRestaurants(updatedRestaurants);
        handleCloseModal();
    };


    const getCurrentPageRestaurants = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return restaurants.slice(startIndex, endIndex);
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

            <table className={styles.restaurantTable}>
                <thead>
                <tr>
                    <th className={styles.checkboxCell}>
                        <input
                            type="checkbox"
                            checked={
                                selectedRestaurants.length === restaurants.length &&
                                restaurants.length > 0
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
                {getCurrentPageRestaurants().map((restaurant) => (
                    <tr key={restaurant.id}>
                        <td className={styles.checkboxCell}>
                            <input
                                type="checkbox"
                                checked={selectedRestaurants.includes(restaurant.id)}
                                onChange={(e) => handleCheckboxChange(e, restaurant.id)}
                            />
                        </td>
                        <td className={styles.idCell}>{restaurant.id}</td>
                        <td className={styles.restaurantNameCell}>
                            {restaurant.restaurantName}
                        </td>
                        <td className={styles.titleCell}>{restaurant.title}</td>
                        <td className={styles.contentCell}>{restaurant.content}</td>
                        <td className={styles.imageCell}>
                            <img
                                src={restaurant.imageUrl}
                                alt="식당 이미지"
                                className={styles.restaurantImage}
                            />
                        </td>
                        <td className={styles.regDateCell}>
                            {restaurant.registrationDate}
                        </td>
                        <td className={styles.hiddenCell}>
                            {restaurant.isHidden ? '숨김' : '표시'}
                        </td>
                        <td className={styles.reportCell}>
                            {restaurant.isReported ? '신고됨' : '미신고'}
                        </td>
                        <td className={styles.editCell}>
                            <button
                                onClick={() => handleEdit(restaurant)}
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
            {showModal && editRestaurant && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </span>
                        <h2 className={styles.modalTitle}>리뷰 수정</h2>
                        <label className={styles.modalLabel}>
                            번호:
                            <input
                                type="text"
                                value={editRestaurant.id}
                                disabled
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            식당이름:
                            <input
                                type="text"
                                value={editRestaurant.restaurantName}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
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
                                value={editRestaurant.title}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
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
                                value={editRestaurant.content}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
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
                                value={editRestaurant.imageUrl}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
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
                                value={editRestaurant.registrationDate}
                                disabled
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            숨겨짐:
                            <select
                                value={editRestaurant.isHidden ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
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
                                value={editRestaurant.isReported ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
                                        isReported: e.target.value === 'true',
                                    })
                                }
                                className={styles.selectBox}
                            >
                                <option value="true">신고됨</option>
                                <option value="false">미신고</option>
                            </select>
                        </label>
                        <button onClick={handleSaveEdit} className={styles.saveBtn}>
                            저장
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
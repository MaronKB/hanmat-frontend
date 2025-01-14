import React, { useState, useEffect } from 'react';
import styles from './AdminRestaurants.module.css';

interface RestaurantDTO {
    id: number;
    name: string;
    lmmAddr: string;
    roadAddr: string;
    latitude: number;
    longitude: number;
    regDate: string;
    closed: boolean;
}

interface Restaurant {
    id: number;
    name: string;
    location: string;
    roadAddress: string;
    registrationDate: string;
    isClosed: string;
}

const AdminRestaurants: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('name');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [startPage, setStartPage] = useState<number>(1);
    const [endPage, setEndPage] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);


    const rowsPerPage = 20;

    const fetchRestaurants = async (category: string, keyword: string, page: number) => {
        setIsLoading(true);
        setError(null);

        const endpoint =
            category && keyword
                ? `http://localhost:8080/hanmat/api/restaurant/search?category=${category}&keyword=${keyword}&page=${page}&size=${rowsPerPage}`
                : `http://localhost:8080/hanmat/api/restaurant/all?page=${page}&size=${rowsPerPage}`;

        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                const restaurantDTOs: RestaurantDTO[] = data.data.items;

                const transformedRestaurants: Restaurant[] = restaurantDTOs.map((dto) => ({
                    id: dto.id,
                    name: dto.name,
                    location: dto.lmmAddr,
                    roadAddress: dto.roadAddr,
                    registrationDate: dto.regDate,
                    isClosed: dto.closed ? '폐업' : '영업 중',
                }));

                setRestaurants(transformedRestaurants);
                setTotalPages(data.data.totalPages);
            } else {
                setError('데이터를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 자동 검색
    // useEffect(() => {
    //     fetchRestaurants(searchCategory, searchKeyword, currentPage);
    // }, [currentPage, searchCategory, searchKeyword]);

    // 수동 검색
    useEffect(() => {
        fetchRestaurants(searchCategory, searchKeyword, currentPage);
    }, [currentPage, searchCategory]);


    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        setCurrentPage(1);
        fetchRestaurants(searchCategory, searchKeyword, 1);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
        setStartPage(1);
        setEndPage(10);
    };

    const handleLastPage = () => {
        const lastStartPage = Math.floor((totalPages - 1) / 10) * 10 + 1;
        setCurrentPage(totalPages);
        setStartPage(lastStartPage);
        setEndPage(totalPages);
    };

    const handleNextGroup = () => {
        if (endPage < totalPages) {
            setStartPage(startPage + 10);
            setEndPage(Math.min(endPage + 10, totalPages));
            setCurrentPage(startPage + 10);
        }
    };

    const handlePrevGroup = () => {
        if (startPage > 1) {
            setStartPage(startPage - 10);
            setEndPage(startPage - 1);
            setCurrentPage(startPage - 10);
        }
    };

    const createPagination = () => {
        const pageButtons = [];

        for (let i = startPage; i <= endPage && i <= totalPages; i++) {
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

        return (
            <div className={styles.pagination}>
                <button onClick={handleFirstPage} disabled={currentPage === 1} className={styles.pageBtn}>
                    처음
                </button>
                <button onClick={handlePrevGroup} disabled={startPage === 1} className={styles.pageBtn}>
                    이전
                </button>
                {pageButtons}
                <button onClick={handleNextGroup} disabled={endPage >= totalPages} className={styles.pageBtn}>
                    다음
                </button>
                <button onClick={handleLastPage} disabled={currentPage === totalPages} className={styles.pageBtn}>
                    끝
                </button>
            </div>
        );
    };

    const saveRestaurant = async () => {
        if (!selectedRestaurant) {
            alert('수정할 데이터를 선택해주세요.');
            return;
        }

        // 서버로 전송할 데이터 준비
        const payload = {
            id: selectedRestaurant.id,
            name: selectedRestaurant.name,
            lmmAddr: selectedRestaurant.location,
            roadAddr: selectedRestaurant.roadAddress,
            regDate: selectedRestaurant.registrationDate,
            closed: selectedRestaurant.isClosed === "폐업",
        };

        try {
            const response = await fetch('http://localhost:8080/hanmat/api/restaurant/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('데이터가 성공적으로 수정되었습니다.');
                // 데이터 갱신
                fetchRestaurants(searchCategory, searchKeyword, currentPage);
                handleCloseModal();
            } else {
                const errorData = await response.json();
                alert(`수정 실패: ${errorData.message}`);
            }
        } catch (error) {
            alert(`서버와의 통신 중 오류가 발생했습니다: ${error}`);
        }
    };


    const handleOpenModal = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedRestaurant(null);
        setIsModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedRestaurant) {
            setSelectedRestaurant({
                ...selectedRestaurant,
                [e.target.name]: e.target.value,
            });
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
                    <option value="name">식당이름</option>
                    <option value="location">식당 위치</option>
                    <option value="roadAddress">도로명 주소</option>
                    <option value="regDate">등록일시</option>
                    <option value="closed">폐업 여부</option>
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

            {isLoading && <p>데이터를 불러오는 중입니다...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <table className={styles.restaurantTable}>
                <thead>
                <tr>
                    <th className={styles.checkboxCell}>
                        <input
                            type="checkbox"
                            checked={selectedRestaurants.length === restaurants.length}
                            onChange={(e) =>
                                setSelectedRestaurants(
                                    e.target.checked ? restaurants.map((r) => r.id) : []
                                )
                            }
                        />
                    </th>
                    <th className={styles.idCell}>번호</th>
                    <th className={styles.restaurantNameCell}>식당이름</th>
                    <th className={styles.locationCell}>식당 위치</th>
                    <th className={styles.roadAddressCell}>도로명 주소</th>
                    <th className={styles.regDateCell}>등록일시</th>
                    <th className={styles.closedCell}>폐업 여부</th>
                    <th className={styles.editCell}>수정</th>
                </tr>
                </thead>
                <tbody>
                {restaurants.map((restaurant) => (
                    <tr key={restaurant.id}>
                        <td className={styles.checkboxCell}>
                            <input
                                type="checkbox"
                                checked={selectedRestaurants.includes(restaurant.id)}
                                onChange={(e) =>
                                    setSelectedRestaurants((prev) =>
                                        e.target.checked
                                            ? [...prev, restaurant.id]
                                            : prev.filter((id) => id !== restaurant.id)
                                    )
                                }
                            />
                        </td>
                        <td>{restaurant.id}</td>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.location}</td>
                        <td>{restaurant.roadAddress}</td>
                        <td>{restaurant.registrationDate}</td>
                        <td>{restaurant.isClosed}</td>
                        <td>
                            <button
                                className={styles.editBtn}
                                onClick={() => handleOpenModal(restaurant)}
                            >
                                수정
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.controls}>
                {createPagination()}
                <button onClick={() => alert('삭제 기능은 현재 지원되지 않습니다.')} className={styles.deleteBtn}>
                    삭제
                </button>
            </div>

            {isModalOpen && selectedRestaurant && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>식당 정보 수정</h2>
                        <label className={styles.modalLabel}>
                            식당 이름
                            <input
                                type="text"
                                name="name"
                                value={selectedRestaurant.name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            식당 위치
                            <input
                                type="text"
                                name="location"
                                value={selectedRestaurant.location}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            도로명 주소
                            <input
                                type="text"
                                name="roadAddress"
                                value={selectedRestaurant.roadAddress}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            등록일시
                            <input
                                type="text"
                                name="registrationDate"
                                value={selectedRestaurant.registrationDate}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            폐업 여부
                            <select
                                name="isClosed"
                                value={selectedRestaurant.isClosed}
                                onChange={handleInputChange}
                            >
                                <option value="영업 중">영업 중</option>
                                <option value="폐업">폐업</option>
                            </select>
                        </label>
                        <div className={styles.modalButtons}>
                            <button className={styles.saveBtn} onClick={saveRestaurant}>
                                저장
                            </button>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminRestaurants;

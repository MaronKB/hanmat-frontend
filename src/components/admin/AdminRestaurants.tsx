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

    const rowsPerPage = 20;

    const fetchRestaurants = async (page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/hanmat/api/restaurant/all?page=${page}&size=${rowsPerPage}`);
            if (response.ok) {
                const data = await response.json();

                const restaurantDTOs: RestaurantDTO[] = data.data.items;
                const transformedRestaurants: Restaurant[] = restaurantDTOs.map((dto) => ({
                    id: dto.id,
                    name: dto.name,
                    location: dto.roadAddr,
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

    useEffect(() => {
        fetchRestaurants(currentPage);
    }, [currentPage]);

    const fetchFilteredRestaurants = async (category: string, keyword: string, page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/hanmat/api/restaurant/search?category=${category}&keyword=${keyword}&page=${page}&size=${rowsPerPage}`
            );
            if (response.ok) {
                const data = await response.json();

                const restaurantDTOs: RestaurantDTO[] = data.data.items;
                const transformedRestaurants: Restaurant[] = restaurantDTOs.map((dto) => ({
                    id: dto.id,
                    name: dto.name,
                    location: dto.roadAddr,
                    roadAddress: dto.roadAddr,
                    registrationDate: dto.regDate,
                    isClosed: dto.closed ? '폐업' : '영업 중',
                }));

                setRestaurants(transformedRestaurants);
                setTotalPages(data.data.totalPages);
            } else {
                setError('검색 결과를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            setError('검색 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, restaurantId: number) => {
        if (event.target.checked) {
            setSelectedRestaurants((prev) => [...prev, restaurantId]);
        } else {
            setSelectedRestaurants((prev) => prev.filter((id) => id !== restaurantId));
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedRestaurants(restaurants.map((restaurant) => restaurant.id));
        } else {
            setSelectedRestaurants([]);
        }
    };

    const handleDelete = () => {
        if (selectedRestaurants.length === 0) {
            alert('삭제할 식당을 선택해주세요.');
            return;
        }
        alert('현재는 삭제 기능이 지원되지 않습니다.');
    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        fetchFilteredRestaurants(searchCategory, searchKeyword, 1);
        setCurrentPage(1);
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
                <button onClick={handleSearch} className={styles.searchBtn}>조회</button>
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
                            onChange={handleSelectAll}
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
                                onChange={(e) => handleCheckboxChange(e, restaurant.id)}
                            />
                        </td>
                        <td>{restaurant.id}</td>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.location}</td>
                        <td>{restaurant.roadAddress}</td>
                        <td>{restaurant.registrationDate}</td>
                        <td>{restaurant.isClosed}</td>
                        <td>
                            <button className={styles.editBtn} onClick={() => alert('수정 기능은 현재 지원되지 않습니다.')}>수정</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.controls}>
                {createPagination()}
                <button onClick={handleDelete} className={styles.deleteBtn}>삭제</button>
            </div>
        </div>
    );
};

export default AdminRestaurants;

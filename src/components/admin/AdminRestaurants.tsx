// import React, { useState } from 'react';
// import styles from './AdminRestaurants.module.css';
//
// interface Restaurant {
//     id: number;
//     name: string;
//     location: string;
//     roadAddress: string;
//     registrationDate: string;
//     isClosed: boolean;
// }
//
// // 임시
// const initialRestaurants: Restaurant[] = [
//     {
//         id: 1,
//         name: '식당1',
//         location: '서울시 강남구',
//         roadAddress: '서울시 강남구 역삼로 123',
//         registrationDate: '2023-01-10',
//         isClosed: false,
//     },
//     {
//         id: 2,
//         name: '식당2',
//         location: '서울시 서초구',
//         roadAddress: '서울시 서초구 서초대로 456',
//         registrationDate: '2023-03-22',
//         isClosed: false,
//     },
//     {
//         id: 3,
//         name: '식당3',
//         location: '서울시 종로구',
//         roadAddress: '서울시 종로구 종로 789',
//         registrationDate: '2023-05-15',
//         isClosed: true,
//     },
//     {
//         id: 4,
//         name: '식당4',
//         location: '서울시 마포구',
//         roadAddress: '서울시 마포구 월드컵북로 321',
//         registrationDate: '2023-07-03',
//         isClosed: false,
//     },
//     {
//         id: 5,
//         name: '식당5',
//         location: '서울시 용산구',
//         roadAddress: '서울시 용산구 이태원로 987',
//         registrationDate: '2023-09-18',
//         isClosed: false,
//     },
//     {
//         id: 6,
//         name: '식당6',
//         location: '서울시 중구',
//         roadAddress: '서울시 중구 명동길 654',
//         registrationDate: '2023-11-27',
//         isClosed: false,
//     },
// ];
//
// const AdminRestaurants: React.FC = () => {
//     const [restaurants, setRestaurants] = useState<Restaurant[]>(
//         initialRestaurants
//     );
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [totalPages, setTotalPages] = useState<number>(
//         Math.ceil(initialRestaurants.length / 20)
//     );
//     const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
//     const [searchCategory, setSearchCategory] = useState<string>('name');
//     const [searchKeyword, setSearchKeyword] = useState<string>('');
//     const [showModal, setShowModal] = useState<boolean>(false);
//     const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
//
//     const rowsPerPage = 20;
//
//
//     const handleCheckboxChange = (
//         event: React.ChangeEvent<HTMLInputElement>,
//         restaurantId: number
//     ) => {
//         if (event.target.checked) {
//             setSelectedRestaurants([...selectedRestaurants, restaurantId]);
//         } else {
//             setSelectedRestaurants(
//                 selectedRestaurants.filter((id) => id !== restaurantId)
//             );
//         }
//     };
//
//
//     const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.checked) {
//             const allRestaurantIds = restaurants.map((restaurant) => restaurant.id);
//             setSelectedRestaurants(allRestaurantIds);
//         } else {
//             setSelectedRestaurants([]);
//         }
//     };
//
//
//     const handleDelete = () => {
//         if (selectedRestaurants.length === 0) {
//             alert('삭제할 식당을 선택해주세요.');
//             return;
//         }
//
//         if (!confirm('식당을 삭제하시겠습니까?')) {
//             return;
//         }
//
//         const updatedRestaurants = restaurants.filter(
//             (restaurant) => !selectedRestaurants.includes(restaurant.id)
//         );
//         setRestaurants(updatedRestaurants);
//         setSelectedRestaurants([]);
//         setTotalPages(Math.ceil(updatedRestaurants.length / rowsPerPage));
//     };
//
//
//     const handleSearch = () => {
//         if (!searchKeyword.trim()) {
//             alert('검색어를 입력해주세요.');
//             return;
//         }
//
//         const filteredRestaurants = initialRestaurants.filter((restaurant) => {
//             const keyword = searchKeyword.toLowerCase();
//             switch (searchCategory) {
//                 case 'name':
//                     return restaurant.name.toLowerCase().includes(keyword);
//                 case 'location':
//                     return restaurant.location.toLowerCase().includes(keyword);
//                 case 'roadAddress':
//                     return restaurant.roadAddress.toLowerCase().includes(keyword);
//                 default:
//                     return true;
//             }
//         });
//
//         setRestaurants(filteredRestaurants);
//         setTotalPages(Math.ceil(filteredRestaurants.length / rowsPerPage));
//         setCurrentPage(1);
//     };
//
//
//     const handleEdit = (restaurant: Restaurant) => {
//         setEditRestaurant(restaurant);
//         setShowModal(true);
//     };
//
//
//     const handleCloseModal = () => {
//         setShowModal(false);
//         setEditRestaurant(null);
//     };
//
//
//     const handleSaveEdit = () => {
//         if (!editRestaurant) return;
//
//         const updatedRestaurants = restaurants.map((restaurant) =>
//             restaurant.id === editRestaurant.id ? editRestaurant : restaurant
//         );
//         setRestaurants(updatedRestaurants);
//         handleCloseModal();
//     };
//
//
//     const getCurrentPageRestaurants = () => {
//         const startIndex = (currentPage - 1) * rowsPerPage;
//         const endIndex = startIndex + rowsPerPage;
//         return restaurants.slice(startIndex, endIndex);
//     };
//
//
//     const createPagination = () => {
//         const pageButtons = [];
//
//
//         pageButtons.push(
//             <button
//                 key="prev"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={styles.pageBtn}
//             >
//                 &lt;
//             </button>
//         );
//
//
//         for (let i = 1; i <= totalPages; i++) {
//             pageButtons.push(
//                 <button
//                     key={i}
//                     onClick={() => setCurrentPage(i)}
//                     className={`${styles.pageBtn} ${
//                         currentPage === i ? styles.active : ''
//                     }`}
//                 >
//                     {i}
//                 </button>
//             );
//         }
//
//
//         pageButtons.push(
//             <button
//                 key="next"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={styles.pageBtn}
//             >
//                 &gt;
//             </button>
//         );
//
//         return pageButtons;
//     };
//
//     return (
//         <div className={styles.container}>
//             <div className={styles.searchContainer}>
//                 <select
//                     value={searchCategory}
//                     onChange={(e) => setSearchCategory(e.target.value)}
//                     className={styles.selectBox}
//                 >
//                     <option value="name">식당이름</option>
//                     <option value="location">식당 위치</option>
//                     <option value="roadAddress">도로명 주소</option>
//                 </select>
//                 <input
//                     type="text"
//                     placeholder="검색어를 입력하세요"
//                     value={searchKeyword}
//                     onChange={(e) => setSearchKeyword(e.target.value)}
//                     className={styles.inputBox}
//                 />
//                 <button onClick={handleSearch} className={styles.searchBtn}>
//                     조회
//                 </button>
//             </div>
//
//             <table className={styles.restaurantTable}>
//                 <thead>
//                 <tr>
//                     <th className={styles.checkboxCell}>
//                         <input
//                             type="checkbox"
//                             checked={
//                                 selectedRestaurants.length === restaurants.length &&
//                                 restaurants.length > 0
//                             }
//                             onChange={handleSelectAll}
//                         />
//                     </th>
//                     <th className={styles.idCell}>번호</th>
//                     <th className={styles.restaurantNameCell}>식당이름</th>
//                     <th className={styles.locationCell}>식당 위치</th>
//                     <th className={styles.roadAddressCell}> 도로명 주소</th>
//                     <th className={styles.regDateCell}>등록일시</th>
//                     <th className={styles.closedCell}>폐업 여부</th>
//                     <th className={styles.editCell}>수정</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {getCurrentPageRestaurants().map((restaurant) => (
//                     <tr key={restaurant.id}>
//                         <td className={styles.checkboxCell}>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedRestaurants.includes(restaurant.id)}
//                                 onChange={(e) => handleCheckboxChange(e, restaurant.id)}
//                             />
//                         </td>
//                         <td className={styles.idCell}>{restaurant.id}</td>
//                         <td className={styles.restaurantNameCell}>
//                             {restaurant.name}
//                         </td>
//                         <td className={styles.locationCell}>{restaurant.location}</td>
//                         <td className={styles.roadAddressCell}>
//                             {restaurant.roadAddress}
//                         </td>
//                         <td className={styles.regDateCell}>
//                             {restaurant.registrationDate}
//                         </td>
//                         <td className={styles.closedCell}>
//                             {restaurant.isClosed ? '폐업' : '영업 중'}
//                         </td>
//                         <td className={styles.editCell}>
//                             <button
//                                 onClick={() => handleEdit(restaurant)}
//                                 className={styles.editBtn}
//                             >
//                                 수정
//                             </button>
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//
//             <div className={styles.controls}>
//                 <div className={styles.pagination}>{createPagination()}</div>
//                 <div className={styles.buttons}>
//                     <button onClick={handleDelete} className={styles.deleteBtn}>
//                         삭제
//                     </button>
//                 </div>
//             </div>
//
//             {/* 수정 모달 */}
//             {showModal && editRestaurant && (
//                 <div className={styles.modal}>
//                     <div className={styles.modalContent}>
//             <span className={styles.closeButton} onClick={handleCloseModal}>
//               &times;
//             </span>
//                         <h2 className={styles.modalTitle}>식당 정보 수정</h2>
//                         <label className={styles.modalLabel}>
//                             번호:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.id}
//                                 disabled
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             식당이름:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.name}
//                                 onChange={(e) =>
//                                     setEditRestaurant({
//                                         ...editRestaurant,
//                                         name: e.target.value,
//                                     })
//                                 }
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             식당 위치:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.location}
//                                 onChange={(e) =>
//                                     setEditRestaurant({
//                                         ...editRestaurant,
//                                         location: e.target.value,
//                                     })
//                                 }
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             식당 도로명 주소:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.roadAddress}
//                                 onChange={(e) =>
//                                     setEditRestaurant({
//                                         ...editRestaurant,
//                                         roadAddress: e.target.value,
//                                     })
//                                 }
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             등록일시:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.registrationDate}
//                                 disabled
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             폐업 여부:
//                             <select
//                                 value={editRestaurant.isClosed ? 'true' : 'false'}
//                                 onChange={(e) =>
//                                     setEditRestaurant({
//                                         ...editRestaurant,
//                                         isClosed: e.target.value === 'true',
//                                     })
//                                 }
//                                 className={styles.selectBox}
//                             >
//                                 <option value="true">폐업</option>
//                                 <option value="false">영업 중</option>
//                             </select>
//                         </label>
//                         <button onClick={handleSaveEdit} className={styles.saveBtn}>
//                             저장
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default AdminRestaurants;
//


import React, { useState, useEffect } from 'react';
import styles from './AdminRestaurants.module.css';

// 백엔드 RestaurantDTO와 구조를 맞춘 인터페이스 정의
interface RestaurantDTO {
    id: number;
    name: string;
    lmmAddr: string;
    roadAddr: string;
    latitude: number;
    longitude: number;
    regDate: string; // 또는 Date, 백엔드와 협의
    closed: boolean;
}

interface Restaurant {
    id: number;
    name: string;
    location: string;
    roadAddress: string;
    registrationDate: string;
    isClosed: string; // 화면 표시용 (폐업 / 영업 중)
}

const AdminRestaurants: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]); // 선택된 ID 목록
    const [searchCategory, setSearchCategory] = useState<string>('name');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rowsPerPage = 20;

    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // todo: replace with actual API endpoint
                // const response = await fetch("https://portfolio.mrkb.kr/hanmat/api/restaurant/all");
                const response = await fetch('http://localhost:8080/hanmat/api/restaurant/all');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Raw data from backend:', data);
                    setTotalPages(data.data.totalPages);

                    const restaurantDTOs: RestaurantDTO[] = data.data.items;

                    const transformedRestaurants: Restaurant[] = restaurantDTOs.map(
                        (dto) => ({
                            id: dto.id,
                            name: dto.name,
                            location: dto.roadAddr,
                            roadAddress: dto.roadAddr,
                            registrationDate: dto.regDate,
                            isClosed: dto.closed ? '폐업' : '영업 중',
                        })
                    );
                    console.log('Transformed data:', transformedRestaurants);

                    setRestaurants(transformedRestaurants);
                    setTotalPages(Math.ceil(transformedRestaurants.length / rowsPerPage));
                } else {
                    console.error('Failed to fetch restaurants');
                    setError('데이터를 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // 체크박스 변경 처리 (개별 선택)
    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        restaurantId: number
    ) => {
        if (event.target.checked) {
            // 체크된 경우, selectedRestaurants에 id 추가
            setSelectedRestaurants((prevSelected) => [...prevSelected, restaurantId]);
        } else {
            // 체크 해제된 경우, selectedRestaurants에서 id 제거
            setSelectedRestaurants((prevSelected) =>
                prevSelected.filter((id) => id !== restaurantId)
            );
        }
    };

    // 전체 선택/해제 처리
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // 모든 restaurant의 id를 selectedRestaurants에 추가
            const allRestaurantIds = restaurants.map((restaurant) => restaurant.id);
            setSelectedRestaurants(allRestaurantIds);
        } else {
            // selectedRestaurants를 빈 배열로 초기화
            setSelectedRestaurants([]);
        }
    };

    // ... (handleDelete, handleSearch, handleEdit, handleCloseModal, handleSaveEdit  함수는 이전과 동일) ...
    const handleDelete = () => {
        if (selectedRestaurants.length === 0) {
            alert('삭제할 식당을 선택해주세요.');
            return;
        }

        if (!confirm('식당을 삭제하시겠습니까?')) {
            return;
        }

        alert('현재는 삭제기능이 지원되지 않습니다.');

    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        alert('현재는 검색기능이 지원되지 않습니다.');
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
        alert('현재는 수정기능이 지원되지 않습니다.');
    };

    const getCurrentPageRestaurants = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return restaurants.slice(startIndex, endIndex);
    };

    const createPagination = () => {
        const pageButtons = [];

        // ... (페이지네이션 버튼 생성 로직은 이전과 동일)

        return pageButtons;
    };

    return (
        <div className={styles.container}>
            {/* 검색 UI */}
            <div className={styles.searchContainer}>
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className={styles.selectBox}
                >
                    <option value="name">식당이름</option>
                    <option value="location">식당 위치</option>
                    <option value="roadAddress">도로명 주소</option>
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

            {/* 로딩 상태 및 에러 메시지 표시 */}
            {isLoading && <div>데이터를 불러오는 중입니다...</div>}
            {error && <div>{error}</div>}

            {/* 데이터 테이블 */}
            {!isLoading && !error && (
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
                        <th className={styles.roadAddressCell}> 도로명 주소</th>
                        <th className={styles.regDateCell}>등록일시</th>
                        <th className={styles.closedCell}>폐업 여부</th>
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
                                {restaurant.name}
                            </td>
                            <td className={styles.locationCell}>{restaurant.location}</td>
                            <td className={styles.roadAddressCell}>
                                {restaurant.roadAddress}
                            </td>
                            <td className={styles.regDateCell}>
                                {restaurant.registrationDate}
                            </td>
                            <td className={styles.closedCell}>
                                {restaurant.isClosed}
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
            )}

            {/* 페이지네이션 및 삭제 버튼 */}
            <div className={styles.controls}>
                <div className={styles.pagination}>{createPagination()}</div>
                <div className={styles.buttons}>
                    <button onClick={handleDelete} className={styles.deleteBtn}>
                        삭제
                    </button>
                </div>
            </div>

            {/* 수정 모달 */}
            {showModal && editRestaurant && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={handleCloseModal}>
                  &times;
                </span>
                        <h2 className={styles.modalTitle}>식당 정보 수정</h2>
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
                                value={editRestaurant.name}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
                                        name: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            식당 위치:
                            <input
                                type="text"
                                value={editRestaurant.location}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
                                        location: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            식당 도로명 주소:
                            <input
                                type="text"
                                value={editRestaurant.roadAddress}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
                                        roadAddress: e.target.value,
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
                            폐업 여부:
                            <select
                                value={editRestaurant.isClosed}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
                                        isClosed: e.target.value,
                                    })
                                }
                                className={styles.selectBox}
                            >
                                <option value="영업 중">영업 중</option>
                                <option value="폐업">폐업</option>
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

export default AdminRestaurants;
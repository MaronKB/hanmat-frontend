import React, { useState } from 'react';
import styles from './AdminRestaurants.module.css';

interface Restaurant {
    id: number;
    name: string;
    location: string;
    roadAddress: string;
    registrationDate: string;
    isClosed: boolean;
}

// 임시
const initialRestaurants: Restaurant[] = [
    {
        id: 1,
        name: '식당1',
        location: '서울시 강남구',
        roadAddress: '서울시 강남구 역삼로 123',
        registrationDate: '2023-01-10',
        isClosed: false,
    },
    {
        id: 2,
        name: '식당2',
        location: '서울시 서초구',
        roadAddress: '서울시 서초구 서초대로 456',
        registrationDate: '2023-03-22',
        isClosed: false,
    },
    {
        id: 3,
        name: '식당3',
        location: '서울시 종로구',
        roadAddress: '서울시 종로구 종로 789',
        registrationDate: '2023-05-15',
        isClosed: true,
    },
    {
        id: 4,
        name: '식당4',
        location: '서울시 마포구',
        roadAddress: '서울시 마포구 월드컵북로 321',
        registrationDate: '2023-07-03',
        isClosed: false,
    },
    {
        id: 5,
        name: '식당5',
        location: '서울시 용산구',
        roadAddress: '서울시 용산구 이태원로 987',
        registrationDate: '2023-09-18',
        isClosed: false,
    },
    {
        id: 6,
        name: '식당6',
        location: '서울시 중구',
        roadAddress: '서울시 중구 명동길 654',
        registrationDate: '2023-11-27',
        isClosed: false,
    },
];

const AdminRestaurants: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(
        initialRestaurants
    );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(
        Math.ceil(initialRestaurants.length / 20)
    );
    const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('name');
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
            alert('삭제할 식당을 선택해주세요.');
            return;
        }

        if (!confirm('식당을 삭제하시겠습니까?')) {
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
                case 'name':
                    return restaurant.name.toLowerCase().includes(keyword);
                case 'location':
                    return restaurant.location.toLowerCase().includes(keyword);
                case 'roadAddress':
                    return restaurant.roadAddress.toLowerCase().includes(keyword);
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
                            {restaurant.isClosed ? '폐업' : '영업 중'}
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
                                value={editRestaurant.isClosed ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditRestaurant({
                                        ...editRestaurant,
                                        isClosed: e.target.value === 'true',
                                    })
                                }
                                className={styles.selectBox}
                            >
                                <option value="true">폐업</option>
                                <option value="false">영업 중</option>
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


// import React, { useState, useEffect } from 'react';
// import styles from './AdminRestaurants.module.css';
//
// interface Restaurant {
//     id: number;
//     name: string;
//     lmmAddr: string; // 수정: location -> lmmAddr
//     roadAddr: string; // 수정: roadAddress -> roadAddr
//     regDate: string; // Date 타입 대신 string 사용 (또는 Date 타입으로 변경 가능)
//     isClosed: string; // 수정: boolean -> string (Y/N)
// }
//
// const AdminRestaurants: React.FC = () => {
//     const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [totalPages, setTotalPages] = useState<number>(1); // 초기값 1로 변경
//     const [selectedRestaurants, setSelectedRestaurants] = useState<number[]>([]);
//     const [searchCategory, setSearchCategory] = useState<string>('name'); // 기본 검색 카테고리
//     const [searchKeyword, setSearchKeyword] = useState<string>('');
//     const [showModal, setShowModal] = useState<boolean>(false);
//     const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
//
//     const rowsPerPage = 20;
//
//     // API 기본 URL (proxy 설정했으면 포트 번호 생략 가능)
//     // 개발 환경에서는 http://localhost:8080/hanmat/api
//     const BASE_URL = '/hanmat/api';
//
//     // 식당 목록 불러오기 (API 호출)
//     useEffect(() => {
//         const fetchRestaurants = async () => {
//             try {
//                 const response = await fetch(`${BASE_URL}/restaurant/all`);
//                 if (response.ok) {
//                     const data = await response.json();
//                     // 응답 데이터 형식 확인: { list: [...], message: "", isSuccess: true, httpStatusCode: 200 }
//                     if (data.isSuccess && data.list) {
//                         // RestaurantDTO를 Restaurant 타입으로 변환
//                         const fetchedRestaurants = data.list.map((restaurant: any) => ({
//                             id: restaurant.id,
//                             name: restaurant.name,
//                             lmmAddr: restaurant.lmmAddr,
//                             roadAddr: restaurant.roadAddr,
//                             regDate: restaurant.regDate, // 문자열로 변환
//                             isClosed: restaurant.isClosed,
//                         }));
//                         setRestaurants(fetchedRestaurants);
//                         setTotalPages(Math.ceil(fetchedRestaurants.length / rowsPerPage));
//                     } else {
//                         console.error('데이터 형식이 올바르지 않습니다:', data);
//                     }
//                 } else {
//                     console.error(
//                         '식당 목록을 불러오는데 실패했습니다.',
//                         response.status
//                     );
//                 }
//             } catch (error) {
//                 console.error('식당 목록을 불러오는 중 오류가 발생했습니다.', error);
//             }
//         };
//
//         fetchRestaurants();
//     }, []);
//
//     // 페이지 변경 시 사용자 목록 업데이트
//     useEffect(() => {
//         const startIndex = (currentPage - 1) * rowsPerPage;
//         const endIndex = startIndex + rowsPerPage;
//         const currentPageRestaurants = restaurants.slice(startIndex, endIndex);
//
//         // 현재 페이지의 식당 목록이 비어 있고, 현재 페이지가 1보다 크면 이전 페이지로 이동
//         if (currentPageRestaurants.length === 0 && currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     }, [currentPage, restaurants, rowsPerPage]);
//
//     // 체크박스 변경 처리
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
//     // 전체 선택/해제
//     const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.checked) {
//             const allRestaurantIds = restaurants.map((restaurant) => restaurant.id);
//             setSelectedRestaurants(allRestaurantIds);
//         } else {
//             setSelectedRestaurants([]);
//         }
//     };
//
//     // 식당 삭제 (API 호출)
//     const handleDelete = async () => {
//         if (selectedRestaurants.length === 0) {
//             alert('삭제할 식당을 선택해주세요.');
//             return;
//         }
//
//         if (!confirm('식당을 삭제하시겠습니까?')) {
//             return;
//         }
//
//         try {
//             const response = await fetch(`${BASE_URL}/restaurant/delete`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ ids: selectedRestaurants }), // 수정: 키 이름을 ids로 변경
//             });
//
//             if (response.ok) {
//                 alert('선택한 식당이 삭제되었습니다.');
//                 // 삭제된 ID를 제외한 식당 목록을 필터링
//                 const updatedRestaurants = restaurants.filter(
//                     (restaurant) => !selectedRestaurants.includes(restaurant.id)
//                 );
//                 setRestaurants(updatedRestaurants);
//                 setSelectedRestaurants([]);
//                 setTotalPages(Math.ceil(updatedRestaurants.length / rowsPerPage));
//             } else {
//                 console.error('식당 삭제 실패');
//             }
//         } catch (error) {
//             console.error('식당 삭제 중 오류 발생', error);
//         }
//     };
//
//     // 검색 기능 (API 호출)
//     const handleSearch = async () => {
//         if (!searchKeyword.trim()) {
//             alert('검색어를 입력해주세요.');
//             return;
//         }
//
//         try {
//             const response = await fetch(
//                 `${BASE_URL}/restaurant/search?category=${searchCategory}&keyword=${encodeURIComponent(
//                     searchKeyword
//                 )}`
//             );
//             if (response.ok) {
//                 const data = await response.json();
//                 // 응답 데이터 형식에 따라 조정
//                 if (data.isSuccess && data.list) {
//                     // RestaurantDTO를 Restaurant 타입으로 변환
//                     const fetchedRestaurants = data.list.map((restaurant: any) => ({
//                         id: restaurant.id,
//                         name: restaurant.name,
//                         lmmAddr: restaurant.lmmAddr,
//                         roadAddr: restaurant.roadAddr,
//                         regDate: restaurant.regDate, // 문자열로 변환
//                         isClosed: restaurant.isClosed,
//                     }));
//                     setRestaurants(fetchedRestaurants);
//                     setTotalPages(Math.ceil(fetchedRestaurants.length / rowsPerPage));
//                     setCurrentPage(1); // 검색 후 첫 페이지로 이동
//                 } else {
//                     console.error('검색 결과 데이터 형식이 올바르지 않습니다:', data);
//                 }
//             } else {
//                 console.error('검색 실패');
//             }
//         } catch (error) {
//             console.error('검색 중 오류 발생', error);
//         }
//     };
//
//     // 수정 모달 열기
//     const handleEdit = (restaurant: Restaurant) => {
//         setEditRestaurant(restaurant);
//         setShowModal(true);
//     };
//
//     // 수정 모달 닫기
//     const handleCloseModal = () => {
//         setShowModal(false);
//         setEditRestaurant(null);
//     };
//
//     // 수정 내용 저장 (API 호출)
//     const handleSaveEdit = async () => {
//         if (!editRestaurant) return;
//
//         try {
//             const response = await fetch(`${BASE_URL}/restaurant/update`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(editRestaurant),
//             });
//
//             if (response.ok) {
//                 alert('식당 정보가 수정되었습니다.');
//                 // 수정된 식당 정보로 상태 업데이트
//                 const updatedRestaurants = restaurants.map((restaurant) =>
//                     restaurant.id === editRestaurant.id ? editRestaurant : restaurant
//                 );
//                 setRestaurants(updatedRestaurants);
//                 handleCloseModal();
//             } else {
//                 console.error('식당 정보 수정 실패');
//             }
//         } catch (error) {
//             console.error('식당 정보 수정 중 오류 발생', error);
//         }
//     };
//
//     // 페이지에 해당하는 사용자 목록 표시
//     const displayPageRestaurants = (page: number) => {
//         const start = (page - 1) * rowsPerPage;
//         const end = start + rowsPerPage;
//         const currentRestaurants = restaurants.slice(start, end);
//
//         return currentRestaurants.map((restaurant) => (
//             <tr key={restaurant.id}>
//                 <td className={styles.checkboxCell}>
//                     <input
//                         type="checkbox"
//                         checked={selectedRestaurants.includes(restaurant.id)}
//                         onChange={(e) => handleCheckboxChange(e, restaurant.id)}
//                     />
//                 </td>
//                 <td className={styles.idCell}>{restaurant.id}</td>
//                 <td className={styles.restaurantNameCell}>{restaurant.name}</td>
//                 <td className={styles.locationCell}>{restaurant.lmmAddr}</td>
//                 <td className={styles.roadAddressCell}>{restaurant.roadAddr}</td>
//                 <td className={styles.regDateCell}>{restaurant.regDate}</td>
//                 <td className={styles.closedCell}>
//                     {restaurant.isClosed ? '폐업' : '영업 중'}
//                 </td>
//                 <td className={styles.editCell}>
//                     <button
//                         onClick={() => handleEdit(restaurant)}
//                         className={styles.editBtn}
//                     >
//                         수정
//                     </button>
//                 </td>
//             </tr>
//         ));
//     };
//
//     // 페이지네이션 버튼 생성
//     const createPaginationButtons = () => {
//         const pageButtons = [];
//
//         // 이전 페이지 버튼
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
//         // 페이지 번호 버튼
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
//         // 다음 페이지 버튼
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
//                 <tbody>{displayPageRestaurants(currentPage)}</tbody>
//             </table>
//
//             <div className={styles.controls}>
//                 <div className={styles.pagination}>{createPaginationButtons()}</div>
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
//                                 value={editRestaurant.lmmAddr}
//                                 onChange={(e) =>
//                                     setEditRestaurant({
//                                         ...editRestaurant,
//                                         lmmAddr: e.target.value,
//                                     })
//                                 }
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             식당 도로명 주소:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.roadAddr}
//                                 onChange={(e) =>
//                                     setEditRestaurant({
//                                         ...editRestaurant,
//                                         roadAddr: e.target.value,
//                                     })
//                                 }
//                                 className={styles.inputBox}
//                             />
//                         </label>
//                         <label className={styles.modalLabel}>
//                             등록일시:
//                             <input
//                                 type="text"
//                                 value={editRestaurant.regDate}
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
//                                         isClosed: e.target.value,
//                                     })
//                                 }
//                                 className={styles.selectBox}
//                             >
//                                 <option value="Y">폐업</option>
//                                 <option value="N">영업 중</option>
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
import React, { useEffect, useState } from 'react';
import styles from './AdminUsers.module.css';

interface UserDTO {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    introduction: string;
    registrationDate: string;
    isDeleted: boolean;
}

interface User {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    introduction: string;
    registrationDate: string;
    isDeleted: boolean;
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('email');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<User>({
        id: 0,
        email: '',
        nickname: '',
        profileImageUrl: '',
        introduction: '',
        registrationDate: '',
        isDeleted: false,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const rowsPerPage = 20;

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8080/hanmat/api/user/all');
                if (response.ok) {
                    const data = await response.json();
                    setTotalPages(data.data.totalPages);

                    const userDTOs: UserDTO[] = data.data.items;

                    const transformedUsers: User[] = userDTOs.map((dto) => ({
                        id: dto.id,
                        email: dto.email,
                        nickname: dto.nickname,
                        profileImageUrl: dto.profileImageUrl,
                        introduction: dto.introduction,
                        registrationDate: dto.registrationDate,
                        isDeleted: dto.isDeleted,
                    }));

                    setUsers(transformedUsers);
                    setTotalPages(Math.ceil(transformedUsers.length / rowsPerPage));
                } else {
                    setError('데이터를 불러오는데 실패했습니다.');
                }
            } catch (error) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, userId: number) => {
        if (event.target.checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allUserIds = users.map((user) => user.id);
            setSelectedUsers(allUserIds);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleDelete = () => {
        if (selectedUsers.length === 0) {
            alert('삭제할 사용자를 선택해주세요.');
            return;
        }

        if (!confirm('해당 사용자를 삭제하시겠습니까?')) {
            return;
        }

        const updatedUsers = users.filter((user) => !selectedUsers.includes(user.id));
        setUsers(updatedUsers);
        setSelectedUsers([]);
        setTotalPages(Math.ceil(updatedUsers.length / rowsPerPage));
    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }

        const filteredUsers = users.filter((user) => {
            const keyword = searchKeyword.toLowerCase();
            switch (searchCategory) {
                case 'email':
                    return user.email.toLowerCase().includes(keyword);
                case 'nickname':
                    return user.nickname.toLowerCase().includes(keyword);
                case 'introduction':
                    return user.introduction.toLowerCase().includes(keyword);
                default:
                    return true;
            }
        });

        setUsers(filteredUsers);
        setTotalPages(Math.ceil(filteredUsers.length / rowsPerPage));
        setCurrentPage(1);
    };

    const handleEdit = (user: User) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditUser(null);
    };

    const handleSaveEdit = () => {
        if (!editUser) return;

        const updatedUsers = users.map((user) =>
            user.id === editUser.id ? editUser : user
        );
        setUsers(updatedUsers);
        handleCloseModal();
    };

    const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleAddUser = () => {
        if (!newUser.email || !newUser.nickname) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        setUsers([...users, { ...newUser, id: users.length + 1 }]);
        setShowAddModal(false);
    };

    const getCurrentPageUsers = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return users.slice(startIndex, endIndex);
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
                    className={`${styles.pageBtn} ${currentPage === i ? styles.active : ''}`}
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
                    <option value="email">이메일</option>
                    <option value="nickname">닉네임</option>
                    <option value="introduction">소개</option>
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

            <table className={styles.userTable}>
                <thead>
                <tr>
                    <th className={styles.checkboxCell}>
                        <input
                            type="checkbox"
                            checked={
                                selectedUsers.length === users.length && users.length > 0
                            }
                            onChange={handleSelectAll}
                        />
                    </th>
                    <th className={styles.idCell}>번호</th>
                    <th className={styles.emailCell}>이메일</th>
                    <th className={styles.nicknameCell}>닉네임</th>
                    <th className={styles.profileCell}>프로필사진</th>
                    <th className={styles.introductionCell}>소개</th>
                    <th className={styles.regDateCell}>가입일</th>
                    <th className={styles.deletedCell}>탈퇴여부</th>
                    <th className={styles.editCell}>수정</th>
                </tr>
                </thead>
                <tbody>
                {getCurrentPageUsers().map((user) => (
                    <tr key={user.id}>
                        <td className={styles.checkboxCell}>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => handleCheckboxChange(e, user.id)}
                            />
                        </td>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.nickname}</td>
                        <td>
                            <img
                                src={user.profileImageUrl}
                                alt="프로필"
                                className={styles.profileImage}
                            />
                        </td>
                        <td>{user.introduction}</td>
                        <td>{user.registrationDate}</td>
                        <td>{user.isDeleted ? '탈퇴' : '정상'}</td>
                        <td>
                            <button
                                onClick={() => handleEdit(user)}
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
                <div className={styles.buttonGroup}>
                    <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
                        추가
                    </button>
                    <button onClick={handleDelete} className={styles.deleteBtn}>
                        삭제
                    </button>
                </div>
                <div className={styles.paginationContainer}>{createPagination()}</div>
            </div>

            {showModal && editUser && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>사용자 정보 수정</h2>
                        <label className={styles.modalLabel}>
                            이메일:
                            <input
                                type="text"
                                value={editUser.email}
                                disabled
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            닉네임:
                            <input
                                type="text"
                                value={editUser.nickname}
                                onChange={(e) =>
                                    setEditUser({ ...editUser, nickname: e.target.value })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            프로필 사진 URL:
                            <input
                                type="text"
                                value={editUser.profileImageUrl}
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        profileImageUrl: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            소개:
                            <input
                                type="text"
                                value={editUser.introduction}
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        introduction: e.target.value,
                                    })
                                }
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            가입일:
                            <input
                                type="text"
                                value={editUser.registrationDate}
                                disabled
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            탈퇴 여부:
                            <select
                                value={editUser.isDeleted ? 'true' : 'false'}
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        isDeleted: e.target.value === 'true',
                                    })
                                }
                                className={styles.selectBox}
                            >
                                <option value="false">정상</option>
                                <option value="true">탈퇴</option>
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

            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>사용자 추가</h2>
                        <label className={styles.modalLabel}>
                            이메일:
                            <input
                                type="text"
                                name="email"
                                value={newUser.email}
                                onChange={handleNewInputChange}
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            닉네임:
                            <input
                                type="text"
                                name="nickname"
                                value={newUser.nickname}
                                onChange={handleNewInputChange}
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            프로필 사진 URL:
                            <input
                                type="text"
                                name="profileImageUrl"
                                value={newUser.profileImageUrl}
                                onChange={handleNewInputChange}
                                className={styles.inputBox}
                            />
                        </label>
                        <label className={styles.modalLabel}>
                            소개:
                            <input
                                type="text"
                                name="introduction"
                                value={newUser.introduction}
                                onChange={handleNewInputChange}
                                className={styles.inputBox}
                            />
                        </label>
                        <div className={styles.modalButtons}>
                            <button onClick={handleAddUser} className={styles.saveBtn}>
                                저장
                            </button>
                            <button onClick={() => setShowAddModal(false)} className={styles.closeBtn}>
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;


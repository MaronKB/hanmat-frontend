import React, { useState } from 'react';
import styles from './AdminUsers.module.css';

interface User {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    introduction: string;
    registrationDate: string;
    isDeleted: boolean;
}

// 임시 데이터
const initialUsers: User[] = [
    {
        id: 1,
        email: 'user1@example.com',
        nickname: '사용자1',
        profileImageUrl: 'https://via.placeholder.com/50x50',
        introduction: '안녕하세요! 사용자1입니다.',
        registrationDate: '2023-01-01',
        isDeleted: false,
    },
    {
        id: 2,
        email: 'user2@example.com',
        nickname: '사용자2',
        profileImageUrl: 'https://via.placeholder.com/50x50',
        introduction: '반갑습니다! 사용자2입니다.',
        registrationDate: '2023-01-02',
        isDeleted: true,
    },
    {
        id: 3,
        email: 'user3@example.com',
        nickname: '사용자3',
        profileImageUrl: 'https://via.placeholder.com/50x50',
        introduction: '안녕하세요! 사용자3입니다.',
        registrationDate: '2023-01-03',
        isDeleted: false,
    },
];

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(initialUsers.length / 20));
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchCategory, setSearchCategory] = useState<string>('email');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const rowsPerPage = 20;

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

        const filteredUsers = initialUsers.filter((user) => {
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
                    검색
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
                        <td className={styles.idCell}>{user.id}</td>
                        <td className={styles.emailCell}>{user.email}</td>
                        <td className={styles.nicknameCell}>{user.nickname}</td>
                        <td className={styles.profileCell}>
                            <img
                                src={user.profileImageUrl}
                                alt="프로필"
                                className={styles.profileImage}
                            />
                        </td>
                        <td className={styles.introductionCell}>{user.introduction}</td>
                        <td className={styles.regDateCell}>{user.registrationDate}</td>
                        <td className={styles.deletedCell}>
                            {user.isDeleted ? '탈퇴' : '정상'}
                        </td>
                        <td className={styles.editCell}>
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
                <div className={styles.pagination}>{createPagination()}</div>
                <button onClick={handleDelete} className={styles.deleteBtn}>
                    삭제
                </button>
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
                                    setEditUser({ ...editUser, profileImageUrl: e.target.value })
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
                                    setEditUser({ ...editUser, introduction: e.target.value })
                                }
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
        </div>
    );
};

export default AdminUsers;

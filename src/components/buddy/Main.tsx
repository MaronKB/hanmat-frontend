import { useState } from 'react';
import styles from './Main.module.css';

interface UserData {
    name: string;
    time: string;
    distance: string;
    imageUrl: string;
}

const usersData: UserData[] = [
    {
        name: "이민수",
        distance: "1km",
        time: "1hr ago",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "유재석",
        distance: "3km",
        time: "3hr ago",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "김혜민",
        distance: "4km",
        time: "4hr ago",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "문진배",
        distance: "6km",
        time: "8hr ago",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "신희철",
        distance: "8km",
        time: "11hr ago",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "전지훈",
        distance: "12km",
        time: "19hr ago",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    }
];

function User({ name, time, distance, imageUrl }: UserData) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.imageContainer}>
                <img src={imageUrl} className={styles.image} alt="프로필 사진" />
            </div>

            <div className={styles.contentContainer}>
                <span className={styles.nameText}>{name}</span>
                <div className={styles.status}>
                    <span className={styles.distanceText}>{distance}</span>
                    <span className={styles.timeText}>{time}</span>
                </div>
            </div>
        </div>
    );
}

function UserList({users, onUserClick }: { users: UserData[]; onUserClick: (user: UserData) => void }) {
    return (
        <div className={styles.userListContainer}>
            {users.map((user, index) => (
                <div key={index} onClick={() => onUserClick(user)}>
                    <User name={user.name} time={user.time} distance={user.distance} imageUrl={user.imageUrl} />
                </div>
            ))}
        </div>
    );
}

export default function Main() {

    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const handleUserClick = (user: UserData) => {
        setSelectedUser(user);
    };

    const handleCloseChat = () => {
        setSelectedUser(null);
    };

    return (

        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.buddyTitle}>Buddy</h1>
                <div className={styles.contentWrapper}>
                    <div className={styles.list}>
                        <UserList users={usersData} onUserClick={handleUserClick} />
                    </div>
                    <div
                        className={`${styles.chatContainer} ${selectedUser ? styles.open : ''}`}
                    >
                        {selectedUser && (
                            <div className={styles.chatContent}>
                                <button className={styles.closeButton} onClick={handleCloseChat}>
                                    X
                                </button>
                                <div className={styles.userInfo}>
                                    <img
                                        src={selectedUser.imageUrl}
                                        className={styles.userImage}
                                        alt="프로필 사진"
                                    />
                                    <h2>{selectedUser.name}</h2>
                                </div>
                                <p className={styles.userBio}>"사용자 자기소개란"</p>
                                <div className={styles.chatMessages}></div>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        placeholder="Type your message here"
                                        className={styles.input}
                                    />
                                    <button className={styles.sendButton}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className={styles.sendIcon}
                                        >
                                            <path
                                                d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>Footer</div>
        </div>
    );
}
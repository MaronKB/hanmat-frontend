import styles from './Main.module.css';

const usersData = [
    {
        name: "이민수",
        time: "1hr ago,",
        distance: "3km",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "유재석",
        time: "3hr ago,",
        distance: "3km",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "유재석",
        time: "4hr ago,",
        distance: "3km",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "유재석",
        time: "8hr ago,",
        distance: "3km",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "유재석",
        time: "11hr ago,",
        distance: "3km",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    {
        name: "유재석",
        time: "19hr ago,",
        distance: "3km",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    }
];


function User({ name, time, distance, imageUrl }: { name: string; time: string; distance: string; imageUrl: string }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.imageContainer}>
                <img
                    src={imageUrl}
                    className={styles.image}
                    alt="프로필 사진"
                />
            </div>

            <div className={styles.contentContainer}>
                <div>
                    <span className={styles.nameText}>{name}</span>
                </div>
                <div className={styles.status}>
                    <span className={styles.timeText}>{time}</span>
                    <span className={styles.distanceText}>{distance}</span>
                </div>
            </div>
        </div>
    );
}


function UserList({users}: { users: { name: string; time: string; distance: string; imageUrl: string }[] }) {
    return (
        <div>
            {users.map((user, index) => (
                <User key={index} name={user.name} time={user.time} distance={user.distance} imageUrl={user.imageUrl} />
            ))}
        </div>
    );
}

export default function Main() {
    return (
        <div>
            <div className={styles.container}>
                <h1>Buddy</h1>
                <div className={styles.list}>
                    <UserList users={usersData}/>
                </div>
            </div>
        </div>
    );
}
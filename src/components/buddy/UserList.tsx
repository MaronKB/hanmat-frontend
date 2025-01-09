import styles from "./UserList.module.css";
import {useEffect, useRef, useState} from "react";

interface UserData {
    email: string;
    name: string;
    picture: string;
}

export default function Main({set}: {set: (user: string) => void}) {
    const [users, setUsers] = useState<UserData[]>([]);

    const token = localStorage.getItem('token') || '';
    const user = useRef<UserData>(JSON.parse(token));
    const getUsers = async () => {
        const response = await fetch('http://localhost:8080/hanmat/api/user/all');
        const users = await response.json();
        console.log(users);
        setUsers(users.data.items.filter((u: { email: string; }) => u.email !== user.current.email));
    }
    useEffect(() => {
        getUsers();
    }, []);
    return (
        <div className={styles.list}>
            {users.map((user: UserData) => (
                <div key={user.email} className={styles.user} onClick={() => set(user.email)}>
                    <div className={styles.profile}>
                        <img className={styles.image} src={user.picture ?? "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt="user" />
                    </div>
                    <div className={styles.info}>
                        <h3>{user.name}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
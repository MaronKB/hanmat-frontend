import styles from "./UserList.module.css";
import {useEffect, useRef, useState} from "react";

interface UserData {
    email: string;
    name: string;
    picture: string;
    isActive: boolean;
}

export default function Main({open}: {open: (target: string) => boolean}) {
    const [users, setUsers] = useState<UserData[]>([]);

    const token = localStorage.getItem('token') || '';
    const user = useRef<UserData>(JSON.parse(token));
    const getUsers = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/all`);
        const users = await response.json();
        console.log(users);
        setUsers(users.data.items.filter((u: { email: string; }) => u.email !== user.current.email));
    }
    const toggleActive = (email: string) => {
        const opened = open(email);
        const newUsers = users.map((u: UserData) => {
            u.isActive = (u.email === email) && opened;
            return u;
        });
        setUsers(newUsers);
    }
    useEffect(() => {
        getUsers();
    }, []);
    return (
        <div className={styles.list}>
            {users.map((user: UserData) => (
                <div key={user.email} className={styles.user + (user.isActive ? (" " + styles.active) : "")} onClick={() => toggleActive(user.email)}>
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
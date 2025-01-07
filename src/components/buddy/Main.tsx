import { Socket, io } from "socket.io-client";
import styles from "./Main.module.css";
import UserList from "./UserList";
import Chat from "./Chat.tsx";

export default function Main() {
    const socket: Socket = io('ws://localhost:3001');
    return (
        <main>
            <section className={styles.container}>
                <UserList />
                <Chat socket={socket} />
            </section>
        </main>
    );
}
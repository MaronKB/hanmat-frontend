import { Socket, io } from "socket.io-client";
import styles from "./Main.module.css";
import UserList from "./UserList";
import Chat from "./Chat.tsx";
import {useEffect, useState} from "react";

export default function Main() {
    // const socket: Socket = io('ws://localhost:3000');
    const socket: Socket = io('wss://portfolio.mrkb.kr');

    const [targetUser, setTargetUser] = useState<string>('');
    useEffect(() => {
        console.log(targetUser);
    }, [targetUser]);
    return (
        <main className={styles.main + " max"}>
            <section className={styles.container}>
                <UserList set={setTargetUser}/>
                <Chat socket={socket} target={targetUser}/>
            </section>
        </main>
    );
}
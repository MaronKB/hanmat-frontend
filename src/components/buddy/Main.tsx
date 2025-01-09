import { Socket, io } from "socket.io-client";
import styles from "./Main.module.css";
import UserList from "./UserList";
import Chat from "./Chat.tsx";
import chatStyles from "./Chat.module.css";
import {useEffect, useState} from "react";

export default function Main() {
    // const socket: Socket = io('ws://localhost:3000');
    const socket: Socket = io('wss://portfolio.mrkb.kr');

    const [targetUser, setTargetUser] = useState<string>('');
    const [isChatting, setIsChatting] = useState<boolean>(false);

    const openChat = (target: string) => {
        if (targetUser !== target) {
            setTargetUser(target);
            setIsChatting(true);
            return true;
        } else {
            const chat = document.querySelector(`.${chatStyles.chat}`);
            if (chat) chat.classList.toggle(chatStyles.active, !isChatting);
            setTimeout(() => setIsChatting(!isChatting), (isChatting ? 0 : 500));
            return !isChatting;
        }
    }

    useEffect(() => {
        console.log(targetUser);
    }, [targetUser]);
    return (
        <main className={styles.main + " max"}>
            <section className={styles.container}>
                <UserList open={openChat}/>
                <Chat socket={socket} target={targetUser} isChatting={isChatting}/>
            </section>
        </main>
    );
}
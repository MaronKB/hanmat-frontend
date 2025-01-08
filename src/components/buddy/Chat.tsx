import styles from "./Chat.module.css";
import {Socket} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import ChatMessage, {Message} from "./ChatMessage";

export default function Chat({socket, target}: {socket: Socket, target: string}) {
    const token = localStorage.getItem('token');
    const user = useRef<AuthData>(JSON.parse(token || "{}"));
    const [targetUser, setTargetUser] = useState({
        email: '',
        nickname: '',
        profileImage: '',
        isAdmin: false
    });
    const [room, setRoom] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const getTargetUser = async () => {
        const response = await fetch(`http://localhost:8080/hanmat/api/user/${target || "system@hanmat.com"}`);
        const user = await response.json();
        setTargetUser(user.data);
    }

    const getRoom = async () => {
        const response = await fetch('http://localhost:3000/chat/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user1: user.current.email || 'user@test',
                user2: targetUser.email || "system@hanmat.com"
            })
        });
        const room = await response.json();
        setRoom(room._id);
    }

    const getMessages = async (id: string) => {
        const response = await fetch(`http://localhost:3000/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                room: id
            })
        });
        const data = await response.json();
        console.log(data);
        interface MessageData {
            _id: string;
            room: string;
            user: string;
            message: string;
            createdAt: string;
            updatedAt: string;
        }
        const newMessages = data.map((m: MessageData) => {
            const isMine = m.user === user.current.email;
            const nickname = isMine ? user.current.nickname : targetUser.nickname;
            return new Message(m._id, m.room, m.user, nickname, targetUser.profileImage, m.message, isMine, new Date(m.createdAt))
        });
        setMessages(newMessages);
    }

    const sendMessage = async () => {
        const input = document.querySelector("#message-input") as HTMLInputElement;
        socket.emit('message', JSON.stringify({
            room: room,
            user: user.current.email,
            message: input.value
        }));
        input.value = '';
    }

    useEffect(() => {
        if (target !== "") getTargetUser();
    }, [target]);

    useEffect(() => {
        if (targetUser.email !== "") getRoom();
    }, [targetUser]);

    useEffect(() => {
        if (room !== "") getMessages(room);
    }, [room]);

    socket.on('message', async () => {
        if (room !== "") await getMessages(room);
    });

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.profile}>
                    <img className={styles.image} src={targetUser.profileImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt="user" />
                </div>
                <div className={styles.info}>
                    <h3>{targetUser.nickname}</h3>
                    <h4>{targetUser.email}</h4>
                </div>
            </div>
            <div className={styles.messages}>
                {messages.map((message: Message) =>
                    <ChatMessage key={message.id} message={message}/>
                )}
            </div>
            <div className={styles.input}>
                <input id="message-input" type="text" placeholder="Enter your message..." />
                <button type={"button"} onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
import styles from "./Chat.module.css";
import {Socket} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import ChatMessage, {Message} from "./ChatMessage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import errorImage from "../../assets/images/error-image.png";

export default function Chat({socket, target, isChatting}: {socket: Socket, target: string, isChatting: boolean}) {
    const token = localStorage.getItem('token');
    const user = useRef<AuthData>(JSON.parse(token || "{}"));
    const [targetUser, setTargetUser] = useState({
        email: '',
        name: '',
        picture: ''
    });
    const [room, setRoom] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<Message>({} as Message);

    const getTargetUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${target || "system@hanmat.com"}`);
        const user = await response.json();
        setTargetUser(user.data);
    }

    const getRoom = async () => {
        const response = await fetch('https://portfolio.mrkb.kr/hanmat/chat/room', {
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
        // todo: change to production url & dotenv
        // const response = await fetch(`http://localhost:3000/chat/message`, {
        const response = await fetch(`https://portfolio.mrkb.kr/hanmat/chat/message`, {
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
            const nickname = isMine ? user.current.nickname : targetUser.name;
            return new Message(m._id, m.room, m.user, nickname, targetUser.picture, m.message, isMine, new Date(m.createdAt))
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

    const onKeydown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
            sendMessage();
        }
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

    useEffect(() => {
        if (newMessage.room === room) {
            getMessages(room);
        } else {
            console.log('new message from different room');
        }
    }, [newMessage]);

    useEffect(() => {
        const messageContainer = document.querySelector(`.${styles.messages}`);
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight
        }
    }, [messages]);

    socket.on('message', async (msg) => {
        setNewMessage(msg);
    });

    return (
        <div className={styles.chat + (isChatting ? (" " + styles.active) : "")}>
            <div className={styles.header}>
                <div className={styles.profile}>
                    <img className={styles.image} src={targetUser.picture || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt="user" onError={(ev) => ev.currentTarget.src = errorImage}/>
                </div>
                <div className={styles.info}>
                    <h3>{targetUser.name}</h3>
                    <h4>{targetUser.email}</h4>
                </div>
            </div>
            <div className={styles.messages}>
                {messages.map((message: Message) =>
                    <ChatMessage key={message.id} message={message}/>
                )}
            </div>
            <div className={styles.input}>
                <input id="message-input" type="text" placeholder="Enter your message..." onKeyDown={(ev) => onKeydown(ev)} autoComplete={"off"}/>
                <button type={"button"} onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane}/></button>
            </div>
        </div>
    )
}
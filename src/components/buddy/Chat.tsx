import styles from "./Chat.module.css";
import {Socket} from "socket.io-client";

export default function Chat({socket}: {socket: Socket}) {
    const sendMessage = () => {
        const input = document.querySelector("#message-input") as HTMLInputElement;
        console.log(input, input.value);
        socket.emit('message', input.value);
        input.value = '';
    }

    socket.on('message', (message: string) => {
        const messages = document.querySelector(`.${styles.messages}`) as HTMLDivElement;
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messages.appendChild(messageElement);
    });
    return (
        <div className={styles.chat}>
            <div className={styles.messages}>

            </div>
            <div className={styles.input}>
                <input id="message-input" type="text" placeholder="Enter your message..." />
                <button type={"button"} onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
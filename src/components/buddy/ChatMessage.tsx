import styles from "./ChatMessage.module.css";

export class Message {
    constructor(
        public id: string,
        public room: string,
        public user: string,
        public nickname: string,
        public profileImage: string,
        public message: string,
        public isMine: boolean,
        public timestamp: Date
    ) {
        this.id = id;
        this.room = room;
        this.user = user;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.message = message;
        this.isMine = isMine;
        this.timestamp = timestamp;
    }
    toHTML() {
        return this.toElement().outerHTML;
    }
    toElement() {
        const element = document.createElement('div');
        element.className = styles.message;

        const profile = document.createElement('div');
        profile.className = styles.profile;
        const image = document.createElement('img');
        image.className = styles.image;
        image.src = this.profileImage;
        image.alt = 'user';
        profile.appendChild(image);
        element.appendChild(profile);

        const info = document.createElement('div');
        info.className = styles.info;
        const h3 = document.createElement('h3');
        h3.innerHTML = this.user;
        const p = document.createElement('p');
        p.innerHTML = this.message;
        info.appendChild(h3);
        info.appendChild(p);
        element.appendChild(info);

        return element;
    }
    toJSON() {
        return JSON.stringify({
            room: this.room,
            user: this.user,
            profileImage: this.profileImage,
            message: this.message,
            timestamp: this.timestamp
        });
    }
}

export default function ChatMessage({message}: {message: Message}) {
    return (
        <div className={styles.message + (message.isMine ? (" " + styles.mine) : "")}>
            {!message.isMine && <div className={styles.profile}>
                <img className={styles.image} src={message.profileImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt="user" />
            </div>}
            <div className={styles.info}>
                {!message.isMine && <h3>{message.nickname}</h3>}
                <p>{message.message}</p>
            </div>
        </div>
    )
}
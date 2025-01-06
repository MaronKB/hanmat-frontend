import styles from "./Modal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";
export default function Modal({restaurant, isOpened, close}: {restaurant: {id: number, name: string}, isOpened: boolean, close: () => void}) {
    return (
        <div className={styles["modal-container"] + (isOpened ? (" " + styles.opened) : "")}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <h2>{restaurant.name}</h2>
                    <button className={styles.close} onClick={close}><FontAwesomeIcon icon={faX}/></button>
                </header>
                <div className={styles.content}>
                    <p>{restaurant.name}</p>
                </div>
            </div>
        </div>
    );
}
import styles from './Modal.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

export default function Modal({title, children, isOpened, close}: {title: string, children: React.ReactNode, isOpened: boolean, close: () => void}) {
    return (
        <div className={styles.container + (isOpened ? (" " + styles.opened) : "")} onClick={close}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button className={styles.close} onClick={close}><FontAwesomeIcon icon={faX}/></button>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}
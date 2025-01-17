import styles from './TasteModal.module.css';
import Modal from "../common/Modal.tsx";
import {Menu} from "./Main.tsx";

export default function TasteModal({menu, isOpened, close}: {menu: Menu, isOpened: boolean, close: () => void}) {
    return (
        <Modal title={menu.name} isOpened={isOpened} close={close}>
            <div className={styles.taste}>
                <img src={menu.image} alt={menu.name} />
                <h3>{menu.name}</h3>
                <p>{menu.dscrn}</p>
                <p>{menu.description}</p>
                <p>매운맛: {menu.spicy}</p>
                <p>한맛: {menu.hanmat}</p>
            </div>
        </Modal>
    );
}
import styles from './TasteModal.module.css';
import Modal from "../common/Modal.tsx";
import {Menu} from "./Main.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBowlFood, faHashtag, faPepperHot} from "@fortawesome/free-solid-svg-icons";

export default function TasteModal({menu, isOpened, close}: {menu: Menu | null, isOpened: boolean, close: () => void}) {
    if (!menu) return null;
    const title = menu.name.split("(")[0].toUpperCase();
    const dscrn = menu.dscrn ? menu.dscrn.split(",") : ["재료 정보 없음"];

    // test data
    const spicy = Math.floor(Math.random() * 10);
    const hanmat = Math.floor(Math.random() * 10);

    return (
        <Modal title={title} isOpened={isOpened} close={close}>
            <hr className={styles.border}/>
            <img className={styles.image} src={menu.image} alt={menu.name}/>
            <h3 className={styles.title}>{title}</h3>
            <h4 className={styles.category}>{menu.category}</h4>
            <hr className={styles.border}/>
            <div className={styles.dscrn}>{dscrn.map(
                (d, i) => <span key={"dscrn " + i}><FontAwesomeIcon icon={faHashtag}/>{d}</span>
            )}</div>
            <div className={styles.gauge}>
                <div className={styles.container}>
                    <h4>매운맛</h4>
                    <div className={styles.spicy}>{Array.from({length: 10}).map((_, i) => (
                        <span key={"spicy " + i} className={styles.spicy + (i + 1 <= spicy ? (" " + styles.active) : "")}><FontAwesomeIcon icon={faPepperHot}/></span>
                    ))}</div>
                </div>
                <div className={styles.number}>
                    <h5>{spicy}/10</h5>
                </div>
                <div className={styles.container}>
                    <h4>한맛</h4>
                    <div className={styles.hanmat}>{Array.from({length: 10}).map((_, i) => (
                        <span key={"hanmat " + i} className={styles.hanmat + (i + 1 <= hanmat ? (" " + styles.active) : "")}><FontAwesomeIcon icon={faBowlFood}/></span>
                    ))}</div>
                </div>
                <div className={styles.number}>
                    <h5>{hanmat}/10</h5>
                </div>
            </div>
            <p className={styles.description}>{menu.description ?? "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata"}</p>
        </Modal>
    );
}
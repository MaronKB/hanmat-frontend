import styles from './GridContainer.module.css';
import {Menu} from "./Main.tsx";

export default function GridContainer({menu, open}: {menu: Menu, open: (menu: Menu) => void}) {
    return (
        <div className={styles.container} onClick={() => open(menu)}>
            <img src={menu.image} alt={menu.name} />
            <h3>{menu.name.split("(")[0]}</h3>
        </div>
    );
}
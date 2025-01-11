import {useTranslation} from "react-i18next";
import styles from './Main.module.css';
import bg from '../../assets/images/home-bg.jpg';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

export default function Main() {
    const {t} = useTranslation("home");
    return (
        <main className={styles.main} style={{backgroundImage: `url(${bg})`}}>
            {/*<img src={logo} alt="HANMAT"/>*/}
            <h2 className={styles.title}>HANMAT</h2>
            <div className={styles.description}>
                <h3>{t("home:title")}</h3>
                <p>{t("home:description")}</p>
            </div>
            <div className={styles.buttons}>
                <h3>{t("home:learnMore")}</h3>
                <Link to={"/login"}><FontAwesomeIcon icon={faArrowUpRightFromSquare}/></Link>
            </div>
        </main>
    );
}
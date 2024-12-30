import {useTranslation} from "react-i18next";
import styles from './Main.module.css';
import logo from '../../assets/hanmat_logo.png';
import homeBg from '../../assets/images/home-bg.jpg';
import {Link} from "react-router-dom";

export default function Main() {
    const {t} = useTranslation("home");
    return (
        <main className={styles.main} style={{backgroundImage : `url(${homeBg})`}}>
            <img src={logo} alt="HANMAT"/>
            <h2 className={styles.title}>{t("home:welcome")}</h2>
            <section className={styles.section}>
                <h3>{t("home:section1")}</h3>
                <p>{t("home:section1Content")}</p>
                <div className={styles.buttons}>
                    <Link to={"/login"}>{t("home:getStarted")}</Link>
                    <Link to={"/find"}>{t("home:learnMore")}</Link>
                </div>
            </section>
            <section className={styles.section}>
                <h3>{t("home:section2")}</h3>
                <p>{t("home:section2Content")}</p>
            </section>
            <section className={styles.section}>
                <h3>{t("home:section3")}</h3>
                <p>{t("home:section3Content")}</p>
            </section>
        </main>
    );
}
import {Link, Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./Main.module.css";
import i18n from "../../locales/i18n.ts";
import logo from "../../assets/hanmat_logo.png";
import kr_flag from "../../assets/kr-flag.jpg";
import jp_flag from "../../assets/jp-flag.png";
import us_flag from "../../assets/us-flag.png";
import {useEffect, useState} from "react";
import MainNavLink from "./MainNavLink.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
    const {t} = useTranslation("header");
    const [isDark, setDark] = useState(false);
    const setColorScheme = () => {
        const isDark = localStorage.getItem("dark") === "true";
        setDark(isDark);
    }
    const changeColorScheme = (checked: boolean) => {
        document.body.classList.toggle("dark", checked);
        localStorage.setItem("dark", checked ? "true" : "false");
    }
    const setLang = () => {
        localStorage.setItem("lang", i18n.language);
    }
    const controlHeader = () => {
        document.body.classList.toggle(styles.narrow, window.innerWidth <= 1200);
    }
    const toggleMenu = (force: boolean = false) => {
        const header = document.querySelector(`.${styles.header}`);
        if (header) {
            if (force) {
                header.classList.add(`${styles.active}`);
            } else
            header.classList.toggle(`${styles.active}`);
        }
    }

    useEffect(() => {
        setColorScheme();
        controlHeader();
        window.addEventListener("resize", controlHeader);
    }, []);
    useEffect(() => {
        changeColorScheme(isDark)
    }, [isDark]);

    return (
        <>
            <button type={"button"} className={styles.menu} onClick={() => toggleMenu()}>
                <FontAwesomeIcon icon={faBars}/>
            </button>
            <header className={styles.header}>
                <Link to={"/"} className={styles.logo}>
                    <img src={logo} alt="HANMAT"/>
                </Link>
                <nav className={styles.nav}>
                    <MainNavLink link={"/find"} text={t('header:find')}/>
                    <MainNavLink link={"/taste"} text={t('header:taste')}/>
                    <MainNavLink link={"/reviews"} text={t('header:reviews')}/>
                    <MainNavLink link={"/buddy"} text={t('header:buddy')}/>
                    <MainNavLink link={"/mypage"} text={t('header:mypage')}/>
                </nav>
                <div className={styles.color}>
                    <input id="header-darkmode" type={"checkbox"} className={styles.dark} onChange={(ev) => setDark(ev.target.checked)} checked={isDark}/>
                    <label htmlFor="header-darkmode">
                        <span className={styles.slider}/>
                    </label>
                </div>
                <div className={styles.lang}>
                    <button onClick={() => i18n.changeLanguage("en", setLang)} className={i18n.language === "en" ? styles.active : ""}><img src={us_flag} alt={"EN"}/></button>
                    <button onClick={() => i18n.changeLanguage("ko", setLang)} className={i18n.language === "ko" ? styles.active : ""}><img src={kr_flag} alt={"KR"}/></button>
                    <button onClick={() => i18n.changeLanguage("jp", setLang)} className={i18n.language === "jp" ? styles.active : ""}><img src={jp_flag} alt={"JP"}/></button>
                </div>
                <Link to="/login" className={styles.login}>{t('header:login')}</Link>
            </header>
            <Outlet/>
            <footer>
                <p>Footer</p>
            </footer>
        </>
    );
}
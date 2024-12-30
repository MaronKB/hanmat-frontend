import { Link, Outlet } from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./Main.module.css";
import i18n from "../../locales/i18n.ts";
import kr_flag from "../../assets/kr-flag.jpg";
import jp_flag from "../../assets/jp-flag.png";
import us_flag from "../../assets/us-flag.png";
import {useEffect, useState} from "react";

export default function Nav() {
    const {t} = useTranslation("header");
    const [isDark, setDark] = useState(false);
    const setColorScheme = () => {
        const isDark = localStorage.getItem("dark") === "true";
        document.body.classList.toggle("dark", isDark);
    }
    const changeColorScheme = (checked: boolean) => {
        document.body.classList.toggle("dark", checked);
        localStorage.setItem("dark", checked ? "true" : "false");
    }

    useEffect(() => {
        setColorScheme();
    }, []);
    useEffect(() => {
        changeColorScheme(isDark)
    }, [isDark]);

    return (
        <>
            <header className={styles.header}>
                <Link to={"/"} className={styles.logo}>
                    <img src={"/vite.svg"} alt="logo"/>
                    <h1>HANMAT</h1>
                </Link>
                <nav className={styles.nav}>
                    <Link to="/find">{t('header:find')}</Link>
                    <Link to="/taste">{t('header:taste')}</Link>
                    <Link to="/reviews">{t('header:reviews')}</Link>
                    <Link to="/buddy">{t('header:buddy')}</Link>
                    <Link to="/mypage">{t('header:mypage')}</Link>
                </nav>
                <div className={styles.color}>
                    <input id="header-darkmode" type={"checkbox"} className={styles.dark} onChange={(ev) => setDark(ev.target.checked)} checked={isDark}/>
                    <label htmlFor="header-darkmode">
                        <span className={styles.slider}/>
                    </label>
                </div>
                <div className={styles.lang}>
                    <button onClick={() => i18n.changeLanguage("en")} className={i18n.language === "en" ? styles.active : ""}><img src={us_flag} alt={"EN"}/></button>
                    <button onClick={() => i18n.changeLanguage("ko")} className={i18n.language === "ko" ? styles.active : ""}><img src={kr_flag} alt={"KR"}/></button>
                    <button onClick={() => i18n.changeLanguage("jp")} className={i18n.language === "jp" ? styles.active : ""}><img src={jp_flag} alt={"JP"}/></button>
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
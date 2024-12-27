import { Link, Outlet } from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./Main.module.css";
import i18n from "../../locales/i18n.ts";

export default function Nav() {
    const {t} = useTranslation("header");
    console.log(i18n.language, t("header:find"));
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
                <div>
                    <button onClick={() => i18n.changeLanguage("en")}>EN</button>
                    <button onClick={() => i18n.changeLanguage("ko")}>KO</button>
                    <button onClick={() => i18n.changeLanguage("jp")}>JP</button>
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
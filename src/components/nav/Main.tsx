import {Link, Outlet, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./Main.module.css";
import i18n from "../../locales/i18n.ts";
// import logo from "../../assets/hanmat_logo.png";
import kr_flag from "../../assets/kr-flag.jpg";
import jp_flag from "../../assets/jp-flag.png";
import us_flag from "../../assets/us-flag.png";
import {useEffect, useRef, useState} from "react";
import MainNavLink from "./MainNavLink.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faGlobe, faKey, faLanguage, faMoon, faSun} from "@fortawesome/free-solid-svg-icons";
import {AuthData} from "../oauth/GoogleOAuth.tsx";

export default function Nav({alwaysNarrow = false}) {
    const NAV_BREAKPOINT = 880;

    const {t} = useTranslation("header");
    const { pathname } = useLocation();
    const token = localStorage.getItem("token");
    const user = useRef<AuthData>(token ? JSON.parse(token) : null);
    const [isDark, setDark] = useState(false);
    const [isLangOpen, setLangOpen] = useState(false);
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
        if (alwaysNarrow) document.body.classList.add(styles.narrow);
        else document.body.classList.toggle(styles.narrow, window.innerWidth <= NAV_BREAKPOINT);
    }
    const toggleMenu = (force: boolean = false, target: boolean = false) => {
        const header = document.querySelector(`.${styles.header}`);
        if (header) {
            if (force) {
                header.classList.toggle(`${styles.active}`, target);
            } else
            header.classList.toggle(`${styles.active}`);
        }
    }

    useEffect(() => {
        setColorScheme();
        controlHeader();
        window.addEventListener("resize", controlHeader);

        return () => {
            controlHeader();
        }
    }, []);
    useEffect(() => {
        changeColorScheme(isDark)
    }, [isDark]);
    useEffect(() => {
        controlHeader();
        toggleMenu(true, false);
    }, [pathname]);

    return (
        <>
            <button type={"button"} className={styles.menu} onClick={() => toggleMenu()}>
                <FontAwesomeIcon icon={faBars}/>
            </button>
            <header className={styles.header}>
                <Link to={"/"} className={styles.logo}>
                    {/*<img src={logo} alt="HANMAT"/>*/}
                    <h1 className={styles.title}>HANMAT</h1>
                </Link>
                <nav className={styles.nav}>
                    <MainNavLink link={"/find"} text={t('header:find')} toggle={toggleMenu}/>
                    <MainNavLink link={"/taste"} text={t('header:taste')} toggle={toggleMenu}/>
                    <MainNavLink link={"/reviews"} text={t('header:reviews')} toggle={toggleMenu}/>
                    <MainNavLink link={"/buddy"} text={t('header:buddy')} toggle={toggleMenu}/>
                    <MainNavLink link={"/mypage"} text={t('header:mypage')} toggle={toggleMenu}/>
                </nav>
                <div className={styles.controller}>

                    <div className={styles.color}>
                        <input id="header-darkmode" type={"checkbox"} className={styles.dark} onChange={(ev) => setDark(ev.target.checked)} checked={isDark}/>
                        <label htmlFor="header-darkmode">
                            <span className={styles.slider}/>
                        </label>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faSun}/>
                            <FontAwesomeIcon icon={faMoon}/>
                        </div>
                    </div>
                    <div className={styles.lang}>
                        <button onClick={() => setLangOpen(!isLangOpen)}><FontAwesomeIcon icon={faGlobe}/><FontAwesomeIcon icon={faLanguage}/></button>
                        <div className={styles.languages + (isLangOpen ? (" " + styles.opened) : "")}>
                            <button onClick={() => i18n.changeLanguage("en", setLang)}
                                    className={i18n.language === "en" ? styles.active : ""}><img src={us_flag} alt={"EN"}/>
                            </button>
                            <button onClick={() => i18n.changeLanguage("ko", setLang)}
                                    className={i18n.language === "ko" ? styles.active : ""}><img src={kr_flag} alt={"KR"}/>
                            </button>
                            <button onClick={() => i18n.changeLanguage("jp", setLang)}
                                    className={i18n.language === "jp" ? styles.active : ""}><img src={jp_flag} alt={"JP"}/>
                            </button>
                        </div>
                    </div>
                    {user.current &&
                        <a className={styles.login}><FontAwesomeIcon icon={faKey}/></a>
                    }
                    {!user.current &&
                        <Link to="/login" className={styles.login}><FontAwesomeIcon icon={faKey}/></Link>
                    }
                </div>
            </header>
            <Outlet/>
            <footer>
                <p>Footer</p>
            </footer>
        </>
    );
}
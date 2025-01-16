import styles from './Header.module.css';
import {Link, useLocation} from "react-router-dom";
import MainNavLink from "./MainNavLink.tsx";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBars,
    faGear,
    faGlobe,
    faKey,
    faLanguage,
    faMoon,
    faRightFromBracket,
    faSun,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import i18n from "i18next";
import kr_flag from "../../assets/kr-flag.jpg";
import jp_flag from "../../assets/jp-flag.png";
import us_flag from "../../assets/us-flag.png";

export default function Header({alwaysNarrow, user, setDark, isDark, setLang}: {alwaysNarrow: boolean, user: AuthData | null, setDark: (checked: boolean) => void, isDark: boolean, setLang: () => void}) {
    const NAV_BREAKPOINT = 880;

    const {t} = useTranslation("header");
    const { pathname } = useLocation();
    const [isAdminOpen, setAdminOpen] = useState(false);
    const [isLangOpen, setLangOpen] = useState(false);
    const [isContextOpen, setContextOpen] = useState(false);

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

    const changeColorScheme = (checked: boolean) => {
        document.body.classList.toggle("dark", checked);
        localStorage.setItem("dark", checked ? "true" : "false");
    }

    const logout = () => {
        localStorage.removeItem("token");
        user = null;
    }

    useEffect(() => {
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
                    {user?.isAdmin && <div className={styles["admin-container"]}>
                        <button className={styles["admin-button"] + (isAdminOpen ? (" " + styles.active) : "")}
                                onClick={() => setAdminOpen(!isAdminOpen)}>{t('header:admin')}</button>
                        <div className={styles.admin + (isAdminOpen ? (" " + styles.active) : "")}>
                            <MainNavLink link={"/admin/restaurants"} text={t('header:restaurants')}
                                         toggle={toggleMenu}/>
                            <MainNavLink link={"/admin/reviews"} text={t('header:reviews')} toggle={toggleMenu}/>
                            <MainNavLink link={"/admin/users"} text={t('header:users')} toggle={toggleMenu}/>
                        </div>
                    </div>}
                </nav>
                <div className={styles.controller}>
                    <div className={styles.color}>
                        <input id="header-darkmode" type={"checkbox"} className={styles.dark}
                               onChange={(ev) => setDark(ev.target.checked)} checked={isDark}/>
                        <label htmlFor="header-darkmode">
                            <span className={styles.slider}/>
                        </label>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={faSun}/>
                            <FontAwesomeIcon icon={faMoon}/>
                        </div>
                    </div>
                    <div className={styles.lang}>
                        <button onClick={() => setLangOpen(!isLangOpen)}><FontAwesomeIcon
                            icon={faGlobe}/><FontAwesomeIcon icon={faLanguage}/></button>
                        <div className={styles.languages + (isLangOpen ? (" " + styles.opened) : "")}>
                            <button onClick={() => i18n.changeLanguage("en", setLang)}
                                    className={i18n.language === "en" ? styles.active : ""}><img src={us_flag}
                                                                                                 alt={"EN"}/>
                            </button>
                            <button onClick={() => i18n.changeLanguage("ko", setLang)}
                                    className={i18n.language === "ko" ? styles.active : ""}><img src={kr_flag}
                                                                                                 alt={"KR"}/>
                            </button>
                            <button onClick={() => i18n.changeLanguage("jp", setLang)}
                                    className={i18n.language === "jp" ? styles.active : ""}><img src={jp_flag}
                                                                                                 alt={"JP"}/>
                            </button>
                        </div>
                    </div>
                    {user && <>
                        <a onClick={() => setContextOpen(!isContextOpen)} className={styles.login}><FontAwesomeIcon
                            icon={faGear}/></a>
                        <div className={styles.context + (isContextOpen ? (" " + styles.active) : "")}>
                            <Link to={"/mypage"}><FontAwesomeIcon icon={faUser}/></Link>
                            <a onClick={logout}><FontAwesomeIcon icon={faRightFromBracket}/></a>
                        </div>
                    </>}
                    {!user &&
                        <Link to="/login" className={styles.login}><FontAwesomeIcon icon={faKey}/></Link>
                    }
                </div>
            </header>
            <div className={styles.backdrop}/>
        </>
    );
}
import styles from "./Footer.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEnvelope, faKey, faLink, faMobile, faPhone, faUser} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {faFacebook, faInstagram, faTwitter} from "@fortawesome/free-brands-svg-icons";
import i18n from "../../locales/i18n.ts";
import us_flag from "../../assets/us-flag.png";
import kr_flag from "../../assets/kr-flag.jpg";
import jp_flag from "../../assets/jp-flag.png";
import {useTranslation} from "react-i18next";

export default function Footer({alwaysNarrow, setLang}: {alwaysNarrow: boolean, setLang: () => void}) {
    const {t} = useTranslation("header");
    if (alwaysNarrow) return null;

    return (
        <footer className={styles.footer}>
            <h2 className={styles.subtitle}><span>HANMAT</span><span>KOREAN TASTE</span></h2>
            <div className={styles.info}>
                <div className={styles.container + " " + styles.left}>
                    <section className={styles.contact}>
                        <h3 className={styles.title}>Contact</h3>
                        <p><FontAwesomeIcon icon={faPhone}/>02-1234-5678</p>
                        <p><FontAwesomeIcon icon={faMobile}/>010-1234-5678</p>
                        <p><FontAwesomeIcon icon={faEnvelope}/>admin@hanmat.com</p>
                    </section>
                    <section className={styles.links}>
                        <h3 className={styles.title}>Links</h3>
                        <Link to={"/"}><FontAwesomeIcon icon={faLink}/>{t('header:home')}</Link>
                        <Link to={"/find"}><FontAwesomeIcon icon={faLink}/>{t('header:find')}</Link>
                        <Link to={"/taste"}><FontAwesomeIcon icon={faLink}/>{t('header:taste')}</Link>
                        <Link to={"/reviews"}><FontAwesomeIcon icon={faLink}/>{t('header:reviews')}</Link>
                        <Link to={"/buddy"}><FontAwesomeIcon icon={faLink}/>{t('header:buddy')}</Link>
                    </section>
                </div>
                <div className={styles.container + " " + styles.right}>
                    <section className={styles.sns}>
                        <h3 className={styles.title}>SNS</h3>
                        <a href={"https://www.instagram.com/"}><FontAwesomeIcon icon={faInstagram}/>Instagram</a>
                        <a href={"https://www.facebook.com/"}><FontAwesomeIcon icon={faFacebook}/>Facebook</a>
                        <a href={"https://www.twitter.com/"}><FontAwesomeIcon icon={faTwitter}/>Twitter</a>
                    </section>
                    <section className={styles.user}>
                        <h3 className={styles.title}>User</h3>
                        <Link to={"/login"}><FontAwesomeIcon icon={faKey}/>{t('header:login')}</Link>
                        <Link to={"/signup"}><FontAwesomeIcon icon={faUser}/>{t('header:signup')}</Link>
                    </section>
                    <section className={styles.language}>
                        <h3 className={styles.title}>Language</h3>
                        <button onClick={() => i18n.changeLanguage("en", setLang)}>
                            <img src={us_flag} alt={"EN"}/>
                            <span>English</span>
                            {i18n.language === "en" && <FontAwesomeIcon icon={faCheck}/>}
                        </button>
                        <button onClick={() => i18n.changeLanguage("ko", setLang)}
                                className={i18n.language === "ko" ? styles.active : ""}>
                            <img src={kr_flag} alt={"KR"}/>
                            <span>한국어</span>
                            {i18n.language === "ko" && <FontAwesomeIcon icon={faCheck}/>}
                        </button>
                        <button onClick={() => i18n.changeLanguage("jp", setLang)}
                                className={i18n.language === "jp" ? styles.active : ""}>
                            <img src={jp_flag} alt={"JP"}/>
                            <span>日本語</span>
                            {i18n.language === "jp" && <FontAwesomeIcon icon={faCheck}/>}
                        </button>
                    </section>
                </div>
            </div>
            <div className={styles.copy}>
                <p>&copy; 2021 HANMAT. All rights reserved.</p>
            </div>
        </footer>
    );
}
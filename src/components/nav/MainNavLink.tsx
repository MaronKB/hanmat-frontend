import {NavLink, NavLinkRenderProps} from "react-router-dom";
import styles from "./MainNavLink.module.css";

export default function MainNavLink({link, text, toggle}: {link: string, text: string, toggle: () => void}) {
    return (
        <NavLink to={link} className={({isActive}: NavLinkRenderProps) => isActive ? styles.link + " " + styles.active : styles.link} onClick={toggle}>{text}</NavLink>
    );
}
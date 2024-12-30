import {NavLink, NavLinkRenderProps} from "react-router-dom";
import styles from "./MainNavLink.module.css";

export default function MainNavLink({link, text}: {link: string, text: string}) {
    return (
        <NavLink to={link} className={({isActive}: NavLinkRenderProps) => isActive ? styles.link + " " + styles.active : styles.link}>{text}</NavLink>
    );
}
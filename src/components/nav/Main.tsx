import {Outlet} from "react-router-dom";
import i18n from "../../locales/i18n.ts";
import {useEffect, useRef, useState} from "react";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

export default function Nav({alwaysNarrow = false}) {
    const token = localStorage.getItem("token");
    const user = useRef<AuthData | null>(token ? JSON.parse(token) : null);
    const [isDark, setDark] = useState(false);

    const setColorScheme = () => {
        const isDark = localStorage.getItem("dark") === "true";
        setDark(isDark);
    }
    const setLang = () => {
        localStorage.setItem("lang", i18n.language);
    }

    useEffect(() => {
        setColorScheme();
    }, []);

    return (
        <>
            <Header alwaysNarrow={alwaysNarrow} user={user.current} setDark={setDark} isDark={isDark} setLang={setLang}/>
            <Outlet/>
            <Footer alwaysNarrow={alwaysNarrow} setLang={setLang}/>
        </>
    );
}
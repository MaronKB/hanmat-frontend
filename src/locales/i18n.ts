import i18n, {Resource} from "i18next";
import {initReactI18next} from "react-i18next";
import headerEn from "./en/header.json";
import headerKo from "./ko/header.json";
import headerJp from "./jp/header.json";

const resources: Resource = {
    en: {
        header: { ...headerEn }
    },
    ko: {
        header: { ...headerKo }
    },
    jp: {
        header: { ...headerJp }
    },
} as const;

const userLang = navigator.language;

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("lang") || userLang.slice(0, 2) || "en",
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
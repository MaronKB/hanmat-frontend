import i18n, {Resource} from "i18next";
import {initReactI18next} from "react-i18next";

import headerEn from "./en/header.json";
import headerKo from "./ko/header.json";
import headerJp from "./jp/header.json";

import homeEn from "./en/home.json";
import homeKo from "./ko/home.json";
import homeJp from "./jp/home.json";

import reviewsEn from "./en/reviews.json";
import reviewsKo from "./ko/reviews.json";
import reviewsJp from "./jp/reviews.json";

const resources: Resource = {
    en: {
        header: { ...headerEn },
        home: { ...homeEn },
        reviews: { ...reviewsEn }
    },
    ko: {
        header: { ...headerKo },
        home: { ...homeKo },
        reviews: { ...reviewsKo }
    },
    jp: {
        header: { ...headerJp },
        home: { ...homeJp },
        reviews: { ...reviewsJp }
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
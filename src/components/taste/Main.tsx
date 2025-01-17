import styles from './Main.module.css';
import {useEffect, useState} from "react";
import GridContainer from "./GridContainer.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import TasteModal from "./TasteModal.tsx";
import {useTranslation} from "react-i18next";

export type Menu = {
    id: number,
    name: string,
    category: string,
    image: string,
    dscrn: string,
    description: string,
    spicy: number,
    hanmat: number,
}

export default function Taste() {
    const {t} = useTranslation();
    const lang = localStorage.getItem("lang") || "en";

    const [menus, setMenus] = useState<Menu[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [list, setList] = useState<Menu[]>([]);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

    const getMenus = async () => {
        const response = await fetch(`http://localhost:8080/hanmat/api/food/${lang}`);
        // const response = await fetch(`https://portfolio.mrkb.kr/hanmat/api/food/${lang}`);
        const data = await response.json();
        console.log(data);
        setMenus(shuffle(data.data));
        setTotalPage(Math.ceil(data.data.length / 12));

        return null;
    }

    const shuffle = (array:[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const goPage = (page:number) => {
        if (page < 1) {
            setPage(totalPage);
        } else if (page > totalPage) {
            setPage(1);
        } else
        setPage(page);
    }

    const openModal = (menu: Menu) => {
        setSelectedMenu(menu);
        setIsModalOpened(true);
    }

    useEffect(() => {
        getMenus();
    }, []);

    useEffect(() => {
        getMenus();
    }, [t]);

    useEffect(() => {
        setList(menus.slice((page - 1) * 12, page * 12));
    }, [menus, page]);

    return (
        <main className={"max"}>
            <div className={styles.grid}>
                {list.map((menu: Menu) => (
                    <GridContainer key={menu.id} menu={menu} open={openModal}/>
                ))}
            </div>
            <div className={styles.pagination}>
                <button onClick={() => goPage(page - 1)}><FontAwesomeIcon icon={faAngleLeft} /></button>
                <button onClick={() => goPage(page + 1)}><FontAwesomeIcon icon={faAngleRight}/></button>
            </div>
            {selectedMenu && <TasteModal menu={selectedMenu} isOpened={isModalOpened} close={() => setIsModalOpened(false)}/>}
        </main>
    );
};
import styles from './Main.module.css';
import {useEffect, useState} from "react";
import GridContainer from "./GridContainer.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";

export default function Taste() {
    const [menus, setMenus] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [list, setList] = useState([]);
    const lang = localStorage.getItem("lang") || "en";

    const getMenus = async () => {
        const response = await fetch(`http://localhost:8080/hanmat/api/food/${lang}`);
        // const response = await fetch(`https://portfolio.mrkb.kr/hanmat/api/food/${lang}`);
        const data = await response.json();
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

    useEffect(() => {
        getMenus();
    }, []);

    useEffect(() => {
        setList(menus.slice((page - 1) * 12, page * 12));
    }, [menus, page]);

    return (
        <main className={"max"}>
            <div className={styles.grid}>
                {list.map((menu: {id: string, image: string, name: string, dscrn: string}) => (
                    <GridContainer key={menu.id} id={menu.id} img={menu.image} title={menu.name} dscrn={menu.dscrn}/>
                ))}
            </div>
            <div className={styles.pagination}>
                <button onClick={() => goPage(page - 1)}><FontAwesomeIcon icon={faAngleLeft} /></button>
                <button onClick={() => goPage(page + 1)}><FontAwesomeIcon icon={faAngleRight}/></button>
            </div>
        </main>
    );
};
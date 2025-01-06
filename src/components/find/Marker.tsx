import {Marker} from "react-naver-maps";
import styles from "./Marker.module.css";

export default function MarkerComponent({id, name, latitude, longitude, highlightClass, openModal}: {id: number, name: string, latitude: number, longitude: number, highlightClass: string, openModal: (restaurant: {id: number, name: string}) => void}) {
    const position = {lat: latitude, lng: longitude};

    const gotoRestaurant = () => {
        document.querySelectorAll("." + highlightClass).forEach((el) => {
            el.classList.remove(highlightClass);
        });
        const target = document.querySelector("#restaurant-" + id);
        if (target) {
            target.scrollIntoView({behavior: "smooth", block: "center"});
            target.classList.add(highlightClass);
        }
    }

    const createIcon = (name: string) => {
        const icon = document.createElement('div');
        icon.className = styles.marker;

        const title = document.createElement('h3');
        title.className = styles.title;
        title.textContent = name;

        const img = document.createElement('img');
        img.src = 'https://cdn-icons-png.flaticon.com/512/5235/5235253.png';
        img.alt = '마커';

        icon.append(title);
        icon.append(img);

        return icon.outerHTML;
    }

    return (
        <>
            <Marker
                position={position}
                icon={
                    {
                        content: createIcon(name),
                        size: {width: 40, height: 40},
                        scaledSize: {width: 40, height: 40},
                        anchor: {x: 20, y: 20}
                    }
                }
                onMouseover={gotoRestaurant}
                onMouseout={() => document.querySelector("#restaurant-" + id)?.classList.remove(highlightClass)}
                onClick={() => openModal({id, name})}
            />
        </>
    );
}
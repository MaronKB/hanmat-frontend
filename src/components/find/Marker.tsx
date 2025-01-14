import {Marker} from "react-naver-maps";
import styles from "./Marker.module.css";
import {Restaurant} from "./Main";

export default function MarkerComponent({restaurant, highlightClass, openModal}: {restaurant: Restaurant, highlightClass: string, openModal: (restaurant: Restaurant) => void}) {
    const position = {lat: restaurant.latitude, lng: restaurant.longitude};

    const gotoRestaurant = () => {
        document.querySelectorAll("." + highlightClass).forEach((el) => {
            el.classList.remove(highlightClass);
        });
        const target = document.querySelector("#restaurant-" + restaurant.id);
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
                        content: createIcon(restaurant.name),
                        size: {width: 40, height: 40},
                        scaledSize: {width: 40, height: 40},
                        anchor: {x: 20, y: 20}
                    }
                }
                onMouseover={gotoRestaurant}
                onMouseout={() => document.querySelector("#restaurant-" + restaurant.id)?.classList.remove(highlightClass)}
                onClick={() => openModal(restaurant)}
            />
        </>
    );
}
import {Container as MapDiv, NaverMap, Marker, NavermapsProvider} from "react-naver-maps";
import MarkerComponent from "./Marker.tsx";
import styles from "./Main.module.css";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal.tsx";

export default function Main() {
    let lang = localStorage.getItem("lang") || "en";
    if (lang === "jp") lang = "ja";

    const [userLocation, setUserLocation] = useState({lat: 37.5665, lng: 126.9780});
    const [restaurants, setRestaurants] = useState([]);
    const [currentRestaurant, setCurrentRestaurant] = useState({id: 0, name: ""});
    const [isModalOpened, setIsModalOpened] = useState(false);

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos);
            const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            setUserLocation(coords);
            getNearbyRestaurants(coords);
            console.log(pos);
        });
    };

    const getNearbyRestaurants: ({lat, lng}: {lat:number, lng:number}) => void = ({lat, lng}) => {
        //todo: change to production url
        const locationDTO = {
            latitude: lat,
            longitude: lng
        }
        fetch(`http://localhost:8080/hanmat/api/restaurant/nearby`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(locationDTO),
        }).then(response => response.json()).then(data => {
            console.log(data.data);
            setRestaurants(data.data);
        });
    }

    const foldSidebar = () => {
        const sidebar = document.querySelector("." + styles.sidebar);
        if (sidebar) {
            sidebar.classList.toggle(styles.closed);
        }
    }

    const openModal = (restaurant: {id: number, name: string}) => {
        setCurrentRestaurant(restaurant);
        setIsModalOpened(true);
    }

    const closeModal = () => {
        setIsModalOpened(false);
    }

    useEffect(() => {
        getMyLocation();
    }, []);

    return (
        <NavermapsProvider ncpClientId={"d2682gqz4u&language=" + lang}>
            <main className={"max " + styles.main}>
                <MapDiv style={{width: "100%", height: "100%"}}>
                    <NaverMap center={userLocation} zoom={19}>
                        {restaurants.map((restaurant: {id: number, name: string, latitude: number, longitude: number}) => (
                            <MarkerComponent
                                key={restaurant.id}
                                id={restaurant.id}
                                name={restaurant.name}
                                latitude={restaurant.latitude}
                                longitude={restaurant.longitude}
                                highlightClass={styles.highlight}
                                openModal={openModal}
                            />
                        ))}
                        <Marker defaultPosition={userLocation}
                                onClick={() => alert("You are here!")}
                        />
                    </NaverMap>
                </MapDiv>
                <div className={styles.sidebar}>
                    <header>
                        <h1>Restaurants</h1>
                    </header>
                    <div className={styles.restaurants}>
                        {restaurants.map((restaurant: {id: number, name: string, latitude: number, longitude: number}) => (
                            <div key={restaurant.id} id={"restaurant-" + restaurant.id} className={styles.restaurant} onClick={() => openModal({id: restaurant.id, name: restaurant.name})}>
                                <h2>{restaurant.name}</h2>
                            </div>
                        ))}
                    </div>
                    <div className={styles["fold-container"]}>
                        <div className={styles["fold-background"]}/>
                        <button className={styles.fold} onClick={foldSidebar}><FontAwesomeIcon icon={faChevronRight}/></button>
                    </div>
                </div>
            </main>
            <Modal
                restaurant={currentRestaurant}
                isOpened={isModalOpened}
                close={closeModal}
            />
        </NavermapsProvider>
    );
}
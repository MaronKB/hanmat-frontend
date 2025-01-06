import {Container as MapDiv, NaverMap, Marker, NavermapsProvider} from "react-naver-maps";
import styles from "./Main.module.css";
import {useEffect, useState} from "react";

export default function Main() {
    let lang = localStorage.getItem("lang") || "en";
    if (lang === "jp") lang = "ja";

    const [userLocation, setUserLocation] = useState({lat: 37.5665, lng: 126.9780});
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        getMyLocation();
    }, []);

    useEffect(() => {
        getNearbyRestaurants();
    }, [userLocation]);

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos);
            const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            setUserLocation(coords);
            console.log(pos);
        });
    };

    const getNearbyRestaurants = async () => {
        //todo: change to production url
        const locationDTO = {
            city: "Seoul",
            latitude: userLocation.lat,
            longitude: userLocation.lng
        }
        const response = await fetch(`http://localhost:8080/hanmat/api/restaurant/nearby`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(locationDTO),
        });

        const data = await response.json();
        console.log(data.data);
        setRestaurants(data.data);
    }

    return (
        <NavermapsProvider ncpClientId={"d2682gqz4u&language=" + lang}>
            <main className={"max " + styles.main}>
                <MapDiv style={{width: "100%", height: "100%"}}>
                    <NaverMap defaultCenter={userLocation} zoom={18}>
                        {restaurants.map((restaurant: {id: string, name: string, latitude: number, longitude: number}) => (
                            <Marker key={restaurant.id} position={{lat: restaurant.latitude, lng: restaurant.longitude}}/>
                        ))}
                        <Marker defaultPosition={userLocation}/>
                    </NaverMap>
                </MapDiv>
            </main>
        </NavermapsProvider>
    );
}
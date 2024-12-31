import {Container as MapDiv, NaverMap, Marker, NavermapsProvider} from "react-naver-maps";
import styles from "./Main.module.css";
import {useEffect, useState} from "react";

export default function Main() {
    let lang = localStorage.getItem("lang") || "en";
    if (lang === "jp") lang = "ja";

    const [userLocation, setUserLocation] = useState({lat: 37.5665, lng: 126.9780});

    useEffect(() => {
        getMyLocation();
    }, []);

    useEffect(() => {
    }, [userLocation]);

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            setUserLocation(coords);
            console.log(pos);
        });
    };
    return (
        <NavermapsProvider ncpClientId={"d2682gqz4u&language=" + lang}>
            <main className={"max " + styles.main}>
                <MapDiv style={{width: "100%", height: "100%"}}>
                    <NaverMap defaultCenter={userLocation} zoom={18}>
                        <Marker defaultPosition={userLocation}/>
                    </NaverMap>
                </MapDiv>
            </main>
        </NavermapsProvider>
    );
}
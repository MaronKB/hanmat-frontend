import styles from "./Modal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faX} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {MouseEvent} from "react";

interface Image {
    link: string;
    thumbnail: string;
}
export default function Modal({restaurant, isOpened, close}: {restaurant: {id: number, name: string}, isOpened: boolean, close: () => void}) {
    const [images, setImages] = useState<Image[]>([]);
    const [isPreviewOpened, setIsPreviewOpened] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<Image | null>(null);

    const getImages = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/map/${restaurant.name}`);
        const data = await response.json();
        setImages(data.data);
    }

    const set = (image: Image) => {
        setCurrentImage(image);
        setIsPreviewOpened(true);
    }

    const show = (ev: MouseEvent<HTMLButtonElement>, image: Image, next: boolean) => {
        ev.stopPropagation();
        const index = images.indexOf(image);
        if (next) {
            if (index < images.length - 1) {
                setCurrentImage(images[index + 1]);
            } else {
                setCurrentImage(images[0]);
            }
        } else {
            if (index > 0) {
                setCurrentImage(images[index - 1]);
            } else {
                setCurrentImage(images[images.length - 1]);
            }
        }
    }

    useEffect(() => {
        if (restaurant.name) getImages();
    }, [restaurant]);

    return (
        <>
            <div className={styles["modal-container"] + (isOpened ? (" " + styles.opened) : "")}>
                <div className={styles.modal}>
                    <header className={styles.header}>
                        <h2>{restaurant.name}</h2>
                        <button className={styles.close} onClick={close}><FontAwesomeIcon icon={faX}/></button>
                    </header>
                    <div className={styles.content}>
                        <div className={styles.images}>
                            {images.map((image: Image, index: number) => (
                                <img key={index} className={styles.image} src={image.link} alt={restaurant.name} onClick={() => set(image)}/>
                            ))}
                        </div>
                        <p>{restaurant.name}</p>
                    </div>
                </div>
            </div>
            {(isPreviewOpened && currentImage) &&
                <div className={styles.preview} onClick={() => setIsPreviewOpened(false)}>
                    <button type={"button"} className={styles.arrow} onClick={(ev) => show(ev, currentImage, false)}>
                        <FontAwesomeIcon icon={faChevronLeft}/></button>
                    <img src={currentImage.link} alt={restaurant.name}/>
                    <button type={"button"} className={styles.arrow} onClick={(ev) => show(ev, currentImage, true)}>
                        <FontAwesomeIcon icon={faChevronRight}/></button>
                </div>}
        </>
    );
}
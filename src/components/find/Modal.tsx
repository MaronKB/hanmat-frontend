import styles from "./Modal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressBook,
    faChevronLeft,
    faChevronRight,
    faCopy,
    faX
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {MouseEvent} from "react";
import {Restaurant} from "./Main.tsx";
import {Review} from "../reviews/Main.tsx";
import Item from "../reviews/Item.tsx";
import errorImage from "../../assets/images/error-image.png";

type Image = {
    link: string;
    thumbnail: string;
}
export default function Modal({restaurant, isOpened, close}: {restaurant: Restaurant, isOpened: boolean, close: () => void}) {
    const [images, setImages] = useState<Image[]>([]);
    const [isPreviewOpened, setIsPreviewOpened] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<Image | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState<number>(1);

    const getImages = async () => {
        const address = restaurant.roadAddr.length > 0 ? restaurant.roadAddr : restaurant.lmmAddr;
        const string = address + ", " + restaurant.name;
        /*
        issue: 네이버 이미지 링크가 다 낡았음
        todo: 검색엔진 네이버 => 구글로 변경 바꿔야 함
         */
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/map/${string}`);
        const data = await response.json();
        setImages(data.data);
    }

    const getReviews = async () => {
        // todo: change to each restaurant url
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/all?page=1&size=6&sort=new`);
        // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/restaurant/${restaurant.id}?page=${page}&size=6&sort=new`);
        const data = await response.json();
        setReviews(data.data.items);
    }

    const getMoreReviews = async () => {
        // todo: change to each restaurant url
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/all?page=${page}&size=6&sort=new`);
        // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/restaurant/${restaurant.id}?page=${page}&size=6&sort=new`);
        const data = await response.json();
        const newReviews = [...reviews];
        newReviews.push(...data.data.items);
        setReviews(newReviews);
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
        if (restaurant.id) getReviews();
    }, [restaurant]);

    useEffect(() => {
        if (page > 1) getMoreReviews();
    }, [page]);

    return (
        <>
            <div className={styles["modal-container"] + (isOpened ? (" " + styles.opened) : "")}>
                <div className={styles.modal}>
                    <header className={styles.header}>
                        <h2>{restaurant.name}</h2>
                        <button className={styles.close} onClick={close}><FontAwesomeIcon icon={faX}/></button>
                    </header>
                    <div className={styles.content}>
                        <section className={styles.main}>
                            <div className={styles.images}>
                                {images.map((image: Image, index: number) => (
                                    <img key={index} className={styles.image}
                                         src={image.link}
                                         alt={restaurant.name}
                                         onError={(ev) => ev.currentTarget.src = errorImage}
                                         onClick={() => set(image)}/>
                                ))}
                            </div>
                            <div className={styles.text}>
                                <h3 className={styles.title}>{restaurant.name}</h3>
                                <div className={styles.address}>
                                    <FontAwesomeIcon icon={faAddressBook}/>
                                    {restaurant.roadAddr.length > 0 && <a><span>{restaurant.roadAddr}</span><FontAwesomeIcon icon={faCopy}/></a>}
                                    {restaurant.lmmAddr.length > 0 && <a><span>{restaurant.lmmAddr}</span><FontAwesomeIcon icon={faCopy}/></a>}
                                </div>
                                <p className={styles.description}>{restaurant.description ?? "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata"}</p>
                            </div>
                        </section>
                        <section className={styles["review-container"]}>
                            <h3 className={styles["review-title"]}>Reviews</h3>
                            <div className={styles.reviews}>
                                {reviews.length > 0 ? reviews.map((review: Review) => (
                                    <Item key={review.id} review={review} set={() => {
                                    }}/>
                                )) : <p>No reviews</p>}
                            </div>
                            {reviews.length > 0 &&
                                <button className={styles.more} onClick={() => setPage(page + 1)}>More</button>}
                        </section>
                    </div>
                </div>
            </div>
            {(isPreviewOpened && currentImage) &&
                <div className={styles.preview} onClick={() => setIsPreviewOpened(false)}>
                    <button type={"button"} className={styles.arrow} onClick={(ev) => show(ev, currentImage, false)}>
                        <FontAwesomeIcon icon={faChevronLeft}/></button>
                    <img src={currentImage.link}
                         alt={restaurant.name}
                         onError={(ev) => ev.currentTarget.src = errorImage}
                    />
                    <button type={"button"} className={styles.arrow} onClick={(ev) => show(ev, currentImage, true)}>
                        <FontAwesomeIcon icon={faChevronRight}/></button>
                </div>}
        </>
    );
}
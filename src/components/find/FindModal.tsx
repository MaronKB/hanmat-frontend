import styles from "./FindModal.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressBook,
    faChevronLeft,
    faChevronRight,
    faCopy
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {MouseEvent} from "react";
import {Restaurant} from "./Main.tsx";
import {Review} from "../reviews/Main.tsx";
import Modal from "../common/Modal.tsx";
import Item from "../reviews/Item.tsx";
import errorImage from "../../assets/images/error-image.png";

type Image = {
    link: string;
    thumbnail: string;
}
export default function FindModal({restaurant, isOpened, close}: {restaurant: Restaurant, isOpened: boolean, close: () => void}) {
    const [images, setImages] = useState<Image[]>([]);
    const [isPreviewOpened, setIsPreviewOpened] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<Image | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState<number>(1);

    const key = "AIzaSyCKZIAKfa02TOjE1l-AKIHVp8FN_YYtz7Q";
    const engineId = "4337cc49ad6b4468a";

    const getImages = async () => {
        const address = restaurant.roadAddr.length > 0 ? restaurant.roadAddr : restaurant.lmmAddr;
        const string = address + ", " + restaurant.name;
        // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/map/${string}`); // 네이버
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${engineId}&q=${string}&searchType=image&num=4`); // 구글
        const data = await response.json();
        setImages(data.items);
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
            <Modal title={restaurant.name} isOpened={isOpened} close={close}>
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
                                <Item key={review.id} review={review} onClick={() => {}}/>
                            )) : <p>No reviews</p>}
                        </div>
                        {reviews.length > 0 &&
                            <button className={styles.more} onClick={() => setPage(page + 1)}>More</button>}
                    </section>
                </div>
            </Modal>
            {(isPreviewOpened && currentImage) && <div className={styles.preview} onClick={() => setIsPreviewOpened(false)}>
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
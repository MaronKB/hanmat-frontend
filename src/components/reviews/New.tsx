import styles from "./New.module.css";
import {Review} from "./Main.tsx";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faMapLocation,
    faMapLocationDot,
    faPlus,
    faRotate,
    faSearch,
    faStar,
    faTimes,
    faUtensils
} from "@fortawesome/free-solid-svg-icons";
import React, {FormEvent, useEffect, useState} from "react";
import Modal from "../common/Modal.tsx";
import {KeyboardEvent} from "react";
import {Restaurant} from "../find/Main.tsx";
import {useTranslation} from "react-i18next";

type ReviewFormData = {
    title: string;
    content: string;
    images: FileList;
}

export default function New({isOpened, open}: { isOpened: boolean, open: (open: boolean) => void }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(token || '{}') as AuthData;
    const {t} = useTranslation();

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [finalRating, setFinalRating] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [fileList, setFileList] = useState<FileList | null>(null);
    const [searchedRestaurants, setSearchedRestaurants] = useState<Restaurant[]>([]);
    const [isSearchResultsOpen, setSearchResultsOpen] = useState<boolean>(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    const getFormData = () => {
        const form = document.querySelector('#new-review') as HTMLFormElement;
        const formData = new FormData(form);
        const entries = Object.fromEntries(formData.entries());
        return {
            title: entries.title,
            content: entries.content,
            images: fileList
        } as ReviewFormData;
    }

    const getRestaurants = async (name: string) => {
        if (name.length < 2) return;
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/restaurant/name/${name}`,
            { method: 'GET' }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch restaurant data.');
        }
        const restaurants = await response.json();
        setSearchedRestaurants(restaurants.data as Restaurant[]);
    }

    const toggleSearchResults = (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            const results = document.querySelector(`.${styles["search-results"]}`);
            if (!results) return;
            const current = results.querySelector(`.${styles["search-result"]}.${styles.active}`);
            if (current) {
                selectRestaurant(parseInt(current.id.replace("restaurant-", "")));
            }
        }
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
            ev.preventDefault();

            const results = document.querySelector(`.${styles["search-results"]}`);
            if (!results) return;

            const current = results.querySelector(`.${styles["search-result"]}.${styles.active}`);
            if (!current) {
                const newCurrent = results.querySelector(`.${styles["search-result"]}`);
                if (newCurrent) {
                    newCurrent.classList.add(styles.active);
                    newCurrent.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            const next = current[ev.key === "ArrowDown" ? "nextElementSibling" : "previousElementSibling"];
            if (next) {
                current.classList.remove(styles.active);
                next.classList.add(styles.active);
                next.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    const selectRestaurant = (id: number) => {
        const restaurant = searchedRestaurants.find((r) => r.id === id);
        if (restaurant) {
            const searchInput = document.querySelector(`.${styles["search-input"]}`) as HTMLInputElement;
            searchInput.value = restaurant.name;
            setSelectedRestaurant(restaurant);
            setSearchResultsOpen(false);
        }
    }

    const addReview = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const newReviewData = getFormData();

        if (rating === 0) {
            alert('Please select a star rating!');
            return;
        }

        const formData = new FormData();
        Array.from(newReviewData.images).forEach((file) => formData.append('image', file));

        // const res = await fetch(`http://localhost:3000/hanmat/media/upload`, {
        const res = await fetch('https://portfolio.mrkb.kr/hanmat/media/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            alert('Failed to upload images. Please try again.');
            return
        }

        interface FileData {
            destination: string,
            encoding: string,
            fieldname: string,
            filename: string,
            mimetype: string,
            originalname: string,
            path: string,
            size: number
        }

        const files = await res.json();
        const imageNames = files.map((f: FileData) => f.filename);

        const createRandomString = (length: number) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        const newReview = {
            id: 0,
            title: "Review " + createRandomString(8), // newReviewData.title.toString(),
            author: user.email,
            restaurantId: selectedRestaurant?.id ?? 20,
            content: newReviewData.content.toString(),
            rating: rating,
            image1: imageNames[0] || '',
            image2: imageNames[1] || '',
            image3: imageNames[2] || '',
            image4: imageNames[3] || '',
        } as Review;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview),
            });

            if (!response.ok) {
                throw new Error('Failed to save the review.');
            }
            alert('Your review has been submitted successfully!');
            open(false); // 모달 닫기
        } catch (error) {
            console.error('Error saving review:', error);
            alert('Failed to save the review. Please try again.');
        }
    };

    // 이미지 업로드 핸들러

    const addImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages: File[] = Array.from(files);
            const imageURLs: string[] = newImages.map((file) => URL.createObjectURL(file));
            const imageArray: string[] = Array.from(images).concat(imageURLs);
            if (imageArray.length > 4) {
                alert('You can only upload up to 4 images!');
                return;
            }
            const dataTransfer = new DataTransfer();
            const imageFilesArray: File[] = (fileList) ? Array.from(fileList).concat(newImages) : newImages;
            imageFilesArray.forEach((file) => dataTransfer.items.add(file));
            setImages(imageArray);
            setFileList(dataTransfer.files);
        }
    };

    // 이미지 삭제 핸들러
    const deleteImage = (index: number) => {
        const updatedImages = images.filter((_: string, i: number) => i !== index);
        setImages(updatedImages);

        const dataTransfer = new DataTransfer();
        const updatedFiles = (fileList) ? Array.from(fileList).filter((_: File, i:number) => i !== index) : [];
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        setFileList(dataTransfer.files);
    };

    useEffect(() => {
        setFinalRating(hoverRating || rating);
    }, [hoverRating, rating]);

    return (
        <Modal title={t("reviews:newReview")} isOpened={isOpened} close={() => open(false)}>
            <form id="new-review" className={styles.content} onSubmit={(ev) => addReview(ev)}>
                <div className={styles.restaurant + (selectedRestaurant ? (" " + styles.active) : "")}>
                    <input type={"hidden"} name={"restaurantId"} value={selectedRestaurant?.id ?? ""}/>
                    <div className={styles["restaurant-header"]}>
                        <FontAwesomeIcon icon={faUtensils}/>
                        <h3>{selectedRestaurant?.name ?? t("reviews:selectRestaurant")}</h3>
                        {selectedRestaurant &&
                            <button type={"button"} onClick={() => setSelectedRestaurant(null)}><FontAwesomeIcon
                                icon={faRotate}/></button>}
                    </div>

                    <div className={styles["search-input-container"]}>
                        <FontAwesomeIcon icon={faSearch}/>
                        <input
                            type="text"
                            placeholder={t("reviews:searchRestaurant")}
                            className={styles["search-input"]}
                            onInput={(ev) => getRestaurants(ev.currentTarget.value)}
                            onFocus={() => setSearchResultsOpen(true)}
                            onBlur={() => setTimeout(() => setSearchResultsOpen(false), 200)}
                            onKeyDown={(ev) => toggleSearchResults(ev)}
                        />
                        {isSearchResultsOpen && <div className={styles["search-results"]}>
                            {searchedRestaurants.map((restaurant) => (
                                <div key={"restaurant-" + restaurant.id} id={"restaurant-" + restaurant.id}
                                     className={styles["search-result"]}
                                     onClick={() => selectRestaurant(restaurant.id)}>
                                    {restaurant.name}
                                </div>
                            ))}
                        </div>}
                    </div>
                    <div className={styles["restaurant-body"]}>
                        <p>{selectedRestaurant?.description ?? "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata"}</p>
                        <p><FontAwesomeIcon
                            icon={faMapLocationDot}/>{selectedRestaurant?.lmmAddr ?? t("reviews:addressNotExists")}
                        </p>
                        <p><FontAwesomeIcon
                            icon={faMapLocation}/>{selectedRestaurant?.roadAddr ?? t("reviews:addressNotExists")}
                        </p>
                    </div>
                    <div className={styles["restaurant-footer"]}/>
                </div>
                <div className={styles.ratings}>
                    <div className={styles.rating}>
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index}
                                className={styles.star + (index < finalRating ? (" " + styles.filled) : "")}
                                onClick={() => setRating(index + 1)}
                                onMouseEnter={() => setHoverRating(index + 1)}
                                onMouseLeave={() => setHoverRating(null)}
                            >
                                <FontAwesomeIcon icon={faStar}/>
                            </span>
                        ))}
                    </div>
                    <span className={styles["rating-instruction"]}>
                        {rating > 0
                            ? `You selected ${rating} star${rating > 1 ? 's' : ''}!`
                            : t("reviews:selectRating")
                        }
                    </span>
                </div>

                <div className={styles["image-upload"]}>
                    <div className={styles["image-preview-grid"]}>
                        {images.map((image, index) => (
                            <div key={index} className={styles["image-thumbnail-container"]}>
                                <img src={image} alt={`Preview ${index}`} className={styles["image-thumbnail"]}/>
                                <button type={"button"} className={styles["delete-button"]}
                                        onClick={() => deleteImage(index)}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </div>
                        ))}
                    </div>
                    <label htmlFor="file-upload" className={styles["upload-label"]}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        name={"images"}
                        className={styles["file-input"]}
                        onChange={addImages}
                        accept="image/*"
                        multiple
                    />
                </div>
                <textarea
                    name={"content"}
                    className={styles.textarea}
                    placeholder={t("reviews:writeReview")}
                />
                <div className={styles.buttons}>
                    <button type={"button"} onClick={() => open(false)}>{t("reviews:cancel")}</button>
                    <button type={"submit"}>{t("reviews:submit")}</button>
                </div>
            </form>
        </Modal>
    );
}

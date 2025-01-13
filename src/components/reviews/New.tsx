import styles from "./New.module.css";
import {Review} from "./Main.tsx";
import {AuthData} from "../oauth/GoogleOAuth.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSearch, faStar, faTimes} from "@fortawesome/free-solid-svg-icons";
import React, {FormEvent, useEffect, useState} from "react";

interface ReviewFormData {
    title: string;
    content: string;
    images: FileList;
}

export default function New({open}: { open: (open: boolean) => void }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(token || '{}') as AuthData;

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [finalRating, setFinalRating] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [fileList, setFileList] = useState<FileList | null>(null);

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

    const addReview = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const newReviewData = getFormData();

        if (rating === 0) {
            alert('Please select a star rating!');
            return;
        }

        const formData = new FormData();
        Array.from(newReviewData.images).forEach((file) => formData.append('image', file));

        const res = await fetch('https://portfolio.mrkb.kr/hanmat/media/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            alert('Failed to upload images. Please try again.');
            return
        }

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
            restaurantId: 20,
            content: newReviewData.content.toString(),
            rating: rating,
            image1: images[0] || '',
            image2: images[1] || '',
            image3: images[2] || '',
            image4: images[3] || '',
        } as Review;

        try {
            const response = await fetch('http://localhost:8080/hanmat/api/post/save', {  // 올바른 백엔드 URL
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
        <div className={styles.container}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <div className={styles["search-input-container"]}>
                        <FontAwesomeIcon icon={faSearch}/>
                        <input
                            type="text"
                            placeholder="Search store or review title..."
                            className={styles["search-input"]}
                        />
                    </div>
                    <button className={styles["close-button"]} onClick={() => open(false)}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </header>
                <form id="new-review" className={styles.content} onSubmit={(ev) => addReview(ev)}>
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
                                : 'Please select a rating!'
                            }
                        </span>
                    </div>

                    <div className={styles["image-upload"]}>
                        <div className={styles["image-preview-grid"]}>
                            {images.map((image, index) => (
                                <div key={index} className={styles["image-thumbnail-container"]}>
                                    <img src={image} alt={`Preview ${index}`} className={styles["image-thumbnail"]}/>
                                    <button type={"button"} className={styles["delete-button"]} onClick={() => deleteImage(index)}>
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
                        placeholder="Write your review here..."
                        rows={5}
                        style={{resize: 'vertical'}}
                    />
                    <div className={styles.buttons}>
                        <button type={"button"} onClick={() => open(false)}>Cancel</button>
                        <button type={"submit"}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
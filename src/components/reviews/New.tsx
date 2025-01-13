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

    const getFormData = () => {
        const form = document.querySelector('#new-review') as HTMLFormElement;
        const formData = new FormData(form);
        const entries = Object.fromEntries(formData.entries());
        console.log(entries);
        return entries;
        /*
        return {
            title: entries.title,
            content: entries.content,
            images: formData.getAll('images') as FileList,
        } as ReviewFormData;

         */
    }

    const preview = () => {
        const data = getFormData();
        data.images.files.forEach((file: File) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.src = ev.target.result as string;
                document.body.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    const addReview = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const newReviewData = getFormData();

        if (rating === 0) {
            alert('Please select a star rating!');
            return;
        }

        /*
        todo: 이미지 업로드
        이미지는 파일서버로 업로드한 후 URL을 받아와서 저장해야 함
        추가 예정
        */
        const imageData = new FormData();
        images.forEach((image, index) => {
            imageData.append(`image${index + 1}`, image);
        });

        const res = await fetch('http://localhost:3000/hanmat/media/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: JSON.stringify(imageData),
        });

        console.log(res);

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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // const newImages = Array.from(files);
            // setImages((prevImages) => [...prevImages, ...newImages].slice(0, 3)); // 최대 3개
        }
    };

    // 이미지 삭제 핸들러
    const handleDeleteImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    useEffect(() => {
        setFinalRating(hoverRating || rating);
    }, [hoverRating, rating]);

    useEffect(() => {

    }, []);

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
                                    <img
                                        src={image}
                                        alt={`Preview ${index}`}
                                        className={styles["image-thumbnail"]}
                                        onLoad={() => URL.revokeObjectURL(image)}
                                    />
                                    <button
                                        className={styles["delete-button"]}
                                        onClick={() => handleDeleteImage(index)}
                                    >
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
                            onChange={handleImageUpload}
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
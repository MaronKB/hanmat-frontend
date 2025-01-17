import React, { useEffect, useState } from "react";
import styles from "./Item.module.css";
import { Review } from "./Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import errorImg from "../../assets/images/error-image.png";

interface ItemProps {
    review: Review;
    onClick: (event: React.MouseEvent) => void; // 클릭 핸들러
}

export default function Item({ review, onClick }: ItemProps) {
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // 선택된 이미지 관리

    useEffect(() => {
        const filteredImages = [review.image1, review.image2, review.image3, review.image4].filter(
            (image) => image && image !== ""
        );
        setImages(filteredImages);

        // 첫 번째 이미지를 초기 선택 이미지로 설정
        if (filteredImages.length > 0) {
            setSelectedImage(filteredImages[0]);
        }
    }, [review]);

   return (
       <div
           className={styles.review}
           onClick={(e) => {
               console.log("Item clicked", review); // 디버깅
               onClick(e);
           }}
       >
           {/* 메인 이미지 영역 */}
           {selectedImage && (
               <img
                   src={`https://portfolio.mrkb.kr/hanmat/media/${selectedImage}`}
                   alt={`Selected Review ${review.id}`}
                   className={styles.mainImage}
               />
           )}
           {!selectedImage && (
               <img
                   src={errorImg}
                   alt={`Selected Review ${review.id}`}
                   className={styles.mainImage}
               />
           )}
        <div className={styles.reviewWrapper}>
          {/* 별점 */}
          <div className={styles.rating}>
            {Array.from({ length: review.rating }, (_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} />
            ))}
          </div>

          {/* 제목과 작성자 */}
          <div className={styles.titleAndAuthor}>
            <h3 className={styles.title}>{review.title}</h3>
            <p className={styles.author}>
              {review.author.split("@")[0].length > 10
                ? `${review.author.split("@")[0].slice(0, 10)}...`
                : review.author.split("@")[0]}
            </p>
          </div>

          {/* 내용 */}
          <p className={styles.content}>{review.content}</p>
        </div>

           {/* 썸네일 미리보기 */}
           {images.length > 1 && (
               <div className={styles.thumbnailContainer}>
                   {images.map((image, index) => (
                       <img
                           key={index}
                           src={`https://portfolio.mrkb.kr/hanmat/media/${image}`}
                           alt={`Review ${review.id} - Thumbnail ${index + 1}`}
                           className={`${styles.thumbnail} ${
                               selectedImage === image ? styles.activeThumbnail : ""
                           }`}
                           onClick={() => setSelectedImage(image)} // 클릭 시 선택된 이미지 변경
                       />
                   ))}
               </div>
           )}
       </div>
   );
}

import React, { useEffect, useState } from "react";
import styles from "./Item.module.css";
import { Review } from "./Main";

interface ItemProps {
    review: Review;
    onClick: (event: React.MouseEvent) => void; // 클릭 핸들러
}

export default function Item({ review, onClick }: ItemProps) {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        // 빈 이미지와 null 값 제외
        setImages(
            [review.image1, review.image2, review.image3, review.image4].filter((image) => image && image !== "")
        );
    }, [review]);

    return (
   <div
           className={styles.review}
           onClick={(e) => {
               console.log("Item clicked", review); // 디버깅
               onClick(e);
           }}
       >
           <h3>{review.title}</h3>
           <p>{review.content}</p>
           <div className={styles.rating}>Rating: {review.rating} ★</div>
           {images.length > 0 && (
               <div className={styles.images}>
                   {images.map((image, index) => (
                       <img
                           key={index}
                           src={`https://portfolio.mrkb.kr/hanmat/media/${image}`}
                           alt={`Review ${review.id} - Image ${index + 1}`}
                           className={styles.image}
                       />
                   ))}
               </div>
           )}
       </div>
   );
}
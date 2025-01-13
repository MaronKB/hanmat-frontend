import styles from './Item.module.css';
import { Review } from "./Main";
import {useEffect, useState} from "react"; // CSS 파일을 가져옴

export default function Item({ review, set }: { review: Review, set: (review: Review) => void }) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    setImages([
      review.image1,
      review.image2,
      review.image3,
      review.image4,
    ].filter((image) => image !== ""));
    console.log(images)
  }, []);

  return (
      <div
          key={review.id}
          className={styles.review}
          onClick={() => set(review)}
      >
        <h3>{review.title}</h3>
        <p>{review.content}</p>
        <div className={styles.rating}>Rating: {review.rating} ★</div>
        {(images[0] !== "" && images[0] !== null) && (
            <div className={styles.images}>
              {images.filter(image => image !== "" && image !== null).map((image, index) => (
                  <img
                      key={index}
                      src={"https://portfolio.mrkb.kr/hanmat/media/" + image}
                      alt={`Review ${review.id} - Image ${index + 1}`}
                      className={styles.image}
                      onLoad={() => URL.revokeObjectURL(image)}
                  />
              ))}
            </div>
        )}
      </div>
  );
};
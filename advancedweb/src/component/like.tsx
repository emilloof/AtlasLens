import { useState } from "react";
import like_empty from "../../public/like_empty.png";
import like_full from "../../public/like_full.png";
import Image from "next/image";
import styles from "./like.module.css";

export default function Like({ handleLikeClick , image_id}: { handleLikeClick: (image_id: string) => Promise<void> , image_id: string}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked((prev) => !prev);
    handleLikeClick(image_id);
  };
  return (
    <div className={styles.likeWrapper}>
      <Image src={isClicked ? like_full : like_empty} alt="like" fill onClick={handleClick} />
    </div>
  );
}

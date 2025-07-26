import { Dispatch, SetStateAction, useState } from "react";
import like_empty from "../../public/like_empty.png";
import like_full from "../../public/like_full.png";
import Image from "next/image";
import styles from "./like.module.css";

export default function Like({ setIsLiked }: { setIsLiked: Dispatch<SetStateAction<boolean>> }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked((prev) => !prev);
    setIsLiked(true);
  };
  return (
    <div className={styles.likeWrapper}>
      <Image src={isClicked ? like_full : like_empty} alt="like" fill onClick={handleClick} />
    </div>
  );
}

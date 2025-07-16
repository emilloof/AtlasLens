import Image from "next/image";
import styles from "./comment.module.css";

export default function Comment({
  writer_name,
  writer_profile_image,
  content,
  date,
}: {
  writer_name: string;
  writer_profile_image: string;
  content: string;
  date: string;
}) {
  return (
    <div className={styles.comment_wrapper}>
      <div className={styles.comment_header}>
        <div className={styles.comment_header_left}>
          <Image src={writer_profile_image} alt="Profile Image" width={50} height={50} />
          <p>{writer_name}</p>
        </div>
        <div className={styles.comment_header_right}>
          <p>{date}</p>
        </div>
      </div>
      <div className={styles.comment_content}>
        <p>{content}</p>
      </div>
    </div>
  );
}

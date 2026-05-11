import { useState } from "react";
import styles from "./commentInput.module.css";
import Button from "./button";
export default function CommentInput({ onSubmit }: { onSubmit?: (comment: string) => void }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit?.(comment);
      setComment("");
    }
  };
  return (
    <form className={styles.commentInputWrapper} onSubmit={handleSubmit}>
      <textarea
        placeholder="Write a comment..."
        className={styles.commentInput}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        id="commentInput"
        rows={3}
      />
      <Button name="➤" size="m" type="submit" className={styles.button} />
    </form>
  );
}

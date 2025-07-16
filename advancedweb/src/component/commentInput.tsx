import { useState } from "react";
import styles from "./commentInput.module.css";
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
      <input
        type="text"
        placeholder="Write a comment..."
        className={styles.commentInput}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

import styles from "@/component/button.module.css";
import { MouseEventHandler } from "react";

type ButtonProps = {
  name: string;
  size: "s" | "m" | "l";
  handleButtonClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ name, size, handleButtonClick }: ButtonProps) {
  return (
    <button type="button" className={styles[size]} onClick={handleButtonClick}>
      {name}
    </button>
  );
}

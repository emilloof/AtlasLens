import styles from "@/component/button.module.css";
import { ButtonHTMLAttributes, MouseEventHandler } from "react";

type ButtonProps = {
  name: string;
  size: "s" | "m" | "l";
  handleButtonClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ name, size, handleButtonClick, ...rest }: ButtonProps) {
  return (
    <button type="button" className={styles[size]} onClick={handleButtonClick} {...rest}>
      {name}
    </button>
  );
}

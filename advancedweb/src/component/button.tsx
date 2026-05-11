import styles from "@/component/button.module.css";
import { ButtonHTMLAttributes, MouseEventHandler } from "react";

type ButtonProps = {
  name: string;
  size: "s" | "m" | "l" ;
  handleButtonClick?: MouseEventHandler<HTMLButtonElement>;
  iconSrc?: string;
  iconAlt?: string;
  iconSize?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  name,
  size,
  handleButtonClick,
  iconSrc,
  iconAlt,
  iconSize = 18,
  ...rest
}: ButtonProps) {
  return (
    <button type="button" className={styles[size]} onClick={handleButtonClick} {...rest}>
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={iconAlt ?? "button icon"}
          width={iconSize}
          height={iconSize}
          className={styles.icon}
          loading="eager"
        />
      ) : null}
      {name}
    </button>
  );
}

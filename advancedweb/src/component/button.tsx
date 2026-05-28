import styles from "@/component/button.module.css";
import { ButtonHTMLAttributes, MouseEventHandler } from "react";

type ButtonProps = {
  name: string;
  size: "s" | "m" | "l" ;
  handleButtonClick?: MouseEventHandler<HTMLButtonElement>;
  iconSrc?: string;
  iconAlt?: string;
  iconSize?: number;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  name,
  size,
  handleButtonClick,
  iconSrc,
  iconAlt,
  iconSize = 18,
  isLoading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = isLoading || disabled;

  return (
    <button
      type="button"
      className={styles[size]}
      onClick={handleButtonClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {!isLoading && iconSrc ? (
        <img
          src={iconSrc}
          alt={iconAlt ?? "button icon"}
          width={iconSize}
          height={iconSize}
          className={styles.icon}
          loading="eager"
        />
      ) : null}
      <span>{isLoading ? "Loading..." : name}</span>
    </button>
  );
}

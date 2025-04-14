import styles from "@/component/input.module.css";
import { ChangeEvent } from "react";
type InputProps = {
  label?: string;
  size: "s" | "m" | "l";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
};

export default function Input({ label, size, value, onChange, placeholder, type = "text", errorMessage }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>
        {label}
        <input type={type} placeholder={placeholder} className={styles[size]} value={value} onChange={onChange} />
      </label>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}

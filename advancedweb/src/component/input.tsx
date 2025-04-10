import styles from "@/component/input.module.css";
type InputProps = { label?: string; size: "s" | "m" | "l"; type?: string; placeholder?: string };

export default function Input({ label, size, placeholder, type = "text" }: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      <label>
        {label}
        <input type={type} placeholder={placeholder} className={styles[size]} />
      </label>
    </div>
  );
}

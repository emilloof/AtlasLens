"use client";
import Button from "@/component/button";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";
export default function MapTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.buttonWrapper}>
        </div>
        <div className={styles.templateButtonWrapper}>
          <Button
            name="Leave Public Map"
            size="l"
            handleButtonClick={() => {
              router.push("/");
            }}
          />

        </div>
      {children}
    </div>
  );
}

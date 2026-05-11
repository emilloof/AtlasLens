"use client";
import Button from "@/component/button";
import { authService } from "@/services/authService";
import styles from "./index.module.css";
import { useRouter } from "next/navigation";
export default function AlbumTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.templateButtonWrapper}>
        <Button
          name="Logout"
          size="s"
          handleButtonClick={() => {
            authService.signout();
            router.push("/");
          }}
        />
        <Button name="My Page" size="s" handleButtonClick={() => router.push("/mypage")} />
      </div>
      {children}
    </div>
  );
}

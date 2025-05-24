"use client";
import styles from "./page.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../public/MyPhoto.jpg";

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <Image src={logo} width={100} height={100} alt="logo" onClick={() => router.push("/map")} />
      <p className={styles.text}>Press logo to go to start journey</p>
    </div>
  );
}

"use client";

import Button from "@/component/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

const MapComponent = dynamic(() => import("@/component/LeafletMap"), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.buttonWrapper}>
        <Button name="create new album" size="m" handleButtonClick={() => router.push("/create")} />
      </div>
      <MapComponent />
    </div>
  );
}

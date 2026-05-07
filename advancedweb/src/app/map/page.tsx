"use client";

import Button from "@/component/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

import useHandleMap from "@/hooks/useHandleMap";

const MapComponent = dynamic(() => import("@/component/LeafletMap"), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  const { albums } = useHandleMap();
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.buttonWrapper}>
        <Button name="Create New Album" size="m" handleButtonClick={() => router.push("/create")} />
      </div>
      <MapComponent albums={albums} />
    </div>
  );
}

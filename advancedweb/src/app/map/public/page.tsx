"use client";

import dynamic from "next/dynamic";
import styles from "./index.module.css";
import useHandlePublicMap from "@/hooks/useHandlePublicMap";

const MapComponent = dynamic(() => import("@/component/LeafletMap"), { ssr: false });

export default function PublicMapPage() {
  const { albums } = useHandlePublicMap();

  return (
    <div className={styles.pageWrapper}>
      <MapComponent albums={albums} canOpenAlbum={false} />
    </div>
  );
}

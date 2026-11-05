"use client";

import { useState } from "react";
import Button from "@/component/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

// 1. Import BOTH of your hooks
import useHandleMap from "@/hooks/useHandleMap";
import useHandlePublicMap from "@/hooks/useHandlePublicMap";

const MapComponent = dynamic(() => import("@/component/LeafletMap"), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  
  // 2. Track the toggle state
  const [isPublicMap, setIsPublicMap] = useState(false);

  // 3. Call both hooks at the top level
  const { albums: privateAlbums } = useHandleMap();
  const { albums: publicAlbums } = useHandlePublicMap();

  // 4. Decide which data to pass to the map based on the toggle
  const albumsToDisplay = isPublicMap ? publicAlbums : privateAlbums;

  return (
    <div className={styles.pageWrapper}>
      

      <div className={styles.publicButtonWrapper}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="isPublic"
            name="make album public"
            className={styles.checkbox}
            checked={isPublicMap}
            onChange={(e) => setIsPublicMap(e.target.checked)} 
          />
          <label htmlFor="isPublic" className={styles.checkboxLabel}>
            <span className={styles.toggleSwitch}></span>
            View Public Map
          </label>
        </div>
      </div>

    
      <div className={styles.buttonWrapper}>
        <Button name="Create New Album" size="m" handleButtonClick={() => router.push("/create")} />
      </div>

      
      <MapComponent albums={albumsToDisplay} />
    </div>
  );
}
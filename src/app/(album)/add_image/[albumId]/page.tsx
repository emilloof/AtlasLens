"use client";
import { use, useState } from "react";
import styles from "./index.module.css";
import UploadPhotos from "@/component/UploadPhotos";
import Button from "@/component/button";
import { useRouter } from "next/navigation";

export default function Add_Image({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = use(params);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const route = useRouter();

  return (
    <div className={styles.pageWrapper}>
      <UploadPhotos album_id={albumId} setUploadedUrls={setUploadedUrls} />
      {uploadedUrls.length > 0 && (
        <Button
          name="Go to Album"
          size="l"
          handleButtonClick={() => route.push(`/view/${albumId}`)}
        />
      )}
    </div>
  );
}

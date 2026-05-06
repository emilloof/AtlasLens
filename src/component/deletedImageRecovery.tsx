"use client";

import { useEffect, useState } from "react";
import styles from "./deletedImageRecovery.module.css";
import Button from "./button";
import OptimizedImage from "./OptimizedImage";

interface ImageType {
  image_id: string;
  url: string;
}

export default function DeletedImageRecovery({
  albumId,
  onRestoreSuccess,
  refreshTrigger,
}: {
  albumId: string;
  onRestoreSuccess?: () => void;
  refreshTrigger?: number;
}) {
  const [deletedImages, setDeletedImages] = useState<ImageType[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDeletedImages = async () => {
      const res = await fetch(`/api/get_deleted_images?albumId=${albumId}`);
      const data = await res.json();
      setDeletedImages(data.images);
    };
    fetchDeletedImages();
  }, [albumId, refreshTrigger]);

  const toggleSelect = (image_id: string) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(image_id)) {
        copy.delete(image_id);
      } else {
        copy.add(image_id);
      }

      return copy;
    });
  };

  const handleRestore = async () => {
    if (selected.size === 0) {
      alert("Please select images to restore.");
      return;
    }

    const res = await fetch("/api/restore_images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds: Array.from(selected), album_id: albumId }),
    });

    if (res.ok) {
      alert("Selected images restored.");
      setDeletedImages((prev) => prev.filter((img) => !selected.has(img.image_id)));
      setSelected(new Set());
      onRestoreSuccess?.();
    } else {
      alert("Failed to restore images.");
    }
  };

  return (
    <div>
      <h2>Deleted Images</h2>
      <div className={styles.grid}>
        {deletedImages.map((img) => (
          <div
            key={img.image_id}
            className={`${styles.imageWrapper} ${selected.has(img.image_id) ? styles.selected : ""}`}
            onClick={() => toggleSelect(img.image_id)}
          >
            <OptimizedImage src={img.url} image_id={img.image_id} width={100} height={100} />
            <input
              type="checkbox"
              checked={selected.has(img.image_id)}
              onChange={() => toggleSelect(img.image_id)}
              className={styles.checkbox}
            />
          </div>
        ))}
      </div>

      <Button name="Restore Selected" size="m" handleButtonClick={handleRestore} />
    </div>
  );
}

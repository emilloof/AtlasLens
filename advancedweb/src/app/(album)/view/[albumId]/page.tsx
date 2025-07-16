"use client";
import Button from "@/component/button";
import Gallery from "@/component/gallery";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";
import React from "react";
import { useEffect, useState } from "react";
import { CommentType } from "@/component/gallery";
export default function Album({ params }: { params: Promise<{ albumId: string }> }) {
  // Fetch the images from the server using the albumId
  const { albumId } = React.use(params);
  const router = useRouter();

  const [images, setImages] = useState<
    {
      image_id: string;
      url: string;
      comments: CommentType[];
    }[]
  >([]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/album?albumId=${albumId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch album");
      }
      const album = await res.json();
      setImages(album.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.galleryButtons}>
        <Button
          name="Back"
          size="m"
          handleButtonClick={() => {
            router.push("/map");
          }}
        />
        <button
          onClick={() => {
            router.push("/share/" + albumId);
          }}
          className={styles.button}
        >
          <img src="/icons8-share-photo-53 (1).png" alt="Back" />
        </button>
      </div>
      <Gallery
        imagePaths={images.map((img) => ({
          image_path: img.url,
          comments: img.comments,
          filter: img.filter || "",
        }))}
      />
    </div>
  );
}

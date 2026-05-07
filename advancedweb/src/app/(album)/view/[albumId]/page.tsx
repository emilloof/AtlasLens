"use client";
import Button from "@/component/button";
import Gallery from "@/component/gallery";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";
import React from "react";
import { useEffect, useState } from "react";
import { CommentType } from "@/component/gallery";
import { authService } from "@/services/authService";
import Image from "next/image";

export default function Album({ params }: { params: Promise<{ albumId: string }> }) {
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isMine, setIsMine] = useState<undefined | boolean>(undefined);
  // Fetch the images from the server using the albumId
  const { albumId } = React.use(params);
  const router = useRouter();

  const [images, setImages] = useState<
    {
      image_id: string;
      url: string;
      comments: CommentType[];
      filter?: string;
    }[]
  >([]);
  const checkIfMyAlbum = async () => {
    const isMine = await authService.checkIsMyAlbum(albumId);
    setIsMine(isMine.data?.isOwner);
  };
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
    checkIfMyAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCommentAdded]);

  return (
    <div className="page">
      <div className={styles.backButton}>
        <Button
          name="<"
          size="s"
          handleButtonClick={() => {
            router.push("/map");
          }}/>
      </div>

      <div className={styles.galleryButtons}>
        {isMine && (
          <>
            <Button
              name="Share Photos"
              size="s"
              handleButtonClick={() => router.push("/share/" + albumId)}
              iconAlt="share"
              iconSize={36}
              iconSrc="/icons8-share-photo-53 (1).png"
            />
            <Button
              name="Add Image"
              size="s"
              handleButtonClick={() => router.push("/add_image/" + albumId)}
              iconSrc="/add_image.png"
              iconAlt="addImage"
              iconSize={36}
            />
          </>
        )}
      </div>
      <Gallery
        setIsCommentAdded={setIsCommentAdded}
        imagePaths={images.map((img) => ({
          image_path: img.url,
          comments: img.comments,
          image_id: img.image_id,
          filter: img.filter || "",
        }))}
      />
    </div>
  );
}

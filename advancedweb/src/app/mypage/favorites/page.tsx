"use client";
import { Like, userService } from "@/services/userService";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Like[] | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      const favorites = await userService.getMyProfile();
      setFavorites(favorites.data?.user.likes);
    };
    getFavorites();
  }, []);

  const images =
    favorites?.map((like) => ({
      original: like.image.url,
      filter: like.image.filter,
    })) || [];
  
  return (
    <div className={styles.pageWrapper}>
      <h1>my favorites</h1>
      <section className={styles.gridDiv}>
        {favorites?.map((image) => (
          <div className={styles.imageWrapper} key={image.image_id}>
            <Image src={image.image.url} fill alt="favorite Image" className={image.image.filter || ""} />
          </div>
        ))}
      </section>

      <div className={styles.controlButtons}>
        <button
          className={styles.playButton}
          onClick={() => {
            setIsPlaying(true);
            setIsOpen(true);
          }}
        >
          ▶ Slide play
        </button>
        <button
          className={styles.stopButton}
          onClick={() => {
            setIsPlaying(false);
            setIsOpen(true);
          }}
        >
          Watch without autoplay
        </button>
      </div>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalInner}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <ImageGallery
                items={images.map((img) => ({ original: img.original, thumbnail: img.original }))}
                showFullscreenButton={false}
                showPlayButton={false}
                showThumbnails={false}
                showNav={false}
                autoPlay={isPlaying}
                slideInterval={3000}
                disableSwipe={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

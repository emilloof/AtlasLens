"use client";
import { Like, userService } from "@/services/userService";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./index.module.css";
export default function Favorites() {
  const [favorites, setFavorites] = useState<Like[] | undefined>(undefined);

  const getFavorites = async () => {
    const favorites = await userService.getMyProfile();

    setFavorites(favorites.data?.user.likes);
  };
  useEffect(() => {
    getFavorites();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <h1>my favorites</h1>
      <section className={styles.gridDiv}>
        {favorites?.map((image) => {
          return (
            <div className={styles.imageWrapper} key={image.image_id}>
              <Image src={image.image.url} fill alt="favorite Image" />
            </div>
          );
        })}
      </section>
    </div>
  );
}

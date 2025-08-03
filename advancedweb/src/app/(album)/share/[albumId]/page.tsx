"use client";

import styles from "./index.module.css";

import Button from "@/component/button";
import { useRouter } from "next/navigation";
import PhotoPreview from "@/component/photoPreview";
import useHandleShare from "@/hooks/useHandleShare";
import React, { useState } from "react";
import DeletedImageRecovery from "@/component/deletedImageRecovery";

export default function Share({ params }: { params: Promise<{ albumId: string }> }) {
  // Fetch the images from the server using the albumId
  const { albumId } = React.use(params);
  const [refreshDeletedImages, setRefreshDeletedImages] = useState(0);

  const {
    search,
    setSearch,
    suggestions,
    selectedPhotos,
    setSelectedPhotos,
    sharedUsers,
    fetchAlbum,
    images,
    fetchImages,
  } = useHandleShare(albumId);
  const router = useRouter();
  // call on this function when the user clicks the "Add" button
  // like this: handleAddUser(user.id)
  const handleAddUser = async (userId: string) => {
    try {
      const res = await fetch("/api/add_user_to_album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          album_id: albumId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to add user");
        return;
      }
      alert("User added!");
      fetchAlbum();
    } catch (err) {
      alert(`Error adding user ${err}`);
    }
  };

  const handleRemovePhotos = async () => {
    if (selectedPhotos.length === images.length) {
      alert("At least one photo must remain in the album.");
      return;
    }
    try {
      const res = await fetch("/api/remove_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageIds: selectedPhotos,
          album_id: albumId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to remove photos");
        return;
      }
      alert("Photos removed!");
      setSelectedPhotos([]);
      fetchImages();
      setRefreshDeletedImages((prev) => prev + 1);
    } catch (err) {
      alert(`Error removing photos ${err}`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.galleryButton}>
        <Button
          name="Back"
          size="m"
          handleButtonClick={() => {
            router.push("/view/" + albumId);
          }}
        />
      </div>
      <div className={styles.gallery}>
        <DeletedImageRecovery albumId={albumId} onRestoreSuccess={fetchImages} refreshTrigger={refreshDeletedImages} />
        <section className={styles.album_preview_wrapper}>
          <h1>Album Preview</h1>
          <div className={styles.grid}>
            {images.map((img, idx) => {
              const isLastRemaining =
                !selectedPhotos.includes(img.image_id) && selectedPhotos.length === images.length - 1;
              return (
                <PhotoPreview
                  key={idx}
                  imageSrc={img.url}
                  imageID={img.image_id}
                  isSelected={selectedPhotos.includes(img.image_id)}
                  width={80}
                  height={80}
                  setSelectedPhotos={(selected) => {
                    if (isLastRemaining && !selectedPhotos.includes(img.image_id)) {
                      alert("You cannot deselect all images. At least one must remain.");
                      return;
                    }
                    setSelectedPhotos(selected);
                  }}
                />
              );
            })}
          </div>
        </section>
      </div>

      {selectedPhotos.length > 0 && (
        <div style={{ paddingTop: 200 }}>
          <Button
            name="Remove selected photos"
            size="l"
            handleButtonClick={() => {
              handleRemovePhotos();
            }}
          />
        </div>
      )}

      <div className={styles.browse}>
        <div>
          <h1>Share your album</h1>
          <p>Share your album with friends and family!</p>
          <input
            type="text"
            placeholder="Search users..."
            style={{ marginBottom: 8, padding: 4, width: "100%" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {suggestions && (
          <div style={{ gap: "8px", display: "flex", flexDirection: "column" }}>
            {suggestions.map((user) => (
              <div className={styles.suggestionBox} key={user.id}>
                <div style={{ display: "flex", flexDirection: "column", paddingRight: 8 }} key={user.id}>
                  <a>Email: {user.email}</a>
                  <a>Username: {user.username}</a>
                </div>
                <Button
                  name="Add"
                  size="s"
                  handleButtonClick={() => {
                    handleAddUser(user.id);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div className={styles.sharedWith}>
          <h2>Album shared with</h2>
          <ul>
            {sharedUsers.map((user) => (
              <li key={user.id}>
                <strong>{user.username}</strong> <span>({user.email})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

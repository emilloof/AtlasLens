"use client";
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleSearchCity from "@/hooks/useHandleSearchCity";
import UploadPhotos from "@/component/UploadPhotos";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/libs/cloudinary";

export default function Create() {
  const { city, setCity, handleSearch, responseText, loading, isCitySearched } = useHandleSearchCity();
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isPhotoUploaded, setIsPhotoUploaded] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAlbumCreated, setIsAlbumCreated] = useState<boolean>(false);
  const route = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.user_id) setUserId(data.user.user_id);
      });
  }, []);

  const handlePhotoUpload = async (files: File[]) => {
    if (!files || files.length === 0) {
      setUploadStatus("No files selected");
      return;
    }
    if (!albumId) {
      setUploadStatus("Please create an album before uploading photos");
      return;
    }
    if (city === undefined) {
      setUploadStatus("Please enter a city before uploading photos");
      return;
    }

    if (isPhotoUploaded) {
      route.push(`/view/${albumId}`);
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const urls = await Promise.all(files.map((file) => uploadToCloudinary(file)));

      const res = await fetch("/api/upload_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, album_id: albumId }),
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus("Upload successful");
        setIsPhotoUploaded(true);
      } else {
        setUploadStatus(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleAlbumUpload = async () => {
    setUploadStatus("Creating album...");
    try {
      const res = await fetch("/api/make_album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_name: city?.name,
          latitude: city?.latitude,
          longitude: city?.longitude,
          users: userId ? [userId] : [],
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setUploadStatus("Album created successfully!");
        setAlbumId(data.body.album_id);
        setIsAlbumCreated(true);
      } else {
        setUploadStatus(`Failed to create album: ${data.error || "Unknown error"}`);
         setIsAlbumCreated(false);
      }
    } catch (error) {
      setUploadStatus(`Failed to create album: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="page">
      <div className={styles.backButton}>
        <Button  name="<" size="s" handleButtonClick={() => route.push("/map")} />
      </div>
      <section className={styles.inputWrapper}>
        {!isAlbumCreated && (
          <>
            <section className={styles.searchFormWrapper}>
              <form className={styles.formWrapper} onSubmit={handleSearch}>
                <Input
                  size="m"
                  label="city"
                  placeholder="Please enter a city"
                  type="text"
                  value={city?.name || ""}
                  onChange={(e) => {
                    setCity({ ...city, name: e.target.value });
                  }}
                  errorMessage={""}
                />
              </form>
              <Button name={loading ? "Loading... " : "Search"} size="s" handleButtonClick={handleSearch} />
            </section>
            {responseText && (
              <section className={styles.responseWrapper}>
                <p>{responseText}</p>
              </section>
            )}
            {isCitySearched && (
              <>
                <Button name={"Create Album"} size="l" handleButtonClick={handleAlbumUpload} />
                {uploadStatus && (<div>{uploadStatus}</div>)}
              </>
            )}
          </>
        )}

        {isAlbumCreated && (
          <>
            <UploadPhotos setSelectedFiles={setSelectedFiles} isPhotoUploaded={isPhotoUploaded} albumID={albumId} />
      
            {isPhotoUploaded && (<div className={styles.buttonWrapper}>
                <Button
              name={"Go to Album"}
              size="s"
              handleButtonClick={() => handlePhotoUpload(selectedFiles)}
            />
              <Button
              name={"Go to Map"}
              size="s"
              handleButtonClick={() => route.push("/map")}
            /></div>
            )}
            {!isPhotoUploaded &&
              <Button
              name={"Upload Photos"}
              size="l"
              handleButtonClick={() => handlePhotoUpload(selectedFiles)}
            />}
        
          </>
        )}
      </section>
    </div>
  );
}

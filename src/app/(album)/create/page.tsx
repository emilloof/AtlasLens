"use client";
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleSearchCity from "@/hooks/useHandleSearchCity";
import UploadPhotos from "@/component/UploadPhotos";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Create() {
  const { city, setCity, handleSearch, responseText, loading } = useHandleSearchCity();
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [albumId, setAlbumId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const route = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.user_id) setUserId(data.user.user_id);
      });
  }, []);

  const handleAlbumUpload = async () => {
    setStatusMessage("Creating album...");
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
        setStatusMessage("Album created! Now upload your photos.");
        setAlbumId(data.body.album_id);
      } else {
        setStatusMessage(`Failed to create album: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setStatusMessage(`Failed to create album: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.inputWrapper}>
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

        <Button name={"Create Album"} size="l" handleButtonClick={handleAlbumUpload} />

        {responseText && (
          <section className={styles.responseWrapper}>
            <p>{responseText}</p>
          </section>
        )}

        <UploadPhotos album_id={albumId} setUploadedUrls={setUploadedUrls} />

        {statusMessage && <div>{statusMessage}</div>}

        {uploadedUrls.length > 0 && albumId && (
          <Button
            name="Go to Album"
            size="l"
            handleButtonClick={() => route.push(`/view/${albumId}`)}
          />
        )}
      </section>
    </div>
  );
}

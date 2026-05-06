"use client";
import { useState } from "react";
import React from "react";
import styles from "./index.module.css";
import UploadPhotos from "@/component/UploadPhotos";
import Button from "@/component/button";
import { useRouter } from "next/navigation";

export default function Add_Image({ params }: { params: Promise<{ albumId: string }> }) {
  const [uploadStatus, setUploadStatus] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const route = useRouter();
  const handlePhotoUpload = async (files: File[]) => {
    if (!files || files.length === 0) {
      setUploadStatus("No files selected");
      return;
    }

    setUploadStatus("Uploading...");
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("album_id", (await params).albumId);

    try {
      const res = await fetch("/api/upload_image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus("Upload successful");
        route.push(`/view/${(await params).albumId}`);
      } else {
        setUploadStatus(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <UploadPhotos setSelectedFiles={setSelectedFiles} />
      {uploadStatus && <div>{uploadStatus}</div>}
      <Button name={"Upload Photos"} size="l" handleButtonClick={() => handlePhotoUpload(selectedFiles)} />
    </div>
  );
}

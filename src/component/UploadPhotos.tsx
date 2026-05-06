"use client";

import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import Button from "./button";
import AlbumPreview from "./albumPreview";
import { saveImageUrlToDB } from "@/actions/imageActions";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface UploadPhotosProps {
  album_id: string | null;
  setUploadedUrls?: Dispatch<SetStateAction<string[]>>;
}

const UploadPhotos: React.FC<UploadPhotosProps> = ({ album_id, setUploadedUrls }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET!);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!album_id) {
      console.error("No album selected");
      return;
    }

    setUploading(true);
    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        setPreviews((prev) => [...prev, imageUrl]);
        if (setUploadedUrls) setUploadedUrls((prev) => [...prev, imageUrl]);
        const res = await saveImageUrlToDB(imageUrl, album_id);
        if (!res.success) console.error("DB save error:", res.error);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="upload-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginBottom: "30px" }}>
        <AlbumPreview images={previews} width={120} height={80} />
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        name={uploading ? "Uploading..." : "Select & Upload Photos"}
        size="m"
        handleButtonClick={(e) => {
          if (e) e.preventDefault();
          fileInputRef.current?.click();
        }}
      />
    </div>
  );
};

export default UploadPhotos;

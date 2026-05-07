"use client";

import React, { useState, useRef, SetStateAction, Dispatch } from "react";
import Button from "./button";
import AlbumPreview from "./albumPreview";

interface UploadPhotosProps {
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
  isPhotoUploaded: boolean;
  albumID: string | null;
}

const UploadPhotos: React.FC<UploadPhotosProps> = ({ setSelectedFiles, isPhotoUploaded = false, albumID }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  const handleSelectButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </label>

      <div style={{ marginBottom: "30px" }}>
        <AlbumPreview images={previews} width={120} height={80} albumID={albumID} />
      </div>
      {!isPhotoUploaded &&
        <Button name="Select Photos" size="s" handleButtonClick={handleSelectButtonClick} />}
    </div>
  );
};

export default UploadPhotos;

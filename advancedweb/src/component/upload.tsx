'use client'

import React, { useState, useRef } from 'react';
import Button from './button';
import AlbumPreview from './albumPreview';

interface UploadPhotosProps {
  onUpload: (files: File[]) => void;
}

const UploadPhotos: React.FC<UploadPhotosProps> = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null); 


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      onUpload(filesArray);

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  return (
    <div className="upload-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <label>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={fileInputRef} />
      </label>

    <div style={{marginBottom: '30px'}}>
      <AlbumPreview images={previews} width={120} height={80} /> 
    </div>

      <Button
            name="Upload Photos"
            size='m'
            handleButtonClick={handleButtonClick} 
        />
    </div>
  );
};

export default UploadPhotos;
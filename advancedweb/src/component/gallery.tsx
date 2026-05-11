"use client";
import React, { useState } from "react";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";
import styles from "./gallery.module.css";
import FilterSelector from "./filterSelector";
import { userService } from "@/services/userService";
import "@/styles/filter.css";
export interface WriterType {
  user_id: string;
  email: string;
  password: string;
  username: string;
  profile_image: string | null;
}
export interface CommentType {
  comment_id: string;
  content: string | null;
  writer_id: string;
  created_at: string;
  image_id: string;
  parent_id: string | null;
  writer: WriterType;
  replies: CommentType[] | [];
}
interface GalleryProps {
  setIsCommentAdded: React.Dispatch<React.SetStateAction<boolean>>;
  onSlideChange?: (index: number) => void;
  imagePaths: {
    image_path: string;
    comments: CommentType[];
    image_id: string;
    filter?: string;
  }[];
}

const Gallery: React.FC<GalleryProps> = ({ imagePaths, setIsCommentAdded, onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSlide = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };
  const images: (ReactImageGalleryItem & { comments?: CommentType[]; image_id: string })[] = imagePaths.map((path) => ({
    original: path.image_path,
    comments: path.comments,
    thumbnail: path.image_path,
    image_id: path.image_id,
    filter: path.filter,
    sizes: "height: 6.25rem",
  }));

  const customRenderItem = (item: ReactImageGalleryItem) => {
    const extendedItem = item as ReactImageGalleryItem & {
      comments?: CommentType[];
      image_id: string;
      filter?: string;
    };
    
    return (
      <div className={styles.imageWrapper}>
        <div className={styles.filterWrapper}>
        <FilterSelector
          currentFilter={extendedItem.filter}
          onChange={async (newFilter) => {
            await userService.updateImageFilter(extendedItem.image_id, newFilter);
            extendedItem.filter = newFilter;
            setIsCommentAdded((prev) => !prev);
          }}
        /></div>
        <Image
          src={extendedItem.original}
          className={extendedItem.filter || ""}
          alt=""
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    );
  };

  return (
    <ImageGallery
      items={images}
      renderItem={customRenderItem}
      additionalClass={styles.image_gallery_center}
      startIndex={currentIndex}
      onSlide={handleSlide}
    />
  );
};

export default Gallery;

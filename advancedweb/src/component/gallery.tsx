"use client";
import React from "react";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./gallery.module.css";
import Image from "next/image";
import commentIcon from "../../public/comment.png";
import { useState } from "react";
import Comment from "./comment";
import styles from "./gallery.module.css";
import "../styles/filter.css";
export interface CommentType {
  writer_name: string;
  date: string;
  content: string;
  writer_profile_image: string;
}

interface GalleryProps {
  imagePaths: {
    image_path: string;
    comments: CommentType[];
    filter?: string;
  }[];
}

const Gallery: React.FC<GalleryProps> = ({ imagePaths }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const images: (ReactImageGalleryItem & { comments?: CommentType[] })[] = imagePaths.map((path) => ({
    original: path.image_path,
    comments: path.comments,
    thumbnail: path.image_path,
    sizes: "height: 100px",
  }));

  const customRenderItem = (item: ReactImageGalleryItem & { comments?: CommentType[]; filter?: string }) => {
    return (
      <div style={{ height: "70vh", width: "30vw" }}>
        <div style={{ display: "relative" }} />
        <Image
          src={item.original}
          alt=""
          fill
          style={{
            objectFit: "contain",
          }}
        />
        {isCommentOpen && item.comments?.length && (
          <div className={styles.commentWrapper}>
            {item.comments.map((comment: CommentType) => (
              <Comment
                key={comment.writer_name}
                writer_name={comment.writer_name}
                content={comment.content}
                writer_profile_image={comment.writer_profile_image}
                date={comment.date}
              />
            ))}
          </div>
        )}

        <Image
          className={item.filter ? item.filter : ""}
          style={{ position: "absolute", top: "60px", right: "30px", cursor: "pointer" }}
          src={commentIcon}
          alt="comment"
          width={20}
          height={20}
          onClick={() => setIsCommentOpen((prev) => !prev)}
        />
      </div>
    );
  };

  return <ImageGallery items={images} renderItem={customRenderItem} additionalClass={styles.image_gallery_center} />;
};

export default Gallery;

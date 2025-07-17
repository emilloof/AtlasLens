"use client";
import React, { useEffect } from "react";
import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./gallery.module.css";
import Image from "next/image";
import commentIcon from "../../public/comment.png";
import { useState } from "react";
import Comment from "./comment";
import styles from "./gallery.module.css";
import "../styles/filter.css";
import CommentInput from "./commentInput";
import { userService } from "@/services/userService";
export interface CommentType {
  writer_name: string;
  date: string;
  content: string;
  writer_profile_image: string;
}
interface GalleryProps {
  setIsCommentAdded: React.Dispatch<React.SetStateAction<boolean>>;
  imagePaths: {
    image_path: string;
    comments: CommentType[];
    image_id: string;
    filter?: string;
  }[];
}

const Gallery: React.FC<GalleryProps> = ({ imagePaths, setIsCommentAdded }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  useEffect(() => {}, []);
  const images: (ReactImageGalleryItem & { comments?: CommentType[]; image_id: string })[] = imagePaths.map((path) => ({
    original: path.image_path,
    comments: path.comments,
    thumbnail: path.image_path,
    image_id: path.image_id,
    sizes: "height: 6.25rem",
  }));

  const customRenderItem = (item: ReactImageGalleryItem) => {
    const extendedItem = item as ReactImageGalleryItem & {
      comments?: CommentType[];
      image_id: string;
      filter?: string;
    };
    return (
      <div style={{ height: "70vh", width: "30vw" }}>
        <div style={{ display: "relative" }} />
        <Image
          src={extendedItem.original}
          className={extendedItem.filter ? extendedItem.filter : ""}
          alt=""
          fill
          style={{
            objectFit: "contain",
          }}
        />
        {isCommentOpen && (
          <CommentInput
            onSubmit={async (value) => {
              const writerInformation = await userService.getMyProfile();
              const writer_id = writerInformation?.data?.id || "";
              const image_id = extendedItem.image_id;
              await userService.addComment(writer_id, value, image_id, undefined);
              setIsCommentAdded((prev) => !prev);
            }}
          />
        )}
        {isCommentOpen && extendedItem.comments?.length && (
          <div className={styles.commentWrapper}>
            {extendedItem.comments.map((comment: CommentType) => (
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
        <div className={styles.commentIconWrapper}>
          <Image src={commentIcon} alt="comment" fill onClick={() => setIsCommentOpen((prev) => !prev)} />
        </div>
      </div>
    );
  };

  return <ImageGallery items={images} renderItem={customRenderItem} additionalClass={styles.image_gallery_center} />;
};

export default Gallery;

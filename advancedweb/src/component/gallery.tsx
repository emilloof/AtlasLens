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
import default_profile from "../../public/profile_default.png";
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
  imagePaths: {
    image_path: string;
    comments: CommentType[];
    image_id: string;
    filter?: string;
  }[];
}

const Gallery: React.FC<GalleryProps> = ({ imagePaths, setIsCommentAdded }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentOpenMap, setCommentOpenMap] = useState<{ [image_id: string]: boolean }>({});
  const [replyTarget, setReplyTarget] = useState<{
    image_id: string;
    comment: CommentType;
  } | null>(null);

  const toggleComment = (image_id: string) => {
    setCommentOpenMap((prev) => ({
      ...prev,
      [image_id]: !prev[image_id],
    }));
  };

  const handleSlide = (index: number) => {
    setCurrentIndex(index);
  };
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
    const isThisCommentOpen = commentOpenMap[extendedItem.image_id];
    return (
      <div
        style={{
          height: "60vh",
          width: "40vw",
          display: "flex",
          justifyContent: "right",
          padding: "10px",
          gap: "20px",
        }}
        className={styles.imageWrapper}
      >
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
        {isThisCommentOpen && !extendedItem.comments?.length && (
          <div className={styles.commentWrapper}>
            <CommentInput
              onSubmit={async (value) => {
                const writerInformation = await userService.getMyProfile();
                const writer_id = writerInformation?.data?.user?.user_id || "";
                const image_id = extendedItem.image_id;
                await userService.addComment(writer_id, value, image_id, undefined);
                setIsCommentAdded((prev) => !prev);
              }}
            />
          </div>
        )}
        {isThisCommentOpen && extendedItem.comments?.length && (
          <div className={styles.commentWrapper}>
            <CommentInput
              onSubmit={async (value) => {
                const writerInformation = await userService.getMyProfile();
                const writer_id = writerInformation?.data?.user?.user_id || "";
                const image_id = extendedItem.image_id;
                await userService.addComment(writer_id, value, image_id, undefined);
                setIsCommentAdded((prev) => !prev);
              }}
            />
            {extendedItem.comments
              .filter((comment: CommentType) => !comment.parent_id)
              .map((parent: CommentType) => (
                <React.Fragment key={parent.comment_id}>
                  <Comment
                    writer_name={parent.writer.username}
                    content={parent.content || ""}
                    writer_profile_image={parent.writer.profile_image || default_profile.src}
                    date={parent.created_at}
                    onReplyClick={() => setReplyTarget({ image_id: extendedItem.image_id, comment: parent })}
                  />

                  {replyTarget?.comment.comment_id === parent.comment_id && (
                    <CommentInput
                      onSubmit={async (value) => {
                        const writerInformation = await userService.getMyProfile();
                        const writer_id = writerInformation?.data?.user?.user_id || "";
                        const image_id = replyTarget.image_id;
                        const parent_id = replyTarget.comment.comment_id;
                        await userService.addComment(writer_id, value, image_id, parent_id);
                        setIsCommentAdded((prev) => !prev);
                        setReplyTarget(null);
                      }}
                    />
                  )}

                  {extendedItem?.comments
                    ?.filter((reply: CommentType) => reply.parent_id === parent.comment_id)
                    .map((reply: CommentType) => (
                      <div key={reply.comment_id} style={{ paddingLeft: "2rem" }}>
                        <Comment
                          writer_name={reply.writer.username}
                          content={reply.content || ""}
                          writer_profile_image={reply.writer.profile_image || default_profile.src}
                          date={reply.created_at}
                          onReplyClick={() => setReplyTarget({ image_id: extendedItem.image_id, comment: reply })}
                        />
                      </div>
                    ))}
                </React.Fragment>
              ))}
          </div>
        )}
        <div className={styles.commentIconWrapper}>
          <Image src={commentIcon} alt="comment" fill onClick={() => toggleComment(extendedItem.image_id)} />
        </div>
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

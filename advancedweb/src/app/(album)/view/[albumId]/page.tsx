"use client";
import Button from "@/component/button";
import Comment from "@/component/comment";
import CommentInput from "@/component/commentInput";
import Gallery, { CommentType } from "@/component/gallery";
import LikeButton from "@/component/LikeButton";
import { authService } from "@/services/authService";
import { Like, userService } from "@/services/userService";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

type AlbumImage = {
  image_id: string;
  url: string;
  comments: CommentType[];
  filter?: string;
};

export default function Album({ params }: { params: Promise<{ albumId: string }> }) {
  const [isCommentAdded, setIsCommentAdded] = useState(false);
  const [isMine, setIsMine] = useState<undefined | boolean>(undefined);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{ image_id: string; comment: CommentType } | null>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  const { albumId } = React.use(params);
  const router = useRouter();

  const selectedImage = images[currentIndex];

  const checkIfMyAlbum = async () => {
    const res = await authService.checkIsMyAlbum(albumId);
    setIsMine(res.data?.isOwner);
  };

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/album?albumId=${albumId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch album");
      }
      const album = await res.json();
      setImages(album.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleLikeClick = async (image_id: string) => {
    const myProfile = await userService.getMyProfile();
    await userService.likePhoto(image_id, myProfile.data?.user.user_id);
    setLikedImages((prev) => {
      const next = new Set(prev);
      if (next.has(image_id)) {
        next.delete(image_id);
      } else {
        next.add(image_id);
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchLikes = async () => {
      const profile = await userService.getMyProfile();
      const likes: Like[] = profile.data?.user?.likes || [];
      const likedIds = new Set(likes.map((like) => like.image_id));
      setLikedImages(likedIds);
    };

    fetchLikes();
  }, []);

  useEffect(() => {
    fetchImages();
    checkIfMyAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId, isCommentAdded]);

  useEffect(() => {
    setReplyTarget(null);
  }, [selectedImage?.image_id]);

  const topLevelComments = selectedImage?.comments.filter((comment) => !comment.parent_id) || [];

  const handleReplyClick = (comment: CommentType) => {
    if (replyTarget?.comment.comment_id === comment.comment_id) {
      setReplyTarget(null);
    } else {
      setReplyTarget({ image_id: selectedImage!.image_id, comment });
    }
  };

  return (
    <div className="page">
      <div className={styles.backButton}>
        <Button
          name="<"
          size="s"
          type="button"
          handleButtonClick={() => {
            router.push("/map");
          }}
        />
      </div>

      <div className={styles.galleryButtons}>
        {isMine && (
          <>
            <Button
              name="Share Photos"
              size="s"
              handleButtonClick={() => router.push("/share/" + albumId)}
              iconAlt="share"
              iconSize={36}
              iconSrc="/icons8-share-photo-53 (1).png"
            />
            <Button
              name="Add Image"
              size="s"
              handleButtonClick={() => router.push("/add_image/" + albumId)}
              iconSrc="/add_image.png"
              iconAlt="addImage"
              iconSize={36}
            />
          </>
        )}
      </div>
      <div className={styles.galleryWrapper}>
      <Gallery
        setIsCommentAdded={setIsCommentAdded}
        onSlideChange={setCurrentIndex}
        imagePaths={images.map((img) => ({
          image_path: img.url,
          comments: img.comments,
          image_id: img.image_id,
          filter: img.filter || "",
        }))}
      />
     </div>
      {selectedImage && (
        <div className={styles.interactionPanel}>
          <div className={styles.actionRow}>
            <div className={styles.likeSlot}>
              <LikeButton
                handleLikeClick={handleLikeClick}
                image_id={selectedImage.image_id}
                isClickedBefore={likedImages.has(selectedImage.image_id)}
              />
            </div>
            <Button
            size="m"
              type="button"
              handleButtonClick={() => setIsCommentOpen((prev) => !prev)}
                iconAlt="comment"
                iconSize={28}
                iconSrc="/comment.png"
                name={`Comments (${selectedImage.comments.length})`}
            />
          </div>

          {isCommentOpen && (
            <div className={styles.commentPanel}>
              <CommentInput
                onSubmit={async (value) => {
                  const writerInformation = await userService.getMyProfile();
                  const writer_id = writerInformation?.data?.user?.user_id || "";
                  await userService.addComment(writer_id, value, selectedImage.image_id, undefined);
                  setIsCommentAdded((prev) => !prev);
                }}
              />

              <div className={styles.commentList}>
                {topLevelComments.map((parent) => (
                  <React.Fragment key={parent.comment_id}>
                    <Comment
                      writer_name={parent.writer.username}
                      content={parent.content || ""}
                      writer_profile_image={parent.writer.profile_image || "/profile_default.png"}
                      date={parent.created_at}
                      onReplyClick={() => handleReplyClick(parent)}
                    />

                    {replyTarget?.comment.comment_id === parent.comment_id && (
                      <div className={styles.replyInput}>
                        <CommentInput
                          onSubmit={async (value) => {
                            const writerInformation = await userService.getMyProfile();
                            const writer_id = writerInformation?.data?.user?.user_id || "";
                            await userService.addComment(writer_id, value, replyTarget.image_id, parent.comment_id);
                            setIsCommentAdded((prev) => !prev);
                            setReplyTarget(null);
                          }}
                        />
                      </div>
                    )}

                    {parent.replies?.map((reply) => (
                      <div key={reply.comment_id} className={styles.replyComment}>
                        <Comment
                          writer_name={reply.writer.username}
                          content={reply.content || ""}
                          writer_profile_image={reply.writer.profile_image || "/profile_default.png"}
                          date={reply.created_at}
                          onReplyClick={() => handleReplyClick(reply)}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    
  );
}

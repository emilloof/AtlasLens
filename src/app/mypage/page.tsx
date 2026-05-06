"use client";
import Button from "@/component/button";
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserProfileWhole, userService } from "@/services/userService";
import { useEffect, useRef, useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function Mypage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<UserProfileWhole | null>({
    user: {
      user_id: "",
      email: "",
      username: "",
      profile_image: "",
      albums: undefined,
      likes: undefined,
      notifications: undefined,
      comments: undefined,
      password: "",
      images: undefined,
    },
  });

  const getProfile = async () => {
    try {
      const res = await userService.getMyProfile();
      setUserData(res.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET!);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.secure_url;

      await fetch("/api/add_user_profile_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, user_id: userData?.user.user_id }),
      });

      await getProfile();
    } catch (error) {
      console.error("Fail to upload profile image", error);
    }

    e.target.value = "";
  };

  return (
    <div className={styles.profilePage}>
      <section className={styles.profileWrapper}>
        <div className={styles.profileImageWrapper}>
          <Image src={userData?.user.profile_image || "/profile_default.png"} alt="profileImage" fill />
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Button
          name="change profile image"
          size="s"
          handleButtonClick={(e) => {
            if (e) e.preventDefault();
            fileInputRef.current?.click();
          }}
        />

        <section>
          <p>{userData?.user.username}</p>
        </section>
        <Button name="favorites" size="m" handleButtonClick={() => router.push(`mypage/favorites`)} />
      </section>
    </div>
  );
}

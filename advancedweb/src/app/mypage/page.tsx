"use client";
import Button from "@/component/button";
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserProfileWhole, userService } from "@/services/userService";
import { useEffect, useRef, useState } from "react";
import profileImage from "../../../public/profile_default.png";
export default function Mypage() {
  const router = useRouter();

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("profile_image", file);
      formData.append("user_id", userData?.user.user_id || "");

      try {
        await fetch("/api/add_user_profile_image", {
          method: "POST",
          body: formData,
        });

        await getProfile();
      } catch (error) {
        console.error("Fail to upload profile image", error);
      }
    }
  };

  const handleSelectButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getProfile = async () => {
    try {
      const userData = await userService.getMyProfile();
      setUserData(userData.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className={styles.profilePage}>
      <section className={styles.profileWrapper}>
        <div className={styles.profileImageWrapper}>
          <Image src={userData?.user.profile_image || profileImage} alt="profileImage" fill />
        </div>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <Button name="change profile image" size="s" onClick={handleSelectButtonClick} />

        <section>
          <p>{userData?.user.username}</p>
        </section>
        <Button name="favorites" size="m" handleButtonClick={() => router.push(`mypage/favorites`)} />
      </section>
    </div>
  );
}

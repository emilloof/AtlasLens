import Button from "@/component/button";
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserProfileWhole, userService } from "@/services/userService";
import { useEffect, useRef, useState } from "react";
import profileImage from "../../../public/profile_default.png";
export default function Mypage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSelectButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
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
    },
  });
  const getProfile = async () => {
    try {
      const userData = await userService.getMyProfile();
      setUserData(userData.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const postProfileImage = async () => {
    if (!selectedFile) {
      alert("Choose an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile_image", selectedFile);
      formData.append("user_id", userData?.user.user_id || "");

      const postProfileResponse = await userService.postProfileImage(formData);
    } catch (error) {
      console.error("Fail to fetch profileImage", error);
    }
  };

  useEffect(() => {
    getProfile();
  });

  return (
    <div>
      <section>
        <div className={styles.profileImageWrapper}>
          <Image src={userData?.user.profile_image || profileImage} alt="profileImage" />
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
        ></input>
        <Button name="change profile image" size="s" onClick={handleSelectButtonClick} />
        <section>
          <p>{userData?.user.username}</p>
        </section>
        <Button
          name="favorites"
          size="m"
          handleButtonClick={() => router.push(`${userData?.user.user_id}/favorites`)}
        />
      </section>
    </div>
  );
}

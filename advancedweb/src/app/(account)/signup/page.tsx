"use client";
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleSignUp from "@/hooks/useHandleSignUp";
import { useRouter } from "next/navigation";
export default function SignUp() {
  const router = useRouter();
  const {
    email,
    setEmail,
    userName,
    setUserName,
    password,
    setPassword,
    signinSuccessMessage,
    handleSubmit,
    errorMessage,
    isSignedUp,
  } = useHandleSignUp();

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.inputWrapper}>
        <Input
          size="l"
          label="id"
          placeholder="Please enter the id"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          errorMessage={errorMessage.idError}
        />
        <Input
          size="l"
          label="name"
          placeholder="Please enter the name"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          type="text"
          errorMessage={errorMessage.nameError}
        />
        <Input
          size="l"
          label="password"
          placeholder="Please enter the password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMessage={errorMessage.passwordError}
        />
        <Button
          name={isSignedUp ? "Go to Mymap" : "signup"}
          size="l"
          handleButtonClick={isSignedUp ? () => router.push("/map") : handleSubmit}
        />
        <p className={styles.successMessage}>{signinSuccessMessage}</p>
      </section>
    </div>
  );
}

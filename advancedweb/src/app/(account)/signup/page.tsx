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
    <div className="page">
      <section className={styles.inputWrapper}>
        <section className={styles.inputSection}>
        <Input
          size="l"
          label="Email"
          placeholder="Please enter email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          errorMessage={errorMessage.idError}
        />
        <Input
          size="l"
          label="Name"
          placeholder="Please enter name"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          type="text"
          errorMessage={errorMessage.nameError}
        />
        <Input
          size="l"
          label="Password"
          placeholder="Please enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMessage={errorMessage.passwordError}
          />
        </section>
         <p className={styles.successMessage}>{signinSuccessMessage}</p>
        <Button
          name={isSignedUp ? "Go to Mymap" : "signup"}
          size="l"
          handleButtonClick={isSignedUp ? () => router.push("/map") : handleSubmit}
        />
       
            <Button name="Back to login" size="s" handleButtonClick={() => router.push("/login")} />
      </section>
    </div>
  );
}

"use client";
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleSignUp from "@/hooks/useHandleSignUp";
export default function SignUp() {
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
        <Button name="signup" size="l" handleButtonClick={handleSubmit} />
        <p className={styles.successMessage}>{signinSuccessMessage}</p>
      </section>
    </div>
  );
}

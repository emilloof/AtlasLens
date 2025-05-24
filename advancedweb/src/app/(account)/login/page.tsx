"use client";
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleLogin from "@/hooks/useHandleLogin";
export default function Login() {
  const { email, setEmail, password, setPassword, loginSuccessMessage, handleSubmit, errorMessage } = useHandleLogin();

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
          label="password"
          placeholder="Please enter the password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMessage={errorMessage.passwordError}
        />
        <Button name="login" size="l" handleButtonClick={handleSubmit} />
        <p className={styles.successMessage}>{loginSuccessMessage}</p>
      </section>
    </div>
  );
}

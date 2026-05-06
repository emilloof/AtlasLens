"use client";
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleLogin from "@/hooks/useHandleLogin";
import { useRouter } from "next/navigation";

export default function Login() {
  const { email, setEmail, password, setPassword, loginSuccessMessage, handleSubmit, errorMessage } = useHandleLogin();
  const router = useRouter();
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google/start";
  };
  return (
    <div className="page">
      <section className={styles.inputWrapper}>
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
          label="Password"
          placeholder="Please enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMessage={errorMessage.passwordError}
        />
        <Button name="login" size="l" handleButtonClick={handleSubmit} />
        <p className={styles.successMessage}>{loginSuccessMessage}</p>
        <div className={styles.buttonWrapper}>
        <Button
          name="Continue with Google"
          size="s"
          handleButtonClick={handleGoogleLogin}
          iconSrc="/green_pin.png"
          iconAlt="Google logo"
        />
          <Button name="Go to signup" size="s" handleButtonClick={() => router.push("/signup")} />
          
        </div>
      </section>
    </div>
  );
}

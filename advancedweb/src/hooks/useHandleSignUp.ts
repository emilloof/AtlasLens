"use client";
import { authService } from "@/services/authService";
import { FormEvent, useState } from "react";

export default function useHandleSignUp() {
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ idError?: string; nameError?: string; passwordError?: string }>(
    {}
  );

  const [signinSuccessMessage, setSigninSuccessMessage] = useState("");

  const validate = () => {
    const newErrors: typeof errorMessage = {};
    if (!id.includes("@")) newErrors.idError = "Invalid email format.";
    if (password.length < 6) newErrors.passwordError = "Password must be at least 6 characters.";
    if (userName === "") newErrors.nameError = "Please enter your name.";
    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage({});
    setSigninSuccessMessage("");

    try {
      setIsLoading(true);
      const res = await authService.signup({ userName, id, password });

      if (res.status === 200) {
        setSigninSuccessMessage("🎉 Sign up successful! Welcome aboard.");

        setId("");
        setUserName("");
        setPassword("");
      } else {
        if (res.error) {
          setSigninSuccessMessage(res.error);
        } else {
          setSigninSuccessMessage("");
        }
      }
    } catch {
      setSigninSuccessMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    id,
    setId,
    userName,
    setUserName,
    password,
    setPassword,
    signinSuccessMessage,
    handleSubmit,
    errorMessage,
    isLoading,
  };
}

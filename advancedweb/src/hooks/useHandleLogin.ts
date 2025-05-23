"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function useHandleLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<{ idError?: string; passwordError?: string; serverError?: string }>(
    {}
  );
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errorMessage = {};
    if (!id.includes("@")) newErrors.idError = "Invalid email format.";
    if (password.length < 6) newErrors.passwordError = "Password must be at least 6 characters.";
    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage({});
    setLoginSuccessMessage("");

    if (validate()) {
      try {
        setIsLoading(true);

        const { error } = await authService.login({ id, password });

        if (error) {
          throw new Error(error);
        }

        setLoginSuccessMessage(`Welcome to ??`);

        setId("");
        setPassword("");

        setTimeout(() => {
          router.push("/map");
        }, 1000);
      } catch (error) {
        setErrorMessage({
          serverError: error instanceof Error ? error.message : "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    id,
    setId,
    password,
    setPassword,
    loginSuccessMessage,
    handleSubmit,
    errorMessage,
    isLoading,
  };
}

"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

    // Clear any previous errors
    setErrorMessage({});
    setLoginSuccessMessage("");

    if (validate()) {
      try {
        setIsLoading(true);

        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        setLoginSuccessMessage("Welcome to ~");

        // Optional: Store user info in localStorage or context if needed
        // localStorage.setItem("userId", id);

        // Redirect to dashboard or home page after successful login
        setTimeout(() => {
          router.push("/map"); // Change this to your desired redirect path
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

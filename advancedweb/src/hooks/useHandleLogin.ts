"use client";
import { FormEvent, useState } from "react";

export default function useHandleLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<{ idError?: string; passwordError?: string }>({});
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

  const validate = () => {
    const newErrors: typeof errorMessage = {};
    if (!id.includes("@")) newErrors.idError = "Invalid email format.";
    if (password.length < 6) newErrors.passwordError = "Password must be at least 6 characters.";
    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoginSuccessMessage("Welcome to ~");
      //submit logic
    }
  };

  return { id, setId, password, setPassword, loginSuccessMessage, handleSubmit, errorMessage };
}

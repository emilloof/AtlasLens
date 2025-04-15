"use client";
import { FormEvent, useState } from "react";

export default function useHandleSignUp() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<{ idError?: string; nameError?: string; passwordError?: string }>(
    {}
  );

  const [signinSuccessMessage, setSigninSuccessMessage] = useState("");

  const validate = () => {
    const newErrors: typeof errorMessage = {};
    if (!id.includes("@")) newErrors.idError = "Invalid email format.";
    if (password.length < 6) newErrors.passwordError = "Password must be at least 6 characters.";
    if (name === "") newErrors.nameError = "Please enter your name.";
    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSigninSuccessMessage("Welcome to ~");
      //submit logic
    }
  };

  return { id, setId, name, setName, password, setPassword, signinSuccessMessage, handleSubmit, errorMessage };
}

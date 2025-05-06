"use client";
import { FormEvent, useState } from "react";

export default function useHandleSignUp() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1) 클라이언트 검증
    if (!validate()) return;

    setLoading(true);
    setErrorMessage({}); // 이전 에러 리셋
    setSigninSuccessMessage(""); // 이전 성공메시지 리셋

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: id,
          username: name,
          password,
        }),
      });

      const payload = await res.json();

      if (res.ok) {
        // 회원가입 성공
        setSigninSuccessMessage("🎉 Sign up successful! Welcome aboard.");
        // 필요하면 폼 초기화
        setId("");
        setName("");
        setPassword("");
      } else {
        // 서버 측 에러 처리
        // 예시: { error: { code: "...", message: "...", fields?: { nameError, ... } } }
        if (payload.error?.fields) {
          setErrorMessage(payload.error.fields);
        } else {
          setErrorMessage({ nameError: payload.error?.message || "Sign up failed." });
        } //name error 말고 general error 로 바꿔야함
      }
    } catch (err) {
      setErrorMessage({ nameError: "Network error. Please try again." });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { id, setId, name, setName, password, setPassword, signinSuccessMessage, handleSubmit, errorMessage, loading };
}

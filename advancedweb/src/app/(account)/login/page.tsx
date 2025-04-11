"use client";
import Button from "@/component/button";
import Input from "@/component/input";

export default function Login() {
  const handleButtonClick = () => {
    //send request.
  };
  return (
    <div className="inputWrapper">
      <section>
        <Input size="s" label="id" placeholder="Please enter the id" type="text" />
        <Input size="s" label="password" placeholder="Please enter the password" type="text" />
      </section>
      <Button name="login" size="m" handleButtonClick={handleButtonClick} />
    </div>
  );
}

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useNotification } from "../components/Notification";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password != confirmPassword) {
      showNotification("Password do not match", "error");
      return;
    }

    try {
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      showNotification("Registration successfull! please login", "success");
      router.push("/login");
    } catch (error) {
        showNotification(
            error instanceof Error ? error.message : "Registration failed",
            "error"
          );
    }
  };
  return <div>Register</div>;
}

export default Register;

"use client";

import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignUp = async () => {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });
    if (error) {
      console.error(error);
      window.alert(error.message);
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/",
    });
    if (error) {
      console.error(error);
      window.alert(error.message);
    }
  };

  if (isSignUp) {
    return (
      <div>
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={() => setIsSignUp(false)}>Sign In</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Sign In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="checkbox"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
      <button onClick={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Sign In" : "Sign Up"}
      </button>
    </div>
  );
}

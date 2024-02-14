import React, { useState } from "react";
import { SessionProvider, signIn } from "next-auth/react";
import Auth from "../components/Test/auth";

const Test = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    signIn("credentials", { email, password, redirect: false }).then(
      (callback) => {
        if (callback?.error) {
          console.error(callback.error);
        }

        if (callback?.ok && !callback?.error) {
          console.log("Logged in successfully!");
        }
      }
    );
  };

  return (
    <div>
      <input
        type="text"
        name="email"
        value={email}
        onInput={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        name="password"
        value={password}
        onInput={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleClick}>Save</button>
      <SessionProvider>
        <Auth />
      </SessionProvider>
    </div>
  );
};

export default Test;

import React, { useState } from "react";
import { SessionProvider, signIn } from "next-auth/react";
import Auth from "../components/Test/auth";

const Test = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBaseClick = () => {
    signIn("credentials", { email, password, redirect: false });
  };

    const handleGoogleClick = () => {
        signIn("google", { redirect: false });
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
          <button onClick={handleBaseClick}>Save</button>

          <button onClick={handleGoogleClick}>Google</button>
          <SessionProvider>
              <Auth/>
          </SessionProvider>
      </div>
  );
};

export default Test;

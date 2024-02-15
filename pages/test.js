import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import Auth from "../components/Test/auth";

const Test = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBaseClick = async () => {
    try {
      await signIn("credentials", { authToken: "test 123 authToken", redirect: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleClick = () => {
    signIn("google", { redirect: false });
  };

    const handleFacebookClick = () => {
        signIn("facebook", { redirect: false });
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
          
          <button onClick={handleFacebookClick}>Facebook</button>

          <SessionProvider>
              <Auth/>
          </SessionProvider>
      </div>
  );
};

export default Test;

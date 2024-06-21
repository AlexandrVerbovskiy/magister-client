import React from "react";
import { signIn } from "next-auth/react";

const SocialAuth = () => {
  const handleGoogleClick = (e) => {
    e.preventDefault();
    signIn("google", { redirect: false });
  };

  const handleFacebookClick = (e) => {
    e.preventDefault();
    signIn("facebook", { redirect: false });
  };

  return (
    <ul>
      <li>
        <a onClick={handleFacebookClick} className="facebook" style={{cursor:"pointer"}}>
          <i className="bx bxl-facebook"></i>
        </a>
      </li>
      <li>
        <a onClick={handleGoogleClick} className="google" style={{cursor:"pointer"}}>
          <i className="bx bxl-google"></i>
        </a>
      </li>
    </ul>
  );
};

export default SocialAuth;

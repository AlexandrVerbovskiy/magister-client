import React from "react";
import { signIn } from "next-auth/react";
import STATIC from "../../../static";

const SocialAuth = () => {
  const handleGoogleClick = (e) => {
    e.preventDefault();
    signIn("google", { callbackUrl: STATIC.REDIRECTS.SUCCESS_LOGIN });
  };

  const handleFacebookClick = (e) => {
    e.preventDefault();
    signIn("facebook", { callbackUrl: STATIC.REDIRECTS.SUCCESS_LOGIN });
  };

  return (
    <ul>
      <li>
        <a
          onClick={handleFacebookClick}
          className="facebook"
          style={{ cursor: "pointer" }}
        >
          <i className="bx bxl-facebook"></i> Facebook
        </a>
      </li>
      <li>
        <a
          onClick={handleGoogleClick}
          className="google"
          style={{ cursor: "pointer" }}
        >
          <i className="bx bxl-google"></i> Google
        </a>
      </li>
    </ul>
  );
};

export default SocialAuth;

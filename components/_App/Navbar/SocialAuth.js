import React from "react";
import env from "../../../env";

const SocialAuth = () => {
  return (
    <ul>
      <li>
        <a href={env.SERVER_URL + env.FACEBOOK_AUTH_LINK} className="facebook">
          <i className="bx bxl-facebook"></i> Facebook
        </a>
      </li>
      <li>
        <a href={env.SERVER_URL + env.GOOGLE_AUTH_LINK} className="google">
          <i className="bx bxl-google"></i> Google
        </a>
      </li>
    </ul>
  );
};

export default SocialAuth;

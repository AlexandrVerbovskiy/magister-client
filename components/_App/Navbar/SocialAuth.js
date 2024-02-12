import ENV from "../../../env";

const SocialAuth = () => (
  <ul>
    <li>
      <a href={ENV.SERVER_URL + ENV.FACEBOOK_AUTH_LINK} className="facebook">
        <i className="bx bxl-facebook"></i> Facebook
      </a>
    </li>
    <li>
      <a
        href={ENV.SERVER_URL + ENV.GOOGLE_AUTH_LINK}
        className="google"
      >
        <i className="bx bxl-google"></i> Google
      </a>
    </li>
  </ul>
);

export default SocialAuth;

import { signIn } from "next-auth/react";

const SocialAuth = () => {
  const handleSignInGoogle = async (e) => {
    e.preventDefault();
    const res = await signIn("google");
    console.log(res);
  };

  const handleSignInFacebook = async (e) => {
    e.preventDefault();
    const res = await signIn("facebook");
    console.log(res);
  };

  return (
    <ul>
      <li>
        <a href="#" onClick={handleSignInFacebook} className="facebook">
          <i className="bx bxl-facebook"></i> Facebook
        </a>
      </li>
      <li>
        <a href="#" onClick={handleSignInGoogle} className="google">
          <i className="bx bxl-google"></i> Google
        </a>
      </li>
    </ul>
  );
};

export default SocialAuth;

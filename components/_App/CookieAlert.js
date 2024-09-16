import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie_accepted");

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) {
    return <></>;
  }

  const handleAcceptCookies = () => {
    Cookies.set("cookie_accepted", true, { expires: 30 });
    setShowBanner(false);
  };

  return (
    <div
      className="message-site-alert alert alert-warning alert-dismissible fade show cookie-banner"
      role="alert"
    >
      <div>
        <div className="title">We use cookies</div>
        We use cookies to enhance your experience on our website. By accepting,
        you agree to our{" "}
        <Link href="/privacy-policy/" target="_blank">
          Privacy Policy
        </Link>
      </div>

      <div className="text-end">
        <button onClick={handleAcceptCookies}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;

import React, { useState, useContext } from "react";
import Link from "next/link";
import { validateEmail } from "../../utils";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";
import { verifyEmail } from "../../services";

const PasswordResetSend = () => {
  const router = useRouter();
  const { token } = router.query;
  const { error, success } = useContext(IndiceContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const handleSendClick = async () => {
    const resEmailValid = validateEmail(email);
    if (resEmailValid !== true) {
      setEmailError("Incorrect email format");
      return;
    }

    try {
      await verifyEmail(email, token);
      success.set(
        "Mail verified successfully. For further actions, log in to the site"
      );
      router.push("/");
    } catch (e) {
      setEmailError(e.message);
    }
  };

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  return (
    <>
      <div className="coming-soon-area">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="coming-soon-content">
              <Link href="/" className="logo">
                <img src="/images/black-logo.png" alt="image" />
              </Link>

              <h2>Email verification</h2>

              <form className="newsletter-form" method="get">
                <div className="form-group">
                  <input
                    type="text"
                    className={`input-newsletter border-bottom-required${
                      emailError ? " is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onInput={handleInputEmail}
                    required
                  />
                  <span className="label-title">
                    <i className="bx bx-envelope"></i>
                  </span>
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                <button
                  type="button"
                  className="default-btn"
                  onClick={handleSendClick}
                >
                  Verify Email
                </button>

                <p className="words-wrap">
                  Your email has been successfully confirmed. You can now
                  securely access your account. If you have any further
                  questions or concerns, please contact our support team.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PasswordResetSend.getInitialProps = async () => ({
  access: "no auth",
});

export default PasswordResetSend;

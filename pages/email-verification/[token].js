import React, { useState, useContext } from "react";
import Link from "next/link";
import { validateEmail } from "../../utils";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";

const PasswordResetSend = () => {
  const router = useRouter();
  const { token } = router.query;
  const { error, success } = useContext(IndiceContext);
  const [email, setEmail] = useState({ value: "", error: null });

  const handleSendClick = () => {
    if (!validateEmail(email.value)) {
      setEmail((prev) => ({
        ...prev,
        error: "Incorrect email format",
      }));

      return;
    }

    success.set("Letter sent successfully");
  };

  const handleEmailInput = (e) => {
    setEmail({ value: e.target.value, error: null });
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
                      email.error ? " is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    name="email"
                    value={email.value}
                    onInput={handleEmailInput}
                    required
                  />
                  <span className="label-title">
                    <i className="bx bx-envelope"></i>
                  </span>
                  {email.error && (
                    <div className="invalid-feedback">{email.error}</div>
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

/*PasswordResetSend.getInitialProps = async () => ({
  access: "no auth",
});*/

export default PasswordResetSend;

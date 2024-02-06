import React, { useState, useContext } from "react";
import Link from "next/link";
import { validateEmail } from "../utils";
import { IndiceContext } from "../contexts";

const PasswordResetSend = () => {
  const { error, success } = useContext(IndiceContext);
  const [email, setEmail] = useState({ value: "", error: null });

  const handleSendClick = () => {
    const resEmailValid = validateEmail(email.value);
    if (resEmailValid !== true) {
      setEmail((prev) => ({
        ...prev,
        error: resEmailValid,
      }));

      return;
    }

    success.set("Letter sent successfully");
  };

  const handleEmailInput = (e) => {
    setEmail({ value: e.target.value, error: null });
  };

  return (
    <div className="coming-soon-area">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="coming-soon-content">
            <Link href="/" className="logo">
              <img src="/images/black-logo.png" alt="image" />
            </Link>

            <h2>Password reset</h2>

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
                Send letter
              </button>

              <p className="words-wrap">
                Reset your password securely. Enter your email to receive a link
                for password recovery. Follow the instructions in the email to
                set a new password for your account.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

PasswordResetSend.getInitialProps = async () => ({
  access: "no auth",
});

export default PasswordResetSend;

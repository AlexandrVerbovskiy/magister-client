import React, { useState, useContext } from "react";
import Link from "next/link";
import { IndiceContext } from "../contexts";

const PasswordResetSend = () => {
  const { error, success } = useContext(IndiceContext);
  const [code, setCode] = useState({ value: "", error: null });

  const handleSendClick = () => {
    if (!code.value.length < 1) {
      setCode((prev) => ({
        ...prev,
        error: "Can't be empty",
      }));

      return;
    }

    success.set("Phone verified successfully");
  };

  const handleCodeInput = (e) => {
    setCode({ value: e.target.value, error: null });
  };

  return (
    <div className="coming-soon-area">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="coming-soon-content">
            <Link href="/" className="logo">
              <img src="/images/black-logo.png" alt="image" />
            </Link>

            <h2>Phone number verification</h2>

            <form className="newsletter-form" method="get">
              <div className="form-group">
                <input
                  type="text"
                  className={`input-newsletter border-bottom-required${
                    code.error ? " is-invalid" : ""
                  }`}
                  placeholder="Enter code"
                  name="email"
                  value={code.value}
                  onInput={handleCodeInput}
                  required
                />
                <span className="label-title">
                  <i className="bx bx-key"></i>
                </span>
                {code.error && (
                  <div className="invalid-feedback">{code.error}</div>
                )}
              </div>

              <button
                type="button"
                className="default-btn"
                onClick={handleSendClick}
              >
                Verify phone number
              </button>

              <p className="words-wrap">
                Your phone number has been successfully verified. You can now
                securely access your account. If you have any further questions
                or concerns, please contact our support team.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

PasswordResetSend.getInitialProps = async () => ({
  access: "auth",
});

export default PasswordResetSend;

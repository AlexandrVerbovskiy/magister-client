import React, { useState, useContext } from "react";
import Link from "next/link";
import { validateEmail } from "../utils";
import { IndiceContext } from "../contexts";
import { resetPasswordSend } from "../services";
import { useRouter } from "next/router";
import { notAuthSideProps } from "../middlewares";
import ErrorSpan from "../components/ErrorSpan";

const PasswordResetSend = () => {
  const router = useRouter();
  const { error, success } = useContext(IndiceContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const handleSendClick = async () => {
    const resEmailValid = validateEmail(email);

    if (resEmailValid !== true) {
      setEmailError(resEmailValid);
      return;
    }

    try {
      await resetPasswordSend(email);
      success.set("Letter sent successfully");
      router.push("/");
    } catch (e) {
      setEmailError(e.message);
    }
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  return (
    <div className="coming-soon-area">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="coming-soon-content">
            <Link href="/" className="logo">
              <img
                src="/images/logo-black.svg"
                className="logo-image"
                alt="logo"
              />
            </Link>

            <h2>Password reset</h2>

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
                  onInput={handleEmailInput}
                  required
                />
                <span className="label-title">
                  <i className="bx bx-envelope"></i>
                </span>
                <ErrorSpan error={emailError} />
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

export const getServerSideProps = (context) =>
  notAuthSideProps({ context, baseProps: { pageTitle: "Password reset" } });

export default PasswordResetSend;

import React, { useState, useContext } from "react";
import Link from "next/link";
import { validatePassword } from "../../utils";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";
import { resetPassword } from "../../services";
import { notAuthSideProps } from "../../middlewares";
import ErrorSpan from "../../components/ErrorSpan";

const PasswordResetSend = () => {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const { token } = router.query;
  const { error, success } = useContext(IndiceContext);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [confirmPasswordFieldType, setConfirmPasswordFieldType] =
    useState("password");

  const handleChangePasswordFieldType = () => {
    const newType = passwordFieldType == "password" ? "text" : "password";
    setPasswordFieldType(newType);
  };

  const handleChangeConfirmPasswordFieldType = () => {
    const newType =
      confirmPasswordFieldType == "password" ? "text" : "password";
    setConfirmPasswordFieldType(newType);
  };

  const handleSendClick = async () => {
    setFormError(null);
    let error = false;

    const resPasswordValid = validatePassword(password);
    if (resPasswordValid !== true) {
      error = true;
      setPasswordError(resPasswordValid);
    }

    const resConfirmedPasswordValid = validatePassword(confirmPassword);
    if (resConfirmedPasswordValid !== true) {
      error = true;
      setConfirmPasswordError(resConfirmedPasswordValid);
    }

    if (password != confirmPassword) {
      error = true;
      setConfirmPasswordError("Passwords do not match");
    }

    if (error) return;

    try {
      await resetPassword(password, token);
      success.set("Password reset successfully. Try logging in to the site");
      router.push("/");
    } catch (e) {
      setFormError(e.message);
    } finally {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handleConfirmedPasswordInput = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(null);
  };

  return (
    <>
      <div className="coming-soon-area password-reset">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="coming-soon-content">
              <Link href="/" className="logo">
                <img
                  src="/images/rent-about-logo-black.png"
                  className="logo-image"
                  alt="logo"
                />{" "}
              </Link>

              <h2>Password reset</h2>

              <form className="newsletter-form" method="get">
                <div className="form-group">
                  <input
                    type={passwordFieldType}
                    className={`input-newsletter border-bottom-required${
                      passwordError ? " is-invalid" : ""
                    }`}
                    placeholder="Enter your password"
                    name="password"
                    value={password}
                    onInput={handlePasswordInput}
                    required
                  />
                  <i
                    className={`bx ${
                      passwordFieldType == "password"
                        ? "bx-lock"
                        : "bx-lock-open"
                    } cursor-pointer`}
                    onClick={handleChangePasswordFieldType}
                  ></i>

                  <ErrorSpan error={passwordError} />
                </div>

                <div className="form-group">
                  <input
                    type={confirmPasswordFieldType}
                    className={`input-newsletter border-bottom-required${
                      confirmPasswordError ? " is-invalid" : ""
                    }`}
                    placeholder="Confirm your password"
                    name="confirm_password"
                    value={confirmPassword}
                    onInput={handleConfirmedPasswordInput}
                    required
                  />
                  <i
                    className={`bx ${
                      confirmPasswordFieldType == "password"
                        ? "bx-lock"
                        : "bx-lock-open"
                    } cursor-pointer`}
                    onClick={handleChangeConfirmPasswordFieldType}
                  ></i>

                  <ErrorSpan error={confirmPasswordError} />
                </div>

                {formError && (
                  <div
                    className="alert-dismissible fade show alert alert-danger"
                    role="alert"
                  >
                    {formError}
                  </div>
                )}

                <button
                  type="button"
                  className="default-btn"
                  onClick={handleSendClick}
                >
                  Reset password
                </button>

                <p className="words-wrap">
                  Enter a new password for your account. Remember to prioritize
                  security and use a strong password.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = notAuthSideProps;

export default PasswordResetSend;

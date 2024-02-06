import React, { useState, useContext } from "react";
import Link from "next/link";
import { validatePassword } from "../../utils";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";

const PasswordResetSend = () => {
  const router = useRouter();
  const { token } = router.query;
  const { error, success } = useContext(IndiceContext);
  const [password, setPassword] = useState({ value: "", error: null });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: null,
  });

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

  const handleSendClick = () => {
    let error = false;

    const resPasswordValid = validatePassword(password.value);
    if (resPasswordValid !== true) {
      error = true;
      setPassword((prev) => ({
        ...prev,
        error: resPasswordValid,
      }));
    }

    const resConfirmedPasswordValid = validatePassword(password.value);
    if (resConfirmedPasswordValid !== true) {
      error = true;
      setConfirmPassword((prev) => ({
        ...prev,
        error: resConfirmedPasswordValid,
      }));
    }

    if (password.value != confirmPassword.value) {
      error = true;
      setConfirmPassword((prev) => ({
        ...prev,
        error: "Passwords do not match",
      }));
    }

    if (error) return;

    success.set("Password reset successfully");
  };

  const handlePasswordInput = (e) => {
    setPassword({ value: e.target.value, error: null });
  };

  const handleConfirmedPasswordInput = (e) => {
    setConfirmPassword({ value: e.target.value, error: null });
  };

  return (
    <>
      <div className="coming-soon-area password-reset">
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
                    type={passwordFieldType}
                    className={`input-newsletter border-bottom-required${
                      password.error ? " is-invalid" : ""
                    }`}
                    placeholder="Enter your password"
                    name="password"
                    value={password.value}
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
                  {password.error && (
                    <div className="invalid-feedback">{password.error}</div>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type={confirmPasswordFieldType}
                    className={`input-newsletter border-bottom-required${
                      confirmPassword.error ? " is-invalid" : ""
                    }`}
                    placeholder="Confirm your password"
                    name="confirm_password"
                    value={confirmPassword.value}
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
                  {confirmPassword.error && (
                    <div className="invalid-feedback">
                      {confirmPassword.error}
                    </div>
                  )}
                </div>

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

PasswordResetSend.getInitialProps = async () => ({
  access: "no auth",
});

export default PasswordResetSend;

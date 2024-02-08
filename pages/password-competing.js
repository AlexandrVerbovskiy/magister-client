import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { validatePassword } from "../utils";
import { IndiceContext } from "../contexts";
import { setMyPassword } from "../services";

const PasswordCompleting = () => {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const { user } = useContext(IndiceContext);
  const { error, success, setLoading } = useContext(IndiceContext);
  const [hasAccess, setHasAccess] = useState(null);

  const [password, setPassword] = useState({
    value: "",
    error: null,
  });

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

  const handleInputPassword = (e) =>
    setPassword({ value: e.target.value, error: null });

  const handleInputConfirmPassword = (e) =>
    setConfirmPassword({ value: e.target.value, error: null });

  const handleSaveClick = async () => {
    setFormError(null);

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

    try {
      await setMyPassword(password.value);
      success.set("Password updated successfully");
      router.push("/settings/profile-edit");
    } catch (err) {
      setFormError(err.message);
    }
  };

  useEffect(() => {
    if (user.needSetPassword) {
      setHasAccess(true);
    } else {
      error.set("Access denied");
      router.push("/");
    }

    setLoading(false);
  }, []);

  if (hasAccess === null) return <div></div>;

  return (
    <div className="coming-soon-area password-competing">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="coming-soon-content">
            <Link href="/" className="logo">
              <img src="/images/black-logo.png" alt="image" />
            </Link>

            <h2>Set a password</h2>

            <form className="newsletter-form" method="get">
              <div className="form-group">
                <input
                  type="email"
                  className={`input-newsletter border-bottom-required`}
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={() => {}}
                  required
                  disabled
                />
                <span className="label-title">
                  <i className="bx bx-envelope"></i>
                </span>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className={`input-newsletter border-bottom-required`}
                  placeholder="Name"
                  name="name"
                  value={user.name}
                  onInput={() => {}}
                  required
                  disabled
                />
                <span className="label-title">
                  <i className="bx bx-user"></i>
                </span>
              </div>

              <div className="form-group">
                <input
                  type={passwordFieldType}
                  className={`input-newsletter border-bottom-required${
                    password.error ? " is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  name="password"
                  value={password.value}
                  onInput={handleInputPassword}
                  required
                />
                <i
                  className={`bx ${
                    passwordFieldType == "password" ? "bx-lock" : "bx-lock-open"
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
                  onInput={handleInputConfirmPassword}
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
                onClick={handleSaveClick}
              >
                Next
              </button>

              <p className="words-wrap">
                Secure your account with a strong password. Mix characters for
                better protection. Keep it confidential for maximum security.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

PasswordCompleting.getInitialProps = async () => ({
  access: "auth",
});

export default PasswordCompleting;

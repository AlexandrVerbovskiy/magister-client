import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { validatePassword } from "../utils";
import { IndiceContext } from "../contexts";
import { updateShortUserInfo } from "../services";

const MoreInfoCompleting = () => {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const { user } = useContext(IndiceContext);
  const { error, success, setLoading } = useContext(IndiceContext);
  const [hasAccess, setHasAccess] = useState(null);

  const [acceptedTermCondition, setAcceptedTermCondition] = useState("");
  const [acceptedTermConditionError, setAcceptedTermConditionError] =
    useState(null);

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

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handleInputConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(null);
  };

  const handleInputAcceptedTermsCondition = (e) => {
    setAcceptedTermCondition(e.target.checked);
    setAcceptedTermConditionError(null);
  };

  const handleSaveClick = async () => {
    setFormError(null);

    let error = false;

    const resPasswordValid = validatePassword(password);
    if (resPasswordValid !== true) {
      error = true;
      setPasswordError(resPasswordValid);
    }

    const resConfirmedPasswordValid = validatePassword(password);
    if (resConfirmedPasswordValid !== true) {
      error = true;
      setConfirmPasswordError(resConfirmedPasswordValid);
    }

    if (password != confirmPassword) {
      error = true;
      setConfirmPasswordError("Passwords do not match");
    }

    if (!acceptedTermCondition) {
      error = true;
      setAcceptedTermConditionError(
        "You need to accept the site's terms of use if you want to work on it"
      );
    }

    if (error) return;

    try {
      await updateShortUserInfo(password, acceptedTermCondition);
      success.set("Info saved successfully");
      router.push("/settings/profile-edit");
    } catch (err) {
      setFormError(err.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (user.needSetPassword) {
      setHasAccess(true);
    } else {
      error.set("Access denied");
      router.push("/");
    }

    setLoading(false);
  }, [user]);

  if (hasAccess === null) return <div></div>;

  return (
    <div className="coming-soon-area password-competing">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="coming-soon-content">
            <Link href="/" className="logo">
              <img src="/images/black-logo.png" alt="image" />
            </Link>

            <h2>Continue registration</h2>

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
                    passwordError ? " is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  onInput={handleInputPassword}
                  required
                />
                <i
                  className={`bx ${
                    passwordFieldType == "password" ? "bx-lock" : "bx-lock-open"
                  } cursor-pointer`}
                  onClick={handleChangePasswordFieldType}
                ></i>
                {passwordError && (
                  <div className="invalid-feedback">{passwordError}</div>
                )}
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
                {confirmPasswordError && (
                  <div className="invalid-feedback">{confirmPasswordError}</div>
                )}
              </div>

              <div className="form-group form-check">
                <div className="d-flex"> 
                  <input
                    type="checkbox"
                    className={`form-check-input${
                      acceptedTermConditionError ? " is-invalid" : ""
                    }`}
                    id="confirm-terms-conditions"
                    checked={acceptedTermCondition}
                    onChange={handleInputAcceptedTermsCondition}
                  />
                  <span>
                    <label
                      className="form-check-label"
                      htmlFor="confirm-terms-conditions"
                    >
                      Accept
                    </label>{" "}
                    <span className="dont-account">
                      <Link href="#">conditions</Link>
                    </span>
                  </span>
                </div>
                {acceptedTermConditionError && (
                  <div className="invalid-feedback">
                    {acceptedTermConditionError}
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

MoreInfoCompleting.getInitialProps = async () => ({
  access: "auth",
});

export default MoreInfoCompleting;

import React, { useState, useContext } from "react";
import Link from "next/link";
import { validatePassword } from "../../utils";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";
import { resetPassword } from "../../services";
import { notAuthSideProps } from "../../middlewares";
import PasswordInput from "../../components/FormComponents/PasswordInput";

const PasswordResetSend = () => {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const { token } = router.query;
  const { success } = useContext(IndiceContext);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

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
                <PasswordInput
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  onInput={handlePasswordInput}
                  error={passwordError}
                  inputClassName="input-newsletter border-bottom-required"
                />

                <PasswordInput
                  name="confirm_password"
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onInput={handleConfirmedPasswordInput}
                  error={confirmPasswordError}
                  inputClassName="input-newsletter border-bottom-required"
                />

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

export const getServerSideProps = (context) =>
  notAuthSideProps({ context, baseProps: { pageTitle: "Reset password" } });

export default PasswordResetSend;

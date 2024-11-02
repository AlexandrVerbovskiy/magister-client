import React, { useContext, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Input from "../components/FormComponents/Input";
import PasswordInput from "../components/FormComponents/PasswordInput";
import { IndiceContext } from "../contexts";
import { register, verifyEmail } from "../services";
import SocialAuth from "../components/_App/Navbar/SocialAuth";
import { validateEmail, validatePassword } from "../utils";
import ErrorSpan from "../components/ErrorSpan";
import EmailVerifiedCodeModal from "../components/_App/Navbar/EmailVerifiedCodeModal";
import STATIC from "../static";

const SignUp = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [acceptedTermCondition, setAcceptedTermCondition] = useState("");
  const [acceptedTermConditionError, setAcceptedTermConditionError] =
    useState(null);

  const { error: mainError, success: mainSuccess } = useContext(IndiceContext);

  const [emailVerifiedCode, setEmailVerifiedCode] = useState("");
  const [emailVerifiedCodeModalActive, setEmailVerifiedCodeModalActive] =
    useState(false);
  const [emailVerifiedCodeModalError, setEmailVerifiedCodeModalError] =
    useState(null);

  const handleChangeEmailVerifiedCode = (e) => {
    setEmailVerifiedCode(e.target.value);
    setEmailVerifiedCodeModalError(null);
  };

  const handleEmailVerifyCode = async () => {
    try {
      const res = await verifyEmail(email, emailVerifiedCode);

      await signIn("credentials", {
        userId: res.userId,
        authToken: res.authToken,
        callbackUrl:
          STATIC.REDIRECTS.EDIT_PROFILE_LINK +
          "?success=Email verified successfully",
        needRegularViewInfoForm: res.needRegularViewInfoForm,
      });
    } catch (e) {
      mainError.set(e.message);
    }
  };

  const handleInputName = (e) => {
    setName(e.target.value);
    setNameError(null);
  };

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const resEmailValid = validateEmail(email);
    if (resEmailValid !== true) {
      error = true;
      setEmailError(resEmailValid);
    }

    if (!name.trim()) {
      error = true;
      setNameError("Name is required field");
    }

    if (!acceptedTermCondition) {
      error = true;
      setAcceptedTermConditionError(
        "You need to accept the site's terms of use if you want to work on it"
      );
    }

    if (error) return;

    try {
      await register({
        password,
        name,
        email,
        acceptedTermCondition,
      });

      setEmailVerifiedCodeModalActive(true);
      mainSuccess.set("Successful registered");
    } catch (e) {
      mainError.set(e.message);
    } finally {
      setPassword("");
      setConfirmPassword("");
    }
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

              <h2>Register</h2>

              <div className="provider-login-section mt-8">
                <div className="login-with-account">
                  <SocialAuth />
                </div>

                <span className="sub-title">
                  <span>Or register with</span>
                </span>
              </div>

              <form
                className="login-form mt-2"
                method="get"
                onSubmit={handleSubmit}
              >
                <Input
                  name="name"
                  value={name}
                  placeholder="Enter your username"
                  onInput={handleInputName}
                  error={nameError}
                  inputClassName="input-newsletter border-bottom-required"
                  Icon={() => <i className="bx bx-user cursor-auto"></i>}
                />

                <Input
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  onInput={handleInputEmail}
                  error={emailError}
                  inputClassName="input-newsletter border-bottom-required"
                  Icon={() => <i className="bx bx-envelope cursor-auto"></i>}
                />

                <div className="row form-group m-0">
                  <div className="col-6 ps-0">
                    <PasswordInput
                      name="password"
                      value={password}
                      placeholder="Enter your password"
                      onInput={handleInputPassword}
                      error={passwordError}
                      inputClassName="input-newsletter border-bottom-required"
                    />
                  </div>

                  <div className="col-6 pe-0">
                    <PasswordInput
                      name="confirmPassword"
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      error={confirmPasswordError}
                      onInput={handleInputConfirmPassword}
                      inputClassName="input-newsletter border-bottom-required"
                    />
                  </div>
                </div>

                <div
                  className="form-group form-check"
                  style={{ textAlign: "start" }}
                >
                  <input
                    name="confirmTermsConditions"
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
                      <Link href="/terms-of-service/">conditions</Link>
                    </span>
                  </span>

                  <ErrorSpan error={acceptedTermConditionError} />
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <button type="submit" className="default-btn">
                    Register
                  </button>
                </div>

                <p className="words-wrap">
                  Already have an account?{" "}
                  <Link href="/sign-in/">Login Now</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <EmailVerifiedCodeModal
        code={emailVerifiedCode}
        activeModal={emailVerifiedCodeModalActive}
        closeModal={() => setEmailVerifiedCodeModalActive(false)}
        handleInputCode={handleChangeEmailVerifiedCode}
        verifyFormError={emailVerifiedCodeModalError}
        handleVerifyCode={handleEmailVerifyCode}
      />
    </>
  );
};

export default SignUp;

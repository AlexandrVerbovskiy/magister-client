import React, { useContext, useState } from "react";
import Link from "next/link";
import { useLogin } from "../../hooks";
import Input from "../FormComponents/Input";
import PasswordInput from "../FormComponents/PasswordInput";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import {
  checkTwoFactorCode,
  generateTwoFactorCode,
  verifyEmail,
} from "../../services";
import AuthCodeModal from "./Navbar/AuthCodeModal";
import AuthTypeModal from "./Navbar/AuthTypeModal";
import { signIn } from "next-auth/react";
import SocialAuth from "./Navbar/SocialAuth";
import EmailVerifiedCodeModal from "./Navbar/EmailVerifiedCodeModal";
import STATIC from "../../static";

const SignInForm = () => {
  const router = useRouter();
  const [userToAuth, setUserToAuth] = useState(null);
  const [canChangeType, setCanChangeType] = useState(false);
  const [type, setType] = useState("email");
  const [typeModalActive, setTypeModalActive] = useState(false);
  const [typeModalError, setTypeModalError] = useState(null);

  const [code, setCode] = useState("");
  const [codeModalActive, setCodeModalActive] = useState(false);
  const [codeModalError, setCodeModalError] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

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
      const res = await verifyEmail(email, emailVerifiedCode, rememberMe);
      mainSuccess.set("Email verified successfully");
      await baseOnLogin(res);
    } catch (e) {
      setFormError(e.message);
    }
  };

  const { success: mainSuccess } = useContext(IndiceContext);

  const successReloadLink =
    STATIC.REDIRECTS.EDIT_PROFILE_LINK + "?success=Successfully logged in";

  const baseOnLogin = async (res) => {
    if (res.needCode) {
      if (res.codeSent) {
        setCanChangeType(false);
        setType("email");
        setCodeModalActive(true);
      } else {
        setCanChangeType(true);
        setTypeModalActive(true);
      }

      return;
    }

    mainSuccess.set("Successfully logged in");

    await signIn("credentials", {
      userId: res.userId,
      authToken: res.authToken,
      callbackUrl: successReloadLink,
      needRegularViewInfoForm: res.needRegularViewInfoForm,
    });
  };

  const onLoginPartSuccess = async (res) => {
    if (res.emailVerifiedCodeSent) {
      setCanChangeType(false);
      setEmailVerifiedCodeModalActive(true);
      return;
    }

    await baseOnLogin(res);
  };

  const {
    formError,
    emailError,
    passwordError,
    resendEmailView,
    wasResendEmailView,
    setFormError,
    setEmailError,
    setPasswordError,
    setRememberMeView,
    setWasRememberMeView,
    handleInputEmail,
    handleInputPassword,
    handleLogin: handleLoginSubmit,
    handleResendEmailVerify,
  } = useLogin({
    onLoginPartSuccess,
    setUser: setUserToAuth,
    setEmail,
    setPassword,
    setRememberMe,
    email,
    password,
    rememberMe,
  });

  const handleSelectTypeClick = async (type) => {
    setType(type);

    try {
      await generateTwoFactorCode(email, password, type);
      setTypeModalActive(false);
      setCodeModalActive(true);
    } catch (e) {
      setTypeModalError(e.message);
    }
  };

  const handleCloseTypeModal = () => {
    setTypeModalActive(false);
    setPassword("");
    setRememberMe(false);
    setCodeModalError(null);
    setTypeModalError(null);
  };

  const handleCheckCode = async () => {
    if (code.length < 1) {
      setCodeModalError("Code is required field");
    }

    try {
      const res = await checkTwoFactorCode(
        type,
        code,
        userToAuth.id,
        rememberMe
      );

      await signIn("credentials", {
        authToken: res.authToken,
        callbackUrl: successReloadLink,
      });

      setCode("");
      setCodeModalActive(false);
    } catch (e) {
      setCodeModalError(e.message);
    }
  };

  const handleCloseCodeModal = () => {
    setCodeModalActive(false);
    setPassword("");
    setRememberMe(false);
    setCodeModalError(null);
    setTypeModalError(null);
  };

  const handleChangeCode = (e) => {
    setCode(e.target.value);
    setCodeModalError(null);
  };

  return (
    <>
      <div className="coming-soon-area password-reset">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="coming-soon-content">
              <Link href="/" className="logo">
                <img
                  src="/images/logo-black.svg"
                  className="logo-image"
                  alt="logo"
                />{" "}
              </Link>

              <h2>Sign in</h2>

              <div className="provider-login-section mt-8">
                <div className="login-with-account">
                  <SocialAuth />
                </div>

                <span className="sub-title">
                  <span>Or login with</span>
                </span>
              </div>

              <form
                className="login-form mt-2"
                method="get"
                onSubmit={handleLoginSubmit}
              >
                <Input
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  onInput={handleInputEmail}
                  error={emailError}
                  inputClassName="input-newsletter border-bottom-required"
                  Icon={() => <i className="bx bx-envelope cursor-auto"></i>}
                />

                <PasswordInput
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  onInput={handleInputPassword}
                  error={passwordError}
                  inputClassName="input-newsletter border-bottom-required"
                />

                <div className="form-group form-check mb-0">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    className={`form-check-input`}
                    id="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    className="form-check-label w-100 text-start"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>

                {formError && (
                  <div
                    className="alert-dismissible fade show alert alert-danger"
                    role="alert"
                    style={{ marginBottom: "10px" }}
                  >
                    {formError}
                    {resendEmailView && !wasResendEmailView && (
                      <>
                        {". "}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleResendEmailVerify(e);
                          }}
                        >
                          Resend Letter
                        </a>
                      </>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: "10px" }}>
                  <button type="submit" className="default-btn">
                    Login Now
                  </button>
                </div>

                <p className="words-wrap">
                  Forgot or lost your password?{" "}
                  <Link href="/password-reset-send/">Reset It Now</Link>
                </p>
                <p className="words-wrap">
                  Don't have an account?{" "}
                  <Link href="/sign-up/">Register Now</Link>
                </p>
              </form>

              {canChangeType && (
                <AuthTypeModal
                  typeModalActive={typeModalActive}
                  typeModalError={typeModalError}
                  handleSelectTypeClick={handleSelectTypeClick}
                  handleClose={handleCloseTypeModal}
                />
              )}

              <AuthCodeModal
                type={type}
                codeModalActive={codeModalActive}
                code={code}
                handleChangeCode={handleChangeCode}
                codeModalError={codeModalError}
                handleCheckCode={handleCheckCode}
                handleClose={handleCloseCodeModal}
              />

              <EmailVerifiedCodeModal
                code={emailVerifiedCode}
                activeModal={emailVerifiedCodeModalActive}
                closeModal={() => setEmailVerifiedCodeModalActive(false)}
                handleInputCode={handleChangeEmailVerifiedCode}
                verifyFormError={emailVerifiedCodeModalError}
                handleVerifyCode={handleEmailVerifyCode}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInForm;

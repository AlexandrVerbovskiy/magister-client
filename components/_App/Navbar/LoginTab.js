import React, { useContext, useEffect } from "react";
import Input from "../../FormComponents/Input";
import SocialAuth from "./SocialAuth";
import Link from "next/link";
import PasswordInput from "../../FormComponents/PasswordInput";
import { useLogin } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import STATIC from "../../../static";

const LoginTab = ({
  email,
  setEmail,
  password,
  setPassword,
  moveToRegister,
  closeModal,
  setCanChangeType,
  setType,
  setCodeModalActive,
  setTypeModalActive,
  setUser,
  rememberMe,
  setRememberMe,
  activePopup,
}) => {
  const onLoginPartSuccess = async (res) => {
    closeModal();

    if (res.needCode) {
      if (res.codeSent) {
        setCanChangeType(false);
        setType("email");
        setCodeModalActive(true);
      } else {
        setCanChangeType(true);
        setTypeModalActive(true);
      }
    } else {
      await signIn("credentials", {
        userId: res.userId,
        authToken: res.authToken,
        callbackUrl: STATIC.REDIRECTS.SUCCESS_LOGIN,
        needRegularViewInfoForm: res.needRegularViewInfoForm,
      });
    }
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
    handleLogin: handleSubmit,
    handleResendEmailVerify,
  } = useLogin({
    onLoginPartSuccess,
    setUser,
    setEmail,
    setPassword,
    setRememberMe,
    email,
    password,
    rememberMe,
  });

  useEffect(() => {
    if (activePopup) {
      setFormError(null);
      setPasswordError(null);
      setEmailError(null);
      setEmail("");
      setPassword("");
    }
  }, [activePopup]);

  return (
    <>
      <div className="tab-pane fade show active" id="login">
        <div className="miran-login">
          <div className="login-with-account">
            <span>Login with</span>
            <SocialAuth />
          </div>

          <span className="sub-title">
            <span>Or login with</span>
          </span>

          <form onSubmit={handleSubmit}>
            <Input
              name="email"
              type="text"
              value={email}
              placeholder="Email"
              error={emailError}
              onInput={handleInputEmail}
            />

            <PasswordInput
              name="password"
              value={password}
              placeholder="Password"
              error={passwordError}
              onInput={handleInputPassword}
            />

            <div className="form-group form-check">
              <input
                name="rememberMe"
                type="checkbox"
                className={`form-check-input`}
                id="remember-me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            {formError && (
              <div
                className="alert-dismissible fade show alert alert-danger"
                role="alert"
              >
                {formError}
                {resendEmailView && !wasResendEmailView && (
                  <>
                    {". "}
                    <a href="#" onClick={handleResendEmailVerify}>
                      Resend Letter
                    </a>
                  </>
                )}
              </div>
            )}

            <span className="dont-account mt-0 mb-3">
              Forgot or lost your password?{" "}
              <Link href="/password-reset-send">Reset It Now</Link>
            </span>

            <button type="submit">Login Now</button>
          </form>

          <span className="dont-account">
            Don&apos;t have an account?{" "}
            <a href="#" onClick={moveToRegister}>
              Register Now
            </a>
          </span>
        </div>
      </div>
    </>
  );
};

export default LoginTab;

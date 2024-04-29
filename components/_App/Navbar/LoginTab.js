import React, { useState, useContext, useEffect } from "react";
import Input from "../../FormComponents/Input";
import SocialAuth from "./SocialAuth";
import { validatePassword, validateEmail } from "../../../utils";
import { generateMyEmailVerifyCode, login } from "../../../services";
import { IndiceContext } from "../../../contexts";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

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
  const router = useRouter();

  const [formError, setFormError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [resendEmailView, setRememberMeView] = useState(false);
  const [wasResendEmailView, setWasRememberMeView] = useState(false);

  const { success: mainSuccess, onLogin } = useContext(IndiceContext);

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  useEffect(() => {
    if (!activePopup) {
      setFormError(null);
      setPasswordError(null);
      setEmailError(null);
      setEmail("");
      setPassword("");
    }
  }, [activePopup]);

  const handleResendEmailVerify = async (e) => {
    e.preventDefault();
    setWasRememberMeView(true);
    setRememberMeView(false);

    try {
      const res = await generateMyEmailVerifyCode(email);
      mainSuccess.set(res);
    } catch (e) {
      setFormError(e.message);
    }
  };

  const handleSubmit = async () => {
    setRememberMeView(false);
    setFormError(null);

    let error = false;

    const resPasswordValid = validatePassword(password);
    if (resPasswordValid !== true) {
      error = true;
      setPasswordError(resPasswordValid);
    }

    const resEmailValid = validateEmail(email);
    if (resEmailValid !== true) {
      error = true;
      setEmailError(resEmailValid);
    }

    if (error) return;

    try {
      const res = await login({
        email,
        password,
        rememberMe,
      });

      setUser(res.user);
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
          authToken: res.authToken,
          redirect: false,
        });

        onLogin(res.user);

        setPassword("");

        mainSuccess.set("Successfully logged in");

        if (res.user.needRegularViewInfoForm) {
          router.push("/dashboard/profile-edit");
        }
      }
    } catch (e) {
      setFormError(e.message);

      if (e.message.includes("The mail was not confirmed.")) {
        setRememberMeView(true);
      }
    }
  };

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

          <form>
            <Input
              name="email"
              type="text"
              value={email}
              placeholder="Email"
              error={emailError}
              onInput={handleInputEmail}
            />

            <Input
              name="password"
              type="password"
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

            <button type="button" onClick={handleSubmit}>
              Login Now
            </button>
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

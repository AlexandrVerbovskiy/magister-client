import React, { useState, useContext } from "react";
import Input from "../../FormComponents/Input";
import SocialAuth from "./SocialAuth";
import { validatePassword, validateEmail } from "../../../utils";
import { login } from "../../../services";
import { IndiceContext } from "../../../contexts";
import Link from "next/link";

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
}) => {
  const [formError, setFormError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const { onLogin, success: mainSuccess } = useContext(IndiceContext);

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handleSubmit = async () => {
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
        onLogin(res.user);
        mainSuccess.set("Successfully logged in");
      }
    } catch (e) {
      setFormError(e.message);
      setPassword("");
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
              type="text"
              value={email}
              placeholder="Email"
              error={emailError}
              onInput={handleInputEmail}
            />

            <Input
              type="password"
              value={password}
              placeholder="Password"
              error={passwordError}
              onInput={handleInputPassword}
            />

            {formError && (
              <div
                className="alert-dismissible fade show alert alert-danger"
                role="alert"
              >
                {formError}
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

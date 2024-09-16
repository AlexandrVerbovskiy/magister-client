import { useContext, useState } from "react";
import { validatePassword, validateEmail } from "../utils";
import { generateMyEmailVerifyCode, login } from "../services";
import { IndiceContext } from "../contexts";

const useLogin = ({
  onLoginPartSuccess = null,
  setUser,
  setEmail,
  setPassword,
  email,
  password,
  rememberMe,
}) => {
  const [formError, setFormError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [resendEmailView, setRememberMeView] = useState(false);
  const [wasResendEmailView, setWasRememberMeView] = useState(false);

  const { success: mainSuccess } = useContext(IndiceContext);

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
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

      onLoginPartSuccess(res);
    } catch (e) {
      setFormError(e.message);

      if (e.message.includes("The mail was not confirmed.")) {
        setRememberMeView(true);
      }
    }
  };

  return {
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
    handleLogin,
    handleResendEmailVerify,
  };
};

export default useLogin;

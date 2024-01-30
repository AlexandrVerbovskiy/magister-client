import React, { useState, useContext } from "react";
import Input from "../../FormComponents/Input";
import SocialAuth from "./SocialAuth";
import { validatePassword, validateEmail } from "../../../utils";
import { login } from "../../../services";
import { IndiceContext } from "../../../contexts";

const LoginTab = ({ moveToRegister, closeModal }) => {
  const [formError, setFormError] = useState(null);
  const [email, setEmail] = useState({ value: "", error: null });
  const [password, setPassword] = useState({
    value: "",
    error: null,
  });

  const { onLogin, success: mainSuccess } = useContext(IndiceContext);

  const handleInputEmail = (e) =>
    setEmail({ value: e.target.value, error: null });
  const handleInputPassword = (e) =>
    setPassword({ value: e.target.value, error: null });

  const handleSubmit = async () => {
    setFormError(null);

    let error = false;

    if (!validatePassword(password.value)) {
      setPassword((prev) => ({
        ...prev,
        error: "The password must be longer than 8 characters",
      }));
      error = true;
    }

    if (!validateEmail(email.value)) {
      error = true;
      setEmail((prev) => ({
        ...prev,
        error: "Incorrect email format",
      }));
    }

    if (error) return;

    try {
      const user = await login({
        email: email.value,
        password: password.value,
      });

      onLogin(user);
      closeModal();
      mainSuccess.set("Successfully logged in");
    } catch (e) {
      setFormError(e.message);
    }
  };

  return (
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
            value={email.value}
            placeholder="Email"
            error={email.error}
            onInput={handleInputEmail}
          />

          <Input
            type="password"
            value={password.value}
            placeholder="Password"
            error={password.error}
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
  );
};

export default LoginTab;

import React, { useState, useContext } from "react";
import Input from "../../FormComponents/Input";
import SocialAuth from "./SocialAuth";
import { validatePassword, validateEmail } from "../../../utils";
import { register } from "../../../services";
import { IndiceContext } from "../../../contexts";

const RegisterTab = ({ moveToLogin, closeModal }) => {
  const [formError, setFormError] = useState(null);
  const [name, setName] = useState({ value: "", error: null });
  const [email, setEmail] = useState({
    value: "",
    error: null,
  });
  const [password, setPassword] = useState({
    value: "",
    error: null,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: null,
  });
  const [acceptedTermCondition, setAcceptedTermCondition] = useState({
    value: false,
    error: null,
  });

  const handleInputName = (e) =>
    setName({ value: e.target.value, error: null });
  const handleInputEmail = (e) =>
    setEmail({ value: e.target.value, error: null });
  const handleInputPassword = (e) =>
    setPassword({ value: e.target.value, error: null });
  const handleInputConfirmPassword = (e) =>
    setConfirmPassword({ value: e.target.value, error: null });
  const handleInputAcceptedTermsCondition = (e) =>
    setAcceptedTermCondition({ value: e.target.checked, error: null });

  const { success: mainSuccess } = useContext(IndiceContext);

  const handleSubmit = async () => {
    setFormError(null);

    let error = false;

    if (!validatePassword(password.value)) {
      error = true;
      setPassword((prev) => ({
        ...prev,
        error: "The password must be longer than 8 characters",
      }));
    }

    if (!validatePassword(confirmPassword.value)) {
      error = true;
      setConfirmPassword((prev) => ({
        ...prev,
        error: "The password must be longer than 8 characters",
      }));
    }

    if (password.value != confirmPassword.value) {
      error = true;
      setConfirmPassword((prev) => ({
        ...prev,
        error: "Passwords do not match",
      }));
    }

    if (!validateEmail(email.value)) {
      error = true;
      setEmail((prev) => ({
        ...prev,
        error: "Incorrect email format",
      }));
    }

    if (!name.value) {
      error = true;
      setName((prev) => ({
        ...prev,
        error: "Name is required field",
      }));
    }

    if (!acceptedTermCondition.value) {
      error = true;
      setAcceptedTermCondition((prev) => ({
        ...prev,
        error:
          "You need to accept the site's terms of use if you want to work on it",
      }));
    }

    if (error) return;

    try {
      const message = await register({
        password: password.value,
        name: name.value,
        email: email.value,
        acceptedTermCondition: acceptedTermCondition.value,
      });

      mainSuccess.set(message);

      moveToLogin();
    } catch (e) {
      setFormError(e.message);
    }
  };

  return (
    <div className="tab-pane" id="register">
      <div className="miran-register">
        <div className="register-with-account">
          <span>Register with</span>
          <SocialAuth />
        </div>

        <span className="sub-title">
          <span>Or Register with</span>
        </span>

        <form>
          <div className="row">
            <div className="col-12">
              <Input
                type="text"
                value={name.value}
                placeholder="Username"
                error={name.error}
                onInput={handleInputName}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Input
                type="email"
                value={email.value}
                placeholder="Email"
                error={email.error}
                onInput={handleInputEmail}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <Input
                type="password"
                value={password.value}
                placeholder="Password"
                error={password.error}
                onInput={handleInputPassword}
              />
            </div>

            <div className="col-6">
              <Input
                type="password"
                value={confirmPassword.value}
                placeholder="Confirm Password"
                error={confirmPassword.error}
                onInput={handleInputConfirmPassword}
              />
            </div>
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              className={`form-check-input${
                acceptedTermCondition.error ? " is-invalid" : ""
              }`}
              id="confirm-terms-conditions"
              checked={acceptedTermCondition.value}
              onChange={handleInputAcceptedTermsCondition}
            />
            <label
              className="form-check-label"
              htmlFor="confirm-terms-conditions"
            >
              Create an account?
            </label>
            {acceptedTermCondition.error && (
              <div className="invalid-feedback">
                {acceptedTermCondition.error}
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

          <button type="button" onClick={handleSubmit}>
            Register Now
          </button>
        </form>

        <span className="already-account">
          Already have an account?{" "}
          <a href="#" onClick={moveToLogin}>
            Login Now
          </a>
        </span>
      </div>
    </div>
  );
};

export default RegisterTab;

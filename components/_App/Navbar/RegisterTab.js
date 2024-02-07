import React, { useState, useContext } from "react";
import Input from "../../FormComponents/Input";
import SocialAuth from "./SocialAuth";
import { validatePassword, validateEmail } from "../../../utils";
import { register } from "../../../services";
import { IndiceContext } from "../../../contexts";

const RegisterTab = ({ moveToLogin, closeModal }) => {
  const [formError, setFormError] = useState(null);
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

  const { success: mainSuccess } = useContext(IndiceContext);

  const handleSubmit = async () => {
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

    const resEmailValid = validateEmail(email);
    if (resEmailValid !== true) {
      error = true;
      setEmailError(resEmailValid);
    }

    if (!name) {
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
      const message = await register({
        password,
        name,
        email,
        acceptedTermCondition,
      });

      mainSuccess.set(message);
      moveToLogin();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setPassword("");
      setConfirmPassword("");
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
                value={name}
                placeholder="Username"
                error={nameError}
                onInput={handleInputName}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Input
                type="email"
                value={email}
                placeholder="Email"
                error={emailError}
                onInput={handleInputEmail}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <Input
                type="password"
                value={password}
                placeholder="Password"
                error={passwordError}
                onInput={handleInputPassword}
              />
            </div>

            <div className="col-6">
              <Input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                error={confirmPasswordError}
                onInput={handleInputConfirmPassword}
              />
            </div>
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              className={`form-check-input${
                acceptedTermConditionError ? " is-invalid" : ""
              }`}
              id="confirm-terms-conditions"
              checked={acceptedTermCondition}
              onChange={handleInputAcceptedTermsCondition}
            />
            <label
              className="form-check-label"
              htmlFor="confirm-terms-conditions"
            >
              Create an account?
            </label>
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

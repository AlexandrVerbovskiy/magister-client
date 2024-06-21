import { useState } from "react";
import ErrorSpan from "../ErrorSpan";

const PasswordInput = ({
  name = null,
  value,
  placeholder = "Enter your password",
  error,
  onInput,
  inputClassName = "form-control",
  label = null,
}) => {
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  const handleChangePasswordFieldType = () => {
    const newType = passwordFieldType == "password" ? "text" : "password";
    setPasswordFieldType(newType);
  };

  return (
    <div className="form-group password-input-parent">
      {label && <label>{label}</label>}

      <input
        type={passwordFieldType}
        className={`${inputClassName}${error ? " is-invalid" : ""}`}
        placeholder={placeholder}
        name={name}
        value={value}
        onInput={onInput}
        required
      />
      <i
        className={`bx ${
          passwordFieldType == "password" ? "bx-lock" : "bx-lock-open"
        } cursor-pointer`}
        onClick={handleChangePasswordFieldType}
      ></i>

      <ErrorSpan error={error} />
    </div>
  );
};

export default PasswordInput;

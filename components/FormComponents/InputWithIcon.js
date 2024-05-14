import ErrorIconWrapper from "./ErrorIconWrapper";

const InputWithIcon = ({
  placeholder,
  value,
  onInput,
  label = null,
  icon = null,
  error = null,
  type = "text",
  style = {},
  name = null,
  maxLength = null,
  max = null,
  minLength = null,
  min = null,
  dopInputClass = "",
  dopGroupClass = "",
}) => (
  <ErrorIconWrapper
    dopGroupClass={dopGroupClass}
    label={label}
    icon={icon}
    error={error}
  >
    <input
      value={value}
      onInput={onInput}
      type={type}
      className={`form-control ${error ? "is-invalid" : ""}`}
      placeholder={placeholder}
      style={style}
      name={name}
      maxLength={maxLength}
      max={max}
      minLength={minLength}
      min={min}
    />
  </ErrorIconWrapper>
);

export default InputWithIcon;

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
}) => (
  <ErrorIconWrapper label={label} icon={icon} error={error}>
    <input
      value={value}
      onInput={onInput}
      type={type}
      className={`form-control ${error ? "is-invalid" : ""}`}
      placeholder={placeholder}
      style={style}
    />
  </ErrorIconWrapper>
);

export default InputWithIcon;

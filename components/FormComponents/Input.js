import ErrorSpan from "../ErrorSpan";

const Input = ({
  type = "text",
  name = null,
  value,
  placeholder,
  error,
  onInput,
  inputClassName = "form-control",
  Icon = null,
}) => (
  <div className="form-group">
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className={`${inputClassName}${error ? " is-invalid" : ""}`}
      value={value}
      onInput={onInput}
    />
    {Icon && <Icon />}

    <ErrorSpan error={error} />
  </div>
);

export default Input;

import ErrorIconWrapper from "./ErrorIconWrapper";

const TextareaWithIcon = ({
  placeholder,
  value,
  onChange,
  label = null,
  icon = null,
  error = null,
  rows = 7,
  style = {},
}) => (
    <ErrorIconWrapper label={label} icon={icon} error={error}>
      <textarea
        rows={rows}
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
    </ErrorIconWrapper>
  );

export default TextareaWithIcon;

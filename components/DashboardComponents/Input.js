import ErrorSpan from "../ErrorSpan";

const Input = ({
  label = null,
  value,
  type = "text",
  setValue,
  error = null,
  placeholder = "",
  setError = () => {},
  children,
}) => {
  const handleInput = (e) => {
    setError(null);
    setValue(e.target.value);
  };

  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        className="form-control"
        value={value}
        onInput={handleInput}
        placeholder={placeholder}
      />

      <ErrorSpan error={error} className="d-block mt-0 position-absolute" />

      {children}
    </div>
  );
};

export default Input;

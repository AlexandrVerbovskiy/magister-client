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
  name = null,
  viewValue = null,
}) => {
  const handleInput = (e) => {
    setError(null);
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    setError(null);
    setValue(e);
  };

  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      {viewValue !== null && (
        <input
          type={type}
          className="form-control"
          name={name + "-view"}
          value={viewValue}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onInput={() => {}}
        />
      )}

      {viewValue === null && (
        <input
          type={type}
          className="form-control"
          name={name}
          value={value}
          onInput={handleInput}
          placeholder={placeholder}
        />
      )}

      <ErrorSpan error={error} className="d-block mt-0 position-absolute" />

      {children}
    </div>
  );
};

export default Input;

const Input = ({
  label = null,
  value,
  type = "text",
  setValue,
  error = null,
  placeholder = "",
  setError = () => {},
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
      {error && (
        <div className="invalid-feedback d-block mt-0 position-absolute">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;

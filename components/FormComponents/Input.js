const Input = ({ type = "text", value, placeholder, error, onInput }) => (
  <div className="form-group">
    <input
      type={type}
      placeholder={placeholder}
      className={`form-control${error ? " is-invalid" : ""}`}
      value={value}
      onInput={onInput}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default Input;

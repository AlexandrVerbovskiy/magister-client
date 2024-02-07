const Textarea = ({
  label = null,
  value,
  rows = "6",
  cols = "30",
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
      <textarea
        cols={cols}
        rows={rows}
        placeholder={placeholder}
        className="form-control"
        value={value}
        onInput={handleInput}
      ></textarea>
      {error && (
        <div className="invalid-feedback d-block mt-0 position-absolute">
          {error}
        </div>
      )}
    </div>
  );
};

export default Textarea;

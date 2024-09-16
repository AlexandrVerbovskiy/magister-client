import ErrorSpan from "../ErrorSpan";

const Textarea = ({
  label = null,
  value,
  rows = "6",
  cols = "30",
  setValue,
  error = null,
  placeholder = "",
  setError = () => {},
  name = null,
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
        name={name}
      ></textarea>

      <ErrorSpan error={error} className="d-block mt-0 position-absolute" />
    </div>
  );
};

export default Textarea;

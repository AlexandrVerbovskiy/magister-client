import ErrorSpan from "../ErrorSpan";

const Input = ({
  label = null,
  value,
  type = "text",
  setValue,
  error = null,
  placeholder = "",
  setError = () => {},
  labelClassName = "sr-only",
}) => {
  const handleInput = (e) => {
    setValue(e.target.value);
    setError(null);
  };

  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <input
        className="form-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onInput={handleInput}
      />
      <ErrorSpan error={error} />
    </>
  );
};

export default Input;

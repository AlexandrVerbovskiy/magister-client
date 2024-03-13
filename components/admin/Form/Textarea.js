import ErrorSpan from "../ErrorSpan";

const Textarea = ({
  label = null,
  value,
  setValue,
  error = null,
  placeholder = "",
  setError = () => {},
  rows = "6",
  labelClassName = "sr-only",
  name = null,
}) => {
  const handleInput = (e) => {
    setValue(e.target.value);
    setError(null);
  };

  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <textarea
        rows={rows}
        className="form-input w-full"
        value={value}
        placeholder={placeholder}
        onInput={handleInput}
        name={name}
      />
      <ErrorSpan error={error} />
    </>
  );
};

export default Textarea;

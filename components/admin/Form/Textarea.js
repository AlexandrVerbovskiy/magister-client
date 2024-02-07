const Textarea = ({
  label = null,
  value,
  type = "text",
  setValue,
  error = null,
  placeholder = "",
  setError = () => {},
  rows = "6",
  labelClassName = "sr-only",
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
        type={type}
        value={value}
        placeholder={placeholder}
        onInput={handleInput}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </>
  );
};

export default Textarea;

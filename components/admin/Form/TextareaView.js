const TextareaView = ({
  label = null,
  value,
  placeholder = "",
  rows = "6",
  labelClassName = "sr-only",
  name = null,
}) => {
  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <textarea
        style={{ resize: "none" }}
        rows={rows}
        className="form-input w-full"
        value={value}
        placeholder={placeholder}
        readOnly={true}
        name={name}
      />
    </>
  );
};

export default TextareaView;

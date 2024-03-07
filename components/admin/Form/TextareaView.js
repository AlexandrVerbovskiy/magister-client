const TextareaView = ({
  label = null,
  value,
  placeholder = "",
  rows = "6",
  labelClassName = "sr-only",
}) => {
  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <textarea
        rows={rows}
        className="form-input w-full"
        value={value}
        placeholder={placeholder}
        readOnly={true}
      />
    </>
  );
};

export default TextareaView;

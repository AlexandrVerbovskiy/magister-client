const InputView = ({
  label = null,
  value,
  type = "text",
  placeholder = "",
  labelClassName = "sr-only",
  inputClassName = "form-input",
}) => {
  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <input
        className={inputClassName}
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={true}
      />
    </>
  );
};

export default InputView;

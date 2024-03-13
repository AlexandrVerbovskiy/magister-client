const InputView = ({
  label = null,
  value,
  type = "text",
  placeholder = "",
  labelClassName = "sr-only",
  inputClassName = "form-input",
  name = null,
}) => {
  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <input
        name={name}
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

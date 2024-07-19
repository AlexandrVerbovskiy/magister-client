const InputView = ({
  label = null,
  value,
  type = "text",
  placeholder = "",
  labelClassName = "sr-only",
  inputClassName = "form-input",
  name = null,
  defaultValue = null,
}) => {

  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}
      <input
        name={name}
        className={inputClassName}
        type={type}
        value={value ?? defaultValue ?? "-"}
        placeholder={placeholder}
        readOnly={true}
      />
    </>
  );
};

export default InputView;

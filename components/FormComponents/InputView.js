const InputView = ({ label, value, icon = null, placeholder = "" }) => {
  return (
    <div className="form-group form-group-view form-group-view-input">
      {label && (
        <label>
          {icon && <i className={icon}></i>} {label}
        </label>
      )}
      <div className={`form-control ${value.length > 0 ? "" : "view-placeholder"}`}>
        <div>{value.length > 0 ? value.length : placeholder}</div>
      </div>
    </div>
  );
};

export default InputView;

const InputView = ({ label, value, icon = null, placeholder = "" }) => {
    if(!value){
        value="";
    }

  return (
    <div className="form-group form-group-view form-group-view-input">
      {label && (
        <label>
          {icon && <i className={icon}></i>} {label}
        </label>
      )}
      <div className={`form-control ${value.length > 0 ? "" : "view-placeholder"}`}>
        <div>{value.length > 0 ? value : placeholder}</div>
      </div>
    </div>
  );
};

export default InputView;

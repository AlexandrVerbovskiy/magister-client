const TextareaView = ({
  label,
  value,
  icon = null,
  placeholder = "",
  rows = 3,
}) => {
  return (
    <div className="form-group form-group-view form-group-view-textarea">
      {label && (
        <label>
          {icon && <i className={icon}></i>} {label}
        </label>
      )}
      <div
        className={`form-control ${value.length > 0 ? "" : "view-placeholder"}`}
        style={{ height: `calc(${rows * 1.5}em + 30px)` }}
      >
        {value.length > 0 ? value.length : placeholder}
      </div>
    </div>
  );
};

export default TextareaView;

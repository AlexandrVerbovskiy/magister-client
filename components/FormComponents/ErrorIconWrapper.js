import ErrorSpan from "../ErrorSpan";

const ErrorIconWrapper = ({
  label = null,
  icon = null,
  error = null,
  children,
  dopGroupClass = "",
}) => {
  return (
    <div className={`form-group ${dopGroupClass}`}>
      {label && (
        <label>
          {icon && <i className={icon}></i>} {label}
        </label>
      )}
      {children}
      <ErrorSpan error={error} />
    </div>
  );
};

export default ErrorIconWrapper;

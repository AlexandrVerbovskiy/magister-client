const ErrorBlockMessage = ({ children, dopClassName="" }) => {
  return (
    <div
      className={`alert-dismissible fade show alert alert-danger ${dopClassName}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default ErrorBlockMessage;

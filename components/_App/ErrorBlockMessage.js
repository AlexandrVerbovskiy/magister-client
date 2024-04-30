const ErrorBlockMessage = ({ children }) => {
  return (
    <div
      className="alert-dismissible fade show alert alert-danger"
      role="alert"
    >
      {children}
    </div>
  );
};

export default ErrorBlockMessage;

import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const MainErrorAlert = ({ statusCode }) => {
  const { error } = useContext(IndiceContext);

  if (!error.value || statusCode) return;

  return (
    <div
      className="main-site-alert alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {error.value}
      <button
        type="button"
        className="btn-close"
        datadismiss="alert"
        onClick={error.clear}
      ></button>
    </div>
  );
};

export default MainErrorAlert;

import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const MainSuccessAlert = ({ statusCode }) => {
  const { success } = useContext(IndiceContext);

  if (!success.value || statusCode) return;

  return (
    <div
      className="main-site-alert alert alert-success alert-dismissible fade show"
      role="alert"
    >
      {success.value}
      <button
        type="button"
        className="btn-close"
        datadismiss="alert"
        onClick={success.clear}
      ></button>
    </div>
  );
};

export default MainSuccessAlert;

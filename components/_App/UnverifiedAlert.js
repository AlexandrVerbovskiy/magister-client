import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const UnverifiedAlert = () => {
  const { user } = useContext(IndiceContext);

  //if (!user || user.active) return;
  return;

  return (
    <div
      className="message-site-alert alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <div className="title">Not a verified user</div>
      <div>
        You need to be verified to rent and rent tools. To verify, send the
        necessary data via the <a href="#">page</a>
      </div>
    </div>
  );
};

export default UnverifiedAlert;

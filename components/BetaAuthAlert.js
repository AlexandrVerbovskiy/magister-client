import { useContext } from "react";
import { IndiceContext } from "../contexts";
import { activateRegisterPopup } from "../utils";

const BetaAuthAlert = () => {
  const { sessionUser } = useContext(IndiceContext);

  if (sessionUser) {
    return <></>;
  }

  const handleClick = (e) => {
    e.preventDefault();
    activateRegisterPopup();
  };

  return (
    <div
      className={`beta-auth-alert notification-alert alert alert-dismissible fade show`}
      role="alert"
    >
      <strong>We are currently in beta testing. </strong>To join the waiting
      list for our test, please register on our platform.
      <div>
        <a href="#" className="default-btn" onClick={handleClick}>
          Join Waiting List
        </a>
      </div>
    </div>
  );
};

export default BetaAuthAlert;

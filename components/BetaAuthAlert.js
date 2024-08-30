import Link from "next/link";
import { useContext } from "react";
import { IndiceContext } from "../contexts";
import { activateAuthPopup } from "../utils";

const BetaAuthAlert = () => {
  const { sessionUser } = useContext(IndiceContext);

  if (sessionUser) {
    return <></>;
  }

  return (
    <div
      className={`beta-auth-alert notification-alert alert alert-dismissible fade show`}
      role="alert"
    >
      <strong>We are currently in beta testing. </strong>To join the waiting
      list for our test, please register on our platform.
      <div>
        <Link href="#" className="default-btn" onClick={activateAuthPopup}>
          Join Waiting List
        </Link>
      </div>
    </div>
  );
};

export default BetaAuthAlert;

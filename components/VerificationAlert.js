import Link from "next/link";
import { useContext } from "react";
import { IndiceContext } from "../contexts";

const VerificationAlert = ({ className = "verification-alert-dashboard" }) => {
  const { sessionUser } = useContext(IndiceContext);

  if (!sessionUser || sessionUser?.verified) {
    return <></>;
  }

  return (
    <div
      className={`verification-alert ${className} notification-alert alert alert-dismissible fade show`}
      role="alert"
    >
      <strong>Pending: </strong>You need to confirm your identity.
      <div>
        <Link href="/dashboard/documents-verification" className="default-btn">
          Confirm identity{" "}
          <i
            className="bx bx-arrow-back"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </Link>
      </div>
    </div>
  );
};

export default VerificationAlert;

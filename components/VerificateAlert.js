import Link from "next/link";
import { useContext } from "react";
import { IndiceContext } from "../contexts";

const VerificateAlert = () => {
  const { sessionUser } = useContext(IndiceContext);

  if (sessionUser.verified) {
    return <></>;
  }

  return (
    <div
      className="verification-alert notification-alert alert alert-dismissible fade show"
      role="alert"
    >
      <strong>Pending: </strong>You need to confirm your identity.
      <Link
        href="/dashboard/documents-verification"
        type="button"
        className="default-btn"
      >
        Confirm identity{" "}
        <i
          className="bx bx-arrow-back"
          style={{ transform: "rotate(180deg)" }}
        ></i>
      </Link>
    </div>
  );
};

export default VerificateAlert;

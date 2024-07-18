import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";
import Link from "next/link";

const UnverifiedAlert = ({ statusCode }) => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();

  if (
    statusCode ||
    !sessionUser ||
    sessionUser.verified ||
    router.asPath.includes("/dashboard/") ||
    router.asPath.includes("/admin/")
  )
    return;

  return (
    <div
      className="message-site-alert alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <div className="title">Not a verified user</div>
      <div>
        You must be verified to conduct transactions with funds on the platform.
        To verify, send the necessary data via the{" "}
        <Link href="/dashboard/documents-verification/">
          Documents Verification
        </Link>
      </div>
    </div>
  );
};

export default UnverifiedAlert;

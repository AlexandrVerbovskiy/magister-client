import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";

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
        You need to be verified to rent and rent tools. To verify, send the
        necessary data via the{" "}
        <a href="/dashboard/documents-verification">page</a>
      </div>
    </div>
  );
};

export default UnverifiedAlert;

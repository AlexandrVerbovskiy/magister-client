import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";

const UnverifiedAlert = () => {
  const { user } = useContext(IndiceContext);
  const router = useRouter();

  if (!user || user.verified || router.asPath.includes("/settings/")) return;

  return (
    <div
      className="message-site-alert alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <div className="title">Not a verified user</div>
      <div>
        You need to be verified to rent and rent tools. To verify, send the
        necessary data via the <a href="/settings/documents-verification">page</a>
      </div>
    </div>
  );
};

export default UnverifiedAlert;

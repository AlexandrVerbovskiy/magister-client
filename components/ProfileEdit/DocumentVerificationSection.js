import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import Link from "next/link";

const DocumentVerificationSection = ({ verifiedInfo }) => {
  const { sessionUser } = useContext(IndiceContext);

  let verifiedText = "Profile verified";
  let verifyIconClass = "bx bx-check-circle icon-success";

  if (!sessionUser?.verified) {
    if (verifiedInfo?.id && !verifiedInfo?.hasResponse) {
      verifiedText = "Verification in progress";
      verifyIconClass = "bx bx-time icon-success";
    } else {
      verifiedText = "Profile not verified";
      verifyIconClass = "bx bx-x-circle icon-danger";
    }
  }

  return (
    <div className="my-profile-box">
      <h3 className="edit-profile-document-section-title">
        {verifiedText} <i className={verifyIconClass}></i>
      </h3>

      <form method="get" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="form-group">
              <Link href="/dashboard/documents-verification/">
                <button type="button">
                  {sessionUser?.verified
                    ? "Update Documents"
                    : "Verify Profile"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentVerificationSection;

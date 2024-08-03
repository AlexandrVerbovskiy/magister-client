import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import Link from "next/link";

const DocumentVerificationSection = () => {
  const { sessionUser } = useContext(IndiceContext);

  return (
    <div className="my-profile-box">
      {sessionUser?.verified ? (
        <h3 className="edit-profile-document-section-title">
          Profile verified <i className="bx bx-check-circle icon-success"></i>
        </h3>
      ) : (
        <h3 className="edit-profile-document-section-title">
          Profile not verified <i className="bx bx-x-circle icon-danger"></i>
        </h3>
      )}

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

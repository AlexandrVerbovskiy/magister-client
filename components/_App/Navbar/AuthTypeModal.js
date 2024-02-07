import BaseModal from "../BaseModal";

const AuthTypeModal = ({
  typeModalActive,
  setTypeModalActive,
  typeModalError,
  handleSelectTypeClick,
}) => {
  return (
    <BaseModal
      active={typeModalActive}
      toggleActive={() => setTypeModalActive(false)}
    >
      <span className="sub-title mb-2">
        <span>Choose where you will receive the code</span>
      </span>
      <form method="get">
        {typeModalError && (
          <div className="col-lg-12 col-md-12">
            <div
              className="alert-dismissible fade show alert alert-danger"
              role="alert"
            >
              {typeModalError}
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="button" onClick={() => handleSelectTypeClick("phone")}>
            Phone
          </button>
          <button type="button" onClick={() => handleSelectTypeClick("email")}>
            Email
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AuthTypeModal;

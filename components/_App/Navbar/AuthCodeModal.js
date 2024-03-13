import BaseModal from "../BaseModal";

const AuthCodeModal = ({
  codeModalActive,
  code,
  handleChangeCode,
  codeModalError,
  handleCheckCode,
  handleClose,
}) => {
  return (
    <BaseModal active={codeModalActive} toggleActive={handleClose}>
      <span className="sub-title mb-2">
        <span>Enter Verified Code</span>
      </span>

      <form method="get">
        <div className="form-group">
          <input
            name="verifyCode"
            value={code}
            onInput={handleChangeCode}
            type="text"
            placeholder="Code"
            className="form-control"
          />
        </div>

        {codeModalError && (
          <div className="col-lg-12 col-md-12">
            <div
              className="alert-dismissible fade show alert alert-danger"
              role="alert"
            >
              {codeModalError}
            </div>
          </div>
        )}

        <button type="button" onClick={handleCheckCode}>
          Verify
        </button>
      </form>
    </BaseModal>
  );
};

export default AuthCodeModal;

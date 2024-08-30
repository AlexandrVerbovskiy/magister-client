import BaseModal from "../BaseModal";

const AuthCodeModal = ({
  codeModalActive,
  code,
  handleChangeCode,
  codeModalError,
  handleCheckCode,
  handleClose,
  type,
}) => {
  return (
    <BaseModal active={codeModalActive} closeModal={handleClose}>
      <span className="sub-title mb-0">
        <span>Enter Verified Code</span>
      </span>

      <form className="mt-0" method="get" onSubmit={(e) => e.preventDefault()}>
        <span className="small-text">
          You received a verification code on your{" "}
          {type == "email" ? "email" : "mobile phone"}. Copy and paste it in the
          field below
        </span>
        <div className="form-group mt-2">
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
          <div className="col-12">
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

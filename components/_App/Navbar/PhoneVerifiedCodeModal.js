import BaseModal from "../BaseModal";

const PhoneVerifiedCodeModal = ({
  activeModal,
  closeModal,
  code,
  handleInputCode,
  verifyFormError,
  handleVerifyCode,
}) => {
  return (
    <BaseModal active={activeModal} closeModal={closeModal}>
      <span className="sub-title mb-0">
        <span>Enter Verified Code</span>
      </span>

      <form className="mt-0" method="get">
        <span className="small-text">
          You received a verification code on your mobile phone. Copy and paste
          it in the field below
        </span>
        <div className="form-group mt-2">
          <input
            value={code}
            onInput={handleInputCode}
            type="text"
            placeholder="Code"
            name="phoneCode"
            className="form-control"
          />
        </div>
        {verifyFormError && (
          <div className="col-12">
            <div
              className="alert-dismissible fade show alert alert-danger"
              role="alert"
            >
              {verifyFormError}
            </div>
          </div>
        )}
        <button type="button" onClick={handleVerifyCode}>
          Verify
        </button>
      </form>
    </BaseModal>
  );
};

export default PhoneVerifiedCodeModal;

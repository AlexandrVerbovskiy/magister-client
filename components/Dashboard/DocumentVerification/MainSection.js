const MainSection = ({ goNext, error, disabled, active }) => {
  if (!active) {
    return <></>;
  }

  return (
    <div className="main-section d-flex justify-content-center flex-column align-items-center">
      <h1>Facial verification</h1>
      <div className="sub-title">
        We will use facial recognition to confirm that this account belongs to
        you.
      </div>

      <img src="/images/svg/profile-validation.svg" />

      <button
        type="button"
        className="d-flex align-items-center justify-content-center"
        onClick={goNext}
        disabled={disabled}
      >
        Continue <i className="ms-2 flaticon-right-arrow"> </i>
      </button>

      {error ? (
        <div className="error-block mt-2">{error}</div>
      ) : (
        <div style={{ height: "22.5px" }}></div>
      )}
    </div>
  );
};

export default MainSection;

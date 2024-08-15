const FinishedSection = ({ active, goNext }) => {
  if (!active) {
    return <></>;
  }

  return (
    <div className="row justify-content-center finished-section">
      <div className="col col-12 col-md-6">
        <div className="d-flex flex-column align-items-center">
          <div className="sub-title text-center">
            Your profile is currently being verified. This may take up to 24 hours. <br />
            Thank you for your patience
          </div>

          <button
            type="button"
            className="d-flex align-items-center justify-content-center mt-6"
            onClick={goNext}
          >
            Go to My Profile{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishedSection;

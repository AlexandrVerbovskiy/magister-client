import { useListingListClick } from "../../hooks";

const UnlockAccess = () => {
  const { handleClick: handleStartEarningClick } = useListingListClick();

  return (
    <section className="category-area pt-100 pb-100 bg-f9f9f9">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-12">
            <div className="d-flex flex-column justify-content-between h-100">
              <h2 className="mb-4">Unlock Access</h2>

              <div>
                <div>
                  <h4 className="mb-2">Save money and reduce waste!</h4>
                  <p className="mb-4">
                    Get access to almost anything! Why buy stuff you'll only use
                    occasionally when you can rent it for a fraction of the
                    cost?
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="base-main-button"
                  onClick={handleStartEarningClick}
                >
                  Access now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnlockAccess;

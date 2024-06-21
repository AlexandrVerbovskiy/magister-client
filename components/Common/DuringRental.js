import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";

const DuringRental = () => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();

  const handleStartEarningClick = () => {
    if (sessionUser) {
      router.push("/listing-list");
    } else {
      activateAuthPopup();
    }
  };

  return (
    <section className="category-area pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-12 d-flex justify-content-center">
            <img src="/images/left-rental-info.png" />
          </div>
          <div className="col-lg-8 col-md-12 pb-100 pb-lg-0">
            <div className="d-flex flex-column justify-content-between h-100">
              <h2>Start Earning</h2>

              <div>
                <div>
                  <h4 className="mb-0">Share your things, earn cash!</h4>
                  <p className="mb-4">
                    Earn by renting out your stuff locally when you're not using
                    it. Relax with verified renters and an insurance guarantee.
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="base-main-button"
                  onClick={handleStartEarningClick}
                >
                  Start earning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DuringRental;

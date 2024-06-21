import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import { useContext } from "react";

const BeforeTheRental = () => {
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
    <section className="category-area pt-100 pb-100 bg-f9f9f9">
      <div className="container">
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-lg-8 col-md-12 pb-100 pb-lg-0">
            <div className="d-flex flex-column justify-content-between h-100">
              <h2>Unlock Access</h2>

              <div>
                <div>
                  <h4 className="mb-0">Save money and reduce waste!</h4>
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

          <div className="col-lg-4 col-md-12 d-flex justify-content-center">
            <img src="/images/right-rental-info.png" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeTheRental;

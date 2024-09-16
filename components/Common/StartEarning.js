import Link from "next/link";
import { useListingListClick } from "../../hooks";

const StartEarning = () => {
  const { handleClick: handleStartEarningClick } = useListingListClick({
    link: "/dashboard/listings/add",
  });

  return (
    <section className="category-area pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-12 d-flex justify-content-center overflow-hidden">
            <img
              src="/images/left-rental-info.svg"
              style={{ transform: "scale(1.7)" }}
            />
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="d-flex flex-column justify-content-between h-100">
              <h2 className="mb-4">Start Earning</h2>

              <div>
                <div>
                  <h4 className="mb-2">
                    Start earning by renting out your hardly used things
                  </h4>
                  <p className="mb-4">
                    Share your things, earn cash! Earn by renting out your stuff
                    locally when you're not using it. Relax with verified
                    renters and an owners’ guarantee.
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

export default StartEarning;

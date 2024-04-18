import React from "react";

const SafeWithUs = ({ bgColor }) => {
  return (
    <>
      <section className={`how-it-works-area pt-100 pb-70 ${bgColor}`}>
        <div className="container">
          <div className="section-title">
            <h2>You're safe with us</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <a href="#how-it-works-section">
                <div className="single-how-it-works-box">
                  <div className="icon safe-with-us-img">
                    <img src="/images/home/icons-how_it_works.png" />
                  </div>
                  <h3>How it works</h3>
                  <p>
                    Quis ipsum suspendisse ultrices gravida. Risus commodo
                    viverra maecenas accumsan lacus vel facilisis.
                  </p>
                </div>
              </a>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-how-it-works-box">
                <div className="icon safe-with-us-img">
                  <img src="/images/home/icons-user_verification.png" />
                </div>
                <h3>User Verification</h3>
                <p>
                  Quis ipsum suspendisse ultrices gravida. Risus commodo viverra
                  maecenas accumsan lacus vel facilisis.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-how-it-works-box">
                <div className="icon safe-with-us-img">
                  <img src="/images/home/icons-insurance_guarantee.png" />
                </div>
                <h3>Insurance Guarantee</h3>
                <p>
                  Quis ipsum suspendisse ultrices gravida. Risus commodo viverra
                  maecenas accumsan lacus vel facilisis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SafeWithUs;

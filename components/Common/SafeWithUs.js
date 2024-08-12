import Link from "next/link";
import React from "react";

const SafeWithUs = ({ bgColor = "" }) => {
  return (
    <>
      <section className={`how-it-works-area ptb-100 ${bgColor}`}>
        <div className="container">
          <div className="section-title">
            <h2>You're safe with us</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <a href="#how-it-works-section">
                <div className="single-how-it-works-box">
                  <div className="icon safe-with-us-img">
                    <img src="/images/home/icons-how_it_works.png" />
                  </div>
                  <h3>How it works</h3>
                  <p>Search Item, book, collect and exchange</p>
                </div>
              </a>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-how-it-works-box">
                <div className="icon safe-with-us-img">
                  <img src="/images/home/icons-user_verification.png" />
                </div>
                <h3>User Verification</h3>
                <p>RentAbout verifies all users prior to rental.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="single-how-it-works-box">
                <div className="icon safe-with-us-img">
                  <img src="/images/home/icons-insurance_guarantee.png" />
                </div>
                <h3>RentAbout Has an Owner Guarantee</h3>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <Link href="/how-it-works" className="base-main-button">
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default SafeWithUs;

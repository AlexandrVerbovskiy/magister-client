import React, { useCallback, useContext } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";
import { activateAuthPopup } from "../../utils";

const YourBusiness = () => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();

  const items = [
    {
      id: 1,
      title: `Unlock value. Earn a passive income.`,
      image: "/images/home/icons-how_it_works.png",
    },
    {
      id: 2,
      title: `Reduce waste. Live sustainably.`,
      image: "/images/home/icons-sustainability.png",
    },
    {
      id: 3,
      title: `Open access. Access on demand.`,
      image: "/images/home/icons-on_demand.png",
    },
  ];

  const handleStartEarningClick = () => {
    if (sessionUser) {
      router.push("/listing-list");
    } else {
      activateAuthPopup();
    }
  };

  return (
    <>
      <section className="features-area ptb-100">
        <div className="container">
          <div className="row justify-content-center">
            {items.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-6 d-flex">
                <div className="single-features-box">
                  <div className="icon small-icon-image">
                    <img src={item.image} />
                  </div>
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="row justify-content-center">
            <button
              type="button"
              className="base-main-button"
              onClick={handleStartEarningClick}
            >
              Start earning
            </button>
          </div>
        </div>

        <div className="divider"></div>
      </section>
    </>
  );
};

export default YourBusiness;

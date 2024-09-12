import Link from "next/link";
import React from "react";
import { useListingListClick } from "../../hooks";

const YourBusiness = () => {
  /*const items = [
    {
      id: 1,
      title: `Unlock value. Start earning.`,
      image: "/images/home/icons-value.png",
    },
    {
      id: 2,
      title: `Reduce waste. Live sustainably.`,
      image: "/images/home/icons-sustainability.png",
    },
    {
      id: 3,
      title: `Open access. Access on demand.`,
      image: "/images/home/icons-how_it_works-2_contact.png",
    },
  ];*/
  const { handleClick: handleStartEarningClick } = useListingListClick({
    link: "/dashboard/listings/add",
  });

  const items = [
    {
      id: 1,
      title: `List your stuff`,
      image: "/images/home/icons-sustainability.png",
    },
    {
      id: 2,
      title: `Buy from other buyers`,
      image: "/images/home/icons-how_it_works-2_contact.png",
    },
    {
      id: 3,
      title: `Get paid`,
      image: "/images/home/icons-value.png",
    },
  ];

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

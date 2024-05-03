import React from "react";
import Link from "next/link";

const YourBusiness = () => {
  const items = [
    {
      id: 1,
      title: `Unlock value. Earn a passive income.`,
      image: "/images/home/icons-how_it_works.png",
      link: "/",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 2,
      title: `Reduce waste. Live sustainably.`,
      image: "/images/home/icons-sustainability.png",
      link: "/",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      id: 3,
      title: `Open access. Access on demand.`,
      image: "/images/home/icons-on_demand.png",
      link: "/",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    <>
      <section className="features-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>Your business (Key Brand Messaging)</h2>
          </div>

          <div className="row justify-content-center">
            {items.map((item) => (
              <div
                key={item.id}
                className="col-lg-4 col-md-6 col-sm-6 d-flex"
              >
                <div className="single-features-box">
                  <div className="icon small-icon-image">
                    <img src={item.image} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={item.link} className="link-btn">
                    Get Start Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>
      </section>
    </>
  );
};

export default YourBusiness;

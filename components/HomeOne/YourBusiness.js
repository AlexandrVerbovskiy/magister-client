import React from "react";
import Link from "next/link";

const YourBusiness = () => {
  const items = [
    {
      title: `Unlock value. Earn a passive income.`,
      icon: "flaticon-commerce",
      link: "/",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      title: `Reduce waste. Live sustainably.`,
      icon: "flaticon-project",
      link: "/",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      title: `Open access. Access on demand.`,
      icon: "flaticon-growth",
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
                key={item.icon}
                className="col-lg-4 col-md-6 col-sm-6 d-flex"
              >
                <div className="single-features-box">
                  <div className="icon">
                    <i className={item.icon}></i>
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

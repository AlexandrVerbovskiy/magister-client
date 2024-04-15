import React from "react";
import Link from "next/link";

const Features = () => {
  const items = [
    {
      text: `Unlock value. Earn a passive income.`,
      icon: "flaticon-commerce",
      link: "/",
    },
    {
      text: `Reduce waste. Live sustainably.`,
      icon: "flaticon-project",
      link: "/",
    },
    {
      text: `Open access. Access on demand.`,
      icon: "flaticon-growth",
      link: "/",
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

export default Features;

import React from "react";
import Link from "next/link";

const HowItWorks = () => {
  const items = [
    {
      link: "/",
      icon: "flaticon-commerce",
      text: "Find something nearby Explore nearby items and filter your search by location.",
    },
    {
      icon: "flaticon-project",
      link: "/",
      text: "Request and book Reach out to the owner to borrow their items for the dates you need. Once they confirm, you can secure the items by making a payment.",
    },
    {
      icon: "flaticon-growth",
      link: "/",
      text: "Verify If you haven&#39;t already done so, you&#39;ll be prompted to verify your identity. This ensures a robust rental process. After verification, your rental will be confirmed.",
    },
  ];

  return (
    <>
      <section
        className="features-area ptb-100"
        id="how-it-works-section"
        style={{ background: "#f9f9f9" }}
      >
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
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

        <div className="divider" style={{ background: "white" }}></div>
      </section>
    </>
  );
};

export default HowItWorks;

import React from "react";
import Link from "next/link";

const Features = () => {
  const items = [
    {
      text: `Find something nearby Explore nearby items and filter your
  search by location.`,
      icon: "flaticon-commerce",
      link: "/",
    },
    {
      text: `Request and book Reach out to the owner to borrow their items
      for the dates you need. Once they confirm, you can secure the
      items by making a payment.`,
      icon: "flaticon-project",
      link: "/",
    },
    {
      text: `Verify If you haven't already done so, you'll be
      prompted to verify your identity. This ensures a robust
      rental process. After verification, your rental will be
      confirmed..`,
      icon: "flaticon-growth",
      link: "/",
    },
  ];

  return (
    <>
      <section className="features-area ptb-100">
        <div className="container">
          <div className="section-title">
            <h2>You're safe with us</h2>
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

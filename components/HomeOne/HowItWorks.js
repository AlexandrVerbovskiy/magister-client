import React from "react";
import Link from "next/link";

const HowItWorks = () => {
  const items = [
    {
      id:1,
      link: "/",
      image: "/images/home/icons-how_it_works-1_find.png",
      text: "Find something nearby Explore nearby items and filter your search by location.",
    },
    {
      id:2,
      image: "/images/home/icons-how_it_works-2_contact.png",
      link: "/",
      text: "Request and book Reach out to the owner to borrow their items for the dates you need. Once they confirm, you can secure the items by making a payment.",
    },
    {
      id:3,
      image: "/images/home/icons-how_it_works-3_delivery.png",
      link: "/",
      text: "Verify If you haven't already done so, you'll be prompted to verify your identity. This ensures a robust rental process. After verification, your rental will be confirmed.",
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
                key={item.id}
                className="col-lg-4 col-md-6 col-sm-6 d-flex"
              >
                <div className="single-features-box">
                  <div className="icon small-icon-image">
                    <img src={item.image} />
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

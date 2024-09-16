import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

const Feedback = ({ bgColor = "", bgImage = "" }) => {
  const comments = [
    {
      role: "Developer",
      name: "Alice from Liverpool",
      comment:
        "I was hesitant at first to try out RentAbout, but I needed a power drill for a weekend DIY project. Browsing through the platform was a breeze, and I found a drill just a few streets away! The owner was friendly and flexible with the pick-up time. The drill worked perfectly, and returning it was just as easy. It's such a fantastic way to save money and avoid unnecessary purchases. I'll definitely be using RentAbout again!",
    },
    {
      role: "Developer",
      name: "Tom from Manchester",
      comment:
        "RentAbout has been a game-changer for me. I needed a pressure washer to clean my patio but didn't want to buy one. I found a listing nearby and the whole process from renting to returning was smooth. The only minor issue was that the description wasn't very detailed, but the owner was quick to respond to my questions. This platform is a great way to connect with neighbours and share resources.",
    },
    {
      role: "Developer",
      name: "Sophie from Chester",
      comment:
        "Such a brilliant idea! I rented a lawnmower from RentAbout for my garden. The owner was very helpful and even gave me a few tips on how to use it efficiently. The price was reasonable, and the whole experience felt very community-oriented. It’s fantastic to have a reliable platform to borrow items instead of cluttering my house with things I use once in a blue moon.",
    },
    {
      role: "Developer",
      name: "Jack from Blackpool",
      comment:
        "RentAbout exceeded my expectations. I needed a carpet cleaner and found one just around the corner. The rental process was straightforward, and the item was in great condition. Plus, I got to meet a friendly neighbour. It’s such a sustainable way to use household items. I’ve already recommended it to all my friends and family.",
    },
    {
      role: "Developer",
      name: "Emily from Preston",
      comment:
        "Using RentAbout was convenient for the most part. I rented a set of gardening tools for a weekend project. While the tools were fine and the owner was nice, arranging the pick-up and return times was a bit tricky. Maybe it was just a busy week for both of us. Still, I love the concept and will give it another try with a different item.",
    },
    {
      role: "Developer",
      name: "George from Lancaster",
      comment:
        "I can't believe how easy RentAbout made it to find a steam cleaner when I needed one. The platform is user-friendly, and the rental prices are much cheaper than hiring from a shop. The item was in excellent condition, and the whole process was hassle-free. It’s a great way to save money and reduce waste. I’m hooked!",
    },
    {
      role: "Developer",
      name: "Olivia from Warrington",
      comment:
        "RentAbout is such a clever idea. I needed a sewing machine for a few alterations, and renting one was so much cheaper than buying. The owner was super helpful and even offered a quick tutorial. The only downside was that I had to drive a bit further than I expected, but it was worth it. I love the sense of community it promotes.",
    },
    {
      role: "Developer",
      name: "Henry from Wigan",
      comment:
        "Absolutely love RentAbout! I borrowed a bike for a weekend trip, and the whole experience was fantastic. The platform is easy to use, and I found exactly what I needed nearby. The bike was in top-notch condition, and the owner was really accommodating. It's such a smart way to access things you need without the commitment of buying.",
    },
    {
      role: "Developer",
      name: "Ella from Bolton",
      comment:
        "RentAbout is perfect for someone like me who doesn’t want to buy items for one-off projects. I rented a wallpaper steamer, and it worked like a charm. The owner was great, and the pick-up and drop-off were simple. It’s such a cost-effective and eco-friendly solution. I’m so glad I discovered this platform!",
    },
  ];

  return (
    <>
      <div
        className={`feedback-area${bgImage ? ` ${bgImage}` : ""}${
          bgColor ? ` ${bgColor}` : ""
        } ptb-100`}
      >
        <div className="container">
          <div className="section-title">
            <h2>What users say about us</h2>
          </div>

          <Swiper
            spaceBetween={25}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            modules={[Pagination]}
            className="feedback-slides"
            style={{ height: "100%" }}
          >
            {comments.map((comment) => (
              <SwiperSlide
                className="d-flex flex-column"
                style={{ height: "auto" }}
                key={comment.name}
              >
                <div className="single-feedback-box" style={{ height: "100%" }}>
                  <div className="rating">
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                  </div>
                  <p>{comment.comment}</p>
                  <div className="client-info">
                    <div className="d-flex flex-column">
                      <div className="title">
                        <h3>{comment.name}</h3>
                      </div>
                      <div className="sub-title">{comment.role}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Feedback;

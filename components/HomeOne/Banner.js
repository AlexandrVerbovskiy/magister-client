import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const Banner = () => {
  return (
    <>
      <div className="main-banner-area">
        <div className="container">
          <div className="main-banner-content">
            <div className="banner-flexi">
              <h1 className="banner-one-heading">
                <Swiper
                  autoplay={{
                    delay: 5000,
                    pauseOnMouseEnter: true,
                  }}
                  modules={[Autoplay]}
                >
                  <SwiperSlide>
                    Find Nearby <span className="color-0ec6c6">Hotels</span>
                  </SwiperSlide>

                  <SwiperSlide>
                    Find Nearby <span className="color-0ec6c6">Restaurants</span>
                  </SwiperSlide>

                  <SwiperSlide>
                    Find Nearby <span className="color-0ec6c6">Beauty</span>
                  </SwiperSlide>

                  <SwiperSlide>
                    Find Nearby <span className="color-0ec6c6">Fitness</span>
                  </SwiperSlide>
                  
                  <SwiperSlide>
                    Find Nearby <span className="color-0ec6c6">Shopping</span>
                  </SwiperSlide>
                </Swiper>
              </h1>
            </div>

            <p>Expolore top-rated attractions, activities and more...</p>

            <form>
              <div className="row m-0 align-items-center">
                <div className="col-lg-6 col-md-6 p-0">
                  <div className="form-group">
                    <label>
                      <i className="flaticon-search"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What are you looking for?"
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-md-6 p-0">
                  <div className="form-group">
                    <label>
                      <i className="flaticon-pin"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location"
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-md-12 p-0">
                  <div className="submit-btn">
                    <button type="submit">Search Now</button>
                  </div>
                </div>
              </div>
            </form>

            <ul className="popular-search-list">
              <li>Popular:</li>
              <li>
                <Link href="/grid-listings-with-map">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/grid-listings-with-map">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/grid-listings-with-map">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/grid-listings-with-map">
                  Bank
                </Link>
              </li>
              <li>
                <Link href="/grid-listings-with-map">
                  Fitness
                </Link>
              </li>
              <li>
                <Link href="/grid-listings-with-map">
                  Bookstore
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;

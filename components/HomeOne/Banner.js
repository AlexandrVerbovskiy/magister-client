import React, { useState, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SearchTipsPopup from "../searchTipsPopup";
import useSearchCategory from "../../hooks/useSearchCategory";

const Banner = ({popularCategories}) => {
  const categoryFilterRef = useRef(null);
  const {
    tipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    updateCategoryTips,
  } = useSearchCategory();

  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleChangeCategory = (e) => {
    const newValue = e.target.value;
    updateCategoryTips(newValue);
    setSearchCategory(newValue);
  };

  const handleCategoryTipClick = (value) => {
    categoryFilterRef.current.blur();
    setSearchCategory(value);
    updateCategoryTips(value);
  };

  const handleChangeLocation = (e) => {
    const newLocation = e.target.value;
    setSearchLocation(newLocation);
  };

  /*const popularCategories = [
    "Hotels",
    "Restaurants",
    "Beauty",
    "Fitness",
    "Shopping",
  ];*/
  const backgroundImages = [
    "/images/main-banner-bg1.jpg",
    "/images/main-banner-bg3.jpg",
    "/images/main-banner-bg4.jpg",
    "/images/main-banner-bg5.jpg",
    "/images/main-banner-bg6.jpg",
  ];

  return (
    <div className="main-banner-area">
      <div className="background-image-list">
        <Swiper
          autoplay={{
            delay: 8000,
          }}
          modules={[Autoplay]}
        >
          {backgroundImages.map((img) => (
            <SwiperSlide key={img}>
              <div
                className="background-image"
                style={{ backgroundImage: `url(${img})` }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container">
        <div className="main-banner-content">
          <div className="banner-flexi">
            <h1 className="banner-one-heading">
              <div className="banner-one-heading-fixed">Find Nearby</div>

              <div className="banner-one-heading-scrollable">
                <Swiper
                  direction={"vertical"}
                  autoplay={{
                    delay: 5000,
                    pauseOnMouseEnter: true,
                  }}
                  modules={[Autoplay]}
                >
                  {popularCategories.map((category) => (
                    <SwiperSlide key={category}>
                      <Link
                        href={`/search?filter=${category}`}
                        className="color-0ec6c6"
                      >
                        {category}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
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
                    ref={categoryFilterRef}
                    type="text"
                    className="form-control"
                    placeholder="What are you looking for?"
                    onFocus={openCategoryTipsPopup}
                    onBlur={closeCategoryTipsPopup}
                    value={searchCategory}
                    onInput={handleChangeCategory}
                  />

                  <SearchTipsPopup
                    active={tipsPopupActive}
                    categoryTips={categoryTips}
                    handleCategoryTipClick={handleCategoryTipClick}
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
                    value={searchLocation}
                    onInput={handleChangeLocation}
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

            {popularCategories.map((category) => (
              <li key={category}>
                <Link href="/grid-listings-with-map">{category}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Banner;

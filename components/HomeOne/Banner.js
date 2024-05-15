import React, { useState, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SearchTipsPopup from "../SearchTipsPopup";
import { useCategoryCity } from "../../hooks";
import { getFullListingSearchLink } from "../../utils";
import STATIC from "../../static";

const Banner = ({ popularCategories }) => {
  const {
    handleChangeCity,
    handleCategoryTipClick,
    handleChangeCategory,
    handleCityTipClick,
    searchCategory,
    searchCity,
    categoryTipsPopupActive,
    categoryTips,
    cityTipsPopupActive,
    cityTips,
    openCityTipsPopup,
    closeCityTipsPopup,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    categoryFilterRef,
    cityFilterRef,
  } = useCategoryCity();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      document.querySelector("#filter-search-btn a").click();
    }
  };

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
          loop={true}
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
              <div className="banner-one-heading-scrollable">
                What would you like to rent?
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
                      <span>
                        <Link
                          href={`/listing-list?categories=${category}`}
                          className="color-0ec6c6"
                        >
                          {category}
                        </Link>
                      </span>
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
                    type="text"
                    className="form-control"
                    placeholder="What are you looking for?"
                    name="category"
                    ref={categoryFilterRef}
                    onFocus={() => openCategoryTipsPopup(searchCategory)}
                    onBlur={closeCategoryTipsPopup}
                    value={searchCategory}
                    onInput={handleChangeCategory}
                    maxLength={STATIC.MAX_SEARCH_INPUT_LENGTH}
                    onKeyPress={handleKeyPress}
                  />

                  <SearchTipsPopup
                    active={categoryTipsPopupActive}
                    tips={categoryTips}
                    handleTipClick={handleCategoryTipClick}
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
                    name="city"
                    ref={cityFilterRef}
                    onFocus={() => openCityTipsPopup(searchCity)}
                    onBlur={closeCityTipsPopup}
                    value={searchCity}
                    onInput={handleChangeCity}
                    maxLength={STATIC.MAX_SEARCH_INPUT_LENGTH}
                    onKeyPress={handleKeyPress}
                  />

                  <SearchTipsPopup
                    active={cityTipsPopupActive}
                    tips={cityTips}
                    handleTipClick={handleCityTipClick}
                  />
                </div>
              </div>

              <div className="col-lg-3 col-md-12 p-0">
                <div
                  id="filter-search-btn"
                  className="submit-btn"
                >
                  <Link
                    href={getFullListingSearchLink(searchCity, searchCategory)}
                  >
                    <button type="button">Search Now</button>
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {popularCategories.length && (
            <ul className="popular-search-list">
              <li>Popular:</li>

              {popularCategories.map((category) => (
                <li key={category}>
                  <Link href={`/listing-list?categories=${category}`}>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;

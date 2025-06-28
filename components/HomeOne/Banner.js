import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SearchTipsPopup from "../SearchTipsPopup";
import { useCategoryCity } from "../../hooks";
import { getFullListingSearchLink } from "../../utils";
import STATIC from "../../static";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";

const Banner = () => {
  const router = useRouter();

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
    handleChangeSearchListingName,
    searchListingName,
  } = useCategoryCity();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      document.querySelector("#filter-search-btn a").click();
    }
  };

  const backgroundImages = [
    { src: "/images/main-banner-bg1.jpg", alt: "Banner 1", key: 1 },
    { src: "/images/main-banner-bg6.jpg", alt: "Banner 5", key: 5 },
    { src: "/images/main-banner-bg5.jpg", alt: "Banner 4", key: 4 },
    { src: "/images/main-banner-bg3.jpg", alt: "Banner 2", key: 2 },
    { src: "/images/main-banner-bg4.jpg", alt: "Banner 3", key: 3 },
  ];

  const categories = [
    "Women's Clothing",
    "Men's Clothing",
    "Kids' Clothing",
    "Unisex Clothing",
    "Accessories",
    "Footwear",
  ];

  const { setLoading } = useContext(IndiceContext);
  
  useEffect(() => {
    setLoading(true);

    const img = new Image();
    img.src = backgroundImages[0].src;

    img.onload = () => {
      setLoading(false);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const link = getFullListingSearchLink({
      searchCity,
      searchCategory,
      searchListing: searchListingName,
    });

    router.push(link);
  };

  return (
    <>
      <div className="main-banner-area">
        <div className="background-image-list">
          <Swiper
            loop={true}
            autoplay={{
              delay: 8000,
            }}
            modules={[Autoplay]}
            shortSwipes={false}
            allowTouchMove={false}
          >
            {backgroundImages.map((img) => (
              <SwiperSlide key={img.key}>
                <div
                  className="background-image"
                  style={{
                    backgroundImage: `url(${img.src})`,
                  }}
                />
                <div className="background-image-black"></div>
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
                      delay: 8000,
                    }}
                    loop={true}
                    modules={[Autoplay]}
                    shortSwipes={false}
                    allowTouchMove={false}
                  >
                    {categories.map((category) => (
                      <SwiperSlide key={category}>
                        <span className="color-main">{category}</span>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row m-0 align-items-center">
                <div className="col-lg-4 col-md-12 p-0">
                  <div className="form-group">
                    <label>
                      <i className="flaticon-search"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What are you looking for?"
                      name="listing"
                      value={searchListingName}
                      maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
                      onInput={handleChangeSearchListingName}
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
                      maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
                      onKeyPress={handleKeyPress}
                    />

                    <SearchTipsPopup
                      active={cityTipsPopupActive}
                      tips={cityTips}
                      handleTipClick={handleCityTipClick}
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-md-6 p-0">
                  <div className="form-group">
                    <label>
                      <i className="flaticon-category"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by category"
                      name="category"
                      ref={categoryFilterRef}
                      onFocus={() => openCategoryTipsPopup(searchCategory)}
                      onBlur={closeCategoryTipsPopup}
                      value={searchCategory}
                      onInput={handleChangeCategory}
                      maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
                      onKeyPress={handleKeyPress}
                    />

                    <SearchTipsPopup
                      active={categoryTipsPopupActive}
                      tips={categoryTips}
                      handleTipClick={handleCategoryTipClick}
                    />
                  </div>
                </div>

                <div className="col-lg-2 col-md-12 p-0">
                  <div id="filter-search-btn" className="submit-btn">
                    <button type="submit">Search Now</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;

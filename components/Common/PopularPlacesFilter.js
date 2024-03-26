import React from "react";
import { useCategoryCity } from "../../hooks";
import SearchTipsPopup from "../SearchTipsPopup";
import { getFullListingSearchLink } from "../../utils";
import { useRouter } from "next/router";

const PopularPlacesFilter = ({
  selectedCategories,
  selectedCities,
  categories,
  cities,
}) => {
  let notFoundCategory = "";
  let notFoundCity = "";

  selectedCategories.forEach((selectedCategory) => {
    let countFound = 0;

    categories.forEach((category) => {
      if (category.toLowerCase() === selectedCategory.toLowerCase()) {
        countFound++;
      }
    });

    if (!countFound) {
      notFoundCategory = selectedCategory;
    }
  });

  selectedCities.forEach((selectedCity) => {
    let countFound = 0;

    cities.forEach((city) => {
      if (city.toLowerCase() === selectedCity.toLowerCase()) {
        countFound++;
      }
    });

    if (!countFound) {
      notFoundCity = selectedCity;
    }
  });

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
  } = useCategoryCity({
    baseCity: notFoundCity,
    baseCategory: notFoundCategory,
  });

  const handleSubmit = () => {
    const link = getFullListingSearchLink(searchCity, searchCategory);

    if (window.location.pathname.includes("/listing-list/")) {
      router.push(link).then(() => router.reload());
    } else {
      router.push(link);
    }
  };

  return (
    <>
      <div className="page-title-bg">
        <div className="container">
          <h2>What would you like to rent?</h2>
          <form>
            <div className="row m-0 align-items-center">
              <div className="col-lg-6 col-md-6 p-0">
                <div className="form-group">
                  <label>
                    <i className="flaticon-search"></i>
                  </label>

                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="What are you looking for?"
                    ref={categoryFilterRef}
                    onFocus={() => openCategoryTipsPopup(searchCategory)}
                    onBlur={closeCategoryTipsPopup}
                    value={searchCategory}
                    onInput={handleChangeCategory}
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
                  />

                  <SearchTipsPopup
                    active={cityTipsPopupActive}
                    tips={cityTips}
                    handleTipClick={handleCityTipClick}
                  />
                </div>
              </div>

              <div className="col-lg-3 col-md-12 p-0 popup-places-filter">
                <div className="submit-btn">
                  <button type="button" onClick={handleSubmit}>
                    Search Now
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PopularPlacesFilter;

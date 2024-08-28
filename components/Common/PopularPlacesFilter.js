import React from "react";
import { useCategoryCity } from "../../hooks";
import SearchTipsPopup from "../SearchTipsPopup";
import { getFullListingSearchLink } from "../../utils";
import { useRouter } from "next/router";
import STATIC from "../../static";

const PopularPlacesFilter = ({
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
  onSubmit,
  needSubmitButton = true,
}) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form id="searchForm" onSubmit={handleSubmit}>
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
          <div className="form-group border-end-0">
            <label>
              <i className="flaticon-category"></i>
            </label>

            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Search by category"
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

        {needSubmitButton && (
          <div className="col-lg-2 col-md-12 p-0 popup-places-filter">
            <div className="submit-btn">
              <button type="submit">Search Now</button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default PopularPlacesFilter;

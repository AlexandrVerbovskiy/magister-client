import React from "react";
import { useCategoryLocation } from "../../hooks";
import SearchTipsPopup from "../SearchTipsPopup";
import Link from "next/link";
import { getFullListingSearchLink } from "../../utils";

const PopularPlacesFilter = () => {
  const {
    handleChangeLocation,
    handleCategoryTipClick,
    handleChangeCategory,
    searchCategory,
    searchLocation,
    tipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    categoryFilterRef,
  } = useCategoryLocation();

  return (
    <>
      <div className="page-title-bg">
        <div className="container">
          <h2>Find Near by</h2>
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
                    ref={categoryFilterRef}
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

              <div className="col-lg-3 col-md-12 p-0 popup-places-filter">
                <div className="submit-btn">
                  <Link
                    href={getFullListingSearchLink(
                      searchLocation,
                      searchCategory
                    )}
                  >
                    <button type="button">Search Now</button>
                  </Link>
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

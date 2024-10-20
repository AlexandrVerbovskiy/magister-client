import React, { useContext, useEffect, useState, useRef } from "react";
import Sidebar from "../Listings/Sidebar";
import {
  usePagination,
  useInitPaginationTimeFilter,
  useChangeTimeFilter,
  useIsMobile,
  useCategoryCity,
} from "../../hooks";
import { IndiceContext } from "../../contexts";
import Pagination from "../Pagination";
import MultyMarkersMap from "../Listings/MultyMarkersMap";
import PopularPlacesFilter from "../Common/PopularPlacesFilter";
import { createListingCategoryCreateNotification } from "../../services/listingCategoryCreateNotification";
import ListingItem from "../../components/Listings/ListingItem";
import { useRouter } from "next/router";
import {
  cloneObject,
  getCityCoords,
  getDateByCurrentAdd,
  getFullListingSearchLink,
  validatePrice,
} from "../../utils";
import STATIC from "../../static";
import AdaptiveSelect from "../FormComponents/AdaptiveSelect";
import Loading from "../../components/GridListings/Loading";
import NavbarTwo from "../_App/NavbarTwo";

const defaultCenter = STATIC.DEFAULTS.CITY_COORDS;
const baseItemsPerPage = 6;

const cities = [
  { name: "Warrington", value: "Warrington", title: "Warrington" },
  { name: "Manchester", value: "Manchester", title: "Manchester" },
];

const distances = [
  { name: "0.1km", value: 100, title: "0.1km" },
  { name: "1km", value: 1000, title: "1km" },
  { name: "5km", value: 5000, title: "5km" },
  { name: "25km", value: 25000, title: "25km" },
  { name: "100km", value: 100000, title: "100km" },
];

const orderOptions = [
  { label: "By distance", value: "default" },
  { label: "Latest", value: "latest" },
  { label: "Price: low to high", value: "price_to_high" },
  { label: "Price: high to low", value: "price_to_low" },
];

const ListingsWithMap = ({
  authToken,
  categories: baseCategories,
  pageProps: basePageProps,
  getListingListRequest,
  needSubscriptionNewCategory = false,
  hasListings: baseHasListings,
  ownerId = null,
  priceLimits,
}) => {
  const listingListParentRef = useRef(null);
  const isFirstRefOptionsChange = useRef(true);
  const filterFullRef = useRef(null);
  const orderRef = useRef(null);

  const [listingListMaxHeight, setListingListMaxHeight] = useState(null);

  const router = useRouter();

  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const defaultTimeFilterValues = {
    defaultFromTime: getDateByCurrentAdd(0),
  };

  const [categories, setCategories] = useState(baseCategories);
  const [pageProps, setPageProps] = useState(cloneObject(basePageProps));
  const [canSendCreateNotifyRequest, setCanSendCreateNotifyRequest] = useState(
    needSubscriptionNewCategory
  );

  const [hasListings, setHasListings] = useState(baseHasListings);

  const minLimitPrice = priceLimits.minPrice;
  const maxLimitPrice = priceLimits.maxPrice;

  const initMinPrice = () => {
    const pagePropsMinPrice = pageProps.options?.minPrice;

    if (pagePropsMinPrice) {
      return pagePropsMinPrice;
    }

    return router.query.minPrice ?? minLimitPrice;
  };

  const initMaxPrice = () => {
    const pagePropsMaxPrice = pageProps.options?.maxPrice;

    if (pagePropsMaxPrice) {
      return pagePropsMaxPrice;
    }

    return router.query.maxPrice ?? maxLimitPrice;
  };

  const [minPrice, setMinPrice] = useState(initMinPrice());
  const [maxPrice, setMaxPrice] = useState(initMaxPrice());

  const updateListingListHeight = () => {
    if (listingListParentRef.current) {
      let childHeight = listingListParentRef.current.scrollHeight + 1;

      if (filterFullRef.current) {
        childHeight += filterFullRef.current.scrollHeight;
      }

      setListingListMaxHeight(childHeight);
    }
  };

  useEffect(() => updateListingListHeight(), [listingListParentRef.current]);

  useEffect(() => {
    setHasListings(baseHasListings);
  }, [baseHasListings]);

  useEffect(() => {
    setCanSendCreateNotifyRequest(needSubscriptionNewCategory);
  }, [needSubscriptionNewCategory]);

  const initCategories = () => {
    const pagePropsCategories = pageProps.options?.categories;
    if (pagePropsCategories) return cloneObject(pagePropsCategories);

    const routerCategories = router.query.categories;

    if (routerCategories) {
      if (typeof routerCategories === "string") {
        return [routerCategories];
      } else {
        return [...routerCategories];
      }
    }

    return [];
  };

  const initCities = () => {
    const pagePropsCities = pageProps.options?.cities;
    if (pagePropsCities) return cloneObject(pagePropsCities);

    const routerCities = router.query.cities;

    if (routerCities) {
      if (typeof routerCities === "string") {
        return [routerCities];
      } else {
        return [...routerCities];
      }
    }

    return [];
  };

  const initDistance = () => {
    const pagePropsDistance = pageProps.options?.distance;

    if (pagePropsDistance) {
      return pagePropsDistance;
    }

    return router.query.distance ?? null;
  };

  const initOthersCategories = () => {
    const pagePropsOthersCategories = pageProps.options?.othersCategories;
    if (pagePropsOthersCategories)
      return cloneObject(pagePropsOthersCategories);

    const routerOthersCategories = router.query.othersCategories;

    if (routerOthersCategories) {
      if (typeof routerOthersCategories === "string") {
        return [routerOthersCategories];
      } else {
        return [...routerOthersCategories];
      }
    }

    return [];
  };

  const [selectedCategories, setSelectedCategories] = useState(
    initCategories()
  );

  const [selectedCities, setSelectedCities] = useState(initCities());
  const [selectedDistance, setSelectedDistance] = useState(initDistance());
  const [selectedOthersCategories, setSelectedOthersCategories] = useState(
    initOthersCategories()
  );
  const [totalOthersCategories, setTotalOthersCategories] = useState(
    basePageProps.options.totalOthersCategories
  );
  const [searchCategory, setSearchCategory] = useState(
    basePageProps.options.searchCategory
  );
  const [searchCity, setSearchCity] = useState(
    basePageProps.options.searchCity
  );
  const [searchListing, setSearchListing] = useState(
    basePageProps.options.searchListing
  );
  const [favorites, setFavorites] = useState(pageProps.options?.favorites);

  useEffect(() => {
    if (isFirstRefOptionsChange.current) {
      isFirstRefOptionsChange.current = false;
      return;
    }

    setSelectedCities(initCities());
    setSelectedCategories(initCategories());
    setSelectedDistance(initDistance());
    setSelectedOthersCategories(initOthersCategories());
  }, [pageProps.options]);

  useEffect(() => setPageProps(basePageProps), [basePageProps]);

  useEffect(() => setCategories(baseCategories), [baseCategories]);

  const { error, success } = useContext(IndiceContext);

  const { fromTime, setFromTime, toTime, setToTime, getTimeFilterProps } =
    useInitPaginationTimeFilter(defaultTimeFilterValues);

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    canMoveNextPage,
    canMovePrevPage,
    items: listings,
    rebuild,
    options,
    order,
    handleChangeOrder,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: async (data) => {
      const res = await getListingListRequest(data, authToken);
      setCanSendCreateNotifyRequest(res.canSendCreateNotifyRequest);
      return res;
    },
    onError: (e) => error.set(e.message),
    getDopProps: () => ({
      ...getTimeFilterProps(),
      categories: {
        value: selectedCategories.length > 0 ? selectedCategories : null,
        hidden: (newValue) => newValue.length == 0,
      },
      othersCategories: {
        value:
          selectedOthersCategories.length > 0 ? selectedOthersCategories : null,
        hidden: (newValue) => newValue.length == 0,
        name: "others-categories",
      },
      totalOthersCategories: {
        value: totalOthersCategories,
        hidden: (newValue) => !newValue,
        name: "total-others-categories",
      },
      cities: {
        value: selectedCities.length > 0 ? selectedCities : null,
        hidden: (newValue) => newValue.length == 0,
      },
      lat: { value: searchLocation?.lat, hidden: () => true },
      lng: { value: searchLocation?.lng, hidden: () => true },
      searchListing: {
        value: searchListing,
        name: "search-listing",
      },
      searchCity: {
        value: searchCity,
        name: "search-city",
      },
      searchCategory: {
        value: searchCategory,
        name: "search-category",
      },
      ownerId: { value: ownerId, hidden: () => true },
      minPrice: {
        value: minPrice,
        name: "min-price",
        hidden: (value) => value === minLimitPrice || !value,
      },
      maxPrice: {
        value: maxPrice,
        name: "max-price",
        hidden: (value) => value === maxLimitPrice || !value,
      },
      distance: {
        value: selectedDistance,
      },
      favorites: {
        value: favorites,
        name: "favorites",
        hidden: (value) => !value,
      },
    }),
    defaultData: pageProps,
    needInit: false,
    onSendRequest: ({ items }) => {
      setHasListings(items.length > 0);
    },
    baseItemsPerPage,
  });

  useEffect(() => {
    setSearchCategory(options.searchCategory);
    setSearchCity(options.searchCity);
    setSearchListing(options.searchListing);
  }, [options]);

  const { handleChangeFromDate, handleChangeToDate } = useChangeTimeFilter({
    options,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    rebuild,
    ...defaultTimeFilterValues,
  });

  const categoryCityOptions = useCategoryCity({
    selectedCategories,
    selectedCities,
    categories,
    cities,
    baseSearchCity: searchCity,
    baseSearchCategory: searchCategory,
    baseListing: searchListing,
  });

  const handleSelectedCategories = (categories, needRemoveSearch = false) => {
    const rebuildProps = { categories };
    setSelectedCategories(cloneObject(categories));

    if (needRemoveSearch) {
      rebuildProps["searchCategory"] = null;
    }

    rebuild(rebuildProps);
  };

  const handleSelectedOthersCategories = (othersCategories) => {
    const rebuildProps = { othersCategories };
    setSelectedOthersCategories(cloneObject(othersCategories));
    rebuild(rebuildProps);
  };

  const handleChangeTotalOthersCategories = (value) => {
    setTotalOthersCategories(value);
    rebuild({ totalOthersCategories: value });
  };

  const handleChangeMinPrice = (value) => {
    if (validatePrice(value) !== true) {
      value = minLimitPrice;
    }

    setMinPrice(value);
    rebuild({ minPrice: value });
  };

  const handleChangeMaxPrice = (value) => {
    if (validatePrice(value) !== true) {
      value = maxLimitPrice;
    }

    setMaxPrice(value);
    rebuild({ maxPrice: value });
  };

  const handleChangePrices = (minValue, maxValue) => {
    if (validatePrice(minValue) !== true) {
      minValue = minLimitPrice;
    }

    if (validatePrice(maxValue) !== true) {
      maxValue = maxLimitPrice;
    }

    setMinPrice(minValue);
    setMaxPrice(maxValue);
    rebuild({ minPrice: minValue, maxPrice: maxValue });
  };

  const handleSelectedCities = (cities, needRemoveSearch = false) => {
    const searchCenter = userLocation ?? getCityCoords(cities[0]);
    const rebuildProps = { cities, ...searchCenter };

    if (needRemoveSearch) {
      rebuildProps["searchCity"] = null;
    }

    setSelectedCities(cloneObject(cities));
    rebuild(rebuildProps);
    setMapCenter(searchCenter);
  };

  const handleSelectedDistance = (distance) => {
    setSelectedDistance(distance);
    rebuild({ distance: distance });
  };

  const [markers, setMarkers] = useState([]);
  const [activeListingIds, setActiveListingIds] = useState([]);

  useEffect(() => {
    const newMarkers = listings.map((listing) => ({
      lat: listing.lat,
      lng: listing.lng,
      radius: listing.radius,
      id: listing.id,
      active: false,
    }));

    setMarkers(newMarkers);
  }, [listings]);

  useEffect(
    () =>
      setActiveListingIds(
        markers.filter((marker) => marker.active).map((marker) => marker.id)
      ),
    [markers]
  );

  const handleSendSubscribeNotificationOnCreateCategory = async () => {
    if (authToken) {
      const category = searchCategory ?? selectedCategories[0];

      try {
        await createListingCategoryCreateNotification(category, authToken);
        setCanSendCreateNotifyRequest(false);
        success.set("Subscription done success");
      } catch (e) {
        error.set(e.message);
      }
    } else {
      document.querySelector(".flaticon-user").click();
    }
  };

  const setMarkerActive = (id) => {
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id == id) marker.active = true;
        return marker;
      })
    );
  };

  const setListingMarkerActive = (id) => {
    const currentActiveMarker = markers.find((marker) => {
      if (marker.id == id) {
        return marker;
      }
    });

    setMarkerActive(id);

    if (currentActiveMarker) {
      setMapCenter({
        lat: currentActiveMarker.lat,
        lng: currentActiveMarker.lng,
      });
    }
  };

  const setMarkerUnactive = (id) =>
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id == id) marker.active = false;
        return marker;
      })
    );

  const changeUserLocation = (location) => {
    let center = location ?? getCityCoords(selectedCities[0]);
    setUserLocation(location);
    setSearchLocation(center);
    setMapCenter(center);
  };

  const handleChangeFavorite = () => {
    const newFavorites = !favorites;
    setFavorites(newFavorites);
    rebuild({ favorites: newFavorites });
  };

  const categoriesNames = [];

  Object.keys(categories).forEach((level) => {
    const names = categories[level].map((category) => category.name);
    categoriesNames.push(...names);
  });

  const cityNames = cities.map((city) => city.name);

  const dopListingCards = [];

  while (listings.length + dopListingCards.length < baseItemsPerPage) {
    dopListingCards.push(1);
  }

  const isMobile = useIsMobile();

  const MobileViewFilterComponent = () => {
    const localSelectedCities = selectedCities;
    const localSelectedCategories = selectedCategories;

    if (searchCity && !localSelectedCities.includes(searchCity)) {
      localSelectedCities.push(searchCity);
    }

    if (searchCategory && !localSelectedCategories.includes(searchCategory)) {
      localSelectedCategories.push(searchCategory);
    }

    return (
      <div className="d-flex view-listings-filter">
        <div className="d-flex align-items-center me-2">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.6818 4.25C12.6186 4.25 10.6017 4.86181 8.88619 6.00807C7.1707 7.15432 5.83363 8.78354 5.04408 10.6897C4.25452 12.5959 4.04794 14.6933 4.45045 16.7169C4.85296 18.7405 5.84649 20.5992 7.3054 22.0581C8.7643 23.517 10.6231 24.5106 12.6466 24.9131C14.6702 25.3156 16.7677 25.109 18.6738 24.3194C20.58 23.5299 22.2092 22.1928 23.3555 20.4773C24.5017 18.7618 25.1135 16.745 25.1135 14.6818C25.1133 11.9151 24.0142 9.26188 22.0579 7.30559C20.1016 5.34929 17.4484 4.25018 14.6818 4.25Z"
              stroke="#221638"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
            <path
              d="M22.4648 22.4648L29.7503 29.7503"
              stroke="#221638"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="row-dots-end">
          <div className="view-listings-categories-filter row-dots-end text-nowrap">
            {localSelectedCities.length > 0
              ? `“${localSelectedCities.join(", ")}”`
              : "No cities"}
          </div>
          <div className="view-listings-cities-filter row-dots-end text-nowrap">
            {localSelectedCategories.length > 0
              ? localSelectedCategories.join(", ")
              : "No categories"}
          </div>
        </div>
      </div>
    );
  };

  const mainFilterSubmit = () => {
    const link = getFullListingSearchLink({
      searchCity: categoryCityOptions.searchCity,
      searchCategory: categoryCityOptions.searchCategory,
      searchListing: categoryCityOptions.searchListingName,
    });

    router.push(link);

    const menuBtn = document.querySelector(".hamburger-menu.hamburger-two");

    if (menuBtn) {
      menuBtn.click();
    }
  };

  return (
    <>
      <NavbarTwo
        MobileLogoComponent={MobileViewFilterComponent}
        needMobileSticky={false}
      >
        <div
          className="container mt-4"
          style={{ borderTop: "1px solid #ede7f6" }}
        >
          <div
            className="page-title-bg p-0 mb-4"
            style={{
              borderBottom: "1px solid #ede7f6",
              backgroundColor: "inherit",
            }}
          >
            <PopularPlacesFilter
              {...categoryCityOptions}
              onSubmit={mainFilterSubmit}
              needSubmitButton={false}
            />
          </div>

          <Sidebar
            fromDateFilter={fromTime}
            setFromDateFilter={handleChangeFromDate}
            toDateFilter={toTime}
            setToDateFilter={handleChangeToDate}
            selectedCities={selectedCities}
            selectedDistance={selectedDistance}
            setSelectedCities={handleSelectedCities}
            setSelectedDistance={handleSelectedDistance}
            selectedCategories={selectedCategories}
            setSelectedCategories={handleSelectedCategories}
            selectedOthersCategories={selectedOthersCategories}
            setSelectedOthersCategories={handleSelectedOthersCategories}
            categories={categories}
            cities={cities}
            distances={distances}
            searchCity={searchCity}
            searchCategory={searchCategory}
            minPrice={minPrice}
            setMinPrice={handleChangeMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={handleChangeMaxPrice}
            handleChangePrices={handleChangePrices}
            minLimitPrice={minLimitPrice}
            maxLimitPrice={maxLimitPrice}
            totalOthersCategories={totalOthersCategories}
            setTotalOthersCategories={handleChangeTotalOthersCategories}
            favorites={favorites}
            changeFavorites={handleChangeFavorite}
          />

          <div className="col-lg-2 col-md-12 p-0 popup-places-filter">
            <button
              type="button"
              className="base-main-button w-100"
              onClick={mainFilterSubmit}
            >
              Search Now
            </button>
          </div>
        </div>
      </NavbarTwo>

      <div className="page-title-bg  d-none d-xl-flex">
        <div className="container">
          <h2>What would you like to rent?</h2>
          <PopularPlacesFilter
            {...categoryCityOptions}
            onSubmit={mainFilterSubmit}
          />
        </div>
      </div>

      <div className="listings-area pt-lg-70 pb-70">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-8 col-lg-12 col-md-12 p-0">
              <div className="row">
                {!isMobile && (
                  <div className="col-xl-4 col-md-12">
                    <Sidebar
                      fromDateFilter={fromTime}
                      setFromDateFilter={handleChangeFromDate}
                      toDateFilter={toTime}
                      setToDateFilter={handleChangeToDate}
                      selectedCities={selectedCities}
                      selectedDistance={selectedDistance}
                      setSelectedCities={handleSelectedCities}
                      setSelectedDistance={handleSelectedDistance}
                      selectedCategories={selectedCategories}
                      setSelectedCategories={handleSelectedCategories}
                      selectedOthersCategories={selectedOthersCategories}
                      setSelectedOthersCategories={
                        handleSelectedOthersCategories
                      }
                      categories={categories}
                      cities={cities}
                      distances={distances}
                      searchCity={searchCity}
                      searchCategory={searchCategory}
                      minPrice={minPrice}
                      setMinPrice={handleChangeMinPrice}
                      maxPrice={maxPrice}
                      setMaxPrice={handleChangeMaxPrice}
                      handleChangePrices={handleChangePrices}
                      minLimitPrice={minLimitPrice}
                      maxLimitPrice={maxLimitPrice}
                      totalOthersCategories={totalOthersCategories}
                      setTotalOthersCategories={
                        handleChangeTotalOthersCategories
                      }
                      favorites={favorites}
                      changeFavorites={handleChangeFavorite}
                    />
                  </div>
                )}

                <div className="col-xl-8 col-md-12">
                  <div className={`all-listings-list`}>
                    <div
                      className="listings-grid-sorting row align-items-center"
                      ref={filterFullRef}
                    >
                      <div className="col-lg-4 col-md-6 result-count">
                        <p>
                          <span className="count">
                            {paginationLoading ? 0 : countItems}
                          </span>{" "}
                          Results
                        </p>
                      </div>

                      <div className="col-lg-8 col-md-6 ordering">
                        <div className="d-flex justify-content-end">
                          <div
                            className="d-flex select-box"
                            style={{
                              zIndex: "999",
                              alignItems: "center",
                            }}
                          >
                            <label
                              htmlFor="listing-order-select"
                              onClick={(e) => orderRef.current.focus()}
                            >
                              Sort By:
                            </label>

                            <AdaptiveSelect
                              options={orderOptions}
                              value={
                                orderOptions.find(
                                  (option) => option.value === order
                                ) ?? orderOptions[0]
                              }
                              onChange={(e) => handleChangeOrder(e.value)}
                              isSearchable={false}
                              className="blog-select listing-sort-select"
                              name="listing-order-select"
                              selectRef={orderRef}
                              openMenuOnFocus={true}
                            />

                            <button
                              type="button"
                              className={`filter-bookmark-save${
                                favorites ? " checked" : ""
                              }`}
                              onClick={handleChangeFavorite}
                            >
                              <i className="flaticon-heart"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {paginationLoading ? (
                      <Loading />
                    ) : (
                      <>
                        {listings.length > 0 && (
                          <div ref={listingListParentRef} className="row">
                            {listings.map((listing) => (
                              <div
                                key={listing.id}
                                className="col-xl-6 col-lg-6 col-md-6 d-flex"
                                onMouseOver={() =>
                                  setListingMarkerActive(listing.id)
                                }
                                onMouseLeave={() =>
                                  setMarkerUnactive(listing.id)
                                }
                              >
                                <ListingItem
                                  listing={listing}
                                  hovered={activeListingIds.includes(
                                    listing.id
                                  )}
                                />
                              </div>
                            ))}

                            {dopListingCards.map((card, index) => (
                              <div
                                key={index}
                                className="col-xl-6 col-lg-6 col-md-6 d-none d-xl-flex p-0"
                                style={{ height: "420px" }}
                              ></div>
                            ))}
                          </div>
                        )}

                        {!hasListings && canSendCreateNotifyRequest && (
                          <div className="send-create-listing-category-notification">
                            <div className="image-parent">
                              <img src="/images/contact.png" alt="image" />
                            </div>

                            <div className="description">
                              Unfortunately, the searched category was not
                              found.
                              <br />
                              It will be added in the future. <br />
                              Sign up for a notification so you don't miss this
                              event!
                            </div>

                            <button
                              onClick={
                                handleSendSubscribeNotificationOnCreateCategory
                              }
                              className="default-btn"
                              type="button"
                            >
                              Subscribe on update listing categories
                            </button>
                          </div>
                        )}

                        {!hasListings && !canSendCreateNotifyRequest && (
                          <div className="no-listing-found">
                            <div className="image-parent">
                              <img
                                src="/images/no-listings.svg"
                                style={{ transform: "scale(1.5)" }}
                                alt="image"
                              />
                            </div>

                            <div className="description">
                              Unfortunately, no listings were found for the
                              specified parameters.
                              <br /> Try searching for something similar
                            </div>
                          </div>
                        )}

                        {listings.length > 0 && (
                          <Pagination
                            page={page}
                            countPages={countPages}
                            move={moveToPage}
                            canNext={canMoveNextPage}
                            canPrev={canMovePrevPage}
                            viewOnlyMoreOnePage={true}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-12 col-md-12 p-0">
              <div
                className="map-container fw-map side-full-map d-flex"
                style={{ height: listingListMaxHeight + 20 + "px" }}
              >
                <div id="main-full-map">
                  <MultyMarkersMap
                    userLocation={userLocation}
                    setUserLocation={changeUserLocation}
                    markers={markers}
                    onMouseOver={setMarkerActive}
                    onMouseOut={setMarkerUnactive}
                    center={mapCenter}
                    setCenter={setMapCenter}
                    defaultLocation={
                      pageProps.options?.lat !== undefined &&
                      pageProps.options?.lng !== undefined
                        ? {
                            lat: pageProps.options?.lat,
                            lng: pageProps.options?.lng,
                          }
                        : null
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsWithMap;

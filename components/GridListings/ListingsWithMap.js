import React, { useContext, useEffect, useState, useRef } from "react";
import Sidebar from "../Listings/Sidebar";
import {
  usePagination,
  useInitPaginationTimeFilter,
  useChangeTimeFilter,
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
  validatePrice,
} from "../../utils";
import STATIC from "../../static";
import AdaptiveSelect from "../FormComponents/AdaptiveSelect";
import Loading from "../../components/GridListings/Loading";

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

  const [selectedCategories, setSelectedCategories] = useState(
    initCategories()
  );

  const [selectedCities, setSelectedCities] = useState(initCities());
  const [selectedDistance, setSelectedDistance] = useState(initDistance());
  const [othersCategories, setOthersCategories] = useState(
    basePageProps.options.othersCategories
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
        value: othersCategories,
        hidden: (newValue) => !newValue,
        name: "others-categories",
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
    setSearchListing(options.searchListing)
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

  const handleSelectedCategories = (categories, needRemoveSearch = false) => {
    const rebuildProps = { categories };
    setSelectedCategories(cloneObject(categories));

    if (needRemoveSearch) {
      rebuildProps["searchCategory"] = null;
    }

    rebuild(rebuildProps);
  };

  const handleChangeOthersCategories = (value) => {
    setOthersCategories(value);
    rebuild({ othersCategories: value });
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
      lat: listing.rentalLat,
      lng: listing.rentalLng,
      radius: listing.rentalRadius,
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

  return (
    <>
      <PopularPlacesFilter
        selectedCategories={selectedCategories}
        selectedCities={selectedCities}
        categories={categoriesNames}
        cities={cityNames}
        searchCity={searchCity}
        searchCategory={searchCategory}
        searchListing={searchListing}
      />

      <div className="listings-area ptb-100">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-8 col-lg-12 col-md-12 p-0">
              <div className="row">
                <div className="col-lg-4 col-md-12">
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
                    othersCategories={othersCategories}
                    setOthersCategories={handleChangeOthersCategories}
                    favorites={favorites}
                    changeFavorites={handleChangeFavorite}
                  />
                </div>

                <div className="col-lg-8 col-md-12">
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
                              <img src="/images/banner-img1.png" alt="image" />
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

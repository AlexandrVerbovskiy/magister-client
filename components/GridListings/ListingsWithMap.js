import React, { useContext, useEffect, useState, useRef } from "react";
import Sidebar from "../Listings/Sidebar";
import {
  usePagination,
  useInitPaginationTimeFilter,
  useChangeTimeFilter,
} from "../../hooks";
import { getListingList } from "../../services";
import { IndiceContext } from "../../contexts";
import Pagination from "../Pagination";
import MultyMarkersMap from "../Listings/MultyMarkersMap";
import PopularPlacesFilter from "../Common/PopularPlacesFilter";
import { createListingCategoryCreateNotification } from "../../services/listingCategoryCreateNotification";
import ListingItem from "../../components/Listings/ListingItem";
import { useRouter } from "next/router";
import { cloneObject, getDateByCurrentAdd } from "../../utils";
import STATIC from "../../static";
import Select from "react-select";

const defaultCenter = STATIC.cityCoords[Object.keys(STATIC.cityCoords)[0]];

const cities = [
  { name: "Warrington", value: "Warrington", title: "Warrington" },
  { name: "Manchester", value: "Manchester", title: "Manchester" },
];

const orderOptions = [
  { label: "Default", value: "default" },
  { label: "Latest", value: "latest" },
  { label: "Price: low to high", value: "price_to_high" },
  { label: "Price: high to low", value: "price_to_low" },
];

const ListingsWithMap = ({
  authToken,
  categories: baseCategories,
  pageProps: basePageProps,
  needSubscriptionNewCategory = false,
  hasListings: baseHasListings,
}) => {
  const isFirstRefOptionsChange = useRef(true);

  const router = useRouter();

  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const defaultTimeFilterValues = {
    defaultFromTime: getDateByCurrentAdd(0),
    defaultToTime: getDateByCurrentAdd(2),
  };

  const [categories, setCategories] = useState(baseCategories);
  const [pageProps, setPageProps] = useState(cloneObject(basePageProps));
  const [canSendCreateNotifyRequest, setCanSendCreateNotifyRequest] = useState(
    needSubscriptionNewCategory
  );

  const [hasListings, setHasListings] = useState(baseHasListings);

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

  const [selectedCategories, setSelectedCategories] = useState(
    initCategories()
  );

  const [selectedCities, setSelectedCities] = useState(initCities());

  const [searchCategory, setSearchCategory] = useState(
    basePageProps.options.searchCategory
  );
  const [searchCity, setSearchCity] = useState(
    basePageProps.options.searchCity
  );

  useEffect(() => {
    if (isFirstRefOptionsChange.current) {
      isFirstRefOptionsChange.current = false;
      return;
    }

    setSelectedCities(initCities());
    setSelectedCategories(initCategories());
    setSearchCategory(pageProps.options.searchCategory);
    setSearchCity(pageProps.options.searchCity);
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
  } = usePagination({
    getItemsFunc: async (data) => {
      const res = await getListingList(data, authToken);
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
      cities: {
        value: selectedCities.length > 0 ? selectedCities : null,
        hidden: (newValue) => newValue.length == 0,
      },
      lat: { value: searchLocation?.lat, hidden: () => true },
      lng: { value: searchLocation?.lng, hidden: () => true },
      searchCity: {
        value: searchCity,
        name: "search-city",
      },
      searchCategory: {
        value: searchCategory,
        name: "search-category",
      },
    }),
    defaultData: pageProps,
    needInit: false,
    onSendRequest: ({ items }) => {
      setHasListings(items.length > 0);
    },
  });

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
    setSelectedCategories(cloneObject(categories));

    const rebuildProps = { categories };
    if (needRemoveSearch) {
      rebuildProps["searchCategory"] = null;
    }

    rebuild(rebuildProps);
  };

  const handleSelectedCities = (cities, needRemoveSearch = false) => {
    const searchCenter =
      userLocation ?? STATIC.cityCoords[cities[0]] ?? defaultCenter;

    setSelectedCities(cloneObject(cities));

    const rebuildProps = { cities, ...searchCenter };
    if (needRemoveSearch) {
      rebuildProps["searchCity"] = null;
    }

    rebuild(rebuildProps);
    setMapCenter(searchCenter);
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
      try {
        await createListingCategoryCreateNotification(
          searchCategory,
          authToken
        );
        setCanSendCreateNotifyRequest(false);
        success.set("Subscription done success");
      } catch (e) {
        error.set(e);
      }
    } else {
      document.querySelector(".flaticon-user").click();
    }
  };

  const setMarkerActive = (id) =>
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id == id) marker.active = true;
        return marker;
      })
    );

  const setMarkerUnactive = (id) =>
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.id == id) marker.active = false;
        return marker;
      })
    );

  const changeUserLocation = (location) => {
    setUserLocation(location);

    let center = STATIC.cityCoords[selectedCities[0]] ?? defaultCenter;
    if (location) center = location;

    setSearchLocation(center);
    setMapCenter(center);
  };

  const categoriesNames = [];

  Object.keys(categories).forEach((level) => {
    const names = categories[level].map((category) => category.name);
    categoriesNames.push(...names);
  });

  const cityNames = cities.map((city) => city.name);

  return (
    <>
      <PopularPlacesFilter
        selectedCategories={selectedCategories}
        selectedCities={selectedCities}
        categories={categoriesNames}
        cities={cityNames}
        searchCity={searchCity}
        searchCategory={searchCategory}
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
                    setSelectedCities={handleSelectedCities}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={handleSelectedCategories}
                    categories={categories}
                    cities={cities}
                    searchCity={searchCity}
                    searchCategory={searchCategory}
                  />
                </div>

                <div className="col-lg-8 col-md-12">
                  <div className="all-listings-list">
                    {listings.length > 0 && (
                      <div className="listings-grid-sorting row align-items-center">
                        <div className="col-lg-5 col-md-6 result-count">
                          <p>
                            <span className="count">{countItems}</span> Results
                          </p>
                        </div>

                        <div className="col-lg-7 col-md-6 ordering">
                          <div className="d-flex justify-content-end">
                            <div
                              className="d-flex select-box"
                              style={{ zIndex: "999", alignItems: "center" }}
                            >
                              <label>Sort By:</label>

                              <Select
                                options={orderOptions}
                                value={
                                  orderOptions.find(
                                    (option) => option.value === order
                                  ) ?? orderOptions[0]
                                }
                                onChange={(e) => handleChangeOrder(e.value)}
                                isSearchable={false}
                                className="custom-search-select blog-select"
                                name="listing-order-select"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row">
                      {listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="col-xl-6 col-lg-6 col-md-6 d-flex"
                          onMouseOver={() => setMarkerActive(listing.id)}
                          onMouseLeave={() => setMarkerUnactive(listing.id)}
                        >
                          <ListingItem
                            listing={listing}
                            hovered={activeListingIds.includes(listing.id)}
                          />
                        </div>
                      ))}

                      {!hasListings && canSendCreateNotifyRequest && (
                        <div className="send-create-listing-category-notification">
                          <div className="image-parent">
                            <img src="/images/contact.png" alt="image" />
                          </div>

                          <div className="description">
                            Unfortunately, the searched category was not found.
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
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-12 col-md-12 p-0">
              <div className="map-container fw-map side-full-map">
                <div id="main-full-map">
                  <MultyMarkersMap
                    userLocation={userLocation}
                    setUserLocation={changeUserLocation}
                    markers={markers}
                    onMouseOver={setMarkerActive}
                    onMouseOut={setMarkerUnactive}
                    center={mapCenter}
                    setCenter={setMapCenter}
                    defaultLocation={{
                      lat: pageProps.options?.lat,
                      lng: pageProps.options?.lng,
                    }}
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

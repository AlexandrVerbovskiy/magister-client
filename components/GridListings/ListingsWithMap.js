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
import { createListingCategoryCreateNotification } from "../../services/listingCategoryCreateNotification";
import ListingItem from "../../components/Listings/ListingItem";

const ListingsWithMap = ({
  categories: baseCategories,
  pageProps: basePageProps,
  canSendCreateNotifyRequest: baseCanSendCreateNotifyRequest,
}) => {
  const isFirstRef = useRef(true);

  const [categories, setCategories] = useState(baseCategories);
  const [pageProps, setPageProps] = useState(basePageProps);
  const [canSendCreateNotifyRequest, setCanSendCreateNotifyRequest] = useState(
    baseCanSendCreateNotifyRequest
  );

  const [selectedCategories, setSelectedCategories] = useState(
    pageProps.options.categories
  );

  const [selectedCities, setSelectedCities] = useState(
    pageProps.options.cities
  );

  useEffect(() => {
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }

    setSelectedCities(pageProps.options.cities);
    setSelectedCategories(pageProps.options.categories);
  }, [pageProps.options]);

  useEffect(() => setPageProps(basePageProps), [basePageProps]);

  useEffect(() => setCategories(baseCategories), [baseCategories]);

  const { error, success, authToken = null } = useContext(IndiceContext);

  const { fromTime, setFromTime, toTime, setToTime, getTimeFilterProps } =
    useInitPaginationTimeFilter();

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
      categories: selectedCategories.length > 0 ? selectedCategories : null,
      cities: selectedCities.length > 0 ? selectedCities : null,
    }),
    defaultData: pageProps,
  });

  console.log(listings)

  const { handleChangeFromDate, handleChangeToDate } = useChangeTimeFilter({
    options,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    rebuild,
  });

  const handleSelectedCategories = (categories) => {
    setSelectedCategories(categories);
    rebuild({ categories }, ["categories"]);
  };

  const handleSelectedCities = (cities) => {
    setSelectedCities(cities);
    rebuild({ cities }, ["cities"]);
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
          selectedCategories[0],
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

  return (
    <>
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
                            <div className="select-box">
                              <label>Sort By:</label>
                              <select
                                className="blog-select"
                                value={order ?? "default"}
                                name="orderSelect"
                                onChange={(e) =>
                                  handleChangeOrder(e.target.value)
                                }
                              >
                                <option value="default">Default</option>
                                <option value="latest">Latest</option>
                                <option value="price_to_high">
                                  Price: low to high
                                </option>
                                <option value="price_to_low">
                                  Price: high to low
                                </option>
                              </select>
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

                      {listings.length == 0 && canSendCreateNotifyRequest && (
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

                      {listings.length == 0 && !canSendCreateNotifyRequest && (
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
                    markers={markers}
                    onMouseOver={setMarkerActive}
                    onMouseOut={setMarkerUnactive}
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

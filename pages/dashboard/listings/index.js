import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React, { useContext, useState } from "react";
import Pagination from "../../../components/Pagination";
import { Navigation } from "swiper/modules";

import { authSideProps } from "../../../middlewares";
import {
  changeActiveListing,
  getUserListingList,
  getUserListingListOptions,
} from "../../../services";
import { useIsMobile, usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseListPageParams, getListingImageByType } from "../../../utils";

import DropdownFilter from "../../../components/DropdownFilter";
import STATIC from "../../../static";
import StarRating from "../../../components/StarRating";
import DeleteModal from "../../../components/Listings/DeleteModal";
import PaginationLoadingWrapper from "../../../components/_App/PaginationLoadingWrapper";

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className="custom-tooltip-parent">
      {isVisible && <div className="custom-tooltip">{text}</div>}
      <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
        {children}
      </div>
    </div>
  );
};

const Filter = ({ filter, changeFilter }) => (
  <input
    value={filter}
    onChange={(e) => changeFilter(e.target.value)}
    type="text"
    name="search"
    className="search-field"
    placeholder="Search..."
    maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
  />
);

const StatusFilter = ({ handleChangeStatusFilter, statusFilter }) => (
  <ul className="list-group list-group-flush">
    {[
      { value: "approved", label: "Approved" },
      { value: "unapproved", label: "Unapproved" },
      { value: "not-processed", label: "Not Processed" },
      { value: "all", label: "All" },
    ].map((option) => (
      <div className="py-1" key={option.value}>
        <div className="form-check">
          <input
            type="radio"
            name={option.value}
            className="form-check-input cursor-pointer"
            value={option.value}
            checked={statusFilter === option.value}
            onChange={() => handleChangeStatusFilter(option.value)}
            id={option.value}
          />
          <label htmlFor={option.value} className="form-check-label">
            {option.label}
          </label>
        </div>
      </div>
    ))}
  </ul>
);

const TabHeaderSection = ({
  filter,
  changeFilter,
  statusFilter,
  handleChangeStatusFilter,
  countItems,
  style = {},
}) => {
  const isMobile = useIsMobile();

  return (
    <ul
      className="nav nav-tabs d-flex align-items-end justify-content-between"
      id="myTab"
      style={style}
    >
      <li className="nav-item">
        <a className="nav-link active" id="all-listing-tab">
          <span className="menu-title">All Listings ({countItems})</span>
        </a>
      </li>

      {!isMobile && (
        <li className="nav-item dropdown d-none d-xl-flex">
          <label className="search-header-section me-3">
            <Filter filter={filter} changeFilter={changeFilter} />
          </label>

          <DropdownFilter align="right">
            <div className="pt-1.5 px-3">
              <div className="text-uppercase label-section">Status</div>

              <StatusFilter
                statusFilter={statusFilter}
                handleChangeStatusFilter={handleChangeStatusFilter}
              />
            </div>
          </DropdownFilter>
        </li>
      )}
    </ul>
  );
};

const StatusBlock = ({ requestId, requestApproved, active = false }) => {
  const { sessionUser } = useContext(IndiceContext);
  let listingStatus = "unapproved";
  let icon = "bx bx-x-circle";
  let tooltip =
    "The item has not been approved. Update it and send a confirmation request";

  if (requestId && requestApproved === null) {
    listingStatus = "not_processed";
    icon = "bx bx-time";
    tooltip =
      "The item is awaiting confirmation and other users cannot see it. It will take a maximum of 72 hours.";
  }

  if (requestApproved) {
    listingStatus = "approved";
    icon = "bx bx-check-circle";
    tooltip = sessionUser?.verified
      ? "The item has been approved. Users can now view and submit completing requests for your item"
      : "Account still unverified and item cannot be rented";
  }

  if (!active) {
    listingStatus = "deleted";
    icon = "bx bx-x-circle";
    tooltip =
      "The item has been deleted. Users can't now view and submit completing requests for your item";
  }

  return (
    <div className={`listing-request-status ${listingStatus}`}>
      <Tooltip text={tooltip}>
        <i className={icon}></i>
      </Tooltip>
    </div>
  );
};

const ListingList = (pageProps) => {
  const { error, success, authToken, sessionUser } = useContext(IndiceContext);

  const baseStatusFilter = pageProps.options.status ?? "all";
  const [statusFilter, setStatusFilter] = useState(baseStatusFilter);
  const [changeActiveData, setChangeActiveData] = useState(null);

  const isMobile = useIsMobile();

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    canMoveNextPage,
    canMovePrevPage,
    items: listings,
    rebuild,
    setItemFields,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getUserListingList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      status: {
        value: statusFilter,
        hidden: (value) => value == "all",
      },
    }),
  });

  const handleChangeActiveItem = async () => {
    try {
      const { active } = await changeActiveListing(
        changeActiveData?.id,
        authToken
      );
      setItemFields({ active }, changeActiveData?.id);
      success.set(
        `${changeActiveData?.name} ${
          active ? "restored" : "deleted"
        } successfully`
      );
      setChangeActiveData(false);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleChangeStatusFilter = (status) => {
    setStatusFilter(status);
    rebuild({ status: status });
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree>
          {isMobile && (
            <div
              className="pt-1 mt-2"
              style={{ borderTop: "1px solid #ede7f6" }}
            >
              <label className="search-header-section w-full d-block mt-2 mb-2">
                <Filter filter={filter} changeFilter={changeFilter} />
              </label>

              <div className="pt-1.5">
                <StatusFilter
                  statusFilter={statusFilter}
                  handleChangeStatusFilter={handleChangeStatusFilter}
                />
              </div>

              <Link
                href="/dashboard/listings/add/"
                className="default-btn add-listing-link-btn"
              >
                <span className="icon">
                  <i className="flaticon-more"></i>
                </span>
                <span className="menu-title">Add Listings</span>
              </Link>
            </div>
          )}
        </NavbarThree>

        <div className="miran-grid-sorting row align-items-center d-none d-xl-flex">
          <div className="col-lg-6 col-md-6 result-count">
            <div className="breadcrumb-area">
              <h1>My Items</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/">Home</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/">Dashboard</Link>
                </li>
                <li className="item">Listings</li>
              </ol>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 ordering">
            <Link
              href="/dashboard/listings/add/"
              className="default-btn add-listing-link-btn"
            >
              <span className="icon">
                <i className="flaticon-more"></i>
              </span>
              <span className="menu-title">Add Listings</span>
            </Link>
          </div>
        </div>

        <section className="listing-area">
          <TabHeaderSection
            filter={filter}
            changeFilter={changeFilter}
            countItems={countItems}
            statusFilter={statusFilter}
            handleChangeStatusFilter={handleChangeStatusFilter}
          />
          <PaginationLoadingWrapper active={paginationLoading}>
            {listings.length > 0 && (
              <div className="tab-content">
                <div className="tab-pane fade show active" id="all-listing">
                  <div
                    className="row"
                    style={{ alignItems: "stretch", gridRowGap: "20px" }}
                  >
                    {listings.map((listing) => {
                      return (
                        <div
                          key={listing.id}
                          className="col-xl-4 col-lg-6 col-md-6 listing-list-elem-parent"
                        >
                          <div className="single-listings-box">
                            <div
                              className="listings-image"
                              style={listing.active ? {} : { opacity: 0.5 }}
                            >
                              {listing.images.length < 1 && (
                                <Link
                                  href={`/listings/${listing.id}/`}
                                  className="link-btn"
                                ></Link>
                              )}

                              {listing.images.length == 1 && (
                                <>
                                  <img
                                    src={getListingImageByType(
                                      listing.images[0].link,
                                      listing.images[0].type
                                    )}
                                    alt={listing.name}
                                  />
                                  <Link
                                    href={`/listings/${listing.id}/`}
                                    className="link-btn"
                                  ></Link>
                                </>
                              )}

                              {listing.images.length > 1 && (
                                <Swiper
                                  loop={true}
                                  navigation={true}
                                  modules={[Navigation]}
                                  className="listings-image-slides"
                                >
                                  {listing.images.map((imageInfo) => (
                                    <SwiperSlide key={imageInfo.link}>
                                      <div className="single-image">
                                        <img
                                          src={getListingImageByType(
                                            imageInfo.link,
                                            imageInfo.type
                                          )}
                                          alt={listing.name}
                                        />
                                        <Link
                                          href={`/listings/${listing.id}/`}
                                          className="link-btn"
                                        ></Link>
                                      </div>
                                    </SwiperSlide>
                                  ))}
                                </Swiper>
                              )}
                            </div>

                            <StatusBlock
                              requestApproved={
                                listing.approved
                                  ? true
                                  : listing.requestApproved
                                  ? false
                                  : listing.requestApproved
                              }
                              requestId={listing.requestId}
                              active={listing.active}
                            />

                            <div
                              className="listings-content"
                              style={listing.active ? {} : { opacity: 0.5 }}
                            >
                              <ul className="listings-meta">
                                <li>
                                  <Link
                                    href={`/listings/?categories=${encodeURIComponent(
                                      listing.categoryName ??
                                        listing.otherCategory
                                    )}`}
                                  >
                                    <i className="flaticon-furniture-and-household"></i>
                                    <span className="row-dots-end">
                                      {listing.categoryName ??
                                        listing.otherCategory}
                                    </span>
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/listings/?cities=${encodeURIComponent(
                                      listing.city
                                    )}`}
                                  >
                                    <i className="flaticon-pin"></i>
                                    <span className="row-dots-end">
                                      {listing.city}
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                              <h3 className="row-dots-end">
                                <Link
                                  className="row-dots-end"
                                  href={`/listings/${listing.id}`}
                                >
                                  {listing.name}
                                </Link>
                              </h3>
                              <div className="d-flex align-items-center justify-content-between">
                                <StarRating
                                  averageRating={
                                    listing.ownerAverageRating ?? 0
                                  }
                                  commentCount={listing.ownerCommentCount ?? 0}
                                />
                              </div>
                            </div>

                            <div className="listings-footer">
                              <div className="d-flex justify-content-between align-items-center">
                                <Link
                                  href={`/dashboard/listings/update/${listing.id}`}
                                  className="default-btn"
                                >
                                  Edit
                                </Link>

                                <Link
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setChangeActiveData({
                                      id: listing.id,
                                      name: listing.name,
                                      active: listing.active,
                                    });
                                  }}
                                  href="/"
                                  className={`default-btn ${
                                    listing.active ? "error-btn" : ""
                                  }`}
                                >
                                  {listing.active ? "Delete" : "Restore"}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {listings.length < 1 && (
              <div className="no-listing">
                <div className="no-listing-img"></div>
                <div className="no-listing-text">You have no listings yet</div>
                <div className="no-listing-btn">
                  <Link
                    href="/dashboard/listings/add/"
                    className="default-btn add-listing-link-btn"
                  >
                    <span className="icon">
                      <i className="flaticon-more"></i>
                    </span>
                    <span className="menu-title">Add Listings</span>
                  </Link>
                </div>
              </div>
            )}
          </PaginationLoadingWrapper>
        </section>

        <Pagination
          viewOnlyMoreOnePage={true}
          page={page}
          countPages={countPages}
          move={moveToPage}
          canNext={canMoveNextPage}
          canPrev={canMovePrevPage}
        />
      </div>

      <DeleteModal
        active={changeActiveData}
        onAccept={handleChangeActiveItem}
        closeModal={() => setChangeActiveData(null)}
        activeListing={changeActiveData?.active}
        listingName={changeActiveData?.name}
      />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getUserListingListOptions(
    { ...baseListPageParams(context.query), status: context.query["status"] },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Listings" },
  });

export default ListingList;

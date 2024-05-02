import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React, { useContext, useState } from "react";
import Pagination from "../../../components/Pagination";
import { Navigation } from "swiper/modules";

import { authSideProps } from "../../../middlewares";
import {
  changeActiveListing,
  deleteListing,
  getUserListingList,
  getUserListingListOptions,
} from "../../../services";
import { usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import { Swiper, SwiperSlide } from "swiper/react";
import { baseListPageParams, getListingImageByType } from "../../../utils";

import EmptyTable from "../../../components/DashboardComponents/Table/EmptyTable";
import YesNoModal from "../../../components/_App/YesNoModal";
import DropdownFilter from "../../../components/DropdownFilter";
import { useRouter } from "next/router";
import STATIC from "../../../static";

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

const TabHeaderSection = ({
  filter,
  changeFilter,
  statusFilter,
  handleChangeStatusFilter,
  countItems,
  style = {},
}) => (
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

    <li className="nav-item dropdown d-flex">
      <DropdownFilter align="left">
        <div className="pt-1.5 px-3">
          <div className="text-uppercase label-section">Status</div>
          <ul className="list-group list-group-flush">
            {[
              { value: "approved", label: "Approved" },
              { value: "unapproved", label: "Unapproved" },
              { value: "not_processed", label: "Not Processed" },
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
        </div>
      </DropdownFilter>
      <label className="search-header-section ms-2">
        <input
          value={filter}
          onChange={(e) => changeFilter(e.target.value)}
          type="search"
          name="search"
          className="search-field"
          placeholder="Search..."
          maxLength={STATIC.MAX_SEARCH_INPUT_LENGTH}
        />
      </label>
    </li>
  </ul>
);

const StatusBlock = ({ requestId, requestApproved }) => {
  let listingStatus = "unapproved";
  let icon = "bx bx-x-circle";
  let tooltip =
    "The tool has not been approved. Update it and send a confirmation request";

  if (requestId && requestApproved === null) {
    listingStatus = "not_processed";
    icon = "bx bx-time";
    tooltip =
      "The tool is waiting for confirmation. An administrator will review your request shortly";
  }

  if (requestApproved) {
    listingStatus = "approved";
    icon = "bx bx-check-circle";
    tooltip = "The tool has been approved. Users can interact with the tool";
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
  const router = useRouter();
  const { error, success, authToken } = useContext(IndiceContext);

  const [listingIdToDelete, setListingIdToDelete] = useState(null);

  const baseStatusFilter = router.query.status ?? "all";
  const [statusFilter, setStatusFilter] = useState(baseStatusFilter);

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

  const handleAcceptDelete = async () => {
    const id = listingIdToDelete;
    setListingIdToDelete(null);

    try {
      await deleteListing(id, authToken);
      await rebuild();
      success.set("Deleted successfully");
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleDeleteItem = (e, id) => {
    e.preventDefault();
    setListingIdToDelete(id);
  };

  const handleChangeActiveItem = async (e, id, name) => {
    e.preventDefault();
    try {
      const { active } = await changeActiveListing(id, authToken);
      setItemFields({ active }, id);
      success.set(
        `${name} ${active ? "activated" : "deactivated"} successfully`
      );
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
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Update Listings</h1>
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

          <Link
            href="/dashboard/listings/add"
            className="default-btn add-listing-link-btn"
          >
            <span className="icon">
              <i className="flaticon-more"></i>
            </span>
            <span className="menu-title">Add Listings</span>
          </Link>
        </div>

        {listings.length < 1 && pageProps.items.length < 1 && (
          <section className="listing-area">
            <TabHeaderSection
              style={{ marginBottom: "0" }}
              filter={filter}
              changeFilter={changeFilter}
              countItems={countItems}
              statusFilter={statusFilter}
              handleChangeStatusFilter={handleChangeStatusFilter}
            />

            <div className="no-listing">
              <div className="no-listing-img"></div>
              <div className="no-listing-text">You have no listings yet</div>
              <div className="no-listing-btn">
                <Link
                  href="/dashboard/listings/add"
                  className="default-btn add-listing-link-btn"
                >
                  <span className="icon">
                    <i className="flaticon-more"></i>
                  </span>
                  <span className="menu-title">Add Listings</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="listing-area">
          <TabHeaderSection
            filter={filter}
            changeFilter={changeFilter}
            countItems={countItems}
            statusFilter={statusFilter}
            handleChangeStatusFilter={handleChangeStatusFilter}
          />
          {listings.length > 0 ? (
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
                          <div className="listings-image">
                            {listing.images.length < 1 && (
                              <Link
                                href={`/listing/${listing.id}`}
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
                                  href={`/listing/${listing.id}`}
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
                                        href={`/listing/${listing.id}`}
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
                          />

                          <div className="listings-content">
                            <ul className="listings-meta">
                              <li>
                                <Link
                                  href={`/listing-list/?categories=${listing.categoryName}`}
                                >
                                  <i className="flaticon-furniture-and-household"></i>
                                  <span>{listing.categoryName}</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={`/listing-list/?city=${listing.city}`}
                                >
                                  <i className="flaticon-pin"></i>
                                  <span>{listing.city}</span>
                                </Link>
                              </li>
                            </ul>
                            <h3>
                              <Link href={`/listing/${listing.id}`}>
                                {listing.name}
                              </Link>
                            </h3>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="rating">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star-half"></i>
                                <i className="bx bx-star"></i>
                                <span className="count">(45)</span>
                              </div>
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
                                onClick={(e) =>
                                  handleChangeActiveItem(
                                    e,
                                    listing.id,
                                    listing.name
                                  )
                                }
                                href="/"
                                className="default-btn"
                              >
                                {listing.active ? "Deactivate" : "Activate"}
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
          ) : (
            <EmptyTable entityName="listings" />
          )}
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

      <YesNoModal
        active={listingIdToDelete}
        toggleActive={() => setListingIdToDelete(null)}
        onAccept={handleAcceptDelete}
        title="Confirm Action"
        body={`Confirmation is required to continue. Are you sure you want to delete listing "${
          listings.filter((listing) => listing.id === listingIdToDelete)[0]
            ?.name
        }"?`}
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
  authSideProps(context, boostServerSideProps);

export default ListingList;

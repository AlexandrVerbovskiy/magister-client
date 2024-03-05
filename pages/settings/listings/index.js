import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React, { useContext, useState } from "react";
import Pagination from "../../../components/Pagination";
import { Navigation } from "swiper/modules";

import { authSideProps } from "../../../middlewares";
import {
  deleteListing,
  getUserListingList,
  getUserListingListOptions,
} from "../../../services";
import { usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import { Swiper, SwiperSlide } from "swiper/react";
import { getListingImageByType } from "../../../utils";

import YesNoModal from "../../../components/_App/YesNoModal";

const TabHeaderSection = ({ filter, changeFilter, countItems, style = {} }) => (
  <ul
    className="nav nav-tabs d-flex align-items-end justify-content-between"
    id="myTab"
    style={style}
  >
    <li className="nav-item react-tabs__tab--selected">
      <a className="nav-link" id="all-listing-tab">
        <span className="menu-title">All Listings ({countItems})</span>
      </a>
    </li>

    <li className="nav-item">
      <label className="search-header-section">
        <input
          value={filter}
          onInput={(e) => changeFilter(e.target.value)}
          type="search"
          className="search-field"
          placeholder="Search..."
        />
      </label>
    </li>
  </ul>
);

const ListingList = ({
  items: baseItems,
  options: baseOptions,
  countItems: baseCountItems,
}) => {
  const { error, success, authToken } = useContext(IndiceContext);

  const [listingIdToDelete, setListingIdToDelete] = useState(null);

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
  } = usePagination({
    getItemsFunc: (data) => getUserListingList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: {
      items: baseItems,
      options: baseOptions,
      countItems: baseCountItems,
    },
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
                <Link href="/settings/">Settings</Link>
              </li>
              <li className="item">Listings</li>
            </ol>
          </div>

          <Link
            href="/settings/listings/add"
            className="default-btn add-listing-link-btn"
          >
            <span className="icon">
              <i className="flaticon-more"></i>
            </span>
            <span className="menu-title">Add Listings</span>
          </Link>
        </div>

        {listings.length < 1 && (
          <section className="listing-area">
            <TabHeaderSection
              style={{ marginBottom: "0" }}
              filter={filter}
              changeFilter={changeFilter}
              countItems={countItems}
            />

            <div className="no-listing">
              <div className="no-listing-img"></div>
              <div className="no-listing-text">You have no listings yet</div>
              <div className="no-listing-btn">
                <Link
                  href="/settings/listings/add"
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

        {listings.length > 0 && (
          <>
            <section className="listing-area">
              <TabHeaderSection
                filter={filter}
                changeFilter={changeFilter}
                countItems={countItems}
              />

              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="all-listing">
                  <div className="row">
                    {listings.map((listing) => {
                      return (
                        <div
                          key={listing.id}
                          className="col-xl-4 col-lg-6 col-md-6"
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

                            <div className="listings-content">
                              <ul className="listings-meta">
                                <li>
                                  <Link
                                    href={`/listing-list/?categories=${listing.categoryName}`}
                                  >
                                    <i className="flaticon-furniture-and-household"></i>
                                    {listing.categoryName}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/listing-list/?city=${listing.city}`}
                                  >
                                    <i className="flaticon-pin"></i>
                                    {listing.city}
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
                                  href={`/settings/listings/update/${listing.id}`}
                                  className="default-btn"
                                >
                                  Edit
                                </Link>
                                <Link
                                  onClick={(e) =>
                                    handleDeleteItem(e, listing.id)
                                  }
                                  href="/"
                                  className="default-btn"
                                >
                                  Delete
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
            </section>

            <Pagination
              page={page}
              countPages={countPages}
              move={moveToPage}
              canNext={canMoveNextPage}
              canPrev={canMovePrevPage}
            />
          </>
        )}
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

export const getServerSideProps = async (context) => {
  const baseSideProps = await authSideProps(context);

  if (baseSideProps.notFound) {
    return {
      notFound: true,
    };
  }
  const { filter = "", page = 1 } = context.query;

  try {
    const props = await getUserListingListOptions(
      { filter, page },
      baseSideProps.props.authToken
    );

    return {
      props: { ...baseSideProps.props, ...props },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default ListingList;

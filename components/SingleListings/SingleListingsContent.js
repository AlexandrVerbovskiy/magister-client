import React, { useContext, useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { IndiceContext } from "../../contexts";
import {
  activateAuthPopup,
  autoMultiEnding,
  generateProfileFilePath,
  getFilePath,
  getListingImageByType,
  moneyFormat,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../../components/Listings/MultyMarkersMap";

import STATIC from "../../static";
import BookingModal from "./BookingModal";
import { changeListingFavorite, createOrder } from "../../services";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import OrderApprovementSection from "../Order/OrderApprovementSection";
import StarRating from "../StarRating";

const SingleListingsContent = ({
  comments,
  listing: prevListing,
  tenantBaseCommissionPercent,
  listingRatingInfo,
  ownerRatingInfo,
}) => {
  const { success, error, sessionUser, authToken } = useContext(IndiceContext);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [currentApprove, setCurrentApprove] = useState(false);
  const [currentApprovePrice, setCurrentApprovePrice] = useState(null);
  const [currentApproveFromDate, setCurrentApproveFromDate] = useState(null);
  const [currentApproveToDate, setCurrentApproveToDate] = useState(null);
  const [listing, setListing] = useState(prevListing);

  const router = useRouter();

  const handleShareClick = () => {
    navigator.share({
      title: listing.name,
      text: `Share a link to an item "${listing.name}"!`,
      url: window.location.href,
    });
  };

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const [createOrderModalActive, setCreateOrderModalActive] = useState(false);

  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const handleBeforeMakeBooking = ({ price, fromDate, toDate }) => {
    setCurrentApprovePrice(price);
    setCurrentApproveFromDate(fromDate);
    setCurrentApproveToDate(toDate);
    setCurrentApprove(true);
    setCreateOrderModalActive(false);
  };

  const handleMakeBooking = async ({ feeActive, sendingMessage }) => {
    try {
      const id = await createOrder(
        {
          pricePerDay: currentApprovePrice,
          startDate: currentApproveFromDate,
          endDate: currentApproveToDate,
          listingId: listing.id,
          feeActive,
          message: sendingMessage,
        },
        authToken
      );
      await router.push(`/dashboard/orders/${id}`);
      success.set(
        "Booking made successfully. Wait for a response from the owner"
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleMakeBookingTriggerClick = (e) => {
    e.preventDefault();

    if (sessionUser) {
      setCreateOrderModalActive(true);
    } else {
      const triggerBtn = document.querySelector(".sign-form-trigger");

      if (triggerBtn) {
        triggerBtn.click();
      }
    }
  };

  const handleChangeFavorite = async (e) => {
    if (sessionUser) {
      e.preventDefault();
      const favorite = await changeListingFavorite(listing.id, authToken);
      setListing((prev) => ({ ...prev, favorite }));
    } else {
      activateAuthPopup();
    }
  };

  return (
    <>
      <section className="listings-details-area pb-70">
        {!currentApprove && (
          <div className="listings-details-image">
            <Swiper
              loop={true}
              autoplay={{
                delay: 8000,
              }}
              modules={[Autoplay]}
            >
              {listing.backgroundPhoto && (
                <SwiperSlide key="main">
                  <img src={getFilePath(listing.backgroundPhoto)} alt="image" />
                </SwiperSlide>
              )}
            </Swiper>

            <div className="container">
              <div className="container">
                <div className="listings-details-content">
                  {listing.categoryInfo.length > 0 ? (
                    <>
                      {listing.categoryInfo.map((category, index) => (
                        <span
                          className="meta"
                          key={category.name}
                          style={index > 0 ? { marginLeft: "10px" } : {}}
                        >
                          <i className="flaticon-furniture-and-household"></i>
                          {category.name}
                        </span>
                      ))}
                    </>
                  ) : (
                    <>
                      <span className="meta">
                        <i className="flaticon-furniture-and-household"></i>
                        {listing.otherCategory}
                      </span>
                      <span className="meta" style={{ marginLeft: "10px" }}>
                        <i className="flaticon-furniture-and-household"></i>
                        Others
                      </span>
                    </>
                  )}

                  <h3
                    className="row-dots-end"
                    style={{ color: "var(--mainColor)" }}
                  >
                    {listing.name}
                  </h3>

                  <StarRating
                    averageRating={listingRatingInfo["averageRating"]}
                    commentCount={listingRatingInfo["commentCount"]}
                    checked={true}
                    countClass="rating-count"
                    centerAlign={true}
                  />

                  <ul className="d-flex align-items-center">
                    {listing.userPhone && (
                      <li className="phone-number">
                        <a href={`tel:+${listing.userPhone}`}>
                          <i className="bx bx-phone-call"></i>
                          {listing.userPhone}
                        </a>
                      </li>
                    )}
                    <li className="location">
                      <i className="bx bx-map"></i>
                      <span style={{ color: "var(--mainColor)" }}>City</span>
                      {listing.city}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <ul className="share-save">
                <li>
                  <div className="share" onClick={handleShareClick}>
                    <i className="bx bx-share-alt"></i> Share
                  </div>

                  <div className="social">
                    <a href="#" target="_blank">
                      <i className="bx bxl-facebook"></i>
                    </a>
                    <a href="#" target="_blank">
                      <i className="bx bxl-pinterest"></i>
                    </a>
                    <a href="#" target="_blank">
                      <i className="bx bxl-twitter"></i>
                    </a>
                    <a href="#" target="_blank">
                      <i className="bx bxl-linkedin"></i>
                    </a>
                    <a href="#" target="_blank">
                      <i className="bx bxl-whatsapp"></i>
                    </a>
                  </div>
                </li>

                <li>
                  <a
                    className={listing.favorite ? "active" : ""}
                    href="#"
                    onClick={handleChangeFavorite}
                  >
                    <i className="bx bx-heart"></i> Save
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="container">
          {!currentApprove && (
            <div className="row">
              <div
                className={
                  sessionUser?.id != listing.ownerId
                    ? "col-lg-8 col-md-12"
                    : "col-12"
                }
              >
                <div className="listings-details-desc">
                  <h3>{listing.name}</h3>
                  <p>{listing.description}</p>

                  <h3>Gallery</h3>
                  <div id="gallery">
                    <div
                      className="row justify-content-center"
                      style={{ gridRowGap: "10px" }}
                    >
                      {listing.listingImages.map((image, index) => {
                        const imgLink = getListingImageByType(
                          image.link,
                          image.type
                        );

                        return (
                          <div
                            key={image.id}
                            className="col-lg-4 col-md-6"
                            style={{ cursor: "zoom-in" }}
                            onClick={() => setCurrentOpenImg(imgLink)}
                          >
                            <div className="single-image-bpx">
                              <img
                                src={imgLink}
                                alt={`${listing.name} image ${index}`}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <ImagePopup
                        photoUrl={currentOpenImg}
                        open={currentOpenImg}
                        close={closeCurrentOpenImg}
                      />
                    </div>
                  </div>

                  <h3>Pricing</h3>
                  <div id="pricing">
                    <ul className="pricing-list">
                      <li>
                        Rental price per day{" "}
                        <span>${moneyFormat(listing.pricePerDay)}</span>
                      </li>
                    </ul>
                  </div>

                  <h3>Collection Location</h3>
                  <div style={{ height: "500px" }}>
                    <MultyMarkersMap
                      markers={[
                        {
                          id: 1,
                          lat: listing.rentalLat,
                          lng: listing.rentalLng,
                          radius: listing.rentalRadius,
                          active: true,
                        },
                      ]}
                      baseCenter={{
                        lat: listing.rentalLat,
                        lng: listing.rentalLng,
                      }}
                      userLocation={userLocation}
                      setUserLocation={setUserLocation}
                      center={mapCenter}
                      setCenter={setMapCenter}
                    />
                  </div>

                  {comments.length > 0 && (
                    <>
                      <h3>Review</h3>
                      <div className="listings-review">
                        <StarRating
                          averageRating={listingRatingInfo["averageRating"]}
                          commentCount={listingRatingInfo["commentCount"]}
                          checked={true}
                          countClass="rating-count"
                          pointsValue={true}
                          centerAlign={true}
                        />

                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="row m-0">
                              <div className="side">
                                <div>Punctuality</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        listingRatingInfo["averagePunctuality"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {listingRatingInfo[
                                    "averagePunctuality"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>General Experience</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        listingRatingInfo[
                                          "averageGeneralExperience"
                                        ]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {listingRatingInfo[
                                    "averageGeneralExperience"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Communication</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        listingRatingInfo[
                                          "averageCommunication"
                                        ]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {listingRatingInfo[
                                    "averageCommunication"
                                  ].toFixed(1)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6 col-md-6">
                            <div className="row m-0">
                              <div className="side">
                                <div>Reliability</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        listingRatingInfo["averageReliability"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {listingRatingInfo[
                                    "averageReliability"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Kindness</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        listingRatingInfo["averageKindness"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {listingRatingInfo["averageKindness"].toFixed(
                                    1
                                  )}
                                </div>
                              </div>

                              <div className="side">
                                <div>Flexibility</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        listingRatingInfo["averageFlexibility"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {listingRatingInfo[
                                    "averageFlexibility"
                                  ].toFixed(1)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div id="review">
                        <div className="listings-review-comments">
                          {comments.map((comment) => {
                            const average = (
                              (comment.flexibility +
                                comment.generalExperience +
                                comment.communication +
                                comment.kindness +
                                comment.punctuality +
                                comment.reliability) /
                              6
                            ).toFixed(1);

                            return (
                              <div className="user-review" key={comment.id}>
                                <div className="row m-0">
                                  <div className="col-lg-4 col-md-4 p-0">
                                    <div className="user">
                                      <div className="d-flex">
                                        <img
                                          src={generateProfileFilePath(
                                            comment.reviewerPhoto
                                          )}
                                          alt="image"
                                        />
                                        <div className="title row-dots-end">
                                          <h4 className="row-dots-end">
                                            {comment.reviewerName}
                                          </h4>
                                          <span>
                                            {comment.reviewerPhone.length > 0
                                              ? comment.reviewerPhone
                                              : "-"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-8 col-md-8 p-0">
                                    <div className="comments">
                                      <StarRating
                                        averageRating={average}
                                        checked={true}
                                        checkedOnlyActive={true}
                                        uncheckedStarClassName="bxs-star"
                                        commentCount={comments.length}
                                      />
                                      <p>{comment.description}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {sessionUser?.id != listing.ownerId && (
                <div className="col-lg-4 col-md-12">
                  <div className="listings-sidebar">
                    {listing.approved && listing.userId != sessionUser?.id && (
                      <div className="listings-widget book_listings">
                        <h3>Booking Online</h3>
                        {listing.minRentalDays > 0 && (
                          <ul style={{ listStyle: "none", padding: "0" }}>
                            <li className="d-flex">
                              <i
                                style={{
                                  fontSize: "20px",
                                  transform: "translateY(3px)",
                                  marginRight: "4px",
                                }}
                                className="bx bx-envelope"
                              ></i>
                              <span className="row-dots-end mt-0">
                                Min rental:{listing.minRentalDays} days
                              </span>
                            </li>
                          </ul>
                        )}
                        <button
                          type="button"
                          className="default-btn w-100"
                          onClick={handleMakeBookingTriggerClick}
                        >
                          Book Now ${moneyFormat(listing.pricePerDay)}/day
                        </button>
                      </div>
                    )}

                    <div className="listings-widget listings_author">
                      <h3>Owner</h3>
                      <div className="author">
                        <div className="d-flex align-items-center">
                          <img
                            src={generateProfileFilePath(listing.userPhoto)}
                            alt={listing.userName}
                          />
                          <div className="title row-dots-end">
                            <h4 className="row-dots-end">
                              <a
                                href={"/owner-listing-list/" + listing.ownerId}
                              >
                                {listing.userName}
                              </a>
                            </h4>
                            <span>
                              {listing.userCountItems}{" "}
                              {autoMultiEnding(listing.userCountItems, "Item")}{" "}
                              for rental
                            </span>
                          </div>
                        </div>

                        <div
                          className="author-profile"
                          style={{ borderTop: 0, margin: 0 }}
                        >
                          <div className="row align-items-center">
                            <div className="col-12">
                              <div className="base-full-rating-stars-info">
                                <StarRating
                                  averageRating={
                                    ownerRatingInfo["averageRating"]
                                  }
                                  commentCount={ownerRatingInfo["commentCount"]}
                                  checked={true}
                                  countClass="rating-count"
                                  pointsValue={true}
                                  centerAlign={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentApprove && (
            <OrderApprovementSection
              handleApprove={handleMakeBooking}
              setCurrentOpenImg={setCurrentOpenImg}
              listing={{
                ...listing,
                averageRating: listingRatingInfo["averageRating"],
                commentCount: listingRatingInfo["commentCount"],
                userAverageRating: ownerRatingInfo["averageRating"],
                userCommentCount: ownerRatingInfo["commentCount"],
              }}
              handleGoBack={() => setCurrentApprove(false)}
              fromDate={currentApproveFromDate}
              toDate={currentApproveToDate}
              price={currentApprovePrice}
              fee={tenantBaseCommissionPercent}
            />
          )}
        </div>
      </section>

      {sessionUser && (
        <BookingModal
          handleMakeBooking={handleBeforeMakeBooking}
          price={listing.pricePerDay}
          minRentalDays={listing.minRentalDays}
          fee={tenantBaseCommissionPercent}
          createOrderModalActive={createOrderModalActive}
          closeModal={() => setCreateOrderModalActive(false)}
          listingName={listing.name}
          blockedDates={listing.blockedDates}
          title="Book Now"
          isExtend={false}
        />
      )}
    </>
  );
};

export default SingleListingsContent;

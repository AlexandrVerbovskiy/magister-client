import React, { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  activateAuthPopup,
  autoMultiEnding,
  generateProfileFilePath,
  getListingImageByType,
  moneyFormatVisual,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../../components/Listings/MultyMarkersMap";

import SendCompleteRequestModal from "./SendCompleteRequestModal";
import { changeListingFavorite, createOrder } from "../../services";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import OrderApprovementSection from "../Order/OrderApprovementSection";
import StarRating from "../StarRating";
import { useIsMobile } from "../../hooks";

const SingleListingsContent = ({
  comments,
  listing: prevListing,
  renterBaseCommissionPercent,
  ownerRatingInfo,
}) => {
  const { success, error, sessionUser, authToken } = useContext(IndiceContext);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [currentApprove, setCurrentApprove] = useState(false);
  const [currentApprovePrice, setCurrentApprovePrice] = useState(null);
  const [currentApproveFinishDate, setCurrentApproveFinishDate] =
    useState(null);
  const [currentApproveStartDate, setCurrentApproveStartDate] = useState(null);
  const [listing, setListing] = useState(prevListing);
  const isMobile = useIsMobile();

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

  const handleBeforeSendRequest = ({ price, startDate, finishDate }) => {
    setCurrentApprovePrice(price);
    setCurrentApproveStartDate(startDate);
    setCurrentApproveFinishDate(finishDate);
    setCurrentApprove(true);
    setCreateOrderModalActive(false);
  };

  const handleSendRequest = async ({ sendingMessage }) => {
    try {
      const id = await createOrder(
        {
          price: currentApprovePrice,
          startDate: currentApproveStartDate,
          finishDate: currentApproveFinishDate,
          listingId: listing.id,
          message: sendingMessage,
        },
        authToken
      );
      await router.push(`/dashboard/orders/${id}/`);
      success.set(
        "Booking made successfully. Wait for a response from the owner"
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleSendRequestTriggerClick = (e) => {
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
              <SwiperSlide>
                <img src="/images/listings-details.jpg" alt="image" />
              </SwiperSlide>
            </Swiper>

            <div className="container">
              <div className="container">
                <div className="listings-details-content">
                  {listing.categoryInfo.length > 0 ? (
                    <>
                      {listing.categoryInfo.map((category, index) => (
                        <span className="meta" key={category.name}>
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
                      <span className="meta">
                        <i className="flaticon-furniture-and-household"></i>
                        Others
                      </span>
                    </>
                  )}

                  <h3 className="row-dots-end" style={{ textWrap: "nowrap" }}>
                    {listing.name}
                  </h3>

                  <StarRating
                    averageRating={ownerRatingInfo["averageRating"]}
                    commentCount={ownerRatingInfo["commentCount"]}
                    checked={true}
                    countClass="rating-count"
                    centerAlign={true}
                    commentName="order"
                  />

                  <ul className="d-flex align-items-center">
                    <li className="location">
                      <i className="bx bx-map"></i>
                      <span>City</span>
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
              <div className="col-lg-8 col-md-12">
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

                  <h3>Collection Location</h3>
                  <div className="card-widget" style={{ height: "500px" }}>
                    <MultyMarkersMap
                      markers={[
                        {
                          id: 1,
                          lat: listing.lat,
                          lng: listing.lng,
                          radius: listing.radius,
                          active: true,
                        },
                      ]}
                      baseCenter={{
                        lat: listing.lat,
                        lng: listing.lng,
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
                          averageRating={ownerRatingInfo["averageRating"]}
                          commentCount={ownerRatingInfo["commentCount"]}
                          checked={true}
                          countClass="rating-count"
                          pointsValue={true}
                          centerAlign={true}
                          commentName="owner"
                        />

                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="row m-0">
                              <div className="side">
                                <div>Rental Description</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo[
                                          "averageItemDescriptionAccuracy"
                                        ]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averageItemDescriptionAccuracy"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Photo Accuracy</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo["averagePhotoAccuracy"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averagePhotoAccuracy"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Pickup Condition</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo[
                                          "averagePickupCondition"
                                        ]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averagePickupCondition"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Cleanliness</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo["averageCleanliness"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averageCleanliness"
                                  ].toFixed(1)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6 col-md-6">
                            <div className="row m-0">
                              <div className="side">
                                <div>Responsiveness</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo["averageResponsiveness"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averageResponsiveness"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Clarity</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo["averageClarity"]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo["averageClarity"].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Scheduling Flexibility</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo[
                                          "averageSchedulingFlexibility"
                                        ]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averageSchedulingFlexibility"
                                  ].toFixed(1)}
                                </div>
                              </div>

                              <div className="side">
                                <div>Issue Resolution</div>
                              </div>
                              <div className="middle">
                                <div className="bar-container">
                                  <div
                                    className={`bar-${
                                      Math.round(
                                        ownerRatingInfo[
                                          "averageIssueResolution"
                                        ]
                                      ) || 1
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <div className="side right">
                                <div>
                                  {ownerRatingInfo[
                                    "averageIssueResolution"
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
                              (comment.itemDescriptionAccuracy +
                                comment.photoAccuracy +
                                comment.pickupCondition +
                                comment.cleanliness +
                                comment.responsiveness +
                                comment.clarity +
                                comment.schedulingFlexibility +
                                comment.issueResolution) /
                              8
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
                                        needCommentsCount={false}
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
              <div className="col-lg-4 col-md-12">
                <div className="listings-sidebar d-flex flex-column">
                  {!isMobile && (
                    <div className="listings-widget book_listings">
                      <h3>Start Rental</h3>

                      {sessionUser?.id != listing.ownerId ? (
                        <div>
                          <button
                            type="button"
                            className="default-btn w-100"
                            onClick={handleSendRequestTriggerClick}
                          >
                            Send request {moneyFormatVisual(listing.price)}
                          </button>
                        </div>
                      ) : (
                        <div className="status-background-orange">
                          You can't complete your own listing
                        </div>
                      )}
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
                            <a href={"/owner-listings/" + listing.ownerId}>
                              {listing.userName}
                            </a>
                          </h4>
                          <span>
                            {listing.userCountItems}{" "}
                            {autoMultiEnding(listing.userCountItems, "Order")}{" "}
                            for complete
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
                                averageRating={ownerRatingInfo["averageRating"]}
                                commentCount={ownerRatingInfo["commentCount"]}
                                checked={true}
                                countClass="rating-count"
                                pointsValue={true}
                                centerAlign={true}
                                commentName="owner"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentApprove && (
            <OrderApprovementSection
              handleApprove={handleSendRequest}
              setCurrentOpenImg={setCurrentOpenImg}
              listing={{
                ...listing,
                ownerAverageRating: ownerRatingInfo["averageRating"],
                ownerCommentCount: ownerRatingInfo["commentCount"],
                userAverageRating: ownerRatingInfo["averageRating"],
                userCommentCount: ownerRatingInfo["commentCount"],
              }}
              handleGoBack={() => setCurrentApprove(false)}
              startDate={currentApproveStartDate}
              finishDate={currentApproveFinishDate}
              price={currentApprovePrice}
              fee={renterBaseCommissionPercent}
              setStartDate={setCurrentApproveStartDate}
              setFinishDate={setCurrentApproveFinishDate}
            />
          )}
        </div>
      </section>

      {sessionUser && (
        <SendCompleteRequestModal
          handleSendRequest={handleBeforeSendRequest}
          price={listing.price}
          startDate={listing.startDate}
          finishDate={listing.finishDate}
          blockedDates={listing.blockedDates}
          fee={renterBaseCommissionPercent}
          createOrderModalActive={createOrderModalActive}
          closeModal={() => setCreateOrderModalActive(false)}
          listingName={listing.name}
          title="Send request"
        />
      )}

      {isMobile && !currentApprove && (
        <div className="mobile-booking-section">
          <div className="listings-sidebar d-flex flex-column">
            <div className="listings-widget book_listings">
              {sessionUser?.id != listing.ownerId ? (
                <div>
                  <button
                    type="button"
                    className="default-btn w-100"
                    onClick={handleSendRequestTriggerClick}
                  >
                    Send completing request {moneyFormatVisual(listing.price)}
                  </button>
                </div>
              ) : (
                <div className="status-background-orange">
                  You can't rent your own dress
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleListingsContent;

import React, { useContext, useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import { IndiceContext } from "../../contexts";
import {
  autoMultiEnding,
  getFilePath,
  getListingImageByType,
  moneyFormat,
  shakeUnverifiedAlert,
} from "../../utils";
import ImagePopup from "../_App/ImagePopup";
import MultyMarkersMap from "../../components/Listings/MultyMarkersMap";

import STATIC from "../../static";
import BookingModal from "./BookingModal";
import { createOrder } from "../../services";
import { useRouter } from "next/router";

import OrderApprovementSection from "../Order/OrderApprovementSection";

const SingleListingsContent = ({ listing, tenantBaseCommissionPercent }) => {
  const { success, error, sessionUser, authToken } = useContext(IndiceContext);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [currentApprove, setCurrentApprove] = useState(false);
  const [currentApprovePrice, setCurrentApprovePrice] = useState(null);
  const [currentApproveFromDate, setCurrentApproveFromDate] = useState(null);
  const [currentApproveToDate, setCurrentApproveToDate] = useState(null);

  const router = useRouter();

  const handleShareClick = () => {
    const clipboard = new ClipboardJS("#shareButton", {
      text: function () {
        return window.location.href;
      },
    });
    clipboard.on("success", function (e) {
      success.set("Link copied successfully");
      clipboard.destroy();
    });
    clipboard.on("error", function (e) {
      error.set("Link copied error: " + e.message);
      clipboard.destroy();
    });
    clipboard.onClick(event);
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
      await router.push(`/dashboard/bookings/${id}`);
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
      if (!sessionUser?.verified) {
        shakeUnverifiedAlert();
        return;
      }

      if (!sessionUser?.paypalId) {
        error.set(
          "Fill in your PayPal details in your profile settings to start the booking process"
        );
        return;
      }

      setCreateOrderModalActive(true);
    } else {
      const triggerBtn = document.querySelector(".sign-form-trigger");

      if (triggerBtn) {
        triggerBtn.click();
      }
    }
  };

  return (
    <>
      <section className="listings-details-area pb-70">
        {!currentApprove && (
          <div className="listings-details-image">
            <div className="swiper"></div>

            <div className="container">
              <div className="container">
                <div className="listings-details-content">
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

                  <h3>{listing.name}</h3>

                  <div className="rating d-flex align-items-center">
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="rating-count">(45)</span>
                  </div>

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
                  <a href="#">
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

                  <h3>Pricing</h3>
                  <div id="pricing">
                    <ul className="pricing-list">
                      <li>
                        Rental price per day{" "}
                        <span>${moneyFormat(listing.pricePerDay)}</span>
                      </li>
                    </ul>
                  </div>

                  <h3>Location</h3>
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

                  {((listing.defects && listing.defects.length > 0) ||
                    listing.dopDefect) && (
                    <>
                      <h3>Defects</h3>
                      <div>
                        <ul className="pricing-list">
                          {listing.defects.map((defect) => (
                            <li key={defect.defectId}>{defect.defectName}</li>
                          ))}
                          {listing.dopDefect && <li>{listing.dopDefect}</li>}
                        </ul>
                      </div>
                    </>
                  )}

                  <h3>Review</h3>
                  <div className="listings-review">
                    <div className="rating d-flex align-items-center">
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>

                      <span className="overall-rating">5.0</span>
                      <span className="rating-count">(5 reviews)</span>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="row m-0">
                          <div className="side">
                            <div>Cleanliness</div>
                          </div>
                          <div className="middle">
                            <div className="bar-container">
                              <div className="bar-4"></div>
                            </div>
                          </div>
                          <div className="side right">
                            <div>4.0</div>
                          </div>

                          <div className="side">
                            <div>Accuracy</div>
                          </div>
                          <div className="middle">
                            <div className="bar-container">
                              <div className="bar-5"></div>
                            </div>
                          </div>
                          <div className="side right">
                            <div>5.0</div>
                          </div>

                          <div className="side">
                            <div>Location</div>
                          </div>
                          <div className="middle">
                            <div className="bar-container">
                              <div className="bar-5"></div>
                            </div>
                          </div>
                          <div className="side right">
                            <div>5.0</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6">
                        <div className="row m-0">
                          <div className="side">
                            <div>Check-in</div>
                          </div>
                          <div className="middle">
                            <div className="bar-container">
                              <div className="bar-4"></div>
                            </div>
                          </div>
                          <div className="side right">
                            <div>4.0</div>
                          </div>

                          <div className="side">
                            <div>Communication</div>
                          </div>
                          <div className="middle">
                            <div className="bar-container">
                              <div className="bar-5"></div>
                            </div>
                          </div>
                          <div className="side right">
                            <div>5.0</div>
                          </div>

                          <div className="side">
                            <div>Value</div>
                          </div>
                          <div className="middle">
                            <div className="bar-container">
                              <div className="bar-5"></div>
                            </div>
                          </div>
                          <div className="side right">
                            <div>5.0</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="write-a-review">
                    <h4>Tell people what you think.</h4>
                    <p>
                      Help others by sharing your experience with this business.
                    </p>
                    <a href="#" className="default-btn">
                      Write A Review
                    </a>
                  </div>

                  <div id="review">
                    <div className="listings-review-comments">
                      <div className="user-review">
                        <div className="row m-0">
                          <div className="col-lg-4 col-md-4 p-0">
                            <div className="user">
                              <div className="d-flex">
                                <img src="/images/user1.jpg" alt="image" />
                                <div className="title">
                                  <h4>James Andy</h4>
                                  <span>New York, USA</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-8 col-md-8 p-0">
                            <div className="comments">
                              <div className="rating">
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Quis ipsum suspendisse ultrices gravida. Risus
                                commodo maecenas accumsan lacus vel facilisis.
                              </p>
                              <div className="row m-0">
                                <div className="col-lg-8 col-md-8 col-8 col-sm-8 p-0">
                                  <ul className="like-unlike">
                                    <li>
                                      <a href="#">Like</a>
                                    </li>
                                    <li>
                                      <a href="#">Unlike</a>
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  className="
                                col-lg-4 col-md-4 col-4 col-sm-4
                                p-0
                                text-right
                              "
                                >
                                  <a href="#">Comment</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="user-review">
                        <div className="row m-0">
                          <div className="col-lg-4 col-md-4 p-0">
                            <div className="user">
                              <div className="d-flex">
                                <img src="/images/user2.jpg" alt="image" />
                                <div className="title">
                                  <h4>Sarah Taylor</h4>
                                  <span>New York, USA</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-8 col-md-8 p-0">
                            <div className="comments">
                              <div className="rating">
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Quis ipsum suspendisse ultrices gravida. Risus
                                commodo maecenas accumsan lacus vel facilisis.
                              </p>
                              <div className="row m-0">
                                <div className="col-lg-8 col-md-8 col-8 col-sm-8 p-0">
                                  <ul className="like-unlike">
                                    <li>
                                      <a href="#">Like</a>
                                    </li>
                                    <li>
                                      <a href="#">Unlike</a>
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  className="
                                col-lg-4 col-md-4 col-4 col-sm-4
                                p-0
                                text-right
                              "
                                >
                                  <a href="#">Comment</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="user-review">
                        <div className="row m-0">
                          <div className="col-lg-4 col-md-4 p-0">
                            <div className="user">
                              <div className="d-flex">
                                <img src="/images/user3.jpg" alt="image" />
                                <div className="title">
                                  <h4>Jason Smith</h4>
                                  <span>New York, USA</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-8 col-md-8 p-0">
                            <div className="comments">
                              <div className="rating">
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                                <span className="bx bxs-star checked"></span>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                Quis ipsum suspendisse ultrices gravida. Risus
                                commodo maecenas accumsan lacus vel facilisis.
                              </p>
                              <div className="row m-0">
                                <div className="col-lg-8 col-md-8 col-8 col-sm-8 p-0">
                                  <ul className="like-unlike">
                                    <li>
                                      <a href="#">Like</a>
                                    </li>
                                    <li>
                                      <a href="#">Unlike</a>
                                    </li>
                                  </ul>
                                </div>
                                <div
                                  className="
                                col-lg-4 col-md-4 col-4 col-sm-4
                                p-0
                                text-right
                              "
                                >
                                  <a href="#">Comment</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="listings-sidebar">
                  {listing.approved && listing.userId != sessionUser?.id && (
                    <div className="listings-widget book_listings">
                      <h3>Booking Online</h3>
                      {listing.minRentalDays && (
                        <ul style={{ listStyle: "none", padding: "0" }}>
                          <li>
                            <i
                              style={{
                                fontSize: "20px",
                                transform: "translateY(3px)",
                                marginRight: "4px",
                              }}
                              className="bx bx-envelope"
                            ></i>
                            <span className="row-dots-end">Min rental:{listing.minRentalDays} days</span>
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

                      <span>
                        By <a href="#">Booking.com</a>
                      </span>
                    </div>
                  )}

                  <div className="listings-widget listings_contact_details">
                    <h3>Contact Details</h3>
                    <ul>
                      <li>
                        <i className="bx bx-envelope"></i>
                        <a className="row-dots-end" href="#">
                          {listing.userEmail}
                        </a>
                      </li>
                      {listing.userPhone && (
                        <li>
                          <i className="bx bx-phone-call"></i>
                          <a
                            className="row-dots-end"
                            href={`tel:+${listing.userPhone}`}
                          >
                            {listing.userPhone}
                          </a>
                        </li>
                      )}
                      {listing.userPlaceWork && (
                        <li>
                          <i className="bx bx-building"></i>
                          <a className="row-dots-end" href="#">
                            {listing.userPlaceWork}
                          </a>
                        </li>
                      )}
                      <li>
                        <i
                          className="bx bx-map"
                          style={{ marginTop: "7px" }}
                        ></i>{" "}
                        <span className="row-dots-end">{listing.city}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="listings-widget listings_contact_details">
                    <h3>Listing Location</h3>
                    <ul>
                      <li>
                        <i
                          className="bx bx-directions"
                          style={{ marginTop: "0px" }}
                        ></i>{" "}
                        <span className="row-dots-end">{listing.city}</span>
                      </li>

                      {listing.address && (
                        <li>
                          <i
                            className="bx bx-map"
                            style={{ marginTop: "7px" }}
                          ></i>{" "}
                          <span className="row-dots-end">{listing.address}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="listings-widget listings_author">
                    <h3>Hosted By</h3>
                    <div className="author">
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            listing.userPhoto
                              ? getFilePath(listing.userPhoto)
                              : STATIC.DEFAULT_PHOTO_LINK
                          }
                          alt={listing.userName}
                        />
                        <div className="title row-dots-end">
                          <h4 className="row-dots-end">
                            <a href="#" >{listing.userName}</a>
                          </h4>
                        </div>
                      </div>

                      <div className="author-profile">
                        <div className="row align-items-center">
                          <div className="col-lg-5 col-md-5">
                            <a href="#" className="view-profile">
                              View Profile
                            </a>
                          </div>

                          <div className="col-lg-7 col-md-7">
                            <ul className="social">
                              {listing.userInstagramUrl && (
                                <li>
                                  <a href={listing.userFacebookUrl}>
                                    <i className="bx bxl-facebook"></i>
                                  </a>
                                </li>
                              )}

                              {listing.userTwitterUrl && (
                                <li>
                                  <a href={listing.userTwitterUrl}>
                                    <i className="bx bxl-twitter"></i>
                                  </a>
                                </li>
                              )}

                              {listing.userLinkedinUrl && (
                                <li>
                                  <a href={listing.userLinkedinUrl}>
                                    <i className="bx bxl-linkedin"></i>
                                  </a>
                                </li>
                              )}

                              {listing.userInstagramUrl && (
                                <li>
                                  <a href={listing.userInstagramUrl}>
                                    <i className="bx bxl-instagram"></i>
                                  </a>
                                </li>
                              )}
                            </ul>
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
              handleApprove={handleMakeBooking}
              setCurrentOpenImg={setCurrentOpenImg}
              listing={listing}
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
        />
      )}
    </>
  );
};

export default SingleListingsContent;

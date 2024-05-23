import { useState } from "react";
import Switch from "../../FormComponents/Switch";
import {
  autoMultiEnding,
  getDaysDifference,
  getFilePath,
  getListingImageByType,
  moneyFormat,
  timeConverter,
  validateBigText,
} from "../../../utils";
import ErrorSpan from "../../ErrorSpan";
import YesNoModal from "../../_App/YesNoModal";
import STATIC from "../../../static";

const OrderExtendApprovementSection = ({
  handleApprove,
  setCurrentOpenImg,
  listing,
  handleGoBack,
  fromDate,
  toDate,
  price,
  fee,
}) => {
  const [feeActive, setFeeActive] = useState(false);
  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState(null);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const firstListingImagePhoto = listing.listingImages[0];
  const firstListingImagePhotoLink = getListingImageByType(
    firstListingImagePhoto.link,
    firstListingImagePhoto.type
  );

  const onSendClick = (e) => {
    e.preventDefault();

    let hasError = false;

    if (sendingMessage.length < 1) {
      hasError = true;
      setSendingMessageError("Required field");
    }

    if (validateBigText(sendingMessage) !== true) {
      hasError = true;
      setSendingMessageError(validateBigText(sendingMessage));
    }

    if (hasError) {
      return;
    }

    setActiveAcceptSendBookingRequest(true);
  };

  const onApprove = () => {
    handleApprove({ feeActive, sendingMessage });
    setActiveAcceptSendBookingRequest(false);
  };

  const duration = getDaysDifference(fromDate, toDate);
  const subtotalPrice = price * duration;
  const totalFee = (subtotalPrice * fee) / 100;
  const totalPrice = subtotalPrice + totalFee;

  return (
    <div className="row">
      <div className="col-12">
        <div className="listings-sidebar mt-0">
          <div className="row">
            <div className="col-12 col-md-6">
              {firstListingImagePhotoLink && (
                <div className="listings-widget listings_author item_info">
                  <h3>Item</h3>

                  <div
                    style={{ cursor: "zoom-in" }}
                    onClick={() =>
                      setCurrentOpenImg(firstListingImagePhotoLink)
                    }
                  >
                    <div className="single-image-bpx">
                      <img
                        src={firstListingImagePhotoLink}
                        alt={`${listing.name} image`}
                      />
                    </div>
                  </div>

                  <div className="title" style={{ fontSize: "20px" }}>
                    <h4>
                      <a href="#">{listing.name}</a>
                    </h4>
                  </div>

                  <div className="rating-section" style={{ marginTop: "15px" }}>
                    <div className="rating d-flex align-items-center">
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                      <span className="bx bxs-star checked"></span>
                    </div>
                    <span className="rating-count">(45)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 col-md-6 mt-4 mt-md-0">
              <div className="listings-widget listings_author">
                <h3>Owner</h3>

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
                    <div className="title">
                      <h4>
                        <a href="#">{listing.userName}</a>
                      </h4>
                      <span style={{ color: "#666666" }}>
                        {listing.userCountItems}{" "}
                        {autoMultiEnding(listing.userCountItems, "item")} for
                        rental
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rating-section">
                  <div className="rating d-flex align-items-center">
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                    <span className="bx bxs-star checked"></span>
                  </div>
                  <span className="overall-rating">
                    <b>5.0</b>
                  </span>
                  <span className="rating-count">
                    <a href="#">(5 reviews)</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="row listings-details-desc">
          <div className="col-12 col-md-8 order-2 order-md-1">
            <div id="rental-message">
              <div className="review-form-wrapper">
                <h3>Check Availability</h3>
                <p className="comment-notes">
                  Request confirmation of availability from the owner before you
                  pay and verify.
                </p>
                <div className="d-flex align-items-center">
                  <h3 className="mb-0">Message the owner </h3>
                  <span
                    style={{
                      marginTop: "2px",
                      color: "#6D6D6D",
                      fontWeight: 500,
                    }}
                    className="mx-1"
                  >
                    (required)
                  </span>
                </div>
                <form onSubmit={onSendClick}>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <div
                          className={`${
                            sendingMessageError ? "is-invalid" : ""
                          }`}
                        >
                          <textarea
                            placeholder="Send any other details about your request including pickup times."
                            className="form-control"
                            cols="30"
                            rows="6"
                            value={sendingMessage}
                            onInput={(e) => {
                              setSendingMessageError(null);
                              setSendingMessage(e.target.value);
                            }}
                          ></textarea>
                          <ErrorSpan
                            className="text-end"
                            error={sendingMessageError}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="comment-notes">
                      We recommend checking availability of multiple options /
                      owner to maximise the change of finding an item that suits
                      your dates and pickup.
                    </p>

                    <div className="col-lg-12 col-md-12">
                      <div
                        className="d-flex flex-row justify-content-end"
                        style={{ marginTop: 0, marginBottom: "18px" }}
                      >
                        <button
                          type="button"
                          className="me-4"
                          style={{ marginTop: 0 }}
                          onClick={handleGoBack}
                        >
                          Back
                        </button>

                        <button type="submit" style={{ marginTop: 0 }}>
                          Submit
                        </button>
                      </div>

                      <p className="comment-notes text-end">
                        Sending a request is not biding.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 order-1 order-md-2">
            <div className="listings-sidebar mt-0">
              <div className="listings-widget listings_contact_details">
                <h3>Rental Details</h3>

                <div>
                  <div className="date-fee-switch">
                    <Switch
                      title="Fee-free option"
                      active={feeActive}
                      onChange={setFeeActive}
                    />
                  </div>
                  <div>
                    <div
                      className="d-flex"
                      style={{ marginTop: "20px", marginBottom: "20px" }}
                    >
                      <div className="date-info">
                        <div className="date-info-label">Withdrawal</div>
                        <div className="date-info-value">
                          {timeConverter(fromDate)}
                        </div>
                      </div>
                      <div className="date-info">
                        <div className="date-info-label">Devolution</div>
                        <div className="date-info-value">
                          {timeConverter(toDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <div>
                      ${price} x {duration} {autoMultiEnding(duration, "day")}
                    </div>
                    <div>${moneyFormat(subtotalPrice)}</div>
                  </div>

                  <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <div>Service Fee</div>
                    <div>${moneyFormat(totalFee)}</div>
                  </div>
                </div>

                <ul>
                  <li className="d-flex justify-content-between px-0">
                    <div>Total:</div> <div>${moneyFormat(totalPrice)}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <YesNoModal
        active={activeAcceptSendBookingRequest}
        closeModal={() => setActiveAcceptSendBookingRequest(false)}
        title="Please confirm the booking"
        onAccept={onApprove}
        acceptText="Confirm"
        body={
          new Date(fromDate).toDateString() == new Date(toDate).toDateString()
            ? `'${listing.name}' rental during ${timeConverter(
                fromDate
              )} for $${moneyFormat(price)} per day`
            : `'${listing.name}' rental from ${timeConverter(
                fromDate
              )} to ${timeConverter(toDate)} for $${moneyFormat(price)} per day`
        }
      />
    </div>
  );
};

export default OrderExtendApprovementSection;

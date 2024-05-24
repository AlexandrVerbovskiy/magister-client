import { useState } from "react";
import { moneyFormat, timeConverter, validateBigText } from "../../../utils";
import ErrorSpan from "../../ErrorSpan";
import YesNoModal from "../../_App/YesNoModal";

const RentalMessage = ({
  handleGoBack,
  setSendingMessage,
  sendingMessage,
  fromDate,
  toDate,
  price,
  listing,
  onApproved,
}) => {
  const [sendingMessageError, setSendingMessageError] = useState(null);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

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

  const handleApprove = () => {
    onApproved();
    setActiveAcceptSendBookingRequest(false);
  };

  return (
    <>
      <div id="rental-message">
        <div className="review-form-wrapper">
          <h3>Check Availability</h3>
          <p className="comment-notes">
            Request confirmation of availability from the owner before you pay
            and verify.
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
                  <div className={`${sendingMessageError ? "is-invalid" : ""}`}>
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
                We recommend checking availability of multiple options / owner
                to maximise the change of finding an item that suits your dates
                and pickup.
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
      <YesNoModal
        active={activeAcceptSendBookingRequest}
        closeModal={() => setActiveAcceptSendBookingRequest(false)}
        title="Please confirm the booking"
        onAccept={handleApprove}
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
    </>
  );
};

export default RentalMessage;

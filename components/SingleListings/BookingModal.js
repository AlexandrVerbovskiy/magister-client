import { useEffect, useState } from "react";
import BaseModal from "../_App/BaseModal";
import { moneyFormat, moneyFormatVisual } from "../../utils";
import OfferOwnPrice from "./OfferOwnPrice";
import ErrorSpan from "../ErrorSpan";
import YesNoModal from "../_App/YesNoModal";
//import "flatpickr/dist/flatpickr.min.css";

const BookingModal = ({
  handleMakeBooking,
  price: defaultPrice,
  createOrderModalActive,
  closeModal,
  title = "Send request",
  fullVersion = false,
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [yesNoActive, setYesNoActive] = useState(false);

  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState("");

  useEffect(() => {
    setPrice(defaultPrice);
  }, [defaultPrice]);

  const handleSubmit = () => {
    let hasError = false;

    if (fullVersion) {
      if (!sendingMessage.trim()) {
        setSendingMessageError("Required field");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    if (fullVersion) {
      setYesNoActive(true);
    } else {
      handleMakeBooking({
        price,
        sendingMessage: sendingMessage.trim(),
      });
    }
  };

  const handleOfferYourPrice = (e) => {
    e.preventDefault();
    setOfferPriceActive(true);
  };


  const yesNoTitle = "Confirm that you want to send request";

  const onYesNoAccept = () => {
    setYesNoActive(false);

    handleMakeBooking({
      price,
      sendingMessage: sendingMessage.trim(),
    });

    closeModal();
  };

  const handleCloseYesNoModal = () => {
    setYesNoActive(false);
  };

  return (
    <>
      <BaseModal
        className={`scrollable-modal make-order-modal `}
        active={createOrderModalActive}
        closeModal={closeModal}
        hidden={yesNoActive}
        size="big"
      >
        <span className="sub-title mb-2">
          <span>{title}</span>
          <br />
        </span>

        <div className="mt-3 booking-form left-scrollable">
          <div className="popup-widget order-info-widget">
            <div className="d-flex align-items-center">
              Listing Price Per Day: ${moneyFormat(defaultPrice)}{" "}
              {!(price != defaultPrice) && (
                <i
                  className="bx bx-pencil ms-1"
                  onClick={handleOfferYourPrice}
                  style={{ cursor: "pointer" }}
                ></i>
              )}
            </div>
            
            {price != defaultPrice && (
              <div className="d-flex align-items-center">
                Offered price: ${moneyFormat(price)}{" "}
                <i
                  className="bx bx-pencil ms-1"
                  onClick={handleOfferYourPrice}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            )}
          </div>

          {fullVersion && (
            <>
              <div className="form-group">
                <span className="sub-title mb-2">
                  <span>Message the owner</span>
                </span>

                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <div
                        className={`${sendingMessageError ? "is-invalid" : ""}`}
                      >
                        <textarea
                          placeholder="Send any other details about your request including pickup times."
                          className="form-control popup-widget-textarea"
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
                </div>
              </div>
            </>
          )}
          <div className="border-top d-flex justify-content-between">
            <div className="d-flex flex-column mt-4 ">
              <div className="total-booking-price">
                <b>
                  Total: <span>{moneyFormatVisual(price)}</span>
                </b>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4 align-items-center">
              <button
                className="cancel-modal-button"
                type="button"
                onClick={closeModal}
              >
                Close
              </button>

              <button
                className="ms-2 default-modal-button"
                type="button"
                onClick={handleSubmit}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
        <OfferOwnPrice
          offerPriceActive={offerPriceActive}
          setOfferPriceActive={setOfferPriceActive}
          price={price}
          setPrice={setPrice}
        />
      </BaseModal>
      {fullVersion && (
        <YesNoModal
          active={yesNoActive}
          closeModal={handleCloseYesNoModal}
          title={yesNoTitle}
          onAccept={onYesNoAccept}
          acceptText="Confirm"
          closeModalClassName={"button-danger"}
        />
      )}
    </>
  );
};

export default BookingModal;

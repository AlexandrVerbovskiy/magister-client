import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import {
  findFirstAvailableDate,
  fullDateConverter,
  getFactOrderDays,
  groupDates,
  moneyFormat,
  moneyFormatVisual,
} from "../../utils";
import OfferOwnPrice from "./OfferOwnPrice";
import ErrorSpan from "../ErrorSpan";
import YesNoModal from "../_App/YesNoModal";
import flatpickr from "flatpickr";
import STATIC from "../../static";

const SendCompleteRequestModal = ({
  handleSendRequest,
  price: defaultPrice,
  startTime: defaultStartTime,
  finishTime: defaultFinishTime,
  createOrderModalActive,
  closeModal,
  blockedDates,
  title = "Send request",
  fullVersion = false,
}) => {
  const [price, setPrice] = useState(defaultPrice);

  const calendarContainer = useRef(null);
  const calendarRef = useRef(null);

  const [startTime, setStartTime] = useState(defaultStartTime);
  const [finishTime, setFinishTime] = useState(defaultFinishTime);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [yesNoActive, setYesNoActive] = useState(false);

  const [calendarError, setCalendarError] = useState(null);
  const [fullTotal, setFullTotal] = useState(0);

  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState("");

  const recalculateTotalInfo = ({ startTime, finishTime, fee }) => {
    const countDays = getFactOrderDays(startTime, finishTime);
    setFullTotal(calculateFullTotalByDaysCount(countDays, price, fee));
  };

  useEffect(() => {
    setPrice(defaultPrice);
  }, [defaultPrice]);

  useEffect(() => {
    const datesToDisable = groupDates(blockedDates);

    calendarRef.current = flatpickr(calendarContainer.current, {
      inline: true,
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      static: true,
      defaultDate: [startTime, finishTime],
      monthSelectorType: "static",
      yearSelectorType: "static",
      disable: datesToDisable,
      maxDate: getMaxFlatpickrDate(),
      onReady: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
      },
      onValueUpdate: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
        handleChangeDates(selectedDates);
      },
    });

    return () => {
      if (calendarRef.current.destroy) {
        calendarRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    recalculateTotalInfo({
      fromDate,
      toDate,
      price,
      fee,
    });
  }, [fromDate, toDate, price, fee]);

  useEffect(() => {
    const firstAvailableDate = findFirstAvailableDate(blockedDates, startTime);
    const lastAvailableDate = new Date(firstAvailableDate.getTime());
    const datesToDisable = groupDates(blockedDates);

    if (calendarRef.current) {
      calendarRef.current.set("disable", datesToDisable);
      calendarRef.current.setDate([firstAvailableDate, lastAvailableDate]);
      calendarRef.current.jumpToDate(firstAvailableDate);
    }

    setFromDate(firstAvailableDate);
    setToDate(lastAvailableDate);
  }, [blockedDates, startTime]);

  const handleChangeDates = (dates) => {
    setCalendarError(null);
    let [from, to] = dates;
    const fromTime = from ? new Date(from) : null;
    let toTime = to ? new Date(to) : null;

    if (fromTime > toTime) {
      toTime = new Date(fromTime);
    }

    if (from && to) {
      setStartTime(fromTime);
      setFinishTime(toTime);
    }
  };

  const handleSubmit = () => {
    let hasError = false;

    if (fullVersion) {
      if (!sendingMessage.trim()) {
        setSendingMessageError("Required field");
        hasError = true;
      }
    }

    if (
      getFactOrderDays(fromDate, toDate) > STATIC.LIMITS.MAX_RENTAL_DURATION
    ) {
      setCalendarError(
        `You can't rent a listing more than ${STATIC.LIMITS.MAX_RENTAL_DURATION} days`
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (fullVersion) {
      setYesNoActive(true);
    } else {
      handleSendRequest({
        price,
        startTime,
        finishTime,
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

    handleSendRequest({
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

        <div className="mt-3 sending-request-form left-scrollable">
          <div className="flatpickr-parent-wrapper popup-widget">
            <div ref={calendarContainer}></div>
          </div>

          {calendarError && (
            <div className="form-group">
              <div
                className="alert-dismissible fade show alert alert-danger"
                role="alert"
              >
                {calendarError}
              </div>
            </div>
          )}

          <div className="popup-widget order-info-widget">
            <div className="d-flex align-items-center">
              Rental Price per Day: ${moneyFormat(defaultPrice)}{" "}
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
                Offered price: ${moneyFormat(fullTotal)}
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
              <div>
                <b>Duration: </b>
                {fullDateConverter(startTime)} - {fullDateConverter(finishTime)}
              </div>

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

export default SendCompleteRequestModal;

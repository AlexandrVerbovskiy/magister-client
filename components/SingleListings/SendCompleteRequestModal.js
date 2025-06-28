import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import {
  autoMultiEnding,
  calculateFullTotalByDaysCount,
  dateConverter,
  dateToSeconds,
  findFirstAvailableDate,
  getFactOrderDays,
  getMaxFlatpickrDate,
  groupDates,
  moneyFormatVisual,
  separateDate,
  validateBigText,
} from "../../utils";
import OfferOwnPrice from "./OfferOwnPrice";
import ErrorSpan from "../ErrorSpan";
import STATIC from "../../static";
import YesNoModal from "../_App/YesNoModal";

const SendCompleteRequestModal = ({
  handleSendRequest,
  price: defaultPrice,
  fee,
  createOrderModalActive,
  closeModal,
  minRentalDays,
  blockedDates,
  title = "Book Now",
  startDate = null,
  fullVersion = false,
  isExtend = false,
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [yesNoActive, setYesNoActive] = useState(false);

  const calendarContainer = useRef(null);
  const calendarRef = useRef(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState("");

  /*const [fromDate, setFromDate] = useState(new Date(getDateByCurrentAdd(0)));
  const [toDate, setToDate] = useState(
    new Date(getDateByCurrentAdd(0 + defaultCountDays))
  );*/

  const [calendarError, setCalendarError] = useState(null);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ fromDate, toDate, price, fee }) => {
    const countDays = getFactOrderDays(fromDate, toDate);

    setFullTotal(calculateFullTotalByDaysCount(countDays, price, fee));
  };

  const handleChangeDates = (dates) => {
    setCalendarError(null);
    let [from, to] = dates;
    const fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (fromDate > toDate) {
      toDate = new Date(fromDate);
    }

    if (from && to) {
      setFromDate(fromDate);
      setToDate(toDate);
    }
  };

  useEffect(() => {
    const datesToDisable = groupDates(blockedDates);

    calendarRef.current = flatpickr(calendarContainer.current, {
      inline: true,
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      static: true,
      defaultDate: [fromDate, toDate],
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
    setOfferPriceActive(false);
    setPrice(defaultPrice);
  }, [defaultPrice]);

  useEffect(() => {
    const defaultCountDays = minRentalDays && !isExtend ? minRentalDays : 1;
    const firstAvailableDate = findFirstAvailableDate(
      blockedDates,
      defaultCountDays,
      startDate
    );

    const lastAvailableDate = new Date(
      firstAvailableDate.getTime() + dateToSeconds(defaultCountDays - 1)
    );

    const datesToDisable = groupDates(blockedDates);

    if (calendarRef.current) {
      calendarRef.current.set("disable", datesToDisable);
      calendarRef.current.setDate([firstAvailableDate, lastAvailableDate]);
      calendarRef.current.jumpToDate(firstAvailableDate);
    }

    setFromDate(firstAvailableDate);
    setToDate(lastAvailableDate);
  }, [blockedDates, minRentalDays, startDate]);

  const handleSubmit = () => {
    let hasError = false;

    if (!isExtend || dateConverter(startDate) != dateConverter(fromDate)) {
      if (minRentalDays && getFactOrderDays(fromDate, toDate) < minRentalDays) {
        let message = `You can rent a listing only for a period of more than ${minRentalDays} days`;

        if (isExtend) {
          message += `, or extend renting from ${dateConverter(startDate)}`;
        }

        setCalendarError(message);
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

    if (fullVersion) {
      const resSendingMessageValidated = validateBigText(sendingMessage, true);

      if (resSendingMessageValidated !== true) {
        setSendingMessageError(resSendingMessageValidated);
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    if (fullVersion) {
      setYesNoActive(true);
    } else {
      handleSendRequest({
        price,
        startDate: separateDate(fromDate),
        finishDate: separateDate(toDate),
        feeActive: false,
        sendingMessage: sendingMessage.trim(),
      });
    }
  };

  const yesNoTitle = isExtend
    ? "Confirm that you want to make an extension"
    : "Confirm that you want to make a booking";

  const onYesNoAccept = () => {
    setYesNoActive(false);

    handleSendRequest({
      price,
      startDate: separateDate(fromDate),
      finishDate: separateDate(toDate),
      feeActive: false,
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
          {isExtend && (
            <span className="sub-text">
              You can extend the order from {dateConverter(startDate)}, or start
              a new order if the start date is different
            </span>
          )}
        </span>

        <div className="mt-3 booking-form left-scrollable">
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

          {fullVersion && (
            <>
              <div className="form-group">
                <span className="sub-title mb-2">
                  <span>Message the host</span>
                </span>

                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <div
                        className={`position-relative ${
                          sendingMessageError ? "is-invalid" : ""
                        }`}
                      >
                        <textarea
                          placeholder="Send any other details about your request including pickup times"
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
                {getFactOrderDays(fromDate, toDate)}{" "}
                {autoMultiEnding(getFactOrderDays(fromDate, toDate), "day")}
              </div>
              <div className="total-booking-price">
                <b>
                  Total: <span>{moneyFormatVisual(fullTotal)}</span>
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

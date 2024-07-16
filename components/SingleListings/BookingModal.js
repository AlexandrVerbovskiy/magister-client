import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import {
  calculateFeeByDaysCount,
  calculateFullTotalByDaysCount,
  calculateTotalPriceByDaysCount,
  dateConverter,
  dateToSeconds,
  findFirstAvailableDate,
  getFactOrderDays,
  getMaxFlatpickrDate,
  groupDates,
  moneyFormat,
  separateDate,
} from "../../utils";
import OfferOwnPrice from "./OfferOwnPrice";
import "flatpickr/dist/flatpickr.min.css";
import Switch from "../FormComponents/Switch";
import ErrorSpan from "../ErrorSpan";
import STATIC from "../../static";
import YesNoModal from "../_App/YesNoModal";

const BookingModal = ({
  handleMakeBooking,
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
  const [feeActive, setFeeActive] = useState(false);
  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState("");

  /*const [fromDate, setFromDate] = useState(new Date(getDateByCurrentAdd(0)));
  const [toDate, setToDate] = useState(
    new Date(getDateByCurrentAdd(0 + defaultCountDays))
  );*/

  const [calendarError, setCalendarError] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ fromDate, toDate, price, fee }) => {
    const countDays = getFactOrderDays(fromDate, toDate);

    setTotalPrice(calculateTotalPriceByDaysCount(countDays, price, fee));
    setTotalFee(calculateFeeByDaysCount(countDays, price, fee));
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
      onChange: (selectedDates, dateStr, instance) => {
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
        let message = `You can rent ads only for a period of more than ${minRentalDays} days`;

        if (isExtend) {
          message += `, or extend renting from ${dateConverter(startDate)}`;
        }

        setCalendarError(message);
        hasError = true;
      }
    }

    if (getFactOrderDays(fromDate, toDate) > STATIC.LIMITS.RENTAL_DURATION) {
      setCalendarError(
        `You can't rent a listing more than ${STATIC.LIMITS.RENTAL_DURATION} days`
      );
      hasError = true;
    }

    if (fullVersion) {
      if (!sendingMessage.trim()) {
        setSendingMessageError("Required field");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    setYesNoActive(true);
  };

  const handleOfferYourPrice = (e) => {
    e.preventDefault();
    setOfferPriceActive(true);
  };

  const yesNoTitle = isExtend
    ? "Confirm that you want to make an extension"
    : "Confirm that you want to make a booking";

  const onYesNoAccept = () => {
    setYesNoActive(false);

    handleMakeBooking({
      price,
      fromDate: separateDate(fromDate),
      toDate: separateDate(toDate),
      feeActive,
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
        className={`scrollable-modal make-order-modal`}
        active={createOrderModalActive}
        closeModal={closeModal}
        hidden={yesNoActive}
      >
        <span className="sub-title mb-2">
          <span>{title}</span>
          <br />
          <span className="sub-text">
            You can extend the order from {dateConverter(startDate)}, or start a
            new order if the start date is different
          </span>
        </span>

        <div className="mt-3 booking-form left-scrollable">
          <div className="flatpickr-parent-wrapper popup-widget">
            <div ref={calendarContainer}></div>
          </div>
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
            {fee && <div>Fee: {fee}%</div>}
            {minRentalDays > 0 && (
              <div>Minimal Count Rental Days: {minRentalDays}</div>
            )}
            {fee && <div>Price: ${totalPrice}</div>}
            {fee && <div>Total Fee: ${totalFee}</div>}
            <div style={{ fontWeight: 700 }}>Total: ${fullTotal}</div>
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
              <div className="popup-widget order-info-widget popup-date-fee-switch-widget">
                <div className="form-group">
                  <div className="date-fee-switch">
                    <Switch
                      title="Fee-free option"
                      active={feeActive}
                      onChange={setFeeActive}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mb-0">
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

          <button
            className="mt-4 default-modal-button"
            type="button"
            onClick={handleSubmit}
          >
            Send Request
          </button>
          <OfferOwnPrice
            offerPriceActive={offerPriceActive}
            setOfferPriceActive={setOfferPriceActive}
            price={price}
            setPrice={setPrice}
          />
        </div>
      </BaseModal>
      <YesNoModal
        active={yesNoActive}
        closeModal={handleCloseYesNoModal}
        title={yesNoTitle}
        onAccept={onYesNoAccept}
        acceptText="Confirm"
        closeModalClassName={"button-danger"}
      />
    </>
  );
};

export default BookingModal;

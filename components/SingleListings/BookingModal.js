import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {
  calculateFeeByDaysCount,
  calculateFullTotalByDaysCount,
  calculateTotalPriceByDaysCount,
  getDateByCurrentAdd,
  getDaysDifference,
  groupDates,
  separateDate,
} from "../../utils";
import ErrorSpan from "../ErrorSpan";
import OfferOwnPrice from "./OfferOwnPrice";
import YesNoModal from "../../components/_App/YesNoModal";

const BookingModal = ({
  handleMakeBooking,
  price: defaultPrice,
  fee,
  createOrderModalActive,
  setCreateOrderModalActive,
  minRentalDays,
  listingName,
  blockedDates,
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const defaultCountDays = minRentalDays ? minRentalDays : 0;

  const calendarContainer = useRef(null);
  const [fromDate, setFromDate] = useState(new Date(getDateByCurrentAdd(0)));
  const [toDate, setToDate] = useState(
    new Date(getDateByCurrentAdd(0 + defaultCountDays))
  );
  const [calendarError, setCalendarError] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ fromDate, toDate, price, fee }) => {
    const countDays = getDaysDifference(fromDate, toDate);

    setTotalPrice(calculateTotalPriceByDaysCount(countDays, price, fee));
    setTotalFee(calculateFeeByDaysCount(countDays, price, fee));
    setFullTotal(calculateFullTotalByDaysCount(countDays, price, fee));
  };

  const handleChangeDates = (dates) => {
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
    const calendar = flatpickr(calendarContainer.current, {
      inline: true,
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      static: true,
      defaultDate: [fromDate, toDate],
      monthSelectorType: "static",
      yearSelectorType: "static",
      disable: groupDates(blockedDates),
      onReady: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
      },
      onChange: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
        handleChangeDates(selectedDates);
      },
    });

    return () => {
      if (calendar.destroy) {
        calendar.destroy();
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

  const handleSubmit = () => {
    let hasError = false;

    if (minRentalDays && getDaysDifference(fromDate, toDate) < minRentalDays) {
      setCalendarError(
        `You can only rent a listing for more than ${minRentalDays} days`
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setActiveAcceptSendBookingRequest(true);
  };

  const handleSendBookingRequest = () => {
    setActiveAcceptSendBookingRequest(false);
    handleMakeBooking({
      price,
      fromDate: separateDate(fromDate),
      toDate: separateDate(toDate),
    });
  };

  const handleOfferYourPrice = (e) => {
    e.preventDefault();
    setOfferPriceActive(true);
  };

  return (
    <BaseModal
      className="scrollable-modal make-order-modal"
      active={createOrderModalActive}
      toggleActive={() => setCreateOrderModalActive(false)}
    >
      <span className="sub-title mb-2">
        <span>Book Now</span>
      </span>

      <div className="mt-3 booking-form left-scrollable">
        <div className="flatpickr-parent-wrapper popup-widget">
          <div ref={calendarContainer}></div>
          <ErrorSpan error={calendarError} />
        </div>

        <div className="popup-widget order-info-widget">
          <div className="d-flex align-items-center">
            Listing Price Per Day: ${defaultPrice}{" "}
            {!(price != defaultPrice) && (
              <i
                class="bx bx-pencil ms-1"
                onClick={handleOfferYourPrice}
                style={{ cursor: "pointer" }}
              ></i>
            )}
          </div>
          {price != defaultPrice && (
            <div className="d-flex align-items-center">
              Offered price: ${price}{" "}
              <i
                class="bx bx-pencil ms-1"
                onClick={handleOfferYourPrice}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
          )}
          {fee && <div>Fee: {fee}%</div>}
          {minRentalDays && (
            <div>Minimal Count Rental Days: {minRentalDays}</div>
          )}
          {fee && <div>Price: ${totalPrice}</div>}
          {fee && <div>Total Fee: ${totalFee}</div>}
          <div style={{ fontWeight: 700 }}>Total: ${fullTotal}</div>
        </div>

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

        <YesNoModal
          active={activeAcceptSendBookingRequest}
          toggleActive={() => setActiveAcceptSendBookingRequest(false)}
          title="Please confirm the booking"
          onAccept={handleSendBookingRequest}
          acceptText="Confirm"
          body={
            fromDate.toDateString() == toDate.toDateString()
              ? `'${listingName}' rental during ${fromDate.toDateString()} for $${price} per day`
              : `'${listingName}' rental from ${fromDate.toDateString()} to ${toDate.toDateString()} for $${price} per day`
          }
        />
      </div>
    </BaseModal>
  );
};

export default BookingModal;

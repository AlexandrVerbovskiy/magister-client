import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { getDateByCurrentAdd, getDaysDifference } from "../../utils";
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
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const calculateFeeByDaysCount = (count, price, fee) => {
    const totalFee = (fee * price * count) / 100;
    return totalFee.toFixed(2);
  };

  const calculateTotalPriceByDaysCount = (count, price, fee) =>
    (price * count).toFixed(2);

  const calculateFullTotalByDaysCount = (count, price, fee) => {
    const total =
      +calculateTotalPriceByDaysCount(count, price, fee) +
      +calculateFeeByDaysCount(count, price, fee);
    return total.toFixed(2);
  };

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
      dateFormat: "M j, Y",
      minDate: "today",
      static: true,
      defaultDate: [fromDate, toDate],
      monthSelectorType: "static",
      yearSelectorType: "static",
      disable: [
        {
          from: "2024-04-18",
          to: "2024-04-24",
        },
      ],
      onReady: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr.replace("to", "-");
      },
      onChange: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr.replace("to", "-");
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
    handleMakeBooking({ price, fromDate, toDate });
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

        <div className="popup-widget" style={{ padding: "15px 30px 15px" }}>
          <div>Listing Price Per Day: ${defaultPrice}</div>
          {price != defaultPrice && <div>Offered price: ${price}</div>}
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

        <a
          href="#"
          className="mt-1 d-flex justify-content-center"
          onClick={handleOfferYourPrice}
        >
          Offer Your Price
        </a>

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

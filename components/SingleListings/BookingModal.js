import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { getDateByCurrentAdd, validatePrice } from "../../utils";
import InputWithIcon from "../FormComponents/InputWithIcon";
import ErrorSpan from "../ErrorSpan";

const getDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const difference = Math.abs(end - start);

  return Math.ceil(difference / (1000 * 3600 * 24)) + 1;
};

const BookingModal = ({
  handleMakeBooking,
  price: defaultPrice,
  fee,
  createOrderModalActive,
  setCreateOrderModalActive,
  minRentalDays,
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [priceError, setPriceError] = useState(null);

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
        const customClass = align ? align : "";
        instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
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

  const handleChangePrice = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    setPriceError(null);
  };

  const handleSubmit = () => {
    let hasError = true;

    if (minRentalDays && getDaysDifference(fromDate, toDate) < minRentalDays) {
      setCalendarError(
        `You can only rent a listing for more than ${minRentalDays} days`
      );
    }

    if (!price) {
      setPriceError("Required field");
      hasError = true;
    }

    if (price && validatePrice(price) !== true) {
      setPriceError(validatePrice(price));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    handleMakeBooking();
  };

  return (
    <BaseModal
      className="make-order-modal"
      active={createOrderModalActive}
      toggleActive={() => setCreateOrderModalActive(false)}
    >
      <span className="sub-title mb-2">
        <span>Book Now</span>
      </span>

      <form className="mt-3 booking-form  left-hidden-scrollable">
        <div className="flatpickr-parent-wrapper popup-widget">
          <div ref={calendarContainer}></div>
          <ErrorSpan error={calendarError} />
        </div>

        <div className="popup-widget" style={{ padding: "15px 30px 15px" }}>
          <InputWithIcon
            type="number"
            value={price}
            error={priceError}
            label="Your proposal price per day:"
            placeholder="532.00"
            onInput={handleChangePrice}
            name="proposal-price"
          />

          <div>Listing Price Per Day: ${defaultPrice}</div>
          {fee && <div>Fee: {fee}%</div>}
          {minRentalDays && (
            <div>Minimal Count Rental Days: {minRentalDays}</div>
          )}
          {fee && <div>Price: ${totalPrice}</div>}
          {fee && <div>Total Fee: ${totalFee}</div>}
          <div style={{ fontWeight: 700 }}>Total: ${fullTotal}</div>
        </div>

        <button className="mt-4" type="button" onClick={handleSubmit}>
          Send Request
        </button>
      </form>
    </BaseModal>
  );
};

export default BookingModal;

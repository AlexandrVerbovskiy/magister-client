import { useEffect, useRef, useState } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import {
  calculateFeeByDaysCount,
  calculateFullTotalByDaysCount,
  calculateTotalPriceByDaysCount,
  dateToSeconds,
  findFirstAvailableDate,
  getDateByCurrentAdd,
  getDaysDifference,
  groupDates,
  moneyFormat,
  separateDate,
} from "../../utils";
import OfferOwnPrice from "./OfferOwnPrice";
import YesNoModal from "../../components/_App/YesNoModal";
import "flatpickr/dist/flatpickr.min.css";

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
}) => {
  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);

  const calendarContainer = useRef(null);
  const calendarRef = useRef(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  /*const [fromDate, setFromDate] = useState(new Date(getDateByCurrentAdd(0)));
  const [toDate, setToDate] = useState(
    new Date(getDateByCurrentAdd(0 + defaultCountDays))
  );*/

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
    const defaultCountDays = minRentalDays ? minRentalDays : 1;
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

    if (minRentalDays && getDaysDifference(fromDate, toDate) < minRentalDays) {
      setCalendarError(
        `You can rent a listing only for more than ${minRentalDays} days`
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

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
      closeModal={closeModal}
    >
      <span className="sub-title mb-2">
        <span>{title}</span>
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
  );
};

export default BookingModal;

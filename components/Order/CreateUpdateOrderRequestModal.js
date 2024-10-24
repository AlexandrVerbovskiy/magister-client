import { useEffect, useRef, useState, useContext } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import {
  autoMultiEnding,
  calculateFeeByDaysCount,
  calculateFullTotalByDaysCount,
  calculateTotalPriceByDaysCount,
  dateToSeconds,
  findFirstAvailableDate,
  getFactOrderDays,
  getMaxFlatpickrDate,
  groupDates,
  moneyFormatVisual,
  separateDate,
} from "../../utils";
import ErrorSpan from "../ErrorSpan";
import OfferOwnPrice from "../SingleListings/OfferOwnPrice";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";
import STATIC from "../../static";

const CreateUpdateOrderRequestModal = ({
  handleCreateUpdateRequest,
  price: defaultPrice,
  fee,
  proposalPrice,
  proposalStartDate,
  proposalEndDate,
  updateRequestModalActive,
  closeActiveUpdateRequest,
  minRentalDays,
  listingName,
  blockedDates,
  commissionType,
}) => {
  const proposalCountDays = getFactOrderDays(
    proposalStartDate,
    proposalEndDate
  );

  const baseFromDate = new Date();
  const baseToDate = new Date();

  const { error } = useContext(IndiceContext);

  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const calendarContainer = useRef(null);
  const prevCalendarContainer = useRef(null);
  const calendarRef = useRef(null);
  const prevCalendarRef = useRef(null);

  useEffect(() => {}, [calendarRef.prevCalendarRef]);

  const [fromDate, setFromDate] = useState(baseFromDate);
  const [toDate, setToDate] = useState(baseToDate);
  const [calendarError, setCalendarError] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ fromDate, toDate, price, fee }) => {
    const countDays = getFactOrderDays(fromDate, toDate);

    setTotalPrice(calculateTotalPriceByDaysCount(countDays, price, fee));
    setTotalFee(
      calculateFeeByDaysCount(countDays, price, fee, commissionType == "sum")
    );
    setFullTotal(
      calculateFullTotalByDaysCount(countDays, price, fee, commissionType)
    );
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

    setCalendarError(null);
  };

  useEffect(() => {
    const defaultCountDays = minRentalDays ? minRentalDays : 1;
    const baseFromDate = findFirstAvailableDate(blockedDates, defaultCountDays);

    const baseToDate = new Date(
      baseFromDate.getTime() + dateToSeconds(defaultCountDays - 1)
    );

    setToDate(baseToDate);
    setFromDate(baseFromDate);

    setPrice(defaultPrice);
  }, [
    defaultPrice,
    fee,
    proposalPrice,
    proposalStartDate,
    proposalEndDate,
    minRentalDays,
    listingName,
    blockedDates,
    commissionType,
  ]);

  useEffect(() => {
    const calendar = flatpickr(calendarContainer.current, {
      inline: true,
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      maxDate: getMaxFlatpickrDate(),
      static: true,
      defaultDate: [fromDate, toDate],
      monthSelectorType: "static",
      disable: groupDates(blockedDates),
      onReady: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
      },
      onChange: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
        handleChangeDates(selectedDates);
      },
      disableMobile: true,
    });

    calendarRef.current = calendar;

    const prevCalendar = flatpickr(prevCalendarContainer.current, {
      inline: true,
      mode: "range",
      dateFormat: "Y-m-d",
      defaultDate: [new Date(proposalStartDate), new Date(proposalEndDate)],
      monthSelectorType: "static",
      onChange: (selectedDates, dateStr, instance) => {
        instance.setDate(`${proposalStartDate} to ${proposalEndDate}`);
      },
    });

    prevCalendarRef.current = prevCalendar;

    return () => {
      if (calendar.destroy) {
        calendar.destroy();
      }

      if (prevCalendar.destroy) {
        prevCalendar.destroy();
      }
    };
  }, [fromDate, toDate, proposalStartDate, proposalEndDate]);

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

    if (minRentalDays && getFactOrderDays(fromDate, toDate) < minRentalDays) {
      setCalendarError(
        `You can rent a listing only for a period of more than ${minRentalDays} days`
      );
      hasError = true;
    }

    if (
      getFactOrderDays(fromDate, toDate) > STATIC.LIMITS.MAX_RENTAL_DURATION
    ) {
      setCalendarError(
        `You can't rent a listing more than ${STATIC.LIMITS.MAX_RENTAL_DURATION} days`
      );
      hasError = true;
    }

    if (
      proposalPrice == price &&
      proposalStartDate == separateDate(fromDate) &&
      proposalEndDate == separateDate(toDate)
    ) {
      error.set(
        "You cannot submit these changes as they are the same as proposed"
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setActiveAcceptSendBookingRequest(true);
  };

  const handleSendBookingRequest = () => {
    handleCreateUpdateRequest({
      price,
      fromDate: separateDate(fromDate),
      toDate: separateDate(toDate),
    });

    setActiveAcceptSendBookingRequest(false);
  };

  const handleOfferYourPrice = (e) => {
    e.preventDefault();
    setOfferPriceActive(true);
  };

  return (
    <BaseModal
      className="scrollable-modal make-order-modal modal-xxl"
      active={updateRequestModalActive}
      closeModal={closeActiveUpdateRequest}
      size="big"
    >
      <div className="row d-none d-md-flex">
        <div className="col col-6">
          <span className="sub-title mb-2">
            <span>Current offer</span>
          </span>
        </div>

        <div className="col col-6">
          <span className="sub-title mb-2">
            <span>Your offer</span>
          </span>
        </div>
      </div>
      <div className="mt-3 sending-request-form left-scrollable">
        <div className="row">
          <div className="col col-12 col-md-6">
            <span className="sub-title mb-2 d-flex d-md-none">
              <span>Current offer</span>
            </span>

            <div className="flatpickr-parent-wrapper popup-widget">
              <div ref={prevCalendarContainer}></div>
            </div>
          </div>
          <div className="col col-12 col-md-6">
            <span className="sub-title mb-2 d-flex d-md-none">
              <span>Your offer</span>
            </span>

            <div
              className="flatpickr-parent-wrapper popup-widget"
              style={{ flexDirection: "column", alignItems: "center" }}
            >
              <div ref={calendarContainer}></div>
              {calendarError && (
                <div
                  className="w-full form-group p-2"
                  style={{ margin: "-5px -20px -30px -35px " }}
                >
                  <div className="is-invalid">
                    <ErrorSpan error={calendarError} />
                  </div>
                </div>
              )}
            </div>

            <OfferOwnPrice
              offerPriceActive={offerPriceActive}
              setOfferPriceActive={setOfferPriceActive}
              price={price}
              setPrice={setPrice}
            />

            <YesNoModal
              active={activeAcceptSendBookingRequest}
              closeModal={() => setActiveAcceptSendBookingRequest(false)}
              title="Please confirm new booking conditions"
              onAccept={handleSendBookingRequest}
              acceptText="Confirm"
              body={
                fromDate.toDateString() == toDate.toDateString()
                  ? `'${listingName}' rental during ${fromDate.toDateString()} for ${moneyFormatVisual(
                      price
                    )} per day`
                  : `'${listingName}' rental from ${fromDate.toDateString()} to ${toDate.toDateString()} for ${moneyFormatVisual(
                      price
                    )} per day`
              }
            />
          </div>
        </div>
        <div className="border-top d-flex justify-content-between">
          <div className="d-flex flex-column mt-4 ">
            <div>
              <b>Previous duration: </b>
              {proposalCountDays} {autoMultiEnding(proposalCountDays, "day")}
            </div>
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
              onClick={closeActiveUpdateRequest}
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
    </BaseModal>
  );
};

export default CreateUpdateOrderRequestModal;

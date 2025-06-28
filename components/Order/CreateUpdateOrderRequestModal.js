import { useEffect, useRef, useState, useContext } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import {
  calculateFullTotalByType,
  fullDateConverter,
  getMaxFlatpickrDate,
  moneyFormat,
  moneyFormatVisual,
  ownerEarnCalculate,
  ownerEarnFeeCalculate,
  separateDate,
  renterPaysFeeCalculate,
  renterPaysCalculate,
} from "../../utils";
import OfferOwnPrice from "../SingleListings/OfferOwnPrice";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";

const CreateUpdateOrderRequestModal = ({
  handleCreateUpdateRequest,
  price: defaultPrice,
  fee,
  proposalPrice,
  proposalFinishTime,
  proposalStartTime,
  updateRequestModalActive,
  closeActiveUpdateRequest,
  minRentalDays,
  listingName,
  blockedDates,
  commissionType,
}) => {
  const baseStartTime = new Date();
  const baseFinishTime = new Date();

  const { error } = useContext(IndiceContext);

  const [price, setPrice] = useState(defaultPrice);
  const [offerPriceActive, setOfferPriceActive] = useState(false);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const calendarContainer = useRef(null);
  const prevCalendarContainer = useRef(null);
  const calendarRef = useRef(null);
  const prevCalendarRef = useRef(null);

  useEffect(() => {
    setPrice(defaultPrice);
  }, [defaultPrice]);

  const [finishTime, setFinishTime] = useState(baseFinishTime);
  const [startTime, setStartTime] = useState(baseStartTime);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ price, fee }) => {
    if (commissionType == "sum") {
      setTotalPrice(renterPaysCalculate(price, fee));
      setTotalFee(renterPaysFeeCalculate(price, fee));
    } else {
      setTotalPrice(ownerEarnCalculate(price, fee));
      setTotalFee(ownerEarnFeeCalculate(price, fee));
    }

    setFullTotal(calculateFullTotalByType(price, fee, commissionType));
  };

  const handleChangeDates = (dates) => {
    let [from, to] = dates;
    const fromTime = from ? new Date(from) : null;
    let toTime = to ? new Date(to) : null;

    if (fromTime > toTime) {
      toTime = new Date(fromTime);
    }

    if (from && to) {
      setFinishTime(fromTime);
      setStartTime(toTime);
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
      mode: "single",
      dateFormat: "M j, Y H:i",
      minDate: "today",
      maxDate: getMaxFlatpickrDate(),
      static: true,
      defaultDate: [finishTime, startTime],
      enableTime: true,
      time_24hr: true,
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
      dateFormat: "M j, Y H:i",
      defaultDate: [new Date(proposalStartTime), new Date(proposalFinishTime)],
      monthSelectorType: "static",
      onChange: (selectedDates, dateStr, instance) => {
        instance.setDate(`${proposalStartTime} to ${proposalFinishTime}`);
      },

      enableTime: true,
      time_24hr: true,
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
  }, [finishTime, startTime, proposalFinishTime, proposalStartTime]);

  useEffect(() => {
    recalculateTotalInfo({
      price,
      fee,
    });
  }, [price, fee]);

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
      proposalFinishTime == separateDate(finishTime) &&
      proposalStartTime == separateDate(startTime)
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
      price: price,
      finishTime: separateDate(finishTime),
      startTime: separateDate(startTime),
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
              body={`Rental '${listingName}' period will be from ${fullDateConverter(
                proposalStartTime
              )} to ${fullDateConverter(
                proposalFinishTime
              )} by ${moneyFormatVisual(fullTotal)}`}
            />
          </div>
        </div>
        <div className="border-top d-flex justify-content-between">
          <div className="d-flex flex-column mt-4 ">
            <div>
              <b>Duration:</b> {fullDateConverter(startTime)} -{" "}
              {fullDateConverter(finishTime)}
            </div>

            <div>
              <b>Proposal Price:</b> ${moneyFormat(defaultPrice)}{" "}
              {!(price != defaultPrice) && (
                <i
                  className="bx bx-pencil ms-1"
                  onClick={handleOfferYourPrice}
                  style={{ cursor: "pointer" }}
                ></i>
              )}
            </div>

            {price != defaultPrice && (
              <div>
                <b>Offered price:</b> ${moneyFormat(price)}{" "}
                <i
                  className="bx bx-pencil ms-1"
                  onClick={handleOfferYourPrice}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            )}

            <div>
              <b>Fee:</b> {moneyFormat(totalFee)}
            </div>

            <div className="total-booking-price">
              <b>
                Total: <span>{moneyFormatVisual(fullTotal)}</span>
              </b>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4 align-items-end">
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

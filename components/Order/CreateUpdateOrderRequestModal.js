import { useEffect, useRef, useState, useContext } from "react";
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
import OfferOwnPrice from "../SingleListings/OfferOwnPrice";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";

const CreateUpdateOrderRequestModal = ({
  handleCreateUpdateRequest,
  price: defaultPrice,
  fee,
  proposalPrice,
  proposalStartDate,
  proposalEndDate,
  updateRequestModalActive,
  setUpdateRequestModalActive,
  minRentalDays,
  listingName,
  blockedDates,
  commissionType
}) => {
  const proposalCountDays = getDaysDifference(
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

  const [fromDate, setFromDate] = useState(baseFromDate);
  const [toDate, setToDate] = useState(baseToDate);
  const [calendarError, setCalendarError] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ fromDate, toDate, price, fee }) => {
    const countDays = getDaysDifference(fromDate, toDate);

    setTotalPrice(calculateTotalPriceByDaysCount(countDays, price, fee));
    setTotalFee(calculateFeeByDaysCount(countDays, price, fee));
    setFullTotal(calculateFullTotalByDaysCount(countDays, price, fee, commissionType));
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

    return () => {
      if (calendar.destroy) {
        calendar.destroy();
      }

      if (prevCalendar.destroy) {
        prevCalendar.destroy();
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

    if (
      proposalPrice == price &&
      proposalStartDate == separateDate(fromDate) &&
      proposalEndDate == separateDate(toDate)
    ) {
      error.set(
        "You cannot submit these changes as they are the same as proposed"
      );
      hasError = true;
    } else {
      handleCreateUpdateRequest({
        price,
        fromDate: separateDate(fromDate),
        toDate: separateDate(toDate),
      });
    }

    if (hasError) {
      return;
    }

    setActiveAcceptSendBookingRequest(true);
  };

  const handleSendBookingRequest = () => {
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
      toggleActive={() => setUpdateRequestModalActive(false)}
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

      <div className="mt-3 booking-form left-scrollable">
        <div className="row">
          <div className="col col-12 col-md-6">
            <span className="sub-title mb-2 d-flex d-md-none">
              <span>Current offer</span>
            </span>

            <div className="flatpickr-parent-wrapper popup-widget">
              <div ref={prevCalendarContainer}></div>
            </div>

            <div className="popup-widget order-info-widget">
              <div>Offered Price Per Day: ${proposalPrice}</div>
              {fee && <div>Fee: {fee}%</div>}
              {fee && (
                <div>
                  Price: $
                  {calculateTotalPriceByDaysCount(
                    proposalCountDays,
                    proposalPrice,
                    fee
                  )}
                </div>
              )}
              {fee && (
                <div>
                  Total Fee: $
                  {calculateFeeByDaysCount(
                    proposalCountDays,
                    proposalPrice,
                    fee
                  )}
                </div>
              )}
              <div style={{ fontWeight: 700 }}>
                Total: $
                {calculateFullTotalByDaysCount(
                  proposalCountDays,
                  proposalPrice,
                  fee,
                  commissionType
                )}
              </div>
            </div>
          </div>
          <div className="col col-12 col-md-6">
            <span className="sub-title mb-2 d-flex d-md-none">
              <span>Your offer</span>
            </span>

            <div className="flatpickr-parent-wrapper popup-widget">
              <div ref={calendarContainer}></div>
              <ErrorSpan error={calendarError} />
            </div>

            <div className="popup-widget order-info-widget">
              <div className="d-flex align-items-center">
                Listing Price Per Day: ${defaultPrice}{" "}
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
                  Offered price: ${price}{" "}
                  <i
                    className="bx bx-pencil ms-1"
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
              title="Please confirm new booking conditions"
              onAccept={handleSendBookingRequest}
              acceptText="Confirm"
              body={
                fromDate.toDateString() == toDate.toDateString()
                  ? `'${listingName}' rental during ${fromDate.toDateString()} for $${price} per day`
                  : `'${listingName}' rental from ${fromDate.toDateString()} to ${toDate.toDateString()} for $${price} per day`
              }
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateUpdateOrderRequestModal;

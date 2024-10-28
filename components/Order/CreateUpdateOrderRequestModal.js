import { useEffect, useRef, useState, useContext } from "react";
import BaseModal from "../_App/BaseModal";
import flatpickr from "flatpickr";
import {
  calculateFee,
  calculateFullTotalByType,
  fullDateConverter,
  getMaxFlatpickrDate,
  moneyFormat,
  moneyFormatVisual,
  ownerGetsCalculate,
  separateDate,
  workerPaymentCalculate,
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
  proposalFinishTime,
  updateRequestModalActive,
  closeActiveUpdateRequest,
  listingName,
  commissionType,
}) => {
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

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [fullTotal, setFullTotal] = useState(0);

  const recalculateTotalInfo = ({ price, fee }) => {
    if (commissionType == "sum") {
      setTotalPrice(workerPaymentCalculate(price, fee));
      setTotalFee(calculateFee(price, fee, true));
    } else {
      setTotalPrice(ownerGetsCalculate(price, fee));
      setTotalFee(calculateFee(price, fee, false));
    }

    setFullTotal(calculateFullTotalByType(price, fee, commissionType));
  };

  useEffect(() => {
    const calendar = flatpickr(calendarContainer.current, {
      inline: true,
      mode: "single",
      dateFormat: "M j, Y H:i",
      minDate: "today",
      maxDate: getMaxFlatpickrDate(),
      static: true,
      defaultDate: [finishTime],
      enableTime: true,
      time_24hr: true,
      monthSelectorType: "static",
      onReady: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
      },
      onChange: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
        setFinishTime(selectedDates[0]);
      },
      disableMobile: true,
    });

    calendarRef.current = calendar;

    const prevCalendar = flatpickr(prevCalendarContainer.current, {
      inline: true,
      mode: "single",
      dateFormat: "M j, Y H:i",
      defaultDate: [proposalFinishTime],
      monthSelectorType: "static",
      onChange: (selectedDates, dateStr, instance) => {
        instance.setDate(`${proposalFinishTime}`);
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
  }, [finishTime, proposalFinishTime]);

  useEffect(() => {
    recalculateTotalInfo({
      price,
      fee,
    });
  }, [price, fee]);

  const handleSubmit = () => {
    let hasError = false;

    if (
      proposalPrice == price &&
      proposalFinishTime == separateDate(finishTime)
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
              body={`'${listingName}' task will be completed by ${fullDateConverter(
                proposalFinishTime
              )} by ${moneyFormatVisual(fullTotal)}`}
            />
          </div>
        </div>
        <div className="border-top d-flex justify-content-between">
          <div className="d-flex flex-column mt-4 ">
            <div>
              <b>Finish Time:</b> {fullDateConverter(finishTime)}
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

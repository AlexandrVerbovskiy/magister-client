import { useState } from "react";
import ItemInfo from "./OrderApprovementParts/ItemInfo";
import OwnerInfo from "./OrderApprovementParts/OwnerInfo";
import RentalMessage from "./OrderApprovementParts/RentalMessage";
import ContractDetails from "./OrderApprovementParts/ContractDetails";
import {
  calculateFeeByDaysCount,
  getDaysDifference,
  getFactOrderDays,
  validateBigText,
} from "../../utils";
import YesNoRentalModal from "./OrderApprovementParts/YesNoRentalModal";

const OrderExtendApprovementSection = ({
  setCurrentOpenImg,
  listing,
  handleGoBack,
  fromDate,
  toDate,
  price,
  fee,
  setToDate,
  setFromDate,
  blockedDates,
  minRentalDays,
}) => {
  const [feeActive, setFeeActive] = useState(false);
  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const handleApprove = () => {
    handleApprove({ feeActive, sendingMessage });
    setActiveAcceptSendBookingRequest(false);
  };

  const duration = getFactOrderDays(fromDate, toDate);
  const subtotalPrice = price * duration;
  const totalFee = calculateFeeByDaysCount(duration, price, fee, true);
  const totalPrice = subtotalPrice + totalFee;

  const onSendClick = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!sendingMessage.trim()) {
      hasError = true;
      setSendingMessageError("Required field");
    }

    if (validateBigText(sendingMessage) !== true) {
      hasError = true;
      setSendingMessageError(validateBigText(sendingMessage));
    }

    if (fromDate > toDate) {
      hasError = true;
      setDateError('"From date" can\'t be larger than "To date"');
    }

    if (minRentalDays && getDaysDifference(fromDate, toDate) < minRentalDays) {
      hasError = true;
      setDateError(
        `Rental duration can't be lower than ${getDaysDifference(
          fromDate,
          toDate
        )} days`
      );
    }

    if (hasError) {
      return;
    }

    setActiveAcceptSendBookingRequest(true);
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="listings-sidebar mt-0">
          <div className="row">
            <div className="col-12 col-md-6">
              <ItemInfo
                setCurrentOpenImg={setCurrentOpenImg}
                listing={listing}
              />
            </div>

            <div className="col-12 col-md-6 mt-4 mt-md-0">
              <OwnerInfo
                data={{
                  userName: listing.userName,
                  userPhoto: listing.userPhoto,
                  userCountItems: listing.userCountItems,
                  userAverageRating: listing.ownerAverageRating,
                  userCommentCount: listing.ownerCommentCount,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="row listings-details-desc">
          {
            <div className="col-12 col-md-8 order-2 order-md-1">
              <RentalMessage
                handleApprove={handleApprove}
                handleGoBack={handleGoBack}
                setSendingMessage={setSendingMessage}
                sendingMessage={sendingMessage}
                fromDate={fromDate}
                toDate={toDate}
                price={price}
                listing={listing}
                minRentalDays={minRentalDays}
                totalPrice={totalPrice}
                sendingMessageError={sendingMessageError}
                setSendingMessageError={setSendingMessageError}
                onSendClick={onSendClick}
              />
            </div>
          }
          <div className="col-12 col-md-4 order-1 order-md-2">
            <div className="listings-sidebar mt-0">
              <ContractDetails
                needFeeSwitch={true}
                totalPrice={totalPrice}
                feeActive={feeActive}
                setFeeActive={setFeeActive}
                fromDate={fromDate}
                toDate={toDate}
                price={price}
                setToDate={setToDate}
                setFromDate={setFromDate}
                blockedDates={blockedDates}
                subtotalPrice={subtotalPrice}
                dateError={dateError}
                duration={duration}
                totalFee={totalFee}
                setDateError={setDateError}
              />
            </div>
          </div>
        </div>
      </div>

      <YesNoRentalModal
        fromDate={fromDate}
        toDate={toDate}
        price={price}
        listing={listing}
        handleApprove={handleApprove}
        totalPrice={totalPrice}
        activeAcceptSendBookingRequest={activeAcceptSendBookingRequest}
        setActiveAcceptSendBookingRequest={setActiveAcceptSendBookingRequest}
      />
    </div>
  );
};

export default OrderExtendApprovementSection;

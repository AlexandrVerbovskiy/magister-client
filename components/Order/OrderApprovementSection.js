import { useState } from "react";
import ItemInfo from "./OrderApprovementParts/ItemInfo";
import OwnerInfo from "./OrderApprovementParts/OwnerInfo";
import ContractDetails from "./OrderApprovementParts/ContractDetails";
import RentalMessage from "./OrderApprovementParts/RentalMessage";
import { calculateFeeByDaysCount, getFactOrderDays, validateBigText } from "../../utils";
import YesNoRentalModal from "./OrderApprovementParts/YesNoRentalModal";

const OrderApprovementSection = ({
  handleApprove: baseHandleApprove,
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
    baseHandleApprove({ feeActive, sendingMessage });
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

    if (minRentalDays && getFactOrderDays(fromDate, toDate) < minRentalDays) {
      hasError = true;
      setDateError(
        `Rental duration can't be lower than ${getFactOrderDays(
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
      <div className="col-lg-8 col-md-12">
        <div className="listings-details-desc">
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
      </div>
      <div className="col-lg-4 col-md-12">
        <div className="listings-sidebar">
          <ContractDetails
            needFeeSwitch={true}
            feeActive={feeActive}
            setFeeActive={setFeeActive}
            fromDate={fromDate}
            toDate={toDate}
            price={price}
            setToDate={setToDate}
            setFromDate={setFromDate}
            blockedDates={blockedDates}
            totalPrice={totalPrice}
            subtotalPrice={subtotalPrice}
            dateError={dateError}
            duration={duration}
            totalFee={totalFee}
            setDateError={setDateError}
          />

          <ItemInfo setCurrentOpenImg={setCurrentOpenImg} listing={listing} />
          <OwnerInfo
            data={{
              userName: listing.userName,
              userPhoto: listing.userPhoto,
              userCountItems: listing.userCountItems,
              userAverageRating: listing.userAverageRating,
              userCommentCount: listing.userCommentCount,
            }}
          />
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

export default OrderApprovementSection;

import { useState } from "react";
import ItemInfo from "./OrderApprovementParts/ItemInfo";
import OwnerInfo from "./OrderApprovementParts/OwnerInfo";
import ContractDetails from "./OrderApprovementParts/ContractDetails";
import RentalMessage from "./OrderApprovementParts/RentalMessage";
import { validateBigText, renterGetsFeeCalculate } from "../../utils";
import YesNoRentalModal from "./OrderApprovementParts/YesNoRentalModal";

const OrderApprovementSection = ({
  handleApprove: baseHandleApprove,
  setCurrentOpenImg,
  listing,
  handleGoBack,
  finishTime,
  startTime,
  price,
  fee,
  setStartTime,
  setFinishTime,
}) => {
  const [sendingMessage, setSendingMessage] = useState("");
  const [sendingMessageError, setSendingMessageError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [activeAcceptSendBookingRequest, setActiveAcceptSendBookingRequest] =
    useState(false);

  const handleApprove = () => {
    baseHandleApprove({ sendingMessage });
    setActiveAcceptSendBookingRequest(false);
  };

  const totalFee = renterGetsFeeCalculate(price, fee);
  const totalPrice = price + totalFee;

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
            price={price}
            listing={listing}
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
            startTime={startTime}
            finishTime={finishTime}
            setStartTime={setStartTime}
            setFinishTime={setFinishTime}
            totalPrice={totalPrice}
            dateError={dateError}
            totalFee={totalFee}
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
        startTime={startTime}
        finishTime={finishTime}
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

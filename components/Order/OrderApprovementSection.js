import { useState } from "react";
import ItemInfo from "./OrderApprovementParts/ItemInfo";
import OwnerInfo from "./OrderApprovementParts/OwnerInfo";
import ContractDetails from "./OrderApprovementParts/ContractDetails";
import RentalMessage from "./OrderApprovementParts/RentalMessage";
import {
  validateBigText,
  renterPaysFeeCalculate,
  getPriceByDays,
} from "../../utils";
import YesNoRentalModal from "./OrderApprovementParts/YesNoRentalModal";

const OrderApprovementSection = ({
  handleApprove: baseHandleApprove,
  setCurrentOpenImg,
  listing,
  handleGoBack,
  finishDate,
  startDate,
  price,
  fee,
  setStartDate,
  setFinishDate,
  disputeProbability,
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

  const clearPrice = getPriceByDays(price, startDate, finishDate);
  const totalFee = renterPaysFeeCalculate(clearPrice, fee);
  const totalPrice = clearPrice + totalFee;

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
            price={clearPrice}
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
            startDate={startDate}
            finishDate={finishDate}
            setStartDate={setStartDate}
            setFinishDate={setFinishDate}
            price={price}
            dateError={dateError}
            fee={fee}
          />

          <div className="listings-widget">
            <div className="author">
              <div className="d-flex align-items-center">
                <div className="title row-dots-end">
                  <h4
                    className={`row-dots-end ${
                      disputeProbability === null
                        ? ""
                        : disputeProbability < 34
                        ? "text-success"
                        : disputeProbability < 67
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    Dispute probability:{" "}
                    {disputeProbability === null
                      ? "-"
                      : `${disputeProbability}%`}
                  </h4>
                </div>
              </div>
            </div>
          </div>

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
        startDate={startDate}
        finishDate={finishDate}
        price={clearPrice}
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

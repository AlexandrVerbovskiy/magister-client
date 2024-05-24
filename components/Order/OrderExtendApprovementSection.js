import { useState } from "react";
import ItemInfo from "./OrderApprovementParts/ItemInfo";
import OwnerInfo from "./OrderApprovementParts/OwnerInfo";
import RentalMessage from "./OrderApprovementParts/RentalMessage";
import ContractDetails from "./OrderApprovementParts/ContractDetails";

const OrderExtendApprovementSection = ({
  handleApprove,
  setCurrentOpenImg,
  listing,
  handleGoBack,
  fromDate,
  toDate,
  price,
  fee,
}) => {
  const [feeActive, setFeeActive] = useState(false);
  const [sendingMessage, setSendingMessage] = useState("");

  const onApproved = () => {
    handleApprove({ feeActive, sendingMessage });
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
              <OwnerInfo listing={listing} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="row listings-details-desc">
          {<div className="col-12 col-md-8 order-2 order-md-1">
            <RentalMessage
              onApproved={onApproved}
              handleGoBack={handleGoBack}
              setSendingMessage={setSendingMessage}
              sendingMessage={sendingMessage}
              fromDate={fromDate}
              toDate={toDate}
              price={price}
              listing={listing}
            />
  </div>}
          <div className="col-12 col-md-4 order-1 order-md-2">
            <div className="listings-sidebar mt-0">
              <ContractDetails
                fee={fee}
                feeActive={feeActive}
                setFeeActive={setFeeActive}
                fromDate={fromDate}
                toDate={toDate}
                price={price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderExtendApprovementSection;

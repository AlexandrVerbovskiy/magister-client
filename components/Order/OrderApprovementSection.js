import { useState } from "react";
import ItemInfo from "./OrderApprovementParts/ItemInfo";
import OwnerInfo from "./OrderApprovementParts/OwnerInfo";
import ContractDetails from "./OrderApprovementParts/ContractDetails";
import RentalMessage from "./OrderApprovementParts/RentalMessage";

const OrderApprovementSection = ({
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
      <div className="col-lg-8 col-md-12">
        <div className="listings-details-desc">
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
        </div>
      </div>
      <div className="col-lg-4 col-md-12">
        <div className="listings-sidebar">
          <ContractDetails
            needFeeSwitch={true}
            fee={fee}
            feeActive={feeActive}
            setFeeActive={setFeeActive}
            fromDate={fromDate}
            toDate={toDate}
            price={price}
          />

          <ItemInfo setCurrentOpenImg={setCurrentOpenImg} listing={listing} />
          <OwnerInfo
            data={{
              userName: listing.userName,
              userPhoto: listing.userPhoto,
              userCountItems: listing.userCountItems,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderApprovementSection;

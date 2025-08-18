import { useContext } from "react";
import {
  getListingImageByType,
  autoMultiEnding,
  dateConverter,
  moneyFormatVisual,
} from "../../utils";
import StatusBlock from "../Listings/StatusBlock";
import { IndiceContext } from "../../contexts";
import OrderMessageActions from "./OrderMessageActions";

const OrderInfoMessageContent = ({
  price,
  content,
  entity,
  type,
  title,
  senderId,
  popupsData,
  hasDescription = false,
  finishDate,
  startDate,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="mb-2">
        <b>{title}</b>
      </div>
      <img
        height="100px"
        className="small-message-media"
        src={getListingImageByType(
          content.listingPhotoPath,
          content.listingPhotoType
        )}
        style={{ width: "200px", height: "200px" }}
      />

      <div className="my-1">
        <b>Price: {moneyFormatVisual(price)}</b>
      </div>

      <div className="mb-1">
        {dateConverter(startDate)}-{dateConverter(finishDate)}
      </div>

      <div className="mb-1">
        <StatusBlock
          status={entity.status}
          statusCancelled={entity.cancelStatus}
          disputeStatus={entity.disputeStatus}
          ownerId={entity.ownerId}
          renterId={entity.renterId}
          userId={sessionUser?.id}
          payedId={entity.paymentInfo?.id}
          adminApproved={entity.paymentInfo?.adminApproved}
          waitingApproved={entity.paymentInfo?.waitingApproved}
          needBackground={false}
        />
      </div>
      {hasDescription && (
        <div className="w-100 mb-1">
          <b>Description: </b> {content.description}
        </div>
      )}
      <OrderMessageActions
        type={type}
        order={entity}
        content={content}
        senderId={senderId}
        popupsData={popupsData}
      />
    </div>
  );
};

export default OrderInfoMessageContent;

import { useContext } from "react";
import {
  getListingImageByType,
  moneyFormat,
  autoMultiEnding,
  dateConverter,
  moneyFormatVisual,
} from "../../utils";
import StatusBlock from "../Listings/StatusBlock";
import { IndiceContext } from "../../contexts";
import OrderMessageActions from "./OrderMessageActions";
import STATIC from "../../static";

const OrderInfoMessageContent = ({
  totalPrice,
  content,
  entity,
  type,
  duration,
  title,
  senderId,
  popupsData,
  extensionPopupsData = null,
  hasDescription = false,
  isExtensionActions = false,
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
        <b>Total price: {moneyFormatVisual(totalPrice)}</b>
      </div>

      <div className="mb-1">
        {duration} {autoMultiEnding(duration, "day")} (
        {dateConverter(content.offerStartDate)} -{" "}
        {dateConverter(content.offerEndDate)})
      </div>
      <div className="mb-1">
        <StatusBlock
          status={entity.status}
          statusCancelled={entity.cancelStatus}
          disputeStatus={entity.disputeStatus}
          ownerId={entity.ownerId}
          tenantId={entity.tenantId}
          userId={sessionUser?.id}
          endDate={entity.offerEndDate}
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
        extensionPopupsData={extensionPopupsData}
        isExtensionActions={isExtensionActions}
      />
    </div>
  );
};

export default OrderInfoMessageContent;

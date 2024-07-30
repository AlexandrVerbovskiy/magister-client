import {
  autoMultiEnding,
  dateConverter,
  getListingImageByType,
  moneyFormat,
} from "../../../utils";
import StatusBlock from "../Orders/Status";
import CancelStatus from "../Orders/CancelStatus";

const OrderInfoMessageContent = ({
  forOwnerPrice,
  forTenantPrice,
  content,
  duration,
  title,
  messageClassName,
  order,
  dispute,
  hasDescription = false,
}) => {
  return (
    <div className={`flex flex-col items-center ${messageClassName}`}>
      <div className="mb-2">
        <b>{title}</b>
      </div>
      <img
        height="100"
        className="small-message-media"
        src={getListingImageByType(
          content.listingPhotoPath,
          content.listingPhotoType
        )}
        style={{ width: "200px", height: "200px" }}
      />
      <div className="my-1">
        <b>Owner get: ${moneyFormat(forOwnerPrice)}</b>
        <b>Renter payed: ${moneyFormat(forTenantPrice)}</b>
      </div>
      <div className="mb-1">
        {duration} {autoMultiEnding(duration, "day")} (
        {dateConverter(content.offerDateStart)} -{" "}
        {dateConverter(content.offerDateEnd)})
      </div>
      <div className="my-2">
        {order.cancelStatus ? (
          <CancelStatus
            status={order.cancelStatus}
            baseClass="px-3 rounded-full shadow-2xl w-max"
          />
        ) : (
          <StatusBlock
            status={order.status}
            payedId={order.paymentInfo?.id}
            payedAdminApproved={order.paymentInfo?.adminApproved}
            payedWaitingApproved={order.paymentInfo?.waitingApproved}
            baseClass="px-3 rounded-full shadow-2xl w-max"
          />
        )}
      </div>
      {hasDescription && (
        <div className="w-full mb-1">
          <b>Description: </b> {content.description}
        </div>
      )}
    </div>
  );
};

export default OrderInfoMessageContent;
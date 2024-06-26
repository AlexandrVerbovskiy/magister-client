import { useContext } from "react";
import {
  getListingImageByType,
  moneyFormat,
  autoMultiEnding,
  dateConverter,
} from "../../utils";
import StatusBlock from "../Listings/StatusBlock";
import { IndiceContext } from "../../contexts";
import OrderMessageActions from "./OrderMessageActions";

const OrderInfoMessageContent = ({
  totalPrice,
  content,
  entity,
  popupsData,
  type,
  duration,
  title,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="mb-1">
        <b>{title}</b>
      </div>
      <img
        height="100px"
        className="small-message-media"
        src={getListingImageByType(
          content.listingPhotoPath,
          content.listingPhotoType
        )}
      />

      <div className="my-1">
        <b>Total price: ${moneyFormat(totalPrice)}</b>
      </div>

      <div className="mb-1">
        {duration} {autoMultiEnding(duration, "day")} (
        {dateConverter(content.offerDateStart)} -{" "}
        {dateConverter(content.offerDateEnd)})
      </div>
      <div>
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
      <div
        className="d-flex flex-column"
        style={{ gap: "10px", marginTop: "10px" }}
      >
        <OrderMessageActions
          type={type}
          order={entity}
          popupsData={popupsData}
          content={content}
        />
      </div>
    </div>
  );
};

export default OrderInfoMessageContent;

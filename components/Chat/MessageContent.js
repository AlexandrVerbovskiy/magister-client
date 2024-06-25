import { useContext } from "react";
import ENV from "../../env";
import STATIC from "../../static";
import {
  getListingImageByType,
  moneyFormat,
  autoMultiEnding,
  getDaysDifference,
  dateConverter,
  calculateCurrentTotalPrice,
} from "../../utils";
import StatusBlock from "../Listings/StatusBlock";
import { IndiceContext } from "../../contexts";
import OrderMessageActions from "./OrderMessageActions";

const MessageContent = ({ isTemp, type, content, entity }) => {
  const isOrder = entity["type"] == "order";
  const { sessionUser } = useContext(IndiceContext);

  if (type == STATIC.MESSAGE_TYPES.TEXT) {
    return <p dangerouslySetInnerHTML={{ __html: content.text }}></p>;
  }

  let src = "";

  if (
    [
      STATIC.MESSAGE_TYPES.IMAGE,
      STATIC.MESSAGE_TYPES.VIDEO,
      STATIC.MESSAGE_TYPES.AUDIO,
      STATIC.MESSAGE_TYPES.FILE,
    ].includes(type)
  ) {
    if (isTemp) {
      const blob = new Blob([content.path], { type: content.path["type"] });
      src = URL.createObjectURL(blob);
    } else {
      src = ENV.SERVER_URL + "/" + content.path;
    }
  }

  if (type === STATIC.MESSAGE_TYPES.IMAGE) {
    return <img height="200px" className="" src={src} />;
  }

  if (type === STATIC.MESSAGE_TYPES.VIDEO) {
    return <video height="200px" controls className="" src={src} />;
  }

  if (type === STATIC.MESSAGE_TYPES.AUDIO) {
    return <audio controls className="" src={src} />;
  }

  if (type === STATIC.MESSAGE_TYPES.FILE) {
    return (
      <a style={{ color: "inherit" }} className="d-flex" href={src} download>
        <div className="me-1">
          <i className="bx bxs-file"></i>
        </div>
        {content.filename}
      </a>
    );
  }

  if (isOrder) {
    if (type === STATIC.MESSAGE_TYPES.NEW_ORDER) {
      const totalPrice = calculateCurrentTotalPrice({
        startDate: content.offerDateStart,
        endDate: content.offerDateEnd,
        pricePerDay: content.offerPrice,
        type,
        isOwner: sessionUser.id == entity.ownerId,
        ownerFee: entity.ownerFee,
        tenantFee: entity.tenantFee,
      });

      const duration = getDaysDifference(
        content.offerDateStart,
        content.offerDateEnd
      );

      return (
        <div className="d-flex flex-column align-items-center">
          <div className="mb-1">
            <b>Request</b>
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
            {isOrder && <OrderMessageActions order={entity} />}
          </div>
        </div>
      );
    }
  }

  return <p>Unpredictable message</p>;
};

export default MessageContent;

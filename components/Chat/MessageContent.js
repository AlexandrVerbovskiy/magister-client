import { useContext } from "react";
import ENV from "../../env";
import STATIC from "../../static";
import { getDaysDifference, calculateCurrentTotalPrice } from "../../utils";
import { IndiceContext } from "../../contexts";
import OrderInfoMessageContent from "./OrderInfoMessageContent";

const MessageContent = ({ isTemp, type, content, entity, popupsData }) => {
  let src = "";
  const isOrder = entity["type"] == "order";
  const { sessionUser } = useContext(IndiceContext);

  if (type == STATIC.MESSAGE_TYPES.TEXT) {
    return <p dangerouslySetInnerHTML={{ __html: content.text }}></p>;
  }

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
    if (
      type === STATIC.MESSAGE_TYPES.NEW_ORDER ||
      type === STATIC.MESSAGE_TYPES.UPDATE_ORDER
    ) {
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
        <OrderInfoMessageContent
          totalPrice={totalPrice}
          content={content}
          entity={entity}
          popupsData={popupsData}
          type={type}
          duration={duration}
        />
      );
    }
  }

  return <p>Unpredictable message</p>;
};

export default MessageContent;

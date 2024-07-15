import { useContext } from "react";
import ENV from "../../env";
import STATIC from "../../static";
import { getFactOrderDays, calculateCurrentTotalPrice } from "../../utils";
import { IndiceContext } from "../../contexts";
import OrderInfoMessageContent from "./OrderInfoMessageContent";
import SuccessIcon from "../Icons/SuccessIcon";
import ErrorIcon from "../Icons/ErrorIcon";
import OrderUpdateStatusMessageContent from "./OrderUpdateStatusMessageContent";
import OrderMessageActions from "./OrderMessageActions";
import StarRating from "../StarRating";

const PointStarInfo = ({ label, value }) => {
  return (
    <div style={{ width: "120px" }}>
      <label>{label}</label>
      <StarRating
        averageRating={value}
        checked={true}
        checkedOnlyActive={true}
        uncheckedStarClassName="bxs-star"
        commentCount={1}
      />
    </div>
  );
};

const baseMessageContent = ({ isTemp, type, content }) => {
  let src = "";

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
    return (
      <img
        style={{ maxWidth: "200px", maxHeight: "200px" }}
        height="200px"
        className=""
        src={src}
      />
    );
  }

  if (type === STATIC.MESSAGE_TYPES.VIDEO) {
    return (
      <video
        style={{ maxWidth: "200px", maxHeight: "200px" }}
        height="200px"
        controls
        className=""
        src={src}
      />
    );
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

  return null;
};

const orderMessageContent = ({ type, content, entity, popupsData }) => {
  const { sessionUser } = useContext(IndiceContext);

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

    const duration = getFactOrderDays(
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
        title={
          type === STATIC.MESSAGE_TYPES.UPDATE_ORDER
            ? "Updating Request"
            : "Request"
        }
        hasDescription={type === STATIC.MESSAGE_TYPES.NEW_ORDER}
      />
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.ACCEPTED_ORDER,
      STATIC.MESSAGE_TYPES.TENANT_PAYED,
      STATIC.MESSAGE_TYPES.PENDED_TO_CLIENT,
      STATIC.MESSAGE_TYPES.FINISHED,
      STATIC.MESSAGE_TYPES.ACCEPTED_CANCEL_REQUEST,
    ].includes(type)
  ) {
    let title = "Proposal accepted";

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED) {
      title = "Paid for the rental";
    }

    if (type == STATIC.MESSAGE_TYPES.PENDED_TO_CLIENT) {
      title = "Got the item";
    }

    if (type == STATIC.MESSAGE_TYPES.FINISHED) {
      title = "Order finished";
    }

    if (type == STATIC.MESSAGE_TYPES.ACCEPTED_CANCEL_REQUEST) {
      title = "Confirmed the cancellation of the order";
    }

    return (
      <OrderUpdateStatusMessageContent
        content={content}
        entity={entity}
        popupsData={popupsData}
        type={type}
        title={title}
        Icon={SuccessIcon}
      />
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.CANCELED_ORDER,
      STATIC.MESSAGE_TYPES.REJECTED_ORDER,
      STATIC.MESSAGE_TYPES.CREATED_CANCEL_REQUEST,
    ].includes(type)
  ) {
    let title = "Order canceled";

    if (type == STATIC.MESSAGE_TYPES.REJECTED_ORDER) {
      title = "Proposal rejected";
    }

    if (type == STATIC.MESSAGE_TYPES.CREATED_CANCEL_REQUEST) {
      title = "Created cancel request";
    }

    return (
      <OrderUpdateStatusMessageContent
        content={content}
        entity={entity}
        popupsData={popupsData}
        type={type}
        title={title}
        Icon={ErrorIcon}
      />
    );
  }

  if (STATIC.MESSAGE_TYPES.STARTED_DISPUTE == type) {
    return (
      <div className="d-flex flex-column">
        <div className="text-center mb-2">
          <b>Started dispute</b>
        </div>

        <div className="my-1 text-start w-100">
          <b>Type: </b>
          {STATIC.DISPUTE_TYPE_TITLE[content.type]}
        </div>

        <div className="my-1 text-start w-100">
          <b>Description: </b>
          {content.description}
        </div>

        <div
          className="d-flex flex-column align-items-center"
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
  }

  if (STATIC.MESSAGE_TYPES.LISTING_REVIEW == type) {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="mb-2">
          <b>Listing review</b>
        </div>

        <div className="my-1">
          <div className="d-flex">
            <PointStarInfo label="Punctuality" value={content.punctuality} />
            <PointStarInfo label="General" value={content.generalExperience} />
            <PointStarInfo
              label="Communication"
              value={content.communication}
            />
          </div>

          <div className="d-flex">
            <PointStarInfo label="Reliability" value={content.reliability} />
            <PointStarInfo label="Kindness" value={content.kindness} />
            <PointStarInfo label="Flexibility" value={content.flexibility} />
          </div>
        </div>

        <div className="my-1 text-start w-100">
          <b>Description: </b>
          {content.description}
        </div>
      </div>
    );
  }

  if (STATIC.MESSAGE_TYPES.USER_REVIEW == type) {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="mb-2">
          <b>{content.type == "tenant" ? "Renter review" : "Owner review"}</b>
        </div>

        <div className="my-1">
          <div className="d-flex">
            <PointStarInfo label="Quality" value={content.quality} />
            <PointStarInfo label="Accuracy" value={content.listingAccuracy} />
            <PointStarInfo label="Utility" value={content.utility} />
          </div>

          <div className="d-flex">
            <PointStarInfo label="Condition" value={content.condition} />
            <PointStarInfo label="Performance" value={content.performance} />
            <PointStarInfo label="Location" value={content.location} />
          </div>
        </div>

        <div className="my-1 text-start w-100">
          <b>Description: </b>
          {content.description}
        </div>

        {content.leaveFeedback && (
          <div className="my-1 text-start w-100">
            <b>Private feedback: </b>
            {content.leaveFeedback}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const MessageContent = ({ isTemp, type, content, entity, popupsData }) => {
  const isOrder = entity["type"] == STATIC.CHAT_TYPES.ORDER;

  let messageContent = baseMessageContent({ isTemp, type, content });

  if (!messageContent && isOrder) {
    messageContent = orderMessageContent({ type, content, entity, popupsData });
  }

  if (!messageContent) {
    messageContent = <p>Unpredictable message</p>;
  }

  return messageContent;
};

export default MessageContent;

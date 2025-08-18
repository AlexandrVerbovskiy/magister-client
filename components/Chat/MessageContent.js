import { useContext } from "react";
import STATIC from "../../static";
import {
  getFactOrderDays,
  autoCalculateCurrentTotalPrice,
  getDisputeTitle,
  getFilePath,
  getPriceByDays,
} from "../../utils";
import { IndiceContext } from "../../contexts";
import OrderInfoMessageContent from "./OrderInfoMessageContent";
import SuccessIcon from "../Icons/SuccessIcon";
import ErrorIcon from "../Icons/ErrorIcon";
import OrderUpdateStatusMessageContent from "./OrderUpdateStatusMessageContent";
import OrderMessageActions from "./OrderMessageActions";
import StarRating from "../StarRating";

const PointStarInfo = ({
  label,
  value,
  commentName = "item",
  width = "120px",
}) => {
  return (
    <div style={{ width: width }}>
      <label>{label}</label>
      <StarRating
        averageRating={value}
        checked={true}
        checkedOnlyActive={true}
        uncheckedStarClassName="bxs-star"
        commentCount={1}
        needCommentsCount={false}
        commentName={commentName}
      />
    </div>
  );
};

const OwnerCommentMessage = ({ content }) => {
  const items = [
    {
      label: "Item description accuracy",
      value: content.itemDescriptionAccuracy,
    },
    { label: "Photo accuracy", value: content.photoAccuracy },
    { label: "Cleanliness", value: content.cleanliness },
    { label: "Pickup condition", value: content.pickupCondition },
    { label: "Responsiveness", value: content.responsiveness },
    { label: "Clarity", value: content.clarity },
    { label: "Scheduling flexibility", value: content.schedulingFlexibility },
    { label: "Issue resolution", value: content.issueResolution },
  ];

  const chunkedItems = [];
  for (let i = 0; i < items.length; i += 2) {
    chunkedItems.push(items.slice(i, i + 2));
  }

  return (
    <div className="my-1">
      {chunkedItems.map((chunk, index) => (
        <div className="d-flex" key={index}>
          {chunk.map((item, idx) => (
            <PointStarInfo
              width="200px"
              key={idx}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const RenterCommentMessage = ({ content }) => {
  const items = [
    { label: "Care", value: content.care },
    { label: "Timeliness", value: content.timeliness },
    { label: "Responsiveness", value: content.responsiveness },
    { label: "Clarity", value: content.clarity },
    { label: "Usage Guidelines", value: content.usageGuidelines },
    { label: "Terms of service", value: content.termsOfService },
    { label: "Honesty", value: content.honesty },
    { label: "Reliability", value: content.reliability },
    { label: "Satisfaction", value: content.satisfaction },
  ];

  const chunkedItems = [];
  for (let i = 0; i < items.length; i += 2) {
    chunkedItems.push(items.slice(i, i + 2));
  }

  return (
    <div className="my-1">
      {chunkedItems.map((chunk, index) => (
        <div className="d-flex" key={index}>
          {chunk.map((item, idx) => (
            <PointStarInfo
              width="200px"
              key={idx}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      ))}
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
      src = content.path;
    } else {
      src = getFilePath(content.path);
    }
  }

  if (type === STATIC.MESSAGE_TYPES.IMAGE) {
    return (
      <img
        style={{ maxWidth: "200px", maxHeight: "280px" }}
        height="200px"
        className=""
        src={src}
      />
    );
  }

  if (type === STATIC.MESSAGE_TYPES.VIDEO) {
    return (
      <video
        style={{ maxWidth: "200px", maxHeight: "280px" }}
        height="280px"
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

const orderMessageContent = ({
  type,
  content,
  entity,
  popupsData,
  senderId,
}) => {
  const { sessionUser } = useContext(IndiceContext);

  if (
    type === STATIC.MESSAGE_TYPES.NEW_ORDER ||
    type === STATIC.MESSAGE_TYPES.UPDATE_ORDER
  ) {
    const totalPrice = autoCalculateCurrentTotalPrice({
      price: getPriceByDays(
        content.offerPrice,
        content.offerStartDate,
        content.offerFinishDate
      ),
      type,
      isOwner: sessionUser?.id == entity.ownerId,
      ownerFee: entity.ownerFee,
      renterFee: entity.renterFee,
    });

    let title = "Request";

    if (type === STATIC.MESSAGE_TYPES.UPDATE_ORDER) {
      title = "Updating Request";
    }

    return (
      <OrderInfoMessageContent
        price={totalPrice}
        content={content}
        entity={entity}
        type={type}
        title={title}
        hasDescription={type === STATIC.MESSAGE_TYPES.NEW_ORDER}
        senderId={senderId}
        popupsData={popupsData}
        finishDate={content.offerFinishDate}
        startDate={content.offerStartDate}
      />
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.ACCEPTED_ORDER,
      STATIC.MESSAGE_TYPES.RENTER_PAYED,
      STATIC.MESSAGE_TYPES.RENTER_PAYED_WAITING,
      STATIC.MESSAGE_TYPES.WAITING_FINISHED_APPROVE,
      STATIC.MESSAGE_TYPES.FINISHED,
      STATIC.MESSAGE_TYPES.ACCEPTED_CANCEL_REQUEST,
    ].includes(type)
  ) {
    let title = "Proposal accepted";
    let style = {};
    let description = "";

    if (type == STATIC.MESSAGE_TYPES.RENTER_PAYED) {
      title = "Payment successfully";
    }

    if (type == STATIC.MESSAGE_TYPES.RENTER_PAYED_WAITING) {
      title = "Request for confirmation of rent payment was successfully sent";
      style = { maxWidth: "200px", textAlign: "center" };
    }

    if (type == STATIC.MESSAGE_TYPES.WAITING_FINISHED_APPROVE) {
      title = "Waiting owner approve";
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
        type={type}
        title={title}
        Icon={SuccessIcon}
        style={style}
        senderId={senderId}
        popupsData={popupsData}
        description={description}
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
        type={type}
        title={title}
        Icon={ErrorIcon}
        senderId={senderId}
        popupsData={popupsData}
      />
    );
  }

  if (STATIC.MESSAGE_TYPES.STARTED_DISPUTE == type) {
    let senderName =
      entity.ownerId == senderId ? entity.ownerName : entity.renterName;

    if (sessionUser?.id == senderId) {
      senderName = "You";
    }

    return (
      <div className="d-flex flex-column">
        <div className="text-center mb-2">
          <b>{senderName} started dispute</b>
        </div>

        <div className="my-1 text-start w-100">
          <b>Type: </b>
          {getDisputeTitle(content.type)}
        </div>

        <div className="my-1 text-start w-100">
          <b>Description: </b>
          {content.description}
        </div>

        <OrderMessageActions
          type={type}
          order={entity}
          content={content}
          senderId={senderId}
          popupsData={popupsData}
        />
      </div>
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.OWNER_REVIEW,
      STATIC.MESSAGE_TYPES.RENTER_REVIEW,
    ].includes(type)
  ) {
    const isRenterReview = type == STATIC.MESSAGE_TYPES.RENTER_REVIEW;

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="mb-2">
          <b>{isRenterReview ? "Renter review" : "Owner review"}</b>
        </div>

        {isRenterReview ? (
          <RenterCommentMessage content={content} />
        ) : (
          <OwnerCommentMessage content={content} />
        )}

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

const MessageContent = ({
  isTemp,
  type,
  content,
  entity,
  popupsData,
  senderId,
}) => {
  const isOrder = entity["type"] == STATIC.CHAT_TYPES.ORDER;

  let messageContent = baseMessageContent({ isTemp, type, content });

  if (!messageContent && isOrder) {
    messageContent = orderMessageContent({
      type,
      content,
      entity,
      popupsData,
      senderId,
    });
  }

  if (!messageContent) {
    messageContent = <p>Unpredictable message</p>;
  }

  return messageContent;
};

export default MessageContent;

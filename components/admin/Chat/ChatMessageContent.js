import STATIC from "../../../static";
import OrderInfoMessageContent from "./OrderInfoMessageContent";
import OrderUpdateStatusMessageContent from "./OrderUpdateStatusMessageContent";
import SuccessIcon from "../../Icons/SuccessIcon";
import ErrorIcon from "../../Icons/ErrorIcon";
import SingleRatingStar from "../SingleRatingStar";
import ENV from "../../../env";
import { calculateCurrentTotalPrice, getFactOrderDays } from "../../../utils";

const DownloadButton = ({ src }) => {
  return (
    <a
      href={src}
      type="button"
      className="p-1.5 rounded-full border border-slate-200 dark:border-slate-700 ml-4 hover:bg-white dark:hover:bg-slate-800 transition duration-150"
      download
    >
      <span className="sr-only">Download</span>
      <svg
        className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500"
        viewBox="0 0 16 16"
      >
        <path d="M15 15H1a1 1 0 01-1-1V2a1 1 0 011-1h4v2H2v10h12V3h-3V1h4a1 1 0 011 1v12a1 1 0 01-1 1zM9 7h3l-4 4-4-4h3V1h2v6z" />
      </svg>
    </a>
  );
};

const PointStarInfo = ({ label, value, commentName = "item" }) => {
  return (
    <div style={{ width: "150px" }}>
      <label>{label}</label>
      <SingleRatingStar commentName={commentName} value={value} count={1} />
    </div>
  );
};

const baseMessageContent = ({ isTemp, type, content, messageClassName }) => {
  let src = "";

  if (type == STATIC.MESSAGE_TYPES.TEXT) {
    return (
      <div
        className={`${messageClassName} w-max`}
        dangerouslySetInnerHTML={{ __html: content.text }}
      ></div>
    );
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
      <div className="flex items-center w-max">
        <img
          style={{ maxWidth: "200px", maxHeight: "200px" }}
          className="rounded-lg shadow-md mb-1"
          height="200px"
          src={src}
        />
        <DownloadButton src={src} />
      </div>
    );
  }

  if (type === STATIC.MESSAGE_TYPES.VIDEO) {
    return (
      <div className="flex items-center w-max">
        <video
          className="rounded-lg shadow-md mb-1"
          height="200px"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
          controls
          src={src}
        />
        <DownloadButton src={src} />
      </div>
    );
  }

  if (type === STATIC.MESSAGE_TYPES.AUDIO) {
    return (
      <div className="flex items-center w-max">
        <audio className="rounded-lg shadow-md mb-1" controls src={src} />
        <DownloadButton src={src} />
      </div>
    );
  }

  if (type === STATIC.MESSAGE_TYPES.FILE) {
    return (
      <div className="flex items-center w-max">
        <div className={messageClassName}>
          <a style={{ color: "inherit" }} href={src} download>
            <div className="me-1"></div>
            {content.filename}
          </a>
        </div>

        <DownloadButton src={src} />
      </div>
    );
  }

  return null;
};

const orderMessageContent = ({
  type,
  content,
  order,
  dispute,
  messageClassName,
}) => {
  if (
    type === STATIC.MESSAGE_TYPES.NEW_ORDER ||
    type === STATIC.MESSAGE_TYPES.UPDATE_ORDER
  ) {
    const forOwnerPrice = calculateCurrentTotalPrice({
      startDate: content.offerDateStart,
      endDate: content.offerDateEnd,
      pricePerDay: content.offerPrice,
      type,
      isOwner: true,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const forTenantPrice = calculateCurrentTotalPrice({
      startDate: content.offerDateStart,
      endDate: content.offerDateEnd,
      pricePerDay: content.offerPrice,
      type,
      isOwner: false,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const duration = getFactOrderDays(
      content.offerDateStart,
      content.offerDateEnd
    );

    return (
      <OrderInfoMessageContent
        messageClassName={messageClassName}
        forOwnerPrice={forOwnerPrice}
        forTenantPrice={forTenantPrice}
        content={content}
        duration={duration}
        order={order}
        dispute={dispute}
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
      STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING,
      STATIC.MESSAGE_TYPES.PENDED_TO_CLIENT,
      STATIC.MESSAGE_TYPES.FINISHED,
      STATIC.MESSAGE_TYPES.ACCEPTED_CANCEL_REQUEST,
    ].includes(type)
  ) {
    let title = "Proposal accepted";

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED) {
      title = "Paid for the rental";
    }

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING) {
      title = "Request for confirmation of rent payment was successfully sent";
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
        messageClassName={messageClassName}
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
        messageClassName={messageClassName}
        title={title}
        Icon={ErrorIcon}
      />
    );
  }

  if (STATIC.MESSAGE_TYPES.STARTED_DISPUTE == type) {
    return (
      <div className={`flex flex-col ${messageClassName} w-max`}>
        <div className="text-center mb-1">
          <b>Started dispute</b>
        </div>

        <div className="w-full">
          <b>Type: </b>
          {STATIC.DISPUTE_TYPE_TITLE[content.type]}
        </div>

        <div className="w-full">
          <b>Description: </b>
          {content.description}
        </div>
      </div>
    );
  }

  if (STATIC.MESSAGE_TYPES.LISTING_REVIEW == type) {
    return (
      <div className={`flex flex-col items-center ${messageClassName} w-max`}>
        <div className="mb-1">
          <b>Listing review</b>
        </div>

        <div className="mb-1">
          <div className="flex">
            <PointStarInfo label="Punctuality" value={content.punctuality} />
            <PointStarInfo label="General" value={content.generalExperience} />
            <PointStarInfo
              label="Communication"
              value={content.communication}
            />
          </div>

          <div className="flex">
            <PointStarInfo label="Reliability" value={content.reliability} />
            <PointStarInfo label="Kindness" value={content.kindness} />
            <PointStarInfo label="Flexibility" value={content.flexibility} />
          </div>
        </div>

        <div className="w-full">
          <b>Description: </b>
          {content.description}
        </div>
      </div>
    );
  }

  if (STATIC.MESSAGE_TYPES.USER_REVIEW == type) {
    const commentName = content.type == "tenant" ? "reviewer" : "owner";

    return (
      <div className={`flex flex-col items-center ${messageClassName} w-max`}>
        <div className="mb-1">
          <b>{content.type == "tenant" ? "Renter review" : "Owner review"}</b>
        </div>

        <div className="mb-1">
          <div className="flex">
            <PointStarInfo
              commentName={commentName}
              label="Quality"
              value={content.quality}
            />
            <PointStarInfo
              commentName={commentName}
              label="Accuracy"
              value={content.listingAccuracy}
            />
            <PointStarInfo
              commentName={commentName}
              label="Utility"
              value={content.utility}
            />
          </div>
          <div className="flex">
            <PointStarInfo
              commentName={commentName}
              label="Condition"
              value={content.condition}
            />
            <PointStarInfo
              commentName={commentName}
              label="Performance"
              value={content.performance}
            />
            <PointStarInfo
              commentName={commentName}
              label="Location"
              value={content.location}
            />
          </div>
        </div>

        <div className="w-full">
          <b>Description: </b>
          {content.description}
        </div>

        {content.leaveFeedback && (
          <div className="w-full mt-1">
            <b>Private feedback: </b>
            {content.leaveFeedback}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const ChatMessageContent = ({
  isTemp,
  type,
  content,
  order,
  dispute,
  messageClassName,
}) => {
  let messageContent = baseMessageContent({
    isTemp,
    type,
    content,
    messageClassName,
  });

  if (!messageContent) {
    messageContent = orderMessageContent({
      type,
      content,
      order,
      dispute,
      messageClassName,
    });
  }

  if (!messageContent) {
    messageContent = <div className="w-max">Unpredictable message</div>;
  }

  return messageContent;
};

export default ChatMessageContent;

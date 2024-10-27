import STATIC from "../../../static";
import OrderInfoMessageContent from "./OrderInfoMessageContent";
import OrderUpdateStatusMessageContent from "./OrderUpdateStatusMessageContent";
import SuccessIcon from "../../Icons/SuccessIcon";
import ErrorIcon from "../../Icons/ErrorIcon";
import SingleRatingStar from "../SingleRatingStar";
import {
  autoCalculateCurrentTotalPrice,
  getDisputeTitle,
  getFactOrderDays,
  getFilePath,
  getListingImageByType,
  moneyFormatVisual,
} from "../../../utils";
import CancelStatus from "../Orders/CancelStatus";
import StatusBlock from "../../Listings/StatusBlock";

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

const PointStarInfo = ({
  label,
  value,
  commentName = "item",
  width = "150px",
}) => {
  return (
    <div style={{ width: width }}>
      <label>{label}</label>
      <SingleRatingStar commentName={commentName} value={value} count={1} />
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
    { label: "Pickup condition", value: content.pickupCondition },
    { label: "Cleanliness", value: content.cleanliness },
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
    <div className="mb-1 w-full">
      {chunkedItems.map((chunk, index) => (
        <div className="flex w-full flex-wrap" key={index}>
          {chunk.map((item, idx) => (
            <PointStarInfo
              key={idx}
              label={item.label}
              value={item.value}
              width="230px"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const TenantCommentMessage = ({ content }) => {
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
    <div className="mb-1 w-full">
      {chunkedItems.map((chunk, index) => (
        <div className="flex w-full flex-wrap" key={index}>
          {chunk.map((item, idx) => (
            <PointStarInfo
              key={idx}
              label={item.label}
              value={item.value}
              width="230px"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const baseMessageContent = ({ isTemp, type, content, messageClassName }) => {
  let src = "";

  if (type == STATIC.MESSAGE_TYPES.TEXT) {
    return (
      <div
        className={`${messageClassName} w-max message-text-body`}
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
      src = getFilePath(content.path);
    }
  }

  if (type === STATIC.MESSAGE_TYPES.IMAGE) {
    return (
      <div className="flex items-center w-max">
        <img
          style={{ maxWidth: "200px", maxHeight: "280px" }}
          className="rounded-lg shadow-md mb-1"
          height="280px"
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
          height="280px"
          style={{ maxWidth: "200px", maxHeight: "280px" }}
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
  senderId,
}) => {
  const senderName =
    senderId == order.ownerId ? order.ownerName : order.tenantName;

  if (
    type === STATIC.MESSAGE_TYPES.NEW_ORDER ||
    type === STATIC.MESSAGE_TYPES.UPDATE_ORDER ||
    type === STATIC.MESSAGE_TYPES.NEW_EXTENSION ||
    type === STATIC.MESSAGE_TYPES.UPDATE_EXTENSION
  ) {
    const forOwnerPrice = autoCalculateCurrentTotalPrice({
      price: content.offerPrice,
      type: "owner",
      isOwner: true,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const forWorkerPrice = autoCalculateCurrentTotalPrice({
      price: content.offerPrice,
      type: "worker",
      isOwner: false,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const duration = getFactOrderDays(
      content.offerStartDate,
      content.offerEndDate
    );

    let title = "Request";

    if (type === STATIC.MESSAGE_TYPES.UPDATE_ORDER) {
      title = "Updating Request";
    }

    if (type === STATIC.MESSAGE_TYPES.NEW_EXTENSION) {
      title = "Extension Request";
    }

    if (type === STATIC.MESSAGE_TYPES.UPDATE_EXTENSION) {
      title = "Updating Extension Request";
    }

    return (
      <OrderInfoMessageContent
        messageClassName={messageClassName}
        forOwnerPrice={forOwnerPrice}
        forTenantPrice={forTenantPrice}
        content={content}
        duration={duration}
        order={order}
        dispute={dispute}
        title={title}
        hasDescription={
          type === STATIC.MESSAGE_TYPES.NEW_ORDER ||
          type === STATIC.MESSAGE_TYPES.NEW_EXTENSION
        }
      />
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.ACCEPTED_EXTENSION,
      STATIC.MESSAGE_TYPES.ACCEPTED_ORDER,
      STATIC.MESSAGE_TYPES.TENANT_PAYED,
      STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING,
      STATIC.MESSAGE_TYPES.TENANT_PAYED_EXTENSION,
      STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING_EXTENSION,
      STATIC.MESSAGE_TYPES.PENDED_TO_TENANT,
      STATIC.MESSAGE_TYPES.FINISHED,
      STATIC.MESSAGE_TYPES.ACCEPTED_CANCEL_REQUEST,
    ].includes(type)
  ) {
    let title = "Proposal accepted";
    let description = "";

    if (type == STATIC.MESSAGE_TYPES.ACCEPTED_EXTENSION) {
      title = `Extension proposal accepted`;
      description = `(From ${dateConverter(content.offerStartDate)} to
      ${dateConverter(content.offerEndDate)})`;
    }

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED) {
      title = "Paid for the rental";
    }

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING) {
      title = "Request for confirmation of rent payment was successfully sent";
    }

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED_EXTENSION) {
      title = "Paid for the extension";
      description = `New end date for rental: ${dateConverter(
        content.offerEndDate
      )}`;
    }

    if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING_EXTENSION) {
      title =
        "Request for confirmation of extension payment was successfully sent";
      description = `(From ${dateConverter(content.offerStartDate)} to
      ${dateConverter(content.offerEndDate)})`;
    }

    if (type == STATIC.MESSAGE_TYPES.PENDED_TO_TENANT) {
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
        description={description}
      />
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.CANCELED_EXTENSION,
      STATIC.MESSAGE_TYPES.REJECTED_EXTENSION,
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

    if (type == STATIC.MESSAGE_TYPES.REJECTED_EXTENSION) {
      title = "Extension rejected";
    }

    if (type == STATIC.MESSAGE_TYPES.CANCELED_EXTENSION) {
      title = "Extension canceled";
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
          <b>
            {dispute.senderId == dispute.tenantId
              ? dispute.tenantName
              : dispute.ownerName}{" "}
            started dispute
          </b>
        </div>

        <div className="w-full">
          <b>Type: </b>
          {getDisputeTitle(content.type)}
        </div>

        <div className="w-full">
          <b>Description: </b>
          {content.description}
        </div>
      </div>
    );
  }

  if (
    [
      STATIC.MESSAGE_TYPES.OWNER_REVIEW,
      STATIC.MESSAGE_TYPES.TENANT_REVIEW,
    ].includes(type)
  ) {
    const isRenterReview = type == STATIC.MESSAGE_TYPES.TENANT_REVIEW;

    return (
      <div className={`flex flex-col items-center ${messageClassName} w-max`}>
        <div className="mb-1">
          <b>{isRenterReview ? "Renter review" : "Owner review"}</b>
        </div>

        {isRenterReview ? (
          <TenantCommentMessage content={content} />
        ) : (
          <OwnerCommentMessage content={content} />
        )}

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

  if (type == STATIC.MESSAGE_TYPES.TENANT_PAYED_WAITING_EXTENSION) {
    const forOwnerPrice = calculateCurrentTotalPrice({
      startDate: content.offerStartDate,
      endDate: content.offerEndDate,
      pricePerDay: content.offerPrice,
      type: "owner",
      isOwner: true,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const forTenantPrice = calculateCurrentTotalPrice({
      startDate: content.offerStartDate,
      endDate: content.offerEndDate,
      pricePerDay: content.offerPrice,
      type: "tenant",
      isOwner: false,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

    const duration = getFactOrderDays(
      content.offerStartDate,
      content.offerEndDate
    );

    return (
      <div className={`flex flex-col items-center ${messageClassName}`}>
        <div className="mb-2">
          <b>{senderName} started new booking based on extension</b>
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
          <b>Owner get: {moneyFormatVisual(forOwnerPrice)}</b>
          <br />
          <b>Renter payed: {moneyFormatVisual(forTenantPrice)}</b>
        </div>
        <div className="mb-1">
          {duration} {autoMultiEnding(duration, "day")} (
          {dateConverter(content.offerStartDate)} -{" "}
          {dateConverter(content.offerEndDate)})
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
  senderId,
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
      senderId,
    });
  }

  if (!messageContent) {
    messageContent = <div className="w-max">Unpredictable message</div>;
  }

  return messageContent;
};

export default ChatMessageContent;

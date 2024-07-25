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
    <div className="mb-1">
      {chunkedItems.map((chunk, index) => (
        <div className="flex" key={index}>
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
    <div className="mb-1">
      {chunkedItems.map((chunk, index) => (
        <div className="flex" key={index}>
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

const ListingCommentMessage = ({ content }) => {
  const items = [
    { label: "Punctuality", value: content.punctuality },
    { label: "General Experience", value: content.generalExperience },
    { label: "Communication", value: content.communication },
    { label: "Reliability", value: content.reliability },
    { label: "Kindness", value: content.kindness },
    { label: "Flexibility", value: content.flexibility },
  ];

  const chunkedItems = [];

  for (let i = 0; i < items.length; i += 3) {
    chunkedItems.push(items.slice(i, i + 3));
  }

  return (
    <div className="mb-1">
      {chunkedItems.map((chunk, index) => (
        <div className="flex" key={index}>
          {chunk.map((item, idx) => (
            <PointStarInfo key={idx} label={item.label} value={item.value} />
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
      STATIC.MESSAGE_TYPES.PENDED_TO_TENANT,
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

        <ListingCommentMessage content={content} />

        <div className="w-full">
          <b>Description: </b>
          {content.description}
        </div>
      </div>
    );
  }

  if (STATIC.MESSAGE_TYPES.USER_REVIEW == type) {
    return (
      <div className={`flex flex-col items-center ${messageClassName} w-max`}>
        <div className="mb-1">
          <b>{content.type == "tenant" ? "Renter review" : "Owner review"}</b>
        </div>

        {content.type == "tenant" ? (
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

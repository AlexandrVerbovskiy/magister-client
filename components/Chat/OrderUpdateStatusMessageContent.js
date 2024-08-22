import OrderMessageActions from "./OrderMessageActions";

const OrderUpdateStatusMessageContent = ({
  content,
  entity,
  type,
  title,
  senderId,
  Icon = null,
  style = {},
  popupsData,
  extensionPopupsData = null,
  isExtensionActions = false,
  description = null,
}) => {
  return (
    <div className="d-flex flex-column align-items-center" style={style}>
      <div>
        <b>{title}</b>
        {Icon && (
          <Icon
            width={20}
            height={20}
            style={{ marginTop: "-4px", marginLeft: "5px" }}
          />
        )}
        {description && <p>{description}</p>}
      </div>

      <OrderMessageActions
        type={type}
        order={entity}
        popupsData={popupsData}
        content={content}
        senderId={senderId}
        extensionPopupsData={extensionPopupsData}
        isExtensionActions={isExtensionActions}
      />
    </div>
  );
};

export default OrderUpdateStatusMessageContent;

import OrderMessageActions from "./OrderMessageActions";

const OrderUpdateStatusMessageContent = ({
  content,
  entity,
  popupsData,
  type,
  title,
  senderId,
  Icon = null,
  style = {},
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
      </div>

      <OrderMessageActions
        type={type}
        order={entity}
        popupsData={popupsData}
        content={content}
        senderId={senderId}
      />
    </div>
  );
};

export default OrderUpdateStatusMessageContent;

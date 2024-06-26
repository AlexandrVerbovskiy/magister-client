import OrderMessageActions from "./OrderMessageActions";

const OrderUpdateStatusMessageContent = ({
  content,
  entity,
  popupsData,
  type,
  title,
  Icon = null,
}) => {
  return (
    <div className="d-flex flex-column align-items-center">
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

export default OrderUpdateStatusMessageContent;

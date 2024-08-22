const OrderUpdateStatusMessageContent = ({
  title,
  messageClassName,
  Icon = null,
  description = null,
}) => {
  return (
    <div className={`flex flex-col items-center ${messageClassName}`}>
      <div className="flex items-center">
        <b>{title}</b>
        {Icon && (
          <Icon
            width={20}
            height={20}
            style={{ marginTop: "-4px", marginLeft: "5px" }}
          />
        )}
      </div>
      {description && <div className="w-full mb-1">{description}</div>}
    </div>
  );
};

export default OrderUpdateStatusMessageContent;

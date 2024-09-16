const Th = ({
  title,
  value,
  orderType,
  canOrder = true,
  onClick,
  width = null,
}) => {
  const handleClick = () => {
    if (!canOrder || !onClick) return;
    onClick(value);
  };

  let arrowStyle = { opacity: 0 };

  if (orderType && orderType.toLowerCase() === "desc") {
    arrowStyle = { transform: "rotate(0deg)" };
  }

  if (orderType && orderType.toLowerCase() === "asc") {
    arrowStyle = { transform: "rotate(180deg)" };
  }

  return (
    <th
      onClick={handleClick}
      style={canOrder && onClick ? { cursor: "pointer", width } : { width }}
    >
      <div className="font-weight-bold d-flex align-items-center">
        <div className="me-1">{title}</div>
        {canOrder && (
          <div style={{ fontWeight: 500, ...arrowStyle }}>&#x2193;</div>
        )}
      </div>
    </th>
  );
};

export default Th;

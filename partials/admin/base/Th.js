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
    arrowStyle = { transform: "rotate(90deg)" };
  }

  if (orderType && orderType.toLowerCase() === "asc") {
    arrowStyle = { transform: "rotate(270deg)" };
  }

  return (
    <th
      width={width}
      onClick={handleClick}
      className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ${
        canOrder && onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="font-semibold text-left flex">
        <div className="mr-1">{title}</div>
        {canOrder && <div style={arrowStyle}>-&gt;</div>}
      </div>
    </th>
  );
};

export default Th;

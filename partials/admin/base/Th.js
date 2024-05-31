const Th = ({
  title,
  value,
  orderType,
  canOrder = true,
  onClick,
  width = null,
  align = "left",
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
      <div className={`font-semibold text-${align} flex`}>
        <div className="mr-1 text-wrap" style={{ width: "calc(100% - 10px)" }}>
          {title}
        </div>
        <div style={{ width: "10px" }}>
          {canOrder && <div style={arrowStyle}>-&gt;</div>}
        </div>
      </div>
    </th>
  );
};

export default Th;

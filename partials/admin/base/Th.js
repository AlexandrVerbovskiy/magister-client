const Th = ({ title, value, orderType, canOrder = true, onClick }) => {
  const handleClick = () => {
    if (!canOrder || !onClick) return;

    onClick(value);
  };

  return (
    <th
      onClick={handleClick}
      className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap cursor-pointer"
    >
      <div className="font-semibold text-left">{title}</div>
    </th>
  );
};

export default Th;

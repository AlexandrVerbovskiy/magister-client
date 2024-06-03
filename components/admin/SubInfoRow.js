const SubInfoRow = ({ label, value }) => {
  return (
    <div
      className="mt-1"
      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
    >
      <span className="text-black">{label}:</span>{" "}
      <span className="text-gray-400" style={{ textWrap: "wrap" }}>
        {value}
      </span>
    </div>
  );
};

export default SubInfoRow;

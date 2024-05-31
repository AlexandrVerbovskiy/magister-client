const SubInfoRow = ({ label, value }) => {
  return (
    <div className="mt-1">
      <span className="text-black">{label}:</span>{" "}
      <span className="text-gray-400">{value}</span>
    </div>
  );
};

export default SubInfoRow;
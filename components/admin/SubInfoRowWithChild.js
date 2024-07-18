const SubInfoRowWithChild = ({ label = null, children, newRow = false }) => {
  const LabelElement = (props) =>
    newRow ? <div {...props} /> : <span {...props} />;

  return (
    <div
      className="mt-1 overflow-separate"
    >
      {label && (
        <LabelElement className="text-black mr-1">{label}:</LabelElement>
      )}
      <span className="text-gray-400" style={{ textWrap: "wrap" }}>
        {children}
      </span>
    </div>
  );
};

export default SubInfoRowWithChild;

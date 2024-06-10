import SubInfoRowWithChild from "./SubInfoRowWithChild";

const SubInfoRow = ({ label, value, newRow = false }) => {
  return (
    <SubInfoRowWithChild label={label} newRow={newRow}>
      {value}
    </SubInfoRowWithChild>
  );
};

export default SubInfoRow;

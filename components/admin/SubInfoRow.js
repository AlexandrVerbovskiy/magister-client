import SubInfoRowWithChild from "./SubInfoRowWithChild";

const SubInfoRow = ({
  label,
  value,
  newRow = false,
  textClassName = "text-gray-400",
  labelClassName = "text-black mr-1",
  parentClassName = "mt-1 overflow-separate",
  tooltip = null,
}) => {
  return (
    <SubInfoRowWithChild
      textClassName={textClassName}
      labelClassName={labelClassName}
      parentClassName={parentClassName}
      label={label}
      newRow={newRow}
      tooltip={tooltip}
    >
      {value}
    </SubInfoRowWithChild>
  );
};

export default SubInfoRow;

import Tooltip from "./Tooltip";

const SubInfoRowWithChild = ({
  label = null,
  children,
  newRow = false,
  bold = false,
  textClassName = "text-gray-400",
  labelClassName = "text-black mr-1",
  parentClassName = "mt-1 overflow-separate",
  tooltip = null,
}) => {
  const LabelElement = (props) =>
    newRow ? <div {...props} /> : <span {...props} />;

  let Wrapper = ({ children }) => <>{children}</>;

  if (tooltip) {
    Wrapper = ({ children }) => <Tooltip title={tooltip}>{children}</Tooltip>;
  }

  return (
    <Wrapper>
      <div className={`${parentClassName}${bold ? " font-bold" : ""}`}>
        {label && (
          <LabelElement className={labelClassName}>{label}:</LabelElement>
        )}
        <span className={textClassName} style={{ textWrap: "wrap" }}>
          {children}
        </span>
      </div>
    </Wrapper>
  );
};

export default SubInfoRowWithChild;

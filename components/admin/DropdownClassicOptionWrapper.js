import Tooltip from "./Tooltip";

const DropdownClassicOptionWrapper = ({ children, tooltipText, disabled }) => {
  if (!disabled || !tooltipText) return children;
  return (
    <Tooltip
      style={{ width: "max-content", left: "10px", transform: "translateX(0)" }}
      title={tooltipText}
    >
      {children}
    </Tooltip>
  );
};

export default DropdownClassicOptionWrapper;

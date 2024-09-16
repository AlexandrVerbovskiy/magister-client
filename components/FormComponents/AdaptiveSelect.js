import Select from "react-select";

const AdaptiveSelect = (props) => {
  const selectRef = props.selectRef ?? null;
  let className = props.className ?? "";
  className += " custom-search-select";

  return <Select ref={selectRef} {...props} className={className} />;
};

export default AdaptiveSelect;

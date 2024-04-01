import Select from "react-select";

const AdaptiveSelect = (props) => {
  let className = props.className ?? "";
  className += " custom-search-select";

  return <Select {...props} className={className} />;
};

export default AdaptiveSelect;

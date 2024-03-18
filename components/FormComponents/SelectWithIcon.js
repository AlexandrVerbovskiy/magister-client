import ErrorSpan from "../ErrorSpan";
import ErrorIconWrapper from "./ErrorIconWrapper";
import Select from "react-select";

const SelectWithIcon = ({
  onChange,
  value,
  label = null,
  icon = null,
  error = null,
  options = [],
  style = {},
  isSearchable = true,
  name = null,
}) => {
  return (
    <ErrorIconWrapper label={label} icon={icon} error={error}>
      <Select
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={onChange}
        isSearchable={isSearchable}
        style={style}
        className="custom-search-select"
        name={name}
      />
      <ErrorSpan error={error} />
    </ErrorIconWrapper>
  );
};

export default SelectWithIcon;

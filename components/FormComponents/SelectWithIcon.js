import ErrorSpan from "../ErrorSpan";
import AdaptiveSelect from "./AdaptiveSelect";
import ErrorIconWrapper from "./ErrorIconWrapper";

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
      <AdaptiveSelect
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={onChange}
        isSearchable={isSearchable}
        style={style}
        name={name}
      />
      <ErrorSpan error={error} />
    </ErrorIconWrapper>
  );
};

export default SelectWithIcon;

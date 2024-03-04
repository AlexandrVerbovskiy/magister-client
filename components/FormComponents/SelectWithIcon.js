import ErrorSpan from "../ErrorSpan";
import ErrorIconWrapper from "./ErrorIconWrapper";

const SelectWithIcon = ({
  onChange,
  value,
  label = null,
  icon = null,
  error = null,
  options = [],
  style={}
}) => {
  return (
    <ErrorIconWrapper label={label} icon={icon} error={error}>
      <select
        onChange={onChange}
        value={value}
        className="dashbaord-category-select"
        style={style}
      >
        {options.map((elem) => (
          <option key={elem.value} value={elem.value}>{elem.label}</option>
        ))}
      </select>
      <ErrorSpan error={error} />
    </ErrorIconWrapper>
  );
};

export default SelectWithIcon;

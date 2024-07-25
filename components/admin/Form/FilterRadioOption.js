const FilterRadioOption = ({
  name,
  label,
  value,
  currentValue,
  setCurrentValue,
}) => {
  return (
    <li className="py-1 px-3">
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name={name}
          className="form-radio cursor-pointer"
          value={value}
          checked={currentValue == value}
          onChange={() => setCurrentValue(value)}
        />
        <span className="text-sm font-medium ml-2">{label}</span>
      </label>
    </li>
  );
};

export default FilterRadioOption;

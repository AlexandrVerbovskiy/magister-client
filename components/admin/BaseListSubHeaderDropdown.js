import DropdownFilter from "./DropdownFilter";
import FilterRadioOption from "./Form/FilterRadioOption";

const BaseListSubHeaderDropdown = ({ listFilters = null }) => {
  return (
    <DropdownFilter align="right">
      {listFilters.map((filter) => (
        <div key={filter.name}>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
            {filter.label}
          </div>
          <ul className="mb-4">
            {filter.options.map((option) => (
              <FilterRadioOption
                key={option.value}
                name={filter.name}
                label={option.title}
                value={option.value}
                currentValue={filter.value}
                setCurrentValue={(value) => filter.onChange(value)}
              />
            ))}
          </ul>
        </div>
      ))}
    </DropdownFilter>
  );
};

export default BaseListSubHeaderDropdown;

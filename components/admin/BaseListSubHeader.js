import SearchForm from "../../partials/admin/actions/SearchForm";
import DateSelect from "./DateSelect";
import HeaderTypeFilter from "./HeaderTypeFilter";
import DropdownFilter from "./DropdownFilter";
import FilterRadioOption from "./Form/FilterRadioOption";

const BaseListSubHeader = ({
  type,
  handleChangeType,
  typeOptions = null,
  filter,
  filterPlaceholder,
  handleChangeFilter,
  timeFilterType,
  handleChangeTimeFilterType,
  rebuild,
  listFilters = null,
}) => {
  return (
    <div className="sm:flex sm:justify-between sm:items-center mb-5">
      {typeOptions && <HeaderTypeFilter
        selected={type}
        onChange={(value) => handleChangeType(value, rebuild)}
        options={typeOptions}
      />}

      <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <SearchForm
          value={filter}
          onInput={handleChangeFilter}
          placeholder={filterPlaceholder}
        />
        <DateSelect
          value={timeFilterType}
          setValue={(value) => handleChangeTimeFilterType(value, rebuild)}
        />
        {listFilters && (
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
        )}
      </div>
    </div>
  );
};

export default BaseListSubHeader;

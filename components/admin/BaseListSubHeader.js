import SearchForm from "../../partials/admin/actions/SearchForm";
import DateSelect from "./DateSelect";
import HeaderTypeFilter from "./HeaderTypeFilter";
import BaseListSubHeaderDropdown from "./BaseListSubHeaderDropdown";

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
  dopClass = "mb-5",
}) => {
  return (
    <div className={`sm:flex sm:justify-between sm:items-center ${dopClass}`}>
      {typeOptions && (
        <HeaderTypeFilter
          selected={type}
          onChange={(value) => handleChangeType(value, rebuild)}
          options={typeOptions}
        />
      )}

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
        {listFilters && <BaseListSubHeaderDropdown listFilters={listFilters} />}
      </div>
    </div>
  );
};

export default BaseListSubHeader;

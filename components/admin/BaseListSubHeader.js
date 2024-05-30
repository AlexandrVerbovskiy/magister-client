import SearchForm from "../../partials/admin/actions/SearchForm";
import DateSelect from "./DateSelect";
import HeaderTypeFilter from "./HeaderTypeFilter";

const BaseListSubHeader = ({
  type,
  handleChangeType,
  typeOptions,
  filter,
  filterPlaceholder,
  handleChangeFilter,
  timeFilterType,
  handleChangeTimeFilterType,
  rebuild
}) => {
  return (
    <div className="sm:flex sm:justify-between sm:items-center mb-5">
      <HeaderTypeFilter
        selected={type}
        onChange={(value) => handleChangeType(value, rebuild)}
        options={typeOptions}
      />

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
      </div>
    </div>
  );
};

export default BaseListSubHeader;

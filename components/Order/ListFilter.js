import STATIC from "../../static";
import DateFilter from "../FormComponents/DateFilter";

const ListFilter = ({
  type,
  changeType,
  filter,
  changeFilter,
  handleChangeTimeFilter,
  fromTime,
  toTime,
}) => {
  return (
    <li
      className="nav-item dropdown d-flex add-listings-box filter-nav-item"
      style={{ boxShadow: "none" }}
    >
      <div
        className="form-group"
        style={{ marginBottom: 0, display: "flex", alignItems: "center" }}
      >
        <ul className="facilities-list d-flex" style={{ marginBottom: "0" }}>
          <li style={{ marginBottom: "0" }}>
            <label className="checkbox">
              <input
                type="checkbox"
                name="facilities-list"
                checked={type == "tenant"}
                onChange={() => changeType("tenant")}
              />
              <span>Rental</span>
            </label>
          </li>
          <li style={{ marginBottom: "0" }}>
            <label className="checkbox">
              <input
                type="checkbox"
                name="facilities-list"
                checked={type == "owner"}
                onChange={() => changeType("owner")}
              />
              <span>Owner</span>
            </label>
          </li>
        </ul>
      </div>

      <label className="search-header-section me-3">
          <input
            value={filter}
            onChange={(e) => changeFilter(e.target.value)}
            type="text"
            name="search"
            className="search-field"
            placeholder="Search..."
            maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
          />
        </label>

      <div className="d-flex">
        <DateFilter
          value={[fromTime, toTime]}
          onChange={handleChangeTimeFilter}
          placeholder="Rental dates of the listing"
        />
      </div>
    </li>
  );
};

export default ListFilter;

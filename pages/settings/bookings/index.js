import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import {
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  usePagination,
} from "../../../hooks";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import { getBookingListOptions } from "../../../services";
import { authSideProps } from "../../../middlewares";
import {
  baseListPageParams,
  baseTimeListPageParams,
  getDateByCurrentAdd,
  getDateByCurrentReject,
} from "../../../utils";
import OrderItem from "../../../components/Listings/OrderItem";
import STATIC from "../../../static";
import DateFilter from "../../../components/FormComponents/DateFilter";

const TabHeaderSection = ({
  type,
  changeType,
  filter,
  changeFilter,
  countItems,
  style = {},
  handleChangeTimeFilter,
  fromTime,
  toTime,
}) => (
  <ul
    className="nav nav-tabs d-flex align-items-end justify-content-between"
    id="myTab"
    style={style}
  >
    <li className="nav-item">
      <a className="nav-link active" id="all-listing-tab">
        <span className="menu-title">All Bookings ({countItems})</span>
      </a>
    </li>

    <li
      className="nav-item dropdown d-flex add-listings-box"
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
                onClick={() => changeType("tenant")}
              />
              <span>Tenant</span>
            </label>
          </li>
          <li style={{ marginBottom: "0" }}>
            <label className="checkbox">
              <input
                type="checkbox"
                name="facilities-list"
                checked={type == "owner"}
                onClick={() => changeType("owner")}
              />
              <span>Owner</span>
            </label>
          </li>
        </ul>
      </div>

      <DateFilter
        value={[fromTime, toTime]}
        onChange={handleChangeTimeFilter}
      />

      <label className="search-header-section">
        <input
          value={filter}
          onChange={(e) => changeFilter(e.target.value)}
          type="search"
          name="search"
          className="search-field"
          placeholder="Search..."
          maxLength={STATIC.MAX_SEARCH_INPUT_LENGTH}
        />
      </label>
    </li>
  </ul>
);

const MyBookings = (pageProps) => {
  const router = useRouter();
  const { error, success, authToken } = useContext(IndiceContext);

  const [type, setType] = useState(router.query.type ?? "tenant");

  const { fromTime, setFromTime, toTime, setToTime, getTimeFilterProps } =
    useInitPaginationTimeFilter({
      defaultFromTime: getDateByCurrentReject(30),
      defaultToTime: getDateByCurrentAdd(30),
    });

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    canMoveNextPage,
    canMovePrevPage,
    items: bookings,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) => getBookingListOptions(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      ...getTimeFilterProps(),
      type: {
        value: type,
        hidden: (value) => value == "tenant",
      },
    }),
  });

  const { handleChangeTimeFilter } = useChangeTimeFilter({
    options,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    rebuild,
  });

  const changeType = (value) => {
    setType(value);
    rebuild({ type: value });
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Bookings</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link href="/">Home</Link>
              </li>
              <li className="item">
                <Link href="/settings/">Settings</Link>
              </li>
              <li className="item">Bookings</li>
            </ol>
          </div>
        </div>

        {bookings.length < 1 && pageProps.items.length < 1 && (
          <section className="listing-area">
            <TabHeaderSection
              style={{ marginBottom: "0" }}
              filter={filter}
              changeFilter={changeFilter}
              countItems={countItems}
              type={type}
              changeType={changeType}
              handleChangeTimeFilter={handleChangeTimeFilter}
              fromTime={fromTime}
              toTime={toTime}
            />

            <div className="no-listing">
              <div className="no-listing-img"></div>
              <div className="no-listing-text">You have no bookings yet</div>
            </div>
          </section>
        )}

        {bookings.length > 0 && (
          <>
            <section className="listing-area">
              <TabHeaderSection
                filter={filter}
                changeFilter={changeFilter}
                countItems={countItems}
                type={type}
                changeType={changeType}
                handleChangeTimeFilter={handleChangeTimeFilter}
                fromTime={fromTime}
                toTime={toTime}
              />

              <div className="tab-content">
                <div className="tab-pane fade show active" id="all-listing">
                  <div
                    className="row"
                    style={{ alignItems: "stretch", gridRowGap: "20px" }}
                  >
                    {bookings.map((booking) => (
                      <OrderItem {...booking} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const type = context.query.type === "owner" ? "owner" : "tenant";
  const params = { ...baseTimeListPageParams(context.query), type };
  const options = await getBookingListOptions(params, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyBookings;

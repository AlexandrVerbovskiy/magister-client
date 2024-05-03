import { useContext } from "react";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../components/_App/NavbarThree";
import Link from "next/link";
import { authSideProps } from "../../middlewares";
import {
  baseTimeListPageParams,
  fullTimeConverter,
  timeConverter,
} from "../../utils";
import {
  getSenderPaymentList,
  getSenderPaymentListOptions,
} from "../../services";
import Th from "../../components/DashboardComponents/Table/Th";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import Pagination from "../../components/Pagination";
import {
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  usePagination,
} from "../../hooks";
import STATIC from "../../static";
import EmptyTable from "../../components/DashboardComponents/Table/EmptyTable";
import DateFilter from "../../components/FormComponents/DateFilter";

const ths = [
  { title: "#Id", value: "sender_payments.id", width: "10%" },
  { title: "Listing", value: "listings.name", width: "25%" },
  { title: "Owner", value: "owners.name", width: "20%" },
  { title: "Price", value: "sender_payments.money", width: "10%" },
  { title: "Payed at", value: "sender_payments.created_at", width: "20%" },
  { title: "Actions", canOrder: false, width: "15%" },
];

const Tr = ({
  id,
  orderId,
  listingId,
  listingName,
  ownerId,
  ownerName,
  money,
  createdAt,
}) => {
  return (
    <tr>
      <td style={{ fontWeight: "700" }}>#{id}</td>
      <td>
        <a href={`/listing/${listingId}`}>{listingName}</a>
      </td>
      <td>
        <a href={`/owner-listing-list/${ownerId}`}>{ownerName}</a>
      </td>
      <td>${money}</td>
      <td style={{ fontWeight: "700" }}>{fullTimeConverter(createdAt)}</td>
      <td style={{ fontSize: "12px" }}>
        <a
          href={`/dashboard/orders/${orderId}`}
          className="btn default-table-btn btn-sm"
        >
          View Order
        </a>
      </td>
    </tr>
  );
};

const TabHeaderSection = ({
  filter,
  changeFilter,
  countItems,
  fromTime,
  toTime,
  handleChangeTimeFilter,
  style = {},
}) => (
  <ul
    className="nav nav-tabs d-flex align-items-end justify-content-between"
    id="myTab"
    style={style}
  >
    <li className="nav-item">
      <a className="nav-link active" id="all-listing-tab">
        <span className="menu-title">All Earnings ({countItems})</span>
      </a>
    </li>

    <li className="nav-item dropdown d-flex">
      <label className="search-header-section me-3">
        <input
          value={filter}
          onChange={(e) => changeFilter(e.target.value)}
          type="text"
          name="search"
          className="search-field"
          placeholder="Search..."
          maxLength={STATIC.MAX_SEARCH_INPUT_LENGTH}
        />
      </label>

      <DateFilter
        value={[fromTime, toTime]}
        onChange={handleChangeTimeFilter}
        placeholder="Creation date"
      />
    </li>
  </ul>
);

const MyEarnings = (pageProps) => {
  const { error, success, authToken } = useContext(IndiceContext);

  const { fromTime, setFromTime, toTime, setToTime, getTimeFilterProps } =
    useInitPaginationTimeFilter();

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    canMoveNextPage,
    canMovePrevPage,
    items: payments,
    orderType,
    handleChangeOrder,
    rebuild,
    setItemFields,
    order,
    options,
  } = usePagination({
    getItemsFunc: (data) => getSenderPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
  });

  const { handleChangeTimeFilter } = useChangeTimeFilter({
    options,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    rebuild,
  });

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>My Expenses</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/">Home</Link>
            </li>
            <li className="item">
              <Link href="/dashboard/">Dashboard</Link>
            </li>
            <li className="item">My Earnings</li>
          </ol>
        </div>

        <div className="listing-area">
          <TabHeaderSection
            filter={filter}
            changeFilter={changeFilter}
            countItems={countItems}
            fromTime={fromTime}
            toTime={toTime}
            handleChangeTimeFilter={handleChangeTimeFilter}
          />
          <div className="invoice-table table-responsive">
            {countItems > 0 ? (
              <>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      {ths.map((th) => (
                        <Th
                          key={th.title}
                          {...th}
                          onClick={handleChangeOrder}
                          orderType={order == th.value ? orderType : null}
                        />
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => (
                      <Tr key={payment.id} {...payment} />
                    ))}
                  </tbody>
                </table>

                <Pagination
                  viewOnlyMoreOnePage={true}
                  page={page}
                  countPages={countPages}
                  move={moveToPage}
                  canNext={canMoveNextPage}
                  canPrev={canMovePrevPage}
                />
              </>
            ) : (
              <EmptyTable entityName="payments" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const params = { ...baseTimeListPageParams(context.query) };
  const options = await getSenderPaymentListOptions(
    params,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyEarnings;

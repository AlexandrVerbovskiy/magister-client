import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../components/_App/NavbarThree";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getRecipientPaymentList,
  getRecipientPaymentListOptions,
} from "../../services";
import { authSideProps } from "../../middlewares";
import { baseTimeListPageParams, fullTimeConverter } from "../../utils";
import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  usePagination,
} from "../../hooks";
import EmptyTable from "../../components/DashboardComponents/Table/EmptyTable";
import Pagination from "../../components/Pagination";
import DropdownFilter from "../../components/DropdownFilter";
import DateFilter from "../../components/FormComponents/DateFilter";
import Th from "../../components/DashboardComponents/Table/Th";
import STATIC from "../../static";

const ths = [
  { title: "#Id", value: "recipient_payments.id", width: "10%" },
  { title: "Listing", value: "listings.name", width: "15%" },
  { title: "Rental", value: "tenants.name", width: "15%" },
  { title: "Money", value: "recipient_payments.money", width: "15%" },
  { title: "Type", value: "recipient_payments.type", width: "12.5%" },
  { title: "Status", value: "recipient_payments.status", width: "12.5%" },
  { title: "Get at", value: "recipient_payments.planned_time", width: "20%" },
];

const TabHeaderSection = ({
  filter,
  changeFilter,
  statusFilter,
  handleChangeStatusFilter,
  typeFilter,
  handleChangeTypeFilter,
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
        placeholder="Payment Time"
      />

      <div className="ms-3">
        <DropdownFilter align="right">
          <div className="pt-1.5 px-3">
            <div className="text-uppercase label-section">Status</div>
            <ul className="list-group list-group-flush">
              {[
                { value: "waiting", label: "Waiting" },
                { value: "failed", label: "Failed" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
                { value: "all", label: "All" },
              ].map((option) => (
                <div className="py-1" key={`status_${option.value}`}>
                  <div className="form-check">
                    <input
                      type="radio"
                      name={`status_${option.value}`}
                      className="form-check-input cursor-pointer"
                      value={option.value}
                      checked={statusFilter === option.value}
                      onChange={() => handleChangeStatusFilter(option.value)}
                      id={`status_${option.value}`}
                    />
                    <label
                      htmlFor={`status_${option.value}`}
                      className="form-check-label"
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </ul>
          </div>
          <div className="pt-1.5 px-3">
            <div className="text-uppercase label-section">Type</div>
            <ul className="list-group list-group-flush">
              {[
                { value: "rental", label: "Rental" },
                { value: "refund", label: "Refund" },
                { value: "all", label: "All" },
              ].map((option) => (
                <div className="py-1" key={`type_${option.value}`}>
                  <div className="form-check">
                    <input
                      type="radio"
                      name={`type_${option.value}`}
                      className="form-check-input cursor-pointer"
                      value={option.value}
                      checked={typeFilter === option.value}
                      onChange={() => handleChangeTypeFilter(option.value)}
                      id={`type_${option.value}`}
                    />
                    <label
                      htmlFor={`type_${option.value}`}
                      className="form-check-label"
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </DropdownFilter>
      </div>
    </li>
  </ul>
);

const TypeSpan = ({ type }) => {
  let color = "status-background-green";
  let text = "Rental";

  if (type == "returned") {
    color = "status-background-gray";
    text = "Refund";
  }

  return (
    <div style={{ width: "min-content" }} className={`${color}`}>
      {text}
    </div>
  );
};

const StatusSpan = ({ status }) => {
  let color = "status-background-orange";
  let text = "Waiting";
  let icon = "bx-alarm";

  if (status == "failed") {
    color = "status-background-red";
    text = "Failed";
    icon = "bx-error";
  }

  if (status == "completed") {
    color = "status-background-green";
    text = "Completed";
    icon = "bx-check-circle";
  }

  if (status == "cancelled") {
    color = "status-background-gray";
    text = "Cancelled";
    icon = "bx-x-circle";
  }

  return (
    <div style={{ width: "min-content" }} className={`d-flex ${color}`}>
      <span class="icon me-1">
        <i class={`bx ${icon}`}></i>
      </span>
      {text}
    </div>
  );
};

const Tr = ({
  id,
  listingId,
  listingName,
  tenantId,
  tenantName,
  money,
  status,
  type,
  plannedTime,
}) => {
  return (
    <tr>
      <td style={{ fontWeight: "700" }}>#{id}</td>
      <td>
        <a href={`/listing/${listingId}`}>{listingName}</a>
      </td>
      <td>
        <a href={`/owner-listing-list/${tenantId}`}>{tenantName}</a>
      </td>
      <td>${money}</td>
      <td>
        <TypeSpan type={type} />
      </td>
      <td>
        <StatusSpan status={status} />
      </td>
      <td style={{ fontWeight: "700" }}>{fullTimeConverter(plannedTime)}</td>
    </tr>
  );
};

const MyExpenses = (pageProps) => {
  const router = useRouter();
  const { error, success, authToken } = useContext(IndiceContext);

  const [type, setType] = useState(router.query.type ?? "all");
  const [status, setStatus] = useState(router.query.status ?? "all");

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
    getItemsFunc: (data) => getRecipientPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      ...getTimeFilterProps(),
      type: {
        value: type,
        hidden: (value) => value == "all",
      },
      status: {
        value: status,
        hidden: (value) => value == "all",
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

  const handleChangeTypeFilter = (value) => {
    setType(value);
    rebuild({ type: value });
  };

  const handleChangeStatusFilter = (value) => {
    setStatus(value);
    rebuild({ status: value });
  };

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
            <li className="item">My Expenses</li>
          </ol>
        </div>

        <div className="listing-area">
          <TabHeaderSection
            filter={filter}
            changeFilter={changeFilter}
            statusFilter={status}
            handleChangeStatusFilter={handleChangeStatusFilter}
            typeFilter={type}
            handleChangeTypeFilter={handleChangeTypeFilter}
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
  const type = context.query.type ?? "all";
  const status = context.query.status ?? "all";

  const params = { ...baseTimeListPageParams(context.query), status, type };

  const options = await getRecipientPaymentListOptions(
    params,
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyExpenses;

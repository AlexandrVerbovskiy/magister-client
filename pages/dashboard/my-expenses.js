import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../components/_App/NavbarThree";
import Link from "next/link";
import {
  getRecipientPaymentList,
  getRecipientPaymentListOptions,
} from "../../services";
import { authSideProps } from "../../middlewares";
import { baseTimeListPageParams } from "../../utils";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { usePagination } from "../../hooks";
import EmptyTable from "../../components/DashboardComponents/Table/EmptyTable";
import Pagination from "../../components/Pagination";

const ths = [
  { title: "#Id", value: "recipient_payments.id", width: "10%" },
  { title: "Listing", value: "listings.name", width: "15%" },
  { title: "Rental", value: "tenants.name", width: "15%" },
  { title: "Money", value: "recipient_payments.money", width: "10%" },
  { title: "Status", value: "recipient_payments.status", width: "10%" },
  { title: "Type", value: "recipient_payments.type", width: "10%" },
  { title: "Created at", value: "recipient_payments.created_at", width: "20%" },
  { title: "Get at", value: "recipient_payments.planned_time", width: "20%" },
];

const Tr = (props) => {
  return (
    <tr>
      <td style={{ fontWeight: "700" }}>#{props.id}</td>
      <td>
        <a href={`/listing/${props.listingId}`}>{props.listingName}</a>
      </td>
      <td>
        <a href={`/owner-listing-list/${props.tenantId}`}>{props.tenantName}</a>
      </td>
      <td>${props.money}</td>
      <td>{props.status}</td>
      <td>{props.type}</td>
      <td style={{ fontWeight: "700" }}>
        {fullTimeConverter(props.createdAt)}
      </td>
      <td style={{ fontWeight: "700" }}>
        {fullTimeConverter(props.plannedTime)}
      </td>
    </tr>
  );
};

const MyExpenses = (pageProps) => {
  const { error, success, authToken } = useContext(IndiceContext);

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
  } = usePagination({
    getItemsFunc: (data) => getRecipientPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
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
            <li className="item">My Expenses</li>
          </ol>
        </div>

        <div className="invoice-area">
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
                      <Tr key={payments.id} {...payment} />
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
  const options = await getRecipientPaymentListOptions(
    params,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyExpenses;

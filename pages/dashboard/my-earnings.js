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
import { usePagination } from "../../hooks";
import STATIC from "../../static";
import EmptyTable from "../../components/DashboardComponents/Table/EmptyTable";

const ths = [
  { title: "#Id", value: "sender_payments.id", width: "10%" },
  { title: "Listing", value: "listings.name", width: "25%" },
  { title: "Owner", value: "owners.name", width: "20%" },
  { title: "Price", value: "sender_payments.money", width: "10%" },
  { title: "Payed at", value: "sender_payments.created_at", width: "20%" },
  { title: "Actions", canOrder: false, width: "15%" },
];

const Tr = (props) => {
  let viewAction = (
    <a
      href={`/dashboard/orders/${props.orderId}`}
      className="btn default-table-btn btn-sm"
    >
      View Order
    </a>
  );

  if (
    [
      STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
      STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
      STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
    ].includes(props.orderStatus)
  ) {
    viewAction = (
      <a
        href={`/dashboard/bookings/${props.orderId}`}
        className="btn default-table-btn btn-sm"
      >
        View Booking
      </a>
    );
  }

  return (
    <tr>
      <td style={{ fontWeight: "700" }}>#{props.id}</td>
      <td>
        <a href={`/listing/${props.listingId}`}>{props.listingName}</a>
      </td>
      <td>
        <a href={`/owner-listing-list/${props.ownerId}`}>{props.ownerName}</a>
      </td>
      <td>${props.money}</td>
      <td style={{ fontWeight: "700" }}>
        {fullTimeConverter(props.createdAt)}
      </td>
      <td style={{ fontSize: "12px" }}>{viewAction}</td>
    </tr>
  );
};

const MyEarnings = (pageProps) => {
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
    getItemsFunc: (data) => getSenderPaymentList(data, authToken),
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
            <li className="item">My Earnings</li>
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
  const options = await getSenderPaymentListOptions(
    params,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyEarnings;

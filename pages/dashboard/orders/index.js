import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import { getOrderList, getOrderListOptions } from "../../../services";
import { baseTimeListPageParams } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import { useContext, useState } from "react";
import { authSideProps } from "../../../middlewares";
import { useRouter } from "next/router";
import {
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  useOrderFastActions,
  usePagination,
} from "../../../hooks";
import OrderItem from "../../../components/Listings/OrderItem";
import ListFilter from "../../../components/Order/ListFilter";
import Pagination from "../../../components/Pagination";
import OrdersListFastActinsModals from "../../../components/Order/OrdersListFastActinsModals";

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
    className="nav nav-tabs d-flex align-items-center justify-content-between"
    id="myTab"
    style={style}
  >
    <li className="nav-item">
      <a className="nav-link active" id="all-listing-tab">
        <span className="menu-title">All Bookings ({countItems})</span>
      </a>
    </li>

    <ListFilter
      type={type}
      changeType={changeType}
      filter={filter}
      changeFilter={changeFilter}
      handleChangeTimeFilter={handleChangeTimeFilter}
      fromTime={fromTime}
      toTime={toTime}
    />
  </ul>
);

const Orders = (pageProps) => {
  const router = useRouter();
  const { error, success, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(router.query.type ?? "tenant");

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
    items: orders,
    rebuild,
    options,
    isFirstBookingCall,
    setItemFields,
  } = usePagination({
    getItemsFunc: (data) => getOrderList(data, authToken),
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

  const {
    handleAcceptCancel,
    handleClickCancel,
    activeCancel,
    closeActiveCancel,

    handleClickPayedFastCancel,
    handleAcceptPayedFastCancel,
    activeFastCancel,
    closeActiveFastCancel,

    handleClickCreateDispute,
    handleAcceptCreateDispute,
    activeCreateDispute,
    closeActiveCreateDispute,

    handleOrderClickAcceptCancelByTenant,
    handleOrderAcceptAcceptCancelByTenant,
    activeOrderAcceptCancelByTenant,
    closeActiveOrderAcceptCancelByTenant,

    handleOrderClickAcceptCancelByOwner,
    handleOrderAcceptAcceptCancelByOwner,
    activeOrderAcceptCancelByOwner,
    closeActiveOrderAcceptCancelByOwner,

    handleClickUpdateRequest,
    handleAcceptUpdateRequest,
    activeUpdateRequest,
    closeActiveUpdateRequest,
    updateRequestModalActiveOrder,

    handleClickReject,
    handleAcceptReject,
    rejectOrderModalActive,
    closeRejectOrderModal,

    handleClickAccept,
    handleAcceptAccept,
    acceptOrderModalActive,
    closeAcceptOrderModal,

    handleClickPay,
    activePay,
    handleClosePay,
    onTenantPayed,
    activePayOrder,
  } = useOrderFastActions({ orders: orders, setItemFields });

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Orders</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link href="/">Home</Link>
              </li>
              <li className="item">
                <Link href="/dashboard/">Dashboard</Link>
              </li>
              <li className="item">Orders</li>
            </ol>
          </div>
        </div>

        {((!isFirstBookingCall && orders.length < 1) ||
          (isFirstBookingCall && pageProps.items.length < 1)) && (
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
              <div className="no-listing-text">You have no orders yet</div>
            </div>
          </section>
        )}

        {orders.length > 0 && (
          <>
            <section className="bookings-listings-box listing-area child-nav-tabs-mb-0">
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

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "40%" }}>Customer</th>
                      <th style={{ width: "40%" }}>Details</th>
                      <th style={{ width: "20%" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <OrderItem
                        filterType={type}
                        key={order.id}
                        order={order}
                        link={`/dashboard/orders/${order.id}`}
                        handleClickCancel={handleClickCancel}
                        handleClickPayedFastCancel={handleClickPayedFastCancel}
                        handleClickCreateDispute={handleClickCreateDispute}
                        handleOrderClickAcceptCancelByTenant={
                          handleOrderClickAcceptCancelByTenant
                        }
                        handleOrderClickAcceptCancelByOwner={
                          handleOrderClickAcceptCancelByOwner
                        }
                        handleClickUpdateRequest={handleClickUpdateRequest}
                        handleClickReject={handleClickReject}
                        handleClickAccept={handleClickAccept}
                        handleClickPay={handleClickPay}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Pagination
              viewOnlyMoreOnePage={true}
              page={page}
              countPages={countPages}
              move={moveToPage}
              canNext={canMoveNextPage}
              canPrev={canMovePrevPage}
            />
            <OrdersListFastActinsModals
              activeCancel={activeCancel}
              closeActiveCancel={closeActiveCancel}
              handleAcceptCancel={handleAcceptCancel}
              activeFastCancel={activeFastCancel}
              closeActiveFastCancel={closeActiveFastCancel}
              handleAcceptPayedFastCancel={handleAcceptPayedFastCancel}
              activeCreateDispute={activeCreateDispute}
              closeActiveCreateDispute={closeActiveCreateDispute}
              handleAcceptCreateDispute={handleAcceptCreateDispute}
              activeOrderAcceptCancelByTenant={activeOrderAcceptCancelByTenant}
              closeActiveOrderAcceptCancelByTenant={
                closeActiveOrderAcceptCancelByTenant
              }
              handleOrderAcceptAcceptCancelByTenant={
                handleOrderAcceptAcceptCancelByTenant
              }
              activeOrderAcceptCancelByOwner={activeOrderAcceptCancelByOwner}
              closeActiveOrderAcceptCancelByOwner={
                closeActiveOrderAcceptCancelByOwner
              }
              handleOrderAcceptAcceptCancelByOwner={
                handleOrderAcceptAcceptCancelByOwner
              }
              handleAcceptUpdateRequest={handleAcceptUpdateRequest}
              activeUpdateRequest={activeUpdateRequest}
              closeActiveUpdateRequest={closeActiveUpdateRequest}
              handleAcceptReject={handleAcceptReject}
              rejectOrderModalActive={rejectOrderModalActive}
              closeRejectOrderModal={closeRejectOrderModal}
              handleAcceptAccept={handleAcceptAccept}
              acceptOrderModalActive={acceptOrderModalActive}
              closeAcceptOrderModal={closeAcceptOrderModal}
              updateRequestModalActiveOrder={updateRequestModalActiveOrder}
              activePay={activePay}
              handleClosePay={handleClosePay}
              onTenantPayed={onTenantPayed}
              activePayOrder={activePayOrder}
            />
          </>
        )}
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const type = context.query.type === "owner" ? "owner" : "tenant";
  const params = { ...baseTimeListPageParams(context.query), type };
  const options = await getOrderListOptions(params, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Orders;

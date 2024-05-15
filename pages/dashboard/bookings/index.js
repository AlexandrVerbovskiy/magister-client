import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import {
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  useOrderFastActions,
  usePagination,
} from "../../../hooks";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import { getBookingListOptions } from "../../../services";
import { authSideProps } from "../../../middlewares";
import { baseTimeListPageParams } from "../../../utils";
import STATIC from "../../../static";
import OrderItem from "../../../components/Listings/OrderItem";
import ListFilter from "../../../components/Order/ListFilter";
import Pagination from "../../../components/Pagination";
import CancelModal from "../../../components/Order/CancelModal";
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
    <li className="nav-item" style={{ marginBottom: "21px" }}>
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

const MyBookings = (pageProps) => {
  const router = useRouter();
  const { error, success, sessionUser, authToken } = useContext(IndiceContext);

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
    items: bookings,
    rebuild,
    options,
    isFirstBookingCall,
    setItemFields,
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
  } = useOrderFastActions({ orders: bookings, setItemFields });

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
                <Link href="/dashboard/">Dashboard</Link>
              </li>
              <li className="item">Bookings</li>
            </ol>
          </div>
        </div>

        {((!isFirstBookingCall && bookings.length < 1) ||
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
              <div className="no-listing-text">You have no bookings yet</div>
            </div>
          </section>
        )}

        {bookings.length > 0 && (
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
                    {bookings.map((booking) => (
                      <OrderItem
                        filterType={type}
                        key={booking.id}
                        order={booking}
                        link={`/dashboard/bookings/${booking.id}`}
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
  const options = await getBookingListOptions(params, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyBookings;

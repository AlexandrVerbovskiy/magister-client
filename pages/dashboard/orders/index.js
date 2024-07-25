import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import { getOrderList, getOrderListOptions } from "../../../services";
import { baseTimeListPageParams } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import { useContext, useState } from "react";
import { authSideProps } from "../../../middlewares";
import { useRouter } from "next/router";
import { useOrderFastActions, usePagination } from "../../../hooks";
import OrderItem from "../../../components/Order/OrderItem";
import Pagination from "../../../components/Pagination";
import OrdersListFastActinsModals from "../../../components/Order/OrdersListFastActinsModals";
import PaginationLoadingWrapper from "../../../components/_App/PaginationLoadingWrapper";

const Wrapper = ({ children }) => {
  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center">
          <div className="col-12 result-count">
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
        </div>

        {children}
      </div>
    </>
  );
};

const TabHeaderSection = ({
  countForTenant,
  countForOwner,
  type,
  changeType,
  style = {},
}) => (
  <ul
    className="nav nav-tabs d-flex align-items-center"
    id="myTab"
    style={style}
  >
    <li
      className="nav-item"
      style={{ marginBottom: "21px" }}
      onClick={(e) => {
        e.preventDefault();
        changeType("tenant");
      }}
    >
      <a className={`nav-link ${type == "tenant" ? "active" : ""}`}>
        <span className="menu-title">
          My rental requests ({countForTenant})
        </span>
      </a>
    </li>

    <li
      className="nav-item"
      style={{ marginBottom: "21px" }}
      onClick={(e) => {
        e.preventDefault();
        changeType("owner");
      }}
    >
      <a className={`nav-link ${type == "owner" ? "active" : ""}`}>
        <span className="menu-title">
          Requests for my items ({countForOwner})
        </span>
      </a>
    </li>
  </ul>
);

const Orders = (pageProps) => {
  const router = useRouter();
  const { error, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(router.query.type ?? "tenant");

  const tenantCancelFee = pageProps.tenantCancelFee;

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
    isFirstCall: isFirstBookingCall,
    setItemFields,
    getCurrentPaginationProps,
    updatePaginationState,
    loading: paginationLoading,
    updateItemsParticularly,
  } = usePagination({
    getItemsFunc: (data) => getOrderList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      type: {
        value: type,
        hidden: (value) => value == "tenant",
      },
    }),
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
    closePay,
    onTenantPayed,
    activePayOrder,

    handleClickExtendOrder,
    handleClickApproveExtendOrder,
    extendModalActive,
    extendModalActiveOrder,
    closeExtendOrder,
    successIconPopupState,
  } = useOrderFastActions({
    orders: orders,
    setItemFields,
    updateItemsParticularly,
  });

  return (
    <Wrapper>
      <section className="bookings-listings-box listing-area child-nav-tabs-mb-0">
        <TabHeaderSection
          style={{ marginBottom: "0" }}
          type={type}
          changeType={changeType}
          countForTenant={pageProps.countForTenant}
          countForOwner={pageProps.countForOwner}
        />

        <PaginationLoadingWrapper active={paginationLoading}>
          {orders.length > 0 && (
            <div className="table-responsive">
              <div className="table orders-table">
                <div className="thead">
                  <div className="tr">
                    <div className="th">Customer</div>
                    <div className="th">Details</div>
                    <div className="th">Action</div>
                  </div>
                </div>

                <div className="tbody">
                  {orders.map((order) => (
                    <OrderItem
                      filterType={type}
                      key={order.id}
                      order={order}
                      link={`/dashboard/orders`}
                      handleClickCancel={handleClickCancel}
                      handleClickPayedFastCancel={handleClickPayedFastCancel}
                      handleClickUpdateRequest={handleClickUpdateRequest}
                      handleClickReject={handleClickReject}
                      handleClickAccept={handleClickAccept}
                      handleClickPay={handleClickPay}
                      handleClickExtend={handleClickExtendOrder}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {orders.length < 1 && (
            <div className="no-listing">
              <div className="no-listing-img"></div>
              <div className="no-listing-text">You have no orders yet</div>
            </div>
          )}
        </PaginationLoadingWrapper>
      </section>

      <OrdersListFastActinsModals
        tenantBaseCommission={pageProps.tenantBaseFee}
        activeCancel={activeCancel}
        closeActiveCancel={closeActiveCancel}
        handleAcceptCancel={handleAcceptCancel}
        activeFastCancel={activeFastCancel}
        closeActiveFastCancel={closeActiveFastCancel}
        handleAcceptPayedFastCancel={handleAcceptPayedFastCancel}
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
        closePay={closePay}
        onTenantPayed={onTenantPayed}
        activePayOrder={activePayOrder}
        handleClickExtendOrder={handleClickExtendOrder}
        handleClickApproveExtendOrder={handleClickApproveExtendOrder}
        extendModalActive={extendModalActive}
        extendModalActiveOrder={extendModalActiveOrder}
        closeExtendOrder={closeExtendOrder}
        successIconPopupState={successIconPopupState}
        bankInfo={pageProps.bankInfo}
      />

      <Pagination
        viewOnlyMoreOnePage={true}
        page={page}
        countPages={countPages}
        move={moveToPage}
        canNext={canMoveNextPage}
        canPrev={canMovePrevPage}
      />
    </Wrapper>
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

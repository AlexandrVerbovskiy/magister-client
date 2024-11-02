import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import { getOrderList, getOrderListOptions } from "../../../services";
import { baseListPageParams } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import { useContext, useState } from "react";
import { authSideProps } from "../../../middlewares";
import { useRouter } from "next/router";
import {
  useIsMobile,
  useOrderFastActions,
  usePagination,
} from "../../../hooks";
import OrderItem from "../../../components/Order/OrderItem";
import Pagination from "../../../components/Pagination";
import OrdersListFastActinsModals from "../../../components/Order/OrdersListFastActinsModals";
import PaginationLoadingWrapper from "../../../components/_App/PaginationLoadingWrapper";

const Wrapper = ({
  children,
  countForWorker,
  countForOwner,
  type,
  changeType,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree>
          {isMobile && (
            <ul
              className="list-group list-group-flush pt-1 mt-2"
              style={{ borderTop: "1px solid #ede7f6" }}
            >
              <div className="py-1" onClick={() => changeType("worker")}>
                <div
                  className="form-check px-0"
                  style={type == "worker" ? { color: "var(--mainColor)" } : {}}
                >
                  <label className="form-check-label">
                    My completing requests ({countForWorker})
                  </label>
                </div>
              </div>

              <div className="py-1" onClick={() => changeType("owner")}>
                <div
                  className="form-check px-0"
                  style={type == "owner" ? { color: "var(--mainColor)" } : {}}
                >
                  <label className="form-check-label">
                    Requests for my tasks ({countForOwner})
                  </label>
                </div>
              </div>
            </ul>
          )}
        </NavbarThree>

        {!isMobile && (
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
        )}

        {children}
      </div>
    </>
  );
};

const TabHeaderSection = ({
  countForWorker,
  countForOwner,
  type,
  changeType,
  style = {},
  className = "d-flex align-items-center",
}) => (
  <ul className={"nav nav-tabs " + className} id="myTab" style={style}>
    <li
      className="nav-item"
      style={{ marginBottom: "21px" }}
      onClick={(e) => {
        e.preventDefault();
        changeType("worker");
      }}
    >
      <a className={`nav-link ${type == "worker" ? "active" : ""}`}>
        <span className="menu-title">
          My completing requests ({countForWorker})
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
          Requests for my listings ({countForOwner})
        </span>
      </a>
    </li>
  </ul>
);

const Orders = (pageProps) => {
  const router = useRouter();
  const { error, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(router.query.type ?? "worker");

  const {
    page,
    countPages,
    moveToPage,
    canMoveNextPage,
    canMovePrevPage,
    items: orders,
    rebuild,
    setItemFields,
    loading: paginationLoading,
    updateItemsParticularly,
  } = usePagination({
    getItemsFunc: (data) => getOrderList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      type: {
        value: type,
        hidden: (value) => value == "worker",
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

    activePay,
    closePay,
    onWorkerPayed,
    activePayOrder,
    successIconPopupState,
  } = useOrderFastActions({
    orders: orders,
    setItemFields,
    updateItemsParticularly,
  });

  const isMobile = useIsMobile();

  return (
    <Wrapper
      type={type}
      changeType={changeType}
      countForWorker={pageProps.countForWorker}
      countForOwner={pageProps.countForOwner}
    >
      <section className="bookings-listings-box listing-area child-nav-tabs-mb-0">
        {!isMobile && (
          <TabHeaderSection
            style={{ marginBottom: "0" }}
            type={type}
            changeType={changeType}
            countForWorker={pageProps.countForWorker}
            countForOwner={pageProps.countForOwner}
          />
        )}

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
        workerBaseCommission={pageProps.workerBaseFee}
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
        onWorkerPayed={onWorkerPayed}
        activePayOrder={activePayOrder}
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
  const type = context.query.type === "owner" ? "owner" : "worker";
  const params = { ...baseListPageParams(context.query), type };
  const options = await getOrderListOptions(params, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Orders" },
  });

export default Orders;

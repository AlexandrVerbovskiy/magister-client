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
  countForRenter,
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
              style={{ borderTop: "1px solid #30eded" }}
            >
              <div className="py-1" onClick={() => changeType("renter")}>
                <div
                  className="form-check px-0"
                  style={type == "renter" ? { color: "var(--mainColor)" } : {}}
                >
                  <label className="form-check-label">
                    Renting ({countForRenter})
                  </label>
                </div>
              </div>

              <div className="py-1" onClick={() => changeType("owner")}>
                <div
                  className="form-check px-0"
                  style={type == "owner" ? { color: "var(--mainColor)" } : {}}
                >
                  <label className="form-check-label">
                    Hosting ({countForOwner})
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
  countForRenter,
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
        changeType("renter");
      }}
    >
      <a className={`nav-link ${type == "renter" ? "active" : ""}`}>
        <span className="menu-title">
          Renting ({countForRenter})
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
          Hosting ({countForOwner})
        </span>
      </a>
    </li>
  </ul>
);

const Orders = (pageProps) => {
  const router = useRouter();
  const { error, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(router.query.type ?? "renter");

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
        hidden: (value) => value == "renter",
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
    onRenterPayed,
    activePayOrder,
    successIconPopupState,

    handleClickFinish,
    handleAcceptFinish,
    activeFinish,
    closeFinish,

    handleClickAcceptFinish,
    handleAcceptAcceptFinish,
    activeAcceptFinish,
    closeAcceptFinish,
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
      countForRenter={pageProps.countForRenter}
      countForOwner={pageProps.countForOwner}
    >
      <section className="bookings-listings-box listing-area child-nav-tabs-mb-0">
        {!isMobile && (
          <TabHeaderSection
            style={{ marginBottom: "0" }}
            type={type}
            changeType={changeType}
            countForRenter={pageProps.countForRenter}
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
                      handleClickFinish={handleClickFinish}
                      handleClickAcceptFinish={handleClickAcceptFinish}
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
        renterBaseCommission={pageProps.renterBaseFee}
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
        onRenterPayed={onRenterPayed}
        activePayOrder={activePayOrder}
        successIconPopupState={successIconPopupState}
        bankInfo={pageProps.bankInfo}
        handleAcceptFinish={handleAcceptFinish}
        activeFinish={activeFinish}
        closeFinish={closeFinish}
        handleAcceptAcceptFinish={handleAcceptAcceptFinish}
        activeAcceptFinish={activeAcceptFinish}
        closeAcceptFinish={closeAcceptFinish}
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
  const type = context.query.type === "owner" ? "owner" : "renter";
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

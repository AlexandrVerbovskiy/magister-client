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
import Pagination from "../../../components/Pagination";
import OrdersListFastActinsModals from "../../../components/Order/OrdersListFastActinsModals";
import ImagePopup from "../../../components/_App/ImagePopup";
import OrderExtendApprovementSection from "../../../components/Order/OrderExtendApprovementSection";

const Wrapper = ({ children }) => {
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
  const { error, success, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(router.query.type ?? "tenant");
  const [currentOpenImg, setCurrentOpenImg] = useState(null);

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
    isFirstBookingCall,
    setItemFields,
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
    activeFastCancelOrder,
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
    closePay,
    onTenantPayed,
    activePayOrder,

    handleClickExtendOrder,
    handleClickApproveExtendOrder,
    extendModalActive,
    extendModalActiveOrder,
    extendModalApproveActive,
    extendModalApproveData,
    closeExtendOrder,
    closeApproveExtendOrder,
    acceptApproveExtendOrder,

    successIconPopupState,
  } = useOrderFastActions({ orders: orders, setItemFields });

  if (extendModalApproveActive && extendModalApproveData.order) {
    return (
      <Wrapper>
        <OrderExtendApprovementSection
          handleApprove={acceptApproveExtendOrder}
          setCurrentOpenImg={setCurrentOpenImg}
          listing={{
            listingImages: extendModalApproveData.order.images,
            name: extendModalApproveData.order.listingName,
            userName: extendModalApproveData.order.ownerName,
            userPhoto: extendModalApproveData.order.ownerPhoto,
            userCountItems:
              extendModalApproveData.order.listingCountStoredItems,
          }}
          handleGoBack={closeApproveExtendOrder}
          fromDate={extendModalApproveData.fromDate}
          toDate={extendModalApproveData.toDate}
          price={extendModalApproveData.price}
          fee={pageProps.tenantBaseFee}
        />

        <ImagePopup
          photoUrl={currentOpenImg}
          open={currentOpenImg}
          close={() => setCurrentOpenImg(null)}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {((!isFirstBookingCall && orders.length < 1) ||
        (isFirstBookingCall && pageProps.items.length < 1)) && (
        <section className="listing-area">
          <TabHeaderSection
            style={{ marginBottom: "0" }}
            type={type}
            changeType={changeType}
            countForTenant={pageProps.countForTenant}
            countForOwner={pageProps.countForOwner}
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
              style={{ marginBottom: "0" }}
              type={type}
              changeType={changeType}
              countForTenant={pageProps.countForTenant}
              countForOwner={pageProps.countForOwner}
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
                      link={`/dashboard/orders`}
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
                      handleClickExtend={handleClickExtendOrder}
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
            tenantBaseCommission={pageProps.tenantBaseFee}
            activeCancel={activeCancel}
            closeActiveCancel={closeActiveCancel}
            handleAcceptCancel={handleAcceptCancel}
            activeFastCancel={activeFastCancel}
            closeActiveFastCancel={closeActiveFastCancel}
            handleAcceptPayedFastCancel={handleAcceptPayedFastCancel}
            activeFastCancelOrder={activeFastCancelOrder}
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
            closePay={closePay}
            onTenantPayed={onTenantPayed}
            activePayOrder={activePayOrder}
            tenantCancelFee={tenantCancelFee}
            handleClickExtendOrder={handleClickExtendOrder}
            handleClickApproveExtendOrder={handleClickApproveExtendOrder}
            extendModalActive={extendModalActive}
            extendModalActiveOrder={extendModalActiveOrder}
            extendModalApproveActive={extendModalApproveActive}
            extendModalApproveData={extendModalApproveData}
            closeExtendOrder={closeExtendOrder}
            closeApproveExtendOrder={closeApproveExtendOrder}
            successIconPopupState={successIconPopupState}
          />
        </>
      )}
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

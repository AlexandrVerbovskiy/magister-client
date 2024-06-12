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
import OrderItem from "../../../components/Order/OrderItem";
import Pagination from "../../../components/Pagination";
import OrdersListFastActinsModals from "../../../components/Order/OrdersListFastActinsModals";
import OrderExtendApprovementSection from "../../../components/Order/OrderExtendApprovementSection";
import ImagePopup from "../../../components/_App/ImagePopup";
import CreateDisputeSection from "../../../components/Dispute/CreateDisputeSection";

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

const Wrapper = ({ children }) => {
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

        {children}
      </div>
    </>
  );
};

const MyBookings = (pageProps) => {
  const router = useRouter();
  const { error, sessionUser, authToken } = useContext(IndiceContext);
  const [currentOpenImg, setCurrentOpenImg] = useState(null);

  const [type, setType] = useState(router.query.type ?? "tenant");

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
    isFirstCall: isFirstBookingCall,
    setItemFields,
  } = usePagination({
    getItemsFunc: (data) => getBookingListOptions(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
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

    closeDisputeWindow,
    disputeWindowActive,
    disputeCreate,
    createDisputeData,
    onCreateDispute,
  } = useOrderFastActions({ orders: bookings, setItemFields });

  const changeType = (value) => {
    setType(value);
    rebuild({ type: value });
  };

  if (extendModalApproveActive && extendModalApproveData.order) {
    return (
      <Wrapper>
        <OrderExtendApprovementSection
          handleApprove={acceptApproveExtendOrder}
          setCurrentOpenImg={setCurrentOpenImg}
          listing={{
            listingImages: closeApproveExtendOrder.order.listingImages,
            name: closeApproveExtendOrder.order.listingName,
            userName: closeApproveExtendOrder.order.ownerName,
            userPhoto: closeApproveExtendOrder.order.ownerPhoto,
            userCountItems:
              closeApproveExtendOrder.order.listingCountStoredItems,
          }}
          handleGoBack={closeApproveExtendOrder}
          fromDate={closeApproveExtendOrder.fromDate}
          toDate={closeApproveExtendOrder.toDate}
          price={closeApproveExtendOrder.price}
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

  if (disputeWindowActive) {
    return (
      <CreateDisputeSection
        {...createDisputeData}
        onGoBack={closeDisputeWindow}
        setCurrentOpenImg={setCurrentOpenImg}
        onSubmit={onCreateDispute}
      />
    );
  }

  return (
    <Wrapper>
      {((!isFirstBookingCall && bookings.length < 1) ||
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
            <div className="no-listing-text">You have no bookings yet</div>
          </div>
        </section>
      )}

      {bookings.length > 0 && (
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
                  {bookings.map((booking) => (
                    <OrderItem
                      filterType={type}
                      key={booking.id}
                      order={booking}
                      link={`/dashboard/bookings`}
                      handleClickCancel={handleClickCancel}
                      handleClickPayedFastCancel={handleClickPayedFastCancel}
                      handleClickUpdateRequest={handleClickUpdateRequest}
                      handleClickReject={handleClickReject}
                      handleClickAccept={handleClickAccept}
                      handleClickPay={handleClickPay}
                      handleClickExtend={handleClickExtendOrder}
                      handleDisputeCreate={disputeCreate}
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
  const options = await getBookingListOptions(params, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default MyBookings;

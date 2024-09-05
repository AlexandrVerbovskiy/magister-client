import Link from "next/link";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../components/_App/NavbarThree";
import {
  getRecipientPaymentList,
  getSenderPaymentList,
  getWalletInfoOptions,
} from "../../services";
import { authSideProps } from "../../middlewares";
import {
  calculateFeeByDaysCount,
  calculateTotalPriceByDaysCount,
  getFactOrderDays,
  moneyFormat,
  dateConverter,
  moneyFormatVisual,
} from "../../utils";
import { IndiceContext } from "../../contexts";
import { useContext } from "react";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks";
import EmptyTable from "../../components/DashboardComponents/Table/EmptyTable";
import PaginationLoadingWrapper from "../../components/_App/PaginationLoadingWrapper";
import STATIC from "../../static";

const Wallet = ({
  totalPayed,
  totalGet,
  feeInfo,
  totalOrders,
  senderPaymentInfo,
  recipientPaymentInfo,
}) => {
  const { error, authToken } = useContext(IndiceContext);

  const {
    page: earningsPage,
    countPages: earningsCountPages,
    moveToPage: earningsMoveToPage,
    canMoveNextPage: canEarningsMoveNextPage,
    canMovePrevPage: canEarningsMovePrevPage,
    items: earnings,
    loading: earningsLoading,
  } = usePagination({
    getItemsFunc: (data) => getRecipientPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: recipientPaymentInfo,
  });

  const {
    page: sendingsPage,
    countPages: sendingsCountPages,
    moveToPage: sendingsMoveToPage,
    canMoveNextPage: canSendingsMoveNextPage,
    canMovePrevPage: canSendingsMovePrevPage,
    items: sendings,
    loading: sendingsLoading,
  } = usePagination({
    getItemsFunc: (data) => getSenderPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: senderPaymentInfo,
  });

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>My Expenses</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/">Home</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/">Dashboard</Link>
                </li>
                <li className="item">Wallet</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="stats-card-box">
              <div className="icon-box">
                <i className="bx bx-cart"></i>
              </div>
              <span className="sub-title">Total Owner Orders</span>
              <h3>{totalOrders}</h3>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="stats-card-box">
              <div className="icon-box">
                <i className="bx bx-dollar"></i>
              </div>
              <span className="sub-title">
                Total Earnings{" "}
                <strong className="wallet-currency">
                  {STATIC.CURRENCY_NAME}
                </strong>
              </span>
              <h3>{moneyFormat(totalGet)}</h3>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="stats-card-box">
              <div className="icon-box">
                <i className="bx bxs-badge-dollar"></i>
              </div>
              <span className="sub-title">
                Total Paid{" "}
                <strong className="wallet-currency">
                  {STATIC.CURRENCY_NAME}
                </strong>
              </span>
              <h3>{moneyFormat(totalPayed)}</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="waller-box earnings-box position-relative">
              <h3>
                Earnings{" "}
                <span className="comission-taken">
                  Fee: {feeInfo.ownerBaseCommissionPercent}%
                </span>
              </h3>
              <PaginationLoadingWrapper active={earningsLoading}>
                {earnings.length > 0 ? (
                  <ul>
                    {earnings.map((earning) => {
                      const pricePerDuration = calculateTotalPriceByDaysCount(
                        getFactOrderDays(
                          earning.offerStartDate,
                          earning.offerEndDate
                        ),
                        earning.offerPricePerDay
                      );

                      const feePerDuration = calculateFeeByDaysCount(
                        getFactOrderDays(
                          earning.offerStartDate,
                          earning.offerEndDate
                        ),
                        earning.offerPricePerDay,
                        earning.ownerFee
                      );

                      return (
                        <li key={earning.id}>
                          <a href={"/dashboard/earnings/" + earning.id}>
                            <div className="icon">
                              <i className="bx bx-wallet"></i>
                            </div>
                            <ul>
                              <li>
                                Date: {dateConverter(earning.plannedTime)}
                              </li>
                              <li>Order: #{earning.orderId}</li>
                              <li className="price">
                                {moneyFormatVisual(pricePerDuration)}
                              </li>
                              <li className="fee-price">
                                Fee:
                                {moneyFormatVisual(feePerDuration)}
                              </li>
                              <li className="price">
                                Net Earning:{" "}
                                <strong>
                                  {moneyFormatVisual(earning.money)}
                                </strong>
                              </li>
                              {earning.receivedType == "refund" &&
                                earning.status == "failed" && (
                                  <li className="rejected">
                                    <strong>Failed</strong>
                                  </li>
                                )}
                              {(earning.status == "waiting" ||
                                (earning.receivedType != "refund" &&
                                  earning.status == "failed")) && (
                                <li className="waiting">
                                  <strong>Waiting</strong>
                                </li>
                              )}
                              {earning.status == "completed" && (
                                <li className="completed">
                                  <strong>Completed</strong>
                                </li>
                              )}
                              {earning.status == "cancelled" && (
                                <li className="cancelled">
                                  <strong>Cancelled</strong>
                                </li>
                              )}
                            </ul>
                            <span>{earning.listingName}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div style={{ paddingBottom: "50px" }}>
                    <EmptyTable entityName="earnings" />
                  </div>
                )}
              </PaginationLoadingWrapper>
            </div>
            <Pagination
              viewOnlyMoreOnePage={true}
              page={earningsPage}
              countPages={earningsCountPages}
              move={earningsMoveToPage}
              canNext={canEarningsMoveNextPage}
              canPrev={canEarningsMovePrevPage}
            />
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="waller-box earnings-box position-relative">
              <h3>
                Payout History{" "}
                <span className="comission-taken">
                  Fee: {feeInfo.tenantBaseCommissionPercent}%
                </span>
              </h3>

              <PaginationLoadingWrapper active={sendingsLoading}>
                {sendings.length > 0 ? (
                  <ul>
                    {sendings.map((sending) => {
                      const pricePerDuration = calculateTotalPriceByDaysCount(
                        getFactOrderDays(
                          sending.offerStartDate,
                          sending.offerEndDate
                        ),
                        sending.offerPricePerDay
                      );

                      const feePerDuration = calculateFeeByDaysCount(
                        getFactOrderDays(
                          sending.offerStartDate,
                          sending.offerEndDate
                        ),
                        sending.offerPricePerDay,
                        sending.tenantFee,
                        true
                      );

                      return (
                        <li key={sending.id} style={{ cursor: "pointer" }}>
                          <a href={"/dashboard/invoices/" + sending.id}>
                            <div className="icon">
                              <i className="bx bx-cart"></i>
                            </div>
                            <ul>
                              <li>Date: {dateConverter(sending.createdAt)}</li>
                              <li>Order: #{sending.orderId}</li>
                              <li className="price">
                                {moneyFormatVisual(pricePerDuration)}
                              </li>
                              <li className="fee-price">
                                Fee: {moneyFormatVisual(feePerDuration)}
                              </li>
                              <li className="price">
                                Net Paid:{" "}
                                <strong>
                                  {moneyFormatVisual(sending.money)}
                                </strong>
                              </li>
                              {!sending.adminApproved &&
                                sending.waitingApproved && (
                                  <li className="waiting">
                                    <strong>Unapproved</strong>
                                  </li>
                                )}
                              {!sending.adminApproved &&
                                !sending.waitingApproved && (
                                  <li className="rejected">
                                    <strong>Rejected</strong>
                                  </li>
                                )}
                              {sending.adminApproved && (
                                <li className="completed">
                                  <strong>Completed</strong>
                                </li>
                              )}
                            </ul>
                            <span>{sending.listingName}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div style={{ paddingBottom: "50px" }}>
                    <EmptyTable
                      imgSrc="/images/claim-your-business.png"
                      entityName="payouts"
                    />
                  </div>
                )}
              </PaginationLoadingWrapper>
            </div>

            <Pagination
              viewOnlyMoreOnePage={true}
              page={sendingsPage}
              countPages={sendingsCountPages}
              move={sendingsMoveToPage}
              canNext={canSendingsMoveNextPage}
              canPrev={canSendingsMovePrevPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getWalletInfoOptions(baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Wallet" },
  });

export default Wallet;

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
  calculateFullTotalByDaysCount,
  calculateTotalPriceByDaysCount,
  getDaysDifference,
  moneyFormat,
  timeConverter,
} from "../../utils";
import { IndiceContext } from "../../contexts";
import { useContext } from "react";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks";
import { useRouter } from "next/router";

const Wallet = ({
  totalPayed,
  totalGet,
  feeInfo,
  totalOrders,
  senderPaymentInfo,
  recipientPaymentInfo,
}) => {
  const { error, authToken } = useContext(IndiceContext);
  const router = useRouter();

  const {
    page: earningsPage,
    countPages: earningsCountPages,
    moveToPage: earningsMoveToPage,
    canMoveNextPage: canEarningsMoveNextPage,
    canMovePrevPage: canEarningsMovePrevPage,
    items: earnings,
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
  } = usePagination({
    getItemsFunc: (data) => getSenderPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: senderPaymentInfo,
  });

  const onSendingCLick = (id) => {
    router.push("/dashboard/invoices/" + id);
  };

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
            <li className="item">Wallet</li>
          </ol>
        </div>

        <div className="row jistify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="stats-card-box">
              <div className="icon-box">
                <i className="bx bxs-badge-dollar"></i>
              </div>
              <span className="sub-title">
                Withdrawable Balance{" "}
                <strong className="wallet-currency">USD</strong>
              </span>
              <h3>{moneyFormat(totalPayed)}</h3>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="stats-card-box">
              <div className="icon-box">
                <i className="bx bx-dollar"></i>
              </div>
              <span className="sub-title">
                Total Earnings <strong className="wallet-currency">USD</strong>
              </span>
              <h3>{moneyFormat(totalGet)}</h3>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="stats-card-box">
              <div className="icon-box">
                <i className="bx bx-cart"></i>
              </div>
              <span className="sub-title">Total Orders</span>
              <h3>{totalOrders < 10 ? "0" + totalOrders : totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="earnings-box">
              <h3>
                Earnings{" "}
                <span className="comission-taken">
                  Fee: {feeInfo.ownerBaseCommissionPercent}%
                </span>
              </h3>
              <ul>
                {earnings.map((earning) => {
                  const pricePerDuration = calculateTotalPriceByDaysCount(
                    getDaysDifference(
                      earning.offerStartDate,
                      earning.offerEndDate
                    ),
                    earning.offerPricePerDay
                  );

                  const feePerDuration = calculateFeeByDaysCount(
                    getDaysDifference(
                      earning.offerStartDate,
                      earning.offerEndDate
                    ),
                    earning.offerPricePerDay,
                    earning.ownerFee
                  );

                  return (
                    <li key={earning.id}>
                      <div className="icon">
                        <i className="bx bx-wallet"></i>
                      </div>
                      <ul>
                        <li>Date: {timeConverter(earning.createdAt)}</li>
                        <li>Order: #{earning.orderId}</li>
                        <li className="price">
                          ${moneyFormat(pricePerDuration)}
                        </li>
                        <li className="fee-price">
                          Fee: ${moneyFormat(feePerDuration)}
                        </li>
                        <li className="price">
                          Net Earning:{" "}
                          <strong>${moneyFormat(earning.money)}</strong>
                        </li>
                      </ul>
                      <span>{earning.listingName}</span>
                    </li>
                  );
                })}
              </ul>
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
          <div className="col-lg-6 col-md-12 mt-4 mt-md-0">
            <div className="earnings-box">
              <h3>
                Payout History{" "}
                <span className="comission-taken">
                  Fee: {feeInfo.tenantBaseCommissionPercent}%
                </span>
              </h3>
              <ul>
                {sendings.map((sending) => {
                  const pricePerDuration = calculateTotalPriceByDaysCount(
                    getDaysDifference(
                      sending.offerStartDate,
                      sending.offerEndDate
                    ),
                    sending.offerPricePerDay
                  );

                  const feePerDuration = calculateFeeByDaysCount(
                    getDaysDifference(
                      sending.offerStartDate,
                      sending.offerEndDate
                    ),
                    sending.offerPricePerDay,
                    sending.tenantFee
                  );

                  return (
                    <li
                      key={sending.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => onSendingCLick(sending.id)}
                    >
                      <div className="icon">
                        <i className="bx bx-cart"></i>
                      </div>
                      <ul>
                        <li>Date: {timeConverter(sending.createdAt)}</li>
                        <li>Order: #{sending.orderId}</li>
                        <li className="price">
                          ${moneyFormat(pricePerDuration)}
                        </li>
                        <li className="fee-price">
                          Fee: ${moneyFormat(feePerDuration)}
                        </li>
                        <li className="price">
                          Net Payed:{" "}
                          <strong>${moneyFormat(sending.money)}</strong>
                        </li>
                      </ul>
                      <span>{sending.listingName}</span>
                    </li>
                  );
                })}
              </ul>
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
  authSideProps(context, boostServerSideProps);

export default Wallet;

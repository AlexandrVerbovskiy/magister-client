import { authSideProps } from "../../../middlewares";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import Link from "next/link";
import { getWaitingRefundOptions } from "../../../services";
import EarningTable from "../../../components/Dashboard/Earning/EarningTable";
import { useIdPage } from "../../../hooks";

const Earning = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getWaitingRefundOptions(field, authToken),
  });

  const { recipient, refundCommission } = props;

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>Earning #{recipient.id}</h1>
              <ol className="breadcrumb">
                <li className="item">
                  <Link href="/">Home</Link>
                </li>
                <li className="item">
                  <Link href="/dashboard/">Dashboard</Link>
                </li>
                <li className="item">
                  <Link href={`/dashboard/wallet/`}>Wallet</Link>
                </li>
                <li className="item">Earning #{recipient.id}</li>
              </ol>
            </div>
          </div>
        </div>

        <EarningTable {...recipient} refundCommission={refundCommission} />
      </div>
    </>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getWaitingRefundOptions(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: `Earnings #${id}` };
};

export const getServerSideProps = (context) =>
  authSideProps({ context, callback: boostServerSideProps });

export default Earning;

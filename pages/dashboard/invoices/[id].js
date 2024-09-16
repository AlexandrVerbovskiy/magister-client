import InvoiceTable from "../../../components/Dashboard/Invoice/InvoiceTable";
import { authSideProps } from "../../../middlewares";
import { getOrderInvoiceOptions } from "../../../services";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import Link from "next/link";
import { useIdPage } from "../../../hooks";
import STATIC from "../../../static";

const Invoice = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderInvoiceOptions(field, authToken),
  });

  const { payment } = props;

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>Invoice #Inv-{payment.orderId}</h1>
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
                <li className="item">Invoice #Inv-{payment.orderId}</li>
              </ol>
            </div>
          </div>
        </div>

        <InvoiceTable
          billTo={payment.listingAddress ?? payment.listingCity}
          shipTo={payment.listingAddress ?? payment.listingCity}
          invoiceId={payment.id}
          invoiceDate={payment.createdAt}
          purchaseOrderId={payment.orderId}
          dueDate={payment.createdAt}
          indiceAdmin="RentAbout"
          offer={{
            fee: payment.tenantFee,
            listingName: payment.listingName,
            pricePerDay: payment.orderOfferPricePerDay,
            startDate: payment.orderOfferStartDate,
            endDate: payment.orderOfferEndDate,
          }}
          waitingApproved={payment.waitingApproved}
          adminApproved={payment.adminApproved}
          failedDescription={payment.failedDescription}
          canUpdate={
            !payment.disputeStatus &&
            !payment.orderCancelStatus &&
            payment.orderStatus == STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT
          }
        />
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderInvoiceOptions(id, baseSideProps.authToken);
  return { ...options, pageTitle: `Invoice #${id}` };
};

export const getServerSideProps = (context) =>
  authSideProps({ context, callback: boostServerSideProps });

export default Invoice;

import { useContext } from "react";
import { IndiceContext } from "../../../contexts";
import InvoiceTable from "../../../components/Dashboard/Invoice/InvoiceTable";
import { authSideProps } from "../../../middlewares";
import { getOrderInvoiceOptions } from "../../../services";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import Link from "next/link";
import { fullTimeConverter } from "../../../utils";

const Invoice = ({ payment }) => {
  const { success, authToken, error } = useContext(IndiceContext);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

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
              <Link href={`/dashboard/wallet`}>Wallet</Link>
            </li>
            <li className="item">Invoice #Inv-{payment.orderId}</li>
          </ol>
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
        />
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderInvoiceOptions(id, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Invoice;

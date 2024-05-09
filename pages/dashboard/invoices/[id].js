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
  console.log(payment);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Invoice #Inv-{payment.id}</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/">Home</Link>
            </li>
            <li className="item">
              <Link href="/dashboard/">Dashboard</Link>
            </li>
            <li className="item">
              <Link href={`/dashboard/orders/${payment.orderId}`}>
                Order #{payment.orderId}
              </Link>
            </li>
            <li className="item">Invoice #Inv-{payment.id}</li>
          </ol>
        </div>

        <InvoiceTable
          billTo={payment.listingAddress ?? payment.listingCity}
          shipTo={payment.listingAddress ?? payment.listingCity}
          invoiceId={`Inv-${payment.id}`}
          invoiceDate={payment.createdAt}
          purchaseOrder="?"
          dueDate={payment.createdAt}
          indiceAdmin="?"
          offer={{
            factTotalPrice: payment.orderFactTotalPrice,
            fee: payment.orderFee,
            listingName: payment.listingName,
            pricePerDay: payment.orderOfferPricePerDay,
            startDate:payment.orderOfferStartDate,
            endDate:payment.orderOfferEndDate,
          }}
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

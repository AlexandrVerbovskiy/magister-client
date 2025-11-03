import React, { useContext, useState } from "react";
import {
  downloadFileUrl,
  renterPaysCalculate,
  dateConverter,
  moneyFormatVisual,
  renterPaysFeeCalculate,
  getPriceByDays,
} from "../../../utils";
import Link from "next/link";
import { generateSenderInvoicePdf } from "../../../services/senderPaymentRequests";
import { IndiceContext } from "../../../contexts";

const Status = ({ adminApproved, waitingApproved }) => {
  let statusName = "Completed";
  let className = "status-background-green";

  if (!adminApproved) {
    statusName = waitingApproved ? "Unapproved" : "Rejected";
    className = waitingApproved
      ? "status-background-orange"
      : "status-background-red";
  }

  return (
    <div
      className={`small-text bookings-status order-item-status ${className}`}
      style={{ marginLeft: "10px" }}
    >
      {statusName}
    </div>
  );
};

const InvoiceTable = ({
  billTo,
  shipTo,
  invoiceId,
  invoiceDate,
  purchaseOrderId,
  dueDate,
  indiceAdmin,
  offer,
  waitingApproved,
  adminApproved,
  failedDescription,
  canUpdate,
}) => {
  const { authToken, error } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);

  const subTotalPrice = getPriceByDays(offer.price);
  const totalFee = renterPaysFeeCalculate(subTotalPrice, offer.fee);

  const handlePdfDownload = async () => {
    try {
      if (disabled) {
        return;
      }

      setDisabled(true);
      const fileUrl = await generateSenderInvoicePdf(invoiceId, authToken);
      downloadFileUrl(fileUrl, purchaseOrderId);
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const PdfDownloadButton = () => (
    <a className="default-btn" onClick={handlePdfDownload} disabled={disabled}>
      <i className="bx bx-printer"></i> Print
    </a>
  );

  const totalPayed = renterPaysCalculate(
    getPriceByDays(offer.price, offer.startDate, offer.finishDate),
    offer.fee
  );

  return (
    <>
      <div className="invoice-area">
        <div className="invoice-header d-flex justify-content-between">
          <div className="invoice-left-text">
            <h3 className="mb-0" style={{ display: "flex" }}>
              Indice Admin{" "}
              <Status
                adminApproved={adminApproved}
                waitingApproved={waitingApproved}
              />
            </h3>
            <p className="mt-2 mb-0">{indiceAdmin ?? "-"}</p>
          </div>
          <div className="invoice-right-text">
            <h3 className="mb-0 text-uppercase">Invoice</h3>
          </div>
        </div>

        <div className="invoice-middle">
          <div className="row">
            <div className="col-lg-3">
              <div className="text">
                <h4 className="mb-2">Bill To</h4>
                <span className="d-block mb-1">{billTo ?? "-"}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="text">
                <h4 className="mb-2">Ship To</h4>
                <span className="d-block mb-1">{shipTo ?? "-"}</span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="text text-right">
                <h5>
                  Invoice # <sub>Inv-{purchaseOrderId}</sub>
                </h5>
                <h5>
                  Invoice Date #{" "}
                  <sub>{invoiceDate ? dateConverter(invoiceDate) : "-"}</sub>
                </h5>
                <h5>
                  P.O #{" "}
                  <sub>
                    <Link
                      style={{ color: "inherit" }}
                      href={`/dashboard/orders/${purchaseOrderId}/`}
                    >
                      Ord-{purchaseOrderId ?? "-"}
                    </Link>
                  </sub>
                </h5>
                <h5 className="mb-0">
                  Due Date # <sub>{dueDate ? dateConverter(dueDate) : "-"}</sub>
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-table table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Per Day</th>
                <th>Order duration</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>{offer.listingName}</td>
                <td className="text-right">{moneyFormatVisual(offer.price)}</td>
                <td className="text-right">{dateConverter(offer.startDate)} - {dateConverter(offer.finishDate)}</td>
                <td className="text-right">
                  {moneyFormatVisual(subTotalPrice)}
                </td>
              </tr>

              <tr>
                <td className="text-right" colSpan="4">
                  <strong>Subtotal</strong>
                </td>
                <td className="text-right">
                  {moneyFormatVisual(subTotalPrice)}
                </td>
              </tr>
              <tr>
                <td className="text-right" colSpan="4">
                  <strong>Sales Tax {offer.fee}%</strong>
                </td>
                <td className="text-right">{moneyFormatVisual(totalFee)}</td>
              </tr>
              <tr>
                <td className="text-right total" colSpan="4">
                  <strong>Total</strong>
                </td>
                <td className="text-right total-price">
                  <strong>{moneyFormatVisual(totalPayed)}</strong>
                </td>
              </tr>
              <tr>
                <td className="text-right total" colSpan="4">
                  <strong>Paid</strong>
                </td>
                <td className="text-right total-price">
                  <strong>
                    {adminApproved
                      ? moneyFormatVisual(totalPayed)
                      : moneyFormatVisual(0)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {!waitingApproved && !adminApproved && (
          <div
            className="mt-4 alert-dismissible fade show alert alert-danger"
            role="alert"
          >
            {failedDescription}
          </div>
        )}

        {canUpdate && !waitingApproved && !adminApproved ? (
          <div className="invoice-btn-box d-flex justify-content-between">
            <a
              className="default-btn"
              href={`/dashboard/pay-by-bank-transfer/${purchaseOrderId}`}
              disabled={disabled}
            >
              <i className="bx bx-upload" style={{ fontSize: "16px" }}></i>{" "}
              Update
            </a>
            <PdfDownloadButton />
          </div>
        ) : (
          <div className="invoice-btn-box text-right">
            <PdfDownloadButton />
          </div>
        )}
      </div>
    </>
  );
};

export default InvoiceTable;

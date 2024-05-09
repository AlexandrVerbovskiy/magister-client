import React from "react";
import {
  fullTimeConverter,
  getDaysDifference,
  timeConverter,
} from "../../../utils";

const InvoiceTable = ({
  billTo,
  shipTo,
  invoiceId,
  invoiceDate,
  purchaseOrder,
  dueDate,
  indiceAdmin,
  offer,
}) => {
  const subTotalPrice =
    offer.pricePerDay *
    getDaysDifference(offer.startDate, offer.endDate);

  return (
    <>
      <div className="invoice-area">
        <div className="invoice-header d-flex justify-content-between">
          <div className="invoice-left-text">
            <h3 className="mb-0">Indice Admin</h3>
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
                  Invoice # <sub>{invoiceId}</sub>
                </h5>
                <h5>
                  Invoice Date #{" "}
                  <sub>{invoiceDate ? timeConverter(invoiceDate) : "-"}</sub>
                </h5>
                <h5>
                  P.O # <sub>{purchaseOrder ?? "-"}</sub>
                </h5>
                <h5 className="mb-0">
                  Due Date # <sub>{dueDate ? timeConverter(dueDate) : "-"}</sub>
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
                <th>Price Per Day</th>
                <th>Rental duration</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>{offer.listingName}</td>
                <td className="text-right">${offer.pricePerDay}</td>
                <td className="text-right">
                  {offer.startDate == offer.endDate
                    ? timeConverter(offer.startDate)
                    : `${timeConverter(offer.startDate)} - ${timeConverter(
                        offer.endDate
                      )}`}
                </td>
                <td className="text-right">${subTotalPrice.toFixed(2)}</td>
              </tr>

              <tr>
                <td className="text-right" colSpan="4">
                  <strong>Subtotal</strong>
                </td>
                <td className="text-right">${subTotalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="text-right" colSpan="4">
                  <strong>Sales Tax {offer.fee}%</strong>
                </td>
                <td className="text-right">
                  ${((subTotalPrice * offer.fee) / 100).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="text-right total" colSpan="4">
                  <strong>Total</strong>
                </td>
                <td className="text-right total-price">
                  <strong>${offer.factTotalPrice.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="invoice-btn-box text-right">
          <button type="submit" className="default-btn">
            <i className="bx bx-printer"></i> Print
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoiceTable;

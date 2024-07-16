import React from "react";
import { moneyFormat, transactionTableOptions } from "../../utils";

const TransactionAnalyticsTable = ({ title, data }) => {
  const { paypalInfo, bankTransferInfo } = transactionTableOptions({
    data,
  });

  return (
    <div className="chart-card">
      <h3 className="align-items-center text-lg font-semibold d-flex justify-content-between">
        <div>{title}</div>
      </h3>

      <div className="px-3">
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-auto w-100 text-light">
            {/* Table header */}
            <thead className="text-uppercase text-secondary bg-light bg-opacity-50 rounded-sm">
              <tr>
                <th className="px-2 py-4">
                  <div className="fw-semibold text-start">Payment method</div>
                </th>
                <th className="px-2 py-4">
                  <div className="fw-semibold text-center">Transactions</div>
                </th>
                <th className="px-2 py-4">
                  <div className="fw-semibold text-center">Amount</div>
                </th>
                <th className="px-2 py-4">
                  <div className="fw-semibold text-center">Total</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-body font-medium">
              {/* Row */}
              <tr className="border-bottom">
                <td className="px-2 py-4">
                  <div className="d-flex align-items-center">
                    <div className="text-dark d-flex">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "10px" }}
                      >
                        <path
                          d="M9.93016 12.99C10.0302 12.99 12.3502 13.09 13.7302 12.75H13.7402C15.3302 12.36 17.5402 11.24 18.1102 7.58C18.1102 7.58 19.3802 3 13.0802 3H7.67016C7.18016 3 6.76016 3.36 6.68016 3.84L4.38016 18.4C4.33016 18.7 4.57016 18.98 4.87016 18.98H8.30016L9.14016 13.66C9.20016 13.28 9.53016 12.99 9.93016 12.99Z"
                          fill="#64748B"
                        />
                        <path
                          d="M18.9901 8.29004C18.1801 12.02 15.6301 13.99 11.5701 13.99H10.1001L9.07005 20.51C9.03005 20.77 9.23005 21 9.49005 21H11.3901C11.7301 21 12.0301 20.75 12.0801 20.41C12.1601 20.01 12.6001 17.09 12.6901 16.59C12.7401 16.25 13.0401 16 13.3801 16H13.8201C16.6401 16 18.8501 14.85 19.5001 11.54C19.7601 10.2 19.6201 9.10004 18.9901 8.29004Z"
                          fill="#64748B"
                        />
                      </svg>
                      Paypal
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-center">{paypalInfo["count"]}</div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-center text-success">
                    ${moneyFormat(paypalInfo["amount"])}
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-center text-primary">
                    {paypalInfo["total"]}%
                  </div>
                </td>
              </tr>
              {/* Row */}
              <tr className="border-bottom">
                <td className="px-2 py-4">
                  <div className="d-flex align-items-center">
                    <div className="text-dark d-flex">
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 19 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "10px" }}
                      >
                        <path
                          d="M4.5 9H2.5V16H4.5V9ZM10.5 9H8.5V16H10.5V9ZM19 18H0V20H19V18ZM16.5 9H14.5V16H16.5V9ZM9.5 2.26L14.71 5H4.29L9.5 2.26ZM9.5 0L0 5V7H19V5L9.5 0Z"
                          fill="#64748B"
                        />
                      </svg>
                      Bank Transfer
                    </div>
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-center">{bankTransferInfo["count"]}</div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-center text-success">
                    ${moneyFormat(bankTransferInfo["amount"])}
                  </div>
                </td>
                <td className="px-2 py-4">
                  <div className="text-center text-primary">
                    {bankTransferInfo["total"]}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionAnalyticsTable;

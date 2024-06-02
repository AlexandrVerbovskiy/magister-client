const PaypalCheck = ({
  rentalPrice,
  listingName,
  listingId,
  payerEmail,
  payerName,
  payerId,
  sizeType = "small-size",
}) => {

  return (
    <div className={`paypal-check-wrapper ${sizeType}`}>
      <div className="receipt-container">
        <div className="header">
          <img
            src="/images/paypal-logo.png"
            alt="PayPal Logo"
            className="paypal-logo"
          />
        </div>
        <div className="receipt-body">
          <div className="top-section">
            <div className="confirmation">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#00BFA5"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M8 10l4 4 7-7"
                  stroke="#00BFA5"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M12.3 13.5l11-11"
                  stroke="#f6f8f9"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M12 14l11-11"
                  stroke="#00BFA5"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
            <h1>
              You paid <span className="amount">${rentalPrice} USD</span>
            </h1>
            <p>to RentAbout</p>
            <p className="details-link">Details</p>
            <div className="item-details">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80%" }}></th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row">
                    <td className="title">Rent x {listingName}</td>
                    <td className="price">
                      <span className="amount">${rentalPrice}</span>
                      <span className="currency">USD</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80%" }}></th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row item-id">
                    <td className="title">
                      Item #:
                      <span className="amount">{listingId}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="summary">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80%" }}></th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row">
                    <td className="title">Subtotal:</td>
                    <td className="price">
                      <span className="amount">${rentalPrice}</span>
                      <span className="currency">USD</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80%" }}></th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row total">
                    <td className="title">Total:</td>
                    <td className="price">
                      <span className="amount">${rentalPrice}</span>
                      <span className="currency">USD</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bottom-section">
            <div className="payment-info">
              <p>
                <strong>Paid with</strong>
              </p>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: "80%" }}></th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row total">
                    <td className="title">{listingName}</td>
                    <td className="price">
                      <span className="amount">${rentalPrice}</span>
                      <span className="currency">USD</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="merchant-details">
              <p>
                <strong>Merchant details</strong>
              </p>
              <p>RentAbout</p>
            </div>
            <div className="merchant-details">
              <p>
                <strong>Payer details</strong>
              </p>
              <p>{payerId}</p>
              <p>{payerName}</p>
              <p>{payerEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaypalCheck;

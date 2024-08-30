import Link from "next/link";
import STATIC from "../../static";
import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import { paypalCreateOrder, paypalOrderPayed } from "../../services";
import PaypalButton from "../PaypalButton";
import PaypalForm from "../PaypalForm";
import { moneyFormatVisual } from "../../utils";

const getPaymentFormStyles = (type) => {
  switch (type) {
    case STATIC.PAYMENT_TYPES.CREDIT_CARD:
      return { height: "calc(130px + 1.875rem)", overflow: "hidden" };
    case STATIC.PAYMENT_TYPES.PAYPAL:
      return { height: "50px" };
    default: {
    }
  }
};

const PaymentSection = ({
  onTenantPayed,
  orderId,
  disabled,
  setDisabled,
  bankInfo,
  authToken,
  amount,
  cardClassName = "",
}) => {
  const { error } = useContext(IndiceContext);
  const [type, setType] = useState(STATIC.PAYMENT_TYPES.PAYPAL);

  const onApprove = async (data, err) => {
    try {
      const result = await paypalOrderPayed(data.orderID, authToken);
      onTenantPayed(result);
    } catch (e) {
      error.set(e.message);
    }
  };

  const createOrder = async (data, paymentType) => {
    try {
      return await paypalCreateOrder({ orderId, type: paymentType }, authToken);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleChangeType = (type) => {
    if (disabled) {
      return;
    }

    setType(type);
  };

  return (
    <div className={"card " + cardClassName}>
      <div className="card-body">
        <div
          className="payment-box p-0 mt-0 mb-2"
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <div className="payment-method">
            <p
              style={{
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="paypal-radio"
                name="radio-group"
                checked={type === STATIC.PAYMENT_TYPES.PAYPAL}
                readOnly={true}
              />
              <label
                style={{
                  marginBottom: 0,
                  display: "inline",
                }}
                onClick={() => handleChangeType(STATIC.PAYMENT_TYPES.PAYPAL)}
                htmlFor="paypal-radio"
              >
                PayPal
              </label>
            </p>

            <p
              style={{
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="bank-card-radio"
                name="radio-group"
                checked={type === STATIC.PAYMENT_TYPES.CREDIT_CARD}
                readOnly={true}
              />
              <label
                style={{
                  marginBottom: 0,
                  display: "inline",
                }}
                onClick={() =>
                  handleChangeType(STATIC.PAYMENT_TYPES.CREDIT_CARD)
                }
                htmlFor="bank-card-radio"
              >
                Bank Card
              </label>
            </p>

            <p
              style={{
                marginBottom: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="direct-bank-transfer-radio"
                name="radio-group"
                checked={type === STATIC.PAYMENT_TYPES.BANK_TRANSFER}
                readOnly={true}
              />
              <label
                style={{
                  marginBottom: 0,
                  display: "inline",
                }}
                onClick={() =>
                  handleChangeType(STATIC.PAYMENT_TYPES.BANK_TRANSFER)
                }
                htmlFor="direct-bank-transfer-radio"
              >
                Direct Bank Transfer
              </label>
            </p>
          </div>
        </div>

        {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
          <div style={{ color: "#666666" }}>
            When making a bank transfer, you will be asked to provide the order
            ID. Your order will not be accepted until the funds are visible in
            your account
          </div>
        )}

        <div
          className="paypal-payment-form mt-2"
          style={getPaymentFormStyles(type)}
        >
          {type == STATIC.PAYMENT_TYPES.PAYPAL &&
            amount &&
            orderId &&
            authToken && (
              <PaypalButton
                createOrder={createOrder}
                onApprove={onApprove}
                amount={amount}
                orderId={orderId}
              />
            )}

          {type == STATIC.PAYMENT_TYPES.CREDIT_CARD &&
            amount &&
            orderId &&
            authToken && (
              <PaypalForm
                disabled={disabled}
                setDisabled={setDisabled}
                createOrder={createOrder}
                onApprove={onApprove}
              />
            )}

          {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
            <div className="payment-form">
              <div className="earnings-box" style={{ marginBottom: "0" }}>
                <h3
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    padding: "0 0 20px",
                    marginLeft: "0",
                    marginRight: "0",
                    marginBottom: "0",
                    marginTop: "0",
                  }}
                >
                  Bank Details{" "}
                </h3>
                <ul>
                  <li
                    style={{
                      padding: "10px 0",
                      background: "white",
                      borderBottom: "0",
                      color: "black",
                      borderTop: "1px solid rgb(204, 204, 204)",
                    }}
                  >
                    <b>Booking:</b> #{orderId}
                  </li>

                  <li
                    style={{
                      padding: "10px 0",
                      background: "white",
                      borderBottom: "0",
                      color: "black",
                    }}
                  >
                    <b>Sort Code: </b>
                    {bankInfo?.bankAccountReferenceConceptCode ?? ""}
                  </li>

                  <li
                    style={{
                      padding: "10px 0",
                      background: "white",
                      borderBottom: "0",
                      color: "black",
                    }}
                  >
                    <b>Account No: </b>
                    {bankInfo?.bankAccountBeneficiary ?? ""}
                  </li>

                  <li
                    style={{
                      padding: "10px 0",
                      background: "white",
                      borderBottom: "0",
                      color: "black",
                    }}
                  >
                    <b>IBAN: </b>
                    {bankInfo?.bankAccountIban ?? ""}
                    {}
                  </li>
                  <li
                    style={{
                      padding: "10px 0",
                      background: "white",
                      borderBottom: "0",
                      color: "black",
                    }}
                  >
                    <b>BIC: </b>
                    {bankInfo?.bankAccountSwiftBic ?? ""}
                    {}
                  </li>

                  <li
                    style={{
                      background: "white",
                      borderBottom: "0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      color: "black",
                      borderTop: "1px solid #CCCCCC",
                    }}
                  >
                    <b>Total Amount to Transfer: </b>
                    <span className="pay-by-card-price">
                      {moneyFormatVisual(amount)}
                    </span>
                  </li>
                </ul>
              </div>

              <Link
                className="pay-by-bank-transfer-link"
                href={"/dashboard/pay-by-bank-transfer/" + orderId}
                type="button"
              >
                Attach Confirmation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;

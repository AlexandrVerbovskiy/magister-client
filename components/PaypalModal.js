import { IndiceContext } from "../contexts";
import { useContext, useState } from "react";
import BaseModal from "./_App/BaseModal";
import { getDaysDifference, moneyFormat, timeNormalConverter } from "../utils";
import PaypalButton from "./PaypalButton";
import PaypalForm from "./PaypalForm";
import { paypalCreateOrder, paypalOrderPayed } from "../services";

const PaypalModal = ({
  amount,
  orderId,
  listingName,
  onTenantPayed,
  pricePerDay,
  offerStartDate,
  offerEndDate,
  offerFee,
  modalActive,
  closeModal,
  authToken,
}) => {
  const { error } = useContext(IndiceContext);

  const onApprove = async (data) => {
    try {
      await paypalOrderPayed(data.orderID, authToken);
      closeModal();
      onTenantPayed();
    } catch (e) {
      error.set(e.message);
    }
  };

  const createOrder = async (data) => {
    try {
      return await paypalCreateOrder(amount, orderId, authToken);
    } catch (e) {
      error.set(e.message);
    }
  };

  const durationInfo =
    timeNormalConverter(offerStartDate) === timeNormalConverter(offerEndDate)
      ? timeNormalConverter(offerStartDate)
      : `${timeNormalConverter(offerStartDate)} - ${timeNormalConverter(
          offerEndDate
        )}`;

  const subtotal =
    pricePerDay * getDaysDifference(offerStartDate, offerEndDate);

  return (
    <BaseModal
      active={modalActive}
      closeModal={closeModal}
      needCloseBtn={true}
      className="modal-padding-bottom-20"
    >
      <span className="sub-title mb-2" style={{ fontSize: "18px" }}>
        <span>Rental payment</span>
      </span>
      <form method="get" onSubmit={(e) => e.preventDefault}>
        <div className="form-group">Listing: {listingName}</div>
        <div className="form-group">
          Price per day: ${moneyFormat(pricePerDay)}
        </div>
        <div className="form-group">Duration: {durationInfo}</div>
        <div className="form-group">Subtotal: ${moneyFormat(subtotal)}</div>
        <div className="form-group">Fee: {offerFee}% </div>
        <div className="form-group">
          <b>
            Total to pay: ${moneyFormat((subtotal * (100 + offerFee)) / 100)}
          </b>
        </div>
        {/*<PaypalButton createOrder={createOrder} onApprove={onApprove} amount={amount} orderId={orderId}/>*/}

        <div className="payment-form">
          {amount && orderId && authToken && (
            <PaypalForm
              createOrder={createOrder}
              onApprove={onApprove}
              amount={amount}
              orderId={orderId}
            />
          )}
        </div>
      </form>
    </BaseModal>
  );
};

export default PaypalModal;

import { IndiceContext } from "../contexts";
import { useContext, useState } from "react";
import BaseModal from "./_App/BaseModal";
import { getDaysDifference, moneyFormat, timeNormalConverter } from "../utils";
import PaypalButton from "./PaypalButton";
import PaypalForm from "./PaypalForm";

const PaypalTriggerModal = ({
  amount,
  createOrderRequest,
  approveOrderRequest,
  authToken,
  orderId,
  listingName,
  onTenantPayed,
  pricePerDay,
  offerStartDate,
  offerEndDate,
  offerFee,
}) => {
  const { error } = useContext(IndiceContext);
  const [modalActive, setModalActive] = useState(false);

  const onApprove = async (data) => {
    try {
      await approveOrderRequest(data.orderID, authToken);
      setModalActive(false);
      onTenantPayed();
    } catch (e) {
      error.set(e.message);
    }
  };

  const createOrder = async (data) => {
    return await createOrderRequest(amount, orderId, authToken);
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
    <>
      <BaseModal
        active={modalActive}
        toggleActive={() => setModalActive(false)}
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
          {/*<PaypalButton createOrder={createOrder} onApprove={onApprove} amount={amount}/>*/}

          <PaypalForm
            createOrder={createOrder}
            onApprove={onApprove}
            amount={amount}
          />
        </form>
      </BaseModal>

      <button
        className="default-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        Pay by Paypal
      </button>
    </>
  );
};

export default PaypalTriggerModal;

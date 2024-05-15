import { useState } from "react";
import PaypalModal from "./PaypalModal";

const PaypalTriggerModal = ({
  amount,
  orderId,
  listingName,
  onTenantPayed,
  pricePerDay,
  offerStartDate,
  offerEndDate,
  offerFee,
  authToken,
}) => {
  const [modalActive, setModalActive] = useState(false);
  return (
    <>
      <PaypalModal
        modalActive={modalActive}
        closeModal={() => setModalActive(false)}
        amount={amount}
        orderId={orderId}
        listingName={listingName}
        onTenantPayed={onTenantPayed}
        pricePerDay={pricePerDay}
        offerStartDate={offerStartDate}
        offerEndDate={offerEndDate}
        offerFee={offerFee}
        authToken={authToken}
      />

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

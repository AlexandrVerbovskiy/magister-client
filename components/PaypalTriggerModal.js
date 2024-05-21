import { useState } from "react";
import PayModal from "./PayModal";

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
  needAutoClose = false,
}) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <PayModal
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
        needAutoClose={needAutoClose}
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

import { useState } from "react";
import BaseModal from "./_App/BaseModal";
import { moneyFormatVisual, renterPaysCalculate } from "../utils";
import PaymentSection from "./_App/PaymentSection";

const PayModal = ({
  amount,
  orderId,
  listingName,
  onRenterPayed = null,
  price,
  offerFee,
  modalActive,
  closeModal,
  authToken,
  bankInfo,
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleRenterPayed = (result) => {
    setTimeout(() => {
      if (onRenterPayed) {
        onRenterPayed(result);
      }

      closeModal();
    }, 100);
  };

  const total = renterPaysCalculate(price, offerFee);

  const handleClose = () => {
    if (disabled) {
      return;
    }

    closeModal();
  };

  return (
    <>
      <BaseModal
        active={modalActive}
        closeModal={handleClose}
        needCloseBtn={true}
        className="modal-padding-bottom-20 modal-margin-bottom-20"
      >
        <div className="card card-shadow">
          <div className="card-body">
            <span className="sub-title mb-2" style={{ fontSize: "18px" }}>
              <span>Renter payment</span>
            </span>
            <div className="form-group">Listing: {listingName}</div>
            <div className="form-group">Price: {moneyFormatVisual(price)}</div>
            <div className="form-group">Fee: {offerFee}% </div>
            <div className="form-group">
              <b>Total to pay: {moneyFormatVisual(total)}</b>
            </div>
          </div>
        </div>

        <PaymentSection
          cardClassName="mt-4 card-shadow"
          onRenterPayed={handleRenterPayed}
          orderId={orderId}
          disabled={disabled}
          setDisabled={setDisabled}
          bankInfo={bankInfo}
          authToken={authToken}
          amount={amount}
        />
      </BaseModal>
    </>
  );
};

export default PayModal;

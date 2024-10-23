import { useState } from "react";
import BaseModal from "./_App/BaseModal";
import {
  getFactOrderDays,
  dateConverter,
  moneyFormatVisual,
  tenantPaymentCalculate,
} from "../utils";
import PaymentSection from "./_App/PaymentSection";

const PayModal = ({
  amount,
  orderId,
  listingName,
  onTenantPayed = null,
  pricePerDay,
  offerStartDate,
  offerEndDate,
  offerFee,
  modalActive,
  closeModal,
  authToken,
  bankInfo,
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleTenantPayed = (result) => {
    setTimeout(() => {
      if (onTenantPayed) {
        onTenantPayed(result);
      }

      closeModal();
    }, 100);
  };

  const durationInfo =
    dateConverter(offerStartDate) === dateConverter(offerEndDate)
      ? dateConverter(offerStartDate)
      : `${dateConverter(offerStartDate)} - ${dateConverter(offerEndDate)}`;

  const subtotal = pricePerDay * getFactOrderDays(offerStartDate, offerEndDate);

  const total = tenantPaymentCalculate(
    offerStartDate,
    offerEndDate,
    offerFee,
    pricePerDay
  );

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
              <span>Rental payment</span>
            </span>
            <div className="form-group">Listing: {listingName}</div>
            <div className="form-group">
              Price: {moneyFormatVisual(pricePerDay)}
            </div>
            <div className="form-group">Duration: {durationInfo}</div>
            <div className="form-group">
              Subtotal: {moneyFormatVisual(subtotal)}
            </div>
            <div className="form-group">Fee: {offerFee}% </div>
            <div className="form-group">
              <b>Total to pay: {moneyFormatVisual(total)}</b>
            </div>
          </div>
        </div>

        <PaymentSection
          cardClassName="mt-4 card-shadow"
          onTenantPayed={handleTenantPayed}
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

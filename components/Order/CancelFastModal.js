import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";
import {
  calculateFullTotalByDaysCount,
  getFactOrderDays,
  moneyFormat,
} from "../../utils";
import STATIC from "../../static";

const CancelFastModal = ({ onCancel, modalActive, closeModal, order }) => {
  const { error } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);

  const handleAcceptCancelOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      await onCancel();
      setDisabled(true);
      closeModal();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  let message = "To confirm the cancellation of the order, click 'Confirm'";
  if (order) {
    const totalPayed = calculateFullTotalByDaysCount(
      getFactOrderDays(order.offerStartDate, order.offerEndDate),
      order.offerPricePerDay,
      order.tenantFee,
      "sum"
    );

    const totalBack = (totalPayed * (100 - order.tenantCancelFee)) / 100;

    message =
      `The cancellation fee is ${
        order.tenantCancelFee
      }% of the full payment. \nYou paid ${STATIC.CURRENCY}${moneyFormat(
        totalPayed
      )}\n. The size of the return cats will be ${STATIC.CURRENCY}${moneyFormat(
        totalBack
      )}. ` + message;
  }

  return (
    <YesNoModal
      active={modalActive}
      closeModal={closeModal}
      title="Cancel order"
      body={message}
      onAccept={handleAcceptCancelOrder}
      acceptText="Confirm"
      closeModalText="Close"
    />
  );
};

export default CancelFastModal;

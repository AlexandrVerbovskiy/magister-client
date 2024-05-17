import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";
import {
  calculateFullTotalByDaysCount,
  getDaysDifference,
  moneyFormat,
} from "../../utils";

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

  let message = "To confirm the cancellation of the order, click the 'Cancel'";
  if (order) {
    const totalPayed = calculateFullTotalByDaysCount(
      getDaysDifference(order.offerStartDate, order.offerEndDate),
      order.offerPricePerDay,
      order.tenantFee,
      "sum"
    );

    const totalBack = (totalPayed * (100 - order.tenantCancelFee)) / 100;

    message =
      `The cancellation fee is ${
        order.tenantCancelFee
      }% of the full payment. \nYou paid $${moneyFormat(
        totalPayed
      )}\n. The size of the return cats will be $${moneyFormat(totalBack)}. ` +
      message;
  }

  return (
    <YesNoModal
      active={modalActive}
      closeModal={closeModal}
      title="Cancel order"
      body={message}
      onAccept={handleAcceptCancelOrder}
      acceptText="Cancel"
      closeModalText="Close"
    />
  );
};

export default CancelFastModal;
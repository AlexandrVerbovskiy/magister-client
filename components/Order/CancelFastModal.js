import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";
import {
  calculateFullTotalByType,
  moneyFormatVisual,
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

  let message = "To confirm the cancellation of the order, click 'Confirm'";
  if (order) {
    const totalPayed = calculateFullTotalByType(
      order.offerPrice,
      order.workerFee,
      "sum"
    );

    const totalBack = (totalPayed * (100 - order.tenantCancelFee)) / 100;

    message =
      `The cancellation fee is ${
        order.tenantCancelFee
      }% of the full payment. \nYou paid ${moneyFormatVisual(
        totalPayed
      )}\n. The size of the return cats will be ${moneyFormatVisual(
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

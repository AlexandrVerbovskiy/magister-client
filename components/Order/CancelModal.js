import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";

const CancelModal = ({ handleCancel, modalActive, closeModal }) => {
  const { error } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);

  const handleAcceptCancelOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      await handleCancel();
      setDisabled(true);
      closeModal();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <YesNoModal
      active={modalActive}
      closeModal={closeModal}
      title="Cancel order"
      body="To confirm the cancellation of the order, click 'Confirm'"
      onAccept={handleAcceptCancelOrder}
      acceptText="Confirm"
      closeModalText="Close"
    />
  );
};

export default CancelModal;

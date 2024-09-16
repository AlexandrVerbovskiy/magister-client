import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";

const FinishOrderModal = ({ onFinish, modalActive, closeModal }) => {
  const [disabled, setDisabled] = useState(false);
  const { error } = useContext(IndiceContext);

  const handleAcceptCancelOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      await onFinish();
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
      title="Finish order"
      body="To confirm the finalization of the order, click 'Finish'"
      onAccept={handleAcceptCancelOrder}
      acceptText="Finish"
      closeModalText="Close"
    />
  );
};

export default FinishOrderModal;

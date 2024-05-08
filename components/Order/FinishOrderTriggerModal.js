import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";

const FinishOrderTriggerModal = ({ onFinish }) => {
  const [modalActive, setModalActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { error } = useContext(IndiceContext);

  const handleAcceptCancelOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      await onFinish();
      setDisabled(true);
      setModalActive(false);
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <YesNoModal
        active={modalActive}
        toggleActive={() => setModalActive(false)}
        title="Finish order"
        body="To confirm the finalization of the order, click the 'Finish'"
        onAccept={handleAcceptCancelOrder}
        acceptText="Finish"
        closeModalText="Close"
      />
      <button
        className="default-btn"
        type="button"
        onClick={() => setModalActive(true)}
        disabled={disabled}
      >
        Finish
      </button>
    </>
  );
};

export default FinishOrderTriggerModal;

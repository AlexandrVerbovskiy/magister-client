import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import { IndiceContext } from "../../contexts";

const CancelTriggerModal = ({ onCancel }) => {
  const [modalActive, setModalActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { error } = useContext(IndiceContext);

  const handleAcceptCancelOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      await onCancel();
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
        title="Cancel order"
        body="To confirm the cancellation of the order, click the 'Cancel'"
        onAccept={handleAcceptCancelOrder}
        acceptText="Cancel"
        closeModalText="Close"
      />
      <button
        className="default-btn error-btn"
        type="button"
        onClick={() => setModalActive(true)}
        disabled={disabled}
      >
        Cancel
      </button>
    </>
  );
};

export default CancelTriggerModal;

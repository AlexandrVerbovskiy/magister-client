import { useState } from "react";
import PayedCancelModal from "./PayedCancelModal";

const PayedCancelTriggerModal = ({ order, onCancel, text = "Cancel" }) => {
  const [modalActive, setModalActive] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <PayedCancelModal
        onCancel={onCancel}
        modalActive={modalActive}
        disabled={disabled}
        setDisabled={setDisabled}
        handleClose={() => setModalActive(false)}
      />
      <button
        className="default-btn error-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        {text}
      </button>
    </>
  );
};

export default PayedCancelTriggerModal;

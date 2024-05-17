import { useState } from "react";
import CancelFastModal from "./CancelFastModal";

const CancelFastTriggerModal = ({ order, onCancel, text = "Cancel" }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <CancelFastModal
        onCancel={onCancel}
        modalActive={modalActive}
        closeModal={() => setModalActive(false)}
        order={order}
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

export default CancelFastTriggerModal;

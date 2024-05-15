import { useState } from "react";
import CancelModal from "./CancelModal";

const CancelTriggerModal = ({ onCancel }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <CancelModal
        onCancel={onCancel}
        modalActive={modalActive}
        closeModal={() => setModalActive(false)}
      />
      <button
        className="default-btn error-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        Cancel
      </button>
    </>
  );
};

export default CancelTriggerModal;

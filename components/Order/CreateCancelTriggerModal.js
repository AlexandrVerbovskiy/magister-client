import { useState } from "react";
import CreateCancelModal from "./CreateCancelModal";

const CreateCancelTriggerModal = ({ onCancelOrder }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <CreateCancelModal
        modalActive={modalActive}
        onCancelOrder={onCancelOrder}
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

export default CreateCancelTriggerModal;

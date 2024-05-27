import { useState } from "react";
import CreateDisputeModal from "./CreateDisputeModal";

const CreateDisputeTriggerModal = ({ onCreateDispute }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <CreateDisputeModal
        modalActive={modalActive}
        onCreateDispute={onCreateDispute}
        closeModal={() => setModalActive(false)}
      />

      <button
        className="default-btn error-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        Create Dispute
      </button>
    </>
  );
};

export default CreateDisputeTriggerModal;

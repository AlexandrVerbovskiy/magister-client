import { useState } from "react";

const FinishOrderTriggerModal = ({ onFinish }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <FinishOrderModal
        modalActive={modalActive}
        setModalActive={setModalActive}
        onFinish={onFinish}
      />
      <button
        className="default-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        Finish
      </button>
    </>
  );
};

export default FinishOrderTriggerModal;

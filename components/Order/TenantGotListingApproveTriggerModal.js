import { useState } from "react";
import TenantGotListingApproveModal from "./TenantGotListingApproveModal";

const TenantGotListingApproveTriggerModal = ({ onApprove }) => {
  const [modalActive, setModalActive] = useState(false);

  return (
    <>
      <button
        className="default-btn"
        type="button"
        onClick={() => setModalActive(true)}
      >
        Approve
      </button>

      <TenantGotListingApproveModal
        onApprove={onApprove}
        modalActive={modalActive}
        closeModal={() => setModalActive(false)}
      />
    </>
  );
};

export default TenantGotListingApproveTriggerModal;

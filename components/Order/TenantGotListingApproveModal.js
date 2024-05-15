import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import YesNoModal from "../_App/YesNoModal";

const TenantGotListingApproveModal = ({
  modalActive,
  closeModal,
  onApprove,
}) => {
  const [disabled, setDisabled] = useState(false);
  const { error } = useContext(IndiceContext);

  const handleTenantGotListingApproveClick = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      closeModal();
      onApprove();
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
      title="Did you actually get the tool?"
      onAccept={handleTenantGotListingApproveClick}
      acceptText="Yes"
      closeModalText="No"
    />
  );
};

export default TenantGotListingApproveModal;

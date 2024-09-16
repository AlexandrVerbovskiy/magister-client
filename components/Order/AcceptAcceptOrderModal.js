import YesNoModal from "../_App/YesNoModal";

const AcceptAcceptOrderModal = ({
  acceptOrderModalActive,
  closeAcceptOrderModal,
  handleAcceptAcceptOrder,
}) => {
  return (
    <YesNoModal
      active={acceptOrderModalActive}
      closeModal={closeAcceptOrderModal}
      title="Operation confirmation"
      body="Confirm that the proposed booking conditions are actually suitable for you"
      onAccept={handleAcceptAcceptOrder}
      acceptText="Accept"
    />
  );
};

export default AcceptAcceptOrderModal;

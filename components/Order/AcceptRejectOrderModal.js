import YesNoModal from "../_App/YesNoModal";

const AcceptRejectOrderModal = ({
  rejectOrderModalActive,
  closeRejectOrderModal,
  handleAcceptRejectOrder,
}) => {
  return (
    <YesNoModal
      active={rejectOrderModalActive}
      closeModal={closeRejectOrderModal}
      title="Operation confirmation"
      body="Confirm that you really want to cancel the booking"
      onAccept={handleAcceptRejectOrder}
      acceptText="Confirm"
    />
  );
};

export default AcceptRejectOrderModal;

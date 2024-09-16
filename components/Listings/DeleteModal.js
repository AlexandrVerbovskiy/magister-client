import YesNoModal from "../_App/YesNoModal";

const DeleteModal = ({
  active,
  closeModal,
  activeListing,
  onAccept,
  listingName,
}) => {
  const title = activeListing
    ? "Confirmation of listing removal"
    : "Confirmation of restoration of listing";

  const body = activeListing
    ? `Are you sure you want to delete the "${listingName}" listing? Users will not be able to rent it`
    : `Are you sure you want to restore the "${listingName}" listing? Users will be able to rent it`;

  return (
    <YesNoModal
      title={title}
      active={active}
      closeModal={closeModal}
      onAccept={onAccept}
      body={body}
      acceptText="Confirm"
      closeModalClassName={activeListing ? "" : "button-danger"}
      acceptModalClassName={activeListing ? "button-danger" : ""}
    />
  );
};

export default DeleteModal;

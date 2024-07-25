import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import YesNoModal from "../YesNoModal";

const AcceptModal = ({ active, close, onAcceptClick }) => {
  const [disabled, setDisabled] = useState(false);
  const { error, success } = useContext(IndiceContext);

  const handleAccept = async () => {
    if (disabled) {
      return;
    }
    
    try {
      setDisabled(true);
      await onAcceptClick();
      success.set("Payment approved successfully");
      close();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <YesNoModal
      title="Accept action"
      body="Are you sure you want to mark the payment as approved?"
      handleCloseModal={close}
      onAccept={handleAccept}
      modalOpen={active}
      disabled={disabled}
      type="success"
    />
  );
};

export default AcceptModal;

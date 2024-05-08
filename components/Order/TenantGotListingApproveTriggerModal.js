import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const TenantGotListingApproveTriggerModal = ({ onApprove }) => {
  const [modalActive, setModalActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {error} = useContext(IndiceContext)

  const handleTenantGotListingApproveClick = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      setModalActive(false);
      onApprove();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <button
        className="default-btn"
        type="button"
        onClick={() => setModalActive(true)}
        disabled={disabled}
      >
        Approve
      </button>

      <YesNoModal
        active={modalActive}
        toggleActive={() => setModalActive(false)}
        title="Did you actually get the tool?"
        onAccept={handleTenantGotListingApproveClick}
        acceptText="Yes"
        closeModalText="No"
      />
    </>
  );
};

export default TenantGotListingApproveTriggerModal;

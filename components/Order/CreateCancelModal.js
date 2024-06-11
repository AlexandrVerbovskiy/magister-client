import { useContext, useState } from "react";
import Textarea from "../DashboardComponents/Textarea";
import BaseModal from "../_App/BaseModal";
import { IndiceContext } from "../../contexts";
import { validateBigText } from "../../utils";

const CreateCancelModal = ({ modalActive, closeModal, onCancelOrder }) => {
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const { error } = useContext(IndiceContext);

  const handleAcceptCreateCancelClick = async () => {
    if (disabled) {
      return;
    }

    let hasError = false;

    if (!description.length) {
      setDescriptionError("Required field");
      hasError = true;
    }

    const resValidateCancelDescription = validateBigText(description);

    if (resValidateCancelDescription !== true) {
      setDescriptionError(resValidateCancelDescription);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await onCancelOrder(description);
      setDisabled(true);
      setDescription("");
    } catch (e) {
      error.set(e.message);
    } finally {
      closeModal();
    }
  };

  return (
      <BaseModal
        active={modalActive}
        closeModal={closeModal}
        needCloseBtn={true}
      >
        <span className="sub-title mb-2">
          <span>Do you really want to cancel order?</span>
        </span>
        <form method="get" onSubmit={(e) => e.preventDefault}>
          <span style={{ fontSize: "14px" }}>
          Specify the reason for canceling the order
          </span>

          <div className="form-group mt-2 mb-4">
            <Textarea
              placeholder="Description..."
              value={description}
              rows="5"
              setValue={setDescription}
              error={descriptionError}
              setError={setDescriptionError}
              name="create-dispute-description"
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="button-danger"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleAcceptCreateCancelClick("email")}
              disabled={disabled}
            >
              Send
            </button>
          </div>
        </form>
      </BaseModal>
  );
};

export default CreateCancelModal;

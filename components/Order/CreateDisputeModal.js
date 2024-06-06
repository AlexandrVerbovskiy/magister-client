import { useContext, useState } from "react";
import Textarea from "../DashboardComponents/Textarea";
import BaseModal from "../_App/BaseModal";
import { IndiceContext } from "../../contexts";
import { validateBigText } from "../../utils";

const CreateDisputeModal = ({ modalActive, closeModal, onCreateDispute }) => {
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const { error } = useContext(IndiceContext);

  const handleAcceptCreateDisputeClick = async () => {
    if (disabled) {
      return;
    }

    let hasError = false;

    if (!description.length) {
      setDescriptionError("Required field");
      hasError = true;
    }

    const resValidateDisputeDescription = validateBigText(description);

    if (resValidateDisputeDescription !== true) {
      setDescriptionError(resValidateDisputeDescription);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await onCreateDispute(description);
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
          <span>Do you really want to start a dispute?</span>
        </span>
        <form method="get" onSubmit={(e) => e.preventDefault}>
          <span style={{ fontSize: "14px" }}>
            It will be resolved with the intervention of administrators who will
            see your correspondence and other information about the order.For
            the better result, describe the dispute in as much detail as
            possible
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
              onClick={() => handleAcceptCreateDisputeClick("email")}
              disabled={disabled}
            >
              Send
            </button>
          </div>
        </form>
      </BaseModal>
  );
};

export default CreateDisputeModal;

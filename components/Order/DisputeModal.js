import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import BaseModal from "../_App/BaseModal";
import STATIC from "../../static";

const options = Object.keys(STATIC.DISPUTE_TYPE_TITLE).map((value) => ({
  title: STATIC.DISPUTE_TYPE_TITLE[value],
  value,
}));

const DisputeModal = ({
  type,
  error: disputeError,
  setError: setDisputeError,
  description,
  handleOpenDispute,
  modalActive,
  closeModal,
  setDescription,
  setType,
}) => {
  const { error } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);

  const handleDescriptionChange = (e) => {
    setDisputeError(null);
    setDescription(e.target.value);
  };

  const handleChangeType = (value) => {
    setDisputeError(null);
    setType(value);
  };

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    try {
      await handleOpenDispute();
      setDisabled(true);
      closeModal();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <BaseModal active={modalActive} closeModal={closeModal}>
      <span className="sub-title mb-2" style={{ fontSize: "20px" }}>
        <span style={{ color: "black" }}>Dispute details</span>
        <p className="comment-notes">What is the dispute reason?</p>
      </span>

      <form>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="form-group">
              <ul className="facilities-list">
                {options.map((option) => (
                  <li key={option.value}>
                    <label className="radio">
                      <input
                        type="radio"
                        name="dispute-type"
                        value={option.value}
                        onChange={() => handleChangeType(option.value)}
                        checked={type == option.value}
                      />
                      <span>{option.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                borderBottom: "1px solid #E8E8E8",
                margin: "20px 0 20px",
              }}
            />

            <div className="form-group">
              <textarea
                placeholder="Explain the reason of the dispute"
                className="form-control"
                cols="30"
                rows="6"
                value={description}
                onInput={handleDescriptionChange}
              ></textarea>
            </div>
          </div>
        </div>

        {disputeError && (
          <div className="w-full form-group mb-0">
            <div className="is-invalid" style={{ marginTop: "-25px" }}>
              <ErrorSpan error={disputeError} />
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          <button onClick={closeModal} disabled={disabled} type="button">
            Close
          </button>

          <button
            onClick={handleSubmit}
            disabled={disabled}
            type="button"
            className="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default DisputeModal;

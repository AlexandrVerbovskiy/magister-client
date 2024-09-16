import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import ModalBlank from "../ModalBlank";

const ApproveModal = ({ active, close, onAcceptClick }) => {
  const { error, success } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);

  const handleApproveAcceptClick = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      await onAcceptClick();
      success.set("Approved successfully");
      close();
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <ModalBlank id="access-accept" modalOpen={active} setModalOpen={close}>
      <div className="p-5 flex space-x-4">
        <div style={{ width: "100%" }}>
          <div className="mb-2">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Are you sure you want to verify this user?
            </div>
          </div>

          <div className="text-sm mb-2">
            <div className="space-y-2">
              <p>
                As soon as you confirm the action, the user will be able to rent
                and rent tools
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-end space-x-2">
            <button
              disabled={disabled}
              onClick={close}
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              disabled={disabled}
              onClick={handleApproveAcceptClick}
              className="btn bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default ApproveModal;

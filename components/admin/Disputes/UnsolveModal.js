import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import ModalBlank from "../ModalBlank";

const UnsolveModal = ({ active, close, onAcceptClick }) => {
  const { error, success } = useContext(IndiceContext);
  const [disabled, setDisabled] = useState(false);

  const handleApproveAcceptClick = async () => {
    if (disabled) {
      return;
    }

    try {
      await onAcceptClick();
      success.set("Unsolved successfully");
      close();
      setDisabled(true);
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
              Are you sure you want to unsolve this dispute?
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
              className="btn bg-rose-500 hover:bg-rose-600 text-white"
            >
              Unsolve
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default UnsolveModal;

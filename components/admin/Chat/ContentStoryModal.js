import { formatTimeWithAmPm } from "../../../utils";
import ModalBlank from "../ModalBlank";

const ContentStoryModal = ({ story, modalOpen, handleCloseModal }) => {
  return (
    <ModalBlank
      id="content-story-modal"
      modalOpen={modalOpen}
      setModalOpen={handleCloseModal}
    >
      <div className="p-5 flex space-x-4">
        <div className="w-full">
          <div className="mb-4">
            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              <span>Edited Message Story</span>
            </div>
          </div>
          {story && (
            <div
              className="text-sm mb-4 border rounded-lg bg-slate-100 space-y-2 p-4"
              style={{ overflow: "auto", height: "400px" }}
            >
              {story.map((data) => (
                <div>
                  <div
                    key={data.contentId ?? data.updatedAt}
                    className={`text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1 w-max`}
                    dangerouslySetInnerHTML={{ __html: data.content.text }}
                  ></div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-medium">
                      {formatTimeWithAmPm(data.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default ContentStoryModal;

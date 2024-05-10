import { useState } from "react";
import Input from "../../../components/admin/Form/Input";
import ModalBlank from "../../../components/admin/ModalBlank";
import ErrorSpan from "../../../components/admin/ErrorSpan";

const DefectListItem = ({ error, name, onChangeName, onDeleteAccept }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <div className="category-list-item">
      <div
        className={
          "shadow rounded-sm border px-5 py-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }
      >
        <div className="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2 gap-x-4">
          <div className="flex items-center space-x-3 md:space-x-4 w-full">
            <div className="flex-col inline-flex text-slate-800 dark:text-slate-100 relative w-full">
              <Input
                inputClassName="form-input w-full"
                value={name}
                name="name"
                label="Name"
                labelClassName="block text-sm font-medium relative-label"
                setValue={onChangeName}
              />
            </div>
          </div>
          <div
            className="flex flex-col sm:flex-row space-x-4 gap-4 items-start sm:items-center sm:justify-between md:justify-start"
            style={{ marginLeft: "0" }}
          >
            <button
              onClick={handleDeleteClick}
              className="text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
              style={{ marginLeft: 0 }}
            >
              <span className="sr-only">Delete</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-x"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#656565"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ModalBlank
        id="access-delete-category-listing-modal"
        modalOpen={modalOpen}
        setModalOpen={() => {
          setModalOpen(false);
          setNewChildCategory(null);
        }}
      >
        <div className="p-5 flex space-x-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
            <svg
              className="w-4 h-4 shrink-0 fill-current text-rose-500"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </div>
          <div className="w-full">
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Delete defect option?
              </div>
            </div>
            <div className="text-sm mb-2">
              <div className="space-y-2">
                <p>
                  Do you really want to remove this defect? It will be removed
                  from all listings where it was listed
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(false);
                }}
              >
                No, Close
              </button>
              <button
                onClick={onDeleteAccept}
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
      {error && <ErrorSpan error={error} />}
    </div>
  );
};

export default DefectListItem;
